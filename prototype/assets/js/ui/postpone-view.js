// 웨이팅 순서 미루기, as the real app's page (velog screenshots): choose any later place in line,
// see the added estimate, confirm in a sheet. Choices always come from the live queue.
import { STRINGS } from '../core/strings.js';
import { postponeChoices, postponeWaiting, estimateMinutes } from '../services/waiting.js';
import { h } from './dom.js';
import { icon } from './icons.js';
import { openSheet } from './sheet.js';
import { showToast } from './toast.js';

const W = STRINGS.waiting;

/** `onDone(message)` returns to the ticket; `onBack()` leaves without changes; `onRefresh()` re-reads. */
export function postponeView(state, ticket, restaurant, { onDone, onBack, onRefresh }) {
  const choices = postponeChoices(state, ticket, restaurant);
  let target = null;
  const submit = h('button', { class: 'button button--primary', type: 'button', disabled: true, onclick: openConfirm }, W.postponeSubmit);

  function openConfirm() {
    const confirm = h('button', { class: 'button button--primary', type: 'button', onclick: () => { dialog.close(); apply(); } }, W.postponeYes);
    const dialog = openSheet({
      title: W.postponeConfirm(target),
      className: 'sheet--postpone',
      body: h('p', { class: 'postpone-confirm' }, W.postponeConfirmBefore, h('strong', {}, W.uses(choices.remaining)), W.postponeConfirmAfter),
      footer: h('div', { class: 'sheet__actions' },
        h('button', { class: 'button', type: 'button', onclick: () => dialog.close() }, STRINGS.common.cancel), confirm),
    });
  }

  function apply() {
    const result = postponeWaiting(ticket.id, choices.position, target);
    if (result.ok) onDone(W.postponedToast);
    else { showToast(STRINGS.errors[result.reason] ?? STRINGS.errors.INVALID_STATE); onRefresh(); }
  }

  const list = choices.positions.length
    ? h('fieldset', { class: 'postpone-choices' },
      h('legend', { class: 'visually-hidden' }, W.choicesLegend),
      choices.positions.map(({ position, extraMinutes }) => h('label', { class: 'postpone-choice' },
        h('input', { type: 'radio', name: 'postpone', value: position, onchange: () => { target = position; submit.disabled = false; } }),
        h('span', { class: 'postpone-choice__label' }, W.choice(position)),
        h('span', { class: 'postpone-choice__extra' }, W.extra(extraMinutes)))))
    : h('p', { class: 'postpone-empty' }, STRINGS.errors[choices.reason]);

  return [
    h('header', { class: 'page-header' },
      h('button', { class: 'icon-button', type: 'button', 'aria-label': STRINGS.restaurant.back, onclick: onBack }, icon('back')),
      h('h1', { class: 'page-header__title' }, W.postponeTitle)),
    h('main', { class: 'mobile-content postpone' },
      h('p', { class: 'postpone__intro pre-line' }, W.postponeIntro),
      h('p', { class: 'postpone__note' }, W.postponeNote),
      choices.position && h('div', { class: 'postpone-current' },
        h('p', {}, W.currentPosition, ' ', h('strong', {}, W.positionValue(choices.position)),
          h('span', { class: 'postpone-current__bar', 'aria-hidden': 'true' }, '|'),
          h('span', { class: 'postpone-current__minutes' }, W.aboutMinutes(estimateMinutes(restaurant, choices.position)))),
        h('button', { class: 'icon-button refresh-button', type: 'button', 'aria-label': W.refresh, onclick: onRefresh }, icon('refresh'))),
      list),
    h('div', { class: 'bottom-bar bottom-bar--stacked' },
      h('p', { class: 'postpone-uses' }, W.remainingUses, h('strong', {}, W.uses(choices.remaining))),
      h('div', { class: 'sheet__actions' },
        h('button', { class: 'button', type: 'button', onclick: onBack }, STRINGS.common.cancel),
        submit)),
  ];
}
