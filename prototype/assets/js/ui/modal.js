import { h } from './dom.js';
import { STRINGS } from '../core/strings.js';

let dialogCount = 0;

/**
 * Confirmation dialog on native <dialog>: showModal() makes the rest of the page inert,
 * Escape closes it, initial focus lands on the first (cancel) button, and focus returns
 * to the control that opened it. Resolves true only when the confirm button is chosen.
 */
export function confirmDialog({ title, message, confirmLabel, cancelLabel = STRINGS.common.cancel, tone = 'primary' }) {
  const id = `dialog-${++dialogCount}`;
  const opener = document.activeElement;
  const dialog = h('dialog', { class: 'dialog', 'aria-labelledby': `${id}-title`, 'aria-describedby': `${id}-message` },
    h('form', { method: 'dialog' },
      h('h2', { class: 'dialog__title', id: `${id}-title` }, title),
      h('p', { class: 'dialog__message', id: `${id}-message` }, message),
      h('div', { class: 'dialog__actions' },
        h('button', { class: 'button', value: 'cancel' }, cancelLabel),
        h('button', { class: `button button--${tone}`, value: 'confirm' }, confirmLabel))));

  document.body.append(dialog);
  return new Promise((resolve) => {
    dialog.addEventListener('close', () => {
      dialog.remove();
      opener?.focus();
      resolve(dialog.returnValue === 'confirm');
    }, { once: true });
    dialog.showModal();
  });
}
