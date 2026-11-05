/*@file js/app/27-actions-navigation.js
 * ⚠ Mảnh 1/5 của object `actions` (bảng xử lý data-action): điều hướng, banner, cảnh giới.
 */
  var LISTING_EMOJI = { market: "🏷️", jobs: "🧑‍💻", housing: "🏡" };
  var actions = {
    /* ---- navigation / header ---- */
    goto: (el) => {
      const tab = el.dataset.tab;
      if (isTab(tab)) goTo(tab, el.dataset.cat);
    },
    "set-banner": (el) => { ui.bannerTouch = Date.now(); setBanner(Number(el.dataset.i ?? 0)); },
    "open-settings": () => openModal(settingsModal),
    "open-cultivation-system": () => openModal(cultivationModal),
    "back-settings-from-realms": () => openModal(settingsModal),
    "close-modal": () => closeModal(),
    "toggle-search": () => {
      $("#mobile-search")?.classList.toggle("hidden");
      $("#search-input-m")?.focus();
    },
    "toggle-notices": () => {
      const panel = $("#notice-panel");
      if (!panel) return;
      if (panel.classList.contains("hidden")) {
        $("#search-panel")?.classList.add("hidden");
        renderNotices();
        panel.classList.remove("hidden");
      } else {
        closePanels(true);
      }
    },
    "read-all": () => {
      state.notices.forEach((n) => {
        n.read = true;
      });
      commit();
      toast("\u0110\xE3 \u0111\xE1nh d\u1EA5u t\u1EA5t c\u1EA3 l\xE0 \u0111\xE3 \u0111\u1ECDc");
    },
    "open-result": (el) => {
      const kind = el.dataset.kind;
      const id = el.dataset.id ?? "";
      closePanels(true);
      ["#search-input", "#search-input-m"].forEach((s) => {
        const i = $(s);
        if (i) i.value = "";
      });
      if (kind === "product") {
        const p = PRODUCTS.find((x) => x.id === id);
        ui.shopCat = "all";
        ui.shopQuery = p ? p.name : "";
        goTo("shop");
        if (p) openProduct_(p.id);
      } else if (kind === "course") {
        goTo("home");
      } else if (kind === "listing") {
        goTo("utilities", "all");
        openListing(id);
      } else if (kind === "lang") {
        state.lang = id;
        ui.learnStage = "menu";
        commit();
        goTo("learn");
        ui.learnStage = "menu";
        renderLearn();
      } else if (kind === "tool") {
        goTo("utilities", "other");
        openTool(id);
      } else if (kind === "post") {
        goTo("community");
      }
    },
    /* ---- learning ---- */
    "home-review": (el) => {
      const picker = document.getElementById("learn-home-language");
      state.lang = picker?.value || state.lang || "en";
      commit();
      const mode = el.dataset.mode;
      actions[mode === "grammar" ? "open-grammar" : mode === "practice" ? "open-practice" : "open-vocab"]();
    },
    "home-open-cultivation": () => {
      const picker = document.getElementById("learn-home-language");
      const code = picker?.value || state.lang || "en";
      state.lang = code;
      ui.learnStage = "menu";
      commit();
      goTo("learn");
      renderLearn();
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    "select-lang": (el) => {
      const code = el.dataset.code;
      state.lang = code;
      ui.learnStage = "menu";
      commit();
      renderLearn();
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
