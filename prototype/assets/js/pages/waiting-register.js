// C13 Waiting registration, two steps as in the app: 방문 인원 선택 (183123) then 웨이팅 정보 확인
// (183234). A customer who already holds a live ticket here is sent to it instead.
import { STRINGS } from '../core/strings.js';
import { getState } from '../core/store.js';
import { pageUrl, queryParam } from '../core/nav.js';
import { activeTicketFor, queueSummary, registerWaiting } from '../services/waiting.js';
import { h } from '../ui/dom.js';
import { icon } from '../ui/icons.js';
import { pageHeader } from '../ui/header.js';
import { showToast } from '../ui/toast.js';

const W = STRINGS.waiting;
const app = document.getElementById('app');
const ticketHref = (ticketId, params = {}) => pageUrl('customer/waiting.html', { ticketId, ...params });
const KINDS = ['adults', 'infants', 'pets', 'strollers'];
const MIN = { adults: 1, infants: 0, pets: 0, strollers: 0 };
const EXTRA_MAX = 5;  // pets and strollers do not count toward the party size

function backButton(label, onclick) {
  return h('header', { class: 'page-header' },
    h('button', { class: 'icon-button', type: 'button', 'aria-label': STRINGS.restaurant.back, onclick }, icon('back')),
    h('h1', { class: 'page-header__title' }, label));
}

function render(restaurant) {
  const party = { adults: 2, infants: 0, pets: 0, strollers: 0 };
  const max = restaurant.waiting.maxPartySize;
  const detailHref = pageUrl('customer/restaurant.html', { restaurantId: restaurant.id });
  const size = () => party.adults + party.infants;

  function partyStep() {
    const total = h('strong', { class: 'party-total__value', 'aria-live': 'polite' });
    const rows = KINDS.map((kind) => {
      const label = W.partyKinds[kind];
      const value = h('span', { class: 'stepper__value', 'aria-live': 'polite' });
      const minus = h('button', { class: 'stepper__button', type: 'button', 'aria-label': W.decrease(label), onclick: () => change(kind, -1) }, icon('minus'));
      const plus = h('button', { class: 'stepper__button', type: 'button', 'aria-label': W.increase(label), onclick: () => change(kind, 1) }, icon('plus'));
      return { kind, value, minus, plus, element: h('li', { class: 'party-row' }, h('span', { class: 'party-row__label' }, label), h('span', { class: 'stepper' }, minus, value, plus)) };
    });
    function refresh() {
      rows.forEach(({ kind, value, minus, plus }) => {
        value.textContent = String(party[kind]);
        minus.disabled = party[kind] <= MIN[kind];
        plus.disabled = kind === 'adults' || kind === 'infants' ? size() >= max : party[kind] >= EXTRA_MAX;
      });
      total.textContent = W.partyTotal(size());
    }
    function change(kind, step) {
      party[kind] += step;
      refresh();
    }
    refresh();
    app.replaceChildren(
      pageHeader({ title: W.partyTitle, backHref: detailHref, backLabel: STRINGS.restaurant.back }),
      h('main', { class: 'mobile-content waiting-step' },
        h('h2', { class: 'waiting-step__question' }, W.partyQuestion),
        h('ul', { class: 'party-rows' }, rows.map((row) => row.element)),
        h('p', { class: 'waiting-step__hint' }, W.partyMax(max))),
      h('div', { class: 'bottom-bar bottom-bar--stacked' },
        h('p', { class: 'party-total' }, h('span', {}, W.partyTotalLabel), total),
        h('button', { class: 'button button--primary button--block', type: 'button', onclick: confirmStep }, W.next)));
    window.scrollTo({ top: 0 });
  }

  function confirmStep() {
    const summary = queueSummary(getState(), restaurant);
    const submit = h('button', { class: 'button button--primary button--block', type: 'button', onclick: onSubmit }, W.submit);
    function onSubmit() {
      submit.disabled = true;  // the service also rejects a second registration
      const result = registerWaiting(restaurant.id, { adults: party.adults, infants: party.infants });
      if (result.ok) { window.location.replace(ticketHref(result.ticketId, { registered: '1' })); return; }
      showToast(STRINGS.errors[result.reason] ?? STRINGS.errors.INVALID_STATE);
      if (result.ticketId) window.location.replace(ticketHref(result.ticketId));
      else submit.disabled = false;
    }
    const row = (label, value, minor = false) => h('div', { class: `confirm-row${minor ? ' confirm-row--minor' : ''}` }, h('dt', {}, label), h('dd', {}, value));
    app.replaceChildren(
      backButton(W.confirmTitle, partyStep),
      h('main', { class: 'mobile-content waiting-step' },
        h('h2', { class: 'waiting-step__question pre-line' }, W.confirmQuestion(restaurant.name)),
        h('dl', { class: 'queue-facts' },
          h('div', {}, h('dt', {}, W.currentTeams), h('dd', {}, W.teamsValue(summary.teams))),
          h('div', {}, h('dt', {}, W.expectedTime), h('dd', {}, W.minutesValue(summary.minutes)))),
        h('p', { class: 'waiting-step__hint' }, W.estimateNote),
        h('div', { class: 'section-band waiting-step__band' }),
        h('dl', { class: 'confirm-rows' },
          row(W.useType, W.useTypeValue),
          row(W.totalPeople, W.people(size())),
          row(W.partyKinds.adults, W.people(party.adults), true),
          party.infants > 0 && row(W.partyKinds.infants, W.people(party.infants), true),
          party.pets > 0 && row(W.partyKinds.pets, String(party.pets), true),
          party.strollers > 0 && row(W.partyKinds.strollers, String(party.strollers), true)),
        h('section', { class: 'waiting-rules' },
          h('h3', { class: 'waiting-rules__title' }, W.rulesTitle),
          h('ul', {}, W.rules.map((rule) => h('li', {}, icon('check'), h('span', {}, rule)))))),
      h('div', { class: 'bottom-bar' }, submit));
    window.scrollTo({ top: 0 });
  }

  partyStep();
}

function renderNotFound() {
  const R = STRINGS.restaurant;
  app.replaceChildren(
    pageHeader({ backHref: pageUrl('customer/discovery.html'), backLabel: R.back }),
    h('main', { class: 'mobile-content empty-state' },
      h('h1', { class: 'empty-state__title' }, R.notFoundTitle),
      h('p', { class: 'text-secondary' }, R.notFoundBody),
      h('a', { class: 'button button--primary', href: pageUrl('customer/discovery.html') }, R.notFoundAction)));
}

document.title = `${W.partyTitle} · ${STRINGS.appName}`;
const state = getState();
const restaurant = state.restaurants.find((r) => r.id === queryParam('restaurantId'));
const existing = restaurant && activeTicketFor(state, restaurant.id);
if (existing) window.location.replace(ticketHref(existing.id));
else if (restaurant?.waitingEnabled) render(restaurant);
else renderNotFound();
