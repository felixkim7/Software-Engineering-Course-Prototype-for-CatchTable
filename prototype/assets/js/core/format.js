import { TIME_ZONE } from './config.js';

const dateKeyFormat = new Intl.DateTimeFormat('en-US', {
  timeZone: TIME_ZONE, year: 'numeric', month: '2-digit', day: '2-digit',
});
const dateFormat = new Intl.DateTimeFormat('ko-KR', {
  timeZone: TIME_ZONE, year: 'numeric', month: 'long', day: 'numeric', weekday: 'short',
});
const dateTimeFormat = new Intl.DateTimeFormat('ko-KR', {
  timeZone: TIME_ZONE, month: 'long', day: 'numeric', weekday: 'short',
  hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23',
});

/** Seoul calendar date of an epoch-ms instant, as 'YYYY-MM-DD'. */
export function seoulDateKey(epochMs) {
  const parts = Object.fromEntries(dateKeyFormat.formatToParts(epochMs).map((p) => [p.type, p.value]));
  return `${parts.year}-${parts.month}-${parts.day}`;
}

/** 'YYYY-MM-DD' (a Seoul date) -> '2026년 10월 23일 (금)'. */
export function formatDateKey(dateKey) {
  // Noon KST keeps the instant inside the same Seoul day.
  return dateFormat.format(new Date(`${dateKey}T12:00:00+09:00`));
}

export function formatDateTime(epochMs) {
  return dateTimeFormat.format(epochMs);
}

export function formatKRW(amount) {
  return `${amount.toLocaleString('ko-KR')}원`;
}

const HTML_ESCAPES = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };

export function escapeHtml(text) {
  return String(text).replace(/[&<>"']/g, (ch) => HTML_ESCAPES[ch]);
}
