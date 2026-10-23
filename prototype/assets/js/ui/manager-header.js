// Header shared by the manager pages: restaurant, signed-in manager, page navigation, hub link.
import { STRINGS } from '../core/strings.js';
import { pageUrl } from '../core/nav.js';
import { h } from './dom.js';

const PAGES = [['waiting', 'manager/waiting.html'], ['reservations', 'manager/reservations.html']];

export function managerHeader(restaurant, manager, current) {
  const A = STRINGS.allocation;
  return h('header', { class: 'mgr-header' },
    h('div', { class: 'mgr-header__title' },
      h('img', { src: pageUrl('assets/images/logo.svg'), alt: '', width: 32, height: 32 }),
      h('div', {}, h('h1', {}, restaurant.name), h('p', {}, STRINGS.manager.managerLine(manager)))),
    h('nav', { class: 'mgr-nav', 'aria-label': A.navLabel },
      PAGES.map(([key, path]) => h('a', { class: 'mgr-nav__link', href: pageUrl(path), 'aria-current': key === current ? 'page' : null }, A.nav[key]))),
    h('a', { class: 'mgr-header__hub', href: pageUrl('index.html') }, STRINGS.manager.hubLink));
}
