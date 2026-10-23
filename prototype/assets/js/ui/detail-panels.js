// Tab panels of the C02 detail page and the previews shown on its 홈 tab, following the app
// captures (월화 171105/171148/171320/171325/171341, vivo 171546/171613/171646, 스시렌 173218-173324).
// Review bodies are deliberately not reproduced (other people's content); counts are shown.
import { STRINGS } from '../core/strings.js';
import { formatCapped } from '../core/format.js';
import { h } from './dom.js';
import { icon, FACILITY_ICONS } from './icons.js';
import { notInDemo, showToast, copyWithToast } from './toast.js';
import { restaurantPhoto, ratingStar, imageUrl } from './restaurant.js';
import { subwayBadges, weeklyHoursList } from './detail-summary.js';

const R = STRINGS.restaurant;

function block(title, { id, action } = {}, ...content) {
  return h('section', { class: 'detail-block', id },
    h('div', { class: 'detail-block__head' }, h('h2', { class: 'detail-block__title' }, title), action),
    ...content);
}

function moreButton(label, onclick) {
  return h('button', { class: 'button button--block more-button', type: 'button', onclick }, label, icon('chevronRight'));
}

export function reportRow() {
  return h('button', { class: 'report-row', type: 'button', onclick: notInDemo },
    h('span', {}, h('strong', {}, R.reportWrong), h('span', {}, R.reportWrongBody)), icon('chevronRight'));
}

// ---- Menu ----
function menuItemRow(item, categoryLabel) {
  return h('li', { class: 'menu-item' },
    h('div', { class: 'menu-item__text' },
      categoryLabel && h('p', { class: 'menu-item__category' }, categoryLabel),
      item.badges.length > 0 && h('p', { class: 'menu-item__badges' },
        item.badges.map((badge) => h('span', { class: `menu-badge${badge === '대표' ? ' menu-badge--main' : ''}` }, badge))),
      h('p', { class: 'menu-item__name' }, item.name),
      item.description && h('p', { class: 'menu-item__desc' }, item.description),
      h('p', { class: 'menu-item__price' }, R.price(item.price))),
    item.image && h('img', { class: 'menu-item__image', src: imageUrl(item.image), alt: '', loading: 'lazy' }));
}

function menuNotes(menu) {
  return menu.notes.map((note) => h('button', { class: 'menu-note', type: 'button', onclick: notInDemo }, icon('utensils'), note, icon('chevronRight')));
}

function menuPreview(restaurant, openMenu) {
  const items = restaurant.menu.categories
    .flatMap((category) => category.items.map((item) => ({ item, category: category.name })))
    .sort((a, b) => Number(b.item.badges.includes('대표')) - Number(a.item.badges.includes('대표')))
    .slice(0, 4);
  const showCategory = restaurant.menu.categories.length > 1;
  return block(R.menuHeading, { action: h('button', { class: 'outline-small', type: 'button', onclick: openMenu }, R.menuBoard) },
    menuNotes(restaurant.menu),
    h('ul', { class: 'menu-list' }, items.map(({ item, category }) => menuItemRow(item, showCategory && category))),
    moreButton(R.menuAll, openMenu));
}

export function menuPanel(restaurant) {
  const { menu } = restaurant;
  const sections = menu.categories.map((category) => (category.items.length
    ? h('section', { class: 'menu-category' },
      h('div', { class: 'menu-category__head' }, h('h3', {}, category.name), category.range && h('span', {}, category.range)),
      h('ul', { class: 'menu-list' }, category.items.map((item) => menuItemRow(item))))
    : h('div', { class: 'menu-category menu-category--collapsed' }, h('h3', {}, category.name), category.range && h('span', {}, category.range))));
  return h('div', { class: 'panel-body' },
    menu.boards.length > 0 && block(R.menuBoard, {},
      h('ul', { class: 'menu-boards' }, menu.boards.map((board) => h('li', {},
        h('button', { class: 'menu-board', type: 'button', 'aria-label': R.menuBoard, onclick: notInDemo }, h('img', { src: imageUrl(board), alt: '' })))))),
    menuNotes(menu),
    menu.categories.length > 1 && h('nav', { class: 'filter-chips filter-chips--scroll', 'aria-label': R.menuCategories },
      menu.categories.map((category, index) => h('button', {
        class: 'filter-chip', type: 'button', onclick: () => sections[index].scrollIntoView({ block: 'start' }),
      }, category.name))),
    sections,
    h('p', { class: 'menu-footnote' }, R.menuNote, h('br'), R.menuUpdated(menu.updatedAt)),
    reportRow());
}

// ---- Photos ----
function photoGrid(restaurant, className, limit = Infinity) {
  return h('ul', { class: className }, restaurant.photos.slice(0, limit).map((_, index) => h('li', {}, restaurantPhoto(restaurant, `${className}__item`, index))));
}

export function photosPanel(restaurant) {
  return h('div', { class: 'panel-body panel-body--padded' },
    h('div', { class: 'filter-chips filter-chips--scroll' },
      h('button', { class: 'filter-chip is-active', type: 'button', 'aria-pressed': 'true' }, R.photoFilterAll),
      restaurant.photoFilters.map(([label, count]) => h('button', { class: 'filter-chip', type: 'button', 'aria-pressed': 'false', onclick: notInDemo },
        label, h('span', { class: 'filter-chip__count' }, formatCapped(count))))),
    photoGrid(restaurant, 'photo-columns'),
    h('p', { class: 'detail-caption' }, R.photosShown(restaurant.photos.length, formatCapped(restaurant.photoCount))));
}

// ---- Reviews ----
export function reviewsPanel(restaurant) {
  const { distribution, purposes } = restaurant.reviews;
  const max = Math.max(...distribution);
  return h('div', { class: 'panel-body' },
    h('div', { class: 'review-summary' },
      h('div', { class: 'review-summary__score' },
        h('p', { class: 'review-summary__label' }, R.reviewAverage(restaurant.reviewCount.toLocaleString('ko-KR'))),
        icon('star', 'icon rating__star review-summary__star'),
        h('p', { class: 'review-summary__value' }, restaurant.rating.toFixed(1))),
      h('dl', { class: 'review-bars' }, distribution.map((count, index) => h('div', {},
        h('dt', {}, R.reviewScore(5 - index)),
        h('dd', {},
          h('span', { class: 'review-bars__track', 'aria-hidden': 'true' }, h('span', { class: 'review-bars__fill', style: `width: ${(count / max) * 100}%` })),
          h('span', { class: 'review-bars__count' }, count.toLocaleString('ko-KR'))))))),
    h('div', { class: 'review-tools' },
      h('button', { class: 'select-chip', type: 'button', onclick: notInDemo }, R.reviewSort, icon('chevronDown')),
      h('button', { class: 'select-chip', type: 'button', onclick: notInDemo }, R.reviewVisitTime, icon('chevronDown')),
      h('button', { class: 'review-tools__check', type: 'button', role: 'checkbox', 'aria-checked': 'false', onclick: notInDemo },
        h('span', { class: 'checkbox-box', 'aria-hidden': 'true' }), R.reviewMediaOnly)),
    h('div', { class: 'filter-chips filter-chips--scroll review-purposes' },
      h('span', { class: 'review-purposes__label' }, R.reviewPurpose),
      purposes.map(([label, count]) => h('button', { class: 'filter-chip', type: 'button', onclick: notInDemo },
        label, h('span', { class: 'filter-chip__count' }, count.toLocaleString('ko-KR'))))),
    h('p', { class: 'detail-empty' }, R.reviewBodyNote));
}

function reviewsPreview(restaurant, openReviews) {
  return block(R.reviewsHeading, {},
    h('p', { class: 'review-inline' }, ratingStar(restaurant.rating), h('span', {}, `(${restaurant.reviewCount.toLocaleString('ko-KR')})`)),
    h('p', { class: 'detail-empty' }, R.reviewBodyNote),
    moreButton(R.reviewsAll, openReviews));
}

// ---- Info blocks (shared by 홈 previews and the 매장정보 panel) ----
export function facilitiesBlock(restaurant, { id, onMore } = {}) {
  const { info } = restaurant;
  return block(R.facilitiesHeading, { id },
    h('ul', { class: 'facility-grid' }, info.facilities.map((label) => h('li', {}, icon(FACILITY_ICONS[label] ?? 'check', 'icon facility__icon'), h('span', {}, label)))),
    h('div', { class: 'guides' }, info.guides.map((guide) => h('div', { class: 'guide' },
      h('h3', { class: 'guide__title' }, icon('check'), guide.title),
      h('ul', { class: 'guide__lines' }, guide.lines.map((line) => h('li', {}, line)))))),
    onMore && moreButton(R.facilitiesAll, onMore));
}

export function locationBlock(restaurant, { id, withDirections } = {}) {
  const { info } = restaurant;
  return block(R.locationHeading, { id },
    h('img', { class: 'map-image', src: imageUrl(info.map), alt: R.mapAlt(restaurant.name), loading: 'lazy' }),
    h('div', { class: 'address-row' }, icon('pin'), h('span', { class: 'address-row__text' }, info.address),
      h('button', { class: 'copy-button', type: 'button', onclick: () => copyWithToast(info.address, R.addressCopied, R.linkCopyFailed) }, icon('copy'), R.copy)),
    h('ul', { class: 'station-list' }, restaurant.stations.map((station) => h('li', {}, subwayBadges(station.lines), R.distance(station.name, station.distanceM)))),
    h('button', { class: 'button button--block', type: 'button', onclick: notInDemo }, icon('navigate'), R.directionsButton),
    withDirections && info.directions && h('div', { class: 'directions' },
      h('h3', { class: 'directions__title' }, icon('pin'), R.directionsHeading),
      h('p', { class: 'pre-line' }, info.directions)));
}

export function detailsBlock(restaurant, { id, full, onMore, weekdayLabel } = {}) {
  const { info } = restaurant;
  const field = (label, content) => h('div', { class: 'details-field' }, h('h3', {}, label), content);
  return block(R.detailsHeading, { id },
    field(R.phoneLabel, h('button', { class: 'phone-link', type: 'button', onclick: () => showToast(R.phoneUnavailable) }, icon('phone'), info.phone)),
    full && restaurant.weeklyHours && field(R.hoursLabel, weeklyHoursList(restaurant.weeklyHours, weekdayLabel)),
    info.closedDays && field(R.closedDaysLabel, h('p', { class: 'pre-line' }, info.closedDays)),
    info.notices && field(R.noticesLabel, h('p', { class: 'pre-line' }, info.notices)),
    full && info.capacity && field(R.capacityLabel, h('p', { class: 'pre-line capacity' }, icon('people'), info.capacity)),
    onMore && moreButton(R.detailsAll, onMore));
}

export function infoPanel(restaurant, weekdayLabel) {
  const { info } = restaurant;
  const sections = [
    ['intro', block(R.introHeading, {}, h('p', { class: 'pre-line' }, info.intro))],
    ['award', info.award && block(R.awardHeading, {},
      h('p', { class: 'award__title' }, h('img', { src: imageUrl('home/ribbon-double.png'), alt: '', width: 30, height: 18 }), info.award.title),
      h('p', { class: 'award__detail' }, info.award.detail))],
    ['location', locationBlock(restaurant, { withDirections: true })],
    ['facilities', facilitiesBlock(restaurant)],
    ['details', detailsBlock(restaurant, { full: true, weekdayLabel })],
  ].filter(([, element]) => element);
  return h('div', { class: 'panel-body' },
    h('nav', { class: 'filter-chips filter-chips--scroll info-chips', 'aria-label': R.tabs.info },
      sections.map(([key, element], index) => h('button', {
        class: `filter-chip${index === 0 ? ' is-active' : ''}`, type: 'button', 'data-section': key,
        onclick: () => element.scrollIntoView({ block: 'start' }),
      }, R.infoChips[key]))),
    sections.map(([key, element]) => { element.dataset.infoSection = key; return element; }),
    reportRow());
}

// ---- 소식 / 방송 (스시렌) ----
function newsBlock(restaurant) {
  return block(R.newsHeading, {}, h('ul', { class: 'news-list' }, restaurant.news.map((news) => h('li', { class: 'news-card' },
    h('p', { class: 'news-card__tag' }, R.newsHeading), h('p', { class: 'news-card__title' }, news.title), h('p', { class: 'news-card__body' }, news.body)))));
}

function broadcastsBlock(restaurant) {
  return block(R.broadcastsHeading, {}, h('ul', { class: 'broadcast-list' }, restaurant.broadcasts.map((item) => h('li', { class: 'broadcast' },
    icon('play', 'icon broadcast__icon'),
    h('div', {}, h('p', { class: 'broadcast__channel' }, item.channel), h('p', { class: 'broadcast__quote' }, item.quote), h('p', { class: 'broadcast__aired' }, item.aired))))));
}

export const newsPanel = (restaurant) => h('div', { class: 'panel-body' }, newsBlock(restaurant));
export const broadcastsPanel = (restaurant) => h('div', { class: 'panel-body' }, broadcastsBlock(restaurant));

/** Previews on the 홈 tab, in the app's order. `open(tab, sectionKey?)` switches tabs. */
export function homePreviews(restaurant, open, weekdayLabel) {
  return [
    restaurant.awardBanner && h('div', { class: 'detail-block award-banner' },
      h('img', { src: imageUrl(restaurant.awardBanner.image), alt: restaurant.awardBanner.alt })),
    menuPreview(restaurant, () => open('menu')),
    restaurant.news.length > 0 && newsBlock(restaurant),
    reviewsPreview(restaurant, () => open('reviews')),
    block(R.photosHeading, {}, photoGrid(restaurant, 'photo-grid', 6), moreButton(R.photosAll(formatCapped(restaurant.photoCount)), () => open('photos'))),
    facilitiesBlock(restaurant, { onMore: () => open('info', 'facilities') }),
    restaurant.broadcasts.length > 0 && broadcastsBlock(restaurant),
    locationBlock(restaurant),
    detailsBlock(restaurant, { onMore: () => open('info', 'details'), weekdayLabel }),
    reportRow(),
  ];
}
