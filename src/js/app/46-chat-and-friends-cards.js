/*@file js/app/46-chat-and-friends-cards.js
 * Tạo nhóm chat, thẻ chat/bạn bè/thách đấu, làm mới danh sách bạn.
 */
  function scrollChat() { const l = $("#chat-log"); if (l) l.scrollTop = l.scrollHeight; const i = $("#msg-input"); if (i) i.focus(); }
  function openChat(t) { ui.chat = t; openModal(chatModal); scrollChat(); }
  document.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && e.target && e.target.id === "msg-input" && ui.renderModal === chatModal) {
      e.preventDefault();
      if (sendChat(e.target.value)) { refreshModal(); scrollChat(); }
    }
  });
  function grpCreateModal() {
    return `${modalHead("👥 Tạo nhóm chat")}<div class="p-5 space-y-3 text-xs"><div><label class="font-bold text-slate-700" for="grp-name">Tên nhóm</label><input id="grp-name" data-autofocus maxlength="30" placeholder="Ví dụ: Nhóm ôn TOEIC" class="${field} mt-1"></div>
      <div><p class="font-bold text-slate-700 mb-1">Chọn thành viên</p><div class="space-y-1.5">${FRIENDS.map((f) => `<label class="flex items-center gap-2 p-2 rounded-xl bg-slate-50"><input type="checkbox" class="grp-chk accent-sky-600" value="${f.id}"> <span class="font-semibold text-slate-800">${esc(f.name)}</span></label>`).join("")}</div></div>
      <button data-action="grp-create" class="w-full ${btnPrimary}">Tạo nhóm</button></div>`;
  }
  function chatCard() {
    const s = socialState();
    const last = (k) => { const a = s.msgs[k] || [], m = a[a.length - 1]; return m ? esc(m.t.slice(0, 60)) : "Chưa có tin nhắn"; };
    const rowBtn = (act, id, icon, title, sub, k) => `<button data-action="${act}" ${id ? `data-id="${id}"` : ""} class="w-full flex items-center gap-3 p-2.5 rounded-xl bg-white/70 hover:bg-white text-left"><span class="text-2xl shrink-0">${icon}</span><span class="min-w-0 flex-1"><span class="block text-xs font-extrabold text-slate-800 truncate">${title} <span class="font-semibold text-[10px] text-slate-400">${sub}</span></span><span class="block text-[11px] text-slate-500 truncate">${last(k)}</span></span></button>`;
    return `<div class="glass-card p-4 rounded-2xl space-y-2"><div class="flex items-center justify-between gap-2"><h3 class="font-extrabold text-sm text-slate-800">💬 Kênh trò chuyện</h3><button data-action="open-grp-create" class="px-3 py-1.5 rounded-lg text-[11px] font-bold bg-sky-100 text-sky-800">➕ Tạo nhóm</button></div>
      ${rowBtn("open-world", "", "🌍", "Thế giới", "Kênh chung", "world")}
      ${s.groups.map((g) => rowBtn("open-group", g.id, "👥", esc(g.name), g.members.length + 1 + " thành viên", "grp:" + g.id)).join("")}</div>`;
  }
  // ----- giao diện bạn bè -----
  function friendsCard() {
    const now = Date.now(), s = socialState();
    const rows = FRIENDS.map((f) => ({ f, on: friendOnline(f, now) })).sort((a, b) => Number(b.on) - Number(a.on));
    const onCount = rows.filter((r) => r.on).length;
    const me = selfOnline();
    const rec = (id) => { const r = s.record[id]; return r ? `${r.w}T-${r.l}B-${r.d}H` : ""; };
    const open = !!ui.friendsOpen;
    const head = `<button data-action="toggle-friends" aria-expanded="${open}" class="w-full flex items-center justify-between gap-2 text-left"><h3 class="font-extrabold text-sm text-slate-800">\u{1F465} Bạn bè <span class="text-[11px] font-bold text-emerald-600">● ${onCount}/${FRIENDS.length} online</span></h3><span class="text-slate-400 text-xs">${open ? "▲ Thu gọn" : "▼ Xem danh sách"}</span></button>`;
    if (!open) return `<div class="glass-card p-4 rounded-2xl">${head}</div>`;
    return `<div class="glass-card p-4 rounded-2xl space-y-3">
      ${head}
      <div class="flex justify-end"><button data-action="open-premium" class="px-3 py-1.5 rounded-xl text-[11px] font-extrabold text-white keep-white bg-gradient-to-r from-amber-500 to-pink-500">\u{1F451} ${isPremium() ? `Premium · ${premiumLabel()}` : "Premium"}</button></div>
      <div class="flex items-center gap-3 p-2 rounded-xl bg-sky-50/70"><div class="pr-1">${renderPfp(state.userName, state.avatarId, myFrameId(), 46, { status: me ? "on" : "off" })}</div><div class="min-w-0"><p class="font-bold text-xs text-slate-800 truncate">${esc(state.userName)} (Bạn)</p><p class="text-[10px] ${me ? "text-emerald-600" : "text-slate-500"} font-bold">${me ? "Đang hoạt động" : "Ngoại tuyến"}${isPremium() ? " · \u{1F451}" : ""}${s.points ? ` · ⚔️ ${s.points} điểm` : ""}</p></div></div>
      <div class="space-y-2">${rows.map(({ f, on }) => `<div class="flex items-center gap-3 p-2 rounded-xl ${on ? "bg-white/70" : "bg-slate-100/60"}"><div class="pr-1 shrink-0">${renderPfp(f.name, f.avatarId, "r-" + f.realm, 44, { status: on ? "on" : "off", realm: f.realm })}</div>
        <div class="flex-1 min-w-0"><p class="font-bold text-xs text-slate-800 truncate">${esc(f.name)}</p><p class="text-[10px] ${on ? "text-emerald-600" : "text-slate-400"} font-semibold">${on ? "Online" : `Offline · ${friendSince(f, now)} phút trước`} · ${(CULTIVATION_RANKS[f.realm] || CULTIVATION_RANKS[0]).name}${rec(f.id) ? ` · ${rec(f.id)}` : ""}</p></div>
        <div class="flex gap-1.5 shrink-0"><button data-action="poke-friend" data-id="${f.id}" class="px-2 py-1.5 rounded-lg text-[11px] font-bold bg-sky-100 text-sky-800" aria-label="Chọc ${esc(f.name)}">\u{1F449} Chọc</button><button data-action="open-chat" data-id="${f.id}" class="px-2 py-1.5 rounded-lg text-[11px] font-bold bg-emerald-100 text-emerald-800" aria-label="Nhắn tin cho ${esc(f.name)}">\u{1F4AC} Tin nhắn</button><button data-action="duel-friend" data-id="${f.id}" ${on ? "" : "disabled"} class="px-2 py-1.5 rounded-lg text-[11px] font-bold ${on ? "bg-amber-500 text-white keep-white" : "bg-slate-200 text-slate-400"}" aria-label="Thách đấu ${esc(f.name)}">⚔️ Thách đấu</button></div></div>`).join("")}</div></div>`;
  }
  function duelCard() {
    restoreGameFriends();
    const now = Date.now(), s = socialState(), prem = isPremium();
    const pend = s.challenges.filter((c) => c && friendById(c.fid) && c.dir === "in" && c.status === "pending");
    const ready = s.challenges.filter((c) => c && friendById(c.fid) && c.status === "accepted").filter((c, i, a) => !c.gid || a.findIndex((x) => x.gid === c.gid) === i);
    const rows = FRIENDS.map((f) => ({ f, on: friendOnline(f, now) })).sort((a, b) => Number(b.on) - Number(a.on));
    const onCount = rows.filter((r) => r.on).length;
    const rec = (id) => { const r = s.record[id]; return r ? `${r.w}T-${r.l}B-${r.d}H` : ""; };
    const row = ({ f, on }) => `<div class="flex items-center gap-2 p-2 rounded-xl ${on ? "bg-white/70" : "bg-slate-100/60"}"><div class="shrink-0">${renderPfp(f.name, f.avatarId, "r-" + f.realm, 38, { status: on ? "on" : "off", realm: f.realm })}</div><div class="flex-1 min-w-0"><p class="font-bold text-xs text-slate-800 truncate">${esc(f.name)}</p><p class="text-[10px] ${on ? "text-emerald-600" : "text-slate-400"} font-semibold">${on ? "Online" : "Offline"} · ${(CULTIVATION_RANKS[f.realm] || CULTIVATION_RANKS[0]).name}${rec(f.id) ? " · " + rec(f.id) : ""}</p></div><div class="flex gap-1.5 shrink-0"><button data-action="poke-friend" data-id="${f.id}" class="px-2 py-1.5 rounded-lg text-[11px] font-bold bg-sky-100 text-sky-800" aria-label="Chọc ${esc(f.name)}">👉</button><button data-action="duel-friend" data-id="${f.id}" ${on ? "" : "disabled"} class="px-2.5 py-1.5 rounded-lg text-[11px] font-bold ${on ? "bg-rose-600 text-white keep-white" : "bg-slate-200 text-slate-400"}">⚔️ Thách đấu</button></div></div>`;
    return `<div class="glass-card p-4 rounded-2xl space-y-3 border-t-4 border-t-rose-500">
      <div class="flex items-start justify-between gap-2">
        <div><div class="text-[12px] font-black tracking-wider" style="background:linear-gradient(90deg,#be185d,#7c3aed);-webkit-background-clip:text;background-clip:text;color:transparent">🌸 HOA SƠN LUẬN KIẾM</div><h4 class="font-bold text-sm text-slate-800">Cùng thi một đề, ai chính xác và nhanh hơn sẽ thắng</h4>
        <p class="text-xs text-slate-500">${prem ? `WIND Premium ${premiumLabel()}` : "Cần WIND Premium để gửi lời thách đấu"} · ● ${onCount}/${FRIENDS.length} bạn đang online</p></div>
        <button data-action="open-premium" class="px-3 py-1.5 rounded-xl text-[11px] font-extrabold text-white keep-white bg-gradient-to-r from-amber-500 to-pink-500 whitespace-nowrap">👑 ${prem ? "Premium" : "Mở khóa"}</button>
      </div>
      ${pend.length + ready.length ? `<div class="flex items-center justify-between gap-2"><p class="text-[11px] font-extrabold text-slate-600">🔔 Thông báo (${pend.length + ready.length})</p><button data-action="ch-clear" class="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-slate-200 text-slate-700">🗑 Xóa tất cả</button></div>` : ""}
      ${pend.map((c) => { const f = friendById(c.fid); return `<div class="p-3 rounded-xl border border-amber-300 bg-amber-50 space-y-2"><div class="flex items-start justify-between gap-2"><p class="text-xs font-bold text-amber-900">⚔️ ${esc(f.name)} thách đấu bạn · ${c.n} câu</p><button data-action="ch-del" data-id="${c.id}" class="shrink-0 px-2 py-0.5 rounded-lg text-[11px] font-bold bg-white/80 text-slate-500" aria-label="Xóa thông báo">🗑 Xóa</button></div><div class="flex gap-2"><button data-action="ch-accept" data-id="${c.id}" class="px-3 py-1.5 rounded-lg text-[11px] font-bold bg-emerald-600 text-white keep-white">Chấp nhận</button><button data-action="ch-decline" data-id="${c.id}" class="px-3 py-1.5 rounded-lg text-[11px] font-bold bg-slate-200 text-slate-700">Từ chối</button></div></div>`; }).join("")}
      ${ready.map((c) => { const f = friendById(c.fid); return `<div class="p-3 rounded-xl border border-emerald-300 bg-emerald-50 flex items-center justify-between gap-2"><p class="text-xs font-bold text-emerald-900">✅ ${esc(f.name)} sẵn sàng · ${c.n} câu</p><div class="flex gap-1.5 shrink-0"><button data-action="ch-play" data-id="${c.id}" class="px-3 py-1.5 rounded-lg text-[11px] font-bold bg-emerald-600 text-white keep-white">Vào thi</button><button data-action="ch-del" data-id="${c.id}" class="px-2 py-1.5 rounded-lg text-[11px] font-bold bg-white/80 text-slate-500" aria-label="Xóa thông báo">🗑</button></div></div>`; }).join("")}
      <div class="grid grid-cols-1 md:grid-cols-2 gap-2">${rows.slice(0, 7).map(row).join("")}</div>
      <button data-action="open-duel" style="background:#334155" class="w-full py-2 text-white keep-white rounded-xl text-xs font-bold">⚔️ Phòng thách đấu</button>
    </div>`;
  }
  function refreshFriends() {
    const el = $("#friends-card");
    if (el && ui.tab === "community" && !ui.renderModal) el.innerHTML = friendsCard();
    const hb = $("#hub-body");
    if (hb && ui.tab === "entertainment" && !ui.renderModal && (ui.hubTab === "mine" || ui.hubTab === "groups")) { const h = hubBody(); if (hb.dataset.h !== h) { hb.innerHTML = h; hb.dataset.h = h; } }
    const dc = $("#duel-card");
    if (dc && ui.tab === "entertainment" && !ui.renderModal) {
      const h = duelCard();
      if (dc.dataset.h !== h) { dc.innerHTML = h; dc.dataset.h = h; }
    }
    bblRefresh();
  }
  Object.assign(actions, {
    "toggle-friends": () => { ui.friendsOpen = !ui.friendsOpen; refreshFriends(); },
    "open-premium": () => openModal(premiumModal),
    "buy-premium": () => { buyPremium(); },
    "poke-friend": (el) => { if (pokeFriend(el.dataset.id)) pokeFx(el); },
    "open-duel": () => { if (typeof window.__s1aOpen === "function") window.__s1aOpen({}); },
    "duel-friend": (el) => {
      if (!isPremium()) { openModal(premiumModal); return; }
      if (typeof window.__s1aOpen === "function") window.__s1aOpen({ duelFriend: el.dataset.id });
    },
    "ch-accept": (el) => { CH.respond(el.dataset.id, true); toast("Đã chấp nhận! Bấm \"Vào thi\" khi bạn sẵn sàng."); },
    "ch-decline": (el) => { CH.respond(el.dataset.id, false); toast("Đã từ chối lời thách đấu"); },
    "ch-play": (el) => {
      const c = CH.get(el.dataset.id), route = c && c.gid ? { duelGroup: c.gid } : { duel: el.dataset.id };
      if (c && c.lesson && c.lesson !== "s1a-1" && typeof window.__openLessonByKey === "function") { window.__openLessonByKey(c.lesson, route); return; }
      if (typeof window.__s1aOpen === "function") window.__s1aOpen(route);
    },
    "ch-del": (el) => { if (CH.remove(el.dataset.id)) toast("Đã xóa thông báo"); },
    "ch-clear": () => { const n = CH.clearNotices(); toast(n ? "Đã xóa tất cả thông báo" : "Không có thông báo để xóa"); },
    "open-chat": (el) => openChat({ type: "dm", id: el.dataset.id }),
    "open-world": () => openChat({ type: "world", id: "world" }),
    "open-group": (el) => openChat({ type: "group", id: el.dataset.id }),
    "open-grp-create": () => openModal(grpCreateModal),
    "grp-create": () => {
      const name = val("grp-name"), members = [...document.querySelectorAll(".grp-chk:checked")].map((x) => x.value);
      if (name.length < 2) { toast("Tên nhóm cần tối thiểu 2 ký tự"); return; }
      if (!members.length) { toast("Hãy chọn ít nhất 1 thành viên"); return; }
      const g = { id: uid("gp"), name, members, ts: Date.now() };
      socialState().groups.unshift(g);
      commit();
      openChat({ type: "group", id: g.id });
      toast("Đã tạo nhóm chat");
    },
    "grp-del": (el) => {
      if (!window.confirm("Xóa nhóm chat này?")) return;
      const s = socialState();
      s.groups = s.groups.filter((g) => g.id !== el.dataset.id);
      delete s.msgs["grp:" + el.dataset.id];
      commit();
      closeModal();
      toast("Đã xóa nhóm");
    },
    "msg-send": () => { const i = $("#msg-input"); if (i && sendChat(i.value)) { refreshModal(); scrollChat(); if (isAdmin()) admBurst(); } }
  });
