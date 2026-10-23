// App tab bar (홈 / 저장 / 내 주변 / 마이다이닝 / MY). Tabs without a demo page explain that on tap.
import { STRINGS } from '../core/strings.js';
import { pageUrl } from '../core/nav.js';
import { h } from './dom.js';
import { icon } from './icons.js';
import { notInDemo } from './toast.js';

const N = STRINGS.nav;
const ITEMS = [
  { key: 'home', icon: 'home', label: N.home, path: 'customer/discovery.html' },
  { key: 'saved', icon: 'bookmark', label: N.saved, path: 'customer/saved.html' },
  { key: 'nearby', icon: 'pin', label: N.nearby },
  { key: 'myDining', icon: 'calendar', label: N.myDining, path: 'customer/my-dining.html' },
  { key: 'my', icon: 'user', label: N.my },
];

export function bottomNav(currentKey) {
  return h('nav', { class: 'bottom-nav', 'aria-label': N.label },
    ITEMS.map((item) => {
      const current = item.key === currentKey;
      const content = [icon(item.icon, `icon${current ? ' is-filled' : ''}`), h('span', {}, item.label)];
      return item.path
        ? h('a', { class: 'bottom-nav__item', href: pageUrl(item.path), 'aria-current': current ? 'page' : null }, content)
        : h('button', { class: 'bottom-nav__item', type: 'button', onclick: notInDemo }, content);
    }));
}
