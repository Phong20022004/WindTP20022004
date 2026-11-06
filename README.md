# WINDTP Super-App

Super-app tiếng Việt (học ngoại ngữ, WIND Shop, giải trí, tiện ích, cộng đồng, ví Xu).
Mã nguồn được tách từ một file HTML 6 MB thành nhiều file nhỏ; **giao diện và hành vi giữ nguyên** (đã đối chiếu từng pixel, xem mục "Kiểm tra").

## Chạy / build

```bash
node scripts/build.mjs        # → dist/index.html (một file duy nhất, mở trực tiếp bằng trình duyệt)
node scripts/build.mjs --check  # build trong bộ nhớ, in kích thước + SHA-256
```

Chỉ cần Node ≥ 18, không cần cài thêm gói nào. `dist/index.html` là file để triển khai.

## Cấu trúc

```
src/
├─ manifest.json            Thứ tự lắp ráp trang (QUAN TRỌNG: thứ tự CSS/JS = thứ tự nạp)
├─ html/                    Khung trang: head, header, tìm kiếm, vùng chính, thanh điều hướng, modal host
├─ css/                     26 file CSS, đánh số theo thứ tự nạp (patch sau đè patch trước)
├─ js/
│  ├─ app/                  Logic chính của app (48 mảnh, cùng nằm trong một IIFE)
│  ├─ extras/               Các script nhỏ độc lập (hiệu ứng, công cụ từ vựng, ...)
│  └─ lessons/seoul1a-bai1/ Bài học Seoul Korean 1A · Bài 1 (flashcard, trắc nghiệm, nghe, thách đấu, leo núi)
├─ game/                    Game bàn bài "Quần hùng hội tụ · Long Tranh Hổ Đấu" (một trang HTML riêng chạy trong iframe)
│  ├─ manifest.json         Thứ tự lắp ráp của game
│  ├─ html/  css/  js/
└─ assets/images/           Ảnh (avatar, gian hàng, bài học, game) – trước đây nhúng base64 trong code
scripts/build.mjs           Công cụ build
dist/index.html             Kết quả build
```

## Cách hoạt động của build

- `manifest.json` liệt kê các mảnh theo đúng thứ tự; build ghép lại thành một file HTML.
- Trong code, ảnh được viết là `@@asset:avatars/z-leo-nam.jpg@@`; khi build sẽ đổi thành data URI từ `src/assets/images/`.
  Muốn đổi ảnh: thay file trong `src/assets/images/` (giữ tên) rồi build lại. Ảnh mới: thêm file rồi ghi `@@asset:thu-muc/ten.jpg@@` vào code.
- Game bàn bài được nhúng vào app dưới dạng `iframe.srcdoc` (để dùng chung localStorage với app), nên nó cũng được lắp từ `src/game/` rồi đóng gói lại khi build.

## Quy tắc khi sửa

1. **Mỗi file có chú thích đầu file** `/*@file ...*/` cho biết nó làm gì. Dòng bắt đầu bằng ⚠ nghĩa là file là **một mảnh của một khối lớn hơn** (ví dụ object `actions`, hàm `initApp`, IIFE của patch v28) – file đó không chạy độc lập, phải giữ nguyên thứ tự trong manifest.
2. Toàn bộ `js/app/*` dùng chung **một phạm vi (scope)** vì được bọc trong một IIFE; hàm/biến ở file trước dùng được ở file sau. Đừng đổi thứ tự file.
3. Thêm file mới: tạo file trong thư mục tương ứng rồi thêm vào `manifest.json` (mảng `script` hoặc `style`) đúng vị trí cần nạp.
4. `css/01-tailwind-compiled.css` là Tailwind đã biên dịch sẵn (file sinh tự động). Dùng class Tailwind chưa có trong file này thì phải biên dịch lại Tailwind; các file CSS còn lại sửa tay bình thường.
5. Patch CSS/JS có tên phiên bản (v5, v9, v40, ...) được giữ nguyên thứ tự lịch sử vì patch sau ghi đè patch trước. Dọn gộp patch nên làm riêng, từng bước, có so sánh giao diện.

## Tìm nhanh

### `src/js/app/`
| File | Nội dung |
|---|---|
| `01-data-languages.js` | Dữ liệu 7 ngôn ngữ (LANGUAGES): từ vựng, ngữ pháp, hội thoại, câu hỏi mẫu. |
| `02-data-config-courses-seeds.js` | Tiền tệ, mức thưởng, gói khóa học/sản phẩm, dữ liệu mẫu tin đăng và bài cộng đồng. |
| `03-audio-and-lofi-radio.js` | Âm thanh của app và Lofi Chill Radio (nhạc lofi do app tự tạo bằng WebAudio). |
| `04-util.js` | Hàm tiện ích dùng chung ($, esc, norm, ...). |
| `05-store-state-and-rewards.js` | Trạng thái người dùng (state), lưu/đọc localStorage, điểm danh, nhiệm vụ ngày, thưởng Xu. |
| `06-cosmetics-avatars-frames-realms.js` | Avatar, khung avatar, cảnh giới tu tiên; mua và trang bị. (Ảnh avatar nằm ở assets/images/avatars/) |
| `07-admin-identity.js` | Danh tính riêng của máy chủ (BigBoss): avatar logo WINDTP + khung Hoàng Kim Thiên Đế. |
| `08-ui-helpers.js` | Trạng thái giao diện (ui) và vài hàm dựng UI nhỏ. |
| `09-views-home-learn-library.js` | Giao diện các tab: trang chủ, Học, thư viện sách. |
| `10-daily-review-exam.js` | v15-5: đề ôn tập theo ngày (chu kỳ 365 ngày, mỗi ngày một đề). |
| `11-book-lessons-list.js` | Danh sách bài của từng quyển (BOOK_LESSONS: Seoul Korean 1A/1B) và màn danh sách bài. |
| `12-hanzi-stroke-pen.js` | Bút thuận Hán tự (tiếng Trung/Nhật): xem nét, ảnh động, luyện viết. |
| `13-shop-art-and-stalls.js` | Dữ liệu phụ của gian hàng, hình minh họa SVG sản phẩm, avatar gian hàng. (Ảnh: assets/images/shop/) |
| `14-shop-views.js` | Lọc/sắp xếp sản phẩm, gợi ý, lưới Xu và trang WIND Shop. |
| `15-entertainment.js` | Tab Giải trí: kết quả trận và danh sách game. |
| `16-utilities-and-tasks.js` | Tab Tiện ích: danh mục, tin đăng, thẻ nhiệm vụ. |
| `17-community-and-leaderboard.js` | Tab Cộng đồng: bài đăng, bảng xếp hạng. |
| `18-notices-search-tabs.js` | Thông báo, tìm kiếm toàn app và chuyển tab (renderTab/showTab). |
| `19-modals.js` | Các hộp thoại chung của app. |
| `20-payment-modals.js` | v5: chi tiết sản phẩm, thanh toán thống nhất, nạp Xu, liên hệ Facebook. |
| `21-listing-and-moderation-modals.js` | Hộp thoại đăng tin, kiểm duyệt và danh mục tự tạo. |
| `22-tool-modals.js` | Hộp thoại công cụ: Pomodoro, nhắc việc, tính GPA. |
| `23-settings-and-profile-modals.js` | Hộp thoại Cài đặt và Hồ sơ (avatar/khung). |
| `24-app-navigation.js` | Điều hướng tab, theme sáng/tối, đóng panel. |
| `25-app-banner.js` | Banner trang chủ và đổi banner. |
| `26-app-quiz-practice-tools.js` | Tạo câu hỏi, luyện tập, game từ vựng, tải tài liệu, mở công cụ, nạp Xu. |
| `27-actions-navigation.js` | ⚠ Mảnh 1/5 của object `actions` (bảng xử lý data-action): điều hướng, banner, cảnh giới. |
| `28-actions-learning.js` | ⚠ Mảnh 2/5 của object `actions`: học, từ vựng, ngữ pháp, hội thoại, khóa học, quiz. |
| `29-actions-shop-orders-payment.js` | ⚠ Mảnh 3/5 của object `actions`: cửa hàng, giỏ hàng, đơn hàng, admin, thanh toán, radio. |
| `30-actions-utilities-community.js` | ⚠ Mảnh 4/5 của object `actions`: tiện ích, tin đăng, kiểm duyệt, nhiệm vụ, tài liệu, bài đăng. |
| `31-actions-wallet-profile.js` | ⚠ Mảnh 5/5 của object `actions`: tiền tệ, giới thiệu, nạp Xu, hồ sơ, vật phẩm; đóng object `actions`. |
| `32-events-and-init.js` | Xử lý input/change, gắn sự kiện, vuốt banner và hàm khởi động init(). |
| `33-admin-panel.js` | Quản trị BigBoss: ID, tên, mật mã, duyệt đơn. |
| `34-v6-user-id-orders.js` | v6: ID người dùng, thông tin liên hệ, đơn hàng/tín dụng/nhiệm vụ cho admin. |
| `35-v7-friend-search.js` | v7: đơn hàng, tìm bạn, minh chứng nhiệm vụ đặc biệt. |
| `36-v10-geo-search.js` | v10: tìm theo quốc gia (EN/VI) và vùng Bắc/Trung/Nam/Đông/Tây. |
| `37-v11-social-hub.js` | v11: logo, social hub, form đăng tin, tự động dark. |
| `38-v12-misc.js` | v12: các chỉnh sửa bổ sung. |
| `39-v16-admin-edit.js` | v16: máy chủ (admin) sửa nhiệm vụ và sản phẩm đã đăng. |
| `40-v17-effects-trial.js` | v17: hiệu ứng máy chủ, nhiệm vụ chia sẻ Facebook, học thử. |
| `41-social-layer.js` | Lớp xã hội WINDTP: Premium, bạn bè, trạng thái hoạt động, chọc, thách đấu. |
| `42-players-and-friend-requests.js` | v48: dữ liệu người chơi dùng chung (game ↔ WINDTP) và lời mời kết bạn. |
| `43-premium-and-poke.js` | Premium/khóa học (mua, cấp, modal) và chọc bạn. |
| `44-challenges.js` | Thách đấu: chấm điểm, mô phỏng đối thủ, đối tượng CH. |
| `45-social-tick-and-chat.js` | Nhịp hoạt động xã hội, dữ liệu và modal chat, gửi tin. |
| `46-chat-and-friends-cards.js` | Tạo nhóm chat, thẻ chat/bạn bè/thách đấu, làm mới danh sách bạn. |
| `47-content-lock.js` | Khóa nội dung cho đến khi người dùng mua khóa học/Premium. |
| `48-card-game-launcher.js` | Mở game bàn bài "Quần hùng hội tụ · Long Tranh Hổ Đấu" (iframe) và xử lý link phòng; cuối file đóng IIFE chính. |

### `src/js/lessons/seoul1a-bai1/`
| File | Nội dung |
|---|---|
| `01-shell-css-and-assets.js` | ⚠ Mở IIFE bài học và hàm initApp() (đóng ở 12-tabs-and-open-close.js). Chứa khung Shadow DOM + CSS màn học, ảnh nền và đường leo núi. |
| `02-vocabulary-and-sentences.js` | Từ vựng (W) và câu mẫu (S) của Bài 1. |
| `03-state-and-speech.js` | Biến trạng thái, chọn giọng đọc tiếng Hàn. |
| `04-hangul-keyboard.js` | Bàn phím Hangul ảo kiểu 2벌식 (ghép jamo). |
| `05-sound-effects.js` | Hiệu ứng và âm thanh đúng/sai, âm thanh màn leo núi. |
| `06-question-engine.js` | Bộ câu hỏi (recog/mc/type/fill/listen) và phiên luyện tập. |
| `07-exam-seed-and-duel-setup.js` | Đề thi cố định theo seed (hai người cùng đề) và biến thách đấu. |
| `08-hoa-son-banner.js` | Banner Hoa Sơn Luận Kiếm (ảnh: assets/images/lessons/seoul1a-bai1/). |
| `09-friend-duel.js` | Thách đấu bạn bè: sảnh, chơi nhóm/đơn, kết quả. |
| `10-modes-flash-quiz-listen-match.js` | ⚠ Mở object `modes` (đóng ở 11-mode-everest.js): flashcard, trắc nghiệm, gõ, đọc hiểu, luyện nghe, ghép cặp, thách đấu. |
| `11-mode-everest.js` | ⚠ Chế độ game leo núi Everest — nằm trong object `modes`, đóng object ở cuối file. |
| `12-tabs-and-open-close.js` | Thanh tab, openLesson()/closeLesson(); đóng initApp() và IIFE. |

### `src/game/js/`
| File | Nội dung |
|---|---|
| `01-need-chips.js` | Cảnh báo khi hết chip. |
| `02-chip-colors.js` | Màu chip theo mệnh giá. |
| `03-tl-drop.js` | Thả bài Tiến lên. |
| `04a-core-and-tien-len-engine.js` | Lõi game: bộ bài, chip, cấu hình bàn G, engine Tiến lên cơ bản. |
| `04b-phom.js` | Game Phỏm. |
| `04c-chess-xiangqi.js` | Engine cờ vua / cờ tướng (bản đầu). |
| `04d-poker.js` | Poker (bản đầu). |
| `04e-tien-len-ui-effects.js` | Giao diện Tiến lên, hiệu ứng ném đồ, kết thúc ván. |
| `04f-sound-3-cay-lieng-poker-config.js` | Âm thanh, Ba cây, Liêng, bảng cấu hình bàn, Poker (bản 2). |
| `05-patch-v5-roulette.js` | Patch v5. |
| `06-patch-3-cay-chuong.js` | Patch: Ba cây Chương miền Bắc theo đúng luật. |
| `07-chess-xiangqi-v2.js` | Cờ vua + cờ tướng (v2). |
| `08-patch-v7.js` | Patch v7. |
| `09-patch-v8.js` | Patch v8. |
| `10-wind-bridge.js` | Cổng duy nhất tới app WINDTP (trang cha); trả null khi game chạy độc lập. |
| `11-patch-v9-js.js` | Patch v9: thời gian máy nghĩ. |
| `12-patch-v10-js.js` | Patch v10: hiệu ứng chặt chồng. |
| `13-patch-v13-js.js` | Patch v13. |
| `14-patch-v14-js.js` | Patch v14: banner Thanh Long - Bạch Hổ. |
| `15-patch-v15-js.js` | Patch v15: trạng thái đang chơi. |
| `16-patch-v16-js.js` | Patch v16: đút 3 bích, lủng, lật bài thối. |
| `17a-lobby-rooms-and-invites.js` | ⚠ Mở IIFE patch v28 (đóng ở 17d): sảnh chọn bàn, mời bạn, tạo bàn. |
| `17b-age-gate-and-chip-shop.js` | ⚠ Trong IIFE patch v28: giới hạn tuổi, thời gian chơi, khu mua Chips. |
| `17c-ready-and-spectator.js` | ⚠ Trong IIFE patch v28: nút SẴN SÀNG, khán giả. |
| `17d-table-panel-and-host.js` | ⚠ Trong IIFE patch v28: bảng bàn, chủ bàn, onEnd; đóng IIFE ở cuối file. |
| `18-patch-v39-js.js` | Patch v39: người xem. |
| `19-patch-v45-js.js` | Patch v45. |
| `20-patch-v40-js.js` | Patch v40: khung người chơi (avatar, cảnh giới, giới tính, tuổi). |
| `21-chips-token-replace.js` | Đổi chữ "chip" thành WIND Coin trong giao diện. |
| `22-v41-js.js` | v41. |
| `23-v42-leave-js.js` | v42: rời bàn giữa ván bị xử thua. |
| `24-v43-imm-js.js` | v43. |

## Kiểm tra

- Build ngay sau khi tách (chưa thêm chú thích/định dạng) cho ra file **trùng từng byte** với file gốc `windtp_seoul1a_bai1-2_v57.html`.
- Sau khi thêm chú thích đầu file và ngắt dòng cho hai dòng CSS quá dài (Tailwind và CSS của màn học Bài 1), phần còn lại giống hệt; khác biệt chỉ là dấu xuống dòng sau `}` và các chú thích.
- Mở bản gốc và bản build bằng Chromium (cùng 420×900), đăng ký tài khoản rồi chụp các tab Trang chủ / Học / Cửa hàng / Giải trí / Ví / Nhiệm vụ / Tiện ích / Cộng đồng và màn game: **0 pixel khác nhau**, không có lỗi JS mới.

## Ghi chú

- Phần JS ban đầu là bản đã biên dịch (esbuild, các mốc `// src/*.ts` vẫn còn trong code) nên không có mã nguồn TypeScript gốc; các file ở đây là JavaScript. Chuyển sang TypeScript/ES module là việc làm riêng, sau khi phần tách file này ổn định.

## Bài học tự động từ danh sách từ vựng

- Dữ liệu: `src/data/vocab/**` (từ file Excel trong thư mục HÀN) – xem `src/data/vocab/index.json`.
- `scripts/build.mjs` gộp dữ liệu thành `window.WINDTP_VOCAB` (mục `"vocab"` trong `src/manifest.json`).
- `src/js/app/49-vocab-lessons.js`: làm sạch từ, tạo phiên âm (RR theo âm tiết) và gọi `window.__lessonOpen(...)`.
- `src/js/lessons/seoul1a-bai1/*`: bộ bài học dùng chung (flashcard, trắc nghiệm, gõ từ, nghe, ghép cặp, giải cứu công chúa).
  Bài 1 Seoul 1A giữ bản làm tay. Các bài khác chạy từ dữ liệu; Đọc hiểu cần câu mẫu trong `src/data/sentences/<cùng đường dẫn file từ vựng>.txt` (hiện có Seoul 1A bài 2–8).
- Thách đấu: mỗi lời thách đấu lưu `lesson` (khóa bài) + `lessonLabel`; vào thi từ bài khác sẽ tự mở đúng bài (`window.__openLessonByKey`).
- Ngữ pháp: chỉ có Flashcard / Trắc nghiệm / Ghép cặp / Giải cứu công chúa (không gõ/nghe vì mẫu câu có ký hiệu).
- Quyển không có dữ liệu (Yonsei Reading/Listening) để trống.
