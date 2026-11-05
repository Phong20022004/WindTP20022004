/*@file js/app/31-actions-wallet-profile.js
 * ⚠ Mảnh 5/5 của object `actions`: tiền tệ, giới thiệu, nạp Xu, hồ sơ, vật phẩm; đóng object `actions`.
 */
    "choose-store-currency": (el) => {
      const cur = el.dataset.currency;
      if (!CURRENCIES[cur]) return;
      state.settings.currency = cur;
      commit();
      toast(`WIND Store: ${CURRENCIES[cur].name}`);
    },
    "choose-sfx": (el) => {
      const side = el.dataset.side;
      const preset = el.dataset.preset;
      if (!["right", "wrong"].includes(side) || !["1", "2", "3"].includes(preset)) return;
      localStorage.setItem(`windtp-sfx-${side}`, preset);
      sfx(`${side}-preview-${preset}`);
      refreshModal();
    },
    "claim-referral-commission": () => {
      const pending = Math.max(0, Number(state.referralCommission || 0));
      if (!pending) {
        toast("Chưa có thưởng WIND Coin chờ nhận.");
        return;
      }
      state.balance += pending;
      state.history.unshift({ id: uid("tx"), title: "Thưởng mời bạn mua khóa học", amount: pending, kind: "in", ts: Date.now() });
      state.referralCommission = 0;
      commit();
      toast(`Đã nhận ${fmt(pending)} WIND Coin thưởng mời bạn.`);
    },
    "referral-link": async () => {
      const code = userId();
      let base = "";
      try { base = window.WINDTP && window.WINDTP.appUrl ? window.WINDTP.appUrl() : ""; } catch (e) { }
      if (!base) base = location.href.split(/[?#]/)[0];
      const link = `${base.split(/[?#]/)[0]}?ref=${encodeURIComponent(code)}`;
      let copied = false;
      try { await navigator.clipboard.writeText(link); copied = true; } catch (e) { }
      if (!copied) { try { const ta = document.createElement("textarea"); ta.value = link; ta.setAttribute("readonly", ""); ta.style.cssText = "position:fixed;left:0;top:0;opacity:0"; document.body.appendChild(ta); ta.focus(); ta.select(); ta.setSelectionRange(0, link.length); copied = document.execCommand("copy"); ta.remove(); } catch (e) { } }
      if (copied) toast("Đã sao chép liên kết mời bạn bè.");
      else if (navigator.share) { try { await navigator.share({ title: "WINDTP", text: "Học cùng mình trên WINDTP nhé!", url: link }); } catch (e) { } }
      else window.prompt("Sao chép liên kết mời bạn bè:", link);
    },
    "spend-xu": () => {
      ui.shopCat = "study";
      ui.shopSub = "Tài liệu";
      ui.shopPay = "xu";
      ui.shopQuery = "";
      goTo("shop");
    },
    "open-topup": () => openTopup(),
    "topup-cur": (el) => { const t = topupState(), c = el.dataset.cur; if (!CURRENCIES[c]) return; t.amt = convertTopupAmt(t.cur, c, t.amt); t.cur = c; refreshModal(); },
    "topup-amt": (el) => { topupState().amt = Number(el.dataset.amt); refreshModal(); },
    "topup-next": () => {
      const t = topupState(), xu = topupXu(t.cur, t.amt);
      if (!(Number(t.amt) > 0) || !Number.isInteger(Number(t.amt))) { toast("Vui l\xF2ng nh\u1EADp s\u1ED1 ti\u1EC1n h\u1EE3p l\u1EC7"); return; }
      if (Number(t.amt) < MINPAY[t.cur]) { toast("Thanh toán tối thiểu " + money(MINPAY[t.cur], t.cur)); return; }
      if (xu > 5e7) { toast("M\u1ED7i l\u1EA7n n\u1EA1p t\u1ED1i \u0111a 50,000,000 Xu"); return; }
      t.step = 2; refreshModal();
    },
    "topup-back": () => { topupState().step = 1; refreshModal(); },
    "open-fb": () => { const w = window.open(FB_PAGE, "_blank", "noopener,noreferrer"); if (!w) { try { window.top.location.href = FB_PAGE; } catch (e) { window.location.href = FB_PAGE; } } },
    "submit-topup": () => {
      const t = topupState(), xu = topupXu(t.cur, t.amt), code = payCode("topupCode");
      const order = { id: uid("od"), ts: Date.now(), summary: (t.src === "chip" ? "Mua " + fmt(xu) + " chip trong game" : t.src === "game" ? "Mua " + fmt(xu) + " xu trong game" : `N\u1EA1p ${fmt(xu)} Xu`), total: Number(t.amt), currency: t.cur, method: val("pay-method") || CURRENCIES[t.cur].methods[0], status: "pending", code, kind: "topup", xu: t.src === "chip" ? 0 : xu, chips: t.src === "chip" ? xu : 0, src: t.src || "", uid: userId() };
      state.orders.unshift(order);
      if (state.orders.length > 30) state.orders.length = 30;
      ui.topup = null; ui.topupCode = null; ui.pendingOrder = order;
      commit();
      openModal(pendingModal);
    },
    "history-filter": (el) => {
      ui.historyFilter = el.dataset.f ?? "all";
      renderTab("wallet");
    },
    /* ---- settings / profile ---- */
    "open-profile": () => { ui.profileTab = "avatar"; ui.avatarCategory = "streak"; openModal(profileModal); },
    "profile-tab": (el) => {
      ui.profileTab = el.dataset.t === "frame" ? "frame" : "avatar";
      if (ui.profileTab === "avatar") ui.avatarCategory = "streak";
      refreshModal();
    },
    "avatar-category": (el) => {
      ui.avatarCategory = ["all","zodiac","chinese","age","streak","special"].includes(el.dataset.cat) ? el.dataset.cat : "all";
      refreshModal();
    },
    "equip-cosmetic": (el) => {
      const kind = el.dataset.kind === "frame" ? "frame" : "avatar";
      const id = el.dataset.id ?? "";
      if (!isOwned(kind, id)) {
        const it = kind === "avatar" ? avatarById(id) : frameById(id);
        if (it.unlock === "admin") toast("Ch\u1EC9 m\u00E1y ch\u1EE7 (BigBoss) m\u1EDBi d\u00F9ng \u0111\u01B0\u1EE3c m\u1EE5c n\u00E0y.");
        return;
      }
      if (kind === "avatar") state.avatarId = id;
      else { state.frameId = id; state.frameNone = id === "none"; }
      commit();
      refreshModal();
    },
    "admin-equip-set": () => {
      if (!isAdmin()) { toast("Ch\u1EC9 m\u00E1y ch\u1EE7 (BigBoss) m\u1EDBi d\u00F9ng \u0111\u01B0\u1EE3c b\u1ED9 n\u00E0y."); return; }
      state.avatarId = ADMIN_AVATAR_ID;
      state.frameId = ADMIN_FRAME_ID;
      commit();
      refreshModal();
      admBurst();
      toast("\u{1F451} \u0110\u00E3 d\u00F9ng Logo WINDTP + khung Ho\u00E0ng Kim Thi\u00EAn \u0110\u1EBF");
    },
    "buy-cosmetic": (el) => {
      const kind = el.dataset.kind === "frame" ? "frame" : "avatar";
      const id = el.dataset.id ?? "";
      const item = kind === "avatar" ? avatarById(id) : frameById(id);
      if (item.unlock !== "buy" || isOwned(kind, id)) return;
      if (!requireFunds(item.price)) return;
      spend(item.price, `Mua ${kind === "avatar" ? "avatar" : "khung avatar"} ${item.name}`);
      if (kind === "avatar") {
        state.ownedAvatars.push(id);
        state.avatarId = id;
      } else {
        state.ownedFrames.push(id);
        state.frameId = id;
      }
      notify("\u{1F5BC}\uFE0F", `B\u1EA1n \u0111\xE3 mua ${kind === "avatar" ? "avatar" : "khung"} ${item.name}`);
      commit();
      refreshModal();
      toast(`\u0110\xE3 mua v\xE0 \u0111ang d\xF9ng ${item.name}!`);
    },
    "claim-cosmetic": (el) => {
      const kind = el.dataset.kind === "frame" ? "frame" : "avatar";
      const id = el.dataset.id ?? "";
      const item = kind === "avatar" ? avatarById(id) : frameById(id);
      if (!["streak7","streak15","streak30"].includes(item.unlock) || isOwned(kind, id)) return;
      const need = item.rewardDays || 7;
      if (streakProgress() < need) {
        toast(`Cần đăng nhập + điểm danh ${need} ngày liên tiếp (hiện ${streakProgress()})`);
        return;
      }
      if (kind === "avatar") {
        state.ownedAvatars.push(id);
        state.avatarId = id;
      } else {
        state.ownedFrames.push(id);
        state.frameId = id;
      }
      notify("\u{1F381}", `Ph\u1EA7n th\u01B0\u1EDFng \u0111\u0103ng nh\u1EADp ${STREAK_DAYS} ng\xE0y: ${item.name}`);
      commit();
      sfx("coin");
      refreshModal();
      toast(`\u0110\xE3 nh\u1EADn ${item.name}!`);
    },
    "reset-data": () => {
      if (!window.confirm("\u0110\u1EB7t l\u1EA1i to\xE0n b\u1ED9 d\u1EEF li\u1EC7u demo v\u1EC1 ban \u0111\u1EA7u?")) return;
      stop();
      resetAll();
      applyTheme();
      closeModal();
      toast("\u0110\xE3 \u0111\u1EB7t l\u1EA1i d\u1EEF li\u1EC7u");
    }
  };
