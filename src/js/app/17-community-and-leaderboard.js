/*@file js/app/17-community-and-leaderboard.js
 * Tab Cộng đồng: bài đăng, bảng xếp hạng.
 */
  var POST_TAGS = ["Chung", "TOEIC", "IELTS", "HSK", "JLPT", "TOPIK", "H\u1ECFi \u0111\xE1p"];
  function authorAvatar(name, px) {
    return name === state.userName ? profileAvatar(px) : avatar(name, px >= 40 ? "w-10 h-10" : "w-7 h-7");
  }
  function postCard_(p) {
    const open = ui.openComments.has(p.id);
    const mine = p.author === state.userName;
    return `
  <article class="glass-card p-4 rounded-2xl space-y-3${p.admin ? " adm-post" + (Date.now() - p.ts < 8000 ? " adm-pop" : "") : ""}">
    <div class="flex items-center gap-3">
      ${p.admin && !mine ? renderPfp(p.author, ADMIN_AVATAR_ID, ADMIN_FRAME_ID, 40, { official: true }) : authorAvatar(p.author, 40)}
      <div class="flex-1 min-w-0">
        <h4 class="font-bold text-xs text-slate-800 truncate">${esc(p.author)}${p.admin ? ' <span class="adm-badge">👑 BigBoss</span>' : ""}</h4>
        <p class="text-[10px] text-slate-400">${timeAgo(p.ts)} \u2022 Chuy\xEAn m\u1EE5c ${esc(p.tag)}</p>
      </div>
      ${mine ? `<button data-action="delete-post" data-id="${p.id}" class="text-[11px] text-slate-400 hover:text-rose-500" aria-label="X\xF3a b\xE0i">X\xF3a</button>` : ""}
    </div>
    <p class="text-xs text-slate-700 leading-relaxed whitespace-pre-line break-words">${esc(p.text)}</p>
    <div class="flex items-center gap-4 text-xs text-slate-500 pt-2 border-t border-slate-100">
      <button data-action="like-post" data-id="${p.id}" aria-pressed="${p.liked}" class="${p.liked ? "text-rose-500 font-bold" : "hover:text-sky-600"}">${p.liked ? "\u2764\uFE0F" : "\u{1F90D}"} ${p.likes} Th\xEDch</button>
      <button data-action="toggle-comments" data-id="${p.id}" class="hover:text-sky-600">\u{1F4AC} ${p.comments.length} B\xECnh lu\u1EADn</button>
    </div>
    ${open ? `
    <div class="space-y-2 pt-1">
      ${p.comments.map((c) => `<div class="flex gap-2">${authorAvatar(c.author, 28)}<div class="bg-slate-100 rounded-2xl px-3 py-1.5 min-w-0"><p class="text-[11px] font-bold text-slate-800">${esc(c.author)} <span class="font-normal text-slate-400">${timeAgo(c.ts)}</span></p><p class="text-xs text-slate-700 break-words">${esc(c.text)}</p></div></div>`).join("")}
      <div class="flex gap-2"><input id="cmt-${p.id}" type="text" maxlength="300" placeholder="Vi\u1EBFt b\xECnh lu\u1EADn..." class="flex-1 px-3 py-1.5 text-xs rounded-full border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-sky-400">
      <button data-action="send-comment" data-id="${p.id}" class="px-3 py-1.5 bg-sky-600 text-white keep-white rounded-full text-xs font-bold">G\u1EEDi</button></div>
    </div>` : ""}
  </article>`;
  }
  function renderCommunity() {
    const el = $("#tab-community");
    if (!el) return;
    el.innerHTML = `
  <div>
    <h2 class="text-lg font-extrabold text-slate-800">\u{1F465} C\u1ED9ng \u0110\u1ED3ng WINDTP</h2>
    <p class="text-xs text-slate-500">Bảng tin chia sẻ kinh nghiệm và hỏi đáp học thuật.</p>
  </div>
  <div class="max-w-2xl mx-auto space-y-4">

    ${isAdmin() ? modCard() : ""}${ownPendingNote()}
    <div class="glass-card p-4 rounded-2xl space-y-3">
      <div class="flex gap-3">${profileAvatar(40)}
        <textarea data-input="draft" id="post-draft" rows="2" maxlength="600" placeholder="B\u1EA1n mu\u1ED1n chia s\u1EBB \u0111i\u1EC1u g\xEC h\xF4m nay?" class="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-sky-400 resize-none">${esc(ui.draft)}</textarea></div>
      <div class="flex items-center justify-between gap-2">
        <select data-change="draft-tag" aria-label="Chuy\xEAn m\u1EE5c" class="border border-slate-200 rounded-lg px-2 py-1.5 text-xs bg-white">${POST_TAGS.map((t) => `<option ${ui.draftTag === t ? "selected" : ""}>${t}</option>`).join("")}</select>
        <button data-action="publish-post" class="px-4 py-1.5 bg-sky-600 hover:bg-sky-700 text-white keep-white rounded-xl text-xs font-bold">\u0110\u0103ng b\xE0i</button>
      </div>
    </div>
    ${[...state.posts].filter((p) => p.status !== "pending" && p.status !== "rejected").sort((a, b) => b.ts - a.ts).map(postCard).join("") || '<div class="com-empty"><div class="com-bubbles" aria-hidden="true"><span>💬</span><span>✨</span><span>📚</span></div><p class="com-t">Chưa có bài viết nào</p><p class="com-s">Hãy là người đầu tiên chia sẻ kinh nghiệm học của bạn!</p><button type="button" data-action="focus-draft" class="com-cta">✍️ Viết bài đầu tiên</button></div>'}
  </div>`;
  }
  function lbList(kind) {
    const FN = ["Nguyễn","Trần","Lê","Phạm","Hoàng","Vũ","Đặng","Bùi","Đỗ","Ngô"], GN = ["An","Bình","Cường","Dũng","Hà","Hiếu","Linh","Mai","Nam","Phúc","Quân","Sơn","Trang","Uyên","Vy","Yến","Long","Hoa","Tuấn","Lan"];
    let s = kind === "coin" ? 13 : 7; const rnd = () => { s = (s * 1103515245 + 12345) & 0x7fffffff; return s / 0x7fffffff; };
    const top = kind === "coin" ? 6e6 : 18e5, R = CULTIVATION_RANKS.length, list = [];
    for (let i = 0; i < 150; i++) {
      const g = rnd() < .5 ? "nam" : "nu";
      list.push({ name: FN[Math.floor(rnd() * 10)] + (g === "nu" ? " Thị " : " Văn ") + GN[Math.floor(rnd() * 20)], avatarId: "default", gender: g, age: 14 + Math.floor(rnd() * 40),
        realm: Math.min(R - 1, Math.floor((150 - i) / 150 * R * (0.6 + rnd() * 0.6))), val: Math.round(top * Math.pow(.955, i) * (0.9 + rnd() * 0.2)) });
    }
    const me = { me: 1, name: state.userName || "Bạn", avatarId: state.avatarId, frameId: myFrameId(), gender: state.settings.gender, age: ageFromBirth(state.settings.birth), realm: cultivationIndex(), val: Number(kind === "coin" ? state.balance : state.chips) || 0 };
    list.push(me); list.sort((a, b) => b.val - a.val);
    return { list, me, rank: list.indexOf(me) + 1 };
  }
  function lbRow(p, i, kind) {
    const gs = p.gender === "nam" ? "♂" : p.gender === "nu" ? "♀" : p.gender === "khac" ? "⚧" : "";
    const pfp = p.me ? renderPfp(p.name, p.avatarId, p.frameId, 40, {}) : renderPfp(p.name, p.avatarId, "r-" + p.realm, 40, { realm: p.realm });
    const hl = p.me ? "background:linear-gradient(90deg,#fef3c7,#fde68a);box-shadow:0 0 0 2px #f59e0b,0 0 14px rgba(245,158,11,.7);color:#78350f" : "";
    return `<div class="lb-row flex items-center gap-2 p-2 rounded-xl ${i < 3 ? "lb-r" + (i + 1) : ""} ${p.me ? "lb-me" : "bg-slate-50"}" style="--i:${Math.min(i, 30)};${hl}"><span class="w-7 text-center font-black text-sm shrink-0">${["🥇","🥈","🥉"][i] || (i + 1)}</span><div class="shrink-0">${pfp}</div><div class="flex-1 min-w-0"><p class="font-bold text-xs truncate">${esc(p.name)}${p.me ? " (Bạn)" : ""}</p><p class="text-[10px] opacity-70 truncate">${CULTIVATION_RANKS[p.realm].name}${gs ? " · " + gs : ""}${p.age >= 0 ? " · " + p.age + " tuổi" : ""}</p></div><b class="text-xs whitespace-nowrap">${fmt(p.val)} ${kind === "coin" ? "Xu" : "chip"}</b></div>`;
  }
  function lbModal() {
    const k = ui.lbTab === "coin" ? "coin" : "chips", d = lbList(k), TOPN = 50, top = d.list.slice(0, TOPN), inTop = d.rank <= TOPN;
    const tab = (id, l) => `<button data-action="lb-tab" data-k="${id}" class="flex-1 px-3 py-2 rounded-xl text-xs font-bold ${k === id ? "bg-amber-500 text-white keep-white" : "bg-slate-100 text-slate-600"}">${l}</button>`;
    const unit = k === "coin" ? "WIND Coin" : "Chip game";
    const rk = inTop ? "Xếp hạng của bạn: #" + d.rank + " · đang sáng trong bảng" : d.rank <= 100 ? "Xếp hạng của bạn: #" + d.rank + " (hạng 51–100)" : "Vô hạng (ngoài top 100)";
    const badge = d.rank <= 100 ? "#" + d.rank : "Vô hạng";
    const meRow = lbRow(d.me, d.rank - 1, k).replace(/<span class="w-7[^>]*>.*?<\/span>/, '<span class="min-w-[2.25rem] text-center font-black ' + (d.rank <= 100 ? "text-sm" : "text-[9px] leading-tight") + ' shrink-0">' + badge + "</span>").replace(/ lb-r[123] /, " ");
    return `${modalHead("🏆 Top " + TOPN + " " + unit)}<div class="p-4 space-y-3"><div class="flex gap-2">${tab("chips", "🎰 Chip game")}${tab("coin", "🪙 WIND Coin")}</div><div class="lb-list space-y-1.5" style="max-height:52vh;overflow-y:auto;overscroll-behavior:contain;padding:2px">${top.map((p, i) => lbRow(p, i, k)).join("")}</div><div class="lb-mine rounded-2xl border border-slate-200 p-3 space-y-1.5"><p class="text-[11px] font-extrabold text-slate-500">Thông tin của bạn</p>${meRow}</div><p class="text-[10px] text-slate-400 text-center">Hiển thị top ${TOPN}. Thông tin của bạn luôn hiện thứ hạng (#1–#100), ngoài top 100 là "Vô hạng". Bảng cập nhật theo số dư hiện tại của bạn.</p></div>`;
  }
  function lbButton(k) { return `<button data-action="open-lb" data-k="${k}" class="w-full mt-2 px-3 py-2.5 rounded-xl text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300 lb-btn"><span class="lb-tr">🏆</span> Bảng xếp hạng Top 50 ${k === "coin" ? "WIND Coin" : "Chip game"}</button>`; }
  
function renderWallet() {
    const el = $("#tab-wallet");
    if (!el) return;
    const monthAgo = Date.now() - 30 * 864e5;
    const recent = state.history.filter((h) => h.ts >= monthAgo);
    const totalIn = recent.filter((h) => h.kind === "in").reduce((s, h) => s + h.amount, 0);
    const totalOut = recent.filter((h) => h.kind === "out").reduce((s, h) => s + h.amount, 0);
    const list = state.history.filter((h) => ui.historyFilter === "all" || h.kind === ui.historyFilter).slice(0, 60);
    el.innerHTML = `
  <div class="p-5 rounded-3xl bg-gradient-to-br from-amber-500 via-amber-600 to-orange-600 text-white keep-white shadow-lg relative overflow-hidden">
    <div class="absolute -right-6 -bottom-6 text-8xl opacity-20 select-none">\u{1FA99}</div>
    <div class="flex items-center gap-2">
      <div class="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center"><span class="wind-coin-letter wind-coin-letter--white" aria-hidden="true">W</span></div>
      <p class="text-xs text-amber-100 font-bold uppercase tracking-wider">S\u1ED1 D\u01B0 V\xED Bi\u1EC3u T\u01B0\u1EE3ng Xu</p>
    </div>
    <div class="text-3xl font-black mt-2">${fmt(state.balance)} <span class="text-lg font-bold text-amber-200">WIND Coin</span></div>
    <p class="text-xs text-amber-100 mt-1">🎰 Chip game: <b>${fmt(state.chips || 0)}</b></p>
    <p class="text-[11px] text-amber-100 mt-1">Xu d\xF9ng \u0111\u1EC3 mua t\xE0i li\u1EC7u, avatar v\xE0 khung avatar. Xu c\xF3 th\u1EC3 nh\u1EADn \u0111\u01B0\u1EE3c khi ho\xE0n th\xE0nh nhi\u1EC7m v\u1EE5.</p>
    <button data-action="open-lb" data-k="coin" class="lb-btn relative w-full mt-3 px-3 py-2 rounded-xl text-xs font-extrabold bg-white/20 hover:bg-white/30 border border-white/40 text-white keep-white transition-all"><span class="lb-tr">🏆</span> Bảng xếp hạng Top 50 WIND Coin</button>
    <div class="flex flex-wrap gap-3 mt-3 relative">
      <button data-action="open-topup" class="px-4 py-2 bg-white keep-white text-amber-900 rounded-xl text-xs font-extrabold shadow-md hover:bg-amber-50 transition-all">\u{1FA99} N\u1EA1p Xu</button>
      <button data-action="spend-xu" class="px-4 py-2 bg-emerald-600/80 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold transition-all">\u{1F3EA} Chi ti\xEAu</button>
      <button data-action="goto" data-tab="tasks" class="px-4 py-2 bg-white/20 hover:bg-white/25 border border-white/40 text-white keep-white rounded-xl text-xs font-extrabold transition-all">\u{1F3AF} Ki\u1EBFm WIND Coin</button>
    </div>
  </div>
  <div class="grid grid-cols-2 gap-3">
    <div class="glass-card p-3.5 rounded-2xl"><p class="text-[11px] text-slate-500">Thu 30 ng\xE0y qua</p><p class="text-base font-extrabold text-emerald-600">+${fmt(totalIn)} Xu</p></div>
    <div class="glass-card p-3.5 rounded-2xl"><p class="text-[11px] text-slate-500">Chi 30 ng\xE0y qua</p><p class="text-base font-extrabold text-rose-500">-${fmt(totalOut)} Xu</p></div>
  </div>
  ${state.orders.length ? `<div class="glass-card p-4 rounded-2xl">
    <h3 class="font-bold text-sm text-slate-800 flex items-center gap-2 mb-3"><span>\u{1F9FE}</span> \u0110\u01A1n H\xE0ng & N\u1EA1p Xu</h3>
    <div class="space-y-3">${state.orders.slice(0, 10).map((o) => `
      <div class="flex justify-between items-center text-xs gap-2">
        <div class="min-w-0"><p class="font-bold text-slate-800 truncate">${esc(o.summary)}</p><p class="text-[10px] text-slate-400">${fmtDateTime(o.ts)} \u2022 ${esc(o.method)}</p></div>
        <div class="text-right whitespace-nowrap"><p class="font-bold text-slate-800">${money(o.total, o.currency)}</p>${o.status === "pending" ? `<p class="text-[10px] font-bold text-amber-600">\u23F3 Ch\u1EDD x\u1EED l\xFD</p>` : o.status === "done" ? `<p class="text-[10px] font-bold text-emerald-600">\u2705 \u0110\xE3 x\xE1c nh\u1EADn</p>` : ""}</div>
      </div>`).join("")}</div>
  </div>` : ""}
  <div class="glass-card p-4 rounded-2xl">
    <div class="flex items-center justify-between mb-3 gap-2">
      <h3 class="font-bold text-sm text-slate-800 flex items-center gap-2"><span>\u{1F4DC}</span> L\u1ECBch S\u1EED Giao D\u1ECBch Xu</h3>
      <div class="flex gap-1.5">
        ${[["all", "T\u1EA5t c\u1EA3"], ["in", "Thu"], ["out", "Chi"]].map(([k, label]) => `<button data-action="history-filter" data-f="${k}" aria-pressed="${ui.historyFilter === k}" class="px-2.5 py-1 rounded-lg text-[11px] font-bold ${ui.historyFilter === k ? "bg-sky-600 text-white keep-white" : "bg-white border border-slate-200 text-slate-600"}">${label}</button>`).join("")}
      </div>
    </div>
    <div class="space-y-3">
      ${list.length ? list.map((h, i) => `
      <div class="flex justify-between items-center text-xs ${i < list.length - 1 ? "pb-2 border-b border-slate-100" : ""}">
        <div class="min-w-0 pr-2"><p class="font-bold text-slate-800 truncate">${esc(h.title)}</p><p class="text-[10px] text-slate-400">${fmtDateTime(h.ts)}</p></div>
        <span class="font-bold whitespace-nowrap ${h.kind === "in" ? "text-emerald-600" : "text-rose-500"}">${h.kind === "in" ? "+" : "-"}${fmt(h.amount)} Xu</span>
      </div>`).join("") : '<p class="text-xs text-slate-500 text-center py-4">Ch\u01B0a c\xF3 giao d\u1ECBch n\xE0o.</p>'}
    </div>
  </div>`;
  }
