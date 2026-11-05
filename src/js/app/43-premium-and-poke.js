/*@file js/app/43-premium-and-poke.js
 * Premium/khóa học (mua, cấp, modal) và chọc bạn.
 */
  function selfOnline() { return (typeof navigator === "undefined" || navigator.onLine !== false) && !document.hidden; }
  function isPremium() { return Number(state.premiumUntil || 0) > Date.now(); }
  function premiumDaysLeft() { return Math.max(0, Math.ceil((Number(state.premiumUntil || 0) - Date.now()) / 864e5)); }
  function premiumLife() { return Number(state.premiumUntil || 0) >= LIFE_TS; }
  function premiumLabel() { return premiumLife() ? "trọn đời" : "còn " + premiumDaysLeft() + " ngày"; }
  function openCourses() {
    ui.shopCat = "study"; ui.shopSub = "Khóa học"; ui.shopQuery = "";
    closeModal();
    goTo("shop");
  }
  function buyPremium() {
    toast("👑 Premium đi kèm khóa học: vào Store → Khóa học và Tài liệu để mua gói.");
    openCourses();
    return false;
  }
  function addMonths(base, n) { const d = new Date(base); d.setMonth(d.getMonth() + n); return d.getTime(); }
  function grantCourse(p) {
    const plan = COURSE_PLANS.find((x) => x.id === p.plan);
    if (!plan) return;
    if (!state.courseAccess || typeof state.courseAccess !== "object") state.courseAccess = {};
    const now = Date.now();
    if (plan.life) {
      state.premiumUntil = LIFE_TS;
      state.courseAccess[p.lang] = LIFE_TS;
    } else {
      const ps = Math.max(now, Number(state.premiumUntil || 0));
      if (ps < LIFE_TS) state.premiumUntil = addMonths(ps, plan.months);
      const cs = Math.max(now, Number(state.courseAccess[p.lang] || 0));
      if (cs < LIFE_TS) state.courseAccess[p.lang] = addMonths(cs, plan.months);
    }
    state.chips = Number(state.chips || 0) + plan.chips;
    notify("👑", `${p.name}: đã mở khóa Premium ${plan.life ? "trọn đời" : plan.months + " tháng"} và tặng ${fmt(plan.chips)} chip game.`);
  }
  function premiumModal() {
    const on = isPremium();
    return `${modalHead("\u{1F451} WIND Premium")}<div class="p-5 space-y-4 text-xs">
    <div class="rounded-2xl p-4 text-white keep-white text-center" style="background:linear-gradient(135deg,#f59e0b,#ec4899 60%,#6366f1)"><div class="text-4xl">\u{1F451}</div><p class="font-extrabold text-base mt-1">${on ? `Premium ${premiumLabel()}` : "Nâng cấp học tập cùng bạn bè"}</p><p class="opacity-90 mt-1">Mở khóa khi mua khóa học</p></div>
    <ul class="space-y-2 text-slate-700"><li>⚔️ <b>Thách đấu bạn bè</b>: mời bạn, bạn chấp nhận hoặc từ chối, cả hai thi cùng một đề</li><li>\u{1F3C6} Tính điểm theo độ chính xác, tốc độ và chuỗi đúng liên tiếp</li><li>\u{1F4CA} Lịch sử đối đầu và tổng điểm thách đấu</li><li>\u{1F3B0} Tặng chip trong game theo từng gói khóa học</li></ul>
    <p class="text-slate-500">Chip hiện có: <b>${fmt(state.chips || 0)}</b>. Premium được cộng dồn khi mua thêm gói.</p>
    <button data-action="open-courses" class="w-full py-3 rounded-2xl text-white keep-white font-extrabold bg-gradient-to-r from-amber-500 to-pink-500">${on ? "Gia hạn bằng khóa học" : "Xem các gói khóa học"}</button></div>`;
  }
  // ----- chọc bạn bè -----
  function pokeFriend(id) {
    const f = friendById(id);
    if (!f) return false;
    const s = socialState();
    const last = Number(s.pokes[id] || 0);
    if (Date.now() - last < 15e3) { toast(`Đợi ${Math.ceil((15e3 - (Date.now() - last)) / 1e3)} giây nữa để chọc ${f.name} tiếp nhé`); return false; }
    s.pokes[id] = Date.now();
    commit();
    if (friendOnline(f)) {
      toast(`\u{1F449} Bạn vừa chọc ${f.name}!`);
      if (Math.random() < .7) window.setTimeout(() => { sfx("pokeback"); notify("\u{1F448}", `${f.name} chọc lại bạn!`); toast(`\u{1F448} ${f.name} chọc lại bạn!`); commit(); }, 3500 + Math.random() * 4500);
    } else {
      toast(`\u{1F449} Đã gửi lời chọc. ${f.name} sẽ thấy khi online`);
    }
    return true;
  }
  function pokeFx(el) {
    sfx("poke");
    try {
      const r = el.getBoundingClientRect(), cx = r.left + r.width / 2, cy = r.top + r.height / 2;
      [0, 140].forEach((d) => {
        const ring = document.createElement("span");
        ring.className = "poke-ring"; ring.style.left = cx + "px"; ring.style.top = cy + "px"; ring.style.animationDelay = d + "ms";
        document.body.appendChild(ring); setTimeout(() => ring.remove(), 900);
      });
      ["\u{1F449}", "\u2728", "\u{1F4A5}", "\u{1F449}", "\u2728", "\u{1F4AB}"].forEach((e, i) => {
        const p = document.createElement("span");
        p.className = "poke-fx"; p.textContent = e; p.style.left = cx + "px"; p.style.top = cy + "px";
        p.style.setProperty("--dx", (i - 2.5) * 22 + "px"); p.style.setProperty("--rot", (i - 2.5) * 18 + "deg");
        p.style.animationDelay = (i * 0.05) + "s";
        document.body.appendChild(p); setTimeout(() => p.remove(), 1400 + i * 60);
      });
      const row = el.parentElement && el.parentElement.parentElement;
      if (row && row.animate) {
        row.animate([{ transform: "translateX(0)" }, { transform: "translateX(-8px) rotate(-1.2deg)" }, { transform: "translateX(8px) rotate(1.2deg)" }, { transform: "translateX(-5px)" }, { transform: "translateX(0)" }], { duration: 520, easing: "ease-in-out" });
        row.animate([{ boxShadow: "0 0 0 0 rgba(56,189,248,.75)", backgroundColor: "rgba(56,189,248,.3)" }, { boxShadow: "0 0 0 16px rgba(56,189,248,0)", backgroundColor: "rgba(56,189,248,0)" }], { duration: 800 });
      }
      if (el.animate) el.animate([{ transform: "scale(1)" }, { transform: "scale(1.4) rotate(-14deg)" }, { transform: "scale(1)" }], { duration: 380 });
      try { navigator.vibrate && navigator.vibrate([30, 30, 30]); } catch (e) { }
    } catch (e) { }
  }
  // ----- thách đấu -----
