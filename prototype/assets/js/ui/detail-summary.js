// Top of the C02 detail page (captures 171054, 173157, 183425): photos, badges, name, rating,
// info rows with station / weekly-hours disclosures, tags, coupon and AI summary.
import { STRINGS } from '../core/strings.js';
import { formatCount } from '../core/format.js';
import { h } from './dom.js';
import { icon } from './icons.js';
import { notInDemo, showToast } from './toast.js';
import { restaurantPhoto, ratingStar, imageUrl } from './restaurant.js';

const R = STRINGS.restaurant;
const LINE_CLASS = { 5: 'line-5', 6: 'line-6', 7: 'line-7', 경의중앙: 'line-gyeongui', 공항: 'line-airport', 수인분당: 'line-suin' };

export function subwayBadges(lines) {
  return h('span', { class: 'subway' }, lines.map((line) => h('span', { class: `subway__line ${LINE_CLASS[line] ?? ''}` }, line)));
}

export function stationLine(station) {
  return h('span', { class: 'station' }, subwayBadges(station.lines), R.distance(station.name, station.distanceM));
}

export function weeklyHoursList(weeklyHours, todayLabel) {
  return h('dl', { class: 'weekly-hours' }, weeklyHours.map(([day, lines]) => h('div', { class: day === todayLabel ? 'is-today' : null },
    h('dt', {}, day),
    h('dd', {}, lines.map((line) => h('span', {}, line))))));
}

export function photoCarousel(restaurant) {
  const photos = restaurant.photos.length ? restaurant.photos : [null];
  return h('ul', { class: `detail-photos${photos.length === 1 ? ' detail-photos--single' : ''}`, 'aria-label': R.photosLabel },
    photos.map((_, index) => h('li', {}, restaurantPhoto(restaurant, 'detail-photo', index))));
}

function badgeChip(badge) {
  if (badge.kind === 'blueRibbon') {
    return h('span', { class: 'badge-chip badge-chip--ribbon' },
      h('img', { src: imageUrl('home/ribbon-double.png'), alt: '', width: 30, height: 18 }), badge.label);
  }
  if (badge.kind === 'sushiroad') {
    return h('button', { class: 'badge-chip badge-chip--outline', type: 'button', onclick: notInDemo },
      h('img', { src: imageUrl('home/brand-sushiroad.png'), alt: '', width: 20, height: 20 }), badge.label, icon('chevronRight'));
  }
  return h('button', { class: 'badge-chip badge-chip--muted', type: 'button', onclick: notInDemo }, icon('play'), badge.label);
}

/** One info row; when `more` is given the row text becomes a disclosure button (⌄) for it. */
function infoRow(iconName, label, content, more, trailing) {
  const row = h('li', { class: 'info-row' }, icon(iconName), h('span', { class: 'visually-hidden' }, label));
  if (!more) {
    row.append(h('span', { class: 'info-row__text' }, content), trailing ?? '');
    return row;
  }
  const panel = h('div', { class: 'info-row__more', hidden: true }, more);
  const toggle = h('button', { class: 'info-row__toggle', type: 'button', 'aria-expanded': 'false' },
    content, icon('chevronDown', 'icon info-row__chevron'));
  toggle.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') !== 'true';
    toggle.setAttribute('aria-expanded', String(open));
    panel.hidden = !open;
  });
  row.append(toggle, trailing ?? '', panel);
  return row;
}

export function summaryBlock(restaurant, { weekdayLabel, onLocation, onReviews }) {
  const { open, close } = restaurant.hours;
  const [firstStation, ...otherStations] = restaurant.stations;
  return h('section', { class: 'detail-summary' },
    restaurant.badges.length > 0 && h('div', { class: 'badge-row' }, restaurant.badges.map(badgeChip)),
    h('div', { class: 'detail-summary__title-row' },
      h('h1', { class: 'detail-summary__name' }, restaurant.name),
      h('button', { class: 'pill-button', type: 'button', onclick: notInDemo }, icon('people'), R.pickTogether)),
    h('p', { class: 'detail-summary__meta' },
      ratingStar(restaurant.rating),
      h('button', { class: 'detail-summary__reviews', type: 'button', onclick: onReviews },
        R.reviewCount(formatCount(restaurant.reviewCount)), icon('chevronRight')),
      h('span', {}, restaurant.district),
      h('span', {}, restaurant.cuisine)),
    h('p', { class: 'detail-summary__desc' }, restaurant.description),
    h('ul', { class: 'info-rows' },
      firstStation && infoRow('pin', R.transitLabel, [subwayBadges(firstStation.lines), R.distance(firstStation.name, firstStation.distanceM)],
        otherStations.length ? otherStations.map(stationLine) : null,
        h('button', { class: 'info-row__link', type: 'button', onclick: onLocation }, icon('map'), R.location)),
      infoRow('won', R.priceLabel, restaurant.priceBand),
      infoRow('clock', R.hoursLabel, R.todayHours(weekdayLabel, open, close),
        restaurant.weeklyHours && weeklyHoursList(restaurant.weeklyHours, weekdayLabel))),
    restaurant.tags.length > 0 && h('ul', { class: 'tag-chips' }, restaurant.tags.map((tag) => h('li', { class: 'tag-chip' }, tag))));
}

export function couponCard(coupon, claimed, onClaim) {
  return h('div', { class: 'coupon' },
    icon('coupon', 'icon coupon__icon'),
    h('div', { class: 'coupon__text' },
      h('p', { class: 'coupon__title' }, coupon.title),
      h('p', { class: 'coupon__desc' }, coupon.description)),
    h('button', { class: 'coupon__button', type: 'button', disabled: claimed, onclick: onClaim },
      claimed ? R.couponClaimed : [icon('download'), R.couponDownload]));
}

export function aiSummaryCard(summary) {
  const votes = [[R.aiHelpful, 'thumbUp'], [R.aiNotHelpful, 'thumbDown']].map(([label, iconName]) =>
    h('button', { class: 'icon-button ai-summary__vote', type: 'button', 'aria-label': label, 'aria-pressed': 'false' }, icon(iconName)));
  votes.forEach((button) => button.addEventListener('click', () => {
    const pressed = button.getAttribute('aria-pressed') !== 'true';
    votes.forEach((other) => other.setAttribute('aria-pressed', 'false'));
    button.setAttribute('aria-pressed', String(pressed));
  }));
  return h('section', { class: 'detail-block ai-summary', 'aria-labelledby': 'ai-summary-title' },
    h('div', { class: 'stats__head' },
      h('h2', { class: 'ai-summary__heading', id: 'ai-summary-title' },
        icon('sparkle', 'icon ai-summary__sparkle'), h('span', { class: 'ai-summary__lead' }, R.aiLead), R.aiRest),
      h('button', { class: 'info-button', type: 'button', 'aria-label': R.infoButton, onclick: () => showToast(R.aiInfo) }, icon('info'))),
    h('div', { class: 'ai-summary__card' },
      h('p', { class: 'ai-summary__title' }, summary.title),
      h('ul', { class: 'ai-summary__points' }, summary.points.map((point) => h('li', {}, point))),
      h('div', { class: 'ai-summary__votes' }, votes)));
}
