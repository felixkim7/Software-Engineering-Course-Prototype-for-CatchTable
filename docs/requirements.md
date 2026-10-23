# Requirements and Scope

## Product and actors

A mobile customer experience and desktop restaurant manager workspace demonstrate
three To-Be themes. A presenter-only hub controls mock scenarios. Reservation and
waiting customers share an account model; the presenter may switch fixture identities.
Platform administration belongs to the full system model but is not a required prototype workspace.
Payment and notification are mock services. No external API or live customer contact.

## Scope tiers

- Fully interactive: cancellation requests/offers/checkout/results; active waiting detail
  state, ticket actions and statistics; late-arrival requests and both sides of coordination.
- Supporting: discovery, restaurant detail, minimal reservation history/detail, manager
  reservation list, manager waiting list/call/admit, and inbox. Existing reservations can
  be seeded; ordinary booking, refund admin and account systems need not be fully rebuilt.
- Context only: platform policy administration, merchant onboarding, real account auth,
  review editing, real settlement, POS, delivery/pickup and production integrations.
- Visual fidelity (user request, 2026-10-23):
  - The home screen shows brand tabs, banner carousel, category grid and the 5-tab bottom nav.
  - The detail screen shows photos, rating/review count, the 홈/메뉴/사진/리뷰/매장정보 tabs,
    header icons, save/phone buttons, AI summary, coupon, and the 날짜·인원·시간 picker.
  - Light local behaviour where it is cheap and honest: search, filters, two categories,
    save list, coupon claim, link copy, tab scrolling, mock availability.
  - Every other visible control explains on tap that it is not part of this demo
    (one shared message). No control may simulate a success that did not happen.
  - Ordinary booking payment remains out of scope.

## Functional traceability

| ID | Requirement | Priority | Phase | Acceptance evidence |
|---|---|---|---|---|
| FR-01 | Join/cancel cancellation-seat queue with restaurant/date/time/party | VH | 3 | Request persists; cancel removes eligibility |
| FR-02 | View requested conditions and queue state | H | 3 | Reload preserves request and state |
| FR-03 | Offer slot to earliest eligible applicant only | VH | 3 | Older mismatched applicant is skipped; only one offer |
| FR-04 | Notify offer/deadline and accept or decline | VH | 3-4 | Owner can book; non-owner cannot |
| FR-05 | Pass to next eligible customer after decline/expiry | VH | 3-4 | Exactly one successor; pending payment exception respected |
| FR-06 | Manager sees allocation and rebooking outcome | H | 3-4 | Manager view uses same slot/reservation records |
| FR-07 | Show active ticket, party and current waiting state on restaurant detail | VH | 2 | Visible before clicking the CTA |
| FR-08 | Replace registration CTA with View My Waiting | VH | 2 | Revisiting opens existing ticket, never duplicate registration |
| FR-09 | Common weekday/time-slot statistics at every waiting-enabled fixture | H | 1 | Two waiting restaurants use same component |
| FR-10 | Show period/update time and insufficient-data state | H | 1 | Missing sample is not displayed as zero |
| FR-11 | Customer submits/updates ETA from reservation | VH | 5 | Manager sees request against exact reservation |
| FR-12 | Manager retains, proposes time, or cannot retain | VH | 5 | All three branches accessible |
| FR-13 | Customer views response and accepts/rejects proposed time | VH | 5 | Only acceptance updates reservation time |
| FR-14 | Both roles see history and final agreement | H | 5 | Same IDs/timestamps/outcome across roles |

## Quality traceability

| ID | Constraint | Evidence / limitation |
|---|---|---|
| QR-01 | Recognize waiting state without additional action | Detail state visible immediately on page load |
| QR-02 | Clearly distinguish offer/booking and pending/approved lateness | State-specific copy; never imply reporting is approval |
| QR-03 | Correct condition matching and FIFO allocation | Domain checks for mismatched restaurant/date/time/party |
| QR-04 | No duplicate offer, reservation or charge | Single-writer commands, operation IDs, deadline checks |
| QR-05 | Consistent customer/manager states; remove ended ticket banner | One store, re-read on navigation/focus, storage notifications |
| QR-06 | Restore committed results after interruption | Persist state and operation ledger; retry is idempotent |
| QR-07 | Proposed target: 95% status updates within 3 seconds | Responsive local update, not a production load benchmark |
| QR-08 | Proposed target: next offer and notification request within 5 seconds | Deterministic reconcile; excludes unresolved payments |
| QR-09 | Proposed target: 95% statistics views within 2 seconds | Local fixture render, no claim of measured live-service performance |

The five-second figure measures creation and sending request, not guaranteed message
arrival. Security in this prototype is only role/ownership validation in local code;
all browser data can be inspected and is not secure authorization.

## Required terminology

Use 'cancellation-seat request/offer' for future reservation vacancies and 'waiting
ticket' for the current restaurant queue. Do not call both simply 'waiting' internally.
'View My Waiting' is the English meaning of the Korean detail CTA. Do not invent a
second registration flow when a ticket is active. Estimated wait is optional mock data,
clearly approximate; current queue position and party size are the required core.
