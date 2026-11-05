/*@file js/app/15-entertainment.js
 * Tab Giải trí: kết quả trận và danh sách game.
 */
  function matchResults() {
    const { lang, level, goal } = ui.match;
    const pool = PARTNERS.filter((p) => p.lang === lang).map((p) => ({ p, score: Math.max(30, 100 - Math.abs(p.level - level) * 22 - (p.goal === goal ? 0 : 14)) })).sort((a, b) => b.score - a.score).slice(0, 3);
    if (!pool.length) return '<p class="text-xs text-slate-500">Ch\u01B0a c\xF3 h\u1ED3 s\u01A1 ph\xF9 h\u1EE3p.</p>';
    return pool.map(({ p, score }) => {
      const invited = state.invited.includes(p.id);
      return `
    <div class="flex items-center gap-3 p-2.5 rounded-xl bg-white border border-slate-100">
      ${avatar(p.name, "w-10 h-10")}
      <div class="flex-1 min-w-0">
        <p class="text-xs font-bold text-slate-800">${p.name} <span class="text-emerald-600">\u2022 ${score}% h\u1EE3p</span></p>
        <p class="text-[10px] text-slate-500 truncate">${LEVELS[p.level]} \u2022 ${p.goal}</p>
        <p class="text-[10px] text-slate-400 truncate">${p.bio}</p>
      </div>
      <button data-action="invite" data-id="${p.id}" ${invited ? "disabled" : ""} class="px-2.5 py-1 rounded-lg text-[11px] font-bold ${invited ? "bg-slate-200 text-slate-500" : "bg-pink-600 text-white keep-white hover:bg-pink-700"}">${invited ? "\u0110\xE3 m\u1EDDi" : "M\u1EDDi h\u1ECDc"}</button>
    </div>`;
    }).join("");
  }
  function entSafe(fn, label) {
    try { return fn(); } catch (err) {
      try { console.error("[Giải trí] " + label, err); } catch (e2) { }
      return '<div class="glass-card p-4 rounded-2xl text-xs text-slate-500">Không tải được phần này. Hãy tải lại trang để thử lại.</div>';
    }
  }
  function renderEntertainment() {
    const el = $("#tab-entertainment");
    if (!el) return;
    const playing2 = isPlaying();
    el.innerHTML = `
  <div>
    <h2 class="text-lg font-extrabold text-slate-800">\u{1F3AE} Gi\u1EA3i Tr\xED &amp; K\u1EBFt B\u1EA1n</h2>
    <p class="text-xs text-slate-500">Nghe nhạc thư giãn và tìm bạn bè xung quanh nơi bạn ở.</p>
  </div>
  <div id="hub-card" class="glass-card wd-hub p-4 rounded-2xl space-y-3">${entSafe(hubHtml, "hub")}</div>
  <h3 class="text-base font-extrabold text-slate-800 mt-1 mb-1.5">⚔️ Thách Đấu Bạn Bè</h3><div id="duel-card">${entSafe(duelCard, "duel")}</div><h3 class="text-base font-extrabold text-slate-800 mt-1 mb-1.5">🃏 Game Bàn Bài Lá</h3><div id="bbl-card">${entSafe(bblCard, "bbl")}</div>${entSafe(() => lbButton("chips"), "lb")}<h3 class="text-base font-extrabold text-slate-800 mt-1 mb-1.5">🎧 Lofi Chill Radio</h3><div class="grid grid-cols-1 md:grid-cols-2 gap-4">

    <div class="glass-card p-4 rounded-2xl space-y-3 border-t-4 border-t-cyan-500">
      
      <h4 class="font-bold text-sm text-slate-800">Nhạc Tập Trung Học Tập</h4>
      <p class="text-xs text-slate-500">2 bài lofi không lời và tiếng mưa êm, được tạo trực tiếp trên trình duyệt, hợp với phương pháp Pomodoro.</p>
      <div class="flex items-end gap-1 h-8 ${playing2 ? "" : "opacity-30"}" aria-hidden="true">
        ${[0, 0.2, 0.4, 0.1, 0.3, 0.5, 0.15].map((d) => `<div class="w-2 rounded-t bg-cyan-500 ${playing2 ? "eq-bar" : ""}" style="height:30%;animation-delay:${d}s"></div>`).join("")}
      </div>
      <div class="space-y-1.5" role="list" aria-label="Danh sách bài lofi">${TRACKS.map((t, i) => `<button type="button" role="listitem" data-action="radio-track" data-id="${t.id}" aria-pressed="${i === trackIdx}" class="w-full flex items-center gap-2 p-2 rounded-xl border text-left ${i === trackIdx ? "border-cyan-500 bg-cyan-50" : "border-slate-200 bg-white"}"><span class="text-base">${t.emoji}</span><span class="flex-1 min-w-0"><span class="block text-xs font-bold text-slate-800">${t.name}${i === trackIdx && playing2 ? " ▶" : ""}</span><span class="block text-[10px] text-slate-500">${t.desc}</span></span></button>`).join("")}</div>
      <div class="flex items-center gap-2 text-xs"><span class="text-cyan-700 shrink-0"><svg class="spk-ico" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4.2 9.6v4.8h3.5l4.6 3.9V5.7L7.7 9.6H4.2z" fill="currentColor" fill-opacity=".22"/><path d="M15.6 9.3a3.6 3.6 0 0 1 0 5.4"/></svg></span>
        <input data-input="volume" type="range" min="0" max="100" value="${ui.volume}" aria-label="Âm lượng" class="flex-1 accent-cyan-600"><span class="text-cyan-700 shrink-0"><svg class="spk-ico" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4.2 9.6v4.8h3.5l4.6 3.9V5.7L7.7 9.6H4.2z" fill="currentColor" fill-opacity=".22"/><path d="M15.6 9.3a3.6 3.6 0 0 1 0 5.4"/><path d="M18.3 6.8a7.2 7.2 0 0 1 0 10.4"/></svg></span></div>
      <div class="flex gap-2">
        <button data-action="radio-prev" class="px-3 py-2 bg-white border border-cyan-300 text-cyan-700 rounded-xl text-xs font-bold" aria-label="Bài trước">⏮</button>
        <button data-action="toggle-radio" class="flex-1 py-2 bg-cyan-600 hover:bg-cyan-700 text-white keep-white rounded-xl text-xs font-bold">${!isSupported() ? "Trình duyệt không hỗ trợ" : playing2 ? "⏸ Tạm dừng" : "▶ Phát nhạc"}</button>
        <button data-action="radio-next" class="px-3 py-2 bg-white border border-cyan-300 text-cyan-700 rounded-xl text-xs font-bold" aria-label="Bài sau">⏭</button>
      </div>
      <button data-action="open-tool" data-tool="pomodoro" class="w-full py-2 bg-white border border-cyan-300 text-cyan-700 rounded-xl text-xs font-bold">\u23F1 M\u1EDF \u0111\u1ED3ng h\u1ED3 Pomodoro</button>
    </div>
  </div>`;
  }
