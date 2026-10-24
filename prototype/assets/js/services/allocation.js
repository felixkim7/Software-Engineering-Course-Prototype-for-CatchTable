// Cancellation-seat requests and exclusive priority offers (NOT on-site waiting tickets).
// A released slot unit goes to exactly one request: the earliest QUEUED request whose
// restaurant, date, time and party size all match (requestedAt, then id). The offer has an
// absolute deadline; decline, expiry or withdrawal hands the slot to exactly one successor,
// and with nobody eligible the slot becomes AVAILABLE for ordinary booking. Every command
// re-reads the newest snapshot inside commit(), so a repeated or stale command is harmless.
import { POLICY } from '../core/config.js';
import { commit, getState } from '../core/store.js';
import { now } from '../core/clock.js';
import { addDays, seoulDateKey } from '../core/format.js';
import { bookingTimes, isPast } from './booking.js';
import { notify } from './notification.js';

const LIVE_REQUEST = new Set(['QUEUED', 'OFFERED']);
const reject = (reason, extra = {}) => ({ ok: false, reason, ...extra });
const iso = (ms) => new Date(ms).toISOString();
const customerId = (state) => state.meta.activeCustomerId;
export const nextId = (list, prefix) => `${prefix}-${Math.max(0, ...list.map((item) => Number(item.id.split('-')[1]))) + 1}`;

export const sameCondition = (a, b) => a.restaurantId === b.restaurantId && a.serviceDate === b.serviceDate
  && a.serviceTime === b.serviceTime && a.partySize === b.partySize;
export const isLiveRequest = (request) => LIVE_REQUEST.has(request.status);

/** Deadline boundary: live only while now < expiresAt (equality means expired). */
export const offerIsLive = (offer, nowMs) => offer.status === 'OFFERED' && nowMs < Date.parse(offer.expiresAt);

/** Eligible requests for a condition in allocation order. */
export function matchingQueue(state, condition) {
  return state.cancellationRequests
    .filter((r) => r.status === 'QUEUED' && sameCondition(r, condition))
    .sort((a, b) => a.requestedAt.localeCompare(b.requestedAt) || Number(a.id.split('-')[1]) - Number(b.id.split('-')[1]));
}

/** 1-based place among QUEUED requests with exactly the same condition, or null. */
export function queueRank(state, request) {
  const index = matchingQueue(state, request).findIndex((r) => r.id === request.id);
  return index < 0 ? null : index + 1;
}

export const findRequest = (state, id) => state.cancellationRequests.find((r) => r.id === id) ?? null;
export const findOffer = (state, id) => state.priorityOffers.find((o) => o.id === id) ?? null;
export const findSlot = (state, id) => state.releasedSlots.find((s) => s.id === id) ?? null;

export function customerRequests(state) {
  return state.cancellationRequests.filter((r) => r.customerId === customerId(state)).sort((a, b) => b.requestedAt.localeCompare(a.requestedAt));
}

export function liveRequestFor(state, condition) {
  return state.cancellationRequests.find((r) => r.customerId === customerId(state) && isLiveRequest(r) && sameCondition(r, condition)) ?? null;
}

/** Offer currently held by the active customer at a restaurant (for the detail page strip). */
export function liveOffersFor(state, restaurantId) {
  const nowMs = now();
  return state.priorityOffers.filter((o) => o.ownerId === customerId(state) && offerIsLive(o, nowMs)
    && findSlot(state, o.slotId)?.restaurantId === restaurantId);
}

// ---- Allocation (inside commit) ----

function allocate(state, slot, nowMs) {
  const [first] = matchingQueue(state, slot);
  if (!first) {
    Object.assign(slot, { status: 'AVAILABLE', offerId: null });
    return null;
  }
  const offer = {
    id: nextId(state.priorityOffers, 'of'), requestId: first.id, slotId: slot.id, ownerId: first.customerId,
    status: 'OFFERED', issuedAt: iso(nowMs), expiresAt: iso(nowMs + POLICY.offerLifetimeMs), endedAt: null, paymentOperationId: null,
  };
  state.priorityOffers.push(offer);
  Object.assign(first, { status: 'OFFERED', offerId: offer.id });
  Object.assign(slot, { status: 'HELD', offerId: offer.id });
  notify(state, {
    customerId: first.customerId, kind: 'OFFER_ISSUED', entityType: 'offer', entityId: offer.id,
    data: { restaurantId: slot.restaurantId, serviceDate: slot.serviceDate, serviceTime: slot.serviceTime, partySize: slot.partySize, expiresAt: offer.expiresAt },
  });
  return offer;
}

/**
 * Ends an offer (DECLINED/EXPIRED/REFUNDED), ends its request with `requestStatus`, then hands the
 * slot off once. Payment code (services/payment.js) calls it only when a hand-off is safe.
 */
export function endOffer(state, offer, offerStatus, requestStatus, nowMs) {
  const request = findRequest(state, offer.requestId);
  const slot = findSlot(state, offer.slotId);
  Object.assign(offer, { status: offerStatus, endedAt: iso(nowMs) });
  Object.assign(request, { status: requestStatus, endedAt: iso(nowMs) });
  if (offerStatus === 'EXPIRED') {
    notify(state, {
      customerId: offer.ownerId, kind: 'OFFER_EXPIRED', entityType: 'offer', entityId: offer.id,
      data: { restaurantId: slot.restaurantId, serviceDate: slot.serviceDate, serviceTime: slot.serviceTime, partySize: slot.partySize },
    });
  }
  return allocate(state, slot, nowMs);
}

/** Expires every OFFERED offer at or past its deadline, exactly once, and allocates successors. */
export function reconcileOffers() {
  const nowMs = now();
  const due = (state) => state.priorityOffers.filter((o) => o.status === 'OFFERED' && !offerIsLive(o, nowMs));
  if (!due(getState()).length) return { ok: true, expired: 0 };  // no write, no revision churn
  let expired = 0;
  const result = commit((state) => {
    due(state).forEach((offer) => { endOffer(state, offer, 'EXPIRED', 'EXPIRED', nowMs); expired += 1; });
  });
  return result.ok ? { ok: true, expired } : result;
}

// ---- Customer commands ----

function validCondition(state, condition, nowMs) {
  const restaurant = state.restaurants.find((r) => r.id === condition.restaurantId);
  if (!restaurant?.bookingEnabled) return reject('NOT_FOUND');
  const { serviceDate, serviceTime, partySize } = condition;
  const lastDay = addDays(seoulDateKey(nowMs), restaurant.booking.windowDays - 1);
  const valid = restaurant.booking.times.includes(serviceTime) && serviceDate <= lastDay && !isPast(serviceDate, serviceTime, nowMs)
    && Number.isInteger(partySize) && partySize >= 1 && partySize <= restaurant.booking.maxPartySize;
  if (!valid) return reject('INVALID_CONDITION');
  const slot = bookingTimes(state, restaurant, serviceDate, nowMs).find((t) => t.time === serviceTime);
  if (!slot) return reject('INVALID_CONDITION');  // regular closing day
  if (slot.available) return reject('TIME_AVAILABLE');
  return null;
}

/** Joins the queue for one exact condition. One live request per customer and condition. */
export function joinQueue(condition) {
  const nowMs = now();
  let requestId = null;
  const result = commit((state) => {
    const invalid = validCondition(state, condition, nowMs);
    if (invalid) return invalid;
    const existing = liveRequestFor(state, condition);
    if (existing) return reject('DUPLICATE_REQUEST', { requestId: existing.id });
    requestId = nextId(state.cancellationRequests, 'cr');
    state.cancellationRequests.push({
      id: requestId, customerId: customerId(state), restaurantId: condition.restaurantId, serviceDate: condition.serviceDate,
      serviceTime: condition.serviceTime, partySize: condition.partySize, requestedAt: iso(nowMs), status: 'QUEUED', offerId: null, endedAt: null,
    });
  });
  return result.ok ? { ok: true, requestId } : result;
}

/** Withdraws a live request. Withdrawing during an offer ends the offer and hands the slot on. */
export function withdrawRequest(requestId) {
  reconcileOffers();  // an offer past its deadline is expired (and handed on) first
  const nowMs = now();
  return commit((state) => {
    const request = findRequest(state, requestId);
    if (!request) return reject('NOT_FOUND');
    if (request.customerId !== customerId(state)) return reject('REQUEST_NOT_OWNED');
    if (!isLiveRequest(request)) return reject('REQUEST_ENDED');
    const offer = request.status === 'OFFERED' ? findOffer(state, request.offerId) : null;
    if (offer && offer.status !== 'OFFERED') return reject('PAYMENT_IN_PROGRESS');  // never drop a slot while payment resolves
    if (offer) endOffer(state, offer, 'DECLINED', 'CANCELLED', nowMs);
    else Object.assign(request, { status: 'CANCELLED', endedAt: iso(nowMs) });
    return undefined;
  });
}

/** Owner declines a live offer; the next eligible request gets the slot. */
export function declineOffer(offerId) {
  reconcileOffers();
  const nowMs = now();
  return commit((state) => {
    const offer = findOffer(state, offerId);
    if (!offer) return reject('NOT_FOUND');
    if (offer.ownerId !== customerId(state)) return reject('OFFER_NOT_OWNED');
    if (offer.status === 'EXPIRED' || (offer.status === 'OFFERED' && !offerIsLive(offer, nowMs))) return reject('OFFER_EXPIRED');
    if (['PAYMENT_PENDING', 'PAYMENT_UNKNOWN', 'RECOVERY_PENDING'].includes(offer.status)) return reject('PAYMENT_IN_PROGRESS');
    if (offer.status !== 'OFFERED') return reject('OFFER_ENDED');
    endOffer(state, offer, 'DECLINED', 'DECLINED', nowMs);
    return undefined;
  });
}

// ---- Presenter / restaurant event ----

/** A cancellation frees one slot unit for this exact condition; allocation runs immediately. */
export function releaseSlot(condition) {
  const nowMs = now();
  let slotId = null;
  const result = commit((state) => {
    const restaurant = state.restaurants.find((r) => r.id === condition.restaurantId);
    if (!restaurant?.bookingEnabled || !restaurant.booking.times.includes(condition.serviceTime) || isPast(condition.serviceDate, condition.serviceTime, nowMs)) {
      return reject('INVALID_CONDITION');
    }
    const slot = {
      id: nextId(state.releasedSlots, 'rs'), restaurantId: condition.restaurantId, serviceDate: condition.serviceDate,
      serviceTime: condition.serviceTime, partySize: condition.partySize, status: 'AVAILABLE', offerId: null, reservationId: null, releasedAt: iso(nowMs),
    };
    state.releasedSlots.push(slot);
    slotId = slot.id;
    allocate(state, slot, nowMs);
  });
  return result.ok ? { ok: true, slotId } : result;
}
