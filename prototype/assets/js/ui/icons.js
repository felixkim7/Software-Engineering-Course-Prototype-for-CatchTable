// Inline icons drawn on a 24px grid to match the app's line icons. Static trusted markup only,
// so innerHTML is safe here. Filled variants are toggled with CSS (`.is-filled svg`).
const PATHS = {
  back: '<path d="M20 12H4M10 6l-6 6 6 6"/>',
  close: '<path d="M6 6l12 12M18 6 6 18"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/>',
  home: '<path d="M4 10.5 12 4l8 6.5V20h-5.5v-5.5h-5V20H4z"/>',
  bookmark: '<path d="M6 3.5h12V21l-6-4.2L6 21z"/>',
  pin: '<path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>',
  calendar: '<rect x="4" y="5" width="16" height="15" rx="2"/><path d="M8 3v4M16 3v4M4 10h16M9.5 15h5"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4.5 21c1.4-3.8 4.3-5.8 7.5-5.8s6.1 2 7.5 5.8"/>',
  bell: '<path d="M6 16.5V11a6 6 0 0 1 12 0v5.5l1.5 1.5h-15z"/><path d="M10 20.5a2 2 0 0 0 4 0"/>',
  history: '<path d="M3.5 12a8.5 8.5 0 1 0 2.6-6.1M3.5 4v4.5H8"/><path d="M12 7.5V12l3 2"/>',
  share: '<path d="M12 15V4M8 8l4-4 4 4"/><path d="M5 12.5V20h14v-7.5"/>',
  phone: '<path d="M7 3.5h3l1.5 4.5-2.2 1.5a11.5 11.5 0 0 0 5.2 5.2l1.5-2.2 4.5 1.5v3a2 2 0 0 1-2.2 2A16 16 0 0 1 5 5.7a2 2 0 0 1 2-2.2z"/>',
  chevronDown: '<path d="m6 9 6 6 6-6"/>',
  chevronRight: '<path d="m9 6 6 6-6 6"/>',
  target: '<circle cx="12" cy="12" r="7"/><circle cx="12" cy="12" r="2.5"/><path d="M12 2.5v2.5M12 19v2.5M2.5 12H5M19 12h2.5"/>',
  map: '<path d="M3 6.5 9 4l6 2.5L21 4v13.5L15 20l-6-2.5L3 20z"/><path d="M9 4v13.5M15 6.5V20"/>',
  people: '<circle cx="9" cy="8.5" r="3"/><circle cx="17" cy="9.5" r="2.5"/><path d="M3.5 19c.8-3.2 3-5 5.5-5s4.7 1.8 5.5 5M15 14.5c2.6-.3 4.6 1.3 5.5 4"/>',
  star: '<path d="m12 3 2.7 5.6 6.1.8-4.4 4.3 1 6.1L12 16.9l-5.4 2.9 1-6.1-4.4-4.3 6.1-.8z"/>',
  download: '<path d="M12 4v11M7 10.5l5 5 5-5M5 20h14"/>',
  refresh: '<path d="M19.5 12a7.5 7.5 0 1 1-2.2-5.3M19.5 4v4h-4"/>',
  thumbUp: '<path d="M7.5 11v9h-3v-9zM7.5 11 11 4c1.6 0 2.6 1.1 2.6 2.6V10h5a2 2 0 0 1 2 2.3l-1.2 6A2 2 0 0 1 17.4 20H7.5"/>',
  thumbDown: '<g transform="rotate(180 12 12)"><path d="M7.5 11v9h-3v-9zM7.5 11 11 4c1.6 0 2.6 1.1 2.6 2.6V10h5a2 2 0 0 1 2 2.3l-1.2 6A2 2 0 0 1 17.4 20H7.5"/></g>',
  coupon: '<rect x="3" y="5.5" width="18" height="13" rx="2" fill="currentColor" stroke="none"/><path d="m9 15 6-6" stroke="#FFFFFF"/><circle cx="9.3" cy="9.3" r="1.1" fill="#FFFFFF" stroke="none"/><circle cx="14.7" cy="14.7" r="1.1" fill="#FFFFFF" stroke="none"/>',
  sparkle: '<path d="M10 3.5 11.9 9 17.5 11l-5.6 1.9L10 18.5 8.1 13 2.5 11l5.6-2z" fill="currentColor" stroke="none"/><path d="m18.5 14 .9 2.6 2.6.9-2.6.9-.9 2.6-.9-2.6L15 17.5l2.6-.9z" fill="currentColor" stroke="none"/>',
  minus: '<path d="M5 12h14"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  won: '<circle cx="12" cy="12" r="9"/><path d="m7.5 8.5 2 7 2.5-6 2.5 6 2-7M6.5 12h11"/>',
  utensils: '<path d="M7 3v18M4.5 3v5a2.5 2.5 0 0 0 5 0V3M17 21V3c-2 0-3.5 2.5-3.5 6s1.5 4 3.5 4"/>',
  chart: '<path d="M4 20h16M7 16v-4M12 16V8M17 16v-6"/>',
  chevronLeft: '<path d="m15 6-6 6 6 6"/>',
  more: '<circle cx="6" cy="12" r="1.2" fill="currentColor"/><circle cx="12" cy="12" r="1.2" fill="currentColor"/><circle cx="18" cy="12" r="1.2" fill="currentColor"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M9.6 9.5a2.5 2.5 0 1 1 3.4 2.3c-.7.3-1 .8-1 1.5v.4"/><circle cx="12" cy="17" r=".6" fill="currentColor"/>',
  copy: '<rect x="8" y="8" width="11" height="12" rx="2"/><path d="M5 15V6a2 2 0 0 1 2-2h8"/>',
  navigate: '<circle cx="12" cy="12" r="9"/><path d="m8 12 8-4-4 8-1-3z"/>',
  play: '<rect x="3" y="5" width="18" height="14" rx="3" fill="currentColor" stroke="none"/><path d="m10 9 5 3-5 3z" fill="#FFFFFF" stroke="none"/>',
  check: '<path d="m5 12.5 4.5 4.5L19 7.5"/>',
  alert: '<circle cx="12" cy="12" r="9"/><path d="M12 7.5v5.5"/><circle cx="12" cy="16.5" r=".6" fill="currentColor"/>',
  parking: '<rect x="4" y="4" width="16" height="16" rx="3"/><path d="M10 17V8h3a2.5 2.5 0 0 1 0 5h-3"/>',
  bench: '<path d="M4 18v-6h16v6M6 12V7h5v5M13 12V7h5v5M3 18h18"/>',
  wine: '<path d="M7 3h4l-.5 5a2.5 2.5 0 0 1-3 0zM9 10v10M7 20h4M15 3h3v4.5a1.5 1.5 0 0 1-3 0zM16.5 9v11"/>',
  baby: '<circle cx="12" cy="9" r="5"/><path d="M10 8.5h.01M14 8.5h.01M10.5 11a2 2 0 0 0 3 0M8 20c.8-3 2.2-4.5 4-4.5s3.2 1.5 4 4.5"/>',
  car: '<path d="M5 16V11l2-5h10l2 5v5M5 16h14M3 11h18M7.5 16v2M16.5 16v2"/><circle cx="8" cy="13.5" r=".8"/><circle cx="16" cy="13.5" r=".8"/>',
  door: '<rect x="5" y="3" width="14" height="18" rx="1.5"/><path d="M14.5 12h.01M3 21h18"/>',
  nokids: '<circle cx="12" cy="12" r="9"/><path d="m5.6 5.6 12.8 12.8M10 10.5h.01M14 10.5h.01"/>',
  wifi: '<path d="M3 9a13 13 0 0 1 18 0M6 12.5a8.5 8.5 0 0 1 12 0M9 16a4 4 0 0 1 6 0"/><circle cx="12" cy="19" r=".8" fill="currentColor"/>',
};

// Facility label (as shown in the app) -> icon name
export const FACILITY_ICONS = {
  주차: 'parking', 단체: 'people', 대기공간: 'bench', 콜키지: 'wine', '콜키지 프리': 'wine',
  웰컴키즈존: 'baby', 아기의자: 'baby', 발렛: 'car', '예약금 0원 결제': 'won', 대관: 'door', 노키즈존: 'nokids', 무선인터넷: 'wifi',
};

export function icon(name, className = 'icon') {
  const wrapper = document.createElement('span');
  wrapper.className = className;
  wrapper.setAttribute('aria-hidden', 'true');
  wrapper.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${PATHS[name]}</svg>`;
  return wrapper;
}
