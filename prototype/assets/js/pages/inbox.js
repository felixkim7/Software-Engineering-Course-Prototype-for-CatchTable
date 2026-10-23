// C09 나의 알림: delivered notifications of the active customer, each linking to its record.
// Opening the page marks them read. Failed deliveries appear only after the presenter retries.
import { STRINGS } from '../core/strings.js';
import { getState, subscribe } from '../core/store.js';
import { formatDotDateTime, formatKRW } from '../core/format.js';
import { pageUrl } from '../core/nav.js';
import { customerNotifications, markAllRead } from '../services/notification.js';
import { reconcile } from '../services/reconcile.js';
import { h } from '../ui/dom.js';
import { icon } from '../ui/icons.js';
import { pageHeader } from '../ui/header.js';
import { clockOf, conditionText } from '../ui/cancellation-ui.js';

const I = STRINGS.inbox;
const app = document.getElementById('app');
const ICONS = { OFFER_ISSUED: 'bell', OFFER_EXPIRED: 'clock', WAITING_CALLED: 'people', BOOKING_CONFIRMED: 'check', PAYMENT_REFUNDED: 'won' };
const TARGETS = {
  offer: (id) => pageUrl('customer/offer.html', { offerId: id }),
  reservation: (id) => pageUrl('customer/reservation.html', { reservationId: id }),
  waitingTicket: (id) => pageUrl('customer/waiting.html', { ticketId: id }),
};
let unreadAtOpen = new Set();  // keeps this visit's "new" markers after they are marked read


function item(state, notification) {
  const { data, kind } = notification;
  const name = state.restaurants.find((r) => r.id === data.restaurantId)?.name ?? '';
  const copy = I.kinds[kind];
  const body = {
    WAITING_CALLED: () => copy.body(name, data.ticketNumber),
    OFFER_ISSUED: () => copy.body(name, conditionText(data), clockOf(data.expiresAt)),
    PAYMENT_REFUNDED: () => copy.body(name, conditionText(data), formatKRW(data.depositKRW)),
  }[kind]?.() ?? copy.body(name, conditionText(data));
  const unread = !notification.readAt || unreadAtOpen.has(notification.id);
  return h('li', {},
    h('a', { class: `inbox-item${unread ? ' is-unread' : ''}`, href: TARGETS[notification.entityType](notification.entityId) },
      icon(ICONS[kind] ?? 'bell', 'icon inbox-item__icon'),
      h('span', { class: 'inbox-item__text' },
        h('span', { class: 'inbox-item__title' }, copy.title, unread && h('span', { class: 'visually-hidden' }, ` (${I.unread})`)),
        h('span', { class: 'inbox-item__body' }, body),
        h('span', { class: 'inbox-item__time' }, formatDotDateTime(notification.createdAt))),
      icon('chevronRight')));
}

function render() {
  const state = getState();
  const list = customerNotifications(state);
  app.replaceChildren(
    pageHeader({ title: I.heading, backHref: pageUrl('customer/my-dining.html'), backLabel: STRINGS.restaurant.back }),
    h('main', { class: 'mobile-content' }, list.length
      ? h('ul', { class: 'inbox-list' }, list.map((n) => item(state, n)))
      : h('div', { class: 'empty-state' }, h('p', { class: 'empty-state__title' }, I.empty), h('p', { class: 'text-secondary' }, I.emptyBody))));
}

document.title = I.pageTitle;
reconcile();
unreadAtOpen = new Set(customerNotifications(getState()).filter((n) => !n.readAt).map((n) => n.id));
markAllRead();
render();
subscribe(render);
