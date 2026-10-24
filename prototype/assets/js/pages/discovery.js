// C01 Home, modelled on the app home captures (161246, 170629). Search opens the search screen;
// the 전체/예약/웨이팅 filter, restaurant banners and two categories work; other entries explain on tap.
import { STRINGS } from '../core/strings.js';
import { getState } from '../core/store.js';
import { pageUrl } from '../core/nav.js';
import { h } from '../ui/dom.js';
import { icon } from '../ui/icons.js';
import { notInDemo } from '../ui/toast.js';
import { bottomNav } from '../ui/bottom-nav.js';
import { restaurantCard, imageUrl } from '../ui/restaurant.js';
import { unreadCount } from '../services/notification.js';

const D = STRINGS.discovery;
const FILTERS = {
  all: () => true,
  booking: (restaurant) => restaurant.bookingEnabled,
  waiting: (restaurant) => restaurant.waitingEnabled,
};
const CATEGORY_FILTERS = { 'waiting-place': 'waiting', 'today-booking': 'booking' };

const restaurants = getState().restaurants;
let filter = 'all';

const filterInputs = Object.entries(D.filters).map(([value, label]) => h('label', { class: 'choice-chip' },
  h('input', { class: 'visually-hidden', type: 'radio', name: 'filter', value, checked: value === filter, onchange: () => setFilter(value) }),
  label));
const resultCount = h('p', { class: 'discovery__count', role: 'status' });
const list = h('ul', { class: 'restaurant-list' });
const listSection = h('section', { class: 'home-list', 'aria-labelledby': 'list-title' },
  h('h2', { class: 'home-section__title', id: 'list-title' }, D.listHeading),
  h('fieldset', { class: 'choice-chips' }, h('legend', { class: 'visually-hidden' }, D.filterLegend), filterInputs),
  resultCount,
  list);

function setFilter(value) {
  filter = value;
  filterInputs.forEach((label) => { const input = label.querySelector('input'); input.checked = input.value === value; });
  const visible = restaurants.filter(FILTERS[filter]);
  resultCount.textContent = D.resultCount(visible.length);
  list.replaceChildren(...visible.map(restaurantCard));
}

const iconButton = (name, label) => h('button', { class: 'icon-button', type: 'button', 'aria-label': label, onclick: notInDemo }, icon(name));

// The bell opens 나의 알림; a dot marks unread notifications (the app's red dot, 161246)
function notificationsLink() {
  const unread = unreadCount(getState());
  return h('a', { class: 'icon-button bell-link', href: pageUrl('customer/inbox.html'), 'aria-label': unread ? `${D.notifications} (${unread})` : D.notifications },
    icon('bell'), unread > 0 && h('span', { class: 'bell-link__dot', 'aria-hidden': 'true' }));
}

function homeHeader() {
  return h('header', { class: 'home-header' },
    h('a', { class: 'home-header__logo', href: pageUrl('index.html'), 'aria-label': D.hubLink },
      h('img', { src: imageUrl('logo.svg'), alt: '', width: 40, height: 40 })),
    h('a', { class: 'search-field', href: pageUrl('customer/search.html') },
      icon('search'), h('span', { class: 'search-field__placeholder' }, D.searchPlaceholder)),
    iconButton('history', D.history),
    notificationsLink());
}

function brandTabs() {
  return h('nav', { class: 'brand-tabs', 'aria-label': D.brandTabsLabel },
    D.brandTabs.map((tab, index) => (index === 0
      ? h('a', { class: 'brand-tab', href: pageUrl('customer/discovery.html'), 'aria-current': 'page' }, tab.label)
      : h('button', { class: 'brand-tab', type: 'button', onclick: notInDemo },
        tab.image && h('img', { src: imageUrl(tab.image), alt: '', width: 30, height: 30 }), tab.label))));
}

function locationRow() {
  return h('div', { class: 'location-row' },
    h('button', { class: 'location-row__area', type: 'button', 'aria-label': `${D.locationLabel}: ${D.location}`, onclick: notInDemo },
      icon('pin', 'icon is-filled'), D.location, icon('chevronDown')),
    h('button', { class: 'location-row__here', type: 'button', onclick: notInDemo }, icon('target'), D.currentLocation));
}

function bannerCarousel() {
  const counter = h('span', { class: 'banner-counter', 'aria-hidden': 'true' });
  const slides = D.banners.map((banner) => h('li', { class: 'banner-slide' }, banner.restaurantId
    ? h('a', { class: 'banner banner--photo', href: pageUrl('customer/restaurant.html', { restaurantId: banner.restaurantId }) },
      h('img', { src: imageUrl(banner.image), alt: '' }),
      h('span', { class: 'banner__text' },
        h('span', { class: 'banner__tag' }, banner.tag),
        h('strong', { class: 'banner__title' }, banner.title),
        h('span', { class: 'banner__subtitle' }, banner.subtitle)))
    : h('div', { class: 'banner' }, h('img', { src: imageUrl(banner.image), alt: banner.alt }))));
  const track = h('ul', { class: 'banner-track' }, slides);
  const updateCounter = () => {
    const center = track.scrollLeft + track.clientWidth / 2;
    const index = Math.max(0, slides.findIndex((slide) => slide.offsetLeft + slide.offsetWidth >= center));
    counter.textContent = D.bannerCounter(index + 1, slides.length);
  };
  track.addEventListener('scroll', updateCounter, { passive: true });
  updateCounter();
  return h('section', { class: 'banner-carousel', 'aria-label': D.bannerLabel }, track, counter);
}

function openCategory(key) {
  if (!CATEGORY_FILTERS[key]) return notInDemo();
  setFilter(CATEGORY_FILTERS[key]);
  listSection.scrollIntoView({ block: 'start' });
}

function categoryGrid() {
  return h('nav', { class: 'category-grid', 'aria-label': D.categoriesLabel },
    h('ul', {}, D.categories.map(([key, label]) => h('li', {},
      h('button', { class: 'category', type: 'button', onclick: () => openCategory(key) },
        h('img', { src: imageUrl(`home/cat-${key}.png`), alt: '', width: 48, height: 48 }), label)))));
}

function areaRow() {
  return h('section', { class: 'areas', 'aria-labelledby': 'areas-title' },
    h('div', { class: 'areas__head' },
      h('h2', { class: 'home-section__title', id: 'areas-title' }, D.areasHeading),
      h('button', { class: 'nearby-pill', type: 'button', onclick: notInDemo }, icon('navigate'), D.nearby)),
    h('ul', { class: 'areas__grid' }, D.areas.map(([key, label]) => h('li', {},
      h('button', { class: 'area', type: 'button', onclick: notInDemo },
        h('img', { src: imageUrl(`home/area-${key}.jpg`), alt: '', width: 72, height: 72 }), label)))));
}

document.title = D.pageTitle;
document.getElementById('app').replaceChildren(
  homeHeader(),
  h('main', { class: 'mobile-content home' },
    h('h1', { class: 'visually-hidden' }, D.heading),
    brandTabs(),
    locationRow(),
    bannerCarousel(),
    categoryGrid(),
    h('div', { class: 'section-band' }),
    areaRow(),
    h('div', { class: 'section-band' }),
    listSection),
  bottomNav('home'),
);
setFilter('all');
