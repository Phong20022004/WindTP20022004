/*@file js/app/05-store-state-and-rewards.js
 * Trạng thái người dùng (state), lưu/đọc localStorage, điểm danh, nhiệm vụ ngày, thưởng Xu.
 */
  // src/store.ts
  var KEY = "windtp-super-app-v2";
  var VERSION = 4;
  function freshDaily(day) {
    return { day, checkedIn: false, lessons: [], games: 0, posts: 0, purchases: 0, bigOrder: false, bigOrderAmount: 0, bigOrderCurrency: "", gameWins: 0, claimed: [], certRewards: [] };
  }
  function seed() {
    const now = Date.now();
    const today = dateKey();
    return {
      version: VERSION,
      userName: "Nguy\u1EC5n V\u0103n A",
      balance: 125e4,
      history: [
        { id: "tx-seed-2", title: "Th\u01B0\u1EDFng nhi\u1EC7m v\u1EE5: \u0110\u0103ng nh\u1EADp h\xF4m nay", amount: 1e4, kind: "in", ts: now - 60 * 6e4 },
        { id: "tx-seed-1", title: "Mua S\u1ED5 Tay Ng\u1EEF Ph\xE1p WINDTP", amount: 8e4, kind: "out", ts: now - 14 * 36e5 }
      ],
      cart: {},
      owned: [],
      lang: null,
      known: {},
      daily: freshDaily(today),
      streak: 0,
      lastCheckIn: "",
      lastLogin: today,
      firstTopupDone: false,
      posts: seedPosts(now),
      listings: seedListings(now).map((l) => ({ ...l, status: "approved" })),
      saved: [],
      reminders: [],
      notices: [
        { id: "n-1", icon: "\u{1F381}", title: "Ch\xE0o m\u1EEBng b\u1EA1n \u0111\u1EBFn v\u1EDBi WINDTP! Ho\xE0n th\xE0nh nhi\u1EC7m v\u1EE5 m\u1ED7i ng\xE0y \u0111\u1EC3 nh\u1EADn Xu.", ts: now - 5 * 6e4, read: false },
        { id: "n-2", icon: "\u{1F3AF}", title: "Nhi\u1EC7m v\u1EE5 h\u1EB1ng ng\xE0y \u0111\xE3 s\u1EB5n s\xE0ng, v\xE0o Ti\u1EC7n \xEDch > Nhi\u1EC7m v\u1EE5 \u0111\u1EC3 nh\u1EADn Xu.", ts: now - 30 * 6e4, read: false }
      ],
      invited: [],
      referralCommission: 0,
      settings: { dark: false, sound: true, sfx: true, push: true, gender: "", birth: "", currency: ((Intl.DateTimeFormat().resolvedOptions().timeZone || "").includes("Tokyo") ? "JPY" : ((Intl.DateTimeFormat().resolvedOptions().timeZone || "").includes("Seoul") ? "KRW" : "VND")) },
      orders: [],
      customCats: [],
      loginStreak: 1,
      cultivationLevel: 0,
      cultivationLastPenalty: "",
      streakRewardsClaimed: [],
      avatarId: "default",
      frameId: "none",
      ownedAvatars: [],
      ownedFrames: [],
      premiumUntil: 0,
      chips: 0,
      courseAccess: {},
      social: { challenges: [], record: {}, pokes: {}, points: 0 }
    };
  }
  var SHARED = ["postsCleared", "refRewarded", "users", "posts", "listings", "orders", "customProducts", "customCats", "customTasks", "taskClaims", "payouts", "credits", "productEdits", "fbShares"];
  function ukey(e) { return KEY + "::u::" + String(e || "").toLowerCase(); }
  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed.version === "number" && parsed.version >= 2) {
          const base = seed(); let personal = parsed, shared = {};
          if (parsed.shared) { shared = parsed.shared; personal = {}; const a = parsed.account; if (a && a.email) { try { personal = JSON.parse(localStorage.getItem(ukey(a.email)) || "{}"); } catch { } } }
          else SHARED.forEach((k) => { if (parsed[k] !== undefined) shared[k] = parsed[k]; });
          return { ...base, ...personal, ...shared, account: parsed.account || null, version: VERSION, settings: { ...base.settings, ...personal.settings }, daily: { ...base.daily, ...personal.daily } };
        }
      }
    } catch {
    }
    return seed();
  }
  var state = load();
  var listeners = [];
  function subscribe(fn) {
    listeners.push(fn);
  }
  function save() {
    try {
      const shared = {}, mine = {};
      Object.keys(state).forEach((k) => { if (SHARED.includes(k)) shared[k] = state[k]; else if (k !== "account") mine[k] = state[k]; });
      localStorage.setItem(KEY, JSON.stringify({ version: state.version, account: state.account, shared }));
      if (state.account && state.account.email) localStorage.setItem(ukey(state.account.email), JSON.stringify(mine));
      return true;
    } catch {
      return false;
    }
  }
  function commit() {
    guardAdminCosmetics();
    save();
    listeners.forEach((fn) => fn());
  }
  function resetAll() {
    try {
      localStorage.removeItem(KEY);
    } catch {
    }
    Object.assign(state, seed());
    commit();
  }
  function notify(icon, title) {
    state.notices.unshift({ id: uid("n"), icon, title, ts: Date.now(), read: false });
    if (state.notices.length > 40) state.notices.length = 40;
  }
  function earn(amount, title) {
    state.balance += amount;
    state.history.unshift({ id: uid("tx"), title, amount, kind: "in", ts: Date.now() });
    notify("\u{1FA99}", `${title}: +${amount.toLocaleString("en-US")} Xu`);
    sfx("coin");
  }
  function spend(amount, title) {
    if (amount <= 0 || amount > state.balance) return false;
    state.balance -= amount;
    state.history.unshift({ id: uid("tx"), title, amount, kind: "out", ts: Date.now() });
    return true;
  }
  const CULTIVATION_RANKS = [
    { name: "Luyện Khí", badge: "炼", days: 0 },
    { name: "Trúc Cơ", badge: "筑", days: 1 },
    { name: "Kim Đan", badge: "丹", days: 7 },
    { name: "Nguyên Anh", badge: "婴", days: 15 },
    { name: "Hóa Thần", badge: "神", days: 30 },
    { name: "Luyện Hư", badge: "虚", days: 60 },
    { name: "Hợp Thể", badge: "合", days: 120 },
    { name: "Đại Thừa", badge: "乘", days: 240 },
    { name: "Độ Kiếp", badge: "劫", days: 365 }
  ];
  function realmGlyph(i, size, big) {
    const r = CULTIVATION_RANKS[i] || CULTIVATION_RANKS[0];
    return `<span class="rk rk${i}${big ? " rk-big" : ""}" style="font-size:${size}px">${r.badge}</span>`;
  }
  function cultivationIndex() {
    return Math.max(0, Math.min(CULTIVATION_RANKS.length - 1, Number(state.cultivationLevel || 0)));
  }
  function cultivationRank() {
    return CULTIVATION_RANKS[Math.max(0, Math.min(CULTIVATION_RANKS.length - 1, Number(state.cultivationLevel || 0)))];
  }
  function showRealmCelebration(rank, first = false) {
    if (!document.body) return;
    document.querySelector(".realm-celebration")?.remove();
    const layer = document.createElement("div");
    layer.className = "realm-celebration";
    layer.innerHTML = `<div class="realm-celebration-card"><span class="realm-spark">✦</span><span class="realm-spark">✧</span><span class="realm-spark">✨</span><span class="realm-spark">🌟</span><div style="margin:2px auto 10px;min-height:84px;display:grid;place-items:center">${realmGlyph(CULTIVATION_RANKS.indexOf(rank), 76, true)}</div><p style="font-size:11px;letter-spacing:.22em;font-weight:900;color:#fde68a">${first ? "BẮT ĐẦU TU TIÊN" : "ĐỘT PHÁ CẢNH GIỚI"}</p><h2 style="font-size:27px;font-weight:1000;margin:7px 0 9px">${rank.name}</h2><p style="font-size:13px;color:#f5d0fe">${first ? "Bạn đã nhận cảnh giới đầu tiên! Hành trình tu luyện bắt đầu." : "Chúc mừng đạo hữu! Linh lực bùng nổ, cảnh giới đã tăng tiến."}</p>${first ? "" : `<div style="margin:16px 0 4px;display:flex;flex-direction:column;align-items:center;gap:10px"><div style="padding:10px">${renderPfp(state.userName, state.avatarId, "r-" + CULTIVATION_RANKS.indexOf(rank), 92)}</div><p style="font-size:12px;font-weight:800;color:#fde68a">🎁 Khung avatar mới: ${frameById("r-" + CULTIVATION_RANKS.indexOf(rank)).name}</p></div>`}<p style="margin:12px 0 16px;font-size:26px">🌈 ⚡ 🪷</p><button id="realm-celebration-close" style="background:linear-gradient(90deg,#fef08a,#fbbf24);color:#581c87;border-radius:14px;padding:10px 24px;font-weight:900">Tiếp tục tu luyện</button></div>`;
    document.body.appendChild(layer);
    layer.querySelector("#realm-celebration-close").addEventListener("click", () => layer.remove());
    layer.addEventListener("click", (e) => { if (e.target === layer) layer.remove(); });
    window.setTimeout(() => layer.isConnected && layer.remove(), 9000);
  }
  function cultivationModal() {
    const current = Number(state.cultivationLevel || 0);
    return `${modalHead("🌌 Hệ thống cảnh giới tu tiên")}<div class="p-4 space-y-3 text-xs"><div class="rounded-2xl p-3 text-center text-white" style="background:linear-gradient(120deg,#312e81,#7e22ce,#be185d)"><div style="min-height:56px;display:grid;place-items:center">${realmGlyph(cultivationIndex(), 46, true)}</div><p class="text-lg font-black">${cultivationRank().name}</p><p>Chuỗi đăng nhập hiện tại: ${Number(state.loginStreak || 1)} ngày</p></div><div class="rounded-xl border border-rose-200 bg-rose-50 p-3 text-rose-800"><b>⚠️ Quy định tụt cảnh giới</b><p class="mt-1">Nếu không đăng nhập liên tiếp 3 ngày trở lên, bạn sẽ bị hạ 1 cảnh giới. Đăng nhập trở lại sẽ bắt đầu tính chuỗi mới.</p></div><div class="space-y-2">${CULTIVATION_RANKS.map((r,i)=>`<div class="realm-row flex items-center gap-3 rounded-xl border ${i===current?'realm-row-now':i<current?'realm-row-done border-slate-200 bg-white':'realm-row-lock border-slate-200 bg-white'} p-3"${i===current?' aria-current="true"':''}><div class="grid place-items-center shrink-0" style="width:44px;height:44px">${realmGlyph(i, 28, false)}</div><div class="flex-1 min-w-0"><p class="font-black text-sm">${r.name} ${i===current?'<span class="realm-now-pill">★ Hiện tại</span>':''}</p><p class="text-slate-500">${i===0?'Cảnh giới khởi đầu':`Cần đăng nhập liên tục ${r.days} ngày`}</p></div><span class="text-base">${i<current?'✅':i===current?'🌟':'🔒'}</span></div>`).join("")}</div><p class="text-[10px] text-slate-500">Mốc tối đa: Độ Kiếp sau 365 ngày (1 năm) đăng nhập liên tục.</p><button data-action="back-settings-from-realms" class="w-full rounded-xl border border-slate-200 py-2.5 font-bold">Quay lại cài đặt</button></div>`;
  }
  function updateCultivation() {
    const today = dateKey();
    const last = state.lastLogin || today;
    if (last === today) {
      if (state.cultivationLevel == null) state.cultivationLevel = 0;
      return;
    }
    const daysAway = Math.floor((new Date(today + "T00:00:00").getTime() - new Date(last + "T00:00:00").getTime()) / 86400000);
    if (daysAway >= 3 && state.cultivationLastPenalty !== today) {
      state.cultivationLevel = Math.max(0, Number(state.cultivationLevel || 0) - 1);
      state.cultivationLastPenalty = today;
      if ((frameById(state.frameId).realm ?? -1) > state.cultivationLevel) state.frameId = "r-" + state.cultivationLevel;
      state.loginStreak = 1;
      notify("🧘", `Bế quan gián đoạn ${daysAway} ngày: cảnh giới tụt 1 cấp, hiện tại ${cultivationRank().name}.`);
    } else {
      state.loginStreak = daysAway === 1 ? Number(state.loginStreak || 1) + 1 : 1;
    }
    state.lastLogin = today;
    while (state.cultivationLevel < CULTIVATION_RANKS.length - 1 && state.loginStreak >= CULTIVATION_RANKS[state.cultivationLevel + 1].days) {
      state.cultivationLevel += 1;
      state.frameId = "r-" + state.cultivationLevel;
      notify("🏅", `Chúc mừng! Bạn đã thăng cảnh giới ${cultivationRank().name} và nhận khung avatar ${frameById(state.frameId).name}.`);
      showRealmCelebration(cultivationRank(), false);
    }
    save();
  }
  function rollDay() {
    const today = dateKey();
    if (state.daily.day !== today) state.daily = freshDaily(today);
    if (state.lastLogin !== today) updateCultivation();
    if (state.cultivationLevel == null) state.cultivationLevel = 0;
    if (!state.cultivationWelcomeShown) {
      state.cultivationWelcomeShown = true;
      window.setTimeout(() => showRealmCelebration(cultivationRank(), true), 500);
      save();
    }
  }
  function checkIn() {
    if (state.daily.checkedIn) return false;
    state.daily.checkedIn = true;
    state.streak = state.lastCheckIn === yesterdayKey() ? state.streak + 1 : 1;
    state.lastCheckIn = dateKey();
    return true;
  }
  function streakProgress() {
    return Math.min(Number(state.loginStreak || 0), Number(state.streak || 0));
  }
  function completeLesson(id) {
    if (!state.daily.lessons.includes(id)) state.daily.lessons.push(id);
  }
  function tasks() {
    const d = state.daily;
    return [
      { id: "t-checkin", icon: "\u{1F4C5}", title: "\u0110i\u1EC3m danh h\xF4m nay", reward: 200, progress: () => d.checkedIn ? 1 : 0, goal: 1, hint: state.streak > 0 ? `Chu\u1ED7i ${state.streak} ng\xE0y li\xEAn ti\u1EBFp` : "B\u1EA5m \u0111i\u1EC3m danh \u0111\u1EC3 b\u1EAFt \u0111\u1EA7u chu\u1ED7i ng\xE0y" },
      { id: "t-lessons", icon: "\u{1F4D6}", title: "Ho\xE0n th\xE0nh 3 b\xE0i h\u1ECDc", reward: 200, progress: () => d.lessons.length, goal: 3, hint: "H\u1ECDc t\u1EEB v\u1EF1ng, ng\u1EEF ph\xE1p, luy\u1EC7n t\u1EADp ho\u1EB7c gi\u1EA3i \u0111\u1EC1" },
      { id: "t-duel", icon: "⚔️", title: "Thách đấu 1 người bạn", reward: 200, progress: () => { const t0 = new Date(); t0.setHours(0, 0, 0, 0); return socialState().challenges.filter((c) => c.dir === "out" && c.ts >= t0.getTime()).length; }, goal: 1, hint: "Cần WIND Premium để gửi lời thách đấu" },
      { id: "t-shop", icon: "\u{1F6CD}\uFE0F", title: "Mua h\u00E0ng trong WIND Shop", reward: SHOP_REWARD, chips: 10000, progress: () => d.purchases, goal: 1, hint: "Thanh to\u00E1n th\u00E0nh c\u00F4ng \u0111\u01A1n h\u00E0ng b\u1EA5t k\u1EF3 trong WIND Shop" },
      { id: "t-bigshop", icon: "\u{1F4B0}", title: "Chi ti\u00EAu \u0111\u1EA1t m\u1EE9c \u01B0u \u0111\u00E3i", reward: 40000, chips: 40000, progress: () => Number(d.bigOrderAmount || 0), goal: BIG_THR[d.bigOrderCurrency || state.settings.currency], currencyProgress: d.bigOrderCurrency || state.settings.currency, hint: Number(d.bigOrderAmount || 0) > 0 ? `Đạt ${money(BIG_THR[d.bigOrderCurrency || state.settings.currency], d.bigOrderCurrency || state.settings.currency)} chi tiêu để nhận thưởng` : "Mua hàng trong WIND Store để bắt đầu tính chi tiêu" },
    ];
  }

