# Screen Map

Route paths are the target contract. Files appear only in their phase. Relative links must
work under both a local server and a project subpath. Preserve IDs across navigation.

| ID | Route under prototype/ | Content / actions | Phase |
|---|---|---|---|
| D00 | index.html | Presenter role/identity selector, implemented scenario presets, reset and clock tools | 0 onward |
| C01 | customer/discovery.html | App home: search, brand tabs, location, banners, category grid, restaurant list with filters, bottom nav | 1 (fidelity pass) |
| C02 | customer/restaurant.html?restaurantId=r1 | Header icons, photos, summary, tabs that switch panels (홈/소식/메뉴/사진/리뷰/방송/매장정보 as the fixture has them), coupon, booking date chips + calendar sheet + visit confirmation, waiting statistics chart, AI summary, optional ribbon, save/phone/CTA bar; active ticket later | 1-3 |
| C10 | customer/saved.html | 저장 tab: recent-views collection, restaurants saved by the active customer with photos and date chips | 1 (fidelity pass) |
| C12 | customer/search.html | Search: recent views, suggestion chips, hashtags; results as restaurant cards | 1 (fidelity pass) |
| C11 | customer/my-dining.html | 마이다이닝 tab: 나의 예약 with 방문예정/방문완료/취소·노쇼 empty states now; waiting tickets and reservations later | 1 (fidelity pass), 2-5 |
| C03 | customer/waiting.html?ticketId=...[&view=postpone] | 방문예정: place in line, ticket number, estimate, cancel; 웨이팅 순서 미루기 view (choose a later place, confirm sheet); called / seated / cancelled states; registered sheet | 2 |
| C13 | customer/waiting-register.html?restaurantId=r1 | 방문 인원 선택 (steppers) then 웨이팅 정보 확인 (teams, estimate, rules) and 웨이팅 등록하기. Pages instead of a C02 sheet because the app captures (183123, 183234) show full screens | 2 |
| C04 | customer/cancellation-queue.html | Join conditions, pending requests, withdraw, open current offer | 3 |
| C05 | customer/offer.html?offerId=... | Exclusive offer, countdown, owner check, decline, proceed to checkout | 3-4 |
| C06 | customer/checkout.html?offerId=... | Booking summary, policies, demo payment, pending/failure/recovery states | 4 |
| C07 | customer/reservation.html?reservationId=... | Confirmation or existing booking detail, ETA form and coordination history | 4-5 |
| C08 | customer/reservations.html | Seeded and newly confirmed reservations, links to detail | 4 |
| C09 | customer/inbox.html | Offers, booking confirmations, calls and late responses; links to authoritative records | 3-5 |
| M01 | manager/reservations.html | Restaurant-scoped bookings and cancellation allocation status | 3-5 |
| M02 | manager/waiting.html | 접수중/접수마감 switch, totals, 웨이팅 중 / 착석 / 취소 tabs, rows with 호출 / 착석 / 취소 for the active manager's restaurant only | 2 |
| M03 | manager/reservation.html?reservationId=... | Booking + ETA, retain/propose/cannot-retain actions and final history | 5 |

Modal/sheet variants are states of these pages, not mandatory new HTML files.
Provide navigation/back/empty/not-found behavior on every implemented route.
In early phases, hide links to future pages or visibly disable them with a phase-independent
'unavailable in this demo' explanation. Do not create fake working navigation.

## Demo hub controls

Reset all demo data; choose implemented coherent presets; switch customer c1/c2 and manager
m1/m2; release one cancellation slot; advance clock; fail next payment; defer payment result;
resolve pending outcome; fail next reservation commit; retry/compensate recovery;
fail next notification; retry delivery. Enable each only when its service exists.
Role switching must preserve domain state. A preset/reset deliberately replaces it.

## Restaurant detail CTA rules

| Condition | Action |
|---|---|
| Waiting enabled, no active ticket, registrations open | Register Waiting |
| WAITING or CALLED ticket owned by current customer | View My Waiting; show current status visibly |
| Ticket cancelled/seated, registrations open | Register Waiting; no stale active banner |
| No active ticket, registrations closed | Closed/disabled action with explanation |
| Booking sold out, cancellation queue supported | Join Cancellation Queue or View Queue if already joined |
| Restaurant booking-only | Booking actions; no on-site waiting statistics or ticket CTA |

Do not overwrite a current ticket action merely because the restaurant stopped new registration.
