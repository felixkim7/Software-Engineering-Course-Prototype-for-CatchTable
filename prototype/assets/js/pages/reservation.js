// C07 Reservation detail / confirmation. No capture of the app's reservation detail exists, so the
// layout follows the 방문예정 ticket page (183416) and the checkout's refund table (171752).
// Only the owner can open it. Phase 5 adds the late-arrival (ETA) section here.
import { STRINGS } from '../core/strings.js';
import { getState, subscribe } from '../core/store.js';
import { formatClockTime, formatKRW } from '../core/format.js';
import { pageUrl, queryParam } from '../core/nav.js';
import { findReservation } from '../services/payment.js';
import { h } from '../ui/dom.js';
import { icon } from '../ui/icons.js';
import { pageHeader } from '../ui/header.js';
import { dateLabel } from '../ui/cancellation-ui.js';

const V = STRINGS.reservation;
const K = STRINGS.checkout;
const app = document.getElementById('app');
const reservationId = queryParam('reservationId');
const myDiningHref = pageUrl('customer/my-dining.html');
const confirmed = queryParam('confirmed') === '1';
if (confirmed) {
  const url = new URL(window.location.href);
  url.searchParams.delete('confirmed');
  window.history.replaceState(null, '', url);  // a reload shows the detail without the banner
}

function message(title, body) {
  app.replaceChildren(
    pageHeader({ backHref: myDiningHref, backLabel: STRINGS.restaurant.back }),
    h('main', { class: 'mobile-content empty-state' },
      h('h1', { class: 'empty-state__title' }, title),
      h('p', { class: 'text-secondary' }, body),
      h('a', { class: 'button button--primary', href: myDiningHref }, V.toMyDining)));
}

function render() {
  const state = getState();
  const reservation = findReservation(state, reservationId);
  if (!reservation) { message(V.notFoundTitle, V.notFoundBody); return; }
  if (reservation.customerId !== state.meta.activeCustomerId) { message(V.notOwnedTitle, V.notOwnedBody); return; }
  const restaurant = state.restaurants.find((r) => r.id === reservation.restaurantId);
  const row = (label, value) => h('div', {}, h('dt', {}, label), h('dd', {}, value));
  const deposit = !reservation.depositKRW ? V.depositNone
    : reservation.paymentOperationId ? V.depositPaid(formatKRW(reservation.depositKRW), reservation.paymentOperationId) : V.depositPaidEarlier(formatKRW(reservation.depositKRW));
  document.title = `${V.pageTitle} · ${STRINGS.appName}`;
  app.replaceChildren(
    pageHeader({ title: V.pageTitle, backHref: myDiningHref, backLabel: STRINGS.restaurant.back }),
    h('main', { class: 'mobile-content ticket reservation' },
      confirmed && h('section', { class: 'reservation-done', role: 'status' },
        icon('check', 'icon reservation-done__icon'),
        h('h2', {}, V.confirmedTitle),
        h('p', {}, V.confirmedBody)),
      h('a', { class: 'ticket__store', href: pageUrl('customer/restaurant.html', { restaurantId: restaurant.id }) },
        h('span', { class: 'ticket__name' }, restaurant.name, icon('chevronRight')),
        h('span', { class: 'ticket__meta' }, `${restaurant.cuisine} · ${restaurant.district}`)),
      h('div', { class: 'ticket__band' },
        h('section', { class: 'ticket-card', 'aria-labelledby': 'reservation-heading' },
          h('div', { class: 'ticket-card__head' },
            h('h2', { id: 'reservation-heading' }, V.statusLabel[reservation.status]),
            h('span', { class: 'reservation__number' }, V.number(reservation.id))),
          h('dl', { class: 'reservation-facts' },
            row(V.fields.date, dateLabel(reservation.serviceDate)),
            row(V.fields.time, formatClockTime(reservation.currentTime)),
            row(V.fields.party, K.people(reservation.partySize)),
            row(V.fields.purposes, reservation.purposes.length ? reservation.purposes.join(', ') : V.none),
            row(V.fields.request, reservation.requestNote || V.none),
            row(V.fields.deposit, deposit)),
          reservation.sourceOfferId && h('p', { class: 'reservation__source' }, icon('bell'), V.sourcePriority)),
        h('section', { class: 'refund-table refund-table--card' },
          h('p', {}, V.refundTitle),
          h('dl', {}, K.refundTable.map(([when, rule]) => h('div', {}, h('dt', {}, when), h('dd', {}, rule)))))),
      h('div', { class: 'ticket__after' }, h('a', { class: 'button button--block', href: myDiningHref }, V.toMyDining))));
}

render();
subscribe(render);
