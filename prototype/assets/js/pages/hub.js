// Presenter-only demo hub: reset, clock, role/identity selection, preset and route list.
import { STRINGS } from '../core/strings.js';
import { getState, getStorageStatus, subscribe, resetDemo, setPreference } from '../core/store.js';
import { now, advance } from '../core/clock.js';
import { addDays, formatClockTime, formatDateKey, formatDateTime } from '../core/format.js';
import { pageUrl } from '../core/nav.js';
import { applyPreset, PRESET_KEYS } from '../services/presets.js';
import { addWalkIn } from '../services/waiting.js';
import { reconcileOffers, releaseSlot, findOffer } from '../services/allocation.js';
import { setFailNextNotification, retryFailedNotifications, failedNotifications } from '../services/notification.js';
import { dateLabel } from '../ui/cancellation-ui.js';
import { h } from '../ui/dom.js';
import { confirmDialog } from '../ui/modal.js';
import { showToast } from '../ui/toast.js';

const T = STRINGS.hub;
const MINUTE_MS = 60 * 1000;
const refs = {};  // nodes whose content refresh() keeps in sync with the store

async function requestReset() {
  const confirmed = await confirmDialog({
    title: T.resetDialogTitle,
    message: T.resetDialogMessage,
    confirmLabel: T.resetConfirm,
    tone: 'danger',
  });
  if (!confirmed) return;
  resetDemo();
  showToast(T.resetDone);
}

function advanceBy(minutes) {
  const result = advance(minutes * MINUTE_MS);
  if (!result.ok) { showToast(STRINGS.errors[result.reason]); return; }
  const { expired } = reconcileOffers();  // jumping the clock may pass offer deadlines
  showToast(expired ? `${T.clockAdvanced(minutes)} ${T.offersExpired(expired)}` : T.clockAdvanced(minutes));
}

function changePreference(key, value, successMessage) {
  const result = setPreference(key, value);
  showToast(result.ok ? successMessage : STRINGS.errors[result.reason]);
  if (!result.ok) refresh();  // put the control back to the stored value
}

function panel(title, ...content) {
  return h('section', { class: 'hub-panel' }, h('h2', { class: 'hub-panel__title' }, title), ...content);
}

function button(label, onclick, modifier = '') {
  return h('button', { class: `button ${modifier}`, type: 'button', onclick }, label);
}

function buildHeader() {
  return h('header', { class: 'hub-header' },
    h('img', { src: pageUrl('assets/images/logo.svg'), alt: '', width: 40, height: 40 }),
    h('div', {},
      h('p', { class: 'hub-header__eyebrow' }, T.eyebrow),
      h('h1', { class: 'hub-header__title' }, T.title)));
}

function buildStorageBanner() {
  refs.storageMessage = h('p');
  refs.storageBanner = h('div', { class: 'notice notice--warning hub-banner', role: 'alert', hidden: true },
    refs.storageMessage,
    button(T.reset, requestReset, 'button--small'));
  return refs.storageBanner;
}

function buildStatePanel() {
  const fact = (label, ref) => h('div', {}, h('dt', {}, label), (refs[ref] = h('dd')));
  return panel(T.stateHeading,
    h('dl', { class: 'hub-facts' },
      fact(T.baseDate, 'baseDate'),
      fact(T.demoTime, 'demoTime'),
      fact(T.scenarioEpoch, 'epoch')),
    h('div', { class: 'button-row' },
      button(T.reset, requestReset, 'button--danger'),
      button(T.advance(1), () => advanceBy(1)),
      button(T.advance(10), () => advanceBy(10))));
}

function buildIdentityPanel(state) {
  refs.roleInputs = Object.entries(T.roles).map(([role, label]) => h('input', {
    type: 'radio', name: 'role', value: role,
    onchange: () => changePreference('activeRole', role, T.roleChanged(label)),
  }));
  refs.customerSelect = h('select', {
    id: 'customer-select',
    onchange: (event) => {
      const customer = state.customers.find((c) => c.id === event.target.value);
      changePreference('activeCustomerId', event.target.value, T.identityChanged(customer?.displayName));
    },
  }, state.customers.map((customer) => h('option', { value: customer.id }, T.customerOption(customer))));
  refs.managerSelect = h('select', {
    id: 'manager-select',
    onchange: (event) => {
      const manager = state.managers.find((m) => m.id === event.target.value);
      changePreference('activeManagerId', event.target.value, T.identityChanged(manager?.displayName));
    },
  }, state.managers.map((manager) => {
    const restaurant = state.restaurants.find((r) => r.id === manager.restaurantId);
    return h('option', { value: manager.id }, T.managerOption(manager, restaurant));
  }));

  return panel(T.identityHeading,
    h('fieldset', { class: 'hub-field' },
      h('legend', {}, T.roleLegend),
      h('div', { class: 'hub-radios' },
        refs.roleInputs.map((input) => h('label', {}, input, T.roles[input.value])))),
    h('div', { class: 'hub-field' }, h('label', { for: 'customer-select' }, T.customerLabel), refs.customerSelect),
    h('div', { class: 'hub-field' }, h('label', { for: 'manager-select' }, T.managerLabel), refs.managerSelect));
}

async function requestPreset(key) {
  const confirmed = await confirmDialog({
    title: T.resetDialogTitle, message: T.resetDialogMessage, confirmLabel: T.applyPreset, tone: 'danger',
  });
  if (!confirmed) return;
  const result = applyPreset(key);
  showToast(result.ok ? T.presetApplied(T.presets[key]) : STRINGS.errors[result.reason]);
}

function buildPresetsPanel() {
  return panel(T.presetsHeading,
    h('p', { class: 'hub-hint' }, T.presetsHint),
    h('ul', { class: 'hub-list' },
      PRESET_KEYS.map((key) => h('li', {},
        h('span', {}, T.presets[key]),
        button(T.applyPreset, () => requestPreset(key), 'button--small'))),
      T.laterPresets.map((name) => h('li', {},
        h('span', {}, name),
        h('span', { class: 'hub-hint' }, T.unavailable)))));
}

function buildWalkInPanel(state) {
  return panel(T.walkInHeading,
    h('p', { class: 'hub-hint' }, T.walkInHint),
    h('div', { class: 'button-row' }, state.restaurants.filter((r) => r.waitingEnabled).map((restaurant) => button(T.addWalkIn(restaurant), () => {
      const result = addWalkIn(restaurant.id);
      showToast(result.ok ? T.walkInAdded(restaurant) : STRINGS.errors[result.reason]);
    }))));
}

// Release one slot unit (another customer's cancellation); allocation runs immediately.
function buildReleasePanel(state) {
  const restaurants = state.restaurants.filter((r) => r.bookingEnabled);
  const field = (id, label, control) => h('div', { class: 'hub-field' }, h('label', { for: id }, label), control);
  const restaurantSelect = h('select', { id: 'release-restaurant', onchange: fillOptions }, restaurants.map((r) => h('option', { value: r.id }, r.name)));
  const dateSelect = h('select', { id: 'release-date' });
  const timeSelect = h('select', { id: 'release-time' });
  const partySelect = h('select', { id: 'release-party' });
  function fillOptions() {
    const restaurant = restaurants.find((r) => r.id === restaurantSelect.value);
    const base = getState().meta.baseDate;
    dateSelect.replaceChildren(...Array.from({ length: 7 }, (_, i) => addDays(base, i)).map((key) => h('option', { value: key }, dateLabel(key))));
    timeSelect.replaceChildren(...restaurant.booking.times.map((time) => h('option', { value: time }, formatClockTime(time))));
    partySelect.replaceChildren(...Array.from({ length: restaurant.booking.maxPartySize }, (_, i) => h('option', { value: i + 1 }, T.partyOption(i + 1))));
    if (restaurant.id === 'r1') { dateSelect.value = addDays(base, 1); timeSelect.value = '19:00'; partySelect.value = '2'; }  // fixture slot
  }
  function onRelease() {
    const result = releaseSlot({ restaurantId: restaurantSelect.value, serviceDate: dateSelect.value, serviceTime: timeSelect.value, partySize: Number(partySelect.value) });
    if (!result.ok) { showToast(STRINGS.errors[result.reason]); return; }
    const latest = getState();
    const slot = latest.releasedSlots.find((s) => s.id === result.slotId);
    const owner = slot.offerId && latest.customers.find((c) => c.id === findOffer(latest, slot.offerId).ownerId);
    showToast(owner ? T.releasedOffer(owner.displayName) : T.releasedAvailable);
  }
  fillOptions();
  return panel(T.releaseHeading,
    h('p', { class: 'hub-hint' }, T.releaseHint),
    h('div', { class: 'hub-form' },
      field('release-restaurant', T.releaseRestaurant, restaurantSelect),
      field('release-date', T.releaseDate, dateSelect),
      field('release-time', T.releaseTime, timeSelect),
      field('release-party', T.releaseParty, partySelect)),
    button(T.release, onRelease, 'button--primary'));
}

function buildNotifyPanel() {
  refs.failState = h('p', { class: 'hub-hint', role: 'status' });
  refs.retryButton = button('', () => {
    const result = retryFailedNotifications();
    showToast(result.ok ? T.retried : STRINGS.errors[result.reason]);
  });
  return panel(T.notifyHeading,
    h('p', { class: 'hub-hint' }, T.notifyHint),
    refs.failState,
    h('div', { class: 'button-row' },
      button(T.failNext, () => { const result = setFailNextNotification(true); showToast(result.ok ? T.failArmed : STRINGS.errors[result.reason]); }),
      refs.retryButton));
}

function buildScreensPanel(state) {
  const link = (label, path, params) => h('li', {}, h('a', { href: pageUrl(path, params) }, label));
  return panel(T.screensHeading,
    h('ul', { class: 'hub-list' },
      link(T.customerApp, 'customer/discovery.html'),
      state.restaurants.map((restaurant) => link(T.restaurantLink(restaurant), 'customer/restaurant.html', { restaurantId: restaurant.id })),
      link(T.queueLink, 'customer/cancellation-queue.html'),
      link(T.inboxLink, 'customer/inbox.html'),
      link(T.managerApp, 'manager/waiting.html'),
      link(T.managerReservations, 'manager/reservations.html'),
      link(T.uiSample, 'customer/ui-sample.html'),
      link(T.selfCheck, 'tests/index.html')));
}

function refreshClock() {
  refs.demoTime.textContent = formatDateTime(now());
}

function refresh() {
  const state = getState();
  const status = getStorageStatus();
  refs.storageBanner.hidden = status === 'ok';
  refs.storageMessage.textContent = STRINGS.storage[status] ?? '';
  refs.baseDate.textContent = formatDateKey(state.meta.baseDate);
  refs.epoch.textContent = String(state.meta.scenarioEpoch);
  refs.roleInputs.forEach((input) => { input.checked = input.value === state.meta.activeRole; });
  refs.customerSelect.value = state.meta.activeCustomerId;
  refs.managerSelect.value = state.meta.activeManagerId;
  refs.failState.textContent = T.failState(Boolean(state.meta.failNextNotification));
  const failed = failedNotifications(state).length;
  refs.retryButton.textContent = T.retryFailed(failed);
  refs.retryButton.disabled = failed === 0;
  refreshClock();
}

document.title = T.pageTitle;
const initialState = getState();
document.getElementById('app').replaceChildren(
  buildHeader(),
  buildStorageBanner(),
  h('p', { class: 'notice' }, T.mockNotice),
  h('div', { class: 'hub-grid' },
    buildStatePanel(),
    buildIdentityPanel(initialState),
    buildPresetsPanel(),
    buildScreensPanel(initialState),
    buildReleasePanel(initialState),
    buildWalkInPanel(initialState),
    buildNotifyPanel()),
);
refresh();
subscribe(refresh);
setInterval(refreshClock, 1000);  // view refresh only; demo time itself comes from clock.now()
reconcileOffers();
setInterval(reconcileOffers, 5000);  // the hub also hands on expired offers while it is the open tab
