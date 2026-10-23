// Mock policy defaults from docs/decisions.md. These are NOT real CatchTable policies.
// Add each remaining decisions.md value here in the phase that first uses it.

export const STORAGE_KEY = 'catchtable-prototype:v1';
export const SCHEMA_VERSION = 1;
export const TIME_ZONE = 'Asia/Seoul';

export const POLICY = Object.freeze({
  mockServiceDelayMs: 600,
  bookingDepositKRW: 20000,
});
