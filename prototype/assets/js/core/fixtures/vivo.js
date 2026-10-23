// r2 vivo pizza 공덕점: public listing details transcribed from the user's app captures of
// 2026-10-16 and 2026-10-23 (docs/reference-screens). Booking availability, deposit and
// waiting statistics are MOCK demo values (see restaurant-fixtures.js).

const item = (name, price, description = null, image = null, badges = []) => ({ name, price, description, image, badges });
const WEEKDAY = ['점심 11:00 ~ 15:00', '저녁 17:00 ~ 21:00', '20:00 까지 라스트오더'];
const WEEKEND = ['11:00 ~ 21:00', '20:00 까지 라스트오더'];

export const vivo = {
  id: 'r2',
  name: 'vivo pizza 공덕점',
  district: '공덕',
  cuisine: '피자',
  description: '코지한 분위기에서 화덕피자, 생면 파스타, 에스프레소, 아페…',  // the app truncates it the same way
  rating: 4.6, reviewCount: 251, saveCount: 721, photoCount: 227,
  badges: [],
  photos: ['restaurants/vivo-3.jpg', 'restaurants/vivo-2.jpg'],
  stations: [
    { lines: ['5', '6', '경의중앙', '공항'], name: '공덕역', distanceM: 373 },
    { lines: ['6'], name: '대흥역', distanceM: 540 },
  ],
  priceBand: '점심, 저녁 동일가 · 2-3만원',
  hours: { open: '11:00', close: '21:00' },
  weeklyHours: [['월', WEEKDAY], ['화', WEEKDAY], ['수', WEEKDAY], ['목', WEEKDAY], ['금', WEEKDAY], ['토', WEEKEND], ['일', WEEKEND]],
  tags: ['최대 4명 예약', '주차', '단체', '대기공간'],
  coupon: null,
  aiSummary: {
    title: '코지한 분위기에서 즐기는 쫄깃한 도우의 화덕피자',
    points: [
      '공덕역 인근에 위치한 아늑한 분위기의 이탈리안 핏제리아예요.',
      '화덕에 구워내 쫄깃한 도우를 자랑하는 피자와 함께 생면 파스타를 맛볼 수 있어요.',
      '아기자기한 분위기의 공간으로, 날씨가 좋은 날 방문하면 더욱 좋다는 평이 많아요.',
    ],
  },
  awardBanner: null,
  ribbon: null,
  waitingEnabled: true,
  bookingEnabled: true,
  booking: {
    maxPartySize: 4,
    windowDays: 60,
    times: ['11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30'],
    soldOut: [[0, null]],
    openSchedule: { time: '매일 오전 9:00', note: '60일간 예약이 가능합니다.' },
  },
  policies: { depositKRW: 0 },  // the app showed 10,000원 per person (171739); applied with checkout in Phase 4
  menu: {
    boards: ['menu/vivo-board-1.jpg', 'menu/vivo-board-2.jpg', 'menu/vivo-board-3.jpg'],
    notes: ['아이들 메뉴 없음'],
    updatedAt: '2026-07-11',
    categories: [
      { name: 'Pizza', range: '21,000 - 26,000원', items: [
        item('로마노 피자', 26000, '양 젖으로 만든 치즈인 페코리노 로마노 치즈를 사용해 담백하고 부드러운 맛이 나는 피자', 'menu/vivo-01.jpg', ['대표']),
        item('마르게리따', 22000, null, 'menu/vivo-02.jpg'),
        item('루꼴라 풍기', 26000, null, 'menu/vivo-03.jpg'),
        item('디아블라', 25000, null, 'menu/vivo-04.jpg'),
        item('콰트로 치즈', 25000, null, 'menu/vivo-05.jpg'),
      ] },
      { name: 'Pasta', range: '23,000 - 24,000원', items: [
        item('라구파스타', 23000, '14시간 정성이 들어간 라구소스로 만든 파스타', 'menu/vivo-06.jpg'),
        item('새우 로제', 25000, null, 'menu/vivo-07.jpg'),
        item('바질', 25000, null, 'menu/vivo-08.jpg'),
        item('새우 초리조 오일', 25000, null, 'menu/vivo-09.jpg'),
        item('토마토 라구 파스타', 23000, null, 'menu/vivo-10.jpg'),
      ] },
      { name: 'Appetizer & Side', range: '3,000 - 23,000원', items: [
        item('구운 버섯 샐러드', 19000, null, 'menu/vivo-11.jpg'),
        item('부라따 샐러드', 23000), item('치킨윙 5pcs', 8000), item('포테이토 프라이', 9000), item('루꼴라', 5000), item('당근라페', 3000),
      ] },
      { name: 'Beverage', range: '4,000 - 12,000원', items: [
        item('콜라/제로콜라/스프라이트', 4000), item('오렌지 쥬스', 4000), item('생레몬에이드', 8000), item('아메리카노 (Ice/Hot)', 4500),
        item('에스프레소', 4000), item('아포가토', 6000), item('글라스 와인 (레드/화이트)', 12000), item('페로니 생맥주 330', 9000), item('아페롤 스프릿츠', 12000),
      ] },
    ],
  },
  reviews: { distribution: [158, 69, 18, 2, 4], purposes: [['친목', 103], ['가족식사', 77], ['데이트', 52]] },
  photoFilters: [['업체', 8], ['동영상', 4], ['음식', 202], ['내부', 12]],
  info: {
    intro: '공덕역 1번 출구 5분 거리에 있는 화덕피자 매장입니다.\n\n주차는 1시간만 지원이 가능하며\n아파트 측에서 고객에게 제공할 수 있는 시간을 제한을 두어\n선착순으로 마감될 수 있습니다.',
    award: null,
    address: '서울특별시 마포구 백범로 152 공덕파크자이',
    map: 'maps/vivo.jpg',
    directions: '공덕역 1번 출구에서 직진 후 공덕파크자이아파트 201동 단지 시작점에서 좌회전하시면 됩니다.',
    facilities: ['주차', '단체', '대기공간'],
    guides: [
      { title: '주차 안내', lines: ['주변 주차장', '주차 요금 무료', '공덕파크자이 아파트 201동 내 주차시설 이용가능'] },
      { title: '창가 안내', lines: ['2-3인 이용 가능', '2개 테이블 운영'] },
      { title: '바 안내', lines: ['1-2인 이용 가능', '2개 좌석 운영'] },
    ],
    phone: '010-6493-1544',
    weeklyHours: null,  // shown from the top-level weeklyHours
    closedDays: '연중 무휴입니다, 여름/겨울 휴가가 있습니다.\n네이버에서 검색하시고, 전화문의가 가장 정확합니다.',
    notices: '웨이팅 발생시 식사시간은 1시간 30분으로 제한됩니다. 주말, 공휴일은 브레이크 타임 없이 운영합니다.',
    capacity: '10명까지 이용 가능합니다.\n내부 공간이 협소하여 불편할 수 있습니다. 양해 부탁드립니다.',
  },
  news: [],
  broadcasts: [],
};
