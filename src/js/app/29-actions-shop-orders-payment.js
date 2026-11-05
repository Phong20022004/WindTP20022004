/*@file js/app/29-actions-shop-orders-payment.js
 * ⚠ Mảnh 3/5 của object `actions`: cửa hàng, giỏ hàng, đơn hàng, admin, thanh toán, radio.
 */
    "shop-cat": (el) => {
      const cat = el.dataset.cat ?? "all";
      if (cat !== ui.shopCat) {
        ui.shopPay = "money";
        ui.shopSub = cat === "study" ? "Khóa học" : "";
      }
      ui.shopCat = cat;
      renderTab("shop");
    },
    "shop-sub": (el) => {
      ui.shopSub = el.dataset.sub || "";
      renderTab("shop");
    },
    "xu-afford": () => {
      ui.xuAfford = !ui.xuAfford;
      renderTab("shop");
    },
    "shop-pay": (el) => {
      ui.shopPay = el.dataset.pay === "xu" ? "xu" : "money";
      renderTab("shop");
    },
    "add-cart": (el) => {
      const id = el.dataset.id ?? "";
      const p = PRODUCTS.find((x) => x.id === id);
      if (!p) return;
      state.cart[id] = (state.cart[id] ?? 0) + 1;
      commit();
      toast(`\u0110\xE3 th\xEAm "${p.name}" v\xE0o gi\u1ECF h\xE0ng!`);
    },
    "contact-save": () => {
      const a = ui.afterContact || { kind: "ship" }; saveContact("ct-", CT_KEYS[a.kind]);
      const err = validContact(a.kind); if (err) { toast(err); return; }
      ui.afterContact = null; if (a.next) a.next(); else closeModal();
    },
    "settings-contact-save": () => { saveContact("st-", ["address", "phone", "docEmail", "bank", "bankName", "holder"]); toast("Đã lưu thông tin"); },
    "ut-geo-run": () => { ui.ug = { q: val("ug-q"), country: val("ug-country"), region: val("ug-region") }; renderUtilities(); },
    "ut-geo-clear": () => { ui.ug = null; renderUtilities(); },
    "open-orders": () => { if (isAdmin()) openModal(ordersModal); },
    "admin-confirm": (el) => {
      if (!isAdmin()) return;
      const o = state.orders.find((x) => x.id === el.dataset.id); if (!o || o.status !== "pending") return;
      const xu = val("ao-xu-" + o.id), chip = val("ao-chip-" + o.id);
      o.status = "done"; creditTo(o.uid || userId(), xu, chip, o.kind === "topup" ? "Nạp WIND Coin đã xác nhận" : "Thưởng khi mua hàng WIND Store");
      commit(); refreshModal(); toast("Đã xác nhận đơn");
    },
    "admin-credit": () => { if (!isAdmin()) return; const id = (val("ac-id") || "").trim(); if (!/^WIND-.+/.test(id)) { toast("ID phải có dạng WIND-tên"); return; } toast(creditTo(id, val("ac-xu"), val("ac-chip"), "Admin cộng thưởng") ? "Đã cộng thưởng cho " + id : "Nhập số Xu hoặc chip"); refreshModal(); },
    "payout-done": (el) => { const p = (state.payouts || []).find((x) => x.id === el.dataset.id); if (p) { p.status = "done"; commit(); refreshModal(); } },
    "open-task-add": () => { if (isAdmin()) openModal(taskModal); },
    "task-save": () => {
      if (!isAdmin()) return;
      const title = (val("at-title") || "").trim(), n = (k) => Math.max(0, Math.floor(Number(val(k)) || 0));
      const t = { id: uid("ct"), title, desc: (val("at-desc") || "").trim(), xu: n("at-xu"), chips: n("at-chip"), money: n("at-money"), cur: val("at-cur") || "VND", ts: Date.now() };
      if (!title) { toast("Nhập tên nhiệm vụ"); return; }
      if (!t.xu && !t.chips && !t.money) { toast("Nhập ít nhất một mức thưởng"); return; }
      (state.customTasks = state.customTasks || []).unshift(t); commit(); closeModal(); renderTasks(); toast("Đã đăng nhiệm vụ");
    },
    "task-del": (el) => { if (!isAdmin()) return; state.customTasks = (state.customTasks || []).filter((x) => x.id !== el.dataset.id); commit(); renderTasks(); },
    "ctask-claim": (el) => {
      const t = (state.customTasks || []).find((x) => x.id === el.dataset.id); if (!t) return;
      if ((state.customDone || []).includes(t.id)) return;
      if (t.money > 0 && needContact("bank", () => { closeModal(); actions["ctask-claim"](el); })) return;
      (state.customDone = state.customDone || []).push(t.id);
      if (t.xu) earn(t.xu, "Thưởng nhiệm vụ: " + t.title);
      if (t.chips) state.chips = (state.chips || 0) + t.chips;
      if (t.money) { const c = contact(); (state.payouts = state.payouts || []).unshift({ id: uid("po"), ts: Date.now(), uid: userId(), title: t.title, money: t.money, cur: t.cur, bank: c.bank, bankName: c.bankName, holder: c.holder, status: "pending" }); }
      commit(); renderTasks(); toast("Đã nhận thưởng" + (t.money ? ", tiền sẽ được chuyển vào tài khoản của bạn" : ""));
    },
    "open-orders": () => openModal(ordersModal),
    "ord-tab": (el) => { ui.ordTab = el.dataset.t === "done" ? "done" : "pending"; refreshModal(); },
    "admin-confirm": (el) => {
      if (!isAdmin()) return;
      const o = state.orders.find((x) => x.id === el.dataset.id); if (!o || o.status !== "pending") return;
      const g = orderGrant(o); o.status = "done"; o.doneTs = Date.now();
      creditTo(o.uid || userId(), g.xu, g.chips, o.kind === "topup" ? (o.src === "chip" ? "Mua chip trong game đã xác nhận" : o.src === "game" ? "Mua xu trong game đã xác nhận" : "Nạp WIND Coin đã xác nhận") : "Thưởng khi mua hàng WIND Store", g.courses, g.shop, g.docs);
      if (g.courses.length && o.ref && o.ref !== o.uid) { const rr = state.refRewarded = state.refRewarded || {}; if (!rr[o.uid]) { rr[o.uid] = true; creditTo(o.ref, 1500, 0, "Thưởng mời bạn mua khóa học"); } }
      commit(); refreshModal(); toast(g.doc ? "Đã xác nhận. Nhớ gửi tài liệu cho khách." : "Đã xác nhận đơn");
    },
    "fs-run": () => { ui.fs = { q: val("fs-q"), country: val("fs-country"), region: val("fs-region"), done: true }; renderEntertainment(); },
    "fs-add": (el) => { const id = el.dataset.id ?? ""; const dp = FRIEND_DIR.find((x) => x.id === id); if (dp) { const r = requestFriend(dp.name); if (r && r.ok && r.already && r.status === "friend") { toast("Đã là bạn bè của bạn"); renderEntertainment(); return; } } if (!state.invited.includes(id)) state.invited.push(id); commit(); renderEntertainment(); toast("Đã gửi lời mời kết bạn!"); },
    "ctask-claim": (el) => {
      const t = (state.customTasks || []).find((x) => x.id === el.dataset.id); if (!t) return;
      const go = () => { ui.proofTask = t.id; openModal(proofModal); };
      if (t.money > 0 && needContact("bank", go)) return;
      go();
    },
    "ctask-sent": () => {
      const t = (state.customTasks || []).find((x) => x.id === ui.proofTask); if (!t) return;
      const c = contact();
      (state.taskClaims = state.taskClaims || []).unshift({ id: uid("cl"), taskId: t.id, uid: userId(), title: t.title, ts: Date.now(), status: "sent", bank: t.money ? { bank: c.bank, bankName: c.bankName, holder: c.holder } : null });
      commit(); closeModal(); renderTasks(); toast("Đã ghi nhận, chờ máy chủ xử lý");
    },
    "task-grant": (el) => {
      if (!isAdmin()) return;
      const id = (el.dataset.uid || val("tg-id") || "").trim(), tid = el.dataset.task || val("tg-task");
      const t = (state.customTasks || []).find((x) => x.id === tid);
      if (!t || !/^WIND-.+/.test(id)) { toast("Chọn nhiệm vụ và nhập ID dạng WIND-tên"); return; }
      const cl = (state.taskClaims || []).find((c) => c.uid === id && c.taskId === tid);
      if (cl) cl.status = "granted";
      else (state.taskClaims = state.taskClaims || []).unshift({ id: uid("cl"), taskId: tid, uid: id, title: t.title, ts: Date.now(), status: "granted", bank: null });
      creditTo(id, t.xu, t.chips, "Thưởng nhiệm vụ: " + t.title);
      if (t.money) { const b = (cl && cl.bank) || {}; (state.payouts = state.payouts || []).unshift({ id: uid("po"), ts: Date.now(), uid: id, title: t.title, money: t.money, cur: t.cur, bank: b.bank, bankName: b.bankName, holder: b.holder, status: "pending" }); }
      commit(); renderTasks(); toast("Đã cộng thưởng cho " + id);
    },
    "open-product": (el) => { ui.prod = { id: el.dataset.id ?? "", qty: 1 }; openModal(productModal); },
    "prod-qty": (el) => { const v = ui.prod; if (!v) return; v.qty = Math.max(1, Math.min(99, (v.qty || 1) + Number(el.dataset.d || 0))); refreshModal(); },
    "prod-add": () => { if (addProdToCart()) { toast("Đã thêm vào giỏ hàng!"); closeModal(); } },
    "prod-buy": () => { if (addProdToCart() && !needContact(cartHasDoc() ? "shipdoc" : "ship", () => openModal(payModal))) openModal(payModal); },
    "pay-cur": (el) => {
      const c = el.dataset.cur, k = el.dataset.kind; if (!CURRENCIES[c]) return;
      if (k === "topup") { const t = topupState(); t.amt = convertTopupAmt(t.cur, c, t.amt); t.cur = c; }
      else { state.settings.currency = c; commit(); }
      refreshModal();
    },
    "open-cart": () => openModal(cartModal, true),
    "cart-inc": (el) => {
      const id = el.dataset.id ?? "";
      state.cart[id] = (state.cart[id] ?? 0) + 1;
      commit();
      refreshModal();
    },
    "cart-dec": (el) => {
      const id = el.dataset.id ?? "";
      const n = (state.cart[id] ?? 0) - 1;
      if (n <= 0) delete state.cart[id];
      else state.cart[id] = n;
      commit();
      refreshModal();
    },
    "cart-clear": () => {
      state.cart = {};
      commit();
      refreshModal();
    },
    "set-currency": (el) => {
      const cur = el.dataset.cur;
      if (!(cur in CURRENCIES)) return;
      state.settings.currency = cur;
      commit();
    },
    checkout: () => { { const _c = state.settings.currency; if (cartCount() > 0 && cartTotal() < MINPAY[_c]) { toast("Thanh toán tối thiểu " + money(MINPAY[_c], _c)); return; } }
      if (cartCount() > 0 && needContact(cartHasDoc() ? "shipdoc" : "ship", () => openModal(payModal))) return;
      if (cartCount() === 0) {
        toast("Gi\u1ECF h\xE0ng \u0111ang tr\u1ED1ng");
        return;
      }
      openModal(payModal);
    },
    "pay-order": () => {
      const total = cartTotal();
      const count = cartCount();
      if (count === 0) {
        toast("Gi\u1ECF h\xE0ng \u0111ang tr\u1ED1ng");
        closeModal();
        return;
      }
      const cur = state.settings.currency;
      const entries = Object.keys(state.cart);
      const summary = entries.length === 1 ? `${PRODUCTS.find((p) => p.id === entries[0])?.name ?? "S\u1EA3n ph\u1EA9m"}${count > 1 ? ` x${count}` : ""}` : `${count} s\u1EA3n ph\u1EA9m WIND Store`;
      const code = payCode("payCode");
      const items = Object.assign({}, state.cart);
      const lines = entries.map((id) => { const p = PRODUCTS.find((x) => x.id === id) || {}; return { name: p.name || id, qty: state.cart[id], plan: p.plan || "", lang: p.lang || "", xu: p.rewardXu || 0, chips: p.rewardChips || 0, doc: p.cat === "study" && !p.plan, docCode: p.docOf || "" }; });
      const order = { id: uid("od"), ts: Date.now(), summary, total, currency: cur, method: val("pay-method") || CURRENCIES[cur].methods[0], status: "pending", code, items, kind: "store", lines, ref: state.referredBy || "", uid: userId(), contact: ctSnap() };
      state.orders.unshift(order);
      if (state.orders.length > 30) state.orders.length = 30;
      state.cart = {};
      ui.payCode = null;
      ui.pendingOrder = order;
      commit();
      openModal(pendingModal);
    },
    /* ---- entertainment ---- */
    "find-match": () => {
      ui.match.searched = true;
      renderEntertainment();
    },
    invite: (el) => {
      const id = el.dataset.id ?? "";
      if (!state.invited.includes(id)) state.invited.push(id);
      commit();
      toast("\u0110\xE3 g\u1EEDi l\u1EDDi m\u1EDDi h\u1ECDc c\xF9ng!");
    },
    "radio-track": async (el) => {
      const i = TRACKS.findIndex((t) => t.id === el.dataset.id);
      if (i < 0) return;
      await pickTrack(i);
      if (!isPlaying() && state.settings.sound && isSupported()) { setVolume(ui.volume / 100); await start(); renderEntertainment(); }
      toast(`${TRACKS[trackIdx].emoji} ${TRACKS[trackIdx].name}`);
    },
    "radio-next": async () => { await pickTrack(trackIdx + 1); },
    "radio-prev": async () => { await pickTrack(trackIdx - 1); },
    "toggle-radio": async () => {
      if (!isSupported()) { toast("Trình duyệt không hỗ trợ phát nhạc"); return; }
      if (isPlaying()) { stop(); toast("Đã tạm dừng Lofi Radio"); }
      else if (!state.settings.sound) { toast("Âm thanh đang tắt trong Cài đặt"); return; }
      else { setVolume(ui.volume / 100); await start(); toast(`${TRACKS[trackIdx].emoji} ${TRACKS[trackIdx].name}`); }
      renderEntertainment();
    },
