// Weekday/time-slot waiting statistics (read-only). Historical averages from fixture data,
// not a live forecast. The minimum-sample rule is enforced here, so a sparse cell never
// reaches the UI as a number (insufficient data is not zero wait).
import { POLICY } from '../core/config.js';

/** One-hour slots covering opening hours: { open: '11:00', close: '21:00' } -> '11:00' ... '20:00'. */
export function hourSlots({ open, close }) {
  const slots = [];
  for (let hour = Number(open.slice(0, 2)); hour < Number(close.slice(0, 2)); hour += 1) {
    slots.push(`${String(hour).padStart(2, '0')}:00`);
  }
  return slots;
}

const isSufficient = (record) => record.sampleCount >= POLICY.statsMinSamples;

/** Statistics view model, or null for a restaurant without on-site waiting. */
export function waitingStatistics(state, restaurant) {
  if (!restaurant.waitingEnabled) return null;
  const records = state.waitingStatistics.filter((record) => record.restaurantId === restaurant.id);
  const sufficient = records.filter(isSufficient);
  return {
    status: sufficient.length ? 'ready' : 'collecting',
    periodStart: records[0]?.periodStart ?? null,
    periodEnd: records[0]?.periodEnd ?? null,
    updatedAt: records[0]?.updatedAt ?? null,
    totalSamples: records.reduce((sum, record) => sum + record.sampleCount, 0),
    maxMinutes: Math.max(0, ...sufficient.map((record) => record.avgMinutes)),
    slots: hourSlots(restaurant.waiting.hours ?? restaurant.hours),  // waiting hours win (24h 화포식당)
    /** { status: 'ready', avgMinutes, avgTeams, sampleCount } or { status: 'collecting', sampleCount } */
    cell(weekday, timeSlot) {
      const record = records.find((r) => r.weekday === weekday && r.timeSlot === timeSlot);
      if (record && isSufficient(record)) {
        return { status: 'ready', avgMinutes: record.avgMinutes, avgTeams: record.avgTeams, sampleCount: record.sampleCount };
      }
      return { status: 'collecting', sampleCount: record?.sampleCount ?? 0 };
    },
  };
}
