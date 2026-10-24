// The one weekday/time-slot statistics component for every waiting-enabled restaurant, modelled
// on the app's "요일별 평균 웨이팅 시간 Beta" chart (capture 173602): line + area over hours 6-24,
// weekday chips with "대기 많음", tooltip "평균 N팀 | M분". To-Be additions: period/update
// caption, hours with too few records break the line and read "수집 중", not-a-forecast note.
// Single series: no legend. Keyboard/screen-reader access goes through a radio group of hours.
import { POLICY } from '../core/config.js';
import { STRINGS } from '../core/strings.js';
import { formatMonthDay, formatTimestamp } from '../core/format.js';
import { h } from './dom.js';
import { icon } from './icons.js';
import { showToast } from './toast.js';

const S = STRINGS.stats;
const WEEKS = POLICY.statsPeriodWeeks;
const WEEK_ORDER = [1, 2, 3, 4, 5, 6, 0];  // Monday first, as the app shows
const SVG_NS = 'http://www.w3.org/2000/svg';
// The tooltip sits in the band above `top`, so unlike the app it never hides a nearby peak
const VIEW = { width: 320, height: 150, left: 12, right: 308, top: 40, bottom: 124 };
const xOf = (hour) => VIEW.left + ((hour - 6) / 18) * (VIEW.right - VIEW.left);
const hourOf = (slot) => Number(slot.slice(0, 2));

function svg(tag, attributes = {}) {
  const element = document.createElementNS(SVG_NS, tag);
  for (const [name, value] of Object.entries(attributes)) element.setAttribute(name, value);
  return element;
}

function metaText(stats) {
  const period = stats.periodStart
    ? S.period(WEEKS, formatMonthDay(stats.periodStart), formatMonthDay(stats.periodEnd))
    : S.periodUnknown(WEEKS);
  return stats.updatedAt ? `${period} · ${S.updated(formatTimestamp(stats.updatedAt))}` : period;
}

function busiestWeekday(stats) {
  const totals = WEEK_ORDER.map((weekday) => [weekday, stats.slots.reduce((sum, slot) => {
    const cell = stats.cell(weekday, slot);
    return sum + (cell.status === 'ready' ? cell.avgMinutes : 0);
  }, 0)]);
  return totals.reduce((best, entry) => (entry[1] > best[1] ? entry : best))[0];
}

function drawChart(chart, stats, weekday, selected) {
  const max = stats.maxMinutes * 1.15;
  const yOf = (minutes) => VIEW.bottom - (minutes / max) * (VIEW.bottom - VIEW.top);
  const points = stats.slots.map((slot) => ({ slot, cell: stats.cell(weekday, slot), x: xOf(hourOf(slot)) }));
  const runs = [];
  points.forEach((point) => {
    if (point.cell.status !== 'ready') { runs.push([]); return; }
    point.y = yOf(point.cell.avgMinutes);
    if (!runs.length) runs.push([]);
    runs[runs.length - 1].push(point);
  });
  chart.replaceChildren();
  [0, 1, 2, 3].forEach((step) => {
    const y = VIEW.top + ((VIEW.bottom - VIEW.top) / 4) * step;
    chart.append(svg('line', { class: 'chart-grid', x1: VIEW.left, x2: VIEW.right, y1: y, y2: y }));
  });
  chart.append(svg('line', { class: 'chart-axis', x1: VIEW.left, x2: VIEW.right, y1: VIEW.bottom, y2: VIEW.bottom }));
  for (let hour = 6; hour <= 24; hour += 2) {
    const label = svg('text', { class: 'chart-label', x: xOf(hour), y: VIEW.bottom + 16, 'text-anchor': 'middle' });
    label.textContent = String(hour);
    chart.append(label);
  }
  runs.filter((run) => run.length).forEach((run) => {
    const line = run.map((p, i) => `${i ? 'L' : 'M'}${p.x},${p.y}`).join(' ');
    chart.append(svg('path', { class: 'chart-area', d: `M${run[0].x},${VIEW.bottom} ${line.replace('M', 'L')} L${run.at(-1).x},${VIEW.bottom} Z` }));
    chart.append(svg('path', { class: 'chart-line', d: line }));
    run.forEach((p) => chart.append(svg('circle', { class: 'chart-point', cx: p.x, cy: p.y, r: 3.5 })));
  });
  const focus = points.find((p) => p.slot === selected);
  if (focus) {
    const ready = focus.cell.status === 'ready';
    chart.append(svg('line', { class: `chart-marker${ready ? '' : ' chart-marker--muted'}`, x1: focus.x, x2: focus.x, y1: VIEW.top - 12, y2: VIEW.bottom }));
    if (ready) {
      chart.append(svg('circle', { class: 'chart-halo', cx: focus.x, cy: focus.y, r: 8 }));
      chart.append(svg('circle', { class: 'chart-selected', cx: focus.x, cy: focus.y, r: 4.5 }));
    }
  }
  points.forEach((p) => chart.append(svg('rect', { class: 'chart-hit', 'data-slot': p.slot, x: p.x - 8, y: VIEW.top, width: 16, height: VIEW.bottom - VIEW.top })));
  return focus;
}

/** `initial` = { weekday, hour } of the demo clock; the hour falls back to the nearest open hour. */
export function waitingStatsSection(stats, initial) {
  const section = h('section', { class: 'detail-block stats', 'aria-labelledby': 'stats-title' },
    h('div', { class: 'stats__head' },
      h('h2', { class: 'stats__title', id: 'stats-title' }, S.title, h('span', { class: 'stats__beta' }, S.beta)),
      h('button', { class: 'info-button', type: 'button', 'aria-label': S.info, onclick: () => showToast(S.note) }, icon('info'))),
    h('p', { class: 'stats__meta' }, metaText(stats)));
  if (stats.status === 'collecting') {
    section.append(h('div', { class: 'stats-empty' },
      icon('chart', 'stats-empty__icon'),
      h('p', { class: 'stats-empty__title' }, S.collectingTitle),
      h('p', { class: 'text-secondary' }, S.collectingBody(WEEKS, stats.totalSamples, POLICY.statsMinSamples))));
    return section;
  }

  const hours = stats.slots.map(hourOf);
  let weekday = initial.weekday;
  let slot = stats.slots[hours.indexOf(Math.min(Math.max(initial.hour, hours[0]), hours.at(-1)))];
  const busy = busiestWeekday(stats);
  const chart = svg('svg', { class: 'stats-chart__svg', viewBox: `0 0 ${VIEW.width} ${VIEW.height}`, 'aria-hidden': 'true' });
  const tooltip = h('div', { class: 'stats-tooltip', 'aria-hidden': 'true' });
  const chartBox = h('div', { class: 'stats-chart' }, chart, tooltip);
  const selection = h('p', { class: 'stats__selection', 'aria-live': 'polite' });
  const slotInputs = stats.slots.map((value) => h('input', {
    class: 'visually-hidden', type: 'radio', name: 'stats-slot', value, checked: value === slot,
    onchange: () => { slot = value; render(); },
  }));
  const slotLabels = slotInputs.map((input) => h('label', {}, input, h('span', { class: 'visually-hidden' })));

  function render() {
    const focus = drawChart(chart, stats, weekday, slot);
    const cell = focus.cell;
    const ready = cell.status === 'ready';
    tooltip.replaceChildren(...(ready
      ? [S.average, ' ', h('strong', {}, S.teams(cell.avgTeams)), h('span', { class: 'stats-tooltip__bar' }, '|'), h('strong', {}, S.minutes(cell.avgMinutes))]
      : [S.collecting]));
    tooltip.classList.toggle('is-muted', !ready);
    tooltip.style.left = `${Math.min(Math.max((focus.x / VIEW.width) * 100, 18), 82)}%`;
    const where = `${STRINGS.weekdays[weekday]}${S.weekdaySuffix} ${S.hour(slot)}`;
    selection.textContent = ready
      ? `${S.slotLabel(where, cell.avgTeams, cell.avgMinutes)} · ${S.records(cell.sampleCount)}`
      : `${where} · ${S.collecting} · ${S.collectingDetail(cell.sampleCount, POLICY.statsMinSamples)}`;
    slotLabels.forEach((label, index) => {
      const c = stats.cell(weekday, stats.slots[index]);
      label.lastChild.textContent = c.status === 'ready'
        ? S.slotLabel(S.hour(stats.slots[index]), c.avgTeams, c.avgMinutes)
        : `${S.hour(stats.slots[index])} ${S.collecting}`;
    });
  }

  chart.addEventListener('click', (event) => {
    const hit = event.target.closest?.('.chart-hit');
    if (!hit) return;
    slot = hit.dataset.slot;
    slotInputs.find((input) => input.value === slot).checked = true;
    render();
  });
  const slotGroup = h('fieldset', { class: 'stats-slots' }, h('legend', { class: 'visually-hidden' }, S.slotLegend), slotLabels);
  slotGroup.addEventListener('focusin', () => chartBox.classList.add('is-focused'));
  slotGroup.addEventListener('focusout', () => chartBox.classList.remove('is-focused'));

  section.append(
    chartBox,
    slotGroup,
    h('fieldset', { class: 'weekday-chips' },
      h('legend', { class: 'visually-hidden' }, S.weekdayLegend),
      WEEK_ORDER.map((day) => h('label', { class: 'weekday-chip' },
        day === busy && h('span', { class: 'weekday-chip__badge', 'aria-hidden': 'true' }, S.busy),
        h('input', {
          class: 'visually-hidden', type: 'radio', name: 'stats-weekday', value: day, checked: day === weekday,
          'aria-label': `${STRINGS.weekdays[day]}${S.weekdaySuffix}${day === busy ? `, ${S.busy}` : ''}`,
          onchange: () => { weekday = day; render(); },
        }),
        STRINGS.weekdays[day]))),
    selection,
    h('p', { class: 'stats__note' }, S.note));
  render();
  return section;
}
