/*@file js/app/22-tool-modals.js
 * Hộp thoại công cụ: Pomodoro, nhắc việc, tính GPA.
 */
  function fmtClock(sec) {
    const m = Math.floor(sec / 60);
    return `${String(m).padStart(2, "0")}:${String(sec % 60).padStart(2, "0")}`;
  }
  function pomodoroModal() {
    const p = ui.pomo;
    return `${modalHead("\u23F1 \u0110\u1ED3ng h\u1ED3 Pomodoro")}
  <div class="p-6 text-center space-y-4">
    <p class="text-xs font-bold uppercase tracking-wider ${p.mode === "focus" ? "text-rose-500" : "text-emerald-600"}">${p.mode === "focus" ? "T\u1EADp trung" : "Ngh\u1EC9 ng\u01A1i"}</p>
    <p id="pomo-time" class="text-6xl font-black text-slate-800 tabular-nums">${fmtClock(p.remaining)}</p>
    <p class="text-xs text-slate-500">Phi\xEAn \u0111\xE3 ho\xE0n th\xE0nh: <b>${p.sessions}</b></p>
    <div class="flex gap-2 justify-center">
      <button data-action="pomo-toggle" class="${btnPrimary}">${p.running ? "T\u1EA1m d\u1EEBng" : "B\u1EAFt \u0111\u1EA7u"}</button>
      <button data-action="pomo-reset" class="${btnGhost}">\u0110\u1EB7t l\u1EA1i</button>
    </div>
  </div>`;
  }
  function remindersModal() {
    const items = [...state.reminders].sort((a, b) => (a.when || "9").localeCompare(b.when || "9"));
    return `${modalHead("\u{1F5D3}\uFE0F L\u1ECBch nh\u1EAFc nh\u1EDF")}
  <div class="p-5 space-y-4">
    <div class="space-y-2">
      <input id="rm-text" maxlength="100" placeholder="Vi\u1EC7c c\u1EA7n l\xE0m, v\xED d\u1EE5: \xD4n Part 3 TOEIC" class="${field}">
      <div class="flex gap-2"><input id="rm-when" type="datetime-local" class="${field}"><button data-action="add-reminder" class="${btnPrimary} whitespace-nowrap">Th\xEAm</button></div>
    </div>
    <div class="space-y-2">
      ${items.length ? items.map((r) => `
      <div class="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2">
        <input type="checkbox" data-change="toggle-reminder" data-id="${r.id}" ${r.done ? "checked" : ""} class="accent-sky-600 w-4 h-4" aria-label="Ho\xE0n th\xE0nh">
        <div class="flex-1 min-w-0"><p class="text-xs font-semibold ${r.done ? "line-through text-slate-400" : "text-slate-800"} break-words">${esc(r.text)}</p>${r.when ? `<p class="text-[10px] text-slate-400">${esc(r.when.replace("T", " "))}</p>` : ""}</div>
        <button data-action="delete-reminder" data-id="${r.id}" class="text-slate-400 hover:text-rose-500 text-lg leading-none" aria-label="X\xF3a">&times;</button>
      </div>`).join("") : '<p class="text-xs text-slate-500 text-center py-4">Ch\u01B0a c\xF3 nh\u1EAFc nh\u1EDF n\xE0o.</p>'}
    </div>
  </div>`;
  }
  var gpaRows = [
    { score: "", credit: "" },
    { score: "", credit: "" },
    { score: "", credit: "" }
  ];
  var gpaResult = "";
  function setGpaResult(v) {
    gpaResult = v;
  }
  function gpaModal() {
    return `${modalHead("\u{1F9EE} T\xEDnh GPA")}
  <div class="p-5 space-y-3">
    <p class="text-xs text-slate-500">Nh\u1EADp \u0111i\u1EC3m m\xF4n (thang 10) v\xE0 s\u1ED1 t\xEDn ch\u1EC9.</p>
    ${gpaRows.map((r, i) => `<div class="grid grid-cols-2 gap-2"><input data-gpa="score" data-i="${i}" type="number" min="0" max="10" step="0.1" value="${esc(r.score)}" placeholder="\u0110i\u1EC3m m\xF4n ${i + 1}" class="${field}"><input data-gpa="credit" data-i="${i}" type="number" min="1" max="20" step="1" value="${esc(r.credit)}" placeholder="S\u1ED1 t\xEDn ch\u1EC9" class="${field}"></div>`).join("")}
    <div class="flex gap-2"><button data-action="gpa-add" class="${btnGhost}">+ Th\xEAm m\xF4n</button><button data-action="gpa-calc" class="flex-1 ${btnPrimary}">T\xEDnh GPA</button></div>
    ${gpaResult ? `<div class="rounded-xl bg-emerald-50 border border-emerald-200 p-3 text-sm text-emerald-900">${gpaResult}</div>` : ""}
  </div>`;
  }
