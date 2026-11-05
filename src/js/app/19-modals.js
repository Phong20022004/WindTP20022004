/*@file js/app/19-modals.js
 * Các hộp thoại chung của app.
 */
  // src/modals.ts
  var btnPrimary = "px-4 py-2 rounded-xl text-xs font-bold bg-sky-600 hover:bg-sky-700 text-white keep-white";
  var btnGhost = "px-4 py-2 rounded-xl text-xs font-bold bg-white border border-slate-200 text-slate-700 hover:bg-slate-50";
  var field = "w-full px-3 py-2 text-sm rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-sky-400";
  function vocabModal() {
    const f = ui.flash;
    if (!f) return "";
    const lang = langByCode(f.lang);
    if (f.done) {
      const known = (state.known[lang.code] ?? []).length;
      return `${modalHead("\u{1F4D6} T\u1EEB v\u1EF1ng " + lang.name)}
    <div class="p-6 text-center space-y-3">
      <div class="text-5xl">\u{1F389}</div>
      <p class="font-extrabold text-slate-800">Ho\xE0n th\xE0nh l\u01B0\u1EE3t \xF4n!</p>
      <p class="text-sm text-slate-600">B\u1EA1n \u0111\xE1nh d\u1EA5u thu\u1ED9c th\xEAm <b>${f.knownNow}</b> t\u1EEB. T\u1ED5ng \u0111\xE3 thu\u1ED9c: <b>${known}/${lang.vocab.length}</b>.</p>
      <div class="flex gap-2 justify-center pt-2"><button data-action="vocab-restart" class="${btnGhost}">\xD4n l\u1EA1i</button><button data-action="close-modal" class="${btnPrimary}">Xong</button></div>
    </div>`;
    }
    const v = lang.vocab[f.order[f.pos]];
    const knownNow = (state.known[lang.code] ?? []).includes(v.term);
    return `${modalHead(`\u{1F4D6} T\u1EEB v\u1EF1ng ${lang.name} (${f.pos + 1}/${f.order.length})`)}
  <div class="p-5 space-y-4">
    <div class="h-1.5 rounded-full bg-slate-200 overflow-hidden"><div class="h-full bg-sky-500" style="width:${f.pos / f.order.length * 100}%"></div></div>
    <button data-action="flip-card" class="card-flip block w-full h-56 text-left" aria-label="L\u1EADt th\u1EBB">
      <div class="card-face relative w-full h-full ${f.flipped ? "flipped" : ""}">
        <div class="card-front absolute inset-0 rounded-3xl bg-gradient-to-br from-sky-500 to-indigo-600 text-white keep-white flex flex-col items-center justify-center p-4 text-center">
          <p class="text-4xl font-black break-words">${esc(v.term)}</p>
          <p class="text-sm opacity-90 mt-2">${esc(v.reading)}</p>
          <p class="text-[11px] opacity-70 mt-5">Ch\u1EA1m \u0111\u1EC3 xem ngh\u0129a</p>
          ${knownNow ? '<span class="absolute top-3 right-3 text-[10px] bg-white/25 px-2 py-0.5 rounded-full">\u2713 \u0110\xE3 thu\u1ED9c</span>' : ""}
        </div>
        <div class="card-back absolute inset-0 rounded-3xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white keep-white flex flex-col items-center justify-center p-5 text-center">
          <p class="text-2xl font-extrabold">${esc(v.meaning)}</p>
          <p class="text-sm mt-3 break-words">${esc(v.example)}</p>
          <p class="text-xs opacity-80 mt-1">${esc(v.exampleVi)}</p>
        </div>
      </div>
    </button>
    <div class="grid grid-cols-2 gap-3">
      <button data-action="vocab-answer" data-known="0" class="${btnGhost}">Ch\u01B0a thu\u1ED9c</button>
      <button data-action="vocab-answer" data-known="1" class="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white keep-white">\u0110\xE3 thu\u1ED9c</button>
    </div>
  </div>`;
  }
  function grammarModal() {
    const lang = langByCode(state.lang ?? "en");
    return `${modalHead("\u270D\uFE0F Ng\u1EEF ph\xE1p " + lang.name)}
  <div class="p-5 space-y-3">
    ${dailyLesson(lang).grammar.map((gi, i) => {
      const g = lang.grammar[gi];
      const done = state.daily.lessons.includes(`grammar:${lang.code}:${i}`);
      return `<div class="rounded-2xl border border-slate-200 p-4 space-y-1.5">
        <p class="font-extrabold text-sm text-indigo-700">${i + 1}. ${esc(g.title)}</p>
        <p class="text-xs font-mono bg-slate-100 rounded-lg px-2 py-1 text-slate-700 break-words">${esc(g.pattern)}</p>
        <p class="text-xs text-slate-600">${esc(g.explain)}</p>
        <p class="text-sm font-semibold text-slate-800 break-words">${esc(g.example)}</p>
        <p class="text-xs text-slate-500">${esc(g.exampleVi)}</p>
        <button data-action="grammar-done" data-i="${i}" ${done ? "disabled" : ""} class="mt-1 px-3 py-1 rounded-lg text-[11px] font-bold ${done ? "bg-slate-200 text-slate-500" : "bg-indigo-600 text-white keep-white hover:bg-indigo-700"}">${done ? "\u2713 \u0110\xE3 hi\u1EC3u h\xF4m nay" : "\u0110\xE3 hi\u1EC3u"}</button>
      </div>`;
    }).join("")}
  </div>`;
  }
  function dialogModal() {
    const d = ui.dialog;
    if (!d) return "";
    const lang = langByCode(d.lang);
    if (d.done) {
      return `${modalHead("\u{1F3AF} Luy\u1EC7n giao ti\u1EBFp " + lang.name)}
    <div class="p-6 text-center space-y-3">
      <div class="text-5xl">${d.good === lang.dialogs.length ? "\u{1F3C6}" : "\u{1F44D}"}</div>
      <p class="font-extrabold text-slate-800">B\u1EA1n tr\u1EA3 l\u1EDDi \u0111\xFAng ngay l\u1EA7n \u0111\u1EA7u ${d.good}/${lang.dialogs.length} t\xECnh hu\u1ED1ng</p>
      <div class="flex gap-2 justify-center pt-2"><button data-action="dialog-restart" class="${btnGhost}">Luy\u1EC7n l\u1EA1i</button><button data-action="close-modal" class="${btnPrimary}">Xong</button></div>
    </div>`;
    }
    const scene = lang.dialogs[d.idx];
    const answered = d.picked !== null;
    return `${modalHead(`\u{1F3AF} ${lang.name} (${d.idx + 1}/${lang.dialogs.length})`)}
  <div class="p-5 space-y-4">
    <p class="text-[11px] font-bold uppercase tracking-wider text-sky-700">${esc(scene.scene)}</p>
    <div class="rounded-2xl bg-sky-50/60 border border-sky-200 p-4"><p class="text-lg font-extrabold text-slate-800 break-words">${esc(scene.line)}</p><p class="text-xs text-slate-500 mt-1">${esc(scene.lineVi)}</p></div>
    <p class="text-xs font-bold text-slate-600">Ch\u1ECDn c\xE2u tr\u1EA3 l\u1EDDi ph\xF9 h\u1EE3p:</p>
    <div class="space-y-2">
      ${d.order.map((oi, pos) => {
      const o = scene.options[oi];
      let cls = "bg-white border-slate-200 hover:border-sky-400";
      if (answered) {
        if (o.correct) cls = "bg-emerald-50 border-emerald-400 text-emerald-800";
        else if (d.picked === pos) cls = "bg-rose-50 border-rose-400 text-rose-800";
        else cls = "bg-white border-slate-200 opacity-60";
      }
      return `<button data-action="dialog-pick" data-pos="${pos}" ${answered ? "disabled" : ""} class="w-full text-left px-4 py-2.5 rounded-xl border text-sm font-semibold ${cls}">${esc(o.text)}</button>`;
    }).join("")}
    </div>
    ${answered ? `<div class="flex justify-end"><button data-action="dialog-next" class="${btnPrimary}">${d.idx + 1 >= lang.dialogs.length ? "Ho\xE0n th\xE0nh" : "T\xECnh hu\u1ED1ng ti\u1EBFp"}</button></div>` : ""}
  </div>`;
  }
  function certModal(certId) {
    const lang = langByCode(state.lang ?? "en");
    const c = lang.certs.find((x) => x.id === certId) ?? lang.certs[0];
    const t = tone(c.tone);
    return `${modalHead(c.name)}
  <div class="p-5 space-y-4">
    <div class="rounded-2xl bg-gradient-to-br ${t.card} border p-4"><p class="font-extrabold ${t.title}">${esc(c.name)} \u2022 ${esc(c.sub)}</p><p class="text-xs ${t.sub} mt-1">${esc(c.desc)}</p></div>
    <div><p class="text-xs font-bold text-slate-700 mb-1">C\u1EA5u tr\xFAc b\xE0i thi</p><ul class="list-disc pl-5 text-xs text-slate-600 space-y-0.5">${c.structure.map((x) => `<li>${esc(x)}</li>`).join("")}</ul></div>
    <p class="text-xs text-slate-600"><b>C\u1EA5p \u0111\u1ED9 / thang \u0111i\u1EC3m:</b> ${esc(c.levels)}</p>
    <div class="rounded-xl bg-sky-50 border border-sky-200 p-3 text-xs text-sky-900">\u0110\u1EC1 th\u1EED g\u1ED3m 7 c\xE2u (t\u1EEB v\u1EF1ng v\xE0 ng\u1EEF ph\xE1p). L\xE0m \u0111\u1EC1 \u0111\u1EC3 t\u1EF1 \u0111\xE1nh gi\xE1 tr\xECnh \u0111\u1ED9 c\u1EE7a b\u1EA1n.</div>
    <button data-action="start-cert-quiz" data-id="${c.id}" class="w-full ${btnPrimary}">Gi\u1EA3i \u0111\u1EC1 th\u1EED 7 c\xE2u</button>
  </div>`;
  }
  function quizModal() {
    const q = ui.quiz;
    if (!q) return "";
    if (q.finished) {
      const won = q.kind === "game" && q.streak >= q.target;
      const again = `<button data-action="quiz-again" class="${btnGhost}">${q.kind === "game" ? "Ch\u01A1i l\u1EA1i" : "L\xE0m l\u1EA1i"}</button>`;
      const change = q.kind === "game" ? `<button data-action="change-game-lang" class="${btnGhost}">\u0110\u1ED5i ng\xF4n ng\u1EEF</button>` : "";
      return `${modalHead(q.title)}
    <div class="p-6 text-center space-y-3">
      <div class="text-5xl">${won ? "\u{1F3C6}" : q.correct >= q.questions.length * 0.7 ? "\u{1F389}" : "\u{1F4AA}"}</div>
      ${q.kind === "game" ? `<p class="font-extrabold text-slate-800">${won ? "Chu\u1ED7i 10 c\xE2u \u0111\xFAng!" : "K\u1EBFt th\xFAc v\xE1n ch\u01A1i"}</p><p class="text-sm text-slate-600">${won ? `B\u1EA1n \u0111\xE3 ho\xE0n th\xE0nh nhi\u1EC7m v\u1EE5 <b>Th\u1EAFng \u0111\u1ED1 vui</b>. V\xE0o Ti\u1EC7n \xEDch &gt; Nhi\u1EC7m v\u1EE5 \u0111\u1EC3 nh\u1EADn <b>${fmt(GAME_REWARD)} Xu</b>.` : `Chu\u1ED7i hi\u1EC7n t\u1EA1i ${q.streak}/${q.target}.`}</p>` : `<p class="font-extrabold text-slate-800">\u0110\xFAng ${q.correct}/${q.questions.length} c\xE2u</p><p class="text-sm text-slate-600">H\xE3y luy\u1EC7n t\u1EADp th\xEAm \u0111\u1EC3 nh\u1EDB l\xE2u h\u01A1n nh\xE9.</p>`}
      <div class="flex flex-wrap gap-2 justify-center pt-2">${again}${change}<button data-action="close-modal" class="${btnPrimary}">Xong</button></div>
    </div>`;
    }
    const cur = q.questions[q.idx];
    const answered = q.picked !== null;
    const status = q.kind === "game" ? `Chu\u1ED7i \u0111\xFAng: ${q.streak}/${q.target}` : `C\xE2u ${q.idx + 1}/${q.questions.length}`;
    const pct = q.kind === "game" ? q.streak / q.target * 100 : q.idx / q.questions.length * 100;
    const last = q.kind !== "game" && q.idx + 1 >= q.questions.length;
    let promptBox;
    if (cur.speak) {
      promptBox = `<div class="rounded-2xl bg-sky-50/60 border border-sky-200 p-4 text-center space-y-2">
      <p class="text-[11px] text-slate-500">${esc(cur.sub)}</p>
      <button data-action="quiz-speak" class="w-16 h-16 rounded-full bg-sky-600 hover:bg-sky-700 text-white keep-white text-2xl shadow-md" aria-label="Ph\xE1t \xE2m thanh">\u{1F50A}</button>
      ${speechSupported() ? '<p class="text-[10px] text-slate-400">B\u1EA5m \u0111\u1EC3 nghe l\u1EA1i</p>' : `<p class="text-sm font-bold text-slate-700">${esc(cur.speak)}</p><p class="text-[10px] text-slate-400">Tr\xECnh duy\u1EC7t kh\xF4ng h\u1ED7 tr\u1EE3 \u0111\u1ECDc, h\xE3y d\xF9ng ch\u1EEF \u1EDF tr\xEAn.</p>`}
    </div>`;
    } else {
      promptBox = `<div class="rounded-2xl bg-sky-50/60 border border-sky-200 p-4 text-center"><p class="text-[11px] text-slate-500">${esc(cur.sub)}</p><p class="${cur.prompt.length > 40 ? "text-lg" : "text-2xl"} font-black text-slate-800 break-words mt-1">${esc(cur.prompt)}</p></div>`;
    }
    let body;
    if (cur.write) {
      body = `<div class="space-y-2">
      <input id="qz-write" data-autofocus type="text" autocomplete="off" autocapitalize="off" spellcheck="false" ${answered ? "disabled" : ""} value="${esc(q.wrote)}" placeholder="G\xF5 \u0111\xE1p \xE1n c\u1EE7a b\u1EA1n..." class="${field} ${answered ? q.wroteOk ? "border-emerald-400 bg-emerald-50" : "border-rose-400 bg-rose-50" : ""}">
      ${cur.hint && !answered ? `<p class="text-[11px] text-slate-500">${esc(cur.hint)}</p>` : ""}
      ${answered ? `<p class="text-xs font-bold ${q.wroteOk ? "text-emerald-700" : "text-rose-600"}">${q.wroteOk ? "Ch\xEDnh x\xE1c!" : `Ch\u01B0a \u0111\xFAng. \u0110\xE1p \xE1n: ${esc(cur.write[0])}${cur.write[1] ? ` (${esc(cur.write[1])})` : ""}`}</p>` : `<button data-action="quiz-write" class="w-full ${btnPrimary}">Ki\u1EC3m tra</button>`}
    </div>`;
    } else {
      body = `<div class="grid grid-cols-1 gap-2">
      ${cur.options.map((o, i) => {
        let cls = "bg-white border-slate-200 hover:border-sky-400";
        if (answered) {
          if (i === cur.answer) cls = "bg-emerald-50 border-emerald-400 text-emerald-800";
          else if (i === q.picked) cls = "bg-rose-50 border-rose-400 text-rose-800";
          else cls = "bg-white border-slate-200 opacity-60";
        }
        return `<button data-action="quiz-pick" data-i="${i}" ${answered ? "disabled" : ""} class="w-full text-left px-4 py-2.5 rounded-xl border text-sm font-semibold ${cls}">${esc(o)}</button>`;
      }).join("")}
    </div>`;
    }
    return `${modalHead(q.title)}
  <div class="p-5 space-y-4">
    <div class="flex items-center justify-between text-xs font-bold text-slate-600"><span>${status}</span>${q.kind === "game" ? '<span class="text-purple-600">Nhi\u1EC7m v\u1EE5: ' + fmt(GAME_REWARD) + " Xu</span>" : ""}</div>
    <div class="h-1.5 rounded-full bg-slate-200 overflow-hidden"><div class="h-full ${q.kind === "game" ? "bg-purple-500" : "bg-sky-500"}" style="width:${pct}%"></div></div>
    ${promptBox}
    ${body}
    ${answered ? `<div class="flex justify-end"><button data-action="quiz-next" class="${btnPrimary}">${last ? "Xem k\u1EBFt qu\u1EA3" : q.kind === "game" && q.streak >= q.target ? "Nh\u1EADn th\u01B0\u1EDFng" : "C\xE2u ti\u1EBFp theo"}</button></div>` : ""}
  </div>`;
  }
  function practiceModal() {
    const lang = langByCode(state.lang ?? "en");
    const card = (action, mode, icon, title, sub) => `<button data-action="${action}" ${mode ? `data-mode="${mode}"` : ""} class="text-left p-4 rounded-2xl border border-slate-200 bg-white hover:border-sky-400 hover:shadow-md transition-all">
      <div class="text-2xl mb-1">${icon}</div><p class="text-sm font-extrabold text-slate-800">${title}</p><p class="text-[11px] text-slate-500 mt-0.5">${sub}</p></button>`;
    return `${modalHead(`\u{1F3AF} Luy\u1EC7n t\u1EADp ${lang.name} ${lang.flag}`)}
  <div class="p-5 space-y-3">
    <p class="text-xs text-slate-600">Ch\u1ECDn k\u1EF9 n\u0103ng mu\u1ED1n luy\u1EC7n. M\u1ED7i b\xE0i g\u1ED3m 5 c\xE2u.</p>
    <div class="grid grid-cols-2 gap-3">
      ${card("start-practice", "listen", "\u{1F3A7}", "Nghe", "Nghe ph\xE1t \xE2m r\u1ED3i ch\u1ECDn ngh\u0129a \u0111\xFAng")}
      ${card("start-practice", "read", "\u{1F440}", "\u0110\u1ECDc", "\u0110\u1ECDc c\xE2u v\xE0 ch\u1ECDn b\u1EA3n d\u1ECBch \u0111\xFAng")}
      ${card("start-practice", "write", "\u270D\uFE0F", "Vi\u1EBFt", "Nh\xECn ngh\u0129a ti\u1EBFng Vi\u1EC7t, g\xF5 t\u1EEB t\u01B0\u01A1ng \u1EE9ng")}
      ${card("open-dialog", "", "\u{1F4AC}", "H\u1ED9i tho\u1EA1i", `${lang.dialogs.length} t\xECnh hu\u1ED1ng giao ti\u1EBFp`)}
    </div>
  </div>`;
  }
  function gamePickModal() {
    return `${modalHead("\u{1F3AF} Ch\u1ECDn ng\xF4n ng\u1EEF \u0111\u1EC3 ch\u01A1i")}
  <div class="p-5 space-y-3">
    <p class="text-xs text-slate-600">C\xE2u h\u1ECFi s\u1EBD l\u1EA5y t\u1EEB v\u1EF1ng c\u1EE7a ng\xF4n ng\u1EEF b\u1EA1n ch\u1ECDn. Th\u1EAFng v\xE1n (\u0111\xFAng 10 c\xE2u li\xEAn ti\u1EBFp) \u0111\u1EC3 ho\xE0n th\xE0nh nhi\u1EC7m v\u1EE5 nh\u1EADn <b class="text-purple-600">5,000 Xu</b>.</p>
    <div class="grid grid-cols-2 gap-2.5">
      ${LANGUAGES.map((l, i) => `<button data-action="game-lang" data-code="${l.code}" class="px-3 py-3 rounded-2xl border border-slate-200 bg-white hover:border-purple-400 hover:shadow-sm font-bold text-xs flex items-center gap-2 ${i === LANGUAGES.length - 1 ? "col-span-2 justify-center" : ""}"><span class="text-2xl">${l.flag}</span><span>${l.name}</span></button>`).join("")}
    </div>
    
  </div>`;
  }
  function cartModal() {
    const cur = state.settings.currency;
    const rows = Object.entries(state.cart).map(([id, qty]) => ({ p: PRODUCTS.find((x) => x.id === id), qty })).filter((r) => r.p);
    const total = cartTotal();
    return `${modalHead("\u{1F9FA} Gi\u1ECF h\xE0ng")}
  <div class="p-5 flex-1 space-y-3">
    ${rows.length ? rows.map(({ p, qty }) => `
    <div class="flex items-center gap-3 border-b border-slate-100 pb-3">
      <div class="text-3xl">${p.emoji}</div>
      <div class="flex-1 min-w-0"><p class="text-xs font-bold text-slate-800 truncate">${p.name}</p><p class="text-[11px] font-black text-sky-700">${money(p.price[cur], cur)}</p></div>
      <div class="flex items-center gap-1.5">
        <button data-action="cart-dec" data-id="${p.id}" class="w-6 h-6 rounded-full bg-slate-100 text-slate-700 font-bold" aria-label="Gi\u1EA3m">\u2212</button>
        <span class="text-xs font-bold w-5 text-center">${qty}</span>
        <button data-action="cart-inc" data-id="${p.id}" class="w-6 h-6 rounded-full bg-slate-100 text-slate-700 font-bold" aria-label="T\u0103ng">+</button>
      </div>
    </div>`).join("") : '<p class="text-sm text-slate-500 text-center py-10">Gi\u1ECF h\xE0ng \u0111ang tr\u1ED1ng.</p>'}
  </div>
  ${rows.length ? `<div class="p-5 border-t border-slate-100 space-y-3 sticky bottom-0 bg-white">
    <div class="flex justify-between text-sm"><span class="text-slate-600">T\u1EA1m t\xEDnh (${CURRENCIES[cur].name})</span><span class="font-black text-sky-700">${money(total, cur)}</span></div>
    <div class="flex gap-2"><button data-action="cart-clear" class="${btnGhost}">X\xF3a gi\u1ECF</button>
    <button data-action="checkout" class="flex-1 ${btnPrimary}">Thanh to\xE1n ${money(total, cur)}</button></div>
  </div>` : ""}`;
  }
  function payModal() {
    const cur = state.settings.currency;
    const total = cartTotal();
    return `${modalHead("\u{1F4B3} Thanh to\xE1n \u0111\u01A1n h\xE0ng")}
  <div class="p-5 space-y-4">
    <div class="rounded-2xl bg-slate-50 border border-slate-200 p-4 space-y-1">
      <p class="text-[11px] text-slate-500">${cartCount()} s\u1EA3n ph\u1EA9m \u2022 ${CURRENCIES[cur].flag} ${CURRENCIES[cur].name}</p>
      <p class="text-2xl font-black text-slate-800">${money(total, cur)}</p>
    </div>
    <div><label class="text-xs font-bold text-slate-600" for="pay-method">Ph\u01B0\u01A1ng th\u1EE9c thanh to\xE1n</label>
      <select id="pay-method" class="${field} mt-1">${CURRENCIES[cur].methods.map((m) => `<option>${m}</option>`).join("")}</select></div>
    ${bankBox(cur, payCode("payCode"))}
    <p class="text-[11px] text-slate-500">Xu kh\xF4ng th\u1EC3 d\xF9ng \u0111\u1EC3 thanh to\xE1n s\u1EA3n ph\u1EA9m WIND Store. Ch\u1EC9 b\u1EA5m "X\xE1c nh\u1EADn thanh to\xE1n" <b>sau khi \u0111\xE3 chuy\u1EC3n kho\u1EA3n xong</b>; \u0111\u01A1n s\u1EBD hi\u1EC7n "Ch\u1EDD x\u1EED l\xFD" cho \u0111\u1EBFn khi \u0111\u01B0\u1EE3c x\xE1c minh.</p>
    <div class="flex gap-2"><button data-action="open-cart" class="${btnGhost}">Quay l\u1EA1i</button><button data-action="pay-order" class="flex-1 ${btnPrimary}">X\xE1c nh\u1EADn thanh to\xE1n</button></div>
  </div>`;
  }
  var FB_PAGE = "https://www.facebook.com/profile.php?id=61590914339438";
  function payCode(k) { if (!ui[k]) ui[k] = newOrderCode(k === "topupCode" ? ((ui.topup && (ui.topup.src === "game" || ui.topup.src === "chip")) ? "game" : "topup") : "store"); return ui[k]; }
  function bankBox(cur, code) {
    cur = cur || state.settings.currency;
    const acc = cur === "VND" ? { bank: "Techcombank", num: "19072080970015" } : cur === "KRW" ? { bank: "Toss Bank (토스뱅크)", num: "1002-7308-5584" } : null;
    const body = acc
      ? `<p class="text-xs text-slate-700">Ngân hàng: <b>${acc.bank}</b></p>
      <p class="text-xs text-slate-700 flex items-center gap-2 flex-wrap">Số tài khoản: <b class="text-sm tracking-wide">${acc.num}</b><button data-action="copy-acc" data-text="${acc.num}" class="px-2 py-0.5 rounded-lg bg-white border border-amber-300 text-[10px] font-bold text-amber-800">Sao chép</button></p>
      <p class="text-xs text-slate-700">Chủ tài khoản: <b>LE THANH PHONG</b></p>`
      : `<p class="text-xs text-slate-700">Tài khoản nhận tiền tại Nhật Bản: <b>sẽ được cập nhật sau</b>.</p>`;
    const memo = code ? `<p class="text-xs text-slate-700 flex items-center gap-2 flex-wrap">Nội dung chuyển khoản (mã đơn): <b class="text-sm tracking-wide">${code}</b><button data-action="copy-acc" data-text="${code}" class="px-2 py-0.5 rounded-lg bg-white border border-amber-300 text-[10px] font-bold text-amber-800">Sao chép</button></p>` : "";
    return `<div class="rounded-2xl bg-amber-50 border border-amber-200 p-4 space-y-1.5">
      <p class="text-[11px] font-extrabold text-amber-800 uppercase tracking-wide">🏦 Thông tin chuyển khoản · ${CURRENCIES[cur].flag} ${CURRENCIES[cur].name}</p>
      ${body}
      ${memo}
      <p class="text-[11px] text-rose-600 font-bold pt-1">⚠️ Trước khi chuyển khoản, hãy kiểm tra đúng tên chủ tài khoản và liên hệ trang Facebook để được hỗ trợ xác minh.</p>
      <div class="flex gap-2 flex-wrap pt-1"><button data-action="open-fb" class="px-3 py-1.5 rounded-lg bg-blue-600 text-white keep-white text-[11px] font-bold">💬 Liên hệ trang Facebook</button><button data-action="copy-acc" data-text="${FB_PAGE}" class="px-3 py-1.5 rounded-lg bg-white border border-blue-300 text-blue-700 text-[11px] font-bold">Sao chép link</button></div>
    </div>`;
  }
  var TOPUP_AMOUNTS = [5e4, 1e5, 2e5, 5e5, 1e6];
  var TOPUP_RATE = { VND: 1, KRW: 19, JPY: 160 };
  var MINPAY = { VND: 30000, KRW: 2000, JPY: 200 };
  var BIG_THR = { VND: 1000000, KRW: 52600, JPY: 6250 };
  var CHIP_LIM = { minorDaily: 1e5, adultDaily: 5e6 }; // hạn mức đổi Xu → chip mỗi ngày (một nguồn duy nhất, game đọc qua WINDTP.chipLimit)
  var TOPUP_PRESETS = { VND: [3e4, 5e4, 1e5, 2e5, 5e5, 1e6], KRW: [2e3, 5e3, 1e4, 2e4, 5e4, 1e5], JPY: [200, 500, 1e3, 2e3, 5e3, 1e4] };
  function topupTitle() { return topupState().src === "chip" ? "🎰 Mua chip trong game" : topupState().src === "game" ? "🪙 Mua xu trong game" : "🪙 Nạp WIND Coin"; }
  function topupXu(cur, amt) { return Math.round(Number(amt) * TOPUP_RATE[cur]); }
  /* v41: đổi tiền tệ giữ nguyên mức đã chọn (cùng bậc) hoặc quy đổi theo giá trị với số nhập tay */
  function convertTopupAmt(from, to, amt) {
    amt = Number(amt) || 0;
    if (from === to) return amt;
    const i = TOPUP_PRESETS[from].indexOf(amt);
    if (i >= 0) return TOPUP_PRESETS[to][i];
    return Math.max(MINPAY[to], Math.round(amt * TOPUP_RATE[from] / TOPUP_RATE[to]));
  }
  function todayIso() { const d = new Date(); return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0"); }
  function ageFromBirth(b) { const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(b || ""); if (!m) return -1; const y = +m[1], mo = +m[2], d = +m[3], n = new Date(), t = new Date(y, mo - 1, d); if (t.getFullYear() !== y || t.getMonth() !== mo - 1 || t.getDate() !== d || t > n) return -1; let a = n.getFullYear() - y; if (n.getMonth() + 1 < mo || (n.getMonth() + 1 === mo && n.getDate() < d)) a--; return a; }
  function ageDateAt(b, n) { const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(b || ""); if (!m) return ""; const d = new Date(+m[1] + n, +m[2] - 1, +m[3]); return String(d.getDate()).padStart(2, "0") + "/" + String(d.getMonth() + 1).padStart(2, "0") + "/" + d.getFullYear(); }
  function ageGroupBox(b) {
    const a = ageFromBirth(b); if (a < 0) return "";
    const box = (bg, bd, title, body) => `<div style="border-radius:12px;padding:8px 10px;background:${bg};border:1px solid ${bd};line-height:1.45;color:#1f2937"><p style="font-weight:800;margin:0 0 2px;color:#111827">${title}</p><p style="margin:0;color:#1f2937">${body}</p></div>`;
    if (a < 12) return box("#fef2f2", "#fecaca", "🔒 Dưới 12 tuổi · " + a + " tuổi", "Chưa chơi được game đánh bài (Tiến lên, Phỏm, Ba cây, Liêng, Poker) và không mua chip. Vẫn chơi Cờ vua, Cờ tướng, Quay may mắn. Game bài mở khóa từ <b>" + ageDateAt(b, 12) + "</b>.");
    if (a < 18) return box("#fffbeb", "#fde68a", "⏳ 12–17 tuổi · " + a + " tuổi", "Chơi game bài tối đa <b>180 phút/ngày</b>, nhắc nghỉ sau 60 phút liên tục, <b>không mua chip bằng tiền</b> (đổi WIND Coin tối đa 100.000 chip/ngày). Mua chip bằng tiền từ <b>" + ageDateAt(b, 18) + "</b>.");
    return box("#ecfdf5", "#a7f3d0", "✅ Từ 18 tuổi · " + a + " tuổi", "Chơi đầy đủ game bài và mua chip bằng tiền (đổi WIND Coin tối đa 5.000.000 chip/ngày). Chip chỉ để giải trí, không đổi thưởng.");
  }
  function topupState() { if (!ui.topup) ui.topup = { cur: state.settings.currency, amt: TOPUP_PRESETS[state.settings.currency][1], step: 1 }; return ui.topup; }
  function topupModal() {
    const t = topupState(), cur = t.cur, xu = topupXu(cur, t.amt), U = t.src === "chip" ? "chip" : "Xu";
    if (t.step === 2) {
      const code = payCode("topupCode");
      return `${modalHead("\u{1FA99} Thanh to\xE1n n\u1EA1p Xu")}
  <div class="p-5 space-y-4">
    <div class="rounded-2xl bg-slate-50 border border-slate-200 p-4 space-y-1">
      <p class="text-[11px] text-slate-500">${CURRENCIES[cur].flag} ${CURRENCIES[cur].name}</p>
      <p class="text-2xl font-black text-slate-800">${money(t.amt, cur)}</p>
      <p class="text-sm font-bold text-amber-700">\u2192 ${fmt(xu)} Xu</p>
    </div>
    ${bankBox(cur, code)}
    <p class="text-[11px] text-slate-500">Ch\u1EC9 b\u1EA5m "X\xE1c nh\u1EADn thanh to\xE1n" <b>sau khi \u0111\xE3 chuy\u1EC3n kho\u1EA3n xong</b>. Xu s\u1EBD \u0111\u01B0\u1EE3c c\u1ED9ng sau khi \u0111\u01B0\u1EE3c x\xE1c minh.</p>
    <div class="flex gap-2"><button data-action="topup-back" class="${btnGhost}">Quay l\u1EA1i</button><button data-action="submit-topup" class="flex-1 ${btnPrimary}">X\xE1c nh\u1EADn thanh to\xE1n</button></div>
  </div>`;
    }
    const presets = TOPUP_PRESETS[cur];
    return `${modalHead("\u{1FA99} N\u1EA1p Xu")}
  <div class="p-5 space-y-4">
    <div><p class="text-xs font-bold text-slate-600 mb-1.5">1. Ch\u1ECDn lo\u1EA1i ti\u1EC1n</p>
      <div class="grid grid-cols-3 gap-2">${["VND", "KRW", "JPY"].map((c) => `<button data-action="topup-cur" data-cur="${c}" class="py-2 rounded-xl border text-xs font-bold ${c === cur ? "border-amber-500 bg-amber-50 text-amber-800" : "border-slate-200 text-slate-700"}">${CURRENCIES[c].flag} ${c}</button>`).join("")}</div></div>
    <div><p class="text-xs font-bold text-slate-600 mb-1.5">2. Ch\u1ECDn s\u1ED1 ti\u1EC1n</p>
      <div class="grid grid-cols-3 gap-2">${presets.map((a) => `<button data-action="topup-amt" data-amt="${a}" class="py-2.5 rounded-xl border text-xs font-bold ${Number(t.amt) === a ? "border-amber-500 bg-amber-50 text-amber-800" : "border-slate-200 text-slate-700"}">${money(a, cur)}</button>`).join("")}</div>
      <label class="text-[11px] text-slate-500 mt-2 block" for="topup-custom">Ho\u1EB7c nh\u1EADp s\u1ED1 kh\xE1c (${CURRENCIES[cur].symbol})</label>
      <input id="topup-custom" data-change="topup-custom" type="number" min="1" step="1" value="${presets.includes(Number(t.amt)) ? "" : esc(String(t.amt))}" placeholder="V\xED d\u1EE5 ${presets[1]}" class="${field} mt-1"></div>
    <div class="rounded-2xl bg-amber-50 border border-amber-200 p-4 text-center">
      <p class="text-[11px] text-slate-500">Quy \u0111\u1ED5i: 1 ${CURRENCIES[cur].symbol} = ${TOPUP_RATE[cur]} Xu</p>
      <p class="text-xl font-black text-amber-700">${money(t.amt || 0, cur)} \u2192 ${fmt(xu)} Xu</p>
    </div>
    <button data-action="topup-next" class="w-full ${btnPrimary}">Ti\u1EBFp t\u1EE5c \u0111\u1EBFn thanh to\xE1n</button>
  </div>`;
  }

