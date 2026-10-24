// r8-r14: real restaurants from the user's capture 170629. r8-r12 come from its 가격대별 BEST list
// (name, one-line description, rating, review count, cuisine, area and a 151px thumbnail, so
// `thumbnailOnly`), r13-r14 from its 최근 본 매장과 비슷한 곳 cards (name, rating, count, photo).
// Address, phone, hours and menu prices come from public pages read on 2026-10-23 (per restaurant
// below and in docs/assets.md). Where no source was found (돌판장 양재, 마담풍천 보라매) the fields
// stay null and the UI leaves them out. Booking/waiting settings, deposits and availability are MOCK.
import { item, empty, base } from './web-sourced.js';

// Source: diningcode.com/profile.php?rid=pgiuO1oI4Hvc (address, phone, hours 15:30-05:00, menu and prices)
export const izakayanamu = {
  ...base,
  id: 'r8',
  name: '이자카야나무 사당역2호점',
  district: '사당',
  cuisine: '이자카야',
  description: '프라이빗룸에서 일식 전문 요리사의 요리를 즐기는 이자카야',
  rating: 4.7,
  reviewCount: 88,
  badges: [],
  photos: ['restaurants/izakayanamu-1.jpg'],
  thumbnailOnly: true,
  priceBand: null,
  hours: { open: '15:30', close: '05:00' },
  tags: ['룸'],
  waitingEnabled: false,
  waiting: null,
  bookingEnabled: true,
  booking: { maxPartySize: 10, windowDays: 14, times: ['17:00', '18:00', '19:00', '20:00', '21:00'], soldOut: [[0, '19:00'], [1, '19:00'], [1, '20:00']], openSchedule: null },
  policies: { depositPerPersonKRW: 0 },  // MOCK
  menu: {
    boards: [], notes: [], updatedAt: null,
    categories: [
      { name: '세트', range: null, items: [item('커플세트', 59900, ['대표']), item('나무세트', 89900), item('시보리다테 세트', 99000), item('나무한상', 169900)] },
      { name: '사시미 · 초밥', range: null, items: [
        item('특선사시미모리아와세', 98000), item('오늘의 사시미', 52000), item('광어+연어 사시미', 41000),
        item('스페셜 모둠초밥', 35500), item('특모둠초밥', 26500), item('모둠초밥', 19000),
      ] },
      { name: '요리', range: null, items: [
        item('명란크림우동', 26500), item('흑초만난 탕수육', 27000), item('메로 소금구이', 29500),
        item('숯불꼬치 7종구이', 25000), item('크림치즈 오꼬노미야끼', 24500), item('눈꽃 명란계란말이', 21000),
      ] },
      { name: '나베', range: null, items: [item('밀푀유나베', 28500), item('전통나가사키 해물짬뽕나베', 28000), item('간사이풍 오뎅 나베', 25000)] },
    ],
  },
  info: {
    ...empty, intro: '프라이빗룸과 일식 전문 요리사의 요리, 서비스를 내세운 이자카야. 새벽 5시까지 영업해요.',
    address: '서울특별시 관악구 남현1길 58 2층', facilities: [], phone: '0507-1364-5638', notices: '라스트오더 04:30',
  },
};

// Source: capture 170629 only. No public page for the 양재 branch was found, so address, phone,
// hours and menu stay null (other branches' prices are not reused).
export const dolpanjang = {
  ...base,
  id: 'r9',
  name: '돌판장 양재',
  district: '서초',
  cuisine: '장어 요리',
  description: '매일 아침 통영에서 직배송하는 자연산 바다장어',
  rating: 4.7,
  reviewCount: 38,
  badges: [],
  photos: ['restaurants/dolpanjang-1.jpg'],
  thumbnailOnly: true,
  priceBand: null,
  hours: null,
  tags: [],
  waitingEnabled: false,
  waiting: null,
  bookingEnabled: true,
  booking: { maxPartySize: 6, windowDays: 14, times: ['11:30', '12:30', '17:30', '18:30', '19:30'], soldOut: [[1, '18:30']], openSchedule: null },
  policies: { depositPerPersonKRW: 10000 },  // MOCK
  menu: { boards: [], notes: [], updatedAt: null, categories: [] },
  info: { ...empty, intro: '매일 아침 통영에서 직배송하는 자연산 바다장어 요리점', address: null, facilities: [], phone: null },
};

// Sources: diningcode.com/profile.php?rid=p7xxJR45Y1Um (address, phone, hours, break, menu and prices,
// 북경오리 2일 전 예약, parking/valet/rooms); polle.com/place/3oGDiQ (Sunday closing)
const PALHYANG_DAY = ['11:30 ~ 22:00', '브레이크타임 15:00 ~ 17:00', '라스트오더 20:30'];
export const palhyang = {
  ...base,
  id: 'r10',
  name: '팔향',
  district: '양재',
  cuisine: '중식',
  description: '향과 여운 있는 음식으로 풍요와 번창의 마음을 전하는 중식당',
  rating: 4.6,
  reviewCount: 543,
  badges: [],
  photos: ['restaurants/palhyang-1.jpg'],
  thumbnailOnly: true,
  priceBand: null,
  hours: { open: '11:30', close: '22:00', closedWeekdays: [0] },
  weeklyHours: [['월', PALHYANG_DAY], ['화', PALHYANG_DAY], ['수', PALHYANG_DAY], ['목', PALHYANG_DAY], ['금', PALHYANG_DAY], ['토', PALHYANG_DAY], ['일', ['정기휴무']]],
  tags: ['주차', '발렛', '룸'],
  waitingEnabled: false,
  waiting: null,
  bookingEnabled: true,
  booking: { maxPartySize: 8, windowDays: 30, times: ['11:30', '12:30', '13:30', '17:00', '18:00', '19:00', '20:00'], soldOut: [[0, '19:00'], [1, '12:30'], [1, '19:00']], openSchedule: null },
  policies: { depositPerPersonKRW: 10000 },  // MOCK
  menu: {
    boards: [], notes: ['북경오리는 2일 전 예약 판매만 가능해요'], updatedAt: null,
    categories: [
      { name: '딤섬', range: null, items: [
        item('샤오롱바오', 10000, ['대표']), item('하가우', 10000), item('부추교자', 10000), item('메추리알 샤오마이', 11000), item('크리스피 새우 창펀', 13000),
      ] },
      { name: '요리', range: null, items: [
        item('흑식초 탕수육', 33000, ['대표']), item('소흥주 칠리새우', 38000), item('동파육과 차이니스 번', 38000), item('깐풍기', 30000),
        item('유린지', 30000), item('마파두부', 23000), item('전가복', 88000), item('북경오리', 125000),
      ] },
      { name: '식사', range: null, items: [item('팔향짜장면', 12000), item('광동식 우육탕면', 14000), item('탄탄면', 14000), item('팔향볶음면', 18000)] },
    ],
  },
  info: {
    ...empty, intro: '향과 여운 있는 음식으로 풍요와 번창의 마음을 전하는 중식당. 딤섬과 광동식 요리를 내요.',
    address: '서울특별시 서초구 강남대로41길 15-19 B1층', facilities: ['주차', '발렛'], phone: '0507-1485-0744', closedDays: '매주 일요일',
  },
};

// Source: capture 170629 only (a diningcode list confirms a 보라매 branch serving 장어 and 장어덮밥, with
// no details). Address, phone, hours and menu stay null.
export const madampungcheon = {
  ...base,
  id: 'r11',
  name: '마담풍천 보라매',
  district: '보라매',
  cuisine: '장어 요리',
  description: '국내산 1등급 자포니카 민물장어 전문점',
  rating: 4.7,
  reviewCount: 204,
  badges: [],
  photos: ['restaurants/madampungcheon-1.jpg'],
  thumbnailOnly: true,
  priceBand: null,
  hours: null,
  tags: [],
  waitingEnabled: true,
  waiting: { accepting: true, minutesPerTeam: 15, remoteMinTeams: 0, maxPartySize: 6, hours: { open: '11:00', close: '22:00' } },  // MOCK
  bookingEnabled: true,
  booking: { maxPartySize: 6, windowDays: 14, times: ['12:00', '18:00', '19:00', '20:00'], soldOut: [[1, '19:00']], openSchedule: null },
  policies: { depositPerPersonKRW: 10000 },  // MOCK
  menu: { boards: [], notes: [], updatedAt: null, categories: [] },
  info: { ...empty, intro: '국내산 1등급 자포니카 민물장어 전문점. 참숯에 초벌한 장어구이를 내요.', address: null, facilities: [], phone: null },
};

// Sources: diningcode.com/profile.php?rid=qwxobxv0z4uY (address, phone, hours, Monday closing, corkage,
// menu and prices); siksinhot.com/P/1482181 (address)
const TOOMUTT_DAY = ['17:00 ~ 24:00', '라스트오더 23:30'];
export const toomutt = {
  ...base,
  id: 'r12',
  name: '투머트',
  district: '샤로수길',
  cuisine: '와인',
  description: '코지한 분위기의 와인바, 내추럴 & 컨벤셔널 와인 350여 종',
  rating: 4.8,
  reviewCount: 510,
  badges: [],
  photos: ['restaurants/toomutt-1.jpg'],
  thumbnailOnly: true,
  priceBand: null,
  hours: { open: '17:00', close: '24:00', closedWeekdays: [1], byWeekday: { 6: ['15:00', '24:00'] } },
  weeklyHours: [['월', ['정기휴무']], ['화', TOOMUTT_DAY], ['수', TOOMUTT_DAY], ['목', TOOMUTT_DAY], ['금', TOOMUTT_DAY], ['토', ['15:00 ~ 24:00', '라스트오더 23:30']], ['일', TOOMUTT_DAY]],
  tags: ['콜키지'],
  waitingEnabled: false,
  waiting: null,
  bookingEnabled: true,
  booking: { maxPartySize: 4, windowDays: 14, times: ['17:00', '18:00', '19:00', '20:00', '21:00'], soldOut: [[0, '20:00'], [1, '19:00'], [1, '20:00']], openSchedule: null },
  policies: { depositPerPersonKRW: 10000 },  // MOCK
  menu: {
    boards: [], notes: [], updatedAt: null,
    categories: [
      { name: '요리', range: null, items: [
        item('가리비', 26000, ['대표']), item('할리벗', 27000), item('전복 카넬로니', 30000), item('오리가슴살', 29000),
        item('아스파라거스 엔초비', 19000), item('숯불 표고버섯', 15000), item('감자튀김 & 딜타르타르소스', 10000), item('당일 구운 포카치아', 4000),
      ] },
      { name: '파스타', range: null, items: [item('바지락 시소 파스타', 25000), item('양고기 라구 파스타', 25000), item('들기름 카펠리니', 20000)] },
      { name: '치즈 · 디저트', range: null, items: [item('꽁테치즈 외 3종 치즈플레이트', 19000), item('생판단잎으로 만든 카야토스트', 12000), item('뱅 존 아이스크림 Ver.2', 13000)] },
      { name: '와인', range: null, items: [item('컨벤셔널 와인', null), item('내추럴 와인', null)] },
    ],
  },
  info: {
    ...empty, intro: '코지한 분위기의 와인바. 내추럴과 컨벤셔널 와인 350여 종에 요리를 곁들여요.',
    address: '서울특별시 관악구 남부순환로226길 42 1층', facilities: ['콜키지'], phone: '0507-1372-5116', closedDays: '매주 월요일',
  },
};

// Source: diningcode.com/profile.php?rid=CUzckRKaC0Gs (address, phone, hours, facilities, menu and prices);
// bluer.co.kr/restaurants/31007 lists another phone number (02-888-7592)
const WOLHWAGOGI_WEEKDAY = ['16:00 ~ 22:30'];
const WOLHWAGOGI_WEEKEND = ['11:30 ~ 22:30'];
export const wolhwagogi = {
  ...base,
  id: 'r13',
  name: '월화고기 보라매점',
  district: '보라매',
  cuisine: '육류,고기요리',
  description: '듀록 오겹살과 1++ 한우를 굽는 고깃집',
  rating: 4.7,
  reviewCount: 10,
  badges: [],
  photos: ['restaurants/wolhwagogi-1.jpg'],
  priceBand: null,
  hours: { open: '16:00', close: '22:30', byWeekday: { 0: ['11:30', '22:30'], 6: ['11:30', '22:30'] } },
  weeklyHours: [['월', WOLHWAGOGI_WEEKDAY], ['화', WOLHWAGOGI_WEEKDAY], ['수', WOLHWAGOGI_WEEKDAY], ['목', WOLHWAGOGI_WEEKDAY], ['금', WOLHWAGOGI_WEEKDAY], ['토', WOLHWAGOGI_WEEKEND], ['일', WOLHWAGOGI_WEEKEND]],
  tags: ['주차', '발렛', '룸', '콜키지 프리', '배달'],
  waitingEnabled: true,
  waiting: { accepting: true, minutesPerTeam: 15, remoteMinTeams: 0, maxPartySize: 6 },  // MOCK
  bookingEnabled: true,
  booking: { maxPartySize: 8, windowDays: 14, times: ['17:00', '18:00', '19:00', '20:00'], soldOut: [[1, '19:00']], openSchedule: null },
  policies: { depositPerPersonKRW: 0 },  // MOCK
  menu: {
    boards: [], notes: [], updatedAt: null,
    categories: [
      { name: '돼지고기', range: null, items: [
        item('듀록 오겹살 [160g]', 23000, ['대표']), item('듀록 목살 [160g]', 23000), item('삼겹살 [160g]', 19000), item('목살 [160g]', 19000),
        item('항정살 [130g]', 23000), item('뼈목심 [180g]', 19000), item('박포갈비 (당일도축, 한정판매)', 20000), item('[예약 한정 판매] 밀랍 숙성 삼겹살 (500g)', 100000),
      ] },
      { name: '모둠', range: null, items: [item('월화 모둠 [500g]', 51000), item('월화 숙성 모둠', 55000), item('듀록 모둠 [740g]', 96000)] },
      { name: '한우', range: null, items: [
        item('1++ 한우 차돌 130g', 27000), item('1++한우 등심 150g', 40000), item('1++한우 살치살 150g', 55000), item('직접 짠 참기름을 곁들인 한우 육회', 23000),
      ] },
      { name: '식사', range: null, items: [item('트러플 명란 솥밥', 15000), item('자가제면 열무냉면 [비빔/물]', 12000), item('2년 묵은 묵은지 술밥', 12000), item('트러플 짜파게티', 11000)] },
    ],
  },
  info: {
    ...empty, intro: '듀록 오겹살과 1++ 한우를 굽는 고깃집. 콜키지 프리, 사전 예약 시 영업시간 외 대관이 가능해요.',
    address: '서울특별시 관악구 보라매로3길 16', facilities: ['주차', '발렛', '대관', '콜키지 프리'], phone: '0507-1403-7592',
  },
};

// Sources: hwapo-hannam.jalib.site (official page as indexed on 2026-10-23: address, phone, open 24 hours);
// wanderboat.ai restaurant page (프리미엄 완자 부대찌개 for 2+ people, 사리 prices). The 찌개 price was not found.
export const hwapo = {
  ...base,
  id: 'r14',
  name: '화포식당 한남점',
  district: '한남',
  cuisine: '육류,고기요리',
  description: '프리미엄 완자 부대찌개를 내는 24시간 식당',
  rating: 4.2,
  reviewCount: 54,
  badges: [],
  photos: ['restaurants/hwapo-1.jpg'],
  priceBand: null,
  hours: { open: '00:00', close: '24:00' },
  tags: ['24시간'],
  waitingEnabled: true,
  waiting: { accepting: true, minutesPerTeam: 10, remoteMinTeams: 0, maxPartySize: 6, hours: { open: '11:00', close: '23:00' } },  // MOCK
  bookingEnabled: false,
  booking: null,
  policies: { depositPerPersonKRW: 0 },
  menu: {
    boards: [], notes: [], updatedAt: null,
    categories: [
      { name: '찌개', range: null, items: [item('프리미엄 완자 부대찌개 (2인 이상)', null, ['대표'])] },
      { name: '사리', range: null, items: [item('라면 사리', 1000), item('소시지 사리', 2000)] },
    ],
  },
  info: { ...empty, intro: '프리미엄 완자 부대찌개를 내는 24시간 식당', address: '서울특별시 용산구 대사관로34길 9', facilities: [], phone: '0507-1416-9393', notices: '24시간 영업' },
};
