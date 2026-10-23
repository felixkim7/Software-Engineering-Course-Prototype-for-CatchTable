# Screen Map

Route paths are the target contract. Files appear only in their phase. Relative links must
work under both a local server and a project subpath. Preserve IDs across navigation.

| ID | Route under prototype/ | Content / actions | Phase |
|---|---|---|---|
| D00 | index.html | Presenter role/identity selector, implemented scenario presets, reset and clock tools | 0 onward |
| C01 | customer/discovery.html | Fictional restaurant list, local filters, cards opening detail | 1 |
| C02 | customer/restaurant.html?restaurantId=r1 | Header/photo/tabs, booking or waiting area, statistics, active ticket and contextual CTA | 1-3 |
| C03 | customer/waiting.html?ticketId=... | Party/position/status, postpone choices, cancel, call state | 2 |
| C04 | customer/cancellation-queue.html | Join conditions, pending requests, withdraw, open current offer | 3 |
| C05 | customer/offer.html?offerId=... | Exclusive offer, countdown, owner check, decline, proceed to checkout | 3-4 |
| C06 | customer/checkout.html?offerId=... | Booking summary, policies, demo payment, pending/failure/recovery states | 4 |
| C07 | customer/reservation.html?reservationId=... | Confirmation or existing booking detail, ETA form and coordination history | 4-5 |
| C08 | customer/reservations.html | Seeded and newly confirmed reservations, links to detail | 4 |
| C09 | customer/inbox.html | Offers, booking confirmations, calls and late responses; links to authoritative records | 3-5 |
| M01 | manager/reservations.html | Restaurant-scoped bookings and cancellation allocation status | 3-5 |
| M02 | manager/waiting.html | Register/postpone/cancel results, queue, call and admit | 2 |
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
