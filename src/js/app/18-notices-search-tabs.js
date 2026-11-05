/*@file js/app/18-notices-search-tabs.js
 * Thông báo, tìm kiếm toàn app và chuyển tab (renderTab/showTab).
 */
  function renderNotices() {
    const panel = $("#notice-panel");
    if (!panel) return;
    const items = state.notices;
    panel.innerHTML = `
  <div class="flex items-center justify-between px-4 py-3 border-b border-slate-100">
    <h3 class="font-extrabold text-sm text-slate-800">Th\xF4ng b\xE1o</h3>
    <button data-action="read-all" class="text-[11px] font-semibold text-sky-600">\u0110\xE1nh d\u1EA5u \u0111\xE3 \u0111\u1ECDc</button>
  </div>
  ${items.length ? items.map((n) => `
  <div class="flex gap-3 px-4 py-2.5 border-b border-slate-100 last:border-0 ${n.read ? "" : "bg-sky-50/50"}">
    <span class="text-lg">${n.icon}</span>
    <div class="min-w-0"><p class="text-xs text-slate-700 ${n.read ? "" : "font-semibold"}">${esc(n.title)}</p><p class="text-[10px] text-slate-400">${timeAgo(n.ts)}</p></div>
  </div>`).join("") : '<p class="text-xs text-slate-500 text-center py-6">B\u1EA1n kh\xF4ng c\xF3 th\xF4ng b\xE1o m\u1EDBi n\xE0o!</p>'}`;
  }
  function search(q) {
    const n = norm(q);
    if (n.length < 2) return [];
    const hits = [];
    PRODUCTS.forEach((p) => {
      if (norm(p.name + " " + p.desc).includes(n)) hits.push({ group: "S\u1EA3n ph\u1EA9m", icon: p.emoji, title: p.name, sub: money(p.price[state.settings.currency], state.settings.currency), kind: "product", id: p.id });
    });
    COURSES.forEach((c) => {
      if (norm(c.title + " " + c.badge + " " + c.desc).includes(n)) hits.push({ group: "Kh\xF3a h\u1ECDc", icon: "\u{1F393}", title: c.title, sub: c.badge, kind: "course", id: c.id });
    });
    state.listings.forEach((l) => {
      if (norm(l.title + " " + l.desc + " " + l.loc).includes(n)) hits.push({ group: "Ti\u1EC7n \xEDch", icon: l.emoji, title: l.title, sub: `${l.price} \u2022 ${l.loc}`, kind: "listing", id: l.id });
    });
    LANGUAGES.forEach((l) => {
      if (norm(l.name).includes(n) || l.certs.some((c) => norm(c.name).includes(n))) hits.push({ group: "H\u1ECDc t\u1EADp", icon: l.flag, title: l.name, sub: l.certs.map((c) => c.name).join(", "), kind: "lang", id: l.code });
      l.vocab.forEach((v) => {
        if (norm(v.term + " " + v.meaning).includes(n)) hits.push({ group: "H\u1ECDc t\u1EADp", icon: l.flag, title: `${v.term} \u2014 ${v.meaning}`, sub: `T\u1EEB v\u1EF1ng ${l.name}`, kind: "lang", id: l.code });
      });
    });
    TOOLS.forEach((t) => {
      if (norm(t.title + " " + t.sub).includes(n)) hits.push({ group: "Ti\u1EC7n \xEDch", icon: t.emoji, title: t.title, sub: t.sub, kind: "tool", id: t.id });
    });
    state.posts.forEach((p) => {
      if (norm(p.text + " " + p.author).includes(n)) hits.push({ group: "C\u1ED9ng \u0111\u1ED3ng", icon: "\u{1F4AC}", title: p.text.slice(0, 70), sub: p.author, kind: "post", id: p.id });
    });
    return hits.slice(0, 20);
  }
  function renderSearch(q) {
    const panel = $("#search-panel");
    if (!panel) return;
    const hits = search(q);
    if (norm(q).length < 2) {
      panel.classList.add("hidden");
      return;
    }
    panel.classList.remove("hidden");
    if (!hits.length) {
      panel.innerHTML = `<p class="text-xs text-slate-500 text-center py-6">Kh\xF4ng c\xF3 k\u1EBFt qu\u1EA3 cho \u201C${esc(q)}\u201D.</p>`;
      return;
    }
    let last = "";
    panel.innerHTML = hits.map((h) => {
      const head = h.group !== last ? `<p class="px-4 pt-3 pb-1 text-[10px] font-extrabold uppercase tracking-wider text-sky-700">${h.group}</p>` : "";
      last = h.group;
      return `${head}<button data-action="open-result" data-kind="${h.kind}" data-id="${esc(h.id)}" class="w-full text-left flex items-center gap-3 px-4 py-2 hover:bg-sky-50">
      <span class="text-xl">${h.icon}</span><span class="min-w-0"><span class="block text-xs font-bold text-slate-800 truncate">${esc(h.title)}</span><span class="block text-[10px] text-slate-500 truncate">${esc(h.sub)}</span></span></button>`;
    }).join("");
  }
  function renderTab(tab) {
    switch (tab) {
      case "home":
        renderHome();
        break;
      case "learn":
        renderLearn();
        break;
      case "shop":
        renderShop();
        break;
      case "entertainment":
        renderEntertainment();
        break;
      case "tasks":
        renderTasks();
        break;
      case "utilities":
        renderUtilities();
        break;
      case "community":
        renderCommunity();
        break;
      case "wallet":
        renderWallet();
        break;
    }
  }
  function showTab(tab) {
    TABS.forEach((t) => $(`#tab-${t}`)?.classList.toggle("hidden", t !== tab));
  }

