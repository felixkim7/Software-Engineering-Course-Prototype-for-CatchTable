// Dependency-free checks for risky prototype logic. Open tests/index.html over HTTP.
// Uses the real storage key, and restores whatever demo data was there before.
import { STORAGE_KEY, SCHEMA_VERSION, POLICY } from '../assets/js/core/config.js';
import { createSeed, DOMAIN_COLLECTIONS } from '../assets/js/core/seed-data.js';
import { getState, getStorageStatus, resetDemo, setPreference, afterMockDelay } from '../assets/js/core/store.js';
import { now, advance } from '../assets/js/core/clock.js';
import { seoulDateKey, addDays, weekdayOf, seoulHour, formatKRW, escapeHtml } from '../assets/js/core/format.js';
import { hourSlots, waitingStatistics } from '../assets/js/services/statistics.js';
import { bookingDates, bookingTimes } from '../assets/js/services/booking.js';
import { isSaved, toggleSaved, savedRestaurantList, hasCoupon, claimCoupon, recordView, recentRestaurants } from '../assets/js/services/customer.js';

const DAY_MS = 24 * 60 * 60 * 1000;
const results = [];

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function check(name, fn) {
  try {
    await fn();
    results.push({ name, ok: true });
  } catch (error) {
    results.push({ name, ok: false, error: error.message });
  }
}

const sameJson = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const backup = localStorage.getItem(STORAGE_KEY);

try {
  await check('seed is identical for the same reset instant', () => {
    const t = Date.parse('2026-10-23T03:00:00Z');
    assert(sameJson(createSeed(t), createSeed(t)), 'two seeds differ');
  });

  await check('seed base date is the Seoul date of the reset instant', () => {
    const afterSeoulMidnight = Date.parse('2026-10-23T15:30:00Z');  // 2026-10-24 00:30 KST
    assert(createSeed(afterSeoulMidnight).meta.baseDate === '2026-10-24', 'wrong Seoul date');
    assert(createSeed(afterSeoulMidnight + DAY_MS).meta.baseDate === '2026-10-25', 'date did not follow reset time');
  });

  await check('seed has required fixtures and empty domain collections', () => {
    const seed = createSeed(Date.now());
    const byId = (list) => Object.fromEntries(list.map((item) => [item.id, item]));
    const r = byId(seed.restaurants);
    const m = byId(seed.managers);
    assert(r.r1.waitingEnabled && r.r1.bookingEnabled && r.r1.policies.depositKRW === 20000, 'r1 fixture');
    assert(r.r2.waitingEnabled, 'r2 fixture');
    assert(!r.r3.waitingEnabled && r.r3.bookingEnabled && r.r3.policies.depositKRW === 0, 'r3 fixture');
    assert(['c1', 'c2', 'c3'].every((id) => byId(seed.customers)[id]), 'customers');
    assert(m.m1.restaurantId === 'r1' && m.m2.restaurantId === 'r2', 'manager assignment');
    const unseeded = DOMAIN_COLLECTIONS.filter((name) => name !== 'waitingStatistics');
    assert(unseeded.every((name) => seed[name].length === 0), 'later-phase collections not empty');
  });

  await check('reset restores the seed exactly, with a new epoch and default preferences', () => {
    resetDemo();
    const epochBefore = getState().meta.scenarioEpoch;
    setPreference('activeRole', 'manager');
    setPreference('activeCustomerId', 'c2');
    advance(60 * 1000);
    resetDemo();
    const state = getState();
    assert(state.meta.scenarioEpoch === epochBefore + 1, 'epoch not incremented');
    const expected = createSeed(Date.parse(state.meta.resetAt), state.meta.scenarioEpoch);
    assert(sameJson(state, expected), 'reset snapshot differs from seed');
  });

  await check('preferences are written to storage, revision +1 per change', () => {
    resetDemo();
    assert(setPreference('activeManagerId', 'm2').ok, 'rejected');
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
    assert(stored.meta.activeManagerId === 'm2', 'not persisted');
    assert(stored.meta.revision === 1, `revision ${stored.meta.revision}`);
  });

  await check('invalid preferences are rejected without mutation', () => {
    const revision = getState().meta.revision;
    assert(setPreference('activeCustomerId', 'c999').reason === 'INVALID_PREFERENCE', 'unknown id accepted');
    assert(setPreference('activeRole', 'admin').reason === 'INVALID_PREFERENCE', 'unknown role accepted');
    assert(setPreference('__proto__', 'x').reason === 'INVALID_PREFERENCE', 'unknown key accepted');
    assert(getState().meta.revision === revision, 'state changed');
  });

  await check('clock advance shifts now(); reset zeroes the offset', () => {
    resetDemo();
    const before = now();
    advance(10 * 60 * 1000);
    const shifted = now() - before;
    assert(shifted >= 600000 && shifted < 605000, `shifted ${shifted} ms`);
    resetDemo();
    assert(getState().meta.clockOffsetMs === 0, 'offset not zeroed');
  });

  await check('mock callback runs when no reset happens', async () => {
    resetDemo();
    const result = await afterMockDelay(() => 'done', 20);
    assert(result.ok && result.value === 'done', 'callback did not run');
  });

  await check('reset invalidates a pending mock callback', async () => {
    resetDemo();
    let ran = false;
    const pending = afterMockDelay(() => { ran = true; }, 20);
    resetDemo();
    const result = await pending;
    assert(!ran && result.reason === 'STALE_EPOCH', 'stale callback ran');
  });

  await check('corrupt snapshot is reported, kept, and blocks writes until reset', () => {
    localStorage.setItem(STORAGE_KEY, '{not json');
    assert(getStorageStatus() === 'corrupt', 'not reported');
    assert(setPreference('activeRole', 'manager').reason === 'STORAGE_CORRUPT', 'write allowed');
    assert(localStorage.getItem(STORAGE_KEY) === '{not json', 'corrupt data overwritten silently');
    resetDemo();
    assert(getStorageStatus() === 'ok', 'reset did not recover');
  });

  await check('older schema is reported as outdated, kept, and blocks writes until reset', () => {
    const old = createSeed(Date.now());
    old.meta.schemaVersion = SCHEMA_VERSION - 1;
    const raw = JSON.stringify(old);
    localStorage.setItem(STORAGE_KEY, raw);
    assert(getStorageStatus() === 'outdated', `status ${getStorageStatus()}`);
    assert(setPreference('activeRole', 'manager').reason === 'STORAGE_OUTDATED', 'write allowed');
    assert(localStorage.getItem(STORAGE_KEY) === raw, 'old data overwritten silently');
    resetDemo();
    assert(getStorageStatus() === 'ok', 'reset did not recover');
  });

  await check('format helpers', () => {
    assert(formatKRW(20000) === '20,000원', formatKRW(20000));
    assert(escapeHtml(`<a href="x">'&'</a>`) === '&lt;a href=&quot;x&quot;&gt;&#39;&amp;&#39;&lt;/a&gt;', 'escape');
    assert(seoulDateKey(Date.parse('2026-10-23T14:59:59Z')) === '2026-10-23', 'before Seoul midnight');
    assert(seoulDateKey(Date.parse('2026-10-23T15:00:00Z')) === '2026-10-24', 'at Seoul midnight');
    assert(addDays('2026-10-01', -1) === '2026-09-30' && addDays('2026-12-31', 1) === '2027-01-01', 'addDays');
    assert(weekdayOf('2026-10-23') === 5 && weekdayOf('2026-10-25') === 0, 'weekdayOf (Fri=5, Sun=0)');
    assert(seoulHour(Date.parse('2026-10-23T14:59:00Z')) === 23 && seoulHour(Date.parse('2026-10-23T15:00:00Z')) === 0, 'seoulHour');
  });

  // ---- Waiting statistics (FR-09, FR-10) ----
  const seed = createSeed(Date.parse('2026-10-23T03:00:00Z'));
  const restaurant = (id) => seed.restaurants.find((r) => r.id === id);

  await check('hour slots cover opening hours', () => {
    const slots = hourSlots({ open: '11:00', close: '21:00' });
    assert(slots.length === 10 && slots[0] === '11:00' && slots[9] === '20:00', slots.join(','));
  });

  await check('every waiting-enabled restaurant has a record for every weekday x hour', () => {
    for (const r of seed.restaurants.filter((x) => x.waitingEnabled)) {
      for (const slot of hourSlots(r.hours)) {
        for (let weekday = 0; weekday < 7; weekday += 1) {
          const found = seed.waitingStatistics.some((s) => s.restaurantId === r.id && s.weekday === weekday && s.timeSlot === slot);
          assert(found, `${r.id} missing ${weekday} ${slot}`);
        }
      }
    }
  });

  await check('r1 ready with sparse cells, r2 collecting, r3 not applicable', () => {
    const r1 = waitingStatistics(seed, restaurant('r1'));
    const r2 = waitingStatistics(seed, restaurant('r2'));
    assert(r1.status === 'ready' && r2.status === 'collecting', `${r1.status}/${r2.status}`);
    assert(waitingStatistics(seed, restaurant('r3')) === null, 'r3 has statistics');
    const r1Cells = r1.slots.flatMap((slot) => [0, 1, 2, 3, 4, 5, 6].map((d) => r1.cell(d, slot)));
    assert(r1Cells.some((c) => c.status === 'ready') && r1Cells.some((c) => c.status === 'collecting'), 'r1 lacks a mix of cells');
  });

  await check('sparse cells never expose a number, so they cannot render as zero', () => {
    for (const id of ['r1', 'r2']) {
      const stats = waitingStatistics(seed, restaurant(id));
      for (const slot of stats.slots) {
        for (let weekday = 0; weekday < 7; weekday += 1) {
          const cell = stats.cell(weekday, slot);
          if (cell.sampleCount < POLICY.statsMinSamples) {
            assert(cell.status === 'collecting' && !('avgMinutes' in cell) && !('avgTeams' in cell), `${id} ${weekday} ${slot} leaked a value`);
          } else {
            assert(cell.status === 'ready' && cell.avgMinutes > 0 && cell.avgTeams > 0, `${id} ${weekday} ${slot} ready cell invalid`);
          }
        }
      }
    }
    const empty = waitingStatistics(seed, restaurant('r2')).cell(3, '15:00');
    assert(empty.status === 'collecting' && empty.sampleCount === 0, 'zero-sample cell');
  });

  await check('statistics period is the last 4 weeks before the reset day', () => {
    const stats = waitingStatistics(seed, restaurant('r1'));
    assert(stats.periodEnd === '2026-10-22' && stats.periodStart === '2026-09-25', `${stats.periodStart}~${stats.periodEnd}`);
    assert(Date.parse(stats.updatedAt) <= Date.parse(seed.meta.resetAt), 'updatedAt after reset');
  });

  // ---- Mock booking availability and customer lists ----
  await check('booking availability follows fixture sold-out days, times and the clock', () => {
    const noonSeoul = Date.parse('2026-10-23T03:00:00Z');  // 12:00 KST on the reset day
    const r1Tomorrow = bookingTimes(seed, restaurant('r1'), '2026-10-24', noonSeoul);
    assert(!r1Tomorrow.find((t) => t.time === '19:00').available && r1Tomorrow.find((t) => t.time === '18:00').available, 'r1 day+1 19:00');
    const r2 = bookingDates(seed, restaurant('r2'), noonSeoul);
    assert(r2.length === 14 && !r2[0].available && r2[1].available, 'r2 sold out today only');
    const late = Date.parse('2026-10-23T09:10:00Z');  // 18:10 KST
    const today = bookingTimes(seed, restaurant('r1'), '2026-10-23', late);
    assert(!today.find((t) => t.time === '18:00').available && today.find((t) => t.time === '18:30').available, 'past times not bookable');
  });

  await check('save toggles per customer and coupon claims are idempotent', () => {
    resetDemo();
    assert(toggleSaved('r1').ok && isSaved(getState(), 'r1'), 'save');
    assert(savedRestaurantList(getState()).map((r) => r.id).join() === 'r1', 'saved list');
    setPreference('activeCustomerId', 'c2');
    assert(!isSaved(getState(), 'r1'), 'leaked to another customer');
    setPreference('activeCustomerId', 'c1');
    assert(toggleSaved('r1').ok && !isSaved(getState(), 'r1'), 'unsave');
    assert(toggleSaved('nope').reason === 'NOT_FOUND', 'unknown restaurant accepted');
    assert(claimCoupon('cp-r1-corkage').ok && claimCoupon('cp-r1-corkage').ok, 'claim');
    assert(getState().couponClaims.length === 1 && hasCoupon(getState(), 'cp-r1-corkage'), 'duplicate claim');
    assert(claimCoupon('nope').reason === 'NOT_FOUND', 'unknown coupon accepted');
  });

  await check('recent views: newest first, no duplicates, per customer', () => {
    resetDemo();
    recordView('r1'); recordView('r2'); recordView('r1');
    assert(recentRestaurants(getState()).map((r) => r.id).join() === 'r1,r2', 'order/duplicates');
    setPreference('activeCustomerId', 'c2');
    assert(recentRestaurants(getState()).length === 0, 'leaked to another customer');
    setPreference('activeCustomerId', 'c1');
    assert(recordView('nope').reason === 'NOT_FOUND', 'unknown restaurant accepted');
  });
} finally {
  if (backup === null) localStorage.removeItem(STORAGE_KEY);
  else localStorage.setItem(STORAGE_KEY, backup);
}

const failed = results.filter((r) => !r.ok);
document.getElementById('results').append(...results.map((r) => {
  const item = document.createElement('li');
  item.className = r.ok ? 'pass' : 'fail';
  item.textContent = r.ok ? r.name : `${r.name}: ${r.error}`;
  return item;
}));
document.getElementById('summary').textContent = failed.length
  ? `${failed.length} of ${results.length} checks failed`
  : `All ${results.length} checks passed`;
document.body.dataset.result = failed.length ? 'fail' : 'pass';
failed.forEach((r) => console.error(`FAIL ${r.name}: ${r.error}`));
