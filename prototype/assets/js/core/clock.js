import { getState, commit } from './store.js';

/** Demo time: real time plus the persisted presenter offset. Every domain timer reads this. */
export function now() {
  return Date.now() + getState().meta.clockOffsetMs;
}

/** Moves demo time forward. Reset (store.resetDemo) returns the offset to zero. */
export function advance(ms) {
  return commit((state) => {
    state.meta.clockOffsetMs += ms;
  });
}
