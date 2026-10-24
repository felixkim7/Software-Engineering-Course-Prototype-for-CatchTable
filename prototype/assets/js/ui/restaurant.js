// Restaurant pieces shared by home, saved list and detail.
import { STRINGS } from '../core/strings.js';
import { pageUrl } from '../core/nav.js';
import { h } from './dom.js';
import { icon } from './icons.js';

const R = STRINGS.restaurant;

export const imageUrl = (path) => pageUrl(`assets/images/${path}`);

/** First photo, or a neutral placeholder when none was captured. */
export function restaurantPhoto(restaurant, className, index = 0) {
  const path = restaurant.photos[index];
  return path
    ? h('img', { class: `photo ${className}`, src: imageUrl(path), alt: R.photoAlt(restaurant.name, index + 1), loading: 'lazy' })
    : h('div', { class: `photo ${className}`, 'aria-hidden': 'true' }, icon('utensils', 'photo__icon'));
}

export function ratingStar(rating) {
  return h('span', { class: 'rating' }, icon('star', 'icon rating__star'), h('span', { class: 'visually-hidden' }, R.ratingLabel), rating.toFixed(1));
}

/**
 * Card in the style of the app's recommendation cards: photos, "지역 | 업종", name ★ rating, one-liner.
 * Restaurants with only a list thumbnail use the 가격대별 BEST row layout (170629) at its native size.
 */
export function restaurantCard(restaurant) {
  const photos = restaurant.photos.length
    ? restaurant.photos.slice(0, 3).map((_, index) => restaurantPhoto(restaurant, 'restaurant-card__photo', index))
    : [restaurantPhoto(restaurant, 'restaurant-card__photo')];
  return h('li', {},
    h('a', { class: `restaurant-card${restaurant.thumbnailOnly ? ' restaurant-card--row' : ''}`, href: pageUrl('customer/restaurant.html', { restaurantId: restaurant.id }) },
      h('div', { class: 'restaurant-card__photos' }, photos),
      h('p', { class: 'restaurant-card__meta' }, `${restaurant.district} | ${restaurant.cuisine}`),
      h('h3', { class: 'restaurant-card__name' }, restaurant.name, ratingStar(restaurant.rating), restaurant.reviewCount !== null && h('span', { class: 'restaurant-card__count' }, `(${restaurant.reviewCount.toLocaleString('ko-KR')})`)),
      h('p', { class: 'restaurant-card__desc' }, restaurant.description)));
}
