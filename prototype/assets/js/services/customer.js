// Customer-owned lists for the active presenter customer: saved restaurants and claimed coupons.
import { commit } from '../core/store.js';
import { now } from '../core/clock.js';

const owner = (state) => state.meta.activeCustomerId;

export function isSaved(state, restaurantId) {
  return state.savedRestaurants.some((s) => s.customerId === owner(state) && s.restaurantId === restaurantId);
}

export function savedRestaurantList(state) {
  return state.savedRestaurants
    .filter((s) => s.customerId === owner(state))
    .map((s) => state.restaurants.find((r) => r.id === s.restaurantId))
    .filter(Boolean);
}

export function toggleSaved(restaurantId) {
  const savedAt = new Date(now()).toISOString();
  return commit((state) => {
    if (!state.restaurants.some((r) => r.id === restaurantId)) return { ok: false, reason: 'NOT_FOUND' };
    const index = state.savedRestaurants.findIndex((s) => s.customerId === owner(state) && s.restaurantId === restaurantId);
    if (index >= 0) state.savedRestaurants.splice(index, 1);
    else state.savedRestaurants.push({ customerId: owner(state), restaurantId, savedAt });
  });
}

/** Most recent first; viewing again moves the restaurant to the front. */
export function recordView(restaurantId) {
  const viewedAt = new Date(now()).toISOString();
  return commit((state) => {
    if (!state.restaurants.some((r) => r.id === restaurantId)) return { ok: false, reason: 'NOT_FOUND' };
    state.recentViews = state.recentViews.filter((v) => !(v.customerId === owner(state) && v.restaurantId === restaurantId));
    state.recentViews.unshift({ customerId: owner(state), restaurantId, viewedAt });
  });
}

export function recentRestaurants(state) {
  return state.recentViews
    .filter((v) => v.customerId === owner(state))
    .map((v) => state.restaurants.find((r) => r.id === v.restaurantId))
    .filter(Boolean);
}

export function hasCoupon(state, couponId) {
  return state.couponClaims.some((c) => c.customerId === owner(state) && c.couponId === couponId);
}

/** Idempotent: claiming twice keeps one claim. */
export function claimCoupon(couponId) {
  const claimedAt = new Date(now()).toISOString();
  return commit((state) => {
    if (!state.restaurants.some((r) => r.coupon?.id === couponId)) return { ok: false, reason: 'NOT_FOUND' };
    if (hasCoupon(state, couponId)) return { ok: true };  // already claimed: succeed without writing
    state.couponClaims.push({ customerId: owner(state), couponId, claimedAt });
  });
}
