# Design System and Reference Workflow

## Visual intent

Recognizably CatchTable-like, restrained, mobile-first customer UI: white backgrounds,
orange primary actions, dark text, light neutral dividers, restaurant imagery, familiar
bottom sheets and sticky actions. The manager workspace is a clean desktop table/detail
layout with the same brand palette. Do not reuse Kakao yellow, gift assets or gift terminology.

## References

Read `reference-screens/README.md` and `visual-spec.md` before building a screen.
If a reference exists, inspect it and list elements from top to bottom, then record
measured/estimated tokens in visual-spec.md. Do not claim pixel-level matching without a reference.
Screenshot layout guides appearance, requirements guide improved functionality.
The As-Is unchanged registration button is evidence of the problem, not the target behavior.

Do not crop entire screenshot pages into the app. Build HTML components. Use supplied
logo/photo assets or approved crops only for individual visual assets. Remove private account
information from any presentation capture. No screenshot files are included in this kit.

## Layout

Customer: 390px reference viewport, fluid 360px to 430px, centered phone-width content on
large displays. No decorative phone hardware required. Sticky bottom CTA has safe-area and
content padding; it must not cover the last row. Manager: useful at 1024px and 1440px widths,
with horizontal scrolling confined to necessary data tables rather than the whole page.
Use local fallback fonts. A missing logo should use a plain text brand mark, not a fabricated logo.

## Components

Page header/back action, tabs, restaurant card, statistics weekday/time selector,
active waiting status card, status badge, bottom action bar, bottom sheet, confirmation
modal, input validation message, toast/live region, notification row, reservation card,
manager table, empty/loading/error state, and a compact chronological coordination history.
Do not build all components up front: add domain-specific ones in their phases.

## Accessibility and content

Color is never the only status cue. Use text + optional icon, 44px minimum touch targets,
visible focus, labels, contrast at least 4.5:1 for normal text, reduced-motion support.
Trap focus in modal dialogs, Escape to close where safe, restore focus to triggering control.
Announce a meaningful state change; do not announce a countdown every second.
Clearly distinguish approximate waiting estimates, historical medians and current queue position.
No 'FR-03', 'mock API', debug control, slide-style takeaway banner or engineering footnote
in the normal customer/manager flow. Keep a mock-payment notice where it informs user choice.

## Phase visual review

Compare at the same viewport, inspect typography/spacing/alignment/sticky regions and
state variants, then record reference filename, built route, differences and verification
status in PROGRESS. Fix layout defects before adding decorative animations.
