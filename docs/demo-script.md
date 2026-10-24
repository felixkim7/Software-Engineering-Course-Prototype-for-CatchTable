# Presentation Demo Script

Suggested prototype segment: about 2-3 minutes within the full 5-10 minute presentation.
This timing is a rehearsal suggestion, not a separate course requirement.
Use the hub to prepare each scenario, then keep developer controls off product screens.

## Before recording

1. Start HTTP server; open the same host/port used for rehearsal.
2. Reset and confirm dates, local assets and restaurant names.
3. Use one active writer tab and role switching; close obsolete editing tabs.
4. Set customer viewport to 390x844 and manager viewport to a readable desktop width.
5. Disable unintended fault flags. Never enter actual card details.

## A. Waiting visibility and statistics (40-50 seconds)

- Select clean-start and r1; show weekday/time-slot statistics.
- Register a party, leave the restaurant, and reopen it from discovery.
- Point out the active status and changed bottom action before clicking anything.
- On the hub, add one walk-in party for 월화식당 ("월화식당 마포본점 +1팀"): a fresh registration is last
  in line, and postponing needs someone behind it (otherwise the app explains it cannot postpone).
- Open View My Waiting, postpone once, then switch manager to show the updated queue.
- Shortcut if time is tight: the waiting-active preset already places 김하늘 3rd at 월화식당.
- Briefly open r2 to show the collecting-data state instead of a missing statistics section.

## B. Cancellation-seat priority booking (60-80 seconds)

- Select cancellation-ready as c1; show requested conditions.
- Release a slot using presenter controls; return to customer inbox/offer.
- Show exclusive offer and remaining time, then confirm via demo payment.
- Show customer booking confirmation and manager rebooking status.
- Optional short branch: reset, decline an offer, switch to c2 and show the successor.
  Do not try to demonstrate every exception during the main recording.

## C. Late-arrival coordination (40-50 seconds)

- Select clean-start, open 마이다이닝 → the 월화식당 booking (rv-1, tomorrow 18:00) and report an ETA.
  (late-ready starts one step later, with an 18:30 ETA already sent.)
- Show awaiting response. Switch manager and propose a different arrival time.
- Switch customer, accept, then show the shared updated reservation/history.
- Explain that reporting alone never approved the delay.

## Rehearsal record (2026-10-23)

Two consecutive scripted runs of A, B and C through the hub and visible UI pass from presets with no
manual cleanup (customer 390x844, manager 1440x900, no console errors): A takes 20 presenter actions, B 10, C 13. At about 2 seconds per
action plus narration, A is the one at risk of running over 50 seconds; use the waiting-active
shortcut for postponement if needed. Spoken timing has not been measured.

## Recovery if rehearsal goes wrong

Return to hub, select the coherent preset and restart that theme. Do not mutate storage by
hand. Resolve pending mock payment through its operation control, or reset intentionally.
Use screenshots as recording backup only after their states have actually been exercised.
