// C14 MY tab, modelled on capture 220751. It shows the presenter-selected demo customer, never the
// capture's account or review. 저장 / 최근 본 매장 / 쿠폰함 / the bell use demo data; the rest of
// the app's account features explain on tap that they are not part of this demo.
import { STRINGS } from '../core/strings.js';
import { getState, subscribe } from '../core/store.js';
import { pageUrl } from '../core/nav.js';
import { unreadCount } from '../services/notification.js';
import { h } from '../ui/dom.js';
import { icon } from '../ui/icons.js';
import { notInDemo } from '../ui/toast.js';
import { openSheet } from '../ui/sheet.js';
import { bottomNav } from '../ui/bottom-nav.js';
import { imageUrl } from '../ui/restaurant.js';

const M = STRINGS.my;
const app = document.getElementById('app');

function claimedCoupons(state) {
  return state.couponClaims.filter((c) => c.customerId === state.meta.activeCustomerId).map((claim) => {
    const restaurant = state.restaurants.find((r) => r.coupon?.id === claim.couponId);
    return { title: restaurant?.coupon.title ?? claim.couponId, restaurant: restaurant?.name ?? '' };
  });
}

function openCoupons() {
  const coupons = claimedCoupons(getState());
  const dialog = openSheet({
    title: M.couponsTitle,
    className: 'sheet--coupons',
    body: coupons.length
      ? h('ul', { class: 'coupon-list' }, coupons.map((c) => h('li', { class: 'coupon' },
        icon('coupon', 'icon coupon__icon'), h('div', { class: 'coupon__text' }, h('p', { class: 'coupon__title' }, c.title), h('p', { class: 'coupon__desc' }, c.restaurant)))))
      : h('p', { class: 'sheet-empty' }, M.noCoupons),
    footer: h('button', { class: 'button button--block', type: 'button', onclick: () => dialog.close() }, STRINGS.common.close),
  });
}

function tile(iconName, label, value, action) {
  const content = [icon(iconName, 'icon my-tile__icon'), h('span', { class: 'my-tile__label' }, label), h('span', { class: 'my-tile__value' }, value)];
  return h('li', {}, typeof action === 'string'
    ? h('a', { class: 'my-tile', href: action }, content)
    : h('button', { class: 'my-tile', type: 'button', onclick: action }, content));
}

function render() {
  const state = getState();
  const customer = state.customers.find((c) => c.id === state.meta.activeCustomerId);
  const unread = unreadCount(state);
  document.title = M.pageTitle;
  app.replaceChildren(
    h('header', { class: 'page-header page-header--top my-header' },
      h('h1', { class: 'page-header__title' }, M.heading),
      h('a', { class: 'icon-button', href: pageUrl('customer/search.html'), 'aria-label': M.search }, icon('search')),
      h('a', { class: 'icon-button bell-link', href: pageUrl('customer/inbox.html'), 'aria-label': unread ? `${M.notifications} (${unread})` : M.notifications },
        icon('bell'), unread > 0 && h('span', { class: 'bell-link__dot', 'aria-hidden': 'true' })),
      h('button', { class: 'icon-button', type: 'button', 'aria-label': M.settings, onclick: notInDemo }, icon('settings'))),
    h('main', { class: 'mobile-content my' },
      h('section', { class: 'my-profile' },
        h('span', { class: 'my-profile__avatar', role: 'img', 'aria-label': M.avatar }, icon('user')),
        h('p', { class: 'my-profile__name' }, customer.displayName),
        h('button', { class: 'pill-button', type: 'button', onclick: notInDemo }, M.edit)),
      h('p', { class: 'my-follow' }, M.followers, ' ', h('strong', {}, '0'), ' ', M.following, ' ', h('strong', {}, '0')),
      h('button', { class: 'my-card my-badges', type: 'button', onclick: notInDemo },
        h('span', {}, M.badges), h('img', { src: imageUrl('my/badges.png'), alt: '', width: 94, height: 30 }), icon('chevronRight')),
      h('button', { class: 'my-card my-pay', type: 'button', onclick: notInDemo },
        h('span', { class: 'my-pay__text' },
          h('span', { class: 'my-pay__brand' }, M.payBrand, h('span', {}, M.payBrandPay)), M.payText, h('strong', {}, M.payStrong), M.payEnd),
        h('span', { class: 'my-pay__card' }, M.payCard, icon('chevronRight'))),
      h('ul', { class: 'my-card my-tiles' },
        tile('point', M.tiles.points, '0', notInDemo),
        tile('ticket', M.tiles.coupons, String(claimedCoupons(state).length), openCoupons),
        tile('bookmark', M.tiles.saved, M.view, pageUrl('customer/saved.html')),
        tile('history', M.tiles.recent, M.view, pageUrl('customer/search.html'))),
      h('button', { class: 'my-card my-special', type: 'button', onclick: notInDemo },
        h('img', { src: imageUrl('my/cake.png'), alt: '', width: 36, height: 34 }),
        h('span', {}, h('span', { class: 'my-special__title' }, M.specialTitle), h('span', { class: 'my-special__link' }, M.specialLink, icon('chevronRight')))),
      h('button', { class: 'my-card my-row', type: 'button', onclick: notInDemo },
        h('span', {}, h('strong', {}, M.phoneStrong), M.phoneRest), icon('chevronRight')),
      h('button', { class: 'my-banner', type: 'button', onclick: notInDemo }, h('img', { src: imageUrl('my/benefit-banner.jpg'), alt: M.benefitAlt })),
      h('div', { class: 'section-band' }),
      h('button', { class: 'my-section-row', type: 'button', onclick: notInDemo },
        h('span', {}, M.helpfulReviews, h('span', { class: 'my-count' }, ' 0')), icon('chevronRight')),
      h('div', { class: 'section-band' }),
      h('section', { class: 'my-reviews', 'aria-labelledby': 'my-reviews-title' },
        h('div', { class: 'my-reviews__head' },
          h('h2', { id: 'my-reviews-title' }, M.myReviews, h('span', { class: 'my-count' }, ' 0')),
          h('span', { class: 'my-reviews__avg' }, M.myAverage, ' –')),
        h('div', { class: 'empty-state' }, h('p', { class: 'empty-state__title' }, M.noReviewsTitle), h('p', { class: 'text-secondary' }, M.noReviewsBody)))),
    bottomNav('my'),
  );
}

render();
subscribe(render);
