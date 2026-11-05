/*@file js/app/28-actions-learning.js
 * ⚠ Mảnh 2/5 của object `actions`: học, từ vựng, ngữ pháp, hội thoại, khóa học, quiz.
 */
    "learn-back-language": () => { ui.learnStage = "language"; renderLearn(); },
    "learn-back-menu": () => { ui.learnStage = "menu"; renderLearn(); },
    "open-daily-study": () => { ui.learnStage = "daily"; renderLearn(); },
    "open-book-library": () => { ui.learnStage = "library"; renderLearn(); },
    "open-strokes": () => { ui.learnStage = "strokes"; renderLearn(); },
    "focus-draft": () => { const t = document.getElementById("post-draft"); if (t) { t.scrollIntoView({ behavior: "smooth", block: "center" }); t.focus(); } },
    "open-vocab": () => {
      if (!state.lang) return;
      const lang = langByCode(state.lang);
      ui.flash = { lang: lang.code, order: dailyLesson(lang).vocab.slice(), pos: 0, flipped: false, knownNow: 0, done: false };
      openModal(vocabModal);
    },
    "flip-card": (el) => {
      if (!ui.flash) return;
      ui.flash.flipped = !ui.flash.flipped;
      el.querySelector(".card-face")?.classList.toggle("flipped", ui.flash.flipped);
    },
    "vocab-answer": (el) => {
      const f = ui.flash;
      if (!f) return;
      const lang = langByCode(f.lang);
      const term = lang.vocab[f.order[f.pos]].term;
      if (el.dataset.known === "1") {
        const list = state.known[lang.code] ?? (state.known[lang.code] = []);
        if (!list.includes(term)) {
          list.push(term);
          f.knownNow += 1;
        }
      } else {
        state.known[lang.code] = (state.known[lang.code] ?? []).filter((t) => t !== term);
      }
      f.pos += 1;
      f.flipped = false;
      if (f.pos >= f.order.length) {
        f.done = true;
        completeLesson(`vocab:${lang.code}`);
      }
      commit();
      refreshModal();
    },
    "vocab-restart": () => {
      const f = ui.flash;
      if (!f) return;
      const lang = langByCode(f.lang);
      ui.flash = { lang: lang.code, order: shuffle(dailyLesson(lang).vocab), pos: 0, flipped: false, knownNow: 0, done: false };
      refreshModal();
    },
    "open-grammar": () => openModal(grammarModal),
    "grammar-done": (el) => {
      if (!state.lang) return;
      completeLesson(`grammar:${state.lang}:${el.dataset.i}`);
      commit();
      refreshModal();
    },
    "open-practice": () => {
      if (!state.lang) return;
      openModal(practiceModal);
    },
    "start-practice": (el) => startPractice(el.dataset.mode ?? "listen"),
    "open-dialog": () => {
      if (!state.lang) return;
      const lang = langByCode(state.lang);
      ui.dialog = { lang: lang.code, idx: 0, picked: null, order: shuffle([0, 1, 2]), good: 0, done: false };
      openModal(dialogModal);
    },
    "dialog-pick": (el) => {
      const d = ui.dialog;
      if (!d || d.picked !== null) return;
      const pos = Number(el.dataset.pos);
      const opt = langByCode(d.lang).dialogs[d.idx].options[d.order[pos]];
      d.picked = pos;
      if (opt.correct) d.good += 1;
      sfx(opt.correct ? "right" : "wrong");
      refreshModal();
    },
    "dialog-next": () => {
      const d = ui.dialog;
      if (!d) return;
      const lang = langByCode(d.lang);
      d.idx += 1;
      d.picked = null;
      d.order = shuffle([0, 1, 2]);
      if (d.idx >= lang.dialogs.length) {
        d.done = true;
        d.idx = lang.dialogs.length - 1;
        completeLesson(`dialog:${lang.code}`);
        commit();
      }
      refreshModal();
    },
    "dialog-restart": () => {
      const d = ui.dialog;
      if (!d) return;
      ui.dialog = { lang: d.lang, idx: 0, picked: null, order: shuffle([0, 1, 2]), good: 0, done: false };
      refreshModal();
    },
    "open-cert": (el) => {
      const id = el.dataset.id ?? "";
      openModal(() => certModal(id));
    },
    "start-cert-quiz": (el) => startCertQuiz(el.dataset.id ?? ""),
    "open-course": (el) => {
      const c = COURSES.find((x) => x.id === el.dataset.id);
      if (!c) return;
      state.lang = c.lang;
      commit();
      goTo("learn");
      openModal(() => certModal(c.cert));
    },
    "buy-course": (el) => {
      const c = COURSES.find((x) => x.id === el.dataset.id);
      if (!c) return;
      if (state.owned.includes(c.id)) {
        actions["open-course"](el, new Event("click"));
        return;
      }
      if (!requireFunds(c.price)) return;
      spend(c.price, `Mua kh\xF3a h\u1ECDc ${c.badge}`);
      state.owned.push(c.id);
      notify("\u{1F393}", `B\u1EA1n \u0111\xE3 m\u1EDF kh\xF3a: ${c.title}`);
      commit();
      toast("Mua kh\xF3a h\u1ECDc th\xE0nh c\xF4ng!");
      actions["open-course"](el, new Event("click"));
    },
    /* ---- quiz (certificate exam, practice and the mini game) ---- */
    "start-game": () => openModal(gamePickModal),
    "change-game-lang": () => openModal(gamePickModal),
    "game-lang": (el) => startGame(el.dataset.code ?? "en"),
    "quiz-speak": () => speakCurrent(),
    "quiz-pick": (el) => {
      const q = ui.quiz;
      if (!q || q.picked !== null) return;
      const i = Number(el.dataset.i);
      q.picked = i;
      const right = i === q.questions[q.idx].answer;
      sfx(right ? "right" : "wrong");
      if (q.kind === "game") {
        if (!q.started) {
          q.started = true;
          state.daily.games += 1;
          commit();
        }
        q.streak = right ? q.streak + 1 : 0;
      }
      if (right) q.correct += 1;
      refreshModal();
    },
    "quiz-write": () => {
      const q = ui.quiz;
      if (!q || q.picked !== null) return;
      const cur = q.questions[q.idx];
      const typed = val("qz-write");
      if (!typed) {
        toast("H\xE3y g\xF5 \u0111\xE1p \xE1n c\u1EE7a b\u1EA1n");
        return;
      }
      q.wrote = typed;
      q.wroteOk = writeMatches(typed, cur.write ?? []);
      q.picked = 0;
      if (q.wroteOk) q.correct += 1;
      sfx(q.wroteOk ? "right" : "wrong");
      refreshModal();
    },
    "quiz-next": () => {
      const q = ui.quiz;
      if (!q) return;
      q.picked = null;
      q.wrote = "";
      q.wroteOk = false;
      if (q.kind === "game") {
        if (q.streak >= q.target) {
          q.finished = true;
          state.daily.gameWins += 1;
          commit();
        } else {
          const lang = langByCode(q.lang ?? "en");
          q.questions.push(gameQuestion(lang));
          q.idx += 1;
        }
      } else {
        q.idx += 1;
        if (q.idx >= q.questions.length) {
          q.idx = q.questions.length - 1;
          q.finished = true;
          completeLesson(`${q.kind}:${q.certKey}`);
          commit();
        }
      }
      refreshModal();
      if (!q.finished) speakCurrent();
    },
    "quiz-again": () => {
      const q = ui.quiz;
      if (!q) return;
      if (q.kind === "game") startGame(q.lang ?? "en");
      else if (q.kind === "practice") startPractice(q.certKey);
      else startCertQuiz(q.certKey);
    },
    /* ---- shop ---- */
