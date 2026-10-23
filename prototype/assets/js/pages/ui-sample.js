// Phase 0 neutral sample: spacing, type scale and shared components. No domain flow.
import { STRINGS } from '../core/strings.js';
import { pageUrl } from '../core/nav.js';
import { h } from '../ui/dom.js';
import { pageHeader } from '../ui/header.js';
import { confirmDialog } from '../ui/modal.js';
import { showToast } from '../ui/toast.js';

const S = STRINGS.sample;

async function openSampleDialog({ title, confirmLabel, tone }) {
  const confirmed = await confirmDialog({ title, message: S.dialogMessage, confirmLabel, tone });
  showToast(confirmed ? S.dialogConfirmed : S.dialogCancelled);
}

function button(label, onclick, modifier = '') {
  return h('button', { class: `button ${modifier}`, type: 'button', onclick }, label);
}

function typeSection() {
  return h('section', { class: 'mobile-section' },
    h('h2', { class: 'text-title' }, S.typeTitle),
    h('p', { class: 'text-section' }, S.typeSection),
    h('p', {}, S.typeBody),
    h('p', { class: 'text-caption' }, S.typeCaption));
}

function cardSection() {
  return h('section', { class: 'mobile-section' },
    h('h2', { class: 'mobile-section__title' }, S.cardHeading),
    h('div', { class: 'card' },
      h('h3', {}, S.cardTitle),
      h('p', { class: 'text-secondary' }, S.cardBody)),
    h('p', { class: 'notice' }, S.notice));
}

function buttonSection() {
  return h('section', { class: 'mobile-section' },
    h('h2', { class: 'mobile-section__title' }, S.buttonsHeading),
    h('div', { class: 'button-row' },
      button(S.openDialog, () => openSampleDialog({ title: S.dialogTitle, confirmLabel: STRINGS.common.confirm, tone: 'primary' })),
      button(S.openDangerDialog, () => openSampleDialog({ title: S.dangerDialogTitle, confirmLabel: S.dangerConfirm, tone: 'danger' })),
      button(S.showToast, () => showToast(S.toastMessage)),
      h('button', { class: 'button', type: 'button', disabled: true }, S.disabled)));
}

document.title = S.pageTitle;
document.getElementById('app').replaceChildren(
  pageHeader({ title: S.title, backHref: pageUrl('index.html'), backLabel: S.backToHub }),
  h('main', { class: 'mobile-content' },
    typeSection(),
    h('div', { class: 'section-band' }),
    cardSection(),
    h('div', { class: 'section-band' }),
    buttonSection()),
  h('div', { class: 'bottom-bar' },
    button(S.primaryAction, () => showToast(S.primaryPressed), 'button--primary')),
);
