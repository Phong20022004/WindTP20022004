/*@file js/app/24-app-navigation.js
 * Điều hướng tab, theme sáng/tối, đóng panel.
 */
  // src/app.ts
  var val = (id) => ($(`#${id}`)?.value ?? "").trim();
  function applyTheme() {
    document.documentElement.classList.toggle("dark", state.settings.dark);
    setSfxEnabled(state.settings.sfx);
  }
  function renderAll() {
    renderHeader();
    renderNav();
    renderTab(ui.tab);
    if (!$("#notice-panel")?.classList.contains("hidden")) renderNotices();
  }
  function isTab(v) {
    return !!v && TABS.includes(v);
  }
  function goTo(tab, cat, push = true) {
    if (tab === "learn") ui.learnStage = "language";
    ui.tab = tab;
    if (tab === "utilities" && cat) ui.utilCat = cat;
    closePanels(true);
    showTab(tab);
    renderTab(tab);
    renderNav();
    if (push) {
      try {
        history.pushState(null, "", "#/" + tab);
      } catch {
      }
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  function closePanels(markRead) {
    const np = $("#notice-panel");
    if (np && !np.classList.contains("hidden")) {
      np.classList.add("hidden");
      if (markRead && state.notices.some((n) => !n.read)) {
        state.notices.forEach((n) => {
          n.read = true;
        });
        commit();
      }
    }
    $("#search-panel")?.classList.add("hidden");
  }
