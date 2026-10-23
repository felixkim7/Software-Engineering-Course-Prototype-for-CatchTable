// r3 스시렌 (청담): booking-only real listing with "예약금 0원", transcribed from the user's app
// captures of 2026-10-23 (docs/reference-screens). Availability is MOCK demo data.

const LUNCH_DINNER = (dinner) => ['점심 12:00 ~ 14:30', `저녁 ${dinner}`];

export const sushiren = {
  id: 'r3',
  name: '스시렌',
  district: '청담',
  cuisine: '스시오마카세',
  description: '오마카세 시작은 스시렌에서',
  rating: 4.8, reviewCount: 4462, saveCount: 29000, photoCount: 9999,
  badges: [{ kind: 'sushiroad', label: '스시로드 TOP100' }, { kind: 'video', label: '더들리' }],
  photos: ['restaurants/sushiren-1.jpg', 'restaurants/sushiren-2.jpg', 'restaurants/sushiren-3.jpg'],
  stations: [
    { lines: ['7', '수인분당'], name: '강남구청역', distanceM: 537 },
    { lines: ['수인분당'], name: '압구정로데오역', distanceM: 595 },
  ],
  priceBand: '점심 15만원 · 저녁 28만원',
  hours: { open: '12:00', close: '21:30' },
  weeklyHours: [
    ['월', LUNCH_DINNER('18:20 ~ 21:30')], ['화', LUNCH_DINNER('18:20 ~ 21:30')], ['수', LUNCH_DINNER('18:20 ~ 21:30')],
    ['목', LUNCH_DINNER('18:20 ~ 21:30')], ['금', LUNCH_DINNER('18:20 ~ 21:30')],
    ['토', ['점심 12:00 ~ 14:00', '저녁 16:50 ~ 21:30']], ['일', ['점심 12:00 ~ 14:00', '저녁 17:50 ~ 21:30']],
  ],
  tags: ['최대 10명 예약', '예약금 0원', '발렛', '콜키지', '노키즈존', '단체'],
  coupon: null,
  aiSummary: {
    title: '오마카세의 시작을 알리는 하이엔드 스시야',
    points: [
      '훌륭한 원물 퀄리티를 바탕으로 다채로운 구성의 하이엔드 스시 오마카세를 선보이는 곳이에요.',
      '트러플을 곁들인 전복과 캐비어가 올라간 단새우, 고소한 참치 중뱃살과 우니가 특히 인기가 많아요.',
      '코스의 양이 꽤 푸짐하게 제공되는 편이니, 식사량이 적다면 미리 밥 양을 줄여달라고 요청해 보세요.',
    ],
  },
  awardBanner: null,
  ribbon: { lead: '최근 인기 급상승!', text: '2달 평점 4.7점 돌파' },
  waitingEnabled: false,
  bookingEnabled: true,
  booking: {
    maxPartySize: 10,
    windowDays: 45,
    times: ['12:00', '18:30'],
    soldOut: [[2, null]],
    openSchedule: { time: '매일 오전 12:00(00시)', note: '45일간 예약이 가능합니다.' },
  },
  policies: { depositKRW: 0 },
  menu: {
    boards: [],
    notes: ['알러지 식재료 대체 가능'],
    updatedAt: '2025-11-30',
    categories: [
      { name: '메뉴', range: null, items: [
        { name: '런치 오마카세', price: 150000, description: null, image: null, badges: ['대표', '추천'] },
        { name: '디너 오마카세', price: 280000, description: null, image: null, badges: ['대표', '추천'] },
      ] },
    ],
  },
  reviews: { distribution: [3491, 720, 186, 35, 30], purposes: [['데이트', 636], ['친목', 612], ['생일', 308]] },
  photoFilters: [['업체', 5], ['동영상', 51], ['음식', 9999], ['내부', 37]],
  info: {
    intro: '스시의 시작은 스시렌에서',
    award: null,
    address: '서울특별시 강남구 선릉로146길 27-8',
    map: 'maps/sushiren.jpg',
    directions: '압구정 로데오역4번 출구에서 청담 스퀘어 뒤편\n\n또는 강남구청 4번출구\n영동고등학교 아래 무등산에서 직진 3백미터\n쌤시크 맞은편\n\n엘리베이터 2층\n계단은 3층 입니다.',
    facilities: ['발렛', '콜키지', '예약금 0원 결제', '단체', '대관', '노키즈존', '무선인터넷'],
    guides: [
      { title: '주차 안내', lines: ['청담스퀘어 뒷골목에서 gs25 편의점 사이로 진입 후 50m 앞에 발렛 박스 있습니다.', '쌤시크발렛박스 맞은편 승빌딩(부엉이간판) 안쪽에 엘리베이터 타고 2층, 계단은 3층 입니다.'] },
      { title: '발렛 안내', lines: ['발렛 요금 5,000원', '매장에서 식사하시는 동안만 주차 가능하시고 식사 후 주차 시 추가 요금 발생됩니다'] },
      { title: '주류 및 콜키지 안내', lines: ['와인 · 병당 5만원 · 최대 1병', '위스키 · 병당 10만원', '사케 · 병당 5만원 · 최대 1병', '샴페인 · 병당 5만원 · 최대 1병', '콜키지는 2인 기준 1병, 3~4인 기준 2병 외', '추가시 사케,샴페인,와인 병당 7만원 / 소주,위스키,매그넘 12만원 입니다.', '레드와인은 반입 불가함을 안내드립니다.'] },
      { title: '단체 이용 안내', lines: ['6인,10인'] },
      { title: '대관 안내', lines: ['6인또는 10인 총 16인 대관 가능하며', '각각 인원이 부족시 6인분. 10인분 결제시 가능합니다'] },
      { title: '바 안내', lines: ['1-16인 이용 가능', '16개 좌석 운영', '6인석. 10인석 2 카운터로 나누어져 있으며 대관시 6인또는 10인으로 총 16인석 가능 합니다'] },
    ],
    phone: '010-8072-2032',
    weeklyHours: null,
    closedDays: null,
    notices: '◇ 예약 변경 안내\n예약 변경은 4일 전까지 가능합니다.\n◇ 매일 12:00 - 14:00 런치\n◇ 월 ~ 금 18:30 - 21:30 디너\n토요일 1부 17:00-19:00 2부 19:30-21:30\n◇ 일요일 및 공휴일 18:00 - 21:30 디너\n\n캐치테이블 예약시 셰프지정이 어려울수 있습니다\n매장으로 문의 주시면 안내해드리겠습니다',
    capacity: '16명까지 이용 가능합니다.',
  },
  news: [{ title: '꽃 & 풍선 이벤트 다이렉트 주문!!', body: '특별한 날을 더욱 기쁘고 화려하게 기억되게 만들...' }],
  broadcasts: [
    { channel: '더들리', quote: '"한 끼에 30만원이지만 주기적으로 찾게 되는 직관적인 스시야" - 에디터 코멘트', aired: '23년 8월 6일 방영' },
    { channel: '더들리', quote: '"잊을 수 없는 전복 튀김과 김부각 위에 올린 참치가 있는 청담동 스시의 진수" - 에디터 코멘트', aired: '24년 8월 17일 방영' },
    { channel: '먹적', quote: '"초마미 필살기 가득한 오마카세" - 에디터 코멘트', aired: '24년 11월 17일 방영' },
  ],
};
