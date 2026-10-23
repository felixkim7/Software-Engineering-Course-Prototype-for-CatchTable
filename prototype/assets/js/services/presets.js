// Presenter scenario presets. Each one starts from a fresh reset (new scenario epoch) and then
// builds a coherent snapshot through the store; none is a visual-only override.
import { commit, getState, resetDemo } from '../core/store.js';
import { addDays } from '../core/format.js';
import { releaseSlot } from './allocation.js';
import { REQUIRED_CONSENTS, setPaymentFlag, startCheckout } from './payment.js';

const HOUR_MS = 60 * 60 * 1000;

// Cancellation-seat queue for 월화식당 tomorrow 19:00 (sold out in the fixture). c3 applied first
// but for 4 people, so a 2-person slot skips c3 and goes to c1, then c2 (data-model fixture set).
function seedCancellationQueue(state) {
  const condition = { restaurantId: 'r1', serviceDate: addDays(state.meta.baseDate, 1), serviceTime: '19:00' };
  const resetMs = Date.parse(state.meta.resetAt);
  [['c3', 4, 3], ['c1', 2, 2], ['c2', 2, 1]].forEach(([customerId, partySize, hoursAgo], index) => {
    state.cancellationRequests.push({
      id: `cr-${index + 1}`, customerId, ...condition, partySize,
      requestedAt: new Date(resetMs - hoursAgo * HOUR_MS).toISOString(), status: 'QUEUED', offerId: null, endedAt: null,
    });
  });
  return condition;
}

const PRESETS = {
  clean: () => ({ ok: true }),
  // c1 holds the seeded app ticket #6 at 월화식당: 3rd in line, 2 postponements left (183416).
  waitingActive: () => commit((state) => {
    const ticket = state.waitingTickets.find((t) => t.id === 'w-r1-6');
    Object.assign(ticket, { customerId: 'c1', guest: null });
    state.meta.activeCustomerId = 'c1';
  }),
  cancellationReady: () => commit((state) => { seedCancellationQueue(state); }),
  // As cancellationReady, then one 2-person slot is released: c1 holds a live exclusive offer.
  offerActive: () => {
    let condition = null;
    const seeded = commit((state) => { condition = seedCancellationQueue(state); });
    return seeded.ok ? releaseSlot({ ...condition, partySize: 2 }) : seeded;
  },
  // As offerActive, then c1 confirms and the mock processor's answer is deferred: once the mock
  // delay passes (any open page reconciles) the operation is UNKNOWN and the slot stays held.
  paymentUnknown: () => {
    const offered = PRESETS.offerActive();
    if (!offered.ok) return offered;
    const offer = getState().priorityOffers.find((o) => o.status === 'OFFERED');
    setPaymentFlag('deferNextPayment', true);
    return startCheckout(offer.id, { consents: REQUIRED_CONSENTS, purposes: [], requestNote: '' });
  },
};

export const PRESET_KEYS = Object.keys(PRESETS);

export function applyPreset(key) {
  if (!PRESETS[key]) return { ok: false, reason: 'NOT_FOUND' };
  resetDemo();
  return PRESETS[key]();
}
