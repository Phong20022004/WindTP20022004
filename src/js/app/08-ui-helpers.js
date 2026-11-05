/*@file js/app/08-ui-helpers.js
 * Trạng thái giao diện (ui) và vài hàm dựng UI nhỏ.
 */
  // src/ui.ts
  var TABS = ["home", "learn", "shop", "entertainment", "tasks", "utilities", "community", "wallet"];
  var ui = {
    tab: "home",
    learnStage: "language",
    selectedBookSeries: "",
    slide: 0,
    utilCat: "all",
    shopCat: "all",
    shopPay: "money",
    courseLang: "en",
    shopSub: "",
    shopSort: "smart",
    xuAfford: false,
    shopQuery: "",
    historyFilter: "all",
    openComments: /* @__PURE__ */ new Set(),
    draft: "",
    draftTag: "Chung",
    match: { lang: "en", level: 1, goal: "Giao ti\u1EBFp", searched: false },
    quiz: null,
    flash: null,
    dialog: null,
    pomo: { running: false, remaining: 25 * 60, mode: "focus", sessions: 0 },
    volume: 50,
    profileTab: "avatar",
    avatarCategory: "streak",
    renderModal: null,
    modalSide: false
  };
  var toastTimer;
  function toast(message) {
    const el = $("#toast");
    const msg = $("#toast-message");
    if (!el || !msg) return;
    msg.textContent = message;
    el.classList.remove("opacity-0", "pointer-events-none");
    if (toastTimer !== void 0) window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => el.classList.add("opacity-0", "pointer-events-none"), 2600);
  }
  function openModal(render, side = false) {
    ui.renderModal = render;
    ui.modalSide = side;
    refreshModal();
  }
  function refreshModal() {
    const host = $("#modal-host");
    if (!host) return;
    if (!ui.renderModal) {
      host.classList.add("hidden");
      host.innerHTML = "";
      return;
    }
    const body = ui.renderModal();
    host.className = ui.modalSide ? "fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex justify-end" : "fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4";
    const panel = ui.modalSide ? "bg-white w-full max-w-sm h-full overflow-y-auto shadow-2xl slide-in flex flex-col" : "bg-white w-full max-w-md max-h-[92vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl shadow-2xl pop-in";
    host.innerHTML = `<div data-modal-bg class="absolute inset-0"></div><div role="dialog" aria-modal="true" class="relative ${panel}">${body}</div>`;
    host.querySelector("[data-autofocus]")?.focus();
  }
  function closeModal() {
    ui.renderModal = null;
    ui.quiz = null;
    ui.flash = null;
    ui.dialog = null;
    refreshModal();
  }
  function modalHead(title) {
    return `<div class="flex justify-between items-center border-b border-slate-100 px-5 py-3.5 sticky top-0 bg-white z-10">
    <h3 class="font-extrabold text-slate-800 text-base">${title}</h3>
    <button data-action="close-modal" class="text-slate-400 hover:text-slate-600 text-2xl leading-none px-1" aria-label="\u0110\xF3ng">&times;</button>
  </div>`;
  }

