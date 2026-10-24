// One entry point for time-driven work, run by pages on load, on a short interval and after a
// clock jump: first apply due mock payment answers, then expire overdue offers and hand off.
// Both steps write only when something is due, so repeating them is harmless.
import { reconcileOffers } from './allocation.js';
import { settlePayments } from './payment.js';

export function reconcile() {
  const payments = settlePayments();
  const offers = reconcileOffers();
  return { ok: payments.ok && offers.ok, settled: payments.settled ?? 0, expired: offers.expired ?? 0 };
}
