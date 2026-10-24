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
| prototype/assets/images/restaurants/{jageun,woowol,mingles,evett}-1.jpg | r7 작은따옴표, r6 우월소곱창, r4 밍글스, r5 Restaurant EVETT card/detail photo (one each) | 170629 raw boxes: jageun (62,4004)-(572,4513), woowol (612,4004)-(1080,4513), mingles (62,6674)-(572,7190), evett (612,6674)-(1080,7190) | None | Placeholder block |
| prototype/assets/images/restaurants/{izakayanamu,dolpanjang,palhyang,madampungcheon,toomutt}-1.jpg | r8-r12 thumbnails (151x151) | 170629 가격대별 BEST list rows, raw x 61-212 at y 5122, 5353, 5584, 5815, 6046 | Inset 8px inside the rounded corners; shown at 76px in the row card and 152px on the detail page (not stretched) | Placeholder block |
| prototype/assets/images/restaurants/{wolhwagogi,hwapo}-1.jpg | r13 월화고기 보라매점, r14 화포식당 한남점 photo | 170629 최근 본 매장과 비슷한 곳 cards: (418,3212)-(738,3450) and (775,3212)-(1026,3450) | Cut above the baked-in bookmark icon; the 리틀에마스 chip in that section (the user's own recently viewed store) was not used | Placeholder block |
| prototype/assets/images/my/{badges.png,cake.png,benefit-banner.jpg} | MY tab: 캐치미식가 badge strip, 생일·기념일 cake, benefit banner | 220751 (app artwork only; the account name, profile, review and review photo were not cropped) | None | Text only |
| prototype/assets/fonts/PretendardVariable.woff2 + OFL.txt | UI typeface | Pretendard v1.3.9, Kil Hyung-jin, SIL Open Font License 1.1, via the npm package mirror on jsDelivr | None | Noto Sans KR, Apple SD Gothic Neo, Malgun Gothic |
| (no file) restaurant placeholder | Missing photos | CSS block with the utensils stroke icon (`ui/icons.js`) | — | — |
| docs/reference-screens/*.jpg | Visual reference only | User's own device captures, 2026-10-16 and 2026-10-23 | None | — |

## Restaurant data from public web pages (r4-r14)

Name, area, cuisine, rating, Michelin label (r4, r5), review count (r8-r14, as shown in the capture)
and photo come from capture 170629. The rest was read on public pages on 2026-10-23 and transcribed
by hand; no page was scraped and no image was downloaded. No photo licence allowing reuse was found,
so photos are only the capture crops above. Fields that no source states (save counts, review
distributions and bodies, AI summary, and for r9/r11 address, phone, hours and menu) stay `null`
and are omitted from the UI. Booking, waiting, deposit and availability settings are mock values.

| Restaurant | Sources | Used for |
|---|---|---|
| r4 밍글스 | https://polle.com/place/4sA4kB | Address, phone, lunch/dinner course prices, 발렛, 룸, 노키즈존 |
| r5 Restaurant EVETT | https://restaurantevett.com ; https://ktriptips.com/kor/food/3108201 ; https://thebestrestaurantsguide.com/restaurants/evett | Address and phone (official site); hours, closed Sun/Mon, free parking, lunch/dinner courses without prices; concept and 전통주 pairing |
| r6 우월소곱창 신도림본점 | https://polle.com/place/4glU5R | Address, phone, menu and prices, 주차, 포장, 배달 |
| r7 작은따옴표 도림천점 | https://polle.com/place/5885fH | Address, menu and prices, 카페/바, 간이주차, 룸, 반려견 동반 |
| r8 이자카야나무 사당역2호점 | https://www.diningcode.com/profile.php?rid=pgiuO1oI4Hvc | Address, phone, hours 15:30-05:00, menu and prices |
| r9 돌판장 양재 | none found (only the 삼각지 branch and blog summaries) | Capture only: name, description, rating, count, cuisine, area; address, phone, hours and menu are null |
| r10 팔향 | https://www.diningcode.com/profile.php?rid=p7xxJR45Y1Um ; https://polle.com/place/3oGDiQ | Address, phone, hours with break time, Sunday closing, parking/valet/rooms, menu and prices, 북경오리 2-day pre-order |
| r11 마담풍천 보라매 | none found (other branches only) | Capture only, as r9 |
| r12 투머트 | https://www.diningcode.com/profile.php?rid=qwxobxv0z4uY ; https://www.siksinhot.com/P/1482181 | Address, phone, hours, Monday closing, corkage, menu and prices |
| r13 월화고기 보라매점 | https://www.diningcode.com/profile.php?rid=CUzckRKaC0Gs ; https://www.bluer.co.kr/restaurants/31007 | Address, phone (Blue Ribbon lists 02-888-7592 instead), hours, facilities, menu and prices |
| r14 화포식당 한남점 | http://hwapo-hannam.jalib.site/ (official page, as indexed; it returned 404 when fetched) ; https://wanderboat.ai (restaurant page) | Address, phone, open 24 hours; 프리미엄 완자 부대찌개 without a price, 사리 prices |

Do not use remote image URLs or require internet for essential UI. Do not invent official
brand artwork. More photos, menus and store info should come from the capture checklist.
vivo-1.jpg was removed in the 2026-10-23 pass (replaced by the full-screen photo vivo-3).
