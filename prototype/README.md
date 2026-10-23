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

## Pages (through Phase 1)

| Route | Purpose |
|---|---|
| `index.html` | Presenter hub: reset, demo clock, role and account selection, scenario/route status |
| `customer/discovery.html` | App home: search, brand tabs, banners, category grid, restaurant list, bottom nav (the C logo returns to the hub) |
| `customer/restaurant.html?restaurantId=r1` | Restaurant detail: r1 월화식당 마포본점 and r2 vivo pizza 공덕점 (real listing details from app captures), r3 스시렌 booking-only |
| `customer/search.html` | Search: recently viewed restaurants, suggestion chips and hashtags; matches name, area, menu and tags |
| `customer/saved.html` | 저장 tab: recent-views collection and restaurants saved with the bookmark button, with date chips |
| `customer/my-dining.html` | 마이다이닝 tab: 방문예정/방문완료/취소·노쇼 (empty until waiting/reservations arrive in later phases) |
| `customer/ui-sample.html` | Neutral mobile sample of shared components (390px reference width) |
| `tests/index.html` | Self-check (store, seed, clock, format, statistics). Restores your demo data afterwards |

Waiting registration, booking payment and manager screens arrive in later phases. App
controls that this demo does not implement stay visible and say so when tapped.
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
