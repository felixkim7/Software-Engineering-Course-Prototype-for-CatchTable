# Visual Spec

Revised in Phase 0 (2026-10-23) from the 14 app screenshots in `reference-screens/`.
Status legend:
- **Measured**: pixel-sampled color from a JPEG capture (compression noise of about ±2 per channel).
- **Estimated**: size measured in raw pixels and mapped by 390/1080 (±1-2 px).
- **Assumption**: not observable in the references.
- **Deviation**: intentionally differs from the reference, with the reason stated.

Implemented tokens live in `prototype/assets/css/tokens.css`. Values below that are not yet
in that file are recorded for the phase that first needs them.

## Color

| Token | Value | Status | Evidence |
|---|---|---|---|
| brand | #FF3D00 | Measured | CTA fill (183123, 183234), user logo.svg fill |
| primary (button fill) | #DD3500 | Deviation | White on #FF3D00 is 3.55:1; design-system.md requires 4.5:1 for normal text. #DD3500 gives 4.58:1. Brand orange kept for logo, icons and large numerals (3:1 large-text rule) |
| primary-text (small orange text) | #C93000 | Deviation | Badge text measured #F83F06 on #FFF0EB is 3.32:1; #C93000 gives 4.84:1 |
| brand-soft | #FFF0EB | Measured | "매장" badge background (183200) |
| danger | #DC1B1C | Measured | "네, 취소할게요" fill (183450); white text 4.98:1 |
| ink | #1E212A | Measured | Active tab underline (161246, 183200) |
| text | #111111 | Estimated | Darkest glyph pixels #000000-#212121 |
| text-secondary | #656565 | Measured | Descriptions, notice text, sheet labels (consistent in 4 screens); 5.83:1 |
| text-tertiary | #767676 | Deviation | Timestamp grey #B6BABB (1.96:1) and inactive tab #82878B (3.63:1) fail; lightest passing grey used |
| text-disabled | #A9A9A9 | Measured | Disabled CTA label (183200); inactive control, exempt from contrast |
| link | #426396 | Measured | "위치" link (183200) |
| info-blue | #407FAB | Measured | Registration sheet info text (183410); not yet implemented |
| background | #FFFFFF | Measured | |
| surface-muted | #F7F8FA | Measured | My-waiting band and info box (183416); notice panel #F9F9F9 treated as same |
| surface-disabled | #F4F4F4 | Measured | Disabled CTA fill (183200) |
| chip | #F3F4F6 (text #626F78) | Measured | Feature chips (183200); 4.69:1 |
| segmented-bg | #EAEFF3 | Measured | 예약/웨이팅 control; not yet implemented |
| border | #E4E4E7 | Measured | Outlined buttons #E4E4E4 / #DEDFE3, list card #E9E9EB |
| divider / section band | #F0F0F0 | Measured | Card border, 8 px section band (183234) |
| toast / tooltip | #474747 | Measured | Tooltip (183410); used for toast |
| star | #F5C618 | Measured | Rating star; not yet implemented |
| scrim | rgb(0 0 0 / 0.6) | Measured | White under scrim renders #666666 (183450) |
| focus ring | ink, 2 px, 2 px offset | Assumption | Focus states are not visible in touch screenshots |
| warning bg / border | #FFF8E1 / #F0C36D | Assumption | Presenter hub storage banner only; not an app element |

## Typography

| Role | Value | Status |
|---|---|---|
| font stack | "Pretendard Variable", "Noto Sans KR", "Apple SD Gothic Neo", "Malgun Gothic", system-ui, sans-serif | Assumption: official web preloads Pretendard; not bundled (no CDN, local files only). Static "Pretendard" omitted because this machine has only its Regular weight, which would synthesize bold |
| caption / chip | 12px | Estimated |
| body-sm | 14px | Estimated (descriptions) |
| body | 15px / 1.5 | Estimated (meta rows) |
| button | 16px, 600 | Estimated (tabs, outlined buttons) |
| cta | 17px, 700 | Estimated (CTA labels) |
| header | 18px, 700 | Estimated (back-arrow page titles) |
| section | 20px / 1.4, 700 | Estimated (confirm-screen question, section titles) |
| title | 24px / 1.3, 700 | Estimated (restaurant name) |
| display | 32px, 700 | Estimated ("3번째" numeral) |

## Size, spacing and shape

| Token | Value | Status |
|---|---|---|
| side gutter | 20px | Estimated (54 raw px) |
| section band | 8px | Estimated (21 raw px) |
| spacing scale | 4, 8, 12, 16, 20, 24, 32px | Assumption, consistent with gutter |
| control height | 48px | Estimated CTA 44-46 px at the 390 mapping (47-48 dp at a typical 2.625 density); 48 kept for touch comfort |
| header height | 56px | Assumption |
| radius-sm | 4px | Estimated (chips) |
| radius-md | 8px | Estimated (CTA, outlined buttons, list cards) |
| radius-lg | 12px | Estimated (ticket card, dialog 10-12) |
| radius-xl | 16px | Estimated (bottom-sheet top corners) |
| radius-pill | 999px | Observed (search field, segmented control, round steppers) |
| card shadow | 0 2px 12px rgb(0 0 0 / 0.06) | Estimated (soft shadow under ticket card) |
| customer width | 390px reference, fluid 360-430px | Project target |

## Component observations

- Page header: back arrow at the left, bold title left-aligned next to it. No bottom border.
- Primary CTA: full width inside 20 px gutters, sticky at the bottom, label centered and bold.
- Bottom action bar on detail: save icon with count, phone icon, then CTA filling the rest.
- Dialog: centered white card inside 20 px gutters, centered bold title, two equal buttons
  (outlined secondary left, filled action right).
- Bottom sheet: white, 16 px top radius, title row with close icon, divider below title.
- Section separation: full-bleed 8 px #F0F0F0 band, not cards with margins.
- Status uses text plus color (orange numerals with units), never color alone.

## Reference inventory

See `reference-screens/README.md` for the per-file inventory and missing references.
Manager screens have no reference: the desktop workspace is an inferred layout using
the same palette.

## Screen comparisons

| Route | Reference | Viewport | Differences | Status |
|---|---|---|---|---|
| customer/ui-sample.html | 183123 (header, CTA), 183450 (dialog), 183416 (card, band) | 390x844, 360x780 | Neutral sample only. Header, gutter, 8 px bands, sticky CTA and centered two-button dialog match the references; CTA orange is darker (deviation above); Noto Sans KR renders instead of Pretendard; dialog radius 12 vs about 10 measured | Checked from headless Edge screenshots 2026-10-23 |
| index.html (hub) | none (presenter tool, not an app screen) | 1440x900, 1024x768 | Inferred layout using the same tokens | Checked from headless Edge screenshots 2026-10-23 |
