# CatchTable Rebuild Prototype

A clickable, front-end-only prototype of a redesigned **CatchTable** (Korean restaurant booking and
waiting app), built for the Sogang University CSE4115 Software Engineering midterm assignment.

It reproduces the real app's look from screen captures and demonstrates three improvements:

1. **Cancellation-seat priority booking:** when a booking is cancelled, the earliest matching applicant
   gets an exclusive, time-limited chance to book it, instead of everyone racing for the seat.
2. **Waiting visibility and statistics:** your active waiting ticket shows directly on the restaurant
   page, and every waiting restaurant shows weekday/hour waiting statistics.
3. **Late-arrival coordination:** a customer reports an expected arrival time, the restaurant answers,
   and both sides share one record of the agreement.

> Everything runs in your browser. There is no backend, no real login, no real booking, payment or
> messaging. Customers, availability, deposits, payments and notifications are fictional.

## Quick start

ES modules do not load from `file://`, so serve the repository over HTTP:

```sh
# from this folder (the one containing prototype/)
python -m http.server 5500      # or: py -m http.server 5500
```

Open **http://localhost:5500/prototype/**. That page is the **presenter hub**.

- Nothing to install, no build step. The font and all images are local, so it works offline.
- VS Code Live Server also works: open `prototype/index.html` with "Open with Live Server".
- Demo data is kept in the browser's localStorage per address. Use the same host and port every time.
- If the hub says the saved data is outdated, press **데모 초기화** (reset).

Customer screens are mobile layouts. View them at about 390x844 (browser dev tools → device mode).
Manager screens and the hub are desktop layouts (1440x900, usable down to 1024px).

## The presenter hub

The hub (`prototype/index.html`) is a control panel for the demo, not part of the app. From it you can:

- **Reset** the demo, or apply a **scenario preset** that sets up a ready-made situation:

  | Preset | What it sets up |
  |---|---|
  | 처음 상태 | Clean start |
  | 웨이팅 진행 중 | 김하늘 is 3rd in line at 월화식당 |
  | 빈자리 대기 준비 | Three cancellation-seat requests for 월화식당 tomorrow 19:00 |
  | 우선 예약 기회 제공 중 | 김하늘 holds a 2-minute exclusive offer |
  | 결제 결과 확인 중 | A payment whose result is unknown; the seat stays held |
  | 지각 조율 준비 | 김하늘 has reported arriving at 18:30 for an 18:00 booking |

- **Switch roles and accounts:** demo customers (김하늘 c1, 이도윤 c2, c3) and restaurant managers
  (m1 → 월화식당, m2 → vivo pizza).
- **Move the demo clock** forward (+1 or +10 minutes) to expire offers.
- **Add a walk-in party** to a waiting queue.
- **Release a seat**, as if another customer cancelled a booking.
- **Simulate failures:** the next payment fails, the next payment result is unknown, the reservation
  save fails, or the next notification is not delivered. Each has resolve, retry or refund buttons.
- **Open every page** from a route list.

Tip: keep a customer tab and a manager tab side by side. A change in one updates the other by itself.

## Features

### Customer app (mobile)

| Screen | What you can do |
|---|---|
| 홈 (Home) | Browse banners, categories and areas; filter the restaurant list by 예약 (booking) or 웨이팅 (waiting) |
| 검색 (Search) | Search by name, area, cuisine, menu or tag; see recently viewed restaurants |
| Restaurant detail | Tabs for home, menu, photos, reviews and store info; book a date, party size and time; register for waiting; see waiting statistics |
| 저장 (Saved) | Restaurants you bookmarked |
| 마이다이닝 (My dining) | Your waiting tickets, reservations and cancellation-seat requests; 나의 알림 (notifications) |
| MY | The demo customer's profile, claimed coupons, links to saved and recent restaurants |

Buttons from the real app that the demo does not implement stay visible. Tapping one says
"not in this demo" instead of doing nothing.

### 1. Waiting

- Register a party from a restaurant's **웨이팅** mode. The confirmation shows teams ahead and an estimate.
- Back on the restaurant page, your ticket appears **at the top**, and the bottom button changes to
  **내 웨이팅 보기** (view my waiting).
- On your ticket you can **postpone** to a later place in line (up to 2 times) or cancel.
- The **statistics chart** shows average waiting by weekday and hour over the last 4 weeks.
  Hours without enough records say **collecting data** instead of showing a fake zero.
- The manager's waiting dashboard (`manager/waiting.html`) can open/close registration and
  **call**, **seat** or **cancel** each party. Calls reach the customer's screen live.

### 2. Cancellation-seat priority booking

- When a time is sold out, tap it in the booking sheet to **join the cancellation-seat queue**
  for that exact date, time and party size.
- When a seat is released, **only the first matching applicant** gets an offer. Others wait their turn.
- The offer has a **2-minute countdown** that survives reloads. Book it with a mock deposit payment,
  or decline it.
- If the offer is declined or expires, it passes to the next applicant. With nobody left,
  the time becomes bookable again.
- Payment states are handled honestly: processing, failed (retry), unknown (seat stays held until
  resolved), and refunded.
- The manager's 예약 · 빈자리 page shows each released seat, who holds it, and who is next.

### 3. Late-arrival coordination

- On a reservation, tap **늦는다고 알리기**, pick an arrival time and an optional reason.
- The status says **waiting for the restaurant**. Reporting is not approval.
- The manager (`manager/reservation.html`) can **keep the booking**, **propose a different time**,
  or say they **cannot keep it**.
- A proposed time changes the booking **only if the customer accepts it**.
- Customer and manager see the **same history** of every step.

## Try it: three short demos

**A. Waiting (about 1 minute)**
1. Hub → 처음 상태. Open 홈 → 월화식당 마포본점 → choose 웨이팅 and look at the statistics.
2. Tap 웨이팅하기, choose the party size, and register.
3. Go back to 홈 and reopen 월화식당. Your ticket shows at the top, and the button reads 내 웨이팅 보기.
4. Hub → 현장 손님 도착 → 월화식당 마포본점 +1팀, so someone is behind you.
5. Open 내 웨이팅 보기 → 웨이팅 미루기, then open the manager waiting page to see the new order.

**B. Cancellation seat (about 1 minute)**
1. Hub → 빈자리 대기 준비, then 빈자리 발생시키기.
2. As 김하늘, open 나의 알림 → the offer, which counts down from 2:00.
3. 예약하기 → 확인 → agree to all terms → 결제하기. The booking is confirmed.
4. To see the hand-off instead, decline the offer (or press 시계 +1분 until it expires) and switch to 이도윤.

**C. Late arrival (about 1 minute)**
1. Hub → 처음 상태. Open 마이다이닝 → the 월화식당 booking → 늦는다고 알리기 → pick a time and send.
2. In a manager tab, open 예약 · 빈자리 → rv-1 상세 → propose a new time.
3. Back in the customer tab, accept it. Both pages show the new time and the same history.

If something goes wrong, apply the matching preset again. There is no need to clear data by hand.

## Restaurants

There are 14 real restaurants. Their names, ratings, review counts and photos come from the
author's own app captures. Addresses, phones, hours and menus come from public web pages; the
sources are listed in [docs/assets.md](docs/assets.md). Details that no public source states are
left out rather than invented, and no reviews are invented.

**Booking, waiting, deposits, availability and statistics are mock values, not the
restaurants' real policies.**

## Project layout

```text
prototype/
  index.html        presenter hub
  customer/         mobile pages
  manager/          desktop pages for restaurant managers
  assets/           css, fonts, images, js (core, services, ui, pages)
  tests/            self-check page for the domain logic
docs/               requirements, decisions, data model, screen map, demo script, progress
```

Built with vanilla HTML, CSS and JavaScript modules: no framework, no dependencies.

## Tests

Open **http://localhost:5500/prototype/tests/** to run the 50 self-checks. They cover queue
matching and order, offer deadlines, payment outcomes, waiting rules and late-arrival versioning.
The page restores your demo data afterwards.

## Limitations

- **One browser, one active tab for actions.** Other tabs follow along, but localStorage is not a
  real database, so concurrent edits from several tabs are not supported.
- **Deadlines need an open page.** Offer deadlines and payment results are settled while a page
  is open. With every page closed, nothing advances.
- **Managers exist only for two restaurants:** 월화식당 and vivo pizza.
- **Not a secure system.** Role checks run in the browser and data can be edited. Never enter real
  card or personal details.

## More documentation

| Document | Contents |
|---|---|
| [prototype/README.md](prototype/README.md) | Every route, rehearsal notes, data and limits |
| [docs/demo-script.md](docs/demo-script.md) | Presentation script with timings |
| [docs/requirements.md](docs/requirements.md), [docs/decisions.md](docs/decisions.md) | Requirements and mock policy decisions |
| [docs/screen-map.md](docs/screen-map.md), [docs/data-model.md](docs/data-model.md) | Screens and data model |
| [docs/assets.md](docs/assets.md) | Image and data sources |
| [docs/PROGRESS.md](docs/PROGRESS.md) | Development history and verification evidence |

Restaurant photos, CatchTable artwork and brand names belong to their owners and are used only for
this class prototype. The Pretendard font is bundled under the SIL Open Font License.
