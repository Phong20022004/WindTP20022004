/*@file js/app/16-utilities-and-tasks.js
 * Tab Tiện ích: danh mục, tin đăng, thẻ nhiệm vụ.
 */
  var UTIL_CATS = [
    ["all", "🌟 Tất Cả"],
    ["market", "🏷️ Chợ Đồ Cũ"],
    ["jobs", "🧑‍💻 Việc Làm HS/SV"],
    ["housing", "🏡 Tìm & Nhượng Phòng"],
    ["other", "🧰 Tiện Ích Khác"],
  ];
  var SPECIAL_CATS = ["other"];
  var CUSTOM_BADGE = { label: "Danh m\u1EE5c ri\xEAng", badge: "bg-purple-100 text-purple-800", price: "text-purple-600" };
  function badgeFor(cat) {
    if (cat in LISTING_BADGE) return LISTING_BADGE[cat];
    const c = state.customCats.find((x) => x.id === cat);
    return { ...CUSTOM_BADGE, label: c ? c.name : CUSTOM_BADGE.label };
  }
  var LISTING_BADGE = {
    market: { label: "Ch\u1EE3 \u0110\u1ED3 C\u0169", badge: "bg-teal-100 text-teal-800", price: "text-teal-600" },
    jobs: { label: "Vi\u1EC7c L\xE0m", badge: "bg-blue-100 text-blue-800", price: "text-blue-600" },
    housing: { label: "Ph\xF2ng Tr\u1ECD", badge: "bg-orange-100 text-orange-800", price: "text-teal-600" }
  };
  var TASK_GOTO = { "t-duel": "entertainment", "t-lessons": "learn", "t-game": "learn", "t-win": "entertainment", "t-post": "community", "t-shop": "shop", "t-bigshop": "shop" };
  var TOOLS = [
    { id: "pomodoro", emoji: "🍅", title: "\u0110\u1ED3ng H\u1ED3 Pomodoro", sub: "T\u1EADp trung 25 ph\xFAt, ngh\u1EC9 5 ph\xFAt" },
    { id: "reminders", emoji: "🔔", title: "L\u1ECBch Nh\u1EAFc Nh\u1EDF & Th\u1EDDi Kh\xF3a Bi\u1EC3u", sub: "Ghi vi\u1EC7c c\u1EA7n l\xE0m theo ng\xE0y gi\u1EDD" },
    { id: "gpa", emoji: "🎓", title: "T\xEDnh \u0110i\u1EC3m Trung B\xECnh (GPA)", sub: "\u0110i\u1EC3m c\xF3 tr\u1ECDng s\u1ED1 theo t\xEDn ch\u1EC9" }
  ];
  function listingCard_(l) {
    const b = badgeFor(l.cat);
    return `
  <div data-action="open-listing" data-id="${l.id}" role="button" tabindex="0" class="glass-card rounded-2xl p-3.5 flex gap-3 items-center hover:shadow-md transition-all cursor-pointer">
    ${thumb(l.img, l.emoji, "w-20 h-20 rounded-xl shrink-0")}
    <div class="flex-1 min-w-0">
      <span class="text-[9px] ${b.badge} px-1.5 py-0.5 rounded font-bold">${b.label}</span>${state.saved.includes(l.id) ? ' <span class="text-[10px]">\u{1F516}</span>' : ""}
      <h4 class="text-xs font-bold text-slate-800 truncate mt-0.5">${esc(l.title)}</h4>
      <p class="text-xs font-extrabold ${b.price} mt-1">${esc(l.price)}</p>
      <p class="text-[10px] text-slate-400">${esc(l.loc)} \u2022 ${timeAgo(l.ts)}</p>
    </div>
  </div>`;
  }
  function taskCard(t) {
    const prog = Math.min(t.progress(), t.goal);
    const claimed = state.daily.claimed.includes(t.id);
    const complete = prog >= t.goal;
    let btn;
    if (claimed) btn = '<span class="text-[11px] font-bold text-slate-400">\u2713 \u0110\xE3 nh\u1EADn</span>';
    else if (complete) btn = `<button data-action="claim-task" data-id="${t.id}" class="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white keep-white rounded-lg text-[11px] font-bold">Nhận +${fmt(t.reward)} Xu${t.chips ? " + " + fmt(t.chips) + " chip" : ""}</button>`;
    else if (t.id === "t-checkin") btn = '<button data-action="check-in" class="px-3 py-1 bg-sky-600 hover:bg-sky-700 text-white keep-white rounded-lg text-[11px] font-bold">\u0110i\u1EC3m danh</button>';
    else btn = `<button data-action="goto" data-tab="${TASK_GOTO[t.id]}" class="px-3 py-1 bg-white border border-emerald-300 text-emerald-700 rounded-lg text-[11px] font-bold">\u0110i t\u1EDBi</button>`;
    return `
  <div class="glass-card rounded-2xl p-3.5 flex gap-3 items-center">
    <div class="w-20 h-20 rounded-2xl wd-tile flex items-center justify-center text-3xl shrink-0" style="--c1:${(TASK_STYLE[t.id] || TASK_STYLE.def)[1]};--c2:${(TASK_STYLE[t.id] || TASK_STYLE.def)[2]}"><span class="wd-tile-i">${(TASK_STYLE[t.id] || TASK_STYLE.def)[0]}</span></div>
    <div class="flex-1 min-w-0">
      <span class="text-[9px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-bold">Nhi\u1EC7m V\u1EE5 \u2022 L\xE0m m\u1EDBi m\u1ED7i ng\xE0y</span>
      <h4 class="text-xs font-bold text-slate-800 mt-0.5">${t.title}</h4>
      <p class="text-xs font-extrabold text-emerald-600">+${fmt(t.reward)} Xu${t.chips ? " + " + fmt(t.chips) + " chip" : ""} Th\u01B0\u1EDFng</p>
      <div class="flex items-center gap-2 mt-1"><div class="flex-1 h-1.5 rounded-full bg-slate-200 overflow-hidden"><div class="h-full bg-emerald-500" style="width:${Math.min(100, prog / t.goal * 100)}%"></div></div><span class="text-[10px] text-slate-500 whitespace-nowrap">${t.id === "t-bigshop" ? (prog > 0 ? `${money(prog, t.currencyProgress || state.settings.currency)} / ${money(t.goal, t.currencyProgress || state.settings.currency)}` : "Chưa mua hàng") : `${prog}/${t.goal}`}</span></div>
      <div class="flex items-center justify-between mt-1.5 gap-2"><span class="text-[10px] text-slate-400 line-clamp-1">${t.hint}</span>${btn}</div>
    </div>
  </div>`;
  }
  function renderTasks_() {
    const el = $("#tab-tasks");
    if (!el) return;
    const list = tasks();
    el.innerHTML = `
      <div class="rounded-3xl bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-600 p-5 text-white keep-white shadow-lg">
        <p class="text-xs uppercase tracking-wider font-extrabold opacity-90">WINDTP Rewards</p>
        <h2 class="text-2xl font-black mt-1">Nhiệm vụ hằng ngày</h2>
        <p class="text-sm mt-2 opacity-95">Học tập, mua sắm tại WIND Shop và nhận thưởng WIND Coin.</p>
        <div class="mt-4 flex items-center gap-2"><span class="wind-coin-mark" role="img" aria-label="WIND Coin"><span class="wind-coin-mark__w">W</span></span><span class="text-sm font-bold">Thưởng minh bạch · Làm mới mỗi ngày</span></div>
      </div>
      <div class="grid grid-cols-1 xl:grid-cols-2 gap-3">${list.map((t) => taskCard(t)).join("")}</div>
      ${fbShareHtml()}`;
  }

  function renderUtilities() {
    const el = $("#tab-utilities");
    if (!el) return;
    const cat = ui.utilCat;
    const parts = [];
    const sortedListings = [...state.listings].filter((l) => l.status !== "pending" && l.status !== "rejected").sort((a, b) => b.ts - a.ts);
    if (cat === "all" || !SPECIAL_CATS.includes(cat)) {
      sortedListings.filter((l) => cat === "all" || l.cat === cat).filter(utilGeoOk).forEach((l) => parts.push(listingCard(l)));
    }
    const custom = state.customCats.find((c) => c.id === cat);
    if ((cat === "all" || cat === "other") && !(ui.ug && (ui.ug.q || ui.ug.country || ui.ug.region))) TOOLS.forEach((t) => parts.push(`
    <div data-action="open-tool" data-tool="${t.id}" role="button" tabindex="0" class="glass-card rounded-2xl p-3.5 flex gap-3 items-center hover:shadow-md transition-all cursor-pointer">
      <div class="w-20 h-20 rounded-2xl wd-tile flex items-center justify-center text-3xl shrink-0" style="--c1:#a78bfa;--c2:#4f46e5"><span class="wd-tile-i">${t.emoji}</span></div>
      <div class="flex-1 min-w-0">
        <span class="text-[9px] bg-purple-100 text-purple-800 px-1.5 py-0.5 rounded font-bold">Ti\u1EC7n \xCDch Kh\xE1c</span>
        <h4 class="text-xs font-bold text-slate-800 mt-0.5">${t.title}</h4>
        <p class="text-xs font-extrabold text-purple-600 mt-1">Mi\u1EC5n Ph\xED S\u1EED D\u1EE5ng</p>
        <p class="text-[10px] text-slate-400">${t.sub}</p>
      </div>
    </div>`));
    el.innerHTML = `
  <div class="flex items-center justify-between gap-3">
    <div>
      <h2 class="text-lg font-extrabold text-slate-800">\u{1F6E0}\uFE0F Ti\u1EC7n \xCDch \u0110a N\u0103ng WINDTP</h2>
      <p class="text-xs text-slate-500">Ch\u1EE3 \u0111\u1ED3 c\u0169, vi\u1EC7c l\xE0m, ph\xF2ng tr\u1ECD v\xE0 c\xE1c ti\u1EC7n \xEDch m\u1EDF r\u1ED9ng. M\u1ECDi tin \u0111\u0103ng \u0111\u1EC1u ch\u1EDD ch\u1EE7 qu\u1EA3n ki\u1EC3m duy\u1EC7t tr\u01B0\u1EDBc khi hi\u1EC3n th\u1ECB.</p>
    </div>
    <button data-action="open-post-listing" class="px-3.5 py-1.5 bg-teal-600 hover:bg-teal-700 text-white keep-white text-xs font-bold rounded-xl shadow-sm whitespace-nowrap">+ \u0110\u0103ng tin ngay</button>
  </div>
  <div class="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
    ${[...UTIL_CATS, ...state.customCats.map((c) => [c.id, `${c.emoji} ${esc(c.name)}`])].map(([k, label]) => `<button data-action="util-cat" data-cat="${k}" aria-pressed="${cat === k}" class="px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap ${cat === k ? "bg-teal-600 text-white keep-white" : "bg-white border border-slate-200 text-slate-700 hover:bg-teal-50"}">${label}</button>`).join("")}
    <button data-action="open-category" class="px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap border border-dashed border-teal-400 text-teal-700 bg-white hover:bg-teal-50">\uFF0B T\u1EA1o danh m\u1EE5c</button>
  </div>
  ${custom ? `<div class="flex items-center justify-between text-xs text-slate-500"><span>Danh m\u1EE5c do b\u1EA1n t\u1EA1o: <b class="text-slate-700">${custom.emoji} ${esc(custom.name)}</b></span><button data-action="delete-category" data-id="${custom.id}" class="font-bold text-rose-500 hover:text-rose-600">X\xF3a danh m\u1EE5c</button></div>` : ""}
  ${isAdmin() ? modCard() : ""}
  ${utilSearchBar()}
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">${parts.join("") || '<p class="col-span-full text-center text-sm text-slate-500 py-10">Ch\u01B0a c\xF3 m\u1EE5c n\xE0o trong danh m\u1EE5c n\xE0y.</p>'}</div>`;
  }
