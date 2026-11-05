/*@file js/app/32-events-and-init.js
 * Xử lý input/change, gắn sự kiện, vuốt banner và hàm khởi động init().
 */
  var inputs = {
    shopq: (el) => {
      ui.shopQuery = el.value;
      renderShopGrid();
    },
    draft: (el) => {
      ui.draft = el.value;
    },
    volume: (el) => {
      ui.volume = Number(el.value);
      setVolume(ui.volume / 100);
    }
  };
  var changes = {
    "shop-sort": (el) => {
      ui.shopSort = el.value;
      renderTab("shop");
    },
    "match-lang": (el) => {
      ui.match.lang = el.value;
      ui.match.searched = false;
    },
    "match-level": (el) => {
      ui.match.level = Number(el.value);
      ui.match.searched = false;
    },
    "match-goal": (el) => {
      ui.match.goal = el.value;
      ui.match.searched = false;
    },
    "draft-tag": (el) => {
      ui.draftTag = el.value;
    },
    setting: (el) => {
      const key = el.dataset.key;
      state.settings[key] = el.checked;
      if (key === "dark" || key === "sfx") applyTheme();
      if (key === "sfx" && el.checked) sfx("toggle");
      if (key === "sound" && !el.checked && isPlaying()) stop();
      commit();
    },
    gender: (el) => { const v = el.value; state.settings.gender = ["nam", "nu", "khac"].includes(v) ? v : ""; commit(); refreshModal(); if (v) toast("Đã lưu giới tính"); },
    birth: (el) => {
      if (state.settings.birth && ui.birthEdit !== 2) { el.value = state.settings.birth; return; }
      const v = el.value;
      if (!v) { ui.birthPending = ""; refreshModal(); return; }
      const a = ageFromBirth(v);
      if (a < 0 || a > 120) { toast("Ngày sinh không hợp lệ"); el.value = ""; ui.birthPending = ""; refreshModal(); return; }
      ui.birthPending = v; refreshModal();
    },
    "topup-custom": (el) => { const v = Number(el.value); if (v > 0) { topupState().amt = Math.floor(v); refreshModal(); } },
    currency: (el) => {
      if (el.value === "VND" || el.value === "KRW" || el.value === "JPY") state.settings.currency = el.value;
      commit();
      refreshModal();
    },
    name: (el) => {
      const v = el.value.trim();
      if (v) state.userName = v.slice(0, 30);
      else el.value = state.userName;
      commit();
    },
    "toggle-reminder": (el) => {
      const r = state.reminders.find((x) => x.id === el.dataset.id);
      if (r) r.done = el.checked;
      commit();
      refreshModal();
    }
  };
  function wireEvents() {
    document.addEventListener("click", (ev) => {
      const target = ev.target;
      const clickable = target.closest('button, [data-action], [role="button"], input[type="checkbox"], input[type="radio"], label');
      if (clickable && !clickable.hasAttribute("disabled")) sfx("click");
      if (target.matches("[data-modal-bg]")) {
        closeModal();
        return;
      }
      const el = target.closest("[data-action]");
      if (el && !el.hasAttribute("disabled")) {
        const fn = actions[el.dataset.action ?? ""];
        if (fn) {
          const r = fn(el, ev);
          if (r instanceof Promise) r.catch(() => toast("C\xF3 l\u1ED7i x\u1EA3y ra, vui l\xF2ng th\u1EED l\u1EA1i"));
        }
        return;
      }
      if (!target.closest("#notice-panel, #search-panel, #main-header")) closePanels(true);
    });
    document.addEventListener("input", (ev) => {
      const el = ev.target;
      if (el.id === "search-input" || el.id === "search-input-m") {
        const other = $(el.id === "search-input" ? "#search-input-m" : "#search-input");
        if (other) other.value = el.value;
        renderSearch(el.value);
        return;
      }
      const key = el.dataset.input;
      if (key && inputs[key]) inputs[key](el);
      if (el.dataset.gpa) {
        const row = gpaRows[Number(el.dataset.i)];
        if (row) row[el.dataset.gpa] = el.value;
      }
    });
    document.addEventListener("change", (ev) => {
      const el = ev.target;
      const key = el.dataset.change;
      if (key && changes[key]) changes[key](el);
    });
    document.addEventListener("keydown", (ev) => {
      if (ev.key === "Escape") {
        if (ui.renderModal) closeModal();
        closePanels(true);
        return;
      }
      if (ev.key === "Enter" && ev.target.id === "qz-write") {
        ev.preventDefault();
        actions["quiz-write"](ev.target, ev);
        return;
      }
      if ((ev.key === "Enter" || ev.key === " ") && ev.target.matches('[role="button"][data-action]')) {
        ev.preventDefault();
        ev.target.click();
      }
    });
    window.addEventListener("popstate", () => {
      const t = location.hash.replace("#/", "");
      goTo(isTab(t) ? t : "home", void 0, false);
    });
  }
  function wireBannerSwipe() {
    let sx = 0, dx = 0, drag = false, moved = false, wrap = null;
    const slider = () => $("#banner-slider");
    document.addEventListener("pointerdown", (e) => {
      const w = e.target.closest && e.target.closest("#banner-wrap");
      if (!w || (e.pointerType === "mouse" && e.button !== 0)) return;
      wrap = w; sx = e.clientX; dx = 0; drag = true; moved = false;
      ui.bannerTouch = Date.now();
    });
    document.addEventListener("pointermove", (e) => {
      if (!drag) return;
      dx = e.clientX - sx;
      if (Math.abs(dx) > 8) moved = true;
      if (!moved) return;
      ui.bannerTouch = Date.now();
      const sl = slider();
      if (sl) { sl.style.transition = "none"; sl.style.transform = `translateX(calc(-${ui.slide * 100}% + ${dx}px))`; }
    });
    const end = () => {
      if (!drag) return;
      drag = false;
      ui.bannerTouch = Date.now();
      const sl = slider();
      if (sl) sl.style.transition = "";
      const w = wrap ? wrap.offsetWidth : 300;
      if (moved && Math.abs(dx) > Math.min(60, w * 0.15)) setBanner(ui.slide + (dx < 0 ? 1 : -1));
      else setBanner(ui.slide);
    };
    document.addEventListener("pointerup", end);
    document.addEventListener("pointercancel", end);
    document.addEventListener("click", (e) => { if (moved && e.target.closest && e.target.closest("#banner-wrap")) { e.stopPropagation(); e.preventDefault(); } moved = false; }, true);
  }
  function init() {
    ensureIdentity();
    if (purgeExpired()) save();
    window.setInterval(() => { if (purgeExpired()) commit(); }, 6e5);
    try { if (state.account && state.account.session && !sessionStorage.getItem("windtp-session")) state.account = null; } catch (e) { }
    if (!state.account) showLogin();
    syncCustomProducts();
    applyTheme();
    rollDay();
    const fromHash = location.hash.replace("#/", "");
    if (isTab(fromHash)) ui.tab = fromHash;
    subscribe(renderAll);
    showTab(ui.tab);
    renderAll();
    setBanner(ui.slide);
    wireEvents();
    wireBannerSwipe();
    window.setInterval(() => {
      if (ui.tab === "home" && !document.hidden && !ui.renderModal && Date.now() - (ui.bannerTouch || 0) >= 1e4) setBanner(ui.slide + 1);
    }, 4500);
    window.setInterval(pomoTick, 1e3);
  }


