/*@file js/app/23-settings-and-profile-modals.js
 * Hộp thoại Cài đặt và Hồ sơ (avatar/khung).
 */
  function settingsModal() {
    const s = state.settings;
    const sfxChoices = (side) => [1, 2, 3].map((n) => {
      const active = (localStorage.getItem(`windtp-sfx-${side}`) || "1") === String(n);
      const label = side === "right" ? ["Chuông nhẹ", "Ba nốt sáng", "Âm vui"] [n - 1] : ["Trầm nhẹ", "Hai âm ngắn", "Cảnh báo kép"][n - 1];
      return `<button data-action="choose-sfx" data-side="${side}" data-preset="${n}" class="rounded-xl border px-3 py-2 text-left ${active ? "border-amber-400 bg-amber-100 text-amber-900" : "border-slate-200 bg-white text-slate-700"}"><span class="block font-bold">${label}</span><span class="block text-[10px] mt-0.5">${active ? "Đang chọn · " : ""}Nghe thử</span></button>`;
    }).join("");
    const tog = (key, on, label, sub = "") => `<div class="flex justify-between items-center py-1 gap-3"><span class="min-w-0"><span class="block font-bold text-slate-700">${label}</span>${sub ? `<span class="block text-[10px] text-slate-400 font-normal">${sub}</span>` : ""}</span><input type="checkbox" data-change="setting" data-key="${key}" ${on ? "checked" : ""} class="accent-sky-600 w-4 h-4 cursor-pointer shrink-0" aria-label="${label}"></div>`;
    return `${modalHead("\u2699\uFE0F C\xE0i \u0110\u1EB7t WINDTP")}
  <div class="p-5 space-y-3.5 text-xs">
    <div class="flex items-center gap-3 rounded-2xl bg-sky-50/60 border border-sky-100 p-3">
      ${profileAvatar(60)}
      <div class="flex-1 min-w-0"><p class="font-extrabold text-slate-800 text-sm truncate">${esc(state.userName)}</p><p class="text-[10px] text-slate-500">${esc(avatarById(state.avatarId).name)} \u2022 ${esc(frameById(myFrameId()).name)}<br><span class="text-teal-600 font-extrabold">Cảnh giới: ${esc(cultivationRank().name)} · Đăng nhập ${state.loginStreak}/365 ngày</span></p></div>
      <button data-action="open-profile" class="${btnPrimary} whitespace-nowrap">\u0110\u1ED5i avatar</button>
    </div>
    <div><label class="font-bold text-slate-700" for="set-name">T\xEAn hi\u1EC3n th\u1ECB</label><input id="set-name" data-change="name" maxlength="30" value="${esc(state.userName)}" class="${field} mt-1"></div>
    <div class="rounded-2xl border border-slate-200 p-3 space-y-2">
      <div class="grid grid-cols-2 gap-2">
        <div><label class="font-bold text-slate-700" for="set-gender">Giới tính</label><select id="set-gender" data-change="gender" class="${field} mt-1"><option value="">Chưa chọn</option><option value="nam" ${s.gender === "nam" ? "selected" : ""}>♂ Nam</option><option value="nu" ${s.gender === "nu" ? "selected" : ""}>♀ Nữ</option><option value="khac" ${s.gender === "khac" ? "selected" : ""}>⚧ Khác</option></select></div>
        <div><label class="font-bold text-slate-700" for="set-birth">Ngày sinh</label><input id="set-birth" type="date" data-change="birth" min="${new Date().getFullYear() - 120}-01-01" max="${todayIso()}" value="${esc(ui.birthPending || s.birth || "")}" ${s.birth && ui.birthEdit !== 2 ? "disabled" : ""} class="${field} mt-1"></div>
      </div>
      ${(!s.birth || ui.birthEdit === 2) && ui.birthPending ? `<div style="border-radius:12px;padding:10px;background:#eff6ff;border:1px solid #93c5fd"><p style="margin:0 0 6px;color:#1e3a8a;font-size:12px">Xác nhận ngày sinh <b>${esc(ui.birthPending.split("-").reverse().join("/"))}</b> (<b>${ageFromBirth(ui.birthPending)}</b> tuổi)?<br><span style="font-size:10px">${s.birth ? "Ngày sinh mới sẽ thay thế ngày sinh cũ." : "Sau khi xác nhận sẽ <b>không thể thay đổi</b>."}</span></p><div style="display:flex;gap:8px"><button data-action="birth-confirm" class="${btnPrimary}">Xác nhận</button><button data-action="birth-cancel" class="${btnGhost}">Chọn lại</button></div></div>` : ""}
      ${s.birth ? ageGroupBox(s.birth) + (ui.birthEdit === 1 ? `<div style="border-radius:12px;padding:10px;background:#fffbeb;border:1px solid #fcd34d"><p style="margin:0 0 6px;color:#92400e;font-size:12px"><b>Cam kết trước khi sửa:</b> Tôi cam kết khai đúng ngày sinh thật của mình. Tuổi được dùng để giới hạn game đánh bài (từ 12 tuổi) và mua Chips bằng tiền (từ 18 tuổi); khai sai có thể bị khóa các tính năng này.</p><div style="display:flex;gap:8px"><button data-action="birth-edit-ok" class="${btnPrimary}">Tôi cam kết, tiếp tục</button><button data-action="birth-edit-cancel" class="${btnGhost}">Hủy</button></div></div>` : ui.birthEdit === 2 ? `<button data-action="birth-edit-cancel" class="${btnGhost}">Hủy sửa ngày sinh</button>` : `<button data-action="birth-edit" class="${btnGhost}">✏️ Sửa ngày sinh</button>`) : `<p class="text-[10px] text-slate-500">Ngày sinh cần khai đúng sự thật; sau khi lưu, muốn sửa phải xác nhận cam kết. Game có giới hạn độ tuổi cho một số mục (game đánh bài từ 12 tuổi, mua Chips bằng tiền từ 18 tuổi).</p>`}
      <p class="text-[10px] text-slate-500">${s.birth ? "Ngày sinh đã được xác nhận. " : ""}${s.gender ? "" : "Bạn chưa chọn giới tính. "}Giới tính và tuổi hiện trên khung người chơi trong game.</p>
    </div>
    ${tog("dark", s.dark, "Giao diện tối (Dark Mode)")}
    ${tog("autoDark", s.autoDark !== false, "Tự động bật giao diện tối lúc 19:00, tắt lúc 7:00 sáng", "Muốn quay lại giao diện sáng, hãy tắt Dark Mode ở đây")}
    ${tog("sound", s.sound, "Nh\u1EA1c n\u1EC1n", "Cho ph\xE9p ph\xE1t nh\u1EA1c \u1EDF m\u1EE5c Gi\u1EA3i tr\xED")}
    ${tog("sfx", s.sfx, "\xC2m thanh hi\u1EC7u \u1EE9ng n\xFAt b\u1EA5m", "Ti\u1EBFng b\u1EA5m n\xFAt, nh\u1EADn WIND Coin, \u0111\xFAng/sai khi l\xE0m b\xE0i")}
    <div class="rounded-2xl border border-slate-200 p-3 space-y-3">
      <div><p class="font-extrabold text-slate-800 mb-2">Âm thanh trả lời đúng</p><div class="grid grid-cols-1 sm:grid-cols-3 gap-2">${sfxChoices("right")}</div></div>
      <div><p class="font-extrabold text-slate-800 mb-2">Âm thanh trả lời sai</p><div class="grid grid-cols-1 sm:grid-cols-3 gap-2">${sfxChoices("wrong")}</div></div>
      <p class="text-[10px] text-slate-500">Chọn một kiểu âm thanh trong mỗi nhóm. Nút sẽ phát thử ngay.</p>
    </div>
    ${tog("push", s.push, "Hi\u1EC7n ch\u1EA5m th\xF4ng b\xE1o")}
    <div><label class="font-bold text-slate-700" for="set-cur">\u0110\u01A1n v\u1ECB ti\u1EC1n \u1EDF WIND Store</label>
      <select id="set-cur" data-change="currency" class="${field} mt-1"><option value="VND" ${s.currency === "VND" ? "selected" : ""}>\u{1F1FB}\u{1F1F3} \u20AB VND</option><option value="KRW" ${s.currency === "KRW" ? "selected" : ""}>\u{1F1F0}\u{1F1F7} \u20A9 Won</option><option value="JPY" ${s.currency === "JPY" ? "selected" : ""}>\u{1F1EF}\u{1F1F5} \xA5 Y\xEAn</option></select></div>
    <div class="rounded-xl bg-slate-100 p-3 text-[11px] text-slate-600">D\u1EEF li\u1EC7u \u0111\u01B0\u1EE3c l\u01B0u ngay trong tr\xECnh duy\u1EC7t n\xE0y. M\u1EE9c \u0111\u1ED9 h\u1ECDc hi\u1EC7n t\u1EA1i: ${LEVELS[ui.match.level]}.</div>
    <button data-action="open-cultivation-system" class="w-full rounded-xl border border-violet-200 p-3 text-left font-extrabold text-violet-800" style="background:linear-gradient(100deg,#f5d0fe,#dbeafe,#ccfbf1)">🌌 Hệ thống cảnh giới tu tiên <span class="block text-[10px] font-normal mt-1">Xem tất cả cảnh giới, thời gian thăng cấp và quy định hạ cấp</span></button>
    ${adminSection()}
    <button data-action="reset-data" class="w-full py-2 bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold rounded-xl text-xs transition-colors">\u0110\u1EB7t l\u1EA1i to\xE0n b\u1ED9 d\u1EEF li\u1EC7u demo</button>
  </div>`;
  }
  function adminCosmeticPanel() {
    if (!isAdmin()) return "";
    const avOn = state.avatarId === ADMIN_AVATAR_ID, frOn = state.frameId === ADMIN_FRAME_ID;
    const card = (title, sub, preview, on, kind, id) => `<div class="adm-id-card${on ? " on" : ""}"><div class="flex justify-center" style="padding:${kind === "frame" ? "16px 0 8px" : "6px 0 8px"}">${preview}</div><p style="font-size:11px;font-weight:900;color:#fff">${title}</p><p style="margin:2px 0 6px">${sub}</p>${on ? '<span class="adm-id-btn" style="background:rgba(16,185,129,.35);color:#d1fae5">\u0110ang d\u00F9ng</span>' : `<button data-action="equip-cosmetic" data-kind="${kind}" data-id="${id}" class="adm-id-btn">S\u1EED d\u1EE5ng</button>`}</div>`;
    return `<div class="adm-id">
      <div class="flex items-center justify-between gap-2"><h3>\u{1F451} \u0110\u1EB7c quy\u1EC1n M\u00E1y ch\u1EE7</h3><span style="font-size:9px;font-weight:800;color:#fde68a;border:1px solid rgba(253,224,71,.5);border-radius:99px;padding:1px 7px">Ch\u1EC9 BigBoss</span></div>
      <p style="margin-top:3px">D\u00F9ng logo \u1EE9ng d\u1EE5ng l\u00E0m avatar v\u00E0 khung ri\u00EAng. T\u00E0i kho\u1EA3n th\u01B0\u1EDDng kh\u00F4ng th\u1EA5y v\u00E0 kh\u00F4ng ch\u1ECDn \u0111\u01B0\u1EE3c.</p>
      <div class="adm-id-grid">
        ${card("Logo trang ch\u1EE7", "Gi\u1ED1ng logo WINDTP", renderPfp(state.userName, ADMIN_AVATAR_ID, "none", 84), avOn, "avatar", ADMIN_AVATAR_ID)}
        ${card("Ho\u00E0ng Kim Thi\u00EAn \u0110\u1EBF", "Khung \u0111\u1ED9c quy\u1EC1n", renderPfp(state.userName, ADMIN_AVATAR_ID, ADMIN_FRAME_ID, 84), frOn, "frame", ADMIN_FRAME_ID)}
      </div>
      <button data-action="admin-equip-set" class="adm-id-btn go" style="margin-top:10px;padding:8px 0;font-size:11px">${avOn && frOn ? "\u2713 \u0110ang d\u00F9ng tr\u1ECDn b\u1ED9" : "\u2728 D\u00F9ng tr\u1ECDn b\u1ED9 Logo + Khung Thi\u00EAn \u0110\u1EBF"}</button>
    </div>`;
  }
  function profileModal() {
    const tab = ui.profileTab;
    const streak = state.loginStreak;
    const kind = tab === "avatar" ? "avatar" : "frame";
    const allAvatarItems = AVATARS.filter((x) => x.unlock !== "admin" || isAdmin());
    const items = tab === "avatar" ? (ui.avatarCategory === "zodiac" ? allAvatarItems.filter((x) => x.id.startsWith("z-")) : ui.avatarCategory === "chinese" ? allAvatarItems.filter((x) => x.id.startsWith("c-")) : ui.avatarCategory === "age" ? allAvatarItems.filter((x) => x.id.startsWith("age-")) : ui.avatarCategory === "streak" ? allAvatarItems.filter((x) => x.id.startsWith("streak-")) : ui.avatarCategory === "special" ? allAvatarItems.filter((x) => x.id.startsWith("special-")) : allAvatarItems) : FRAMES.filter((x) => x.unlock !== "admin" || isAdmin());
    const equipped = tab === "avatar" ? state.avatarId : myFrameId();
    const tabBtn = (t, label) => `<button data-action="profile-tab" data-t="${t}" aria-pressed="${tab === t}" class="flex-1 py-2 rounded-xl text-xs font-bold ${tab === t ? "bg-sky-600 text-white keep-white" : "bg-white border border-slate-200 text-slate-600"}">${label}</button>`;
    return `${modalHead("\u{1F5BC}\uFE0F Avatar & Khung")}
  <div class="p-5 space-y-4">
    <div class="flex items-center gap-4 rounded-2xl bg-sky-50/60 border border-sky-100 p-3">
      ${profileAvatar(72)}
      <div class="min-w-0 flex-1">
        <p class="text-sm font-extrabold text-slate-800 truncate">${esc(state.userName)}</p>
        <p class="text-[11px] text-slate-500">S\u1ED1 d\u01B0: <b class="text-amber-600">${fmt(state.balance)} Xu</b></p>
        <p class="text-[11px] text-slate-500">Chu\u1ED7i \u0111\u0103ng nh\u1EADp: <b class="text-emerald-600">${Math.min(streak, STREAK_DAYS)}/${STREAK_DAYS} ng\xE0y</b>${streak >= STREAK_DAYS ? " \u2713" : ""}</p>
      </div>
    </div>
    ${adminCosmeticPanel()}
    ${tab === "avatar" ? `<div class="glass-card rounded-2xl p-3 border border-amber-200 bg-amber-50/60">
      <div class="flex items-center justify-between gap-2 mb-2"><h3 class="text-xs font-extrabold text-slate-800">🎁 Bộ ảnh đăng nhập liên tiếp</h3><span class="text-[10px] text-amber-700 font-bold">Đẹp dần theo mốc</span></div>
      <div class="grid grid-cols-3 gap-2">
        ${[["streak-7",7],["streak-15",15],["streak-30",30]].map(([id,need]) => { const unlocked=streakProgress()>=need; return `<div class="rounded-xl bg-white border ${unlocked ? "border-emerald-300" : "border-amber-100"} p-2 text-center"><div class="flex justify-center">${renderPfp(state.userName,id,"none",64)}</div><p class="text-[10px] font-extrabold text-slate-700 mt-1">${need} ngày</p><p class="text-[9px] ${unlocked ? "text-emerald-600" : "text-slate-400"}">${unlocked ? "✓ Đã mở khóa" : `${streakProgress()}/${need}`}</p></div>`; }).join("")}
      </div>
    </div>` : `<div class="glass-card rounded-2xl p-3 border border-violet-200 bg-violet-50/60">
      <div class="flex items-center justify-between gap-2 mb-2"><h3 class="text-xs font-extrabold text-slate-800">🎁 Bộ khung avatar đăng nhập liên tiếp</h3><span class="text-[10px] text-violet-700 font-bold">Khung thưởng miễn phí</span></div>
      <div class="grid grid-cols-3 gap-2">
        ${[["f-bronze7",7],["f-silver15",15],["f-jade30",30]].map(([id,need]) => { const unlocked=streakProgress()>=need; return `<div class="rounded-xl bg-white border ${unlocked ? "border-emerald-300" : "border-violet-100"} p-2 text-center"><div class="flex justify-center">${renderPfp(state.userName,state.avatarId,id,64)}</div><p class="text-[10px] font-extrabold text-slate-700 mt-1">${need} ngày</p><p class="text-[9px] ${unlocked ? "text-emerald-600" : "text-slate-400"}">${unlocked ? "✓ Đã mở khóa" : `${streakProgress()}/${need}`}</p></div>`; }).join("")}
      </div>
    </div>`}
    <div class="flex gap-2">${tabBtn("avatar", "\u{1F642} Avatar")}${tabBtn("frame", "\u2B55 Khung avatar")}</div>
    
    ${tab === "avatar" ? `<div class="grid grid-cols-3 sm:grid-cols-6 gap-1.5"><button data-action="avatar-category" data-cat="streak" class="py-1.5 rounded-lg text-[10px] font-bold ${ui.avatarCategory === "streak" ? "bg-sky-600 text-white keep-white" : "bg-white border border-slate-200 text-slate-600"}">Đăng nhập 7/15/30 ngày</button><button data-action="avatar-category" data-cat="all" class="py-1.5 rounded-lg text-[10px] font-bold ${ui.avatarCategory === "all" ? "bg-sky-600 text-white keep-white" : "bg-white border border-slate-200 text-slate-600"}">Tất cả</button><button data-action="avatar-category" data-cat="zodiac" class="py-1.5 rounded-lg text-[10px] font-bold ${ui.avatarCategory === "zodiac" ? "bg-sky-600 text-white keep-white" : "bg-white border border-slate-200 text-slate-600"}">12 Cung</button><button data-action="avatar-category" data-cat="chinese" class="py-1.5 rounded-lg text-[10px] font-bold ${ui.avatarCategory === "chinese" ? "bg-sky-600 text-white keep-white" : "bg-white border border-slate-200 text-slate-600"}">12 Con giáp</button><button data-action="avatar-category" data-cat="age" class="py-1.5 rounded-lg text-[10px] font-bold ${ui.avatarCategory === "age" ? "bg-sky-600 text-white keep-white" : "bg-white border border-slate-200 text-slate-600"}">Độ tuổi</button><button data-action="avatar-category" data-cat="special" class="py-1.5 rounded-lg text-[10px] font-bold ${ui.avatarCategory === "special" ? "bg-sky-600 text-white keep-white" : "bg-white border border-slate-200 text-slate-600"}">Khác 25k</button></div>` : ""}    <p class="text-[11px] text-slate-500">Bộ avatar đã làm mới: 12 cung hoàng đạo và 6 nhóm tuổi (Nam/Nữ): 20.000 WIND Coin; con giáp, avatar đặc biệt và khung: 25.000 WIND Coin. Ảnh đặc biệt nhận miễn phí khi đăng nhập + điểm danh đủ 7 / 15 / 30 ngày liên tiếp.</p>
    ${tab === "frame" ? `<div class="rounded-2xl p-3 border border-fuchsia-200 text-[11px] font-bold text-fuchsia-800" style="background:linear-gradient(100deg,#fae8ff,#e0f2fe)">🌌 9 khung cảnh giới ở đầu danh sách: tự động nhận khi thăng cảnh giới, cảnh giới càng cao hiệu ứng càng rực rỡ (hiện tại: ${esc(cultivationRank().name)}).</div>` : ""}
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 avatar-gallery">
      ${items.map((it) => {
      const owned = isOwned(kind, it.id);
      const on = equipped === it.id;
      const preview = tab === "avatar" ? renderPfp(state.userName, it.id, myFrameId(), 92) : renderPfp(state.userName, state.avatarId, it.id, 88);
      let btn;
      if (on) btn = '<span class="block py-1 rounded-lg text-[10px] font-bold bg-emerald-100 text-emerald-700">\u0110ang d\xF9ng</span>';
      else if (owned) btn = `<button data-action="equip-cosmetic" data-kind="${kind}" data-id="${it.id}" class="w-full py-1 rounded-lg text-[10px] font-bold bg-sky-600 text-white keep-white">S\u1EED d\u1EE5ng</button>`;
      else if (["streak7","streak15","streak30"].includes(it.unlock)) { const need = it.rewardDays || 7; const prog = streakProgress(); btn = prog >= need ? `<button data-action="claim-cosmetic" data-kind="${kind}" data-id="${it.id}" class="w-full py-1 rounded-lg text-[10px] font-bold bg-emerald-600 text-white keep-white">Nhận miễn phí</button>` : `<span class="block py-1 rounded-lg text-[10px] font-bold bg-slate-100 text-slate-500">🎁 ${prog}/${need} ngày liên tiếp</span>`; }
      else if (it.unlock === "premium") btn = `<button data-action="open-premium" class="w-full py-1 rounded-lg text-[10px] font-bold text-white keep-white bg-gradient-to-r from-amber-500 to-pink-500">👑 Cần Premium</button>`;
      else if (it.unlock === "realm") btn = `<span class="block py-1 rounded-lg text-[10px] font-bold bg-slate-100 text-slate-500">🔒 Đạt ${CULTIVATION_RANKS[it.realm].name}</span>`;
      else btn = `<button data-action="buy-cosmetic" data-kind="${kind}" data-id="${it.id}" class="w-full py-1 rounded-lg text-[10px] font-bold bg-amber-500 text-white keep-white">\u{1FA99} ${fmt(it.price)}</button>`;
      return `<div class="rounded-2xl border ${on ? "border-sky-400 bg-sky-50/60" : "border-slate-200 bg-white"} p-2 text-center space-y-1.5">
          <div class="flex justify-center" style="padding:${tab === "frame" ? "12px 0" : "4px 0"}">${preview}</div>
          <p class="text-[11px] font-bold text-slate-700 leading-tight min-h-[26px] flex items-center justify-center">${esc(it.name)}</p>
          ${btn}
        </div>`;
    }).join("")}
    </div>
    <button data-action="open-settings" class="w-full ${btnGhost}">&larr; Quay l\u1EA1i C\xE0i \u0111\u1EB7t</button>
  </div>`;
  }

