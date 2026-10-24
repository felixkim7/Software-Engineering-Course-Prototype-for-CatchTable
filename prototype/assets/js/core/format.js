import { TIME_ZONE } from './config.js';

const DAY_MS = 24 * 60 * 60 * 1000;
const HOUR_MS = 60 * 60 * 1000;
const SEOUL_UTC_OFFSET_HOURS = 9;  // Korea has no daylight saving time

const dateKeyFormat = new Intl.DateTimeFormat('en-US', {
  timeZone: TIME_ZONE, year: 'numeric', month: '2-digit', day: '2-digit',
});
const dateFormat = new Intl.DateTimeFormat('ko-KR', {
  timeZone: TIME_ZONE, year: 'numeric', month: 'long', day: 'numeric', weekday: 'short',
});
const monthDayFormat = new Intl.DateTimeFormat('ko-KR', {
  timeZone: TIME_ZONE, month: 'long', day: 'numeric',
});
const timestampFormat = new Intl.DateTimeFormat('ko-KR', {
  timeZone: TIME_ZONE, month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', hourCycle: 'h23',
});
const dateTimeFormat = new Intl.DateTimeFormat('ko-KR', {
  timeZone: TIME_ZONE, month: 'long', day: 'numeric', weekday: 'short',
  hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23',
});

// Noon KST keeps the instant inside the same Seoul calendar day.
const noonInSeoul = (dateKey) => Date.parse(`${dateKey}T12:00:00+09:00`);

/** Seoul calendar date of an epoch-ms instant, as 'YYYY-MM-DD'. */
export function seoulDateKey(epochMs) {
  const parts = Object.fromEntries(dateKeyFormat.formatToParts(epochMs).map((p) => [p.type, p.value]));
  return `${parts.year}-${parts.month}-${parts.day}`;
}

export function addDays(dateKey, days) {
  return seoulDateKey(noonInSeoul(dateKey) + days * DAY_MS);
}

/** 0 = Sunday ... 6 = Saturday, for a Seoul date. */
export function weekdayOf(dateKey) {
  return new Date(noonInSeoul(dateKey)).getUTCDay();
}

/** Hour of day (0-23) in Seoul. */
export function seoulHour(epochMs) {
  return Math.floor((epochMs / HOUR_MS + SEOUL_UTC_OFFSET_HOURS) % 24);
}

/** 'YYYY-MM-DD' -> '2026년 10월 23일 (금)'. */
export function formatDateKey(dateKey) {
  return dateFormat.format(noonInSeoul(dateKey));
}

/** 'YYYY-MM-DD' -> '10월 23일'. */
export function formatMonthDay(dateKey) {
  return monthDayFormat.format(noonInSeoul(dateKey));
}

/** 'YYYY-MM-DD' -> '10.18', as in the app's date chips. */
export function formatShortDate(dateKey) {
  return `${Number(dateKey.slice(5, 7))}.${dateKey.slice(8, 10)}`;
}

/** '19:00' -> '오후 7:00'. */
export function formatClockTime(time) {
  const [hour, minute] = time.split(':').map(Number);
  return `${hour < 12 ? '오전' : '오후'} ${hour % 12 || 12}:${String(minute).padStart(2, '0')}`;
}

/** ISO string or epoch ms -> '10월 23일 00:00'. */
export function formatTimestamp(instant) {
  return timestampFormat.format(new Date(instant));
}

export function formatDateTime(epochMs) {
  return dateTimeFormat.format(epochMs);
}

const partsOf = (instant) => Object.fromEntries(clockFormat.formatToParts(new Date(instant)).map((p) => [p.type, p.value]));
const clockFormat = new Intl.DateTimeFormat('en-US', {
  timeZone: TIME_ZONE, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23',
});

/** ISO string or epoch ms -> '2026.10.23 18:34', as the app's ticket timestamps. */
export function formatDotDateTime(instant) {
  const p = partsOf(instant);
  return `${p.year}.${p.month}.${p.day} ${p.hour}:${p.minute}`;
}

/** ISO string or epoch ms -> '18:34:05' (manager dashboard). */
export function formatTimeOfDay(instant) {
  const p = partsOf(instant);
  return `${p.hour}:${p.minute}:${p.second}`;
}

/** Whole minutes between two instants (ISO or epoch ms), never negative. */
export function minutesBetween(from, to) {
  return Math.max(0, Math.floor((new Date(to) - new Date(from)) / 60000));
}

/** 1453 -> '1,453', 29000 -> '2.9만' (save and review counts as the app shows them). */
export function formatCount(count) {
  return count >= 10000 ? `${Number((count / 10000).toFixed(1))}만` : count.toLocaleString('ko-KR');
}

/** Photo counts cap at '9,999+'. */
export function formatCapped(count) {
  return count >= 9999 ? '9,999+' : count.toLocaleString('ko-KR');
}

export function formatKRW(amount) {
  return `${amount.toLocaleString('ko-KR')}원`;
}

const HTML_ESCAPES = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };

export function escapeHtml(text) {
  return String(text).replace(/[&<>"']/g, (ch) => HTML_ESCAPES[ch]);
}
