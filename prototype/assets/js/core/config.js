// Mock policy defaults from docs/decisions.md. These are NOT real CatchTable policies.
// Add each remaining decisions.md value here in the phase that first uses it.

export const STORAGE_KEY = 'catchtable-prototype:v1';
export const SCHEMA_VERSION = 6;  // 6: per-person deposits, reservations, payment flags
export const TIME_ZONE = 'Asia/Seoul';

export const POLICY = Object.freeze({
  mockServiceDelayMs: 600,
  statsPeriodWeeks: 4,
  statsMinSamples: 5,
  waitingPostponeLimit: 2,  // per ticket, as the app's "한 매장 당 순서를 2번 미룰 수 있어요"
  waitingCallLimit: 2,      // manager calls per ticket (CatchTable dashboard help)
  offerLifetimeMs: 120 * 1000,  // exclusive cancellation-seat offer, from allocation (absolute deadline)
});
