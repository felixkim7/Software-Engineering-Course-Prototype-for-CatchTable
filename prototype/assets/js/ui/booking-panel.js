// Booking area of the detail page and its sheets, following the app captures:
// date chips (183347/173157), the 날짜·인원·시간 sheet (171404: calendar, party chips, available
// times, 닫기) and the visit confirmation (171732). Availability is MOCK (services/booking.js).
// To-Be (Phase 3): sold-out days stay selectable and sold-out times are listed after the open
// ones; tapping one starts a cancellation-seat request (빈자리 대기) via `onSoldOut`.
import { STRINGS } from '../core/strings.js';
import { addDays, formatClockTime, formatShortDate, seoulDateKey, weekdayOf } from '../core/format.js';
import { getState } from '../core/store.js';
import { bookingDates, bookingTimes } from '../services/booking.js';
import { h } from './dom.js';
import { icon } from './icons.js';
import { notInDemo } from './toast.js';
import { openSheet } from './sheet.js';

const B = STRINGS.booking;
const C = STRINGS.cancellation;
const DEFAULT_PARTY = 2;
const CHIP_DAYS = 14;
const weekdayName = (dateKey) => STRINGS.weekdays[weekdayOf(dateKey)];

function dateLabel(dateKey, todayKey) {
  const prefix = dateKey === todayKey ? B.today : dateKey === addDays(todayKey, 1) ? B.tomorrow : formatShortDate(dateKey);
  return `${prefix} (${weekdayName(dateKey)})`;
}

function openScheduleBlock(schedule) {
  return h('section', { class: 'detail-block open-schedule', 'aria-labelledby': 'open-schedule-title' },
    h('h2', { class: 'detail-block__title', id: 'open-schedule-title' }, B.openScheduleHeading),
    h('div', { class: 'open-schedule__card' },
      icon('clock', 'icon open-schedule__icon'),
      h('div', {}, h('p', { class: 'open-schedule__time' }, schedule.time), h('p', { class: 'text-secondary' }, schedule.note))),
    h('button', { class: 'button button--outline-brand button--block', type: 'button', onclick: notInDemo }, icon('bell'), B.openAlert));
}

/**
 * Returns { element, schedule, openPicker, openConfirm, getSelection }.
 * `onConfirm(selection)` runs when the visit confirmation is accepted. `onSoldOut(condition)`
 * runs for a tapped sold-out time; `isJoined(condition)` marks times already requested.
 */
export function bookingPanel(state, restaurant, nowMs, { heading, onConfirm, onSoldOut, isJoined = () => false }) {
  const todayKey = seoulDateKey(nowMs);
  const { maxPartySize, windowDays } = restaurant.booking;
  const lastKey = addDays(todayKey, windowDays - 1);
  const dates = bookingDates(state, restaurant, nowMs, windowDays);
  const availability = new Map(dates.map((d) => [d.dateKey, d.available]));
  const firstAvailable = dates.find((d) => d.available)?.dateKey ?? todayKey;
  let selection = null;  // { dateKey, party, time }

  const pickerLabel = h('span', { class: 'picker-bar__label' }, B.pickerPlaceholder);
  const chips = dates.slice(0, CHIP_DAYS).map(({ dateKey, available }) => h('button', {
    class: 'date-chip', type: 'button', 'aria-pressed': 'false', 'data-date': dateKey, 'data-available': String(available),
    onclick: () => openPicker(dateKey),
  }, h('span', { class: 'date-chip__day' }, dateLabel(dateKey, todayKey)), h('span', { class: 'date-chip__status' }, available ? B.available : B.soldOut)));

  function apply(next) {
    selection = next;
    pickerLabel.textContent = B.selection(dateLabel(next.dateKey, todayKey), next.party, formatClockTime(next.time));
    chips.forEach((chip) => chip.setAttribute('aria-pressed', String(chip.dataset.date === next.dateKey)));
  }

  function openConfirm(next = selection) {
    const dateWord = next.dateKey === todayKey ? B.today : next.dateKey === addDays(todayKey, 1) ? B.tomorrow : dateLabel(next.dateKey, todayKey);
    const confirm = h('button', { class: 'button button--primary', type: 'button', onclick: () => { dialog.close(); onConfirm(next); } }, B.confirm);
    const cancel = h('button', { class: 'button', type: 'button', onclick: () => dialog.close() }, B.cancel);
    const dialog = openSheet({
      title: B.confirmTitle(dateWord),
      className: 'sheet--confirm',
      body: h('div', { class: 'confirm-visit' },
        h('p', { class: 'confirm-visit__intro' }, B.confirmIntro),
        h('div', { class: 'confirm-visit__card' },
          h('p', { class: 'confirm-visit__name' }, restaurant.name),
          h('p', { class: 'confirm-visit__meta' }, `${restaurant.district} · ${restaurant.cuisine}`),
          h('ul', { class: 'confirm-visit__facts' },
            h('li', {}, icon('calendar'), B.confirmDate(next.dateKey, weekdayName(next.dateKey))),
            h('li', {}, icon('clock'), formatClockTime(next.time)),
            h('li', {}, icon('user'), B.partyCount(next.party)))),
        h('p', { class: 'confirm-visit__note' }, B.confirmNote)),
      footer: h('div', { class: 'sheet__actions' }, cancel, confirm),
    });
  }

  function openPicker(initialDate) {
    let party = selection?.party ?? Math.min(DEFAULT_PARTY, maxPartySize);
    let dateKey = initialDate ?? selection?.dateKey ?? firstAvailable;
    let month = dateKey.slice(0, 7);
    const title = h('h2', { class: 'calendar__title' });
    const prev = h('button', { class: 'icon-button calendar__nav', type: 'button', 'aria-label': B.prevMonth, onclick: () => shiftMonth(-1) }, icon('chevronLeft'));
    const next = h('button', { class: 'icon-button calendar__nav', type: 'button', 'aria-label': B.nextMonth, onclick: () => shiftMonth(1) }, icon('chevronRight'));
    const grid = h('div', { class: 'calendar__grid' });
    const partyRow = h('div', { class: 'party-chips', role: 'group', 'aria-label': B.partyLegend });
    const timeRow = h('div', { class: 'time-chips', role: 'group', 'aria-label': B.timesLegend });
    const soldOutHint = h('p', { class: 'sheet-hint', hidden: true }, C.soldOutHint);

    function shiftMonth(step) {
      const [year, mon] = month.split('-').map(Number);
      const target = new Date(Date.UTC(year, mon - 1 + step, 1));
      month = `${target.getUTCFullYear()}-${String(target.getUTCMonth() + 1).padStart(2, '0')}`;
      renderCalendar();
    }

    function renderCalendar() {
      const [year, mon] = month.split('-').map(Number);
      title.textContent = B.monthTitle(year, mon);
      prev.disabled = month <= todayKey.slice(0, 7);
      next.disabled = month >= lastKey.slice(0, 7);
      const first = `${month}-01`;
      const start = addDays(first, -weekdayOf(first));
      grid.replaceChildren(...STRINGS.weekdays.map((day) => h('span', { class: 'calendar__weekday', 'aria-hidden': 'true' }, day)),
        ...Array.from({ length: 42 }, (_, index) => {
          const key = addDays(start, index);
          const inWindow = key >= todayKey && key <= lastKey;
          const open = availability.get(key) === true;
          const dayState = !inWindow ? null : open ? B.available : B.soldOut;
          return h('button', {
            class: `calendar__day${inWindow && !open ? ' is-soldout' : ''}`, type: 'button', disabled: !inWindow, 'aria-pressed': String(key === dateKey),
            'aria-label': B.dayLabel(Number(key.slice(5, 7)), Number(key.slice(8)), weekdayName(key), dayState),
            onclick: () => { dateKey = key; renderCalendar(); renderTimes(); },
          }, String(Number(key.slice(8))));
        }));
    }

    function renderParty() {
      partyRow.replaceChildren(...Array.from({ length: maxPartySize }, (_, index) => index + 1).map((count) => h('button', {
        class: 'party-chip', type: 'button', 'aria-pressed': String(count === party),
        onclick: () => { party = count; renderParty(); renderTimes(); },
      }, B.partyCount(count))));
    }

    function renderTimes() {
      const slots = bookingTimes(getState(), restaurant, dateKey, nowMs).filter((slot) => slot.available || (slot.soldOut && onSoldOut));
      const chip = (slot) => {
        const label = formatClockTime(slot.time);
        if (slot.available) {
          return h('button', { class: 'time-chip', type: 'button', onclick: () => { dialog.close(); apply({ dateKey, party, time: slot.time }); openConfirm(); } }, label);
        }
        const condition = { restaurantId: restaurant.id, serviceDate: dateKey, serviceTime: slot.time, partySize: party };
        const joined = isJoined(condition);
        return h('button', {
          class: `time-chip time-chip--soldout${joined ? ' is-joined' : ''}`, type: 'button',
          'aria-label': joined ? C.joinedLabel(label) : C.soldOutLabel(label),
          onclick: () => { dialog.close(); onSoldOut(condition); },
        }, label, h('span', { class: 'time-chip__tag' }, joined ? C.joinedTag : C.soldOutTag));
      };
      // Chronological, sold-out times included (To-Be), so they sit where the customer looks
      timeRow.replaceChildren(...(slots.length ? slots.map(chip) : [h('p', { class: 'sheet-empty' }, B.noTimes)]));
      soldOutHint.hidden = !slots.some((slot) => slot.soldOut);
    }

    renderCalendar();
    renderParty();
    renderTimes();
    const dialog = openSheet({
      label: B.sheetLabel,
      className: 'sheet--booking',
      body: [
        h('div', { class: 'calendar' },
          h('div', { class: 'calendar__head' },
            h('button', { class: 'calendar__today', type: 'button', onclick: () => { dateKey = availability.get(todayKey) ? todayKey : dateKey; month = todayKey.slice(0, 7); renderCalendar(); renderTimes(); } }, B.goToday),
            h('div', { class: 'calendar__month' }, prev, title, next)),
          grid),
        partyRow,
        timeRow,
        soldOutHint,
      ],
      footer: h('button', { class: 'button button--block', type: 'button', onclick: () => dialog.close() }, B.close),
    });
    dialog.querySelector('.party-chip[aria-pressed="true"]')?.scrollIntoView({ block: 'nearest', inline: 'center' });
  }

  const element = h('div', { class: 'booking-panel' },
    heading && h('h2', { class: 'detail-block__title' }, heading),
    h('button', { class: 'picker-bar', type: 'button', onclick: () => openPicker() }, icon('calendar'), pickerLabel, icon('chevronDown')),
    h('div', { class: 'date-chips', role: 'group', 'aria-label': B.datesLabel }, chips),
    h('button', { class: 'pill-button find-dates', type: 'button', onclick: () => openPicker(firstAvailable) }, B.findDates));

  return {
    element,
    schedule: restaurant.booking.openSchedule && openScheduleBlock(restaurant.booking.openSchedule),
    openPicker: () => openPicker(),
    openConfirm: () => openConfirm(),
    getSelection: () => selection,
  };
}
