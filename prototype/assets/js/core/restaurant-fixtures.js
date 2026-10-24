// Restaurant fixtures: three real CatchTable listings whose public details were transcribed or
// cropped from the user's app captures (docs/reference-screens, provenance in docs/assets.md).
// r1 월화식당 마포본점 (booking + waiting), r2 vivo pizza 공덕점 (booking + waiting, statistics
// still collecting), r3 스시렌 (booking only, 예약금 0원). Booking availability, deposits, waiting
// statistics and every other operational value are MOCK demo data, not the restaurants' policies.
// r4-r7 (fixtures/web-sourced.js) and r8-r14 (fixtures/more-restaurants.js): capture 170629 plus
// public web sources; unknown fields are null.
import { wolhwa } from './fixtures/wolhwa.js';
import { vivo } from './fixtures/vivo.js';
import { sushiren } from './fixtures/sushiren.js';
import { mingles, evett, woowol, jageun } from './fixtures/web-sourced.js';
import { izakayanamu, dolpanjang, palhyang, madampungcheon, toomutt, wolhwagogi, hwapo } from './fixtures/more-restaurants.js';

export function restaurants() {
  return structuredClone([
    wolhwa, vivo, sushiren, mingles, evett, woowol, jageun,
    izakayanamu, dolpanjang, palhyang, madampungcheon, toomutt, wolhwagogi, hwapo,
  ]);
}
