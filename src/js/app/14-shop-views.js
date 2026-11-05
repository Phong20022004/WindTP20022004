/*@file js/app/14-shop-views.js
 * Lọc/sắp xếp sản phẩm, gợi ý, lưới Xu và trang WIND Shop.
 */
  function matchesShop(p, q) { return !q || norm(p.name + " " + p.desc + " " + (meta(p).sub || "")).includes(q); }
  function filteredProducts() {
    const q = norm(ui.shopQuery);
    return sortedProducts(PRODUCTS.filter((p) => !p.docOf && (ui.shopCat === "all" ? (!p.plan || !!q) : (p.cat === ui.shopCat && (!p.lang || p.lang === ui.courseLang))) && (!ui.shopSub || ui.shopCat === "all" || meta(p).sub === ui.shopSub) && matchesShop(p, q)));
  }
  function emptyShop() {
    const q = norm(ui.shopQuery);
    const other = q && ui.shopCat !== "all" ? PRODUCTS.filter((p) => !p.docOf && p.cat !== ui.shopCat && matchesShop(p, q)).length : 0;
    const more = other ? ` Có <b>${other}</b> kết quả ở các gian khác. <button data-action="shop-cat" data-cat="all" class="ws-chip" data-on="1">Xem tất cả các gian</button>` : "";
    if (!q) return `<p class="col-span-full text-center text-sm text-slate-500 py-10">${ui.shopCat === "all" ? "Hãy chọn một gian hàng ở trên để xem sản phẩm." : ui.shopSub ? "Danh mục này chưa có sản phẩm. Sản phẩm sẽ sớm được cập nhật." : "Gian hàng này chưa có sản phẩm. Sản phẩm sẽ sớm được cập nhật."}</p>`;
    return `<p class="col-span-full text-center text-sm text-slate-500 py-10">Không tìm thấy sản phẩm phù hợp.${more}</p>`;
  }
  function xuNote(price, owned) {
    if (owned) return "";
    return state.balance >= price ? ' <small class="ws-ok">✅ Đủ Xu</small>' : ` <small class="ws-lack">Thiếu ${fmt(price - state.balance)} Xu</small>`;
  }
  function shopSmartBar() {
    const subs = STALL_SUBS[ui.shopCat] || [];
    const isStudy = ui.shopCat === "study";
    const subHtml = subs.length ? `${isStudy ? "" : `<button data-action="shop-sub" data-sub="" class="ws-chip" data-on="${ui.shopSub ? 0 : 1}">Tất cả</button>`}${subs.map((s) => `<button data-action="shop-sub" data-sub="${esc(s)}" class="ws-chip" data-on="${(isStudy ? (ui.shopSub || "Khóa học") === s : ui.shopSub === s) ? 1 : 0}">${esc(s)}</button>`).join("")}` : "";
    if (isStudy && !xuView()) {
      const lg = LANGUAGES.find((l) => l.code === ui.courseLang) || LANGUAGES[0];
      const until = Number(state.courseAccess && state.courseAccess[lg.code] || 0);
      const st = until >= LIFE_TS ? "trọn đời" : until > Date.now() ? "đến " + new Date(until).toLocaleDateString("vi-VN") : "";
      const langs = LANGUAGES.map((l) => `<button data-action="course-lang" data-code="${l.code}" class="ws-chip" data-on="${l.code === lg.code ? 1 : 0}">${l.flag} ${l.name}</button>`).join("");
      const info = `<span class="ws-hint">👑 Premium: ${isPremium() ? (Number(state.premiumUntil) >= LIFE_TS ? "trọn đời" : "còn " + premiumDaysLeft() + " ngày") : "chưa mở"} · 🎰 Chip: ${fmt(state.chips || 0)}${st ? " · " + lg.name + ": " + st : ""}</span>`;
      const go = st ? `<button data-action="open-course-lang" data-code="${lg.code}" class="ws-chip" data-on="1">▶ Vào học ${lg.name}</button>` : "";
      return `<div class="ws-bar">${subHtml}</div><div class="ws-bar">${langs}</div><div class="ws-bar">${info}${go}</div><div id="shop-picks"></div>`;
    }
    if (xuView()) {
      return `<div class="ws-bar">${subHtml}<button data-action="xu-afford" class="ws-chip" data-on="${ui.xuAfford ? 1 : 0}">🪙 Chỉ món đủ Xu (bạn có ${fmt(state.balance)} Xu)</button><span class="ws-hint">Món bạn đủ Xu được xếp lên đầu.</span></div>`;
    }
    const sort = `<label class="ws-sort">Sắp xếp <select data-change="shop-sort" aria-label="Sắp xếp sản phẩm" class="ws-select">${[["smart", "Phổ biến nhất"], ["new", "Mới nhất"], ["low", "Giá thấp → cao"], ["high", "Giá cao → thấp"]].map(([v, l]) => `<option value="${v}" ${ui.shopSort === v ? "selected" : ""}>${l}</option>`).join("")}</select></label>`;
    return `<div class="ws-bar">${subHtml}${sort}</div><div id="shop-picks"></div>`;
  }
  function renderShopPicks() {
    const box = $("#shop-picks");
    if (!box) return;
    if (ui.shopCat !== "all" || ui.shopQuery) { box.innerHTML = ""; return; }
    const inCart = new Set(Object.keys(state.cart).filter((id) => state.cart[id] > 0));
    const cartCats = new Set(PRODUCTS.filter((p) => inCart.has(p.id)).map((p) => p.cat));
    let title, list;
    if (inCart.size) {
      title = "💡 Gợi ý mua kèm cho giỏ hàng của bạn";
      list = PRODUCTS.filter((p) => !p.plan && !p.docOf && !inCart.has(p.id)).sort((a, b) => (cartCats.has(a.cat) ? 1 : 0) - (cartCats.has(b.cat) ? 1 : 0) || soldNum(b) - soldNum(a));
    } else {
      title = "🔥 Bán chạy nhất tuần này";
      list = PRODUCTS.filter((p) => !p.plan && !p.docOf).sort((a, b) => soldNum(b) - soldNum(a));
    }
    if (!list.length) { box.innerHTML = ""; return; }
    const cur = state.settings.currency;
    box.innerHTML = `<div class="ws-title">${title}</div><div class="ws-row">${list.slice(0, 6).map((p) => `<div class="ws-pick glass-card" data-action="open-product" data-id="${p.id}"><div class="ws-th">${productThumb(p, "w-full text-4xl")}</div><div class="ws-pb"><p class="ws-pn">${p.name}</p><div class="ws-pr"><b>${money(p.price[cur], cur)}</b><button data-action="add-cart" data-id="${p.id}" aria-label="Thêm vào giỏ" class="ws-add">🛒</button></div></div></div>`).join("")}</div>`;
  }
  function xuGrid() {
    const q = norm(ui.shopQuery);
    const xr = (id, price) => (state.owned.includes(id) ? 2 : state.balance >= price ? 0 : 1);
    const okXu = (id, price) => !ui.xuAfford || state.owned.includes(id) || state.balance >= price;
    const courses = [];
    const docs = LANGUAGES.filter((l) => (!ui.shopSub || ui.shopSub === "Tài liệu") && (!q || norm("tai lieu tong hop tu vung ngu phap " + l.name).includes(q)) && okXu("doc-" + l.code, DOC_PRICE) && !hiddenProd("docm-" + l.code)).sort((a, b) => xr("doc-" + a.code, DOC_PRICE) - xr("doc-" + b.code, DOC_PRICE));
    const courseCards = courses.map((c) => {
      const owned = state.owned.includes(c.id);
      return `
    <div class="glass-card rounded-2xl p-4 flex flex-col gap-2 hover:shadow-md transition-all border-t-4 ${c.tone === "sky" ? "border-t-sky-500" : "border-t-emerald-500"}">
      <div class="flex items-center justify-between"><span class="text-[10px] font-bold px-2 py-0.5 rounded-full ${c.tone === "sky" ? "bg-sky-100 text-sky-700" : "bg-emerald-100 text-emerald-700"}">\u{1F393} Kh\xF3a h\u1ECDc \u2022 ${c.badge}</span><span class="text-[10px] text-slate-400">${fmt(c.students + (owned ? 1 : 0))} h\u1ECDc vi\xEAn</span></div>
      <h4 class="font-bold text-xs text-slate-800">${c.title}</h4>
      <p class="text-[10px] text-slate-500 flex-1">${c.desc}</p>
      <div class="flex items-center justify-between pt-2 border-t border-slate-100">
        <span class="text-xs font-black text-amber-600">\u{1FA99} ${fmt(c.price)} Xu${xuNote(c.price, owned)}</span>
        ${owned ? `<button data-action="open-course" data-id="${c.id}" class="px-3 py-1 bg-slate-700 text-white keep-white rounded-lg text-[11px] font-bold">V\xE0o h\u1ECDc</button>` : `<button data-action="buy-course" data-id="${c.id}" class="px-3 py-1 bg-amber-500 hover:bg-amber-600 text-white keep-white rounded-lg text-[11px] font-bold">Mua b\u1EB1ng Xu</button>`}
      </div>
    </div>`;
    });
    const docCards = docs.map((l) => {
      const owned = state.owned.includes("doc-" + l.code);
      return `
    <div class="glass-card rounded-2xl p-4 flex flex-col gap-2 hover:shadow-md transition-all border-t-4 border-t-amber-500">
      <div class="flex items-center justify-between"><span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">\u{1F4DA} T\xE0i li\u1EC7u</span><span class="text-xl">${l.flag}</span></div>
      <h4 class="font-bold text-xs text-slate-800">T\u1ED5ng h\u1EE3p t\u1EEB v\u1EF1ng &amp; ng\u1EEF ph\xE1p ${l.name}</h4>
      <p class="text-[10px] text-slate-500 flex-1">${l.vocab.length} t\u1EEB \u2022 ${l.grammar.length} c\u1EA5u tr\xFAc \u2022 file .txt</p>
      <div class="flex items-center justify-between pt-2 border-t border-slate-100">
        <span class="text-xs font-black text-amber-600">\u{1FA99} ${fmt(DOC_PRICE)} Xu${xuNote(DOC_PRICE, owned)}</span>
        ${owned ? `<button data-action="download-doc" data-code="${l.code}" class="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white keep-white rounded-lg text-[11px] font-bold">\u2B07 T\u1EA3i v\u1EC1</button>` : `<button data-action="buy-doc" data-code="${l.code}" class="px-3 py-1 bg-amber-500 hover:bg-amber-600 text-white keep-white rounded-lg text-[11px] font-bold">Mua b\u1EB1ng Xu</button>`}
      </div>
    </div>`;
    });
    const cur = state.settings.currency;
    const all = docs.map((l, i) => {
      const owned = state.owned.includes("doc-" + l.code);
      const dp = PRODUCTS.find((x) => x.id === "docm-" + l.code);
      const moneyRow = owned || !dp ? "" : `<div class="flex items-center justify-between gap-2 pt-2 border-t border-slate-100"><span class="text-xs font-black text-sky-700">💵 ${money(dp.price[cur], cur)}</span><button data-action="buy-doc-money" data-code="${l.code}" class="px-3 py-1 bg-sky-600 hover:bg-sky-700 text-white keep-white rounded-lg text-[11px] font-bold">Mua bằng tiền</button></div>`;
      const delRow = isAdmin() ? `<div class="flex gap-1"><button data-action="pp-edit" data-id="docm-${l.code}" class="flex-1 py-1 rounded-lg text-[10px] font-bold bg-sky-50 text-sky-700">✏️ Sửa</button><button data-action="pp-del" data-id="docm-${l.code}" class="flex-1 py-1 rounded-lg text-[10px] font-bold bg-rose-50 text-rose-600">🗑 Xóa</button></div>` : "";
      return docCards[i].replace(/<\/div>\s*$/, moneyRow + delRow + "</div>");
    });
    return all.length ? all.join("") : '<p class="col-span-full text-center text-sm text-slate-500 py-10">Kh\xF4ng t\xECm th\u1EA5y t\xE0i li\u1EC7u ph\xF9 h\u1EE3p.</p>';
  }
  function renderShopGrid() {
    const grid = $("#shop-grid");
    if (!grid) return;
    renderShopPicks();
    if (xuView()) {
      grid.className = "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4";
      grid.innerHTML = xuGrid();
      return;
    }
    grid.className = "grid grid-cols-2 sm:grid-cols-4 gap-4";
    const list = filteredProducts();
    grid.innerHTML = list.length ? list.map((p) => {
      const qty = state.cart[p.id] ?? 0;
      return `
    <div data-action="open-product" data-id="${p.id}" class="glass-card rounded-2xl overflow-hidden hover:shadow-md transition-all">
      ${productThumb(p, "w-full h-36 text-5xl")}
      <div class="p-3">
        <h4 class="font-bold text-xs text-slate-800 line-clamp-1">${p.name}</h4>
        <p class="text-[10px] text-slate-500 line-clamp-1">${p.desc}</p>
        <p class="text-[10px] text-slate-400 mb-2">${soldLine(p)}${meta(p).sub ? " · " + meta(p).sub : ""}</p>
        ${isAdmin() ? `<div class="mb-2 flex gap-1"><button data-action="pp-edit" data-id="${p.id}" class="flex-1 py-1 rounded-lg text-[10px] font-bold bg-sky-50 text-sky-700">✏️ Sửa</button><button data-action="pp-del" data-id="${p.id}" class="flex-1 py-1 rounded-lg text-[10px] font-bold bg-rose-50 text-rose-600">🗑 Xóa</button></div>` : ""}
        <div class="flex justify-between items-center">
          <span class="text-xs font-black text-sky-700">${money(p.price[state.settings.currency], state.settings.currency)}</span>
          <button data-action="add-cart" data-id="${p.id}" aria-label="Th\xEAm v\xE0o gi\u1ECF" class="relative px-2 py-1 bg-sky-600 text-white keep-white rounded-lg text-xs">\u{1F6D2}${qty ? `<span class="ml-1 font-bold">${qty}</span>` : ""}</button>
        </div>
      </div>
    </div>`;
    }).join("") : emptyShop();
  }
  function renderShop() {
    const el = $("#tab-shop");
    if (!el) return;
    el.innerHTML = `
  <div class="flex items-center justify-between gap-3">
    <div>
      <h2 class="text-lg font-extrabold text-slate-800">\u{1F6D2} WINDTP Official Shop</h2>
      ${isAdmin() ? '<button data-action="open-add-product" class="mb-1 px-3 py-1 rounded-lg text-[11px] font-extrabold text-white keep-white bg-gradient-to-r from-emerald-500 to-teal-600">➕ Đăng sản phẩm</button>' : ""}
      <p class="text-xs text-slate-500">5 gian hàng: thời trang, mỹ phẩm &amp; phụ kiện; đồ ăn &amp; thực phẩm; thiết bị công nghệ; thuốc &amp; thực phẩm chức năng; khóa học &amp; tài liệu.</p>
    </div>
    <button data-action="open-orders" class="relative px-3.5 py-2 bg-sky-100 text-sky-800 rounded-full text-xs font-bold whitespace-nowrap mr-1.5">📋 Đơn hàng đã đặt</button>
<button data-action="open-cart" class="relative px-3.5 py-2 bg-amber-100 text-amber-800 rounded-full text-xs font-bold whitespace-nowrap">
      \u{1F9FA} Gi\u1ECF h\xE0ng${cartCount() ? ` <span class="ml-1 px-1.5 py-0.5 bg-red-500 text-white keep-white rounded-full text-[10px]">${cartCount()}</span>` : ""}
    </button>
  </div>
  ${xuView() ? "" : `
  <div class="glass-card rounded-2xl p-2 flex flex-wrap gap-2 items-center justify-between">
    <span class="text-[11px] font-extrabold text-slate-600 px-2">Quốc gia / tiền tệ</span>
    <div class="flex gap-2 flex-wrap">
      ${[["VND","🇻🇳 Việt Nam"],["KRW","🇰🇷 Hàn Quốc"],["JPY","🇯🇵 Nhật Bản"]].map(([cur,label]) => `<button data-action="choose-store-currency" data-currency="${cur}" class="px-3 py-1.5 rounded-xl text-[11px] font-bold ${state.settings.currency === cur ? "bg-amber-500 text-white keep-white" : "bg-slate-100 text-slate-600"}">${label}</button>`).join("")}
    </div>
  </div>`}
  ${stallHeader()}
  ${xuView() ? `
  <div class="rounded-2xl bg-amber-50 border border-amber-200 p-3 text-xs text-amber-900 flex flex-col sm:flex-row sm:items-center gap-2 justify-between">
    <p>\u{1FA99} S\u1ED1 d\u01B0 c\u1EE7a b\u1EA1n: <b>${fmt(state.balance)} Xu</b>. Xu ch\u1EC9 d\xF9ng \u0111\u1EC3 mua <b>t\xE0i li\u1EC7u h\u1ECDc t\u1EADp</b>. Xu c\xF3 th\u1EC3 nh\u1EADn \u0111\u01B0\u1EE3c khi ho\xE0n th\xE0nh nhi\u1EC7m v\u1EE5.</p>
    <button data-action="goto" data-tab="tasks" class="px-3 py-1 rounded-lg text-[11px] font-bold bg-amber-600 text-white keep-white whitespace-nowrap shrink-0">\u{1F3AF} L\xE0m nhi\u1EC7m v\u1EE5 nh\u1EADn Xu</button>
  </div>` : `
  <div class="rounded-2xl bg-sky-50 border border-sky-200 p-3 text-xs text-sky-900 flex flex-col sm:flex-row sm:items-center gap-2 justify-between">
    <p>${payNote()}</p>
    <span class="shrink-0 px-3 py-1 rounded-lg text-[11px] font-bold bg-white border border-sky-200 text-sky-800">${CURRENCIES[state.settings.currency].flag} ${CURRENCIES[state.settings.currency].name}</span>
  </div>`}
  <div class="flex flex-col sm:flex-row gap-2 sm:items-center">
    <input data-input="shopq" type="search" value="${esc(ui.shopQuery)}" placeholder="T\xECm s\u1EA3n ph\u1EA9m..." class="flex-1 px-4 py-2 text-sm rounded-full border border-sky-200 bg-white focus:outline-none focus:ring-2 focus:ring-sky-400">
    <div class="flex gap-2 overflow-x-auto no-scrollbar">
      ${SHOP_CATS.filter(([k]) => k === "all").map(([k, label]) => `<button data-action="shop-cat" data-cat="${k}" ${ui.shopCat === k ? 'data-active="1"' : ""} class="px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap inline-flex items-center gap-1.5 ${ui.shopCat === k ? "bg-sky-600 text-white keep-white" : "bg-white border border-slate-200 text-slate-700 hover:bg-sky-50"}">${STALLS[k] ? stallAvatar(k, 24) : ""}${label}</button>`).join("")}
    </div>
  </div>
  ${shopSmartBar()}
  <div id="shop-grid"></div>`;
    renderShopGrid();
    el.querySelector('[data-active="1"]')?.scrollIntoView({ inline: "center", block: "nearest" });
  }
