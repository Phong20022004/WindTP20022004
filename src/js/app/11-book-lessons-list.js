/*@file js/app/11-book-lessons-list.js
 * Danh sách bài của từng quyển (BOOK_LESSONS: Seoul Korean 1A/1B) và màn danh sách bài.
 */
  /* ===== Danh sách bài học theo từng quyển (Seoul Korean 1A = quyển 1, 1B = quyển 2: mỗi quyển 8 bài) ===== */
  var BOOK_LESSONS = {
    "ko|Seoul Korean": {
      0: [
        ["Xin chào", "Hello"],
        ["Đây là cái gì?", "What is this?"],
        ["Tôi học tiếng Hàn", "I study Korean"],
        ["Nó ở đâu?", "Where is it?"],
        ["Cuối tuần tôi đã gặp bạn", "I met my friend over the weekend"],
        ["Cái này bao nhiêu tiền?", "How much is it?"],
        ["Thời tiết thế nào?", "How is the weather?"],
        ["Chúng ta đi xem phim nhé?", "Shall we watch a movie?"]
      ],
      1: [
        ["Người này là ai?", "Who is this person?"],
        ["Bây giờ là mấy giờ?", "What time is it now?"],
        ["Tôi bị cảm", "I caught a cold"],
        ["A lô? (nói chuyện điện thoại)", "Hello (on the phone)"],
        ["Hãy đưa tôi đến ga Seoul", "Please take me to Seoul Station"],
        ["Hãy thử bộ quần áo này", "Try these clothes on"],
        ["Tôi muốn đi du lịch", "I want to go on a trip"],
        ["Bạn đến nhà tôi được không?", "Can you come to my house?"]
      ]
    }
  };
  function lessonsOf(code, gi, vi) {
    const g = (BOOK_CATALOG[code] || [])[gi];
    const d = g && BOOK_LESSONS[code + "|" + g[0]];
    return (d && d[vi]) || [];
  }
  function renderLessonList(lang) {
    const v = ui.libVol;
    const g = v && v.code === lang.code ? (BOOK_CATALOG[lang.code] || [])[v.g] : null;
    if (!g || !g[2][v.v]) { ui.learnStage = "library"; return renderBookLibrary(lang); }
    const vol = g[2][v.v], owned = hasCourse(lang.code), freeVol = v.v === 0;
    const list = lessonsOf(lang.code, v.g, v.v);
    const isSeoul1 = lang.code === "ko" && g[0] === "Seoul Korean" && v.v === 0;
    const bg = bookGradient(g[1]);
    const rowHtml = (l, li) => {
      const free = freeVol && li === 0, open = free || owned;
      const pill = free ? '<span class="ls-pill free">🆓 MIỄN PHÍ</span>' : open ? '<span class="ls-pill open">👑 PREMIUM · ĐÃ MỞ</span>' : '<span class="ls-pill lock">🔒 PREMIUM</span>';
      const feat = isSeoul1 && li === 0 ? '<p class="ls-feat">Từ vựng · Flashcard · Trắc nghiệm · Luyện nghe · Trò chơi</p>' : "";
      return `<button type="button" data-action="lesson-open" data-code="${lang.code}" data-g="${v.g}" data-v="${v.v}" data-l="${li}" class="ls-row" aria-label="Bài ${li + 1}: ${esc(l[0])}"><span class="ls-no" style="--ls-bg:${bg}">${li + 1}</span><span class="ls-body"><p class="ls-name">Bài ${li + 1} · ${esc(l[0])}</p><p class="ls-en">${esc(l[1])}</p>${feat}${pill}</span><span class="ls-go" aria-hidden="true">${open ? "▶" : "🔒"}</span></button>`;
    };
    let body;
    if (list.length) body = `<div class="ls-list">${list.map(rowHtml).join("")}</div>`;
    else {
      const first = freeVol ? `<div class="ls-list">${rowHtml(["Bài học đầu tiên", "Học thử miễn phí"], 0)}</div>` : "";
      body = `${first}<div class="ls-empty">📚 Danh sách các bài học của quyển này đang được cập nhật. ${freeVol ? "Bài 1 vẫn học thử miễn phí ngay bây giờ." : owned ? "Bạn đã mở khóa, các bài sẽ xuất hiện ngay khi được cập nhật." : "Mua khóa học để mở khóa khi nội dung sẵn sàng."}</div>`;
    }
    const count = list.length ? `${list.length} bài học` : "Đang cập nhật";
    return `<div class="ls-wrap">
      <div class="ls-top"><button type="button" data-action="lessons-back" class="ls-back">← Danh sách quyển</button><span class="ls-count">${esc(count)}</span></div>
      <div class="ls-banner keep-white" style="background:${bg}"><p class="ls-eyebrow">WINDTP · ${esc(lang.name)} · Quyển ${v.v + 1}</p><h2 class="ls-title">${esc(g[0])} ${esc(vol)}</h2><p class="ls-sub">${lang.flag} ${list.length ? `Gồm ${list.length} bài học` : "Danh sách bài học"}</p><p class="ls-note">🆓 Bài 1 · Quyển 1 miễn phí · 👑 ${owned ? "Các bài còn lại đã mở khóa cho bạn" : "Các bài còn lại cần mua khóa học (Premium)"}</p></div>
      ${body}
    </div>`;
  }
