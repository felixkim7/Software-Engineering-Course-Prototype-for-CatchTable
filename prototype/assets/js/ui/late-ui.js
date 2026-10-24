// Late-arrival pieces shared by the customer reservation page (C07) and the manager page (M03):
// the ETA sheet, the history list (identical for both roles) and the customer's status card.
import { STRINGS } from '../core/strings.js';
import { formatClockTime, formatDotDateTime } from '../core/format.js';
import { etaOptions } from '../services/late-arrival.js';
import { h } from './dom.js';
import { icon } from './icons.js';
import { openSheet } from './sheet.js';

const L = STRINGS.late;
const minutes = (time) => Number(time.slice(0, 2)) * 60 + Number(time.slice(3));
export const lateBy = (reservation, eta) => minutes(eta) - minutes(reservation.currentTime);

/** Every entry of every version, oldest first, with actor, version and timestamp. */
export function historyList(record) {
  return h('section', { class: 'late-history', 'aria-labelledby': `history-${record.id}` },
    h('h3', { class: 'late-history__title', id: `history-${record.id}` }, L.historyTitle),
    h('ol', {}, record.history.map((entry) => {
      const display = { ...entry, eta: entry.eta && formatClockTime(entry.eta), proposedTime: entry.proposedTime && formatClockTime(entry.proposedTime) };
      return h('li', { class: `late-history__item late-history__item--${entry.actor}` },
        h('span', { class: 'late-history__meta' }, `${L.version(entry.version)} · ${L.actor[entry.actor]} · ${formatDotDateTime(entry.at)}`),
        h('span', { class: 'late-history__text' }, L.history[entry.action](display)));
    })));
}

/** Customer sheet: ETA as radio chips (10-minute steps), optional reason. */
export function openEtaSheet(reservation, onSubmit) {
  let eta = null;
  let reason = '';
  const submit = h('button', { class: 'button button--primary', type: 'button', disabled: true, onclick: () => { dialog.close(); onSubmit(eta, reason); } }, L.submit);
  const etaGroup = h('fieldset', { class: 'eta-options' },
    h('legend', { class: 'late-sheet__legend' }, L.etaLegend),
    etaOptions(reservation.currentTime).map((time) => h('label', { class: 'eta-option' },
      h('input', { class: 'visually-hidden', type: 'radio', name: 'eta', value: time, onchange: () => { eta = time; submit.disabled = false; } }),
      L.etaOption(formatClockTime(time), lateBy(reservation, time)))));
  const reasonButtons = L.reasons.map((label) => h('button', {
    class: 'purpose-chip', type: 'button', 'aria-pressed': 'false',
    onclick: (event) => {
      reason = reason === label ? '' : label;
      reasonButtons.forEach((b) => b.setAttribute('aria-pressed', String(b === event.currentTarget && reason === label)));
    },
  }, label));
  const dialog = openSheet({
    title: L.sheetTitle,
    className: 'sheet--late',
    body: h('div', { class: 'late-sheet' },
      h('p', { class: 'late-sheet__booked' }, icon('clock'), L.sheetBooked(formatClockTime(reservation.currentTime))),
      etaGroup,
      h('div', { class: 'late-sheet__reasons' },
        h('p', { class: 'late-sheet__legend' }, L.reasonLegend),
        h('div', { class: 'purpose-chips', role: 'group', 'aria-label': L.reasonLegend }, reasonButtons)),
      h('p', { class: 'checkout-section__hint' }, L.sheetNote)),
    footer: h('div', { class: 'sheet__actions' },
      h('button', { class: 'button', type: 'button', onclick: () => dialog.close() }, STRINGS.common.cancel), submit),
  });
}

/** Customer status card; `onAccept` / `onReject` only for the live proposal. */
export function lateStatusCard(record, { onAccept, onReject }) {
  const proposed = record.proposedTime && formatClockTime(record.proposedTime);
  return h('div', { class: `late-status late-status--${record.status.toLowerCase()}`, role: 'status' },
    h('p', { class: 'late-status__title' }, L.status[record.status](proposed)),
    h('p', { class: 'late-status__body' }, L.statusBody[record.status](formatClockTime(record.expectedArrival))),
    record.status === 'CHANGE_PROPOSED' && h('div', { class: 'late-status__actions' },
      h('button', { class: 'button', type: 'button', onclick: onReject }, L.reject),
      h('button', { class: 'button button--primary', type: 'button', onclick: onAccept }, L.accept)));
}
