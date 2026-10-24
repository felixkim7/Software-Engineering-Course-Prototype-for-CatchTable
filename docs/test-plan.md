# Verification Plan

Record actual outcomes in PROGRESS. Do not call a checklist passed unless executed.
All cases use mock fixtures, HTTP serving and one active writer. Start from the relevant
preset. Use presenter controls rather than hand-editing localStorage.

## Foundation / discovery

| ID | Action | Expected |
|---|---|---|
| F01 | Start server, open hub and implemented routes | No console errors or missing assets |
| F02 | Reset, switch role, reload | Coherent dates and identities; state persists |
| F03 | Navigate with invalid restaurant/reservation ID | Friendly not-found with working back action |
| F04 | Open r1/r2/r3 statistics | Sufficient / collecting / not-applicable states respectively |
| F05 | Select sparse time slot and change weekday | Correct sample/period/unit; missing values never zero |
| F06 | Deny storage or insert corrupt test snapshot | Explicit recovery, no false persistence claim |

## On-site waiting

| ID | Action | Expected |
|---|---|---|
| W01 | Register, leave detail, revisit, reload | Active status/party/position and View My Waiting visible |
| W02 | Double-click registration or replay same command | One active ticket only |
| W03 | Open detail for another customer/restaurant | No leaked active ticket |
| W04 | Postpone to a chosen later place (next one to last) | Legal new order; manager list agrees |
| W05 | Exhaust postpone limit or try after call | Action disallowed with meaningful message |
| W06 | Cancel, revisit detail | No stale active banner; CTA follows registration availability |
| W07 | Manager calls then admits | Customer sees call; admission makes ticket terminal |
| W08 | Close new registrations with active ticket | Existing customer's View My Waiting stays available |

## Cancellation queue

| ID | Action | Expected |
|---|---|---|
| Q01 | Release fixture with older mismatched c3 and eligible c1/c2 | Earliest matching applicant only |
| Q02 | Repeat release/reconcile | No second live offer for same slot |
| Q03 | Switch to non-owner and open offer URL | No access to confirmation; no state change |
| Q04 | Reload offer after advancing clock | Same absolute deadline, not a new full countdown |
| Q05 | Decline or advance beyond expiry | One successor, previous owner cannot book |
| Q06 | Confirm exactly at expiry | Rejected because now >= expiresAt |
| Q07 | Remove all eligible requests, release | No allocation; available slot shown |
| Q08 | Fail offer notification | Offer remains in app; no deadline extension; retry available |

## Checkout and reliability

| ID | Action | Expected |
|---|---|---|
| P01 | Confirm valid deposited offer | One payment, one booking, both role views agree |
| P02 | Double-click confirm/replay operation | Same result; no duplicate charge/reservation |
| P03 | Force payment fail, retry before expiry | No initial booking/charge; retry may succeed |
| P04 | Zero-deposit fixture | Reservation succeeds without payment operation |
| P05 | Force unknown result, expire original offer | Held slot, no successor; payment-checking screen |
| P06 | Reload unknown state then resolve success | Existing operation finalizes exactly once |
| P07 | Resolve unknown as known failure after deadline | Safe release and exactly one successor |
| P08 | Fail reservation commit after charge, retry | Existing charge reused; one reservation |
| P09 | Compensate unrecoverable commit failure | Refund recorded before slot is released |
| P10 | Fail confirmation notification | Booking remains confirmed; inbox/list remain consistent |
| P11 | Reset while delayed payment callback is in flight | Old epoch callback cannot change new fixtures |
| P12 | Refresh/back/forward during confirmation | Final state restored, no re-charge |

## Late arrival

| ID | Action | Expected |
|---|---|---|
| L01 | Submit ETA | SUBMITTED, not automatically retained |
| L02 | Manager retains | Explicit retained response in both histories |
| L03 | Manager proposes, customer accepts | currentTime changes; originalTime retained |
| L04 | Customer rejects proposal | Original currentTime preserved; rejection recorded |
| L05 | Manager cannot retain or does not respond | No auto-cancel/refund; clear status and next-step guidance |
| L06 | Update ETA, then accept old proposal | Old version rejected; new pending record preserved |
| L07 | Wrong customer/manager submits action | Ownership rejection and no mutation |
| L08 | Reload and role switch after final agreement | Same final time and history |

## Presentation and accessibility

- Check all visible navigation; no dead prominent CTA or broken future route.
- Check mobile at 390x844 and 360px; manager at 1440x900 and 1024px.
- Keyboard tab order, Enter/Space actions, Escape where safe, focus trap/return.
- Labels, error association, non-color status cues and contrast.
- Countdown does not flood screen-reader live announcements.
- Sticky footer does not obscure content; long restaurant names and empty states fit.
- Local imagery/font fallbacks work without external network while local server remains on.
- Repeat the demo script from reset twice with no manual data cleanup.

## Small automated checks

Use a dependency-free browser test page or equivalent lightweight JS runner for matching,
FIFO, deadline boundaries, legal transitions, idempotency, stale callback rejection and
coordination version checks. These domain checks are worthwhile; avoid snapshot tests
that merely mirror markup or large test frameworks for this small prototype.
Local timing checks are not proof of production QR performance or concurrency guarantees.
