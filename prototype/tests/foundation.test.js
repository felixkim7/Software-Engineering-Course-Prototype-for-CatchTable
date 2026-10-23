// Dependency-free checks for the Phase 0 foundation. Open tests/index.html over HTTP.
// Uses the real storage key, and restores whatever demo data was there before.
import { STORAGE_KEY } from '../assets/js/core/config.js';
import { createSeed, DOMAIN_COLLECTIONS } from '../assets/js/core/seed-data.js';
import { getState, getStorageStatus, resetDemo, setPreference, afterMockDelay } from '../assets/js/core/store.js';
import { now, advance } from '../assets/js/core/clock.js';
import { seoulDateKey, formatKRW, escapeHtml } from '../assets/js/core/format.js';

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
    assert(DOMAIN_COLLECTIONS.every((name) => seed[name].length === 0), 'domain collections not empty');
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

  await check('unknown schema version is treated as unreadable', () => {
    const old = createSeed(Date.now());
    old.meta.schemaVersion = 0;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(old));
    assert(getStorageStatus() === 'corrupt', 'old schema accepted');
    resetDemo();
  });

  await check('format helpers', () => {
    assert(formatKRW(20000) === '20,000원', formatKRW(20000));
    assert(escapeHtml(`<a href="x">'&'</a>`) === '&lt;a href=&quot;x&quot;&gt;&#39;&amp;&#39;&lt;/a&gt;', 'escape');
    assert(seoulDateKey(Date.parse('2026-10-23T14:59:59Z')) === '2026-10-23', 'before Seoul midnight');
    assert(seoulDateKey(Date.parse('2026-10-23T15:00:00Z')) === '2026-10-24', 'at Seoul midnight');
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
