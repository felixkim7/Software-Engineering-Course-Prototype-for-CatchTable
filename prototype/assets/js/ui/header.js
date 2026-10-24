import { h } from './dom.js';
import { icon } from './icons.js';

/** Customer page header: back link + optional title, as in the app's back-arrow screens. */
export function pageHeader({ title, backHref, backLabel }) {
  return h('header', { class: 'page-header' },
    h('a', { class: 'icon-button', href: backHref, 'aria-label': backLabel }, icon('back')),
    title && h('h1', { class: 'page-header__title' }, title));
}
