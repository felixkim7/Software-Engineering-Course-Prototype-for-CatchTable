# Asset Inventory

The official site's robots.txt forbids automated agents, so nothing here was downloaded
from app.catchtable.co.kr. App imagery is cropped from the user's own captures in
`docs/reference-screens/` (taken 2026-10-16 and 2026-10-23, approved for this use on 2026-10-23).
Online images found while researching missing screens were viewed only and are not in the repo.

> **Copyright note:** restaurant photos, CatchTable's banner and its category/brand
> artwork belong to their owners. They are included for a class prototype. The GitHub
> repository is public, so the user decides whether these files are pushed.

| Asset path | Purpose | Source | Changes | Fallback |
|---|---|---|---|---|
| prototype/assets/images/logo.svg | Brand "C" mark | User-supplied `svg/logo.svg` (also in the user's presentation and capture 161246). Original URL not recorded | None | Plain text brand name |
| prototype/assets/images/home/banner-sushiroad.jpg | Home banner 1 | Crop of 161246, raw (72,475)-(1006,1082) | Baked-in "2 / 20 전체 >" pill removed by row interpolation (the live counter replaces it) | — |
| prototype/assets/images/home/brand-{sushiroad,hotplace,blueribbon}.png | Brand tab icons; Blue Ribbon chip | Crops of 161246 brand-tab row | None | Text label only |
| prototype/assets/images/home/cat-*.png (20) | Category grid icons | 132x132 crops of 161246 grid cells | None (the app's "N" badges are part of the crop) | — |
| prototype/assets/images/restaurants/wolhwa-1..4.jpg | 월화식당 마포본점 photos | Photo viewer captures 171255, 171259, 171302, 171306 | Black viewer margins cropped | Placeholder block |
| prototype/assets/images/restaurants/vivo-2.jpg, vivo-3.jpg | vivo pizza 공덕점 photos | vivo-2: crop of 183200 carousel; vivo-3: photo viewer 171532 | vivo-2 is cut at the screen edge as captured | Placeholder block |
| prototype/assets/images/restaurants/sushiren-1..3.jpg | 스시렌 photos | sushiren-1: 173157 raw (63,239)-(881,745); 2-3: 173303 photo grid | None | Placeholder block |
| prototype/assets/images/restaurants/wolhwa-ribbon-banner.jpg | Blue Ribbon banner on the 월화 홈 tab | 171341 raw (53,3136)-(1027,3343) | None | Omitted |
| prototype/assets/images/menu/wolhwa-01..15.jpg, vivo-01..11.jpg | Menu item thumbnails | 171148 (월화) and 171613 (vivo) menu rows | Square crops | Item without image |
| prototype/assets/images/menu/{wolhwa,vivo}-board-1..3.jpg | 메뉴판 thumbnails | 171148 and 171613 메뉴판 rows | None | Section omitted |
| prototype/assets/images/maps/{wolhwa,vivo,sushiren}.jpg | Static location maps | 171341, 171646, 173324 map areas (966x434) | None | Address text only |
| prototype/assets/images/home/area-*.jpg (8) | 어디로 가시나요? tiles | 170629 area tiles (인기/핫플 badges are part of the crop) | None | Text label |
| prototype/assets/images/home/ribbon-double.png | Blue Ribbon mark in the badge chip and award row | 171054 raw (70,912)-(146,958) | None | Text only |
| prototype/assets/fonts/PretendardVariable.woff2 + OFL.txt | UI typeface | Pretendard v1.3.9, Kil Hyung-jin, SIL Open Font License 1.1, via the npm package mirror on jsDelivr | None | Noto Sans KR, Apple SD Gothic Neo, Malgun Gothic |
| (no file) restaurant placeholder | Missing photos | CSS block with the utensils stroke icon (`ui/icons.js`) | — | — |
| docs/reference-screens/*.jpg | Visual reference only | User's own device captures, 2026-10-16 and 2026-10-23 | None | — |

Do not use remote image URLs or require internet for essential UI. Do not invent official
brand artwork. More photos, menus and store info should come from the capture checklist.
vivo-1.jpg was removed in the 2026-10-23 pass (replaced by the full-screen photo vivo-3).
