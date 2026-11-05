/*@file js/app/30-actions-utilities-community.js
 * ⚠ Mảnh 4/5 của object `actions`: tiện ích, tin đăng, kiểm duyệt, nhiệm vụ, tài liệu, bài đăng.
 */
    "open-tool": (el) => openTool(el.dataset.tool ?? ""),
    /* ---- utilities ---- */
    "util-cat": (el) => {
      ui.utilCat = el.dataset.cat ?? "all";
      renderUtilities();
    },
    "open-listing": (el) => openListing(el.dataset.id ?? ""),
    "open-post-listing": () => openModal(postListingModal),
    "open-category": () => {
      if (state.customCats.length >= 8) {
        toast("B\u1EA1n ch\u1EC9 c\xF3 th\u1EC3 t\u1EA1o t\u1ED1i \u0111a 8 danh m\u1EE5c");
        return;
      }
      openModal(categoryModal);
    },
    "submit-category": () => {
      const name = val("cat-name").replace(/\s+/g, " ");
      if (name.length < 2) {
        toast("T\xEAn danh m\u1EE5c c\u1EA7n t\u1ED1i thi\u1EC3u 2 k\xFD t\u1EF1");
        return;
      }
      const taken = ["cho do cu", "viec lam", "phong tro", "tat ca", "nhiem vu", "tien ich khac", "tai lieu"];
      const key = norm(name);
      if (taken.some((t) => key.includes(t)) || state.customCats.some((c) => norm(c.name) === key)) {
        toast("T\xEAn danh m\u1EE5c \u0111\xE3 t\u1ED3n t\u1EA1i ho\u1EB7c tr\xF9ng danh m\u1EE5c c\xF3 s\u1EB5n");
        return;
      }
      const emoji = $('input[name="cat-emoji"]:checked')?.value ?? "\u{1F4CC}";
      const id = uid("cat");
      state.customCats.push({ id, name, emoji });
      ui.utilCat = id;
      commit();
      closeModal();
      toast(`\u0110\xE3 t\u1EA1o danh m\u1EE5c "${name}"`);
    },
    "delete-category": (el) => {
      const c = state.customCats.find((x) => x.id === el.dataset.id);
      if (!c) return;
      if (!window.confirm(`X\xF3a danh m\u1EE5c "${c.name}" v\xE0 to\xE0n b\u1ED9 tin trong danh m\u1EE5c n\xE0y?`)) return;
      state.customCats = state.customCats.filter((x) => x.id !== c.id);
      state.listings = state.listings.filter((l) => l.cat !== c.id);
      ui.utilCat = "all";
      commit();
      toast("\u0110\xE3 x\xF3a danh m\u1EE5c");
    },
    "open-moderation": () => { if (!isAdmin()) { toast("Chỉ BigBoss mới mở được khu kiểm duyệt."); return; } openModal(moderationModal); },
    "approve-content": (el) => {
      if (!isAdmin()) { toast("Chỉ BigBoss mới được duyệt nội dung."); return; }
      const type = el.dataset.type; const id = el.dataset.id;
      const list = type === "post" ? state.posts : state.listings;
      const item = list.find((x) => x.id === id); if (!item) return;
      item.status = "approved"; commit(); refreshModal(); toast("Đã duyệt nội dung và cho phép hiển thị.");
    },
    "reject-content": (el) => {
      if (!isAdmin()) { toast("Chỉ BigBoss mới được từ chối nội dung."); return; }
      const type = el.dataset.type; const id = el.dataset.id;
      const list = type === "post" ? state.posts : state.listings;
      const item = list.find((x) => x.id === id); if (!item) return;
      item.status = "rejected"; commit(); refreshModal(); toast("Đã từ chối nội dung.");
    },
    "submit-listing": () => {
      const picked = val("pl-cat") || "market";
      const cat = LISTING_EMOJI[picked] || state.customCats.some((c) => c.id === picked) ? picked : "market";
      const title = val("pl-title");
      const price = val("pl-price");
      const loc = val("pl-loc");
      if (title.length < 5) {
        toast("Ti\xEAu \u0111\u1EC1 c\u1EA7n t\u1ED1i thi\u1EC3u 5 k\xFD t\u1EF1");
        return;
      }
      if (!price) {
        toast("Vui l\xF2ng nh\u1EADp gi\xE1 ho\u1EB7c m\u1EE9c l\u01B0\u01A1ng");
        return;
      }
      if (!loc) {
        toast("Vui l\xF2ng nh\u1EADp khu v\u1EF1c");
        return;
      }
      const l = { id: uid("l"), cat, title, price, loc, country: val("pl-country") || "Việt Nam", region: val("pl-region"), sid: userId(), ts: Date.now(), desc: val("pl-desc") || "Ch\u01B0a c\xF3 m\xF4 t\u1EA3 chi ti\u1EBFt.", seller: state.userName, emoji: LISTING_EMOJI[cat] ?? state.customCats.find((c) => c.id === cat)?.emoji ?? "\u{1F4CC}", status: "pending" };
      state.listings.unshift(l);
      ui.utilCat = cat;
      commit();
      closeModal();
      toast("Tin đăng đã gửi và đang chờ chủ quản kiểm duyệt trước khi hiển thị.");
    },
    "contact-seller": (el) => {
      const l = state.listings.find((x) => x.id === el.dataset.id);
      if (!l) return;
      if (l.seller === state.userName) {
        toast("\u0110\xE2y l\xE0 tin do b\u1EA1n \u0111\u0103ng");
        return;
      }
      notify("\u{1F4E8}", `\u0110\xE3 g\u1EEDi y\xEAu c\u1EA7u li\xEAn h\u1EC7 t\u1EDBi ${l.seller} v\u1EC1 "${l.title}"`);
      commit();
      toast(`\u0110\xE3 g\u1EEDi y\xEAu c\u1EA7u li\xEAn h\u1EC7 t\u1EDBi ${l.seller}`);
    },
    "save-listing": (el) => {
      const id = el.dataset.id ?? "";
      state.saved = state.saved.includes(id) ? state.saved.filter((x) => x !== id) : [...state.saved, id];
      commit();
      refreshModal();
    },
    "delete-listing": (el) => {
      const id = el.dataset.id ?? "";
      state.listings = state.listings.filter((l) => l.id !== id);
      state.saved = state.saved.filter((x) => x !== id);
      commit();
      closeModal();
      toast("\u0110\xE3 g\u1EE1 tin");
    },
    "claim-task": (el) => {
      const t = tasks().find((x) => x.id === el.dataset.id);
      if (!t || state.daily.claimed.includes(t.id) || t.progress() < t.goal) return;
      state.daily.claimed.push(t.id);
      earn(t.reward, `Th\u01B0\u1EDFng nhi\u1EC7m v\u1EE5: ${t.title}`);
      if (t.chips) { state.chips = Number(state.chips || 0) + t.chips; notify("🎰", `Thưởng nhiệm vụ: +${fmt(t.chips)} chip game`); }
      commit();
      toast(`Nhận +${fmt(t.reward)} Xu${t.chips ? " + " + fmt(t.chips) + " chip" : ""}!`);
    },
    "check-in": () => {
      if (!checkIn()) {
        toast("H\xF4m nay b\u1EA1n \u0111\xE3 \u0111i\u1EC3m danh r\u1ED3i");
        return;
      }
      commit();
      toast(`\u0110i\u1EC3m danh th\xE0nh c\xF4ng! Chu\u1ED7i ${state.streak} ng\xE0y`);
    },
    "download-doc": (el) => {
      const code = el.dataset.code ?? "en";
      if (!state.owned.includes("doc-" + code)) {
        toast("Hãy mua tài liệu trước khi tải");
        return;
      }
      downloadDoc(code);
    },
    "buy-doc": (el) => { if (!state.owned.includes("doc-" + (el.dataset.code ?? "en")) && needContact("doc", () => { closeModal(); actions["buy-doc"](el); })) return;
      const code = el.dataset.code ?? "en";
      const l = langByCode(code);
      if (state.owned.includes("doc-" + code)) return;
      if (!requireFunds(DOC_PRICE)) return;
      spend(DOC_PRICE, `Mua t\xE0i li\u1EC7u ${l.name}`);
      state.owned.push("doc-" + code);
      notify("\u{1F4DA}", `B\u1EA1n \u0111\xE3 mua t\xE0i li\u1EC7u ${l.name}, b\u1EA5m T\u1EA3i v\u1EC1 \u0111\u1EC3 l\u01B0u file.`);
      commit();
      toast(`\u0110\xE3 mua t\xE0i li\u1EC7u ${l.name}!`);
    },
    /* ---- tools ---- */
    "pomo-toggle": () => {
      ui.pomo.running = !ui.pomo.running;
      refreshModal();
    },
    "pomo-reset": () => {
      ui.pomo.running = false;
      ui.pomo.mode = "focus";
      ui.pomo.remaining = 25 * 60;
      refreshModal();
    },
    "add-reminder": () => {
      const text = val("rm-text");
      if (!text) {
        toast("H\xE3y nh\u1EADp n\u1ED9i dung nh\u1EAFc nh\u1EDF");
        return;
      }
      state.reminders.push({ id: uid("rm"), text, when: val("rm-when"), done: false });
      commit();
      refreshModal();
    },
    "delete-reminder": (el) => {
      state.reminders = state.reminders.filter((r) => r.id !== el.dataset.id);
      commit();
      refreshModal();
    },
    "gpa-add": () => {
      gpaRows.push({ score: "", credit: "" });
      refreshModal();
    },
    "gpa-calc": () => {
      let sumW = 0, sumC = 0, sum4 = 0;
      for (const r of gpaRows) {
        const s = Number(r.score);
        const c = Number(r.credit);
        if (r.score === "" || r.credit === "" || !isFinite(s) || !isFinite(c) || s < 0 || s > 10 || c <= 0) continue;
        const g4 = s >= 8.5 ? 4 : s >= 7 ? 3 : s >= 5.5 ? 2 : s >= 4 ? 1 : 0;
        sumW += s * c;
        sum4 += g4 * c;
        sumC += c;
      }
      setGpaResult(sumC === 0 ? "H\xE3y nh\u1EADp \xEDt nh\u1EA5t m\u1ED9t m\xF4n h\u1EE3p l\u1EC7 (\u0111i\u1EC3m 0 \u2013 10, t\xEDn ch\u1EC9 l\u1EDBn h\u01A1n 0)." : `GPA thang 10: <b>${(sumW / sumC).toFixed(2)}</b> \u2022 Thang 4 (quy \u0111\u1ED5i tham kh\u1EA3o): <b>${(sum4 / sumC).toFixed(2)}</b> \u2022 T\u1ED5ng ${sumC} t\xEDn ch\u1EC9`);
      refreshModal();
    },
    /* ---- community ---- */
    "publish-post": () => {
      const text = ui.draft.trim();
      if (text.length < 3) {
        toast("B\xE0i vi\u1EBFt c\u1EA7n t\u1ED1i thi\u1EC3u 3 k\xFD t\u1EF1");
        return;
      }
      const adm = isAdmin();
      state.posts.unshift({ id: uid("po"), author: state.userName, tag: ui.draftTag, text, ts: Date.now(), likes: 0, liked: false, comments: [], status: adm ? "approved" : "pending", admin: adm || undefined });
      ui.draft = "";
      state.daily.posts += 1;
      commit();
      if (adm) { admBurst(); toast("👑 Máy chủ đã đăng bài, hiển thị ngay cho mọi người."); }
      else toast("Bài viết đã gửi và đang chờ chủ quản kiểm duyệt trước khi hiển thị công khai.");
    },
    "like-post": (el) => {
      const p = state.posts.find((x) => x.id === el.dataset.id);
      if (!p) return;
      p.liked = !p.liked;
      p.likes += p.liked ? 1 : -1;
      commit();
    },
    "toggle-comments": (el) => {
      const id = el.dataset.id ?? "";
      if (ui.openComments.has(id)) ui.openComments.delete(id);
      else ui.openComments.add(id);
      renderCommunity();
    },
    "send-comment": (el) => {
      const id = el.dataset.id ?? "";
      const text = val(`cmt-${id}`);
      const p = state.posts.find((x) => x.id === id);
      if (!p || !text) {
        toast("H\xE3y nh\u1EADp n\u1ED9i dung b\xECnh lu\u1EADn");
        return;
      }
      p.comments.push({ id: uid("c"), author: state.userName, text, ts: Date.now() });
      commit();
    },
    "delete-post": (el) => {
      state.posts = state.posts.filter((p) => p.id !== el.dataset.id);
      commit();
      toast("\u0110\xE3 x\xF3a b\xE0i vi\u1EBFt");
    },
    /* ---- wallet ---- */
