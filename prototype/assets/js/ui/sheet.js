import { h, refocus } from './dom.js';
import { icon } from './icons.js';
import { STRINGS } from '../core/strings.js';

let sheetCount = 0;

/**
 * Bottom sheet on native <dialog> (modal: page inert, Escape closes, focus returns to opener).
 * With `title` it gets a header and close button; without, `label` names it (the app's
 * date picker has no header). Returns the dialog; footer actions call dialog.close().
 */
export function openSheet({ title, label, body, footer, className = '' }) {
  const id = `sheet-${++sheetCount}`;
  const opener = document.activeElement;
  const dialog = h('dialog', { class: `sheet ${className}`, 'aria-labelledby': title ? `${id}-title` : null, 'aria-label': title ? null : label },
    title && h('div', { class: 'sheet__header' },
      h('h2', { class: 'sheet__title', id: `${id}-title` }, title),
      h('button', { class: 'icon-button', type: 'button', 'aria-label': STRINGS.common.close, onclick: () => dialog.close() }, icon('close'))),
    h('div', { class: 'sheet__body' }, body),
    footer && h('div', { class: 'sheet__footer' }, footer));
  dialog.addEventListener('close', () => {
    dialog.remove();
    refocus(opener);
  }, { once: true });
  document.body.append(dialog);
  dialog.showModal();
  return dialog;
}
