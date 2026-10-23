// MOCK ordinary-booking availability, derived from each restaurant's fixture pattern
// (restaurant.booking.soldOut uses day offsets from the reset date). Party size only has to
// fit maxPartySize. ponytail: computed, not stored; move to stored inventory when
// cancellation releases (Phase 3) need to change availability.
import { addDays, seoulDateKey, seoulHour } from '../core/format.js';

export const BOOKING_WINDOW_DAYS = 14;
const DAY_MS = 24 * 60 * 60 * 1000;

const daysBetween = (fromKey, toKey) => Math.round((Date.parse(toKey) - Date.parse(fromKey)) / DAY_MS);

function isPast(dateKey, time, nowMs) {
  if (dateKey !== seoulDateKey(nowMs)) return dateKey < seoulDateKey(nowMs);
  const minutesNow = seoulHour(nowMs) * 60 + new Date(nowMs).getUTCMinutes();
  const [hour, minute] = time.split(':').map(Number);
  return hour * 60 + minute <= minutesNow;
}

/** [{ time: '19:00', available }] for one date. */
export function bookingTimes(state, restaurant, dateKey, nowMs) {
  const offset = daysBetween(state.meta.baseDate, dateKey);
  return restaurant.booking.times.map((time) => ({
    time,
    available: !isPast(dateKey, time, nowMs)
      && !restaurant.booking.soldOut.some(([day, soldTime]) => day === offset && (soldTime === null || soldTime === time)),
  }));
}

/** [{ dateKey, available }] for `days` days starting today (Seoul). */
export function bookingDates(state, restaurant, nowMs, days = BOOKING_WINDOW_DAYS) {
  const today = seoulDateKey(nowMs);
  return Array.from({ length: days }, (_, index) => {
    const dateKey = addDays(today, index);
    return { dateKey, available: bookingTimes(state, restaurant, dateKey, nowMs).some((slot) => slot.available) };
  });
}
