# Screen Map

Route paths are the target contract. Files appear only in their phase. Relative links must
work under both a local server and a project subpath. Preserve IDs across navigation.

| ID | Route under prototype/ | Content / actions | Phase |
|---|---|---|---|
| D00 | index.html | Presenter role/identity selector, implemented scenario presets, reset and clock tools | 0 onward |
| C01 | customer/discovery.html | App home: search, brand tabs, location, banners, category grid, restaurant list with filters, bottom nav | 1 (fidelity pass) |
| C02 | customer/restaurant.html?restaurantId=r1 | Header icons, photos, summary, tabs that switch panels (홈/소식/메뉴/사진/리뷰/방송/매장정보 as the fixture has them), coupon, booking date chips + calendar sheet + visit confirmation, waiting statistics chart, AI summary, optional ribbon, save/phone/CTA bar; active ticket later | 1-3, 6 (r4-r14) |
| C10 | customer/saved.html | 저장 tab: recent-views collection, restaurants saved by the active customer with photos and date chips | 1 (fidelity pass) |
| C12 | customer/search.html | Search: recent views, suggestion chips, hashtags; results as restaurant cards | 1 (fidelity pass) |
| C11 | customer/my-dining.html | 마이다이닝 tab: 나의 예약 with 방문예정/방문완료/취소·노쇼: waiting tickets, reservations (to C07), the 빈자리 대기 entry and the 나의 알림 tab | 1 (fidelity pass), 2-5 |
| C03 | customer/waiting.html?ticketId=...[&view=postpone] | 방문예정: place in line, ticket number, estimate, cancel; 웨이팅 순서 미루기 view (choose a later place, confirm sheet); called / seated / cancelled states; registered sheet | 2 |
| C13 | customer/waiting-register.html?restaurantId=r1 | 방문 인원 선택 (steppers) then 웨이팅 정보 확인 (teams, estimate, rules) and 웨이팅 등록하기. Pages instead of a C02 sheet because the app captures (183123, 183234) show full screens | 2 |
| C04 | customer/cancellation-queue.html | 빈자리 대기: live requests (rank among identical conditions, request ID), the current offer with deadline, withdraw, ended requests. Conditions are entered from the C02 booking sheet (sold-out time → join sheet) | 3 |
| C05 | customer/offer.html?offerId=... | 우선 예약 기회: exclusive offer, countdown to the absolute deadline, owner check, decline, rejoin after it ends; 예약하기 opens the 예약금 안내 sheet, then C06 | 3-4 |
| C06 | customer/checkout.html?offerId=... | As 171752: offer timer, 예약 정보, 방문 목적, 데모 카드, 총 결제 금액, 요청사항, consents with refund table; processing / unknown / recovery / refunded states. Reached from C05 via the 예약금 안내 sheet (171739) | 4 |
| C07 | customer/reservation.html?reservationId=... | Confirmation banner (once), restaurant, 예약번호, date/time (with "변경됨 · 처음 예약" after an accepted change), party, purposes, request, deposit and payment ID; 늦게 도착할 것 같나요? section: ETA sheet, status card with accept/reject for a live proposal, update ETA, 조율 기록; refund policy | 4-5 |
| C08 | customer/my-dining.html (방문예정) | Seeded and newly confirmed reservations, linking to C07. Served by the app's own 마이다이닝 나의 예약 list (173505) instead of a separate page | 4 |
| C09 | customer/inbox.html | 나의 알림 (also the 마이다이닝 tab and the home bell): offers, expiries, waiting calls, booking confirmations, refunds and late-arrival responses | 3-5 |
| C14 | customer/my.html | MY tab (220751): active demo customer profile, 팔로워/팔로잉, 캐치미식가 배지, CATCH pay banner, 포인트 / 쿠폰함 (claimed coupons sheet) / 저장 / 최근 본 매장 tiles, 생일·기념일 and 전화 예약 rows, empty review sections; other rows explain they are not in this demo | 6 |
| M01 | manager/reservations.html | 예약 · 빈자리: released slots with holder/deadline/next in line, and the restaurant's requests in FIFO order (same IDs as C04); 예약 목록 with the 지각 조율 badge and 상세 link to M03 | 3-5 |
| M02 | manager/waiting.html | 접수중/접수마감 switch, totals, 웨이팅 중 / 착석 / 취소 tabs, rows with 호출 / 착석 / 취소 for the active manager's restaurant only | 2 |
| M03 | manager/reservation.html?reservationId=... | Booking (original and current time) + current ETA version, 예약 유지 / 시간 변경 제안 / 유지 어려움, the same 조율 기록 as C07; only the restaurant's manager. Linked from the M01 예약 목록 지각 조율 badge | 5 |

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
| Restaurant booking-only (r3, r4, r5, r8, r9, r10, r12) | Booking actions; no on-site waiting statistics or ticket CTA |
| Restaurant waiting-only (r7, r14) | Waiting actions only; no booking panel |
| Booking day closed (r5 Sun/Mon, r10 Sun, r12 Mon) | No times that day; the sheet says no times are available on that date, and on those days the summary hours read 오늘 (요일) · 정기휴무 |

Do not overwrite a current ticket action merely because the restaurant stopped new registration.
