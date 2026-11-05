/*@file js/app/10-daily-review-exam.js
 * v15-5: đề ôn tập theo ngày (chu kỳ 365 ngày, mỗi ngày một đề).
 */
  // ===== v15-5: đề ôn tập theo ngày (chu kỳ 365 ngày, mỗi ngày một đề, không trùng trong 365 ngày liên tiếp) =====
  var DAILY_CYCLE = 365, DAILY_EPOCH = Date.UTC(2026, 0, 1);
  function dailyNo(d) {
    d = d || new Date();
    const days = Math.floor((Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) - DAILY_EPOCH) / 864e5);
    return (((days % DAILY_CYCLE) + DAILY_CYCLE) % DAILY_CYCLE) + 1;
  }
  function dlA(n, k) { let r = 1; for (let i = 0; i < k; i++) r *= (n - i); return r; }
  function dlGcd(a, b) { while (b) { const x = a % b; a = b; b = x; } return a; }
  function dlPerm(n, k, idx) {
    const pool = Array.from({ length: n }, (_, i) => i), out = [];
    for (let r = 0; r < k; r++) { const base = n - r; out.push(pool.splice(idx % base, 1)[0]); idx = Math.floor(idx / base); }
    return out;
  }
  function dailyLesson(lang, no) {
    no = no || dailyNo();
    const P = lang.vocab.length, k = Math.min(5, P), G = lang.grammar.length, kg = Math.min(2, G);
    const aV = dlA(P, k), aG = dlA(G, kg), M = aV * aG;
    let step = 1009; while (dlGcd(step, M) !== 1) step++;
    // (no-1)*step mod M là song ánh khi gcd(step,M)=1 → mọi ngày trong chu kỳ ra một tổ hợp khác nhau
    let idx = ((no - 1) * step + (hashStr(lang.code + "|windtp-daily") % M)) % M;
    const vocab = dlPerm(P, k, idx % aV); idx = Math.floor(idx / aV);
    const grammar = dlPerm(G, kg, idx % aG);
    const known = state.known[lang.code] ?? [];
    const now = new Date(), p2 = (x) => String(x).padStart(2, "0");
    return { no, vocab, grammar, dateLabel: p2(now.getDate()) + "/" + p2(now.getMonth() + 1) + "/" + now.getFullYear(),
      knownCount: vocab.filter((i) => known.includes(lang.vocab[i].term)).length };
  }
  function renderBookLibrary(lang) {
    const groups = BOOK_CATALOG[lang.code] || [];
    const total = groups.reduce((n, g) => n + g[2].length, 0);
    const owned = hasCourse(lang.code);
    return `<div class="space-y-5">
      <div class="flex items-center justify-between gap-2"><button data-action="learn-back-menu" class="px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700">← Quay lại</button><span class="text-xs font-bold text-slate-500">${total} quyển / bộ tài liệu</span></div>
      <div class="lib-banner wl-banner rounded-3xl p-5 bg-gradient-to-r from-amber-500 to-orange-400 text-white keep-white"><span class="wl-wrap wl-corner">${windLogo(56)}</span><p class="text-xs font-bold opacity-90">CÔNG PHÁP · TÂM PHÁP · CHÂN KINH</p><h2 class="text-xl font-black mt-1">Giáo trình, tài liệu & đề thi thử</h2><p class="text-sm mt-1 opacity-90">${lang.flag} ${lang.name} · Danh sách chia theo từng bộ và từng quyển</p><p class="lib-note text-xs mt-2 font-bold bg-white/20 rounded-xl px-3 py-2">🆓 Bài 1 · Quyển 1 của mỗi giáo trình miễn phí · 👑 Các quyển còn lại ${owned ? "đã mở khóa cho bạn" : "cần mua khóa học để mở (Premium)"}</p></div>
      ${groups.map((g, gi) => `<section class="glass-card rounded-2xl p-4 border border-slate-100"><div class="flex items-start justify-between gap-2 mb-3"><div><h3 class="font-extrabold text-slate-800">${esc(g[0])}</h3><p class="text-[11px] text-slate-500 mt-1">${g[2].length} ${g[2].length === 1 ? "tài liệu/quyển" : "quyển"}</p></div><span class="text-[10px] font-bold px-2 py-1 rounded-full bg-amber-50 text-amber-700">Bộ ${gi + 1}</span></div><div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">${g[2].map((vol, vi) => {
        const free = vi === 0, open = free || owned;
        const pill = free
          ? `<span class="lib-pill free">🆓 BÀI 1 · MIỄN PHÍ</span>`
          : open
            ? `<span class="lib-pill open">👑 PREMIUM · ĐÃ MỞ</span>`
            : `<span class="lib-pill lock">🔒 PREMIUM</span>`;
        return `<div role="button" tabindex="0" data-action="${free ? "lib-free" : "lib-premium"}" data-code="${lang.code}" data-g="${gi}" data-v="${vi}" class="lib-cover ${open ? "" : "lib-locked"} relative min-h-[176px] cursor-pointer rounded-xl overflow-hidden p-3 text-white keep-white shadow-md flex flex-col justify-between" style="--vi:${vi};background:${bookGradient(g[1])}"><div class="absolute inset-0 opacity-15" style="background-image:radial-gradient(circle at 20% 20%,white 0 2px,transparent 3px),linear-gradient(135deg,transparent 45%,rgba(255,255,255,.3) 46%,transparent 70%)"></div>${open ? "" : `<div class="lib-shade"></div><div class="lib-lock">🔒</div>`}<div class="relative lib-top"><p class="text-[9px] uppercase tracking-widest font-black opacity-90">WINDTP · ${esc(lang.name)}</p><p class="text-sm font-black leading-tight mt-2">${esc(g[0])}</p>${pill}</div><div class="relative"><p class="text-lg font-black">${esc(vol)}</p><p class="text-[9px] font-semibold opacity-90 mt-1">${lessonsOf(lang.code, gi, vi).length ? lessonsOf(lang.code, gi, vi).length + " BÀI HỌC ▸" : "GIÁO TRÌNH / TÀI LIỆU"}</p></div><div class="lib-num">${vi + 1}</div></div>`;
      }).join("")}</div></section>`).join("")}
      <p class="text-[11px] text-slate-500">Bìa trên là bìa minh họa thiết kế theo màu nhận diện tham khảo của từng bộ, không phải ảnh bìa chính thức của nhà xuất bản. Nội dung sách đầy đủ chưa được nhúng vào đây.</p>
    </div>`;
  }
