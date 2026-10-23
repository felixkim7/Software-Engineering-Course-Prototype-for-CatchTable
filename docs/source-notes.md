# Source Notes and Decision History

Prepared on 2026-10-20 for the CatchTable individual assignment.

Inputs reviewed:
- The user-supplied KakaoTalk Gift CLAUDE.md: structure and incremental workflow only.
- CatchTable_AsIs_Analysis(1).md: purposes, existing functions and four problem statements.
- 2_CatchTable_ToBe_Requirements2.md: actors, goals, FR-01 through FR-14,
  QR-01 through QR-09, and priorities.
- 3_CatchTable_UseCase_Description(2).md: Cancellation-seat Priority Booking,
  main flow, alternatives, pre/postconditions and quality requirements.
- Available project conversation: waiting corrections, use case consolidation,
  presentation design preferences and the user's confirmation that To-Be is done.

This is a synthesis of the available conversation and reviewed documents, not a claim
that every separate chat was retrieved. The package is self-contained for development.

## Decisions that override older drafts

1. Some restaurants already show weekday/time-slot waiting statistics. Expand coverage
   to all waiting-enabled restaurants, with a collecting-data state where necessary.
2. Waiting postponement with a selectable range already exists. Preserve it as baseline.
3. The waiting flaw is restaurant-detail visibility: after registration the page still
   offers registration and reveals the active ticket only after another click.
4. Cancellation-seat allocation is sequential and exclusive, not a broadcast race.
5. Late-arrival reporting must connect customer and manager; it does not guarantee retention.
6. The full model consolidated duplicate late-arrival and calling/entry use cases.
   The working count is 22 after adding restaurant-information management. It is a
   modeling scope, not a demand for 22 implemented screens.
7. Only ONE formal use case description is required for the individual assignment.
   Three prototype demo themes are our recommended implementation scope, not a stated
   three-scenario course requirement.
8. As-Is/To-Be flowcharts were deliberately skipped. Do not recreate them.
9. The user says the To-Be context diagram is completed. Do not schedule its creation.
10. Slides use white/orange, restrained graphics, and no page/footer decorations.
    App layouts must instead follow actual app references. Do not turn the app into slides.
11. Explanatory slide callouts were removed in the design conversation. They are not
    product UI and should not be added as banners. Domain rules still apply internally.
12. 2026-10-23: the user supplied 14 app captures and then asked for maximum visual
    fidelity before Phase 2: home extras, detail extras, booking picker, Pretendard, and
    real restaurant information and photos. The official site's robots.txt forbids
    automated agents, so real data comes only from the user's captures. Unimplemented
    controls stay visible and explain on tap. Fake reviews or menus are never invented.

## Unverified product details

Manager screens, exact real statistics formula, operational limits and current actual
service policies are not verified by this package. Use local mock assumptions marked
in decisions.md. Do not present them as observed real-product behavior.
