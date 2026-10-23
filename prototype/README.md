# CatchTable Rebuild Prototype

Front-end-only class prototype (vanilla HTML/CSS/ES modules). No build step, no install,
no backend. Restaurant listings (r1-r3) are transcribed from app captures; customers, availability,
waiting and statistics are fictional. Demo data lives in this browser's localStorage.

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

## Pages (through Phase 3)

| Route | Purpose |
|---|---|
| `index.html` | Presenter hub: reset, demo clock, role and account selection, scenario/route status |
| `customer/discovery.html` | App home: search, brand tabs, banners, category grid, restaurant list, bottom nav (the C logo returns to the hub) |
| `customer/restaurant.html?restaurantId=r1` | Restaurant detail: r1 월화식당 마포본점 and r2 vivo pizza 공덕점 (real listing details from app captures), r3 스시렌 booking-only |
| `customer/search.html` | Search: recently viewed restaurants, suggestion chips and hashtags; matches name, area, menu and tags |
| `customer/saved.html` | 저장 tab: recent-views collection and restaurants saved with the bookmark button, with date chips |
| `customer/my-dining.html` | 마이다이닝 tab: 방문예정/방문완료/취소·노쇼 waiting tickets (reservations arrive in later phases) |
| `customer/waiting-register.html?restaurantId=r1` | Waiting registration: party size, then confirmation |
| `customer/waiting.html?ticketId=w-r1-6` | My waiting (방문예정): place in line, cancel, 웨이팅 순서 미루기 |
| `customer/cancellation-queue.html` | 빈자리 대기: your cancellation-seat requests and any live offer |
| `customer/offer.html?offerId=of-1` | Exclusive priority offer: countdown, decline (booking itself is Phase 4) |
| `customer/inbox.html` | 나의 알림: offers, expiries and waiting calls |
| `manager/reservations.html` | Manager 예약 · 빈자리: released slots and the request queue |
| `manager/waiting.html` | Manager waiting dashboard (desktop): 접수 switch, queue, 호출 / 착석 / 취소. Acts as the manager selected in the hub |
| `customer/ui-sample.html` | Neutral mobile sample of shared components (390px reference width) |
| `tests/index.html` | Self-check (store, seed, clock, format, statistics, booking, customer lists, waiting). Restores your demo data afterwards |

Demo of waiting: hub 시나리오 준비 → '웨이팅 진행 중' (김하늘 3rd at 월화식당), or register from the
월화식당 detail page. Open the manager page in a second tab; 호출 / 착석 there update the customer
tab live. Hub '현장 손님 도착' adds a walk-in party (more postpone choices; opens vivo's queue).
Demo of the cancellation queue: hub '빈자리 대기 준비' (3 requests for 월화식당 tomorrow 19:00, the oldest for
4 people), then '빈자리 발생시키기': 김하늘 gets a 2-minute exclusive offer. Decline it, or use 시계 +1분, and it
moves to 이도윤; with nobody left the time reopens for booking. Customers join from the booking sheet by
tapping a 마감 time. Booking payment arrives in Phase 4. App controls that this demo
does not implement stay visible and say so when tapped.
Restaurant basics and photos for r1/r2 come from app captures of 2026-10-16; availability,
deposits, waiting and statistics are demo data. The Pretendard font is bundled (SIL OFL).

If the hub says the saved data is from an older version (for example after updating the
prototype), press 데모 초기화 once.

## Data and limits

- One snapshot under the localStorage key `catchtable-prototype:v1`
  (`schemaVersion`, `revision`, `scenarioEpoch`, demo-clock offset, presenter selections).
- "데모 초기화" (reset) rebuilds the same fixtures with dates from the reset time and starts a
  new scenario epoch; delayed mock results from before the reset are discarded.
- If stored data is unreadable, the hub says so and leaves it untouched until you reset.
  If the browser blocks storage, the hub warns that changes will not survive a reload.
- Use one active tab for actions. Other tabs update when data changes, but localStorage is
  not a transactional database and concurrent writers are not supported.
- Role checks run in local code only; browser data can be inspected and edited. This is a
  demonstration, not a secure or production system.
