# CatchTable Rebuild Prototype

Front-end-only class prototype (vanilla HTML/CSS/ES modules). No build step, no install,
no backend, no network at runtime. Restaurants r1-r14 are real restaurants (see "Data sources");
customers, availability, deposits, waiting, statistics, payments and notifications are fictional.
Demo data lives in this browser's localStorage.

## Run

ES modules do not load from `file://`, so serve the repository root over HTTP:

```sh
# from the repository root (the folder that contains prototype/)
python -m http.server 5500
# Windows alternative if `python` is not on PATH:
py -m http.server 5500
```

Open http://localhost:5500/prototype/ and keep the server running.
VS Code Live Server also works: open `prototype/index.html` with "Open with Live Server".

Demo data is stored per origin. Use the same host and port every time (e.g. always
`localhost:5500`) to keep it; `127.0.0.1:5500` is a different origin with separate data.
If the hub says the saved data is from an older version, press 데모 초기화 once.

## Pages

Customer pages are mobile layouts (check at 390x844); manager pages and the hub are desktop
layouts (1440x900, usable down to 1024px).

| Route | Purpose |
|---|---|
| `index.html` | Presenter hub: reset, demo clock, role and account, scenario presets, walk-ins, slot release, mock payment and notification faults, route list |
| `customer/discovery.html` | 홈: search, brand tabs, banners, category grid, areas, restaurant list, bell (→ 나의 알림), bottom nav (the C logo returns to the hub) |
| `customer/restaurant.html?restaurantId=r1` | Restaurant detail, r1-r14: tabs, booking dates and sheet, waiting statistics, waiting/cancellation strips and the context-dependent bottom action |
| `customer/search.html` | Search: recently viewed, suggestions, hashtags; matches name, area, cuisine, menu and tags |
| `customer/saved.html` | 저장 tab: recent views and saved restaurants with date chips |
| `customer/my-dining.html` | 마이다이닝 tab: waiting tickets, reservations, the 빈자리 대기 entry and the 나의 알림 tab |
| `customer/my.html` | MY tab: the active demo customer, coupons, links to 저장 and search |
| `customer/waiting-register.html?restaurantId=r1` | Waiting registration: party size, then confirmation |
| `customer/waiting.html?ticketId=w-r1-6` | My waiting: place in line, cancel, 웨이팅 순서 미루기 |
| `customer/cancellation-queue.html` | 빈자리 대기: your cancellation-seat requests and any live offer |
| `customer/offer.html?offerId=of-1` | Exclusive priority offer: countdown, decline, 예약하기 → 예약금 안내 |
| `customer/checkout.html?offerId=of-1` | Mock priority checkout (예약금, consents, demo card) and its payment states |
| `customer/reservation.html?reservationId=rv-1` | Reservation detail with late-arrival (ETA) coordination |
| `customer/inbox.html` | 나의 알림: offers, expiries, waiting calls, confirmations, refunds, late-arrival answers |
| `manager/waiting.html` | Waiting dashboard: 접수 switch, queue, 호출 / 착석 / 취소 |
| `manager/reservations.html` | 예약 · 빈자리: bookings (지각 조율 badge), released slots, the request queue |
| `manager/reservation.html?reservationId=rv-1` | Booking detail: answer a late-arrival report (retain / propose a time / cannot retain) |
| `customer/ui-sample.html` | Neutral sample of shared components |
| `tests/index.html` | Self-check of the risky domain logic (50 checks). Restores your demo data afterwards |

Managers act only on their own restaurant: m1 → 월화식당 (r1), m2 → vivo pizza (r2). Pick them in the hub.

## Rehearsing the three demos

The full script with timings is `docs/demo-script.md`. Use one browser window with a customer tab
(390x844) and a manager tab; the other tab updates by itself when data changes.

- **Waiting**: hub 시나리오 준비 → 처음 상태. Open 월화식당, choose 웨이팅, look at the statistics,
  register, leave and reopen it (status strip and 내 웨이팅 보기). On the hub, 현장 손님 도착 →
  월화식당 마포본점 +1팀 so there is a place to postpone to, then 웨이팅 미루기. The manager waiting
  page shows the same order. Shortcut: preset 웨이팅 진행 중 (김하늘 3rd).
- **Cancellation seat**: preset 빈자리 대기 준비, then 빈자리 발생시키기 on the hub. 김하늘 gets a 2-minute
  exclusive offer (inbox → offer). 예약하기 → 확인 → all consents → 결제하기 books it. Declining it, or
  pressing 시계 +1분 until it expires, hands it to 이도윤; with nobody left the time reopens for booking.
  Payment faults are under 모의 결제 시뮬레이션 (fail, deferred/unknown result, reservation-save failure),
  with resolve / retry / refund buttons for held payments.
- **Late arrival**: 처음 상태, 마이다이닝 → the 월화식당 booking → 늦는다고 알리기, pick an ETA. In the manager
  tab open 예약 · 빈자리 → rv-1 상세 and answer. A proposed time changes the booking only when the customer
  accepts it; both sides show the same 조율 기록. Preset 지각 조율 준비 starts with an ETA already sent.

If a rehearsal goes wrong, apply the matching preset again; never edit storage by hand.

## Data sources

- r1 월화식당 마포본점, r2 vivo pizza 공덕점, r3 스시렌: details, menus and photos from the user's app captures.
- r4 밍글스, r5 Restaurant EVETT, r6 우월소곱창 신도림본점, r7 작은따옴표 도림천점, r8 이자카야나무 사당역2호점,
  r9 돌판장 양재, r10 팔향, r11 마담풍천 보라매, r12 투머트, r13 월화고기 보라매점, r14 화포식당 한남점: name,
  rating, review count, Michelin label and photo from a home-screen capture; address, phone, hours and
  menu prices from public web pages (URLs in `docs/assets.md`). Fields no source states are left out
  (r9 and r11 have only the capture data), and no reviews or menus are invented.
- Booking, waiting, deposit and statistics settings of every restaurant are mock values.
- App controls this demo does not implement (brand tabs, most categories, 내 주변, points, settings, ...)
  stay visible and say so when tapped. The Pretendard font is bundled (SIL OFL).

## Data and limits

- One snapshot under the localStorage key `catchtable-prototype:v1`
  (`schemaVersion`, `revision`, `scenarioEpoch`, demo-clock offset, presenter selections).
- "데모 초기화" (reset) and every preset rebuild the fixtures with dates from the reset time and start a
  new scenario epoch; delayed mock results from before the reset are discarded.
- If stored data is unreadable, the hub says so and leaves it untouched until you reset.
  If the browser blocks storage, the hub warns that changes will not survive a reload.
- Use one active tab for actions. Other tabs update when data changes, but localStorage is
  not a transactional database and concurrent writers are not supported.
- Offer deadlines and payment outcomes are settled whenever a page is open (on load and on a timer);
  with every page closed, nothing advances until one is opened again.
- Payment, notification and messaging are simulations; never enter real card details.
- Role checks run in local code only; browser data can be inspected and edited. This is a
  demonstration, not a secure or production system.
