// C04 빈자리 대기: the active customer's cancellation-seat requests (separate from waiting tickets).
// Live requests show their place among identical conditions or the offer and its deadline;
// ended ones stay listed with their outcome. Request IDs match the manager's allocation view.
import { STRINGS } from '../core/strings.js';
import { getState, subscribe } from '../core/store.js';
import { pageUrl } from '../core/nav.js';
import { customerRequests, findOffer, isLiveRequest, queueRank, withdrawRequest } from '../services/allocation.js';
import { reconcile } from '../services/reconcile.js';
import { h } from '../ui/dom.js';
import { pageHeader } from '../ui/header.js';
import { confirmDialog } from '../ui/modal.js';
import { showToast } from '../ui/toast.js';
import { restaurantPhoto } from '../ui/restaurant.js';
import { clockOf, conditionText } from '../ui/cancellation-ui.js';

const C = STRINGS.cancellation;
const app = document.getElementById('app');

async function onWithdraw(request, restaurant) {
  const confirmed = await confirmDialog({
    title: C.withdrawTitle,
    message: request.status === 'OFFERED' ? C.withdrawOfferBody : C.withdrawBody,
    confirmLabel: C.withdrawYes, cancelLabel: C.withdrawNo, tone: 'danger',
  });
  if (!confirmed) return;
  const result = withdrawRequest(request.id);
  showToast(result.ok ? C.withdrawnToast : STRINGS.errors[result.reason]);
}

function requestCard(state, request) {
  const restaurant = state.restaurants.find((r) => r.id === request.restaurantId);
  const offer = request.offerId && findOffer(state, request.offerId);
  const live = isLiveRequest(request);
  const status = C.status[request.status](queueRank(state, request));
  return h('li', { class: `request-card request-card--${request.status.toLowerCase()}`, 'data-request': request.id },
    h('div', { class: 'request-card__main' },
      restaurantPhoto(restaurant, 'request-card__photo'),
      h('div', { class: 'request-card__text' },
        h('p', { class: 'request-card__status' }, status),
        h('a', { class: 'request-card__name', href: pageUrl('customer/restaurant.html', { restaurantId: restaurant.id }) }, restaurant.name),
        h('p', { class: 'request-card__condition' }, conditionText(request)),
        h('p', { class: 'request-card__id' }, C.requestNumber(request.id)))),
    request.status === 'OFFERED' && h('p', { class: 'request-card__deadline' }, C.offerDeadline(clockOf(offer.expiresAt))),
    live && h('div', { class: 'request-card__actions' },
      h('button', { class: 'button button--small', type: 'button', 'aria-label': C.withdrawLabel(restaurant.name), onclick: () => onWithdraw(request, restaurant) }, C.withdraw),
      request.status === 'OFFERED' && h('a', { class: 'button button--primary button--small', href: pageUrl('customer/offer.html', { offerId: offer.id }) }, C.openOffer)));
}

function render() {
  const state = getState();
  const requests = customerRequests(state);
  const live = requests.filter(isLiveRequest);
  const past = requests.filter((r) => !isLiveRequest(r));
  app.replaceChildren(
    pageHeader({ title: C.pageTitle, backHref: pageUrl('customer/my-dining.html'), backLabel: STRINGS.restaurant.back }),
    h('main', { class: 'mobile-content queue-page' },
      h('p', { class: 'queue-page__intro' }, C.intro),
      requests.length === 0 && h('div', { class: 'empty-state' },
        h('p', { class: 'empty-state__title' }, C.emptyTitle),
        h('p', { class: 'text-secondary' }, C.emptyBody),
        h('a', { class: 'button button--primary button--small', href: pageUrl('customer/discovery.html') }, C.browse)),
      live.length > 0 && h('section', { class: 'queue-section', 'aria-labelledby': 'live-heading' },
        h('h2', { class: 'queue-section__title', id: 'live-heading' }, C.activeHeading, h('span', {}, ` ${live.length}`)),
        h('ul', { class: 'request-list' }, live.map((r) => requestCard(state, r)))),
      past.length > 0 && h('section', { class: 'queue-section', 'aria-labelledby': 'past-heading' },
        h('h2', { class: 'queue-section__title', id: 'past-heading' }, C.pastHeading),
        h('ul', { class: 'request-list' }, past.map((r) => requestCard(state, r))))));
}

document.title = `${C.pageTitle} · ${STRINGS.appName}`;
reconcile();
render();
subscribe(render);
window.setInterval(reconcile, 5000);  // absolute deadlines; reconcile writes only when an offer is due
