// 마이다이닝 tab, modelled on captures 173505/173513/173524. Waiting tickets of the active customer
// fill 방문예정 (live), 방문완료 (seated) and 취소/노쇼 (cancelled); reservations join in Phases 4-5.
import { STRINGS } from '../core/strings.js';
import { getState, subscribe } from '../core/store.js';
import { formatDotDateTime } from '../core/format.js';
import { pageUrl } from '../core/nav.js';
import { customerTickets, queuePosition } from '../services/waiting.js';
import { h } from '../ui/dom.js';
import { icon } from '../ui/icons.js';
import { notInDemo } from '../ui/toast.js';
import { bottomNav } from '../ui/bottom-nav.js';
import { restaurantPhoto } from '../ui/restaurant.js';

const M = STRINGS.myDining;
const W = STRINGS.waiting;
const EMPTY = { upcoming: M.emptyUpcoming, visited: M.emptyVisited, cancelled: M.emptyCancelled };
const FILTER_STATUSES = { upcoming: ['WAITING', 'CALLED'], visited: ['SEATED'], cancelled: ['CANCELLED'] };
const body = h('div', { class: 'my-dining__body' });
let filter = 'upcoming';

function ticketCard(state, ticket) {
  const restaurant = state.restaurants.find((r) => r.id === ticket.restaurantId);
  return h('li', {},
    h('a', { class: `dining-card dining-card--${ticket.status.toLowerCase()}`, href: pageUrl('customer/waiting.html', { ticketId: ticket.id }) },
      restaurantPhoto(restaurant, 'dining-card__photo'),
      h('span', { class: 'dining-card__text' },
        h('span', { class: 'dining-card__chips' },
          h('span', { class: 'dining-card__chip' }, W.remoteChip),
          h('span', { class: 'dining-card__status' }, W.status[ticket.status](queuePosition(state, ticket)))),
        h('span', { class: 'dining-card__name' }, restaurant.name),
        h('span', { class: 'dining-card__meta' }, `${restaurant.district} · ${restaurant.cuisine}`),
        h('span', { class: 'dining-card__line' }, W.cardLine(ticket.ticketNumber, ticket.partySize)),
        h('span', { class: 'dining-card__time' }, W.registeredAt(formatDotDateTime(ticket.registeredAt)))),
      icon('chevronRight')));
}

function show() {
  const state = getState();
  const tickets = customerTickets(state).filter((t) => FILTER_STATUSES[filter].includes(t.status));
  body.replaceChildren(tickets.length
    ? h('ul', { class: 'dining-list' }, tickets.map((ticket) => ticketCard(state, ticket)))
    : h('div', { class: 'empty-state my-dining__empty' },
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
      Object.entries(M.filters).map(([key, label]) => h('label', { class: 'choice-chip' },
        h('input', { class: 'visually-hidden', type: 'radio', name: 'dining-filter', value: key, checked: key === filter, onchange: () => { filter = key; show(); } }),
        label))),
    body),
  bottomNav('myDining'),
);
show();
subscribe(show);
