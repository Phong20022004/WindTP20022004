/*@file js/app/20-payment-modals.js
 * v5: chi tiết sản phẩm, thanh toán thống nhất, nạp Xu, liên hệ Facebook.
 */
  /* ===== v5: product detail, unified payment, Facebook contact ===== */
  function fbContactBtn() {
    return `<span class="fbc"><small>Liên hệ</small><span class="flex gap-2 items-center"><button data-action="open-fb" class="fbc-btn">Facebook WINDTP</button><button data-action="copy-acc" data-text="${FB_PAGE}" class="px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-800 text-[11px] font-bold">Sao chép link</button></span></span>`;
  }
  function curChips(cur, kind) {
    return `<div class="grid grid-cols-3 gap-2">${["VND", "KRW", "JPY"].map((c) => `<button data-action="pay-cur" data-kind="${kind}" data-cur="${c}" class="py-2 rounded-xl border text-xs font-bold ${c === cur ? "border-sky-500 bg-sky-50 text-sky-800" : "border-slate-200 text-slate-700"}">${CURRENCIES[c].flag} ${c}</button>`).join("")}</div>`;
  }
  function bankBox(cur, code) {
    cur = cur || state.settings.currency;
    const acc = cur === "VND" ? { bank: "Techcombank", num: "19072080970015" } : cur === "KRW" ? { bank: "Toss Bank (토스뱅크)", num: "1002-7308-5584" } : null;
    const cp = (t) => `<button data-action="copy-acc" data-text="${t}" class="px-2 py-0.5 rounded-lg bg-white border border-sky-300 text-[10px] font-bold text-sky-800">Sao chép</button>`;
    const body = acc
      ? `<p class="text-xs text-slate-700">Ngân hàng: <b>${acc.bank}</b></p>
      <p class="text-xs text-slate-700 flex items-center gap-2 flex-wrap">Số tài khoản: <b class="text-sm tracking-wide">${acc.num}</b>${cp(acc.num)}</p>
      <p class="text-xs text-slate-700">Chủ tài khoản: <b>LE THANH PHONG</b></p>`
      : `<p class="text-xs text-slate-700">Tài khoản nhận tiền tại Nhật Bản: <b>sẽ được cập nhật sau</b>.</p>`;
    const memo = code ? `<p class="text-xs text-slate-700 flex items-center gap-2 flex-wrap">Nội dung chuyển khoản: <b class="text-sm tracking-wide">${code}</b>${cp(code)}</p>` : "";
    return `<div class="pay-box space-y-1.5">
      <p class="text-xs font-extrabold text-sky-900">🏦 Thông tin chuyển khoản · ${CURRENCIES[cur].flag} ${CURRENCIES[cur].name}</p>
      ${body}${memo}
      <p class="text-[11px] text-rose-600 font-bold pt-1">Hãy kiểm tra đúng tên chủ tài khoản trước khi chuyển khoản.</p>
      <div class="pt-1">${fbContactBtn()}</div>
    </div>`;
  }
  function payPanel(cur, kind, code) {
    return `<div><p class="text-xs font-bold text-slate-600 mb-1.5">Chọn đơn vị tiền tệ</p>${curChips(cur, kind)}</div>
    <div><label class="text-xs font-bold text-slate-600" for="pay-method">Phương thức thanh toán</label>
      <select id="pay-method" class="${field} mt-1">${CURRENCIES[cur].methods.map((m) => `<option>${m}</option>`).join("")}</select></div>
    ${bankBox(cur, code)}`;
  }
  function payModal() {
    const cur = state.settings.currency, total = cartTotal();
    return `${modalHead("💳 Thanh toán đơn hàng")}
  <div class="p-5 space-y-4">
    <div class="pay-box"><p class="text-[11px] text-slate-500">${cartCount()} sản phẩm WIND Store</p><p class="text-2xl font-black text-slate-800">${money(total, cur)}</p></div>
    ${payPanel(cur, "store", payCode("payCode"))}
    <p class="text-xs font-extrabold text-slate-900">Chỉ bấm "Xác nhận thanh toán" <b>sau khi đã chuyển khoản xong</b>. Đơn sẽ hiện "Chờ xử lý" đến khi được xác minh.</p>
    <div class="flex gap-2"><button data-action="open-cart" class="${btnGhost}">Quay lại</button><button data-action="pay-order" class="flex-1 ${btnPrimary}">Xác nhận thanh toán</button></div>
  </div>`;
  }
  function topupModal() {
    const t = topupState(), cur = t.cur, xu = topupXu(cur, t.amt), U = t.src === "chip" ? "chip" : "Xu";
    if (t.step === 2) {
      return `${modalHead(topupTitle())}
  <div class="p-5 space-y-4">
    <div class="pay-box"><p class="text-2xl font-black text-slate-800">${money(t.amt, cur)}</p><p class="text-sm font-bold text-amber-700">Nhận ${fmt(xu)} ${U}</p></div>
    ${payPanel(cur, "topup", payCode("topupCode"))}
    <p class="text-xs font-extrabold text-slate-900">Chỉ bấm "Xác nhận thanh toán" <b>sau khi đã chuyển khoản xong</b>. ${U} được cộng sau khi xác minh.</p>
    <div class="flex gap-2"><button data-action="topup-back" class="${btnGhost}">Quay lại</button><button data-action="submit-topup" class="flex-1 ${btnPrimary}">Xác nhận thanh toán</button></div>
  </div>`;
    }
    const presets = TOPUP_PRESETS[cur];
    return `${modalHead(topupTitle())}
  <div class="p-5 space-y-4">
    <div><p class="text-xs font-bold text-slate-600 mb-1.5">Chọn đơn vị tiền tệ</p>${curChips(cur, "topup")}</div>
    <div><p class="text-xs font-bold text-slate-600 mb-1.5">Chọn số tiền</p>
      <div class="grid grid-cols-3 gap-2">${presets.map((a) => `<button data-action="topup-amt" data-amt="${a}" class="py-2.5 rounded-xl border text-xs font-bold ${Number(t.amt) === a ? "border-sky-500 bg-sky-50 text-sky-800" : "border-slate-200 text-slate-700"}">${money(a, cur)}</button>`).join("")}</div>
      <label class="text-[11px] text-slate-500 mt-2 block" for="topup-custom">Hoặc nhập số khác (${CURRENCIES[cur].symbol})</label>
      <input id="topup-custom" data-change="topup-custom" type="number" min="1" step="1" value="${presets.includes(Number(t.amt)) ? "" : esc(String(t.amt))}" placeholder="Ví dụ ${presets[1]}" class="${field} mt-1"></div>
    <div class="pay-box text-center"><p class="text-[11px] text-slate-500">Quy đổi: 1 ${CURRENCIES[cur].symbol} = ${TOPUP_RATE[cur]} ${U}</p><p class="text-xl font-black text-amber-700">${money(t.amt || 0, cur)} → ${fmt(xu)} ${U}</p></div>
    <button data-action="topup-next" class="w-full ${btnPrimary}">Tiếp tục thanh toán</button>
  </div>`;
  }
  function productModal() {
    const v = ui.prod || {}, p = PRODUCTS.find((x) => x.id === v.id);
    if (!p) return `${modalHead("Sản phẩm")}<p class="p-6 text-sm text-slate-500">Không tìm thấy sản phẩm.</p>`;
    const cur = state.settings.currency, q = v.qty || 1;
    return `${modalHead(p.name)}
  <div class="p-5 space-y-4">
    <div class="rounded-2xl overflow-hidden">${productThumb(p, "w-full h-60 text-7xl")}</div>
    <div><p class="pd-price">${money(p.price[cur] * q, cur)}</p><p class="text-[11px] text-slate-500">${soldLine(p)}${meta(p).sub ? " · " + meta(p).sub : ""}</p></div>
    <p class="text-sm text-slate-700 leading-relaxed">${p.desc}</p>
    <div><p class="text-xs font-bold text-slate-600 mb-1.5">Chọn đơn vị tiền tệ</p>${curChips(cur, "product")}</div>
    <div class="flex items-center justify-between"><span class="text-xs font-bold text-slate-600">Số lượng</span>
      <span class="pd-qty"><button data-action="prod-qty" data-d="-1" aria-label="Giảm">−</button><span>${q}</span><button data-action="prod-qty" data-d="1" aria-label="Tăng">+</button></span></div>
    <div class="flex gap-2"><button data-action="prod-add" class="flex-1 ${btnGhost}">🛒 Thêm vào giỏ hàng</button><button data-action="prod-buy" class="flex-1 ${btnPrimary}">Mua ngay</button></div>
    <div class="pt-1">${fbContactBtn()}</div>
    ${isAdmin() ? `<div class="flex gap-2"><button data-action="pp-edit" data-id="${p.id}" class="flex-1 py-2 rounded-xl text-xs font-bold bg-sky-50 text-sky-700">✏️ Sửa sản phẩm (máy chủ)</button><button data-action="pp-del" data-id="${p.id}" data-from="modal" class="flex-1 py-2 rounded-xl text-xs font-bold bg-rose-50 text-rose-600">🗑 Xóa sản phẩm (máy chủ)</button></div>` : ""}
  </div>`;
  }
  function addProdToCart() {
    const v = ui.prod; if (!v) return false;
    state.cart[v.id] = (state.cart[v.id] ?? 0) + (v.qty || 1);
    commit(); return true;
  }
  function openProduct_(id) { ui.prod = { id, qty: 1 }; openModal(productModal); }
