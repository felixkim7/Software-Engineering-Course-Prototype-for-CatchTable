// 마이다이닝 tab, modelled on captures 173505/173513/173524. Waiting tickets (Phase 2) and
// reservations (Phases 4-5) will fill these lists; until then each filter shows its empty state.
import { STRINGS } from '../core/strings.js';
import { pageUrl } from '../core/nav.js';
import { h } from '../ui/dom.js';
import { icon } from '../ui/icons.js';
import { notInDemo } from '../ui/toast.js';
import { bottomNav } from '../ui/bottom-nav.js';

const M = STRINGS.myDining;
const EMPTY = { upcoming: M.emptyUpcoming, visited: M.emptyVisited, cancelled: M.emptyCancelled };
const body = h('div', { class: 'my-dining__body' });

function show(filter) {
  body.replaceChildren(h('div', { class: 'empty-state my-dining__empty' },
    h('p', { class: 'empty-state__title pre-line' }, EMPTY[filter]),
    filter === 'upcoming' && h('a', { class: 'button button--primary button--small', href: pageUrl('customer/discovery.html') }, M.findNearby)));
}

document.title = M.pageTitle;
document.getElementById('app').replaceChildren(
  h('header', { class: 'page-header page-header--top my-dining__header' },
    h('h1', { class: 'page-header__title' }, M.heading),
    h('a', { class: 'icon-button', href: pageUrl('customer/search.html'), 'aria-label': M.search }, icon('search'))),
  h('main', { class: 'mobile-content my-dining' },
    h('div', { class: 'underline-tabs' },
      h('span', { class: 'underline-tab is-active', 'aria-current': 'page' }, M.tabs[0]),
      h('button', { class: 'underline-tab', type: 'button', onclick: notInDemo }, M.tabs[1])),
    h('fieldset', { class: 'choice-chips' },
      h('legend', { class: 'visually-hidden' }, M.tabs[0]),
      Object.entries(M.filters).map(([key, label], index) => h('label', { class: 'choice-chip' },
        h('input', { class: 'visually-hidden', type: 'radio', name: 'dining-filter', value: key, checked: index === 0, onchange: () => show(key) }),
        label))),
    body),
  bottomNav('myDining'),
);
show('upcoming');
