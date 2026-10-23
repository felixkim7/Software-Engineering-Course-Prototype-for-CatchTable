// Restaurant fixtures: three real CatchTable listings whose public details were transcribed or
// cropped from the user's app captures (docs/reference-screens, provenance in docs/assets.md).
// r1 월화식당 마포본점 (booking + waiting), r2 vivo pizza 공덕점 (booking + waiting, statistics
// still collecting), r3 스시렌 (booking only, 예약금 0원). Booking availability, deposits, waiting
// statistics and every other operational value are MOCK demo data, not the restaurants' policies.
import { wolhwa } from './fixtures/wolhwa.js';
import { vivo } from './fixtures/vivo.js';
import { sushiren } from './fixtures/sushiren.js';

export function restaurants() {
  return structuredClone([wolhwa, vivo, sushiren]);
}
