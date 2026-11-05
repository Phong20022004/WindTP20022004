/*@file js/app/07-admin-identity.js
 * Danh tính riêng của máy chủ (BigBoss): avatar logo WINDTP + khung Hoàng Kim Thiên Đế.
 */
  // ===== Danh tính riêng của MÁY CHỦ (chỉ BigBoss/admin mới thấy & chọn được) =====
  var ADMIN_AVATAR_ID = "admin-logo", ADMIN_FRAME_ID = "f-admin-sovereign";
  AVATARS.push({ id: ADMIN_AVATAR_ID, name: "Logo trang ch\u1EE7 \u00B7 M\u00E1y ch\u1EE7", logo: true, bg: "linear-gradient(135deg,#0a1630,#1e4fa8 55%,#27a3d9)", price: 0, unlock: "admin" });
  FRAMES.push({ id: ADMIN_FRAME_ID, name: "Ho\u00E0ng Kim Thi\u00EAn \u0110\u1EBF \u00B7 M\u00E1y ch\u1EE7", cls: "rframe rfadm", fx: "adm-sovereign", price: 0, unlock: "admin" });
  function adminLogoHtml(px) {
    return `<span class="wd-logo adm-home" role="img" aria-label="WINDTP"><span>\u98CE</span></span>`;
  }
  function guardAdminCosmetics() {
    if (!state.account || isAdmin()) return;
    if (avatarById(state.avatarId).unlock === "admin") state.avatarId = "default";
    if (frameById(state.frameId).unlock === "admin") state.frameId = "none";
  }
  var avatarById = (id) => AVATARS.find((a) => a.id === id) ?? AVATARS[0];
  var frameById = (id) => FRAMES.find((f) => f.id === id) ?? FRAMES[0];
  function isOwned(kind, id) {
    const item = kind === "avatar" ? avatarById(id) : frameById(id);
    if (item.unlock === "free") return true;
    if (item.unlock === "premium") return isPremium();
    if (item.unlock === "admin") return isAdmin();
    if (item.unlock === "realm") return Number(state.cultivationLevel || 0) >= item.realm;
    return (kind === "avatar" ? state.ownedAvatars : state.ownedFrames).includes(id);
  }
  var REALM_FX = [
    { tw: [[35, "✦", "#bbf7d0", 0], [215, "✧", "#ecfccb", .9]] },
    { tw: [[30, "✦", "#99f6e4", 0], [150, "✧", "#ccfbf1", .6], [250, "✦", "#5eead4", 1.2]] },
    { tw: [[20, "✦", "#fde047", 0], [110, "✧", "#fff7ad", .5], [200, "✦", "#fbbf24", 1], [290, "✧", "#fef3c7", 1.5]], orb: [[0, "✦", "#fde047"]] },
    { up: [[-55, "🔥", 0], [-25, "🔥", .45], [10, "🔥", .9], [45, "🔥", .2], [75, "🔥", .7]], tw: [[200, "✦", "#fdba74", .4]] },
    { fl: [[20, "⚡", 0], [110, "⚡", .8], [200, "⚡", 1.6], [290, "⚡", .4]], tw: [[60, "✦", "#bae6fd", .3], [250, "✦", "#93c5fd", 1]] },
    { orb: [[0, "✦", "#e9d5ff"], [120, "✦", "#d8b4fe"], [240, "✧", "#f0abfc"]], tw: [[60, "✧", "#c4b5fd", .2], [180, "✦", "#e879f9", .9]], ring2: "#c084fc" },
    { orb: [[0, "✦", "#fde047"], [120, "✦", "#fde047"], [240, "✦", "#fde047"]], orb2: [[60, "✧", "#67e8f9"], [180, "✦", "#22d3ee"], [300, "✧", "#67e8f9"]], ring2: "#22d3ee" },
    { up: [[-40, "🔥", 0], [0, "🔥", .6], [40, "🔥", 1.2]], fl: [[110, "⚡", .3], [250, "⚡", 1.3]], orb: [[0, "✦", "#fff"], [120, "✦", "#fde047"], [240, "✧", "#f0abfc"]], ring2: "#fde047" },
    { up: [[-60, "🔥", 0], [-30, "🔥", .4], [0, "🔥", .8], [30, "🔥", .2], [60, "🔥", .6]], fl: [[95, "⚡", 0], [140, "⚡", 1.1], [225, "⚡", .6], [270, "⚡", 1.7]], orb: [[0, "✦", "#fff"], [90, "✦", "#fde047"], [180, "✧", "#f0abfc"], [270, "✦", "#67e8f9"]], orb2: [[45, "✧", "#fff"], [135, "✦", "#f472b6"], [225, "✧", "#fde047"], [315, "✦", "#a5b4fc"]], ring2: "#fff", halo: true }
  ];
  var STREAK_FX = {
    s7: { up: [[-40, "✨", 0], [0, "✨", .6], [40, "✨", 1.2]], tw: [[110, "✦", "#fde047", .3], [250, "✧", "#fff7ad", 1]] },
    s15: { orb: [[0, "🍃", "#fff"], [120, "🍃", "#fff"], [240, "🍃", "#fff"]], tw: [[60, "✧", "#bae6fd", .2], [200, "✦", "#a5f3fc", .9]], ring2: "#7dd3fc" },
    s30: { orb: [[0, "✦", "#fff"], [120, "✧", "#c4b5fd"], [240, "✦", "#f9a8d4"]], fl: [[40, "🌠", 0], [220, "🌠", 1.2]], tw: [[90, "✧", "#e0e7ff", .4], [160, "✦", "#a5b4fc", 1.1], [300, "✧", "#fbcfe8", .8]], ring2: "#818cf8" }
  };
  Object.assign(STREAK_FX, {
    "pm-angel": { halo: true, ring2: "#fde68a", up: [[-40, "🪶", 0], [40, "🪶", 1]], orb: [[0, "✦", "#fde68a"], [180, "✧", "#fff"]] },
    "pm-devil": { ring2: "#ef4444", up: [[-40, "🔥", 0], [0, "🔥", .5], [40, "🔥", 1]], fl: [[110, "⚡", .3], [250, "⚡", 1.3]], orb: [[0, "🦇", "#fff"], [180, "🦇", "#fff"]] },
    "pm-aurora": { ring2: "#34d399", orb: [[0, "✦", "#67e8f9"], [120, "✦", "#a7f3d0"], [240, "✧", "#f0abfc"]], tw: [[60, "✧", "#fff", .2], [180, "✦", "#c4b5fd", .9], [300, "✧", "#f9a8d4", .5]] },
    "p-sky": { orb: [[0, "☁️", "#fff"], [180, "☁️", "#fff"]], tw: [[60, "✧", "#e0f2fe", 0], [150, "✦", "#bae6fd", .8], [270, "✧", "#fff", 1.4]] },
    "p-sakura": { dn: [[-45, "🌸", 0], [0, "🌸", .7], [45, "🌸", 1.3]], tw: [[120, "✦", "#fbcfe8", .3], [240, "✧", "#fff", 1]] },
    "p-neon": { tw: [[30, "✦", "#e9d5ff", 0], [150, "✧", "#67e8f9", .5], [260, "✦", "#f0abfc", 1]], ring2: "#a855f7" },
    "p-fire": { up: [[-35, "🔥", 0], [5, "🔥", .5], [40, "🔥", 1]], tw: [[130, "✦", "#fdba74", .3], [240, "✦", "#fde047", .9]] },
    "p-ocean": { up: [[-50, "🫧", 0], [-10, "🫧", .7], [35, "🫧", 1.3]], orb: [[0, "✧", "#bae6fd"], [180, "✦", "#67e8f9"]] },
    "p-rainbow": { orb: [[0, "✦", "#fde047"], [120, "✦", "#f472b6"], [240, "✦", "#67e8f9"]], tw: [[60, "✧", "#fff", .2], [180, "✧", "#fff", .9]], ring2: "#fff" }
  });
  STREAK_FX["adm-sovereign"] = { halo: true, ring2: "#fde047", ring3: true, crown: true, orb: [[0, "\u25C6", "#fde047"], [90, "\u25C6", "#22d3ee"], [180, "\u25C6", "#f472b6"], [270, "\u25C6", "#a78bfa"]], orb2: [[45, "\u2726", "#fff"], [135, "\u2727", "#fde68a"], [225, "\u2726", "#fff"], [315, "\u2727", "#fde68a"]], up: [[-30, "\u2728", 0], [30, "\u2728", .9]], tw: [[70, "\u2727", "#fff", .3], [200, "\u2726", "#fde68a", 1]] };
  function realmFrameFx(level, px) {
    const spec = typeof level === "string" ? STREAK_FX[level] : REALM_FX[level];
    if (!spec || px < 30) return "";
    const r = px / 2;
    const fs = Math.max(8, Math.round(px * 0.23));
    const pos = (a) => `left:${(r + Math.sin(a * Math.PI / 180) * r).toFixed(1)}px;top:${(r - Math.cos(a * Math.PI / 180) * r).toFixed(1)}px;font-size:${fs}px`;
    let h = "";
    if (spec.halo) h += `<i class="rf-halo"></i>`;
    if (spec.ring3) h += `<i class="adm-ring3"></i>`;
    if (spec.crown && px >= 40) h += `<i class="adm-crown" style="font-size:${Math.round(px * 0.36)}px">\u{1F451}</i>`;
    if (spec.ring2) h += `<i class="rf-ring2" style="--c2:${spec.ring2}"></i>`;
    (spec.tw || []).forEach(([a, g, c, d]) => { h += `<b class="rf-p rf-tw" style="${pos(a)};color:${c};animation-delay:${d}s">${g}</b>`; });
    (spec.up || []).forEach(([a, g, d]) => { h += `<b class="rf-p rf-up" style="${pos(a)};animation-delay:${d}s">${g}</b>`; });
    (spec.dn || []).forEach(([a, g, d]) => { h += `<b class="rf-p rf-dn" style="${pos(a)};animation-delay:${d}s">${g}</b>`; });
    (spec.fl || []).forEach(([a, g, d]) => { h += `<b class="rf-p rf-fl" style="${pos(a)};animation-delay:${d}s">${g}</b>`; });
    if (spec.orb) h += `<i class="rf-orbit">${spec.orb.map(([a, g, c], i) => `<b class="rf-p rf-tw" style="${pos(a)};color:${c};animation-delay:${i * .4}s">${g}</b>`).join("")}</i>`;
    if (spec.orb2) h += `<i class="rf-orbit rev" style="animation-duration:8s">${spec.orb2.map(([a, g, c], i) => `<b class="rf-p rf-tw" style="${pos(a)};color:${c};animation-delay:${i * .5 + .2}s">${g}</b>`).join("")}</i>`;
    return h;
  }
  function renderPfp(name, avatarId, frameId, px, opts) {
    let a = avatarById(avatarId);
    if (a.unlock === "premium" && avatarId === state.avatarId && !isPremium()) a = AVATARS[0];
    if (a.unlock === "admin" && !(opts && opts.official) && !isAdmin()) a = AVATARS[0];
    let f = frameById(frameId);
    if (f.unlock === "premium" && frameId === state.frameId && !isPremium()) f = FRAMES[0];
    if (f.unlock === "admin" && !(opts && opts.official) && !isAdmin()) f = FRAMES[0];
    const b = f.id === "none" ? 0 : Math.max(2, Math.round(px * (f.realm != null || f.fx ? 0.09 : 0.075)));
    const content = opts && opts.emoji ? esc(opts.emoji) : a.logo ? adminLogoHtml(px) : a.img ? `<img src="${a.img}" alt="${esc(a.name)}" class="w-full h-full object-cover" style="image-rendering:auto;filter:none;opacity:1" onerror="this.onerror=null;this.style.display='none'">` : (a.emoji ? a.emoji : esc(initial(name)));
    const fs = Math.round(px * (a.emoji || (opts && opts.emoji) ? 0.5 : 0.42));
    const rank = cultivationRank();
    const rk = opts && opts.realm != null ? Math.max(0, Math.min(CULTIVATION_RANKS.length - 1, Number(opts.realm) || 0)) : null;
    const badge = rk != null ? `<span class="cultivation-badge" title="Cảnh giới: ${CULTIVATION_RANKS[rk].name}">${realmGlyph(rk, Math.max(11, Math.round(px * 0.34)), false)}</span>` : (name === state.userName ? `<span class="cultivation-badge" title="Cảnh giới: ${rank.name}" aria-label="Cảnh giới ${rank.name}">${realmGlyph(cultivationIndex(), Math.max(11, Math.round(px * 0.34)), false)}</span>` : "");
    const fx = f.realm != null ? realmFrameFx(f.realm, px) : (f.fx ? realmFrameFx(f.fx, px) : "");
    const st = opts && opts.status ? opts.status : "";
    const html = `<div class="pfp ${f.cls}${st ? (st === "on" ? " pfp-on" : " pfp-off") : ""}" style="width:${px}px;height:${px}px;--b:${b}px;--px:${px}px"><div class="pfp-in keep-white" style="background:${opts && opts.emoji ? "radial-gradient(circle at 35% 30%,#fff7df,#e2d1a3)" : a.bg};font-size:${fs}px">${content}</div>${fx}${badge}</div>`;
    if (!st) return html;
    return `<div class="pfp-wrap" style="width:${px}px;height:${px}px">${html}<span class="st-chip ${st === "on" ? "on" : "off"}">${st === "on" ? "● Online" : "○ Offline"}</span></div>`;
  }
  // Khung avatar thực tế của người dùng: nếu chưa chọn khung (hoặc khung không còn hợp lệ)
  // thì tự dùng khung theo cảnh giới hiện tại — giống hệt người chơi khác.
  function myFrameId() {
    let fid = state.frameId || "none";
    const fr = frameById(fid);
    if (fr.realm != null && !isOwned("frame", fid)) fid = "none";
    else if (fr.unlock === "admin" && !isAdmin()) fid = "none";
    if (fid === "none" && !state.frameNone) fid = "r-" + cultivationIndex();
    return fid;
  }
  function profileAvatar(px) {
    return renderPfp(state.userName, state.avatarId, myFrameId(), px);
  }

