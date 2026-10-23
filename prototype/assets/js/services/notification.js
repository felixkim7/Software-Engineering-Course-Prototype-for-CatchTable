// MOCK notification service (KakaoTalk/push stand-in). A record is created inside the same
// commit as the change it announces; delivery is SENT, or FAILED when the presenter armed a
// one-shot failure. A failed delivery never rolls back or extends the record it points to.
import { commit, getState } from '../core/store.js';
import { now } from '../core/clock.js';

const nextId = (state) => `nt-${Math.max(0, ...state.notifications.map((n) => Number(n.id.slice(3)))) + 1}`;

/** For use inside commit(). `data` holds display facts so the inbox needs no joins. */
export function notify(state, { customerId, kind, entityType, entityId, data = {} }) {
  const failed = Boolean(state.meta.failNextNotification);
  state.meta.failNextNotification = false;
  state.notifications.push({
    id: nextId(state), recipientType: 'customer', recipientId: customerId, entityType, entityId, kind, data,
    deliveryStatus: failed ? 'FAILED' : 'SENT', attempts: 1, readAt: null, createdAt: new Date(now()).toISOString(),
  });
}

/** Delivered notifications of the active customer, newest first (the in-app 알림 list). */
export function customerNotifications(state) {
  return state.notifications
    .filter((n) => n.recipientId === state.meta.activeCustomerId && n.deliveryStatus === 'SENT')
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt) || Number(b.id.slice(3)) - Number(a.id.slice(3)));
}

export const unreadCount = (state) => customerNotifications(state).filter((n) => !n.readAt).length;

export function markAllRead() {
  if (!unreadCount(getState())) return { ok: true };
  const readAt = new Date(now()).toISOString();
  return commit((state) => {
    customerNotifications(state).forEach((n) => { n.readAt ??= readAt; });
  });
}

// ---- Presenter tools ----

export function setFailNextNotification(armed) {
  return commit((state) => { state.meta.failNextNotification = Boolean(armed); });
}

export const failedNotifications = (state) => state.notifications.filter((n) => n.deliveryStatus === 'FAILED');

/** Re-sends every failed delivery once. The records they point to are unchanged. */
export function retryFailedNotifications() {
  return commit((state) => {
    const failed = failedNotifications(state);
    if (!failed.length) return { ok: false, reason: 'NOTHING_TO_RETRY' };
    failed.forEach((n) => { n.deliveryStatus = 'SENT'; n.attempts += 1; });
  });
}
