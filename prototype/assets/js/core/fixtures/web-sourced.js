// r4-r7: real restaurants from the user's capture 170629 (name, area, cuisine, rating, photo,
// Michelin label), with public details found online on 2026-10-23 (address, phone, hours, menu
// and prices; sources per restaurant below and in docs/assets.md). Fields no source states are
// null and the UI leaves them out: review/save counts, review statistics and AI summaries are
// never invented. Booking/waiting settings, deposits and availability are MOCK demo values.

export const item = (name, price, badges = []) => ({ name, price, description: null, image: null, badges });
export const empty = { award: null, map: null, directions: null, guides: [], weeklyHours: null, closedDays: null, notices: null, capacity: null };
export const base = {
  reviewCount: null, saveCount: null, photoCount: null, stations: [], weeklyHours: null, coupon: null, aiSummary: null,
  awardBanner: null, ribbon: null, reviews: null, photoFilters: [], news: [], broadcasts: [],
};

// Source: polle.com/place/4sA4kB (address, phone, course prices, 발렛파킹, 룸있음, 노키즈존)
export const mingles = {
  ...base,
  id: 'r4',
  name: '밍글스',
  district: '청담',
  cuisine: '한식',
  description: '모던 한식 파인다이닝',
  rating: 4.8,
  badges: [{ kind: 'michelin', stars: 3, label: '3스타 미쉐린가이드 서울 2026' }],
  photos: ['restaurants/mingles-1.jpg'],
  priceBand: '점심 32만원 · 저녁 42만원',
  hours: null,
  tags: ['발렛', '룸', '노키즈존'],
  waitingEnabled: false,
  waiting: null,
  bookingEnabled: true,
  booking: { maxPartySize: 6, windowDays: 30, times: ['12:00', '18:00', '18:30', '19:00'], soldOut: [[0, null], [1, null], [2, '19:00']], openSchedule: null },
  policies: { depositPerPersonKRW: 50000 },  // MOCK
  menu: { boards: [], notes: [], updatedAt: null, categories: [{ name: '코스', range: null, items: [item('런치 코스', 320000, ['대표']), item('디너 코스', 420000, ['대표'])] }] },
  info: { ...empty, intro: '모던 한식 파인다이닝', address: '서울특별시 강남구 도산대로67길 19 힐탑빌딩 2층', facilities: ['발렛', '노키즈존'], phone: '02-515-7306' },
};

// Sources: restaurantevett.com (address, phone); ktriptips.com/kor/food/3108201 (hours, closed days,
// free parking, 런치/디너 코스 without prices); thebestrestaurantsguide.com/restaurants/evett (concept, 전통주 pairing)
const EVETT_DINNER = ['17:15 ~ 22:30'];
const EVETT_WEEKEND = ['12:00 ~ 22:30', '준비시간 14:30 ~ 17:15'];
export const evett = {
  ...base,
  id: 'r5',
  name: 'Restaurant EVETT',
  district: '도산공원',
  cuisine: '컨템포러리',
  description: '한국 식재료와 식문화에서 영감을 받은 컨템포러리 레스토랑',
  rating: 4.7,
  badges: [{ kind: 'michelin', stars: 2, label: '2스타 미쉐린가이드 서울 2026' }],
  photos: ['restaurants/evett-1.jpg'],
  priceBand: null,
  hours: { open: '17:15', close: '22:30', closedWeekdays: [0, 1], byWeekday: { 5: ['12:00', '22:30'], 6: ['12:00', '22:30'] } },
  weeklyHours: [['월', ['정기휴무']], ['화', EVETT_DINNER], ['수', EVETT_DINNER], ['목', EVETT_DINNER], ['금', EVETT_WEEKEND], ['토', EVETT_WEEKEND], ['일', ['정기휴무']]],
  tags: ['주차'],
  waitingEnabled: false,
  waiting: null,
  bookingEnabled: true,
  booking: { maxPartySize: 6, windowDays: 30, times: ['18:00', '18:30', '19:00', '19:30'], soldOut: [[1, '19:00'], [1, '19:30']], openSchedule: null },
  policies: { depositPerPersonKRW: 50000 },  // MOCK
  menu: { boards: [], notes: ['전통주 페어링 제공'], updatedAt: null, categories: [{ name: '코스', range: null, items: [item('런치 코스 (금·토)', null), item('디너 코스', null)] }] },
  info: {
    ...empty, intro: '한국 식재료와 식문화에서 영감을 받은 컨템포러리 레스토랑. 제철 한국 식재료의 테이스팅 메뉴에 전통주 페어링을 곁들여요.',
    address: '서울특별시 강남구 도산대로45길 10-5, 1층', facilities: ['주차'], guides: [{ title: '주차 안내', lines: ['주차 가능 (무료)'] }],
    phone: '0507-1399-1029', closedDays: '매주 일요일, 월요일',
  },
};

// Source: polle.com/place/4glU5R (신도림 branch: address, phone, menu and prices, 주차가능, 포장, 배달)
const LUNCH = '(평일/점심)';
export const woowol = {
  ...base,
  id: 'r6',
  name: '우월소곱창 신도림본점',
  district: '신도림',
  cuisine: '곱창,막창',
  description: '수제 마늘곱창을 대표로 하는 소곱창 전문점',
  rating: 4.4,
  badges: [],
  photos: ['restaurants/woowol-1.jpg'],
  priceBand: null,
  hours: null,
  tags: ['주차', '포장', '배달'],
  waitingEnabled: true,
  waiting: { accepting: true, minutesPerTeam: 10, remoteMinTeams: 0, maxPartySize: 6, hours: { open: '16:00', close: '23:00' } },  // MOCK
  bookingEnabled: true,
  booking: { maxPartySize: 6, windowDays: 14, times: ['17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00'], soldOut: [[0, '19:00'], [1, '19:00'], [1, '19:30']], openSchedule: null },
  policies: { depositPerPersonKRW: 0 },  // MOCK
  menu: {
    boards: [], notes: [], updatedAt: null,
    categories: [
      { name: '구이', range: null, items: [
        item('3대 수제마늘곱창 (한정판매)', 28900, ['대표']), item('모듬곱창', 27900), item('한우곱창', 27900),
        item('한우대창', 27900), item('막창구이', 27900), item('특양구이', 28900),
      ] },
      { name: '전골 · 식사', range: null, items: [
        item('곱창전골', 59000), item('오색볶음밥 한판', 8900), item('예산비빔국수', 7900), item('살얼음김치냉국수', 7900), item('치즈계란찜', 7900),
      ] },
      { name: '점심', range: null, items: [
        item(`${LUNCH} 맑은양지곰탕`, 9500), item(`${LUNCH} 소고기얼큰해장국`, 9500), item(`${LUNCH} 곱창얼큰해장국`, 13000), item(`${LUNCH} 육회비빔밥`, 12000),
      ] },
    ],
  },
  info: { ...empty, intro: '수제 마늘곱창을 대표로 하는 소곱창 전문점', address: '서울특별시 구로구 경인로 631 1층', facilities: ['주차'], phone: '02-3667-2322' },
};

// Source: polle.com/place/5885fH (작은따옴표 도림천점: address, menu and prices, 카페/바, 간이주차, 룸, 반려견동반)
export const jageun = {
  ...base,
  id: 'r7',
  name: '작은따옴표 도림천점',
  district: '신림',
  cuisine: '카페,디저트',
  description: '신림 도림천 앞 카페 & 바',
  rating: 4.8,
  badges: [],
  photos: ['restaurants/jageun-1.jpg'],
  priceBand: null,
  hours: null,
  tags: ['포장', '룸', '반려견 동반'],
  waitingEnabled: true,
  waiting: { accepting: true, minutesPerTeam: 10, remoteMinTeams: 0, maxPartySize: 4, hours: { open: '12:00', close: '23:00' } },  // MOCK
  bookingEnabled: false,
  booking: null,
  policies: { depositPerPersonKRW: 0 },
  menu: {
    boards: [], notes: [], updatedAt: null,
    categories: [
      { name: '식사', range: null, items: [
        item('트러플 코티지파이', 35000, ['대표']), item('코티지 파이', 25000), item('비프 브루기뇽', 32000), item('트러플 뇨끼', 29000),
        item('파리지앵 뇨끼', 19000), item('잠봉 파스타', 17800), item('블랙 올리브 파스타', 16800), item('어니언 수프', 13000), item('양송이 수프', 12000),
      ] },
      { name: '디저트', range: null, items: [
        item('무화과 프렌치토스트', 17800), item('프렌치 토스트', 15800), item('무화과 피스타치오 티라미수', 9800), item('피스타치오 티라미수', 8500), item('티라미수', 7500),
      ] },
      { name: '커피 · 음료', range: null, items: [
        item('클래식 커피', 6000), item('카페라떼', 7000), item('플랫 화이트', 7000), item('에스프레소', 4000), item('말차크림라떼', 7500), item('유자 얼그레이티', 7500),
      ] },
      { name: '주류', range: null, items: [
        item('오이스터(삼배체굴) & 샤블리 세트', 98000), item("'제니' 아페롤 스프리츠", 19000), item('스텔라 생맥주', 6900),
      ] },
    ],
  },
  info: { ...empty, intro: '신림 도림천 앞 카페 & 바', address: '서울특별시 관악구 관천로 36-1 2층', facilities: ['주차'], phone: null },
};
