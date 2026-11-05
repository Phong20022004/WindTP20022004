/*@file js/app/26-app-quiz-practice-tools.js
 * Tạo câu hỏi, luyện tập, game từ vựng, tải tài liệu, mở công cụ, nạp Xu.
 */
  function makeQuestion(lang, item) {
    const others = shuffle(lang.vocab.filter((v) => v !== item)).slice(0, 3);
    if (Math.random() < 0.5) {
      const options2 = shuffle([item.meaning, ...others.map((o) => o.meaning)]);
      return { prompt: item.term, sub: `${lang.flag} ${lang.name}: t\u1EEB n\xE0y ngh\u0129a l\xE0 g\xEC?`, options: options2, answer: options2.indexOf(item.meaning) };
    }
    const options = shuffle([item.term, ...others.map((o) => o.term)]);
    return { prompt: item.meaning, sub: `${lang.flag} Ch\u1ECDn t\u1EEB ${lang.name} t\u01B0\u01A1ng \u1EE9ng`, options, answer: options.indexOf(item.term) };
  }
  function gameQuestion(lang) {
    const item = lang.vocab[Math.floor(Math.random() * lang.vocab.length)];
    return makeQuestion(lang, item);
  }
  function grammarQuestion(lang, g) {
    const options = shuffle(lang.grammar.map((x) => x.title));
    return { prompt: g.example, sub: `${lang.flag} C\xE2u n\xE0y d\xF9ng c\u1EA5u tr\xFAc ng\u1EEF ph\xE1p n\xE0o?`, options, answer: options.indexOf(g.title) };
  }
  function certQuestions(lang) {
    const vocab = shuffle(lang.vocab).slice(0, 4).map((v) => makeQuestion(lang, v));
    const grammar = lang.grammar.map((g) => grammarQuestion(lang, g));
    return shuffle([...vocab, ...grammar]);
  }
  var PRACTICE_TITLE = { listen: "\u{1F3A7} Luy\u1EC7n Nghe", read: "\u{1F440} Luy\u1EC7n \u0110\u1ECDc", write: "\u270D\uFE0F Luy\u1EC7n Vi\u1EBFt" };
  function practiceQuestions(lang, mode) {
    const dl = dailyLesson(lang);
    const rnd = mulberry(hashStr(lang.code + "|" + dl.no + "|" + mode));
    const sh = (a) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); const x = a[i]; a[i] = a[j]; a[j] = x; } return a; };
    return dl.vocab.map((vi) => {
      const item = lang.vocab[vi];
      const others = sh(lang.vocab.filter((v) => v !== item)).slice(0, 3);
      if (mode === "listen") {
        const options = sh([item.meaning, ...others.map((o) => o.meaning)]);
        return { prompt: "\u{1F3A7}", sub: `${lang.flag} Nghe v\xE0 ch\u1ECDn ngh\u0129a \u0111\xFAng`, options, answer: options.indexOf(item.meaning), speak: item.term, speakLang: LANG_VOICE[lang.code] };
      }
      if (mode === "read") {
        const options = sh([item.exampleVi, ...others.map((o) => o.exampleVi)]);
        return { prompt: item.example, sub: `${lang.flag} \u0110\u1ECDc c\xE2u v\xE0 ch\u1ECDn b\u1EA3n d\u1ECBch \u0111\xFAng`, options, answer: options.indexOf(item.exampleVi) };
      }
      const asian = lang.code === "zh" || lang.code === "ja" || lang.code === "ko";
      return {
        prompt: item.meaning,
        sub: `${lang.flag} Vi\u1EBFt t\u1EEB ${lang.name} t\u01B0\u01A1ng \u1EE9ng`,
        options: [],
        answer: -1,
        write: asian ? [item.term, item.reading] : [item.term],
        hint: asian ? "G\xF5 ch\u1EEF g\u1ED1c ho\u1EB7c phi\xEAn \xE2m (pinyin / romaji / romanization)." : "Kh\xF4ng ph\xE2n bi\u1EC7t ch\u1EEF hoa, ch\u1EEF th\u01B0\u1EDDng v\xE0 d\u1EA5u."
      };
    });
  }
  function writeMatches(typed, accepted) {
    const clean = (x) => norm(x).replace(/[/.,!?'’"]/g, "").replace(/\s+/g, " ").trim();
    const strip = (x) => x.replace(/^(der|die|das|el|la|le|les|un|une|una|l)\s+/, "");
    const t = clean(typed);
    if (!t) return false;
    return accepted.some((a) => {
      const c = clean(a);
      return t === c || t === strip(c) || strip(t) === strip(c);
    });
  }
  function baseQuiz(kind, title, certKey, lang, questions) {
    return { kind, title, certKey, lang, questions, idx: 0, correct: 0, streak: 0, target: 10, picked: null, finished: false, rewarded: 0, started: false, wrote: "", wroteOk: false };
  }
  function startGame(code) {
    const lang = langByCode(code);
    ui.quiz = baseQuiz("game", `\u{1F3AF} \u0110\u1ED1 Vui ${lang.name} ${lang.flag}`, "game", lang.code, [gameQuestion(lang)]);
    openModal(quizModal);
  }
  function startCertQuiz(certId) {
    const lang = langByCode(state.lang ?? "en");
    const cert = lang.certs.find((c) => c.id === certId) ?? lang.certs[0];
    ui.quiz = baseQuiz("cert", `\u{1F4DD} Gi\u1EA3i \u0111\u1EC1 th\u1EED ${cert.name}`, cert.id, lang.code, certQuestions(lang));
    openModal(quizModal);
  }
  function startPractice(mode) {
    const lang = langByCode(state.lang ?? "en");
    ui.quiz = baseQuiz("practice", `${PRACTICE_TITLE[mode]} ${lang.name} ${lang.flag}`, mode, lang.code, practiceQuestions(lang, mode));
    openModal(quizModal);
    speakCurrent();
  }
  function speakCurrent() {
    const q = ui.quiz;
    if (!q) return;
    const cur = q.questions[q.idx];
    if (cur?.speak) speak(cur.speak, cur.speakLang ?? "en-US");
  }
  function downloadDoc(code) {
    const l = langByCode(code);
    const lines = [`WINDTP - T\u1ED5ng h\u1EE3p t\u1EEB v\u1EF1ng & ng\u1EEF ph\xE1p ${l.name}`, "=".repeat(48), "", "T\u1EEA V\u1EF0NG"];
    l.vocab.forEach((v, i) => lines.push(`${i + 1}. ${v.term} (${v.reading}) - ${v.meaning}`, `   V\xED d\u1EE5: ${v.example}`, `   D\u1ECBch: ${v.exampleVi}`));
    lines.push("", "NG\u1EEE PH\xC1P");
    l.grammar.forEach((g, i) => lines.push(`${i + 1}. ${g.title}`, `   C\u1EA5u tr\xFAc: ${g.pattern}`, `   Gi\u1EA3i th\xEDch: ${g.explain}`, `   V\xED d\u1EE5: ${g.example}`, `   D\u1ECBch: ${g.exampleVi}`));
    const blob = new Blob([lines.join("\n")], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `windtp-${l.code}-tong-hop.txt`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1e3);
    toast(`\u0110\xE3 t\u1EA3i t\xE0i li\u1EC7u ${l.name}`);
  }
  function openListing(id) {
    if (!state.listings.some((l) => l.id === id)) return;
    openModal(() => {
      const l = state.listings.find((x) => x.id === id);
      return l ? listingModal(l) : "";
    });
  }
  function openTool(tool) {
    if (tool === "pomodoro") openModal(pomodoroModal);
    else if (tool === "reminders") openModal(remindersModal);
    else if (tool === "gpa") openModal(gpaModal);
  }
  function openTopup() {
    ui.topup = null; ui.topupCode = null;
    openModal(topupModal);
  }
  function requireFunds(amount) {
    if (state.balance >= amount) return true;
    toast(`S\u1ED1 d\u01B0 kh\xF4ng \u0111\u1EE7, c\xF2n thi\u1EBFu ${fmt(amount - state.balance)} Xu`);
    openTopup();
    return false;
  }
  function pomoTick() {
    const p = ui.pomo;
    if (!p.running) return;
    p.remaining -= 1;
    if (p.remaining <= 0) {
      p.running = false;
      if (p.mode === "focus") {
        p.sessions += 1;
        p.mode = "break";
        p.remaining = 5 * 60;
        toast("H\u1EBFt gi\u1EDD t\u1EADp trung, ngh\u1EC9 5 ph\xFAt nh\xE9!");
      } else {
        p.mode = "focus";
        p.remaining = 25 * 60;
        toast("H\u1EBFt gi\u1EDD ngh\u1EC9, s\u1EB5n s\xE0ng phi\xEAn m\u1EDBi!");
      }
      if (ui.renderModal === pomodoroModal) refreshModal();
      return;
    }
    const t = $("#pomo-time");
    if (t) t.textContent = fmtClock(p.remaining);
  }
