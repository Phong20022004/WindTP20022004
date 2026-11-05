/*@file js/app/45-social-tick-and-chat.js
 * Nhịp hoạt động xã hội, dữ liệu và modal chat, gửi tin.
 */
  function socialTick() {
    const now = Date.now(), s = socialState();
    let changed = false;
    s.challenges.forEach((ch) => {
      const f = friendById(ch.fid);
      if (!f) return;
      if (ch.dir === "out" && ch.status === "pending" && now >= ch.replyAt) {
        const ok = Math.random() < f.accept;
        ch.status = ok ? "accepted" : "declined";
        notify(ok ? "✅" : "\u{1F6AB}", ok ? `${f.name} đã chấp nhận thách đấu của bạn!` : `${f.name} đã từ chối lời thách đấu.`);
        toast(ok ? `✅ ${f.name} chấp nhận thách đấu!` : `\u{1F6AB} ${f.name} từ chối thách đấu`);
        changed = true;
      }
      if (ch.dir === "in" && ch.status === "pending" && now - ch.ts > 10 * 6e4) { ch.status = "expired"; changed = true; }
    });
    if (isPremium() && !s.challenges.some((c) => c.dir === "in" && c.status === "pending") && Math.random() < .12) {
      const on = FRIENDS.filter((f) => friendOnline(f));
      if (on.length) {
        const f = on[Math.floor(Math.random() * on.length)];
        s.challenges.unshift({ id: uid("ch"), dir: "in", fid: f.id, n: [10, 15, 20][Math.floor(Math.random() * 3)], seed: Math.floor(Math.random() * 2147483647), ts: now, status: "pending", my: null, their: null, lesson: "s1a-1" });
        notify("⚔️", `${f.name} thách đấu bạn! Mở Giải trí → Thách đấu để chấp nhận, từ chối hoặc xóa.`);
        toast(`⚔️ ${f.name} thách đấu bạn!`);
        changed = true;
      }
    }
    if (changed) challengeChanged();
  }
  // ----- chat: tin nhắn riêng, nhóm, kênh Thế giới -----
  var CHAT_REPLIES = ["Chào bạn! 👋", "Mình đang ôn Bài 1 Seoul Korean nè, bạn học tới đâu rồi?", "Haha, để mình thử thách đấu với bạn sau nhé ⚔️", "Cố lên nha, mình cũng đang học từ vựng đây 💪", "Ok bạn, lát mình nhắn lại nhé!", "Bạn có nhớ từ mới hôm qua không? Mình quên mất vài từ rồi 😅"];
  var WORLD_REPLIES = ["Chào cả nhà! 👋", "Ai đang ôn TOEIC không, rủ nhau học nè", "Hôm nay mình học được 20 từ mới 🎉", "Có ai thi HSK tháng này không?", "Cố lên mọi người ơi 💪", "Mình vừa thắng một trận thách đấu, vui quá ⚔️", "Chúc cả nhà một ngày học tốt ☀️"];
  function chatKey(t) { return t.type === "world" ? "world" : t.type === "group" ? "grp:" + t.id : t.id; }
  function chatMeta() {
    const t = ui.chat;
    if (!t) return null;
    if (t.type === "world") return { title: "🌍 Thế giới", sub: "Kênh chung · mọi người cùng trò chuyện", names: true };
    if (t.type === "group") {
      const g = socialState().groups.find((x) => x.id === t.id);
      return g ? { title: "👥 " + g.name, sub: `${g.members.length + 1} thành viên: Bạn, ${g.members.map((id) => (friendById(id) || { name: "?" }).name).join(", ")}`, names: true, g } : null;
    }
    const f = friendById(t.id);
    return f ? { title: "💬 " + f.name, sub: friendOnline(f) ? "● Đang online" : "○ Offline · bạn ấy sẽ thấy tin khi online", names: false, f } : null;
  }
  function chatModal() {
    const m = chatMeta();
    if (!m) return `${modalHead("💬 Tin nhắn")}<div class="p-5 text-xs text-slate-500">Không tìm thấy cuộc trò chuyện.</div>`;
    const list = socialState().msgs[chatKey(ui.chat)] || [];
    const nameOf = (from) => from === "f" && m.f ? m.f.name : (friendById(from) || { name: "Bạn bè" }).name;
    const invCard = (x, mine) => {
      const v = x.inv, nm = esc(v.name || "Game bài"), ok = v.st === "ok";
      return `<div class="flex ${mine ? "justify-end" : "justify-start"}"><div style="max-width:86%;min-width:210px;border-radius:16px;padding:10px 12px;font-size:12px;background:linear-gradient(135deg,#0f3d33,#0b2a3a);color:#e8fff6;border:1px solid #2fd6a6;box-shadow:0 2px 10px rgba(16,185,129,.25)">
        <p style="font-weight:800;margin:0 0 2px">🎮 Lời mời chơi bài ${ok ? '<span style="font-size:10px;background:#16a34a;color:#fff;border-radius:99px;padding:1px 7px;margin-left:4px">Bạn bè đã nhận lời</span>' : '<span style="font-size:10px;background:#b45309;color:#fff;border-radius:99px;padding:1px 7px;margin-left:4px">Đang chờ</span>'}</p>
        <p style="margin:0;opacity:.9">${nm} · bàn ${v.n} người · cược ${fmt(v.b)} chip</p>
        <p style="margin:2px 0 8px">ID bàn: <b style="letter-spacing:.08em;font-size:14px;color:#ffe08a">${esc(v.id)}</b></p>
        <div style="display:flex;gap:6px;flex-wrap:wrap"><button data-action="join-room" data-room="${esc(v.id)}|${esc(v.g)}|${v.n}|${v.b}" style="background:linear-gradient(#34d399,#059669);color:#fff;border:0;border-radius:10px;padding:6px 12px;font-weight:800;font-size:11px">▶ Vào bàn</button><button data-action="copy-acc" data-text="${esc(v.id)}" style="background:rgba(255,255,255,.12);color:#fff;border:1px solid rgba(255,255,255,.35);border-radius:10px;padding:6px 10px;font-weight:700;font-size:11px">Sao chép ID</button>${v.url ? `<button data-action="copy-acc" data-text="${esc(v.url + "#room=" + v.id + "&c=" + v.g + "-" + v.n + "-" + v.b)}" style="background:rgba(255,255,255,.12);color:#fff;border:1px solid rgba(255,255,255,.35);border-radius:10px;padding:6px 10px;font-weight:700;font-size:11px">Sao chép link</button>` : ""}</div></div></div>`;
    };
    const bubbles = list.length ? list.map((x) => x.inv ? invCard(x, x.from === "me") : x.from === "me"
      ? (x.adm ? `<div class="flex justify-end"><div class="max-w-[80%]"><p class="text-[10px] font-extrabold text-amber-600 text-right mb-0.5">👑 BigBoss</p><div class="adm-bubble px-3 py-2 rounded-2xl text-xs text-white keep-white break-words${Date.now() - x.ts < 4000 ? " adm-pop" : ""}">${esc(x.t)}</div></div></div>` : `<div class="flex justify-end"><div class="max-w-[80%] px-3 py-2 rounded-2xl text-xs bg-sky-600 text-white keep-white break-words">${esc(x.t)}</div></div>`)
      : `<div class="flex justify-start"><div class="max-w-[80%]">${m.names ? `<p class="text-[10px] font-bold text-slate-500 mb-0.5">${esc(nameOf(x.from))}</p>` : ""}<div class="px-3 py-2 rounded-2xl text-xs bg-slate-100 text-slate-800 break-words">${esc(x.t)}</div></div></div>`).join("") : `<p class="text-center text-[11px] text-slate-400 py-6">Chưa có tin nhắn. Hãy nói xin chào!</p>`;
    return `${modalHead(esc(m.title))}<div class="p-4 space-y-3"><div class="flex items-start justify-between gap-2"><p class="text-[11px] font-bold text-slate-500">${esc(m.sub)}</p>${m.g ? `<button data-action="grp-del" data-id="${m.g.id}" class="shrink-0 px-2 py-1 rounded-lg text-[10px] font-bold bg-rose-50 text-rose-600">🗑 Xóa nhóm</button>` : ""}</div>
      <div id="chat-log" class="space-y-2 max-h-[45vh] overflow-y-auto">${bubbles}</div>
      <div class="flex gap-2"><input id="msg-input" data-autofocus maxlength="300" autocomplete="off" placeholder="Nhập tin nhắn..." class="flex-1 min-w-0 px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white text-slate-800"><button data-action="msg-send" class="px-4 py-2 rounded-xl text-xs font-extrabold bg-sky-600 text-white keep-white">Gửi</button></div></div>`;
  }
  function sendChat(text) {
    const t = ui.chat, m = chatMeta(), body = String(text || "").trim().slice(0, 300);
    if (!t || !m || !body) return false;
    const s = socialState(), key = chatKey(t), arr = s.msgs[key] || (s.msgs[key] = []);
    arr.push({ from: "me", t: body, ts: Date.now(), adm: isAdmin() || undefined });
    const cap = t.type === "world" ? 100 : 60;
    if (arr.length > cap) arr.splice(0, arr.length - cap);
    commit();
    const pool = t.type === "dm" ? [m.f].filter((f) => friendOnline(f)) : t.type === "group" ? m.g.members.map(friendById).filter((f) => f && friendOnline(f)) : FRIENDS.filter((f) => friendOnline(f));
    if (!pool.length || (t.type === "world" && Math.random() < .25)) return true;
    const f = pool[Math.floor(Math.random() * pool.length)], target = { type: t.type, id: t.id };
    window.setTimeout(() => {
      const a = socialState().msgs[key] || (socialState().msgs[key] = []);
      const bank = target.type === "world" ? WORLD_REPLIES : CHAT_REPLIES;
      a.push({ from: f.id, t: bank[Math.floor(Math.random() * bank.length)], ts: Date.now() });
      commit();
      if (ui.renderModal === chatModal && ui.chat && ui.chat.type === target.type && ui.chat.id === target.id) { refreshModal(); scrollChat(); }
      else if (target.type !== "world") notify("💬", `${f.name} đã nhắn tin${target.type === "group" ? " trong nhóm" : " cho bạn"}`);
    }, 1500 + Math.random() * 2500);
    return true;
  }
