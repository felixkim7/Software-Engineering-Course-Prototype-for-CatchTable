// 마이다이닝 tab, modelled on captures 173505/173513/173524. 방문예정 lists the active customer's
// confirmed reservations (C08) and live waiting tickets; 방문완료 and 취소/노쇼 list ended tickets.
import { STRINGS } from '../core/strings.js';
import { getState, subscribe } from '../core/store.js';
import { formatDotDateTime } from '../core/format.js';
import { pageUrl } from '../core/nav.js';
import { customerTickets, queuePosition } from '../services/waiting.js';
import { h } from '../ui/dom.js';
import { icon } from '../ui/icons.js';
import { bottomNav } from '../ui/bottom-nav.js';
import { restaurantPhoto } from '../ui/restaurant.js';
import { conditionText, liveRequestSummary } from '../ui/cancellation-ui.js';
import { customerReservations } from '../services/payment.js';
import { formatKRW } from '../core/format.js';
import { unreadCount } from '../services/notification.js';
import { reconcile } from '../services/reconcile.js';

const M = STRINGS.myDining;
const W = STRINGS.waiting;
const EMPTY = { upcoming: M.emptyUpcoming, visited: M.emptyVisited, cancelled: M.emptyCancelled };
const FILTER_STATUSES = { upcoming: ['WAITING', 'CALLED'], visited: ['SEATED'], cancelled: ['CANCELLED'] };
const body = h('div', { class: 'my-dining__body' });
const queueEntry = h('div', { class: 'queue-entry-slot' });
const alarmTab = h('a', { class: 'underline-tab', href: pageUrl('customer/inbox.html') });
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

function reservationCard(state, reservation) {
  const restaurant = state.restaurants.find((r) => r.id === reservation.restaurantId);
  const V = STRINGS.reservation;
  return h('li', {},
    h('a', { class: 'dining-card dining-card--reservation', href: pageUrl('customer/reservation.html', { reservationId: reservation.id }) },
      restaurantPhoto(restaurant, 'dining-card__photo'),
      h('span', { class: 'dining-card__text' },
        h('span', { class: 'dining-card__chips' },
          h('span', { class: 'dining-card__chip' }, V.cardChip),
          h('span', { class: 'dining-card__status' }, V.statusLabel[reservation.status])),
        h('span', { class: 'dining-card__name' }, restaurant.name),
        h('span', { class: 'dining-card__line' }, conditionText({ serviceDate: reservation.serviceDate, serviceTime: reservation.currentTime, partySize: reservation.partySize })),
        h('span', { class: 'dining-card__time' }, `${V.number(reservation.id)}${reservation.depositKRW ? ` · ${V.cardDeposit(formatKRW(reservation.depositKRW))}` : ''}`)),
      icon('chevronRight')));
}

// 빈자리 대기 entry (cancellation-seat requests live on their own page) and the 나의 알림 badge
function refreshLinks(state) {
  const { count, offer } = liveRequestSummary(state);
  queueEntry.replaceChildren(...(count ? [h('a', { class: `queue-entry${offer ? ' has-offer' : ''}`, href: pageUrl('customer/cancellation-queue.html') },
    h('span', { class: 'queue-entry__title' }, STRINGS.cancellation.entryCard(count)),
    offer && h('span', { class: 'queue-entry__offer' }, STRINGS.cancellation.entryOffer),
    icon('chevronRight'))] : []));
  const unread = unreadCount(state);
  alarmTab.replaceChildren(M.tabs[1], unread ? h('span', { class: 'count-dot' }, String(unread)) : '');
}

function show() {
  const state = getState();
  refreshLinks(state);
  const tickets = customerTickets(state).filter((t) => FILTER_STATUSES[filter].includes(t.status));
  const reservations = filter === 'upcoming' ? customerReservations(state).filter((r) => r.status === 'CONFIRMED') : [];
  body.replaceChildren(tickets.length + reservations.length
    ? h('ul', { class: 'dining-list' }, reservations.map((r) => reservationCard(state, r)), tickets.map((ticket) => ticketCard(state, ticket)))
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
      alarmTab),
    queueEntry,
    h('fieldset', { class: 'choice-chips' },
      h('legend', { class: 'visually-hidden' }, M.tabs[0]),
      Object.entries(M.filters).map(([key, label]) => h('label', { class: 'choice-chip' },
        h('input', { class: 'visually-hidden', type: 'radio', name: 'dining-filter', value: key, checked: key === filter, onchange: () => { filter = key; show(); } }),
        label))),
    body),
  bottomNav('myDining'),
);
reconcile();
show();
subscribe(show);
