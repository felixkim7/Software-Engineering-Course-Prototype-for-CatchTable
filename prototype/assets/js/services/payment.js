// MOCK priority checkout (UC-PB steps 7-11). No processor, no card data. A payment operation is a
// ledger entry: it stores the mock processor's answer (decided when the customer confirms) and
// when it becomes readable. settlePayments() applies due answers in a later command, so a reload
// or a second tab finds the same result instead of charging again.
//
// Offer: OFFERED -> PAYMENT_PENDING -> BOOKED; PAYMENT_PENDING -> PAYMENT_UNKNOWN | RECOVERY_PENDING.
// A known failure returns to OFFERED while the deadline holds, otherwise expires and hands off.
// PAYMENT_UNKNOWN and RECOVERY_PENDING keep the slot HELD past the deadline until resolved.
import { POLICY } from '../core/config.js';
import { commit, getState } from '../core/store.js';
import { now } from '../core/clock.js';
import { endOffer, findOffer, findRequest, findSlot, nextId, offerIsLive } from './allocation.js';
import { notify } from './notification.js';

export const HOLDING = new Set(['PAYMENT_PENDING', 'PAYMENT_UNKNOWN', 'RECOVERY_PENDING']);
export const REQUIRED_CONSENTS = ['refund', 'payment', 'privacy', 'thirdParty'];
const reject = (reason, extra = {}) => ({ ok: false, reason, ...extra });
const iso = (ms) => new Date(ms).toISOString();

/** Deposit = per-person amount x party (capture 171739: 1인당 10,000원 x 2명). */
export const depositFor = (restaurant, partySize) => (restaurant.policies?.depositPerPersonKRW ?? 0) * partySize;
export const findOperation = (state, id) => state.paymentOperations.find((op) => op.id === id) ?? null;
export const findReservation = (state, id) => state.reservations.find((r) => r.id === id) ?? null;
/** The active customer's reservations, soonest first. */
export const customerReservations = (state) => state.reservations.filter((r) => r.customerId === state.meta.activeCustomerId)
  .sort((a, b) => `${a.serviceDate}${a.currentTime}`.localeCompare(`${b.serviceDate}${b.currentTime}`));
export const reservationForOffer = (state, offerId) => state.reservations.find((r) => r.sourceOfferId === offerId) ?? null;
export const operationsForOffer = (state, offerId) => state.paymentOperations.filter((op) => op.offerId === offerId);
/** Charges that actually took money (refunded ones included, for the ledger). */
export const chargesForOffer = (state, offerId) => operationsForOffer(state, offerId).filter((op) => op.status === 'SUCCEEDED' || op.status === 'REFUNDED');

function restaurantOf(state, offer) {
  const slot = findSlot(state, offer.slotId);
  return { slot, restaurant: state.restaurants.find((r) => r.id === slot.restaurantId) };
}

function slotFacts(slot) {
  return { restaurantId: slot.restaurantId, serviceDate: slot.serviceDate, serviceTime: slot.serviceTime, partySize: slot.partySize };
}

/** One reservation per offer; consumes the offer and ends the request (UC-PB step 10). */
function createReservation(state, offer, operation, details, nowMs) {
  const existing = reservationForOffer(state, offer.id);
  if (existing) return existing;
  const { slot } = restaurantOf(state, offer);
  const reservation = {
    id: nextId(state.reservations, 'rv'), customerId: offer.ownerId, restaurantId: slot.restaurantId,
    serviceDate: slot.serviceDate, originalTime: slot.serviceTime, currentTime: slot.serviceTime, partySize: slot.partySize,
    depositKRW: operation?.amountKRW ?? 0, status: 'CONFIRMED', sourceOfferId: offer.id, paymentOperationId: operation?.id ?? null,
    purposes: details.purposes ?? [], requestNote: details.requestNote ?? '', createdAt: iso(nowMs),
  };
  state.reservations.push(reservation);
  Object.assign(offer, { status: 'BOOKED', endedAt: iso(nowMs) });
  Object.assign(findRequest(state, offer.requestId), { status: 'BOOKED', endedAt: iso(nowMs) });
  Object.assign(slot, { status: 'BOOKED', reservationId: reservation.id });
  if (operation) operation.reservationId = reservation.id;
  notify(state, {
    customerId: offer.ownerId, kind: 'BOOKING_CONFIRMED', entityType: 'reservation', entityId: reservation.id,
    data: { ...slotFacts(slot), depositKRW: reservation.depositKRW },
  });
  return reservation;
}

/** After a successful charge: save the reservation, unless the presenter armed a commit failure. */
function commitAfterCharge(state, offer, operation, nowMs) {
  if (state.meta.failNextCommit) {
    state.meta.failNextCommit = false;
    offer.status = 'RECOVERY_PENDING';  // money taken, no reservation yet: hold and recover
    return;
  }
  createReservation(state, offer, operation, operation.details, nowMs);
}

function applyOutcome(state, operation, outcome, nowMs) {
  const offer = findOffer(state, operation.offerId);
  Object.assign(operation, { status: outcome, resolvedAt: iso(nowMs) });
  if (outcome === 'SUCCEEDED') { commitAfterCharge(state, offer, operation, nowMs); return; }
  // Known failure: nothing was charged. Retry while the original deadline holds, else hand off.
  if (nowMs < Date.parse(offer.expiresAt)) offer.status = 'OFFERED';
  else endOffer(state, offer, 'EXPIRED', 'EXPIRED', nowMs);
}

// ---- Customer ----

/**
 * Confirms the owner's live offer (UC-PB step 8). Zero deposit books at once (8b); otherwise a
 * PENDING operation is created. A repeat while one is in progress returns it instead of charging.
 */
export function startCheckout(offerId, details) {
  const nowMs = now();
  let operationId = null;
  let reservationId = null;
  const result = commit((state) => {
    const offer = findOffer(state, offerId);
    if (!offer) return reject('NOT_FOUND');
    if (offer.ownerId !== state.meta.activeCustomerId) return reject('OFFER_NOT_OWNED');
    if (HOLDING.has(offer.status)) return { ok: true, operationId: offer.paymentOperationId, repeated: true };
    if (offer.status === 'BOOKED') return { ok: true, reservationId: reservationForOffer(state, offerId)?.id, repeated: true };
    if (offer.status !== 'OFFERED') return reject('OFFER_ENDED');
    if (!offerIsLive(offer, nowMs)) return reject('OFFER_EXPIRED');
    if (!REQUIRED_CONSENTS.every((key) => details.consents?.includes(key))) return reject('CONSENT_REQUIRED');
    const { slot, restaurant } = restaurantOf(state, offer);
    const amountKRW = depositFor(restaurant, slot.partySize);
    if (amountKRW === 0) { reservationId = createReservation(state, offer, null, details, nowMs).id; return undefined; }
    const outcome = state.meta.failNextPayment ? 'FAILED' : state.meta.deferNextPayment ? 'DEFERRED' : 'SUCCEEDED';
    Object.assign(state.meta, { failNextPayment: false, deferNextPayment: false });  // one-shot, this operation only
    const operation = {
      id: nextId(state.paymentOperations, 'pay'), offerId, customerId: offer.ownerId, amountKRW, method: 'DEMO_CARD',
      status: 'PENDING', processor: { outcome, readyAt: iso(nowMs + POLICY.mockServiceDelayMs) },
      details: { purposes: details.purposes ?? [], requestNote: details.requestNote ?? '' },
      createdAt: iso(nowMs), resolvedAt: null, reservationId: null, refundedAt: null,
    };
    state.paymentOperations.push(operation);
    Object.assign(offer, { status: 'PAYMENT_PENDING', paymentOperationId: operation.id });
    operationId = operation.id;
    return undefined;
  });
  if (!result.ok || result.repeated) return result;
  return { ok: true, operationId, reservationId };
}

/** Applies mock processor answers that are due. Deferred answers become UNKNOWN and keep the hold. */
export function settlePayments() {
  const nowMs = now();
  const due = (state) => state.paymentOperations.filter((op) => op.status === 'PENDING' && nowMs >= Date.parse(op.processor.readyAt));
  if (!due(getState()).length) return { ok: true, settled: 0 };
  let settled = 0;
  const result = commit((state) => {
    due(state).forEach((operation) => {
      settled += 1;
      if (operation.processor.outcome !== 'DEFERRED') { applyOutcome(state, operation, operation.processor.outcome, nowMs); return; }
      operation.status = 'UNKNOWN';
      findOffer(state, operation.offerId).status = 'PAYMENT_UNKNOWN';
    });
  });
  return result.ok ? { ok: true, settled } : result;
}

/** Retries saving the reservation for an existing charge (UC-PB 10a). Never charges again. */
export function retryReservationCommit(operationId) {
  const nowMs = now();
  return commit((state) => {
    const operation = findOperation(state, operationId);
    if (!operation) return reject('NOT_FOUND');
    const offer = findOffer(state, operation.offerId);
    if (operation.reservationId) return { ok: true, repeated: true };
    if (offer.status !== 'RECOVERY_PENDING' || operation.status !== 'SUCCEEDED') return reject('NOTHING_TO_RECOVER');
    commitAfterCharge(state, offer, operation, nowMs);
    return undefined;
  });
}

// ---- Presenter tools (one operation each; reset clears every flag and operation) ----

export function setPaymentFlag(flag, armed) {
  if (!['failNextPayment', 'deferNextPayment', 'failNextCommit'].includes(flag)) return reject('INVALID_PREFERENCE');
  return commit((state) => { state.meta[flag] = Boolean(armed); });
}

export const unknownOperations = (state) => state.paymentOperations.filter((op) => op.status === 'UNKNOWN');
export const recoveryOperations = (state) => state.paymentOperations.filter((op) => op.status === 'SUCCEEDED' && !op.reservationId
  && findOffer(state, op.offerId)?.status === 'RECOVERY_PENDING');

/** Resolves an UNKNOWN result as the processor finally reports it (P06/P07). */
export function resolveUnknownPayment(operationId, outcome) {
  const nowMs = now();
  return commit((state) => {
    const operation = findOperation(state, operationId);
    if (!operation) return reject('NOT_FOUND');
    if (operation.status !== 'UNKNOWN' || !['SUCCEEDED', 'FAILED'].includes(outcome)) return reject('NOTHING_TO_RESOLVE');
    applyOutcome(state, operation, outcome, nowMs);
    return undefined;
  });
}

/** Mock refund of a charge whose reservation cannot be saved; only then is the slot offered on (P09). */
export function compensatePayment(operationId) {
  const nowMs = now();
  return commit((state) => {
    const operation = findOperation(state, operationId);
    if (!operation) return reject('NOT_FOUND');
    const offer = findOffer(state, operation.offerId);
    if (offer.status !== 'RECOVERY_PENDING' || operation.status !== 'SUCCEEDED' || operation.reservationId) return reject('NOTHING_TO_RECOVER');
    Object.assign(operation, { status: 'REFUNDED', refundedAt: iso(nowMs) });
    notify(state, {
      customerId: offer.ownerId, kind: 'PAYMENT_REFUNDED', entityType: 'offer', entityId: offer.id,
      data: { ...slotFacts(findSlot(state, offer.slotId)), depositKRW: operation.amountKRW },
    });
    endOffer(state, offer, 'REFUNDED', 'REFUNDED', nowMs);  // refund recorded first, then the hand-off
    return undefined;
  });
}
