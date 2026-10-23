// 저장 tab, modelled on capture 173436 with the active demo customer's saved restaurants
// (the capture's own list is the user's personal data and is not reproduced).
import { STRINGS } from '../core/strings.js';
import { getState, subscribe } from '../core/store.js';
import { now } from '../core/clock.js';
import { addDays, formatShortDate, seoulDateKey, weekdayOf } from '../core/format.js';
import { pageUrl } from '../core/nav.js';
import { savedRestaurantList, recentRestaurants } from '../services/customer.js';
import { bookingDates } from '../services/booking.js';
import { h } from '../ui/dom.js';
import { icon } from '../ui/icons.js';
import { notInDemo } from '../ui/toast.js';
import { bottomNav } from '../ui/bottom-nav.js';
import { imageUrl, ratingStar, restaurantPhoto } from '../ui/restaurant.js';

const S = STRINGS.saved;
const B = STRINGS.booking;
const detailHref = (restaurant) => pageUrl('customer/restaurant.html', { restaurantId: restaurant.id });
const content = h('div', {});

function dateChips(state, restaurant) {
  const nowMs = now();
  const today = seoulDateKey(nowMs);
  return h('div', { class: 'date-chips' }, bookingDates(state, restaurant, nowMs, 5).map(({ dateKey, available }) => {
    const prefix = dateKey === today ? B.today : dateKey === addDays(today, 1) ? B.tomorrow : formatShortDate(dateKey);
    return h('a', { class: 'date-chip', href: detailHref(restaurant), 'data-available': String(available) },
      h('span', { class: 'date-chip__day' }, `${prefix} (${STRINGS.weekdays[weekdayOf(dateKey)]})`),
      h('span', { class: 'date-chip__status' }, available ? B.available : B.soldOut));
  }));
}

function savedEntry(state, restaurant) {
  return h('li', { class: 'saved-entry' },
    h('div', { class: 'saved-entry__head' },
      h('a', { class: 'saved-entry__name', href: detailHref(restaurant) },
        restaurant.name, h('span', { class: 'saved-entry__meta' }, `${restaurant.district} · ${restaurant.cuisine}`)),
      h('button', { class: 'icon-button', type: 'button', 'aria-label': S.more, onclick: notInDemo }, icon('more'))),
    h('p', { class: 'saved-entry__rating' }, ratingStar(restaurant.rating), h('span', {}, `(${restaurant.reviewCount.toLocaleString('ko-KR')})`)),
    h('div', { class: 'saved-entry__photos', 'aria-hidden': 'true' }, restaurant.photos.slice(0, 3).map((_, index) => restaurantPhoto(restaurant, 'saved-entry__photo', index))),
    restaurant.bookingEnabled && dateChips(state, restaurant));
}

function render() {
  const state = getState();
  const saved = savedRestaurantList(state);
  const recent = recentRestaurants(state);
  content.replaceChildren(
    h('ul', { class: 'collections' },
      h('li', {}, h('a', { class: 'collection', href: pageUrl('customer/search.html') },
        h('span', { class: 'collection__cover' }, recent.slice(0, 4).map((r) => h('img', { src: imageUrl(r.photos[0]), alt: '' }))),
        h('span', { class: 'collection__name' }, S.recentCollection),
        h('span', { class: 'collection__meta' }, recent.length ? S.recentCollectionMeta : ''))),
      h('li', {}, h('button', { class: 'collection collection--new', type: 'button', onclick: notInDemo },
        h('span', { class: 'collection__cover' }, icon('plus')), h('span', { class: 'collection__name' }, S.newCollectionTile)))),
    h('div', { class: 'saved-bar' },
      h('h2', { class: 'saved-bar__title' }, S.savedHeading, h('span', {}, ` ${saved.length}`)),
      h('button', { class: 'pill-button', type: 'button', onclick: notInDemo }, icon('people'), S.pickTogether)),
    h('button', { class: 'picker-bar saved-picker', type: 'button', onclick: notInDemo }, icon('calendar'), h('span', { class: 'picker-bar__label' }, B.pickerPlaceholder), icon('chevronDown')),
    h('div', { class: 'filter-chips filter-chips--scroll saved-sorts' },
      S.sorts.map((label, index) => h('button', { class: 'filter-chip', type: 'button', onclick: notInDemo }, label, index === 0 && icon('chevronDown')))),
    saved.length
      ? h('ul', { class: 'saved-list' }, saved.map((restaurant) => savedEntry(state, restaurant)))
      : h('div', { class: 'empty-state' },
        h('p', { class: 'empty-state__title' }, S.emptyTitle),
        h('p', { class: 'text-secondary' }, S.emptyBody),
        h('a', { class: 'button', href: pageUrl('customer/discovery.html') }, S.browse)));
}

document.title = S.pageTitle;
document.getElementById('app').replaceChildren(
  h('header', { class: 'saved-header' },
    h('h1', { class: 'saved-header__title' }, S.heading),
    h('button', { class: 'saved-header__tab', type: 'button', onclick: notInDemo }, S.recommend),
    h('span', { class: 'new-badge' }, S.newBadge),
    h('button', { class: 'saved-header__new', type: 'button', onclick: notInDemo }, S.newCollection)),
  h('main', { class: 'mobile-content' }, content),
  bottomNav('saved'),
);
render();
subscribe(render);
