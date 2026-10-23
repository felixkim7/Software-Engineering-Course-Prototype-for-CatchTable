// Presenter scenario presets. Each one starts from a fresh reset (new scenario epoch) and then
// builds a coherent snapshot through the store; none is a visual-only override.
import { commit, resetDemo } from '../core/store.js';

const PRESETS = {
  clean: () => ({ ok: true }),
  // c1 holds the seeded app ticket #6 at 월화식당: 3rd in line, 2 postponements left (183416).
  waitingActive: () => commit((state) => {
    const ticket = state.waitingTickets.find((t) => t.id === 'w-r1-6');
    Object.assign(ticket, { customerId: 'c1', guest: null });
    state.meta.activeCustomerId = 'c1';
  }),
};

export const PRESET_KEYS = Object.keys(PRESETS);

export function applyPreset(key) {
  if (!PRESETS[key]) return { ok: false, reason: 'NOT_FOUND' };
  resetDemo();
  return PRESETS[key]();
}
