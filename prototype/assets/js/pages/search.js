// C12 Search, modelled on capture 173403. Personal sections of the capture (the user's own
// recent queries and name-based suggestions) are replaced by generic suggestions.
import { STRINGS } from '../core/strings.js';
import { getState } from '../core/store.js';
import { pageUrl } from '../core/nav.js';
import { recentRestaurants } from '../services/customer.js';
import { h } from '../ui/dom.js';
import { icon } from '../ui/icons.js';
import { notInDemo } from '../ui/toast.js';
import { restaurantCard } from '../ui/restaurant.js';

const S = STRINGS.search;
const state = getState();
const detailHref = (restaurant) => pageUrl('customer/restaurant.html', { restaurantId: restaurant.id });

function searchText(restaurant) {
  return [
    restaurant.name, restaurant.district, restaurant.cuisine, restaurant.description, ...restaurant.tags,
    ...restaurant.stations.map((station) => station.name),
    ...restaurant.menu.categories.flatMap((category) => [category.name, ...category.items.map((item) => item.name)]),
  ].join(' ').toLowerCase();
}

const input = h('input', { id: 'search-input', type: 'search', placeholder: S.placeholder, autocomplete: 'off', oninput: render });
const results = h('div', { class: 'search-results' });

function setQuery(text) {
  input.value = text;
  render();
  input.focus();
}

function idleView() {
  const recent = recentRestaurants(getState());
  const chips = (items, toChip) => h('ul', { class: 'chip-row' }, items.map((item) => h('li', {}, toChip(item))));
  return [
    recent.length > 0 && h('section', { class: 'search-section' },
      h('h2', { class: 'search-section__title' }, S.recentViews),
      chips(recent, (restaurant) => h('a', { class: 'outline-chip', href: detailHref(restaurant) }, restaurant.name))),
    h('section', { class: 'search-section' },
      h('h2', { class: 'search-section__title' }, S.suggestionsHeading),
      chips(S.suggestions, (text) => h('button', { class: 'suggest-chip', type: 'button', onclick: () => setQuery(text) }, text))),
    h('section', { class: 'search-section' },
      h('h2', { class: 'search-section__title' }, S.hashtagsHeading),
      chips(S.hashtags, (text) => h('button', { class: 'outline-chip', type: 'button', onclick: () => setQuery(text) }, `#${text}`))),
  ];
}

function render() {
  const terms = input.value.trim().toLowerCase().split(/\s+/).filter(Boolean);
  if (!terms.length) {
    results.replaceChildren(...idleView().filter(Boolean));
    return;
  }
  const found = state.restaurants.filter((restaurant) => terms.every((term) => searchText(restaurant).includes(term)));
  results.replaceChildren(
    h('p', { class: 'discovery__count', role: 'status' }, S.resultCount(found.length)),
    found.length
      ? h('ul', { class: 'restaurant-list' }, found.map(restaurantCard))
      : h('div', { class: 'empty-state' }, h('p', { class: 'empty-state__title' }, S.noResults), h('p', { class: 'text-secondary' }, S.noResultsBody)));
}

document.title = S.pageTitle;
document.getElementById('app').replaceChildren(
  h('header', { class: 'search-header' },
    h('h1', { class: 'visually-hidden' }, S.label),
    h('a', { class: 'icon-button', href: pageUrl('customer/discovery.html'), 'aria-label': S.back }, icon('back')),
    h('div', { class: 'search-box' },
      h('label', { class: 'visually-hidden', for: 'search-input' }, S.label),
      input,
      h('button', { class: 'search-box__date', type: 'button', onclick: notInDemo }, icon('calendar'), S.dateParty))),
  h('main', { class: 'mobile-content' }, results),
);
render();
input.focus();
