// MOCK ordinary-booking availability, derived from each restaurant's fixture pattern
// (restaurant.booking.soldOut uses day offsets from the reset date). Party size only has to
// fit maxPartySize. A released cancellation slot that nobody in the queue matched becomes
// AVAILABLE and reopens its time for ordinary booking (decisions.md, empty eligible queue).
import { addDays, seoulDateKey, seoulHour, weekdayOf } from '../core/format.js';

export const BOOKING_WINDOW_DAYS = 14;
const DAY_MS = 24 * 60 * 60 * 1000;

const daysBetween = (fromKey, toKey) => Math.round((Date.parse(toKey) - Date.parse(fromKey)) / DAY_MS);

export function isPast(dateKey, time, nowMs) {
  if (dateKey !== seoulDateKey(nowMs)) return dateKey < seoulDateKey(nowMs);
  const minutesNow = seoulHour(nowMs) * 60 + new Date(nowMs).getUTCMinutes();
  const [hour, minute] = time.split(':').map(Number);
  return hour * 60 + minute <= minutesNow;
}

/** Regular closing day (hours.closedWeekdays): no times at all, shown as 휴무 rather than sold out. */
export function isClosedDay(restaurant, dateKey) {
  return restaurant.hours?.closedWeekdays?.includes(weekdayOf(dateKey)) ?? false;
}

/** [{ time: '19:00', available, soldOut }] for one date. Past times are neither. */
export function bookingTimes(state, restaurant, dateKey, nowMs) {
  if (isClosedDay(restaurant, dateKey)) return [];
  const offset = daysBetween(state.meta.baseDate, dateKey);
  return restaurant.booking.times.map((time) => {
    const past = isPast(dateKey, time, nowMs);
    const reopened = state.releasedSlots.some((s) => s.restaurantId === restaurant.id && s.serviceDate === dateKey && s.serviceTime === time && s.status === 'AVAILABLE');
    const fixtureSoldOut = restaurant.booking.soldOut.some(([day, soldTime]) => day === offset && (soldTime === null || soldTime === time));
    const soldOut = !past && fixtureSoldOut && !reopened;
    return { time, available: !past && !soldOut, soldOut };
  });
}

/** [{ dateKey, available, closed }] for `days` days starting today (Seoul). */
export function bookingDates(state, restaurant, nowMs, days = BOOKING_WINDOW_DAYS) {
  const today = seoulDateKey(nowMs);
  return Array.from({ length: days }, (_, index) => {
    const dateKey = addDays(today, index);
    return { dateKey, available: bookingTimes(state, restaurant, dateKey, nowMs).some((slot) => slot.available), closed: isClosedDay(restaurant, dateKey) };
  });
}

/** Date-chip / calendar status word: 예약 가능, 휴무 or 예약 마감. */
export function dayStatus(labels, { available, closed }) {
  return available ? labels.available : closed ? labels.closedDay : labels.soldOut;
}
