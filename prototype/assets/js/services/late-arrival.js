// Late-arrival coordination between a customer and the restaurant (FR-11..14). One record per
// reservation; each ETA the customer sends starts a new version, and every response names the
// version it answers, so an obsolete proposal or response is rejected instead of applied.
// Reporting lateness is not approval: nothing here cancels, waives or refunds anything, and only
// an accepted proposal changes reservation.currentTime (originalTime stays for the record).
//
// SUBMITTED -> RETAINED | CHANGE_PROPOSED | CANNOT_RETAIN; CHANGE_PROPOSED -> CHANGE_ACCEPTED | CHANGE_REJECTED.
import { commit } from '../core/store.js';
import { now } from '../core/clock.js';
import { nextId } from './allocation.js';
import { notify } from './notification.js';
import { managerRestaurant } from './waiting.js';

const reject = (reason) => ({ ok: false, reason });
const iso = (ms) => new Date(ms).toISOString();
const TIME = /^([01]\d|2[0-3]):[0-5]\d$/;
const minutes = (time) => Number(time.slice(0, 2)) * 60 + Number(time.slice(3));

export const RESPONSES = ['RETAINED', 'CHANGE_PROPOSED', 'CANNOT_RETAIN'];
export const coordinationFor = (state, reservationId) => state.lateCoordinations.find((c) => c.reservationId === reservationId) ?? null;

/** ETA choices: 10-minute steps after the booked time, up to 2 hours, within the same day. */
export function etaOptions(currentTime) {
  const start = minutes(currentTime);
  return Array.from({ length: 12 }, (_, i) => start + (i + 1) * 10).filter((m) => m < 24 * 60)
    .map((m) => `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`);
}

function addHistory(record, nowMs, actor, actorId, action, detail = {}) {
  record.history.push({ version: record.version, at: iso(nowMs), actor, actorId, action, ...detail });
}

/** Customer reports (or updates) an expected arrival. A new ETA always opens a new version. */
export function submitEta(reservationId, eta, reason = '') {
  const nowMs = now();
  return commit((state) => {
    const reservation = state.reservations.find((r) => r.id === reservationId);
    if (!reservation) return reject('NOT_FOUND');
    if (reservation.customerId !== state.meta.activeCustomerId) return reject('RESERVATION_NOT_OWNED');
    if (reservation.status !== 'CONFIRMED') return reject('RESERVATION_ENDED');
    if (!TIME.test(eta) || minutes(eta) <= minutes(reservation.currentTime)) return reject('LATE_INVALID_ETA');
    let record = coordinationFor(state, reservationId);
    if (!record) {
      record = { id: nextId(state.lateCoordinations, 'lc'), reservationId, version: 0, history: [] };
      state.lateCoordinations.push(record);
    }
    Object.assign(record, {
      version: record.version + 1, status: 'SUBMITTED', expectedArrival: eta, reason: String(reason).slice(0, 20),
      proposedTime: null, submittedAt: iso(nowMs), respondedAt: null, decidedAt: null,
    });
    addHistory(record, nowMs, 'customer', reservation.customerId, 'ETA_SUBMITTED', { eta, reason: record.reason });
    return undefined;
  });
}

/** Manager of the reservation's restaurant answers the given version. */
export function respondToLate(reservationId, version, response, proposedTime = null) {
  const nowMs = now();
  return commit((state) => {
    const reservation = state.reservations.find((r) => r.id === reservationId);
    if (!reservation) return reject('NOT_FOUND');
    if (reservation.restaurantId !== managerRestaurant(state)?.id) return reject('FORBIDDEN');
    const record = coordinationFor(state, reservationId);
    if (!record) return reject('NOTHING_TO_ANSWER');
    if (record.version !== version) return reject('STALE_VERSION');
    if (record.status !== 'SUBMITTED') return reject('NOTHING_TO_ANSWER');
    if (!RESPONSES.includes(response)) return reject('INVALID_STATE');
    if (response === 'CHANGE_PROPOSED' && (!TIME.test(proposedTime ?? '') || proposedTime === reservation.currentTime)) return reject('INVALID_PROPOSAL');
    const manager = state.managers.find((m) => m.id === state.meta.activeManagerId);
    Object.assign(record, { status: response, proposedTime: response === 'CHANGE_PROPOSED' ? proposedTime : null, respondedAt: iso(nowMs) });
    addHistory(record, nowMs, 'manager', manager.id, response, response === 'CHANGE_PROPOSED' ? { proposedTime } : {});
    notify(state, {
      customerId: reservation.customerId, kind: 'LATE_RESPONSE', entityType: 'reservation', entityId: reservation.id,
      data: { restaurantId: reservation.restaurantId, response, proposedTime: record.proposedTime, eta: record.expectedArrival },
    });
    return undefined;
  });
}

/** Customer accepts or rejects the proposal of `version`. Only acceptance changes the time. */
export function decideProposal(reservationId, version, accept) {
  const nowMs = now();
  return commit((state) => {
    const reservation = state.reservations.find((r) => r.id === reservationId);
    if (!reservation) return reject('NOT_FOUND');
    if (reservation.customerId !== state.meta.activeCustomerId) return reject('RESERVATION_NOT_OWNED');
    const record = coordinationFor(state, reservationId);
    if (!record || record.version !== version || record.status !== 'CHANGE_PROPOSED') return reject('STALE_PROPOSAL');
    Object.assign(record, { status: accept ? 'CHANGE_ACCEPTED' : 'CHANGE_REJECTED', decidedAt: iso(nowMs) });
    const previous = reservation.currentTime;
    if (accept) reservation.currentTime = record.proposedTime;
    addHistory(record, nowMs, 'customer', reservation.customerId, record.status, { proposedTime: record.proposedTime, previousTime: previous });
    return undefined;
  });
}
