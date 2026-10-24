// One versioned JSON snapshot in localStorage. Every write goes through commit():
// read newest snapshot -> mutate a copy -> validate -> revision + 1 -> save once -> notify.
// Limitation: localStorage is not a transactional database across tabs. The supported demo
// mode is one active writer tab; other tabs may observe (docs/architecture.md).

import { STORAGE_KEY, SCHEMA_VERSION, POLICY } from './config.js';
import { createSeed, DOMAIN_COLLECTIONS, FIXTURE_COLLECTIONS } from './seed-data.js';
import { refocus } from '../ui/dom.js';

const changes = new EventTarget();
let status = 'ok';   // 'ok' | 'outdated' | 'corrupt' | 'unavailable'
const WRITE_BLOCKED = { outdated: 'STORAGE_OUTDATED', corrupt: 'STORAGE_CORRUPT' };
let cachedRaw;       // raw string that `current` was parsed from or saved as
let current = null;  // newest snapshot; memory-only while storage is unavailable or corrupt

function isValidSnapshot(snapshot) {
  const meta = snapshot?.meta;
  return Boolean(meta)
    && meta.schemaVersion === SCHEMA_VERSION
    && Number.isInteger(meta.revision)
    && Number.isInteger(meta.scenarioEpoch)
    && Number.isFinite(meta.clockOffsetMs)
    && [...FIXTURE_COLLECTIONS, ...DOMAIN_COLLECTIONS].every((name) => Array.isArray(snapshot[name]));
}

function readRaw() {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    status = 'unavailable';
    return undefined;
  }
}

function save(snapshot) {
  current = snapshot;
  try {
    const raw = JSON.stringify(snapshot);
    localStorage.setItem(STORAGE_KEY, raw);
    cachedRaw = raw;
  } catch {
    status = 'unavailable';
  }
  return snapshot;
}

function load() {
  const raw = readRaw();
  if (raw === undefined) return (current ??= createSeed(Date.now()));
  if (current && raw === cachedRaw) return current;
  cachedRaw = raw;
  if (raw === null) {
    status = 'ok';
    return save(createSeed(Date.now()));
  }
  let parsed = null;
  try { parsed = JSON.parse(raw); } catch { /* reported as corrupt below */ }
  if (!isValidSnapshot(parsed)) {
    // No migrations: an older schema or unreadable data is left untouched, and pages render
    // from a memory-only seed until the presenter resets explicitly. Keeping the last known
    // epoch makes that reset still invalidate callbacks scheduled earlier in this tab.
    const version = parsed?.meta?.schemaVersion;
    status = Number.isInteger(version) && version < SCHEMA_VERSION ? 'outdated' : 'corrupt';
    return (current = createSeed(Date.now(), current?.meta.scenarioEpoch ?? 1));
  }
  status = 'ok';
  return (current = parsed);
}

function notify() {
  changes.dispatchEvent(new Event('change'));
}

/** Newest snapshot. Treat it as read-only; change state only through commands. */
export function getState() {
  return load();
}

export function getStorageStatus() {
  load();
  return status;
}

/**
 * Applies `mutate` to a copy of the newest snapshot and saves it once.
 * `mutate` returns nothing on success, or `{ ok: false, reason }` to reject without changes.
 */
export function commit(mutate) {
  const state = load();
  if (WRITE_BLOCKED[status]) return { ok: false, reason: WRITE_BLOCKED[status] };
  const next = structuredClone(state);
  const rejection = mutate(next);
  if (rejection) return rejection;
  if (!isValidSnapshot(next)) return { ok: false, reason: 'INVALID_STATE' };
  next.meta.revision += 1;
  save(next);
  notify();
  return { ok: true };
}

/** Replaces all data with a fresh seed and starts a new scenario epoch. */
export function resetDemo() {
  const previousEpoch = load().meta.scenarioEpoch;
  status = 'ok';
  save(createSeed(Date.now(), previousEpoch + 1));
  notify();
}

const PREFERENCE_RULES = {
  activeRole: (value) => value === 'customer' || value === 'manager',
  activeCustomerId: (value, state) => state.customers.some((customer) => customer.id === value),
  activeManagerId: (value, state) => state.managers.some((manager) => manager.id === value),
};

/** Presenter role/identity selection, persisted with the snapshot. */
export function setPreference(key, value) {
  return commit((state) => {
    const valid = Object.hasOwn(PREFERENCE_RULES, key) && PREFERENCE_RULES[key](value, state);
    if (!valid) return { ok: false, reason: 'INVALID_PREFERENCE' };
    state.meta[key] = value;
  });
}

/**
 * Resolves a fake asynchronous outcome after a delay. If a reset started a new scenario
 * in the meantime, `run` is never called. For services only, never rendering code.
 */
export function afterMockDelay(run, delayMs = POLICY.mockServiceDelayMs) {
  const epoch = load().meta.scenarioEpoch;
  return new Promise((resolve) => {
    setTimeout(() => {
      if (load().meta.scenarioEpoch !== epoch) resolve({ ok: false, reason: 'STALE_EPOCH' });
      else resolve({ ok: true, value: run() });
    }, delayMs);
  });
}

/**
 * Calls `listener` after same-tab commits, other-tab writes, focus and back/forward restore.
 * Listeners re-render, which replaces the focused control; unless the page restored focus
 * itself, keyboard focus moves to the control's twin.
 */
export function subscribe(listener) {
  const run = () => {
    const focused = document.activeElement;
    listener();
    if (!focused?.isConnected && document.activeElement === document.body) refocus(focused);
  };
  changes.addEventListener('change', run);
  window.addEventListener('storage', (event) => {
    if (event.key === STORAGE_KEY || event.key === null) run();
  });
  // Deferred: element.focus() on a blurred window fires this synchronously, before that element is active
  window.addEventListener('focus', () => setTimeout(run));
  window.addEventListener('pageshow', run);
}
