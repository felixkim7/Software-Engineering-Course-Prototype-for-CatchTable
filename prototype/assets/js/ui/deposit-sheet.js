// 예약금 안내 sheet, as capture 171739: per-person deposit x party, refund policy, 이전 / 확인.
import { STRINGS } from '../core/strings.js';
import { formatKRW } from '../core/format.js';
import { h } from './dom.js';
import { icon } from './icons.js';
import { openSheet } from './sheet.js';

const K = STRINGS.checkout;

export function openDepositSheet(restaurant, partySize, onConfirm) {
  const per = restaurant.policies.depositPerPersonKRW;
  const confirm = h('button', { class: 'button button--primary', type: 'button', onclick: () => { dialog.close(); onConfirm(); } }, STRINGS.common.confirm);
  const dialog = openSheet({
    title: K.depositTitle,
    className: 'sheet--confirm sheet--deposit',
    body: h('div', { class: 'deposit' },
      h('p', { class: 'deposit__notice' }, icon('alert'), K.depositNotice),
      h('dl', { class: 'deposit__table' },
        h('div', {}, h('dt', {}, K.perPerson), h('dd', {}, formatKRW(per))),
        h('div', {}, h('dt', {}, K.partyTimes), h('dd', {}, K.people(partySize))),
        h('div', { class: 'deposit__sum' }, h('dt', {}, K.sum), h('dd', {}, formatKRW(per * partySize)))),
      h('div', { class: 'deposit__refund' },
        h('p', { class: 'deposit__refund-title' }, K.refundTitle),
        h('ul', {}, K.refundLines.map((line) => h('li', {}, `·${line}`)))),
      h('p', { class: 'deposit__total' }, `${K.totalDeposit} `, h('strong', {}, formatKRW(per * partySize)))),
    footer: h('div', { class: 'sheet__actions' },
      h('button', { class: 'button', type: 'button', onclick: () => dialog.close() }, K.prev), confirm),
  });
}
