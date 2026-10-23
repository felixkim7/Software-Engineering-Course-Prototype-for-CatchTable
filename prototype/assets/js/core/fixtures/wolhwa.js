// r1 월화식당 마포본점: public listing details transcribed from the user's app captures of
// 2026-10-16 and 2026-10-23 (docs/reference-screens). Booking availability, deposit and
// waiting statistics are MOCK demo values (see restaurant-fixtures.js).
import { POLICY } from '../config.js';

const item = (name, price, description = null, image = null, badges = []) => ({ name, price, description, image, badges });

export const wolhwa = {
  id: 'r1',
  name: '월화식당 마포본점',
  district: '마포',
  cuisine: '육류,고기요리',
  description: '무항생제 프리미엄 돼지고기 맛집',
  rating: 4.3, reviewCount: 111, saveCount: 1453, photoCount: 86,
  badges: [{ kind: 'blueRibbon', label: '블루리본 서울 2027' }],
  photos: ['restaurants/wolhwa-1.jpg', 'restaurants/wolhwa-2.jpg', 'restaurants/wolhwa-3.jpg', 'restaurants/wolhwa-4.jpg'],
  stations: [
    { lines: ['5', '6', '경의중앙', '공항'], name: '공덕역', distanceM: 289 },
    { lines: ['5'], name: '마포역', distanceM: 320 },
  ],
  priceBand: '점심 영업안함 · 저녁 1-3만원',
  hours: { open: '16:00', close: '23:00' },
  weeklyHours: null,
  tags: ['최대 6명 예약', '콜키지', '콜키지 프리', '웰컴키즈존', '아기의자'],
  coupon: { id: 'cp-r1-corkage', title: '무제한 콜키지 프리 쿠폰', description: '와인/위스키 병 수 제한 없음' },
  aiSummary: {
    title: '특허받은 숙성법으로 완성한 프리미엄 돼지고기',
    points: [
      '동물복지 농장에서 건강하게 자란 무항생제 프리미엄 돼지고기를 맛볼 수 있는 곳이에요.',
      '풍부한 육즙의 삼겹살이 대표 메뉴이며, 향긋한 미나리와 김치를 곁들여 먹는 조합이 인기가 많아요.',
      '직원분이 고기를 직접 구워줘 편하게 식사할 수 있어요. 친절한 서비스와 함께 기분 좋은 식사를 즐겨보세요.',
    ],
  },
  awardBanner: { image: 'restaurants/wolhwa-ribbon-banner.jpg', alt: '이 곳은 블루리본 2개 맛집이에요! 주위 사람들에게 추천하고 싶은 곳' },
  ribbon: null,
  waitingEnabled: true,
  bookingEnabled: true,
  booking: {
    maxPartySize: 6,
    windowDays: 30,
    times: ['16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30'],
    soldOut: [[1, '19:00'], [1, '19:30'], [2, '18:30'], [2, '19:00']],  // [days after reset, time | null = whole day]
    openSchedule: null,
  },
  policies: { depositKRW: POLICY.bookingDepositKRW },
  menu: {
    boards: ['menu/wolhwa-board-1.jpg', 'menu/wolhwa-board-2.jpg', 'menu/wolhwa-board-3.jpg'],
    notes: [],
    updatedAt: '2026-07-09',
    categories: [
      { name: '메뉴', range: '15,000 - 100,000원', items: [
        item('숙성특허 반근세트', 51000, '갈매기살 200g + 쫀득살 200g + 미나리', 'menu/wolhwa-01.jpg'),
        item('숙성특허 쫀득살', 17000, '특허받은 저온 숙성 기술로 신선도를 유지하는 월화의 쫀득살입니다.', 'menu/wolhwa-02.jpg'),
        item('먹거리X파일 착한 삼겹살', 19000, "채널A '먹거리X파일'에서 선정된 착한 삼겹살", 'menu/wolhwa-03.jpg'),
        item('무항생제 목살', 19000, '친환경 동물복지인증 농가에서 키워 항생제를 투여하지 않고 자연 향변성으로 자란 친환경 돈육', 'menu/wolhwa-04.jpg'),
        item('[예약 한정 판매] 밀랍 숙성 삼겹살', 100000, '1차 드라이 숙성, 2차 천연 밀랍에서 숙성한 오직 월화에서만 드실 수 있는 밀랍 삼겹살', 'menu/wolhwa-05.jpg'),
        item('무항생제 가브리살', 19000, '등심덧살이라고도 불리는 가브리살은 돼지 한마리에서 약 300g 정도 나오는 귀한 부위입니다', 'menu/wolhwa-06.jpg'),
        item('숙성특허 갈매기살', 19000, '월화만의 특허받은 숙성 노하우로 숙성시킨 갈매기살', 'menu/wolhwa-07.jpg'),
        item('[한정판매] 진짜 통 항정살', 23000, '까다로운 조건을 충족하고 전국 축산물품질경진대회에서 1등(대상)을 수상한...', 'menu/wolhwa-08.jpg'),
        item('1+ 한근세트', 77000, '축산물 품질 경진대회 대상 세트 구성 목살 400g + 삼겹살 200g + 미나리', 'menu/wolhwa-09.jpg'),
        item('무주 표고 삼합', 15000, '싱싱하고 도톰한 키조개 관자와 잘 익은 월화 묵은지, 향긋한 표고 버섯', 'menu/wolhwa-10.jpg'),
        item('손차돌 트러플 육회', 20000, '신선한 육회와 트러플 버섯 위로 직접 착유한 참기름을 올려 입안 가득 풍미를 선사합니다.', 'menu/wolhwa-11.jpg'),
        item('1++ 한우 넙적차돌', 27000, '차돌박이의 맛을 잘 느낄 수 있도록 넓고 얇게 썰어 내드립니다.', 'menu/wolhwa-12.jpg'),
        item('1++ 한우 살치살', 55000, '소고기 이력제를 통한 인증된 소고기만을 취급하며, 육즙의 풍미와 감칠맛이 일품입니다.', 'menu/wolhwa-13.jpg'),
        item('1++ 한우 갈비살', 27000, '갈비살은 적절한 지방층으로 오래 구워도 쫄깃한 저작감과 고소한 육향이 특징입니다.', 'menu/wolhwa-14.jpg'),
        item('1++ 한우 알등심', 48000, null, 'menu/wolhwa-15.jpg'),
      ] },
      { name: '곁들임 메뉴', range: '6,000 - 15,000원', items: [
        item('구워먹는 치즈', 10000), item('미나리', 6000), item('무주표고삼합', 15000),
      ] },
      { name: '사이드메뉴', range: '2,000 - 8,000원', items: [
        item('미나리볶음밥', 5000), item('7일 도정밥', 2000), item('월화촌 된장찌개', 4000), item('흑돼지 김치찌개', 8000),
        item('김치말이국수', 9000), item('비빔냉면', 9000), item('얼큰이 해장라면', 6000), item('트러플 명란 솥밥', 13000),
      ] },
      { name: '음료 & 주류', range: '2,000 - 10,000원', items: [] },
      { name: '월화 하이볼', range: '7,000 - 8,000원', items: [] },
      { name: '전통주', range: '13,000 - 18,000원', items: [] },
      { name: '화요', range: '33,000 - 183,000원', items: [] },
      { name: '일품진로', range: '33,000 - 233,000원', items: [] },
    ],
  },
  reviews: { distribution: [68, 21, 6, 4, 12], purposes: [['친목', 37], ['가족식사', 36], ['데이트', 27]] },
  photoFilters: [['업체', 4], ['동영상', 1], ['음식', 79], ['내부', 1]],
  info: {
    intro: [
      '자연을 담은 동물복지 농장에서 자란\n건강한 무항생제 프리미엄 돼지고기를 취급하는\n공덕 고기집 / 마포역 삼겹살 맛집으로',
      '여러 방송 매체를 통해 공덕역 맛집, 도화동 맛집으로 인정받은 월화식당입니다.',
      '[밀랍 숙성 삼겹살 출시! (사전예약)]\n→ ※사전예약 전화문의 필수 ※',
      '[EVENT 1]네이버 예약시 병수 제한 없이 콜키지 프리 서비스! 병수 제한 없습니다!\n- 매장에서 판매 중인 주류&와인 / 1만 원 이하 주류는 이벤트 제외',
      '[EVENT 2]모임 or 회식으로 인한 단체예약 진행 시, 예약자명(모임명 or 회사명)으로 세팅지를 준비해드립니다!',
      "- 동물복지 농장에서 키운 오겹살\n- 전통방식의 무쇠 솥뚜껑오겹살\n- 저온압착으로 직접 짠 '진짜' 참기름\n- 전라북도 무주 월화농장에서 직접 재배한 식재료\n- 직접 자가도정한 친환경 햅쌀\n- 고기 숙성특허로 자체 숙성실에서 특별한 저온숙성\n- 믿을 수 있는 직접 만든 반찬\n오랫동안 변하지 않는 무쇠솥처럼\n언제나 변함없는 맛과 정성으로\n사랑받는 정직한 고깃집,\n월화식당이 만들어나가겠습니다.",
      '공덕과 마포역을 넘어 마포구에서 단체 회식, 뒷풀이 또는 대관까지 가능한 규모로 미리 예약 시 영업 시간 외에 오전 대관도 가능합니다.',
      '공덕 회식 장소로 단체석, 콜키지 프리, 주차 지원이 가능합니다.\n오전 대관 / 단체 예약은 전화 문의 부탁드립니다.',
      '감사합니다 :-D',
    ].join('\n\n'),
    award: { title: '블루리본 서베이 2027 「서울의 맛집」 선정', detail: '리본 2개 : 주위 사람들에게 추천하고 싶은 곳' },
    address: '서울특별시 마포구 도화길 29 2층',
    map: 'maps/wolhwa.jpg',
    directions: '마포역 3번 출구, 공덕역 9번 출구 도보 5분 거리에 위치하고 있습니다.\n\n도화동 주민자체센터 주차장 이용가능 - 1시간 지원\n- 주차장 주소 : 서울 마포구 도화길 37 주민자치센터',
    facilities: ['콜키지 프리', '콜키지', '웰컴키즈존', '아기의자'],
    guides: [
      { title: '주차 안내', lines: ['주차가능 (무료) : 도화동 주민자치센터 주차장 이용 가능 - 1시간 지원 공휴일 (일요일 포함)'] },
      { title: '주류 및 콜키지 안내', lines: ['와인 · 콜키지 무료', '위스키 · 콜키지 무료', '사케 · 콜키지 무료', '전통주 · 콜키지 무료', '콜키지 가능(무료) : 매장으로 문의 부탁드립니다.'] },
      { title: '웰컴키즈존 안내', lines: ['아기의자 있음 · 유아식기 있음'] },
    ],
    phone: '02-701-7592',
    weeklyHours: null,
    closedDays: null,
    notices: null,
    capacity: null,
  },
  news: [],
  broadcasts: [],
};
