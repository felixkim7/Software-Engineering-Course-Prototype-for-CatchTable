// C02 Restaurant detail. Layout follows the app captures; tabs switch panels as in the app
// (171138: the 메뉴 tab shows only menu content). Booking payment is not built, so its final step
// explains that. To-Be waiting (FR-07/08): a customer holding a live ticket sees it above the
// bottom bar on load, and the CTA becomes 내 웨이팅 보기 instead of offering a second registration.
import { STRINGS } from '../core/strings.js';
import { getState, subscribe } from '../core/store.js';
import { now } from '../core/clock.js';
import { formatCount, formatCapped, seoulDateKey, weekdayOf, seoulHour } from '../core/format.js';
import { pageUrl, queryParam } from '../core/nav.js';
import { waitingStatistics } from '../services/statistics.js';
import { isSaved, toggleSaved, hasCoupon, claimCoupon, recordView } from '../services/customer.js';
import { activeTicketFor, registrationStatus } from '../services/waiting.js';
import { liveRequestFor } from '../services/allocation.js';
import { reconcile } from '../services/reconcile.js';
import { h } from '../ui/dom.js';
import { icon } from '../ui/icons.js';
import { pageHeader } from '../ui/header.js';
import { showToast, copyWithToast } from '../ui/toast.js';
import { waitingStatsSection } from '../ui/waiting-stats.js';
import { bookingPanel } from '../ui/booking-panel.js';
import { queueBlock, ticketStrip } from '../ui/waiting-live.js';
import { cancellationStrip, openJoinSheet } from '../ui/cancellation-ui.js';
import { photoCarousel, summaryBlock, couponCard, aiSummaryCard } from '../ui/detail-summary.js';
import { homePreviews, menuPanel, photosPanel, reviewsPanel, infoPanel, newsPanel, broadcastsPanel } from '../ui/detail-panels.js';

const R = STRINGS.restaurant;
const homeHref = pageUrl('customer/discovery.html');
const app = document.getElementById('app');

const iconLink = (name, label, href) => h('a', { class: 'icon-button', href, 'aria-label': label }, icon(name));
const iconButton = (name, label, onclick, attributes = {}) =>
  h('button', { class: 'icon-button', type: 'button', 'aria-label': label, onclick, ...attributes }, icon(name));

function modePicker(modes, initialKey, onSelect) {
  return h('div', { class: 'mode-picker' },
    h('fieldset', { class: 'segmented' },
      h('legend', { class: 'visually-hidden' }, R.modeLegend),
      modes.map((mode) => h('label', { class: 'segmented__option' },
        h('input', { class: 'visually-hidden', type: 'radio', name: 'mode', value: mode.key, checked: mode.key === initialKey, onchange: () => onSelect(mode.key) }),
        R.capability[mode.key]))));
}

function renderDetail(state, restaurant) {
  recordView(restaurant.id);
  const nowMs = now();
  const today = { weekday: weekdayOf(seoulDateKey(nowMs)), hour: seoulHour(nowMs) };
  const weekdayLabel = STRINGS.weekdays[today.weekday];
  let mode = null;

  // Save (header + bottom bar share one state in the store)
  const headerSave = iconButton('bookmark', R.save, onToggleSave, { 'aria-pressed': 'false' });
  const saveCount = h('span', { class: 'bar-action__label' });
  const barSave = h('button', { class: 'bar-action', type: 'button', 'aria-pressed': 'false', onclick: onToggleSave },
    icon('bookmark'), h('span', { class: 'visually-hidden' }, R.save), saveCount);
  function refreshSaved() {
    const saved = isSaved(getState(), restaurant.id);
    [headerSave, barSave].forEach((button) => {
      button.setAttribute('aria-pressed', String(saved));
      button.querySelector('.icon').classList.toggle('is-filled', saved);
    });
    saveCount.textContent = restaurant.saveCount === null ? R.save : formatCount(restaurant.saveCount + (saved ? 1 : 0));
  }
  function onToggleSave() {
    const wasSaved = isSaved(getState(), restaurant.id);
    const result = toggleSaved(restaurant.id);
    showToast(result.ok ? (wasSaved ? R.unsavedToast : R.savedToast) : STRINGS.errors[result.reason]);
    refreshSaved();
  }

  // Coupon
  const couponSlot = h('div', { class: 'coupon-slot' });
  function refreshCoupon() {
    if (!restaurant.coupon) return;
    couponSlot.replaceChildren(couponCard(restaurant.coupon, hasCoupon(getState(), restaurant.coupon.id), () => {
      const result = claimCoupon(restaurant.coupon.id);
      showToast(result.ok ? R.couponToast : STRINGS.errors[result.reason]);
      refreshCoupon();
    }));
  }

  // Booking / waiting areas and the contextual CTA
  const cta = h('button', { class: 'button button--primary bar-cta', type: 'button', onclick: onCta });
  const booking = restaurant.bookingEnabled && bookingPanel(state, restaurant, nowMs, {
    heading: restaurant.waitingEnabled ? null : R.bookingHeading,
    onConfirm: () => showToast(R.bookingUnavailable),
    onSoldOut: (condition) => {
      const existing = liveRequestFor(getState(), condition);
      if (existing) window.location.href = pageUrl('customer/cancellation-queue.html');
      else openJoinSheet(restaurant, condition, () => { window.location.href = pageUrl('customer/cancellation-queue.html'); });
    },
    isJoined: (condition) => Boolean(liveRequestFor(getState(), condition)),
  });
  const W = STRINGS.waiting;
  const queueSlot = h('div', { class: 'queue-slot' });
  const stripSlot = h('div', { class: 'ticket-strip-slot' });
  const modes = [
    booking && { key: 'booking', element: h('div', { class: 'mode-panel' }, h('div', { class: 'detail-block' }, booking.element), booking.schedule) },
    restaurant.waitingEnabled && { key: 'waiting', element: h('div', { class: 'mode-panel' }, queueSlot, waitingStatsSection(waitingStatistics(state, restaurant), today)) },
  ].filter(Boolean);
  const myTicket = () => (restaurant.waitingEnabled ? activeTicketFor(getState(), restaurant.id) : null);
  function show(nextMode) {
    mode = nextMode;
    modes.forEach((m) => { m.element.hidden = m.key !== mode; });
    refreshCta();
  }
  // Waiting CTA: View My Waiting for a live ticket, otherwise registration or why it is closed
  function waitingAction() {
    const ticket = myTicket();
    if (ticket) return { label: W.ctaView, href: pageUrl('customer/waiting.html', { ticketId: ticket.id }) };
    const status = registrationStatus(getState(), restaurant);
    if (status.open) return { label: W.ctaRegister, href: pageUrl('customer/waiting-register.html', { restaurantId: restaurant.id }) };
    return { label: status.reason === 'WAITING_MIN_TEAMS' ? W.ctaMinTeams(restaurant.waiting.remoteMinTeams) : W.ctaClosed, reason: status.reason };
  }
  function refreshCta() {
    const action = mode === 'waiting' ? waitingAction() : { label: R.ctaBooking };
    cta.textContent = action.label;
    cta.setAttribute('aria-disabled', String(Boolean(action.reason)));
  }
  function onCta() {
    if (mode === 'booking') { (booking.getSelection() ? booking.openConfirm() : booking.openPicker()); return; }
    const action = waitingAction();
    if (action.href) window.location.href = action.href;
    else showToast(STRINGS.errors[action.reason]);
  }
  // Strips above the bottom bar: live waiting ticket and live cancellation-seat request/offer
  function refreshWaiting() {
    const latest = getState();
    if (restaurant.waitingEnabled) queueSlot.replaceChildren(queueBlock(latest, restaurant, () => { refreshWaiting(); showToast(W.refreshed); }));
    stripSlot.replaceChildren(...[
      restaurant.bookingEnabled && cancellationStrip(latest, restaurant),
      ticketStrip(latest, myTicket()),
    ].filter(Boolean));
    refreshCta();
  }

  const initialMode = myTicket() ? 'waiting' : modes[0]?.key;

  // Tabs and panels
  const tabDefs = [
    ['home', R.tabs.home],
    restaurant.news.length > 0 && ['news', R.tabs.news],
    ['menu', R.tabs.menu],
    ['photos', restaurant.photoCount === null ? R.tabs.photos : `${R.tabs.photos} ${formatCapped(restaurant.photoCount)}`],
    ['reviews', restaurant.reviewCount === null ? R.tabs.reviews : `${R.tabs.reviews} ${restaurant.reviewCount.toLocaleString('ko-KR')}`],
    restaurant.broadcasts.length > 0 && ['broadcasts', R.tabs.broadcasts],
    ['info', R.tabs.info],
  ].filter(Boolean);
  const builders = {
    home: () => [
      restaurant.coupon && h('div', { class: 'detail-block detail-block--tight' }, couponSlot),
      modes.length > 1 && modePicker(modes, initialMode, show),
      modes.map((m) => m.element),
      restaurant.aiSummary && aiSummaryCard(restaurant.aiSummary),
      homePreviews(restaurant, (key, section) => selectTab(key, section), weekdayLabel),
    ],
    news: () => newsPanel(restaurant),
    menu: () => menuPanel(restaurant),
    photos: () => photosPanel(restaurant),
    reviews: () => reviewsPanel(restaurant),
    broadcasts: () => broadcastsPanel(restaurant),
    info: () => infoPanel(restaurant, weekdayLabel),
  };
  const tabButtons = tabDefs.map(([key, label]) => h('button', {
    class: 'detail-tab', type: 'button', role: 'tab', id: `tab-${key}`, 'aria-controls': `panel-${key}`,
    'aria-selected': 'false', tabindex: '-1', onclick: () => selectTab(key),
  }, label));
  const tablist = h('div', { class: 'detail-tabs', role: 'tablist', 'aria-label': R.tabsLabel }, tabButtons);
  const panels = Object.fromEntries(tabDefs.map(([key]) => [key,
    h('div', { class: 'tab-panel', role: 'tabpanel', id: `panel-${key}`, 'aria-labelledby': `tab-${key}`, hidden: true }, builders[key]())]));
  const tabsAnchor = h('div', { class: 'tabs-anchor' });

  function selectTab(key, sectionKey) {
    tabButtons.forEach((button) => {
      const selected = button.id === `tab-${key}`;
      button.setAttribute('aria-selected', String(selected));
      button.tabIndex = selected ? 0 : -1;
    });
    Object.entries(panels).forEach(([panelKey, panel]) => { panel.hidden = panelKey !== key; });
    const target = sectionKey && panels[key].querySelector(`[data-info-section="${sectionKey}"]`);
    if (target) { target.scrollIntoView({ block: 'start' }); return; }
    const pinnedTop = tabsAnchor.getBoundingClientRect().top + window.scrollY - header.offsetHeight;
    if (window.scrollY > pinnedTop) window.scrollTo({ top: pinnedTop });
  }
  tablist.addEventListener('keydown', (event) => {
    const index = tabButtons.indexOf(document.activeElement);
    const step = { ArrowRight: 1, ArrowLeft: -1 }[event.key];
    const target = step ? (index + step + tabButtons.length) % tabButtons.length
      : event.key === 'Home' ? 0 : event.key === 'End' ? tabButtons.length - 1 : null;
    if (index < 0 || target === null) return;
    event.preventDefault();
    tabButtons[target].focus();
    selectTab(tabDefs[target][0]);
  });

  const header = h('header', { class: 'detail-header' },
    iconLink('back', R.back, homeHref),
    iconLink('home', R.home, homeHref),
    h('p', { class: 'detail-header__title', 'aria-hidden': 'true' }, restaurant.name),
    iconLink('search', R.search, pageUrl('customer/search.html')),
    headerSave,
    iconButton('share', R.share, () => copyWithToast(window.location.href, R.linkCopied, R.linkCopyFailed)));

  document.title = `${restaurant.name} · ${STRINGS.appName}`;
  app.replaceChildren(
    header,
    h('main', { class: 'mobile-content detail' },
      photoCarousel(restaurant),
      summaryBlock(restaurant, { weekdayLabel, onLocation: () => selectTab('info', 'location'), onReviews: () => selectTab('reviews') }),
      h('div', { class: 'section-band' }),
      tabsAnchor,
      tablist,
      Object.values(panels)),
    h('div', { class: 'detail-footer' },
      stripSlot,
      restaurant.ribbon && h('p', { class: 'detail-ribbon' }, h('strong', {}, restaurant.ribbon.lead), ` ${restaurant.ribbon.text}`),
      h('div', { class: 'bottom-bar detail-bar' },
        barSave,
        h('button', { class: 'bar-action', type: 'button', onclick: () => showToast(R.phoneUnavailable) }, icon('phone'), h('span', { class: 'bar-action__label' }, R.phone)),
        cta)));

  show(initialMode);
  selectTab('home');
  window.scrollTo({ top: 0 });
  refreshSaved();
  refreshCoupon();
  refreshWaiting();
  subscribe(() => { refreshSaved(); refreshCoupon(); refreshWaiting(); });
  // Offer deadlines are absolute: re-check them so an expired offer hands off and its strip goes.
  window.setInterval(reconcile, 5000);

  const name = app.querySelector('.detail-summary__name');
  const onScroll = () => header.classList.toggle('is-scrolled', name.getBoundingClientRect().bottom < header.getBoundingClientRect().bottom);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

function renderNotFound() {
  document.title = `${R.notFoundTitle} · ${STRINGS.appName}`;
  app.replaceChildren(
    pageHeader({ backHref: homeHref, backLabel: R.back }),
    h('main', { class: 'mobile-content empty-state' },
      h('h1', { class: 'empty-state__title' }, R.notFoundTitle),
      h('p', { class: 'text-secondary' }, R.notFoundBody),
      h('a', { class: 'button button--primary', href: homeHref }, R.notFoundAction)));
}

reconcile();  // expire overdue offers before the first render
const state = getState();
const restaurant = state.restaurants.find((r) => r.id === queryParam('restaurantId'));
if (restaurant) renderDetail(state, restaurant);
else renderNotFound();
