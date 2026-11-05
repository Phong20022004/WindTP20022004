/*@file js/app/21-listing-and-moderation-modals.js
 * Hộp thoại đăng tin, kiểm duyệt và danh mục tự tạo.
 */
  function pendingModal() {
    const o = ui.pendingOrder || {};
    return `${modalHead("\u23F3 Ch\u1EDD x\u1EED l\xFD")}
  <div class="p-6 text-center space-y-3">
    <div class="text-5xl">\u23F3</div>
    <p class="text-lg font-black text-amber-700">Ch\u1EDD x\u1EED l\xFD</p>
    <p class="text-sm text-slate-700">${esc(o.summary || "")}</p>
    <p class="text-xs text-slate-500">M\xE3 \u0111\u01A1n: <b>${esc(o.code || "")}</b></p>
    <p class="text-[11px] text-slate-500">Ch\xFAng t\xF4i s\u1EBD x\xE1c minh kho\u1EA3n chuy\u1EC3n kho\u1EA3n r\u1ED3i k\xEDch ho\u1EA1t \u0111\u01A1n. N\u1EBFu c\u1EA7n h\u1ED7 tr\u1EE3, h\xE3y nh\u1EAFn trang Facebook k\xE8m m\xE3 \u0111\u01A1n.</p>
    <div class="flex gap-2 justify-center items-end">${fbContactBtn()}<button data-action="close-modal" class="${btnGhost}">\u0110\xF3ng</button></div>
  </div>`;
  }
  function listingModal(l) {
    const saved = state.saved.includes(l.id);
    const mine = l.seller === state.userName;
    return `${modalHead(esc(l.title))}
  <div class="p-5 space-y-3">
    <div class="rounded-2xl overflow-hidden">${l.img ? `<div class="relative h-44 bg-sky-100 flex items-center justify-center text-6xl"><span>${l.emoji}</span><img src="${esc(l.img)}" alt="" class="absolute inset-0 w-full h-full object-cover" onerror="this.remove()"></div>` : `<div class="h-32 bg-gradient-to-br from-sky-100 to-indigo-100 flex items-center justify-center text-6xl">${l.emoji}</div>`}</div>
    <p class="text-lg font-black text-teal-600">${esc(l.price)}</p>
    <p class="text-xs text-slate-500">${esc(l.loc)} \u2022 ${timeAgo(l.ts)} \u2022 Ng\u01B0\u1EDDi \u0111\u0103ng: <b>${esc(l.seller)}</b></p>
    <p class="text-sm text-slate-700 whitespace-pre-line break-words">${esc(l.desc)}</p>
    <div class="flex flex-wrap gap-2 pt-2">
      <button data-action="contact-seller" data-id="${l.id}" class="flex-1 ${btnPrimary}">Li\xEAn h\u1EC7 ng\u01B0\u1EDDi \u0111\u0103ng</button>
      <button data-action="save-listing" data-id="${l.id}" class="${btnGhost}">${saved ? "\u{1F516} B\u1ECF l\u01B0u" : "\u{1F516} L\u01B0u tin"}</button>
      ${mine ? `<button data-action="delete-listing" data-id="${l.id}" class="px-4 py-2 rounded-xl text-xs font-bold bg-rose-50 text-rose-600">G\u1EE1 tin</button>` : ""}
    </div>
  </div>`;
  }
  function postListingModal() {
    return `${modalHead("\u{1F4DD} \u0110\u0103ng tin m\u1EDBi")}
  <div class="p-5 space-y-3">
    <div><label class="text-xs font-bold text-slate-600" for="pl-cat">Danh m\u1EE5c</label>
      <select id="pl-cat" class="${field} mt-1"><option value="market">Ch\u1EE3 \u0111\u1ED3 c\u0169</option><option value="jobs">Vi\u1EC7c l\xE0m HS/SV</option><option value="housing">T\xECm &amp; nh\u01B0\u1EE3ng ph\xF2ng</option>${state.customCats.map((c) => `<option value="${c.id}" ${ui.utilCat === c.id ? "selected" : ""}>${c.emoji} ${esc(c.name)}</option>`).join("")}</select></div>
    <div><label class="text-xs font-bold text-slate-600" for="pl-title">Ti\xEAu \u0111\u1EC1 (t\u1ED1i thi\u1EC3u 5 k\xFD t\u1EF1)</label><input id="pl-title" maxlength="80" class="${field} mt-1"></div>
    <div class="grid grid-cols-2 gap-2">
      <div><label class="text-xs font-bold text-slate-600" for="pl-price">Gi\xE1 / m\u1EE9c l\u01B0\u01A1ng</label><input id="pl-price" maxlength="40" placeholder="V\xED d\u1EE5 2,000,000 VN\u0110" class="${field} mt-1"></div>
      <div><label class="text-xs font-bold text-slate-600" for="pl-loc">Khu v\u1EF1c</label><input id="pl-loc" maxlength="40" placeholder="Qu\u1EADn, th\xE0nh ph\u1ED1" class="${field} mt-1"></div>
    </div>
    <div class="grid grid-cols-2 gap-2"><div><label class="text-xs font-bold text-slate-600" for="pl-country">Quốc gia</label><input id="pl-country" maxlength="40" value="Việt Nam" placeholder="Việt Nam / Vietnam" class="${field} mt-1"></div><div><label class="text-xs font-bold text-slate-600" for="pl-region">Miền</label><div class="mt-1">${regionSelect("pl-region", "")}</div></div></div>
    <div><label class="text-xs font-bold text-slate-600" for="pl-desc">M\xF4 t\u1EA3</label><textarea id="pl-desc" rows="3" maxlength="400" class="${field} mt-1 resize-none"></textarea></div>
    <button data-action="submit-listing" class="w-full ${btnPrimary}">\u0110\u0103ng tin</button>
  </div>`;
  }
  var CATEGORY_EMOJIS = ["\u{1F4CC}", "\u{1F381}", "\u{1F4DA}", "\u{1F3B5}", "\u{1F35C}", "\u{1F697}", "\u{1F4A1}", "\u{1F43E}"];
  function moderationModal() {
    const pendingPosts = state.posts.filter((p) => p.status === "pending");
    const pendingListings = state.listings.filter((l) => l.status === "pending");
    const catLabel = (c) => { const f = UTIL_CATS.find((x) => x[0] === c); if (f) return f[1]; const cc = state.customCats.find((x) => x.id === c); return cc ? `${cc.emoji} ${cc.name}` : c; };
    const meta2 = (t) => `<p class="text-[11px] text-slate-500 mt-0.5">${t}</p>`;
    const buttons = (type, id) => `<div class="flex gap-2 pt-2"><button data-action="approve-content" data-type="${type}" data-id="${id}" class="flex-1 px-3 py-2 rounded-lg text-xs font-bold bg-emerald-600 text-white keep-white">✅ Duyệt và đăng</button><button data-action="reject-content" data-type="${type}" data-id="${id}" class="flex-1 px-3 py-2 rounded-lg text-xs font-bold bg-rose-100 text-rose-700">Từ chối</button></div>`;
    const postRow = (p) => `<div class="rounded-2xl p-3 border border-slate-200 bg-white"><p class="text-[10px] font-extrabold text-rose-600 uppercase">Bài cộng đồng · ${esc(p.tag)}</p><p class="text-sm font-extrabold text-slate-800 mt-1 break-words">${esc(p.author)}</p>${meta2(timeAgo(p.ts))}<div class="mt-2 rounded-xl bg-slate-50 border border-slate-100 p-3"><p class="text-xs text-slate-800 leading-relaxed whitespace-pre-line break-words">${esc(p.text)}</p></div>${buttons("post", p.id)}</div>`;
    const listingRow = (l) => `<div class="rounded-2xl p-3 border border-slate-200 bg-white"><p class="text-[10px] font-extrabold text-rose-600 uppercase">Tin tiện ích · ${catLabel(l.cat)}</p><p class="text-sm font-extrabold text-slate-800 mt-1 break-words">${esc(l.title)}</p>${meta2(`Người đăng: <b>${esc(l.seller)}</b> • ${timeAgo(l.ts)}`)}
      ${l.img ? `<img src="${esc(l.img)}" alt="" class="mt-2 w-full max-h-48 object-cover rounded-xl">` : ""}
      <div class="mt-2 rounded-xl bg-slate-50 border border-slate-100 p-3 space-y-1"><p class="text-xs text-slate-800"><b>Giá / mức lương:</b> ${esc(l.price)}</p><p class="text-xs text-slate-800"><b>Khu vực:</b> ${esc(l.loc)}</p><p class="text-xs text-slate-800 whitespace-pre-line break-words"><b>Mô tả:</b> ${esc(l.desc)}</p></div>${buttons("listing", l.id)}</div>`;
    const total = pendingPosts.length + pendingListings.length;
    return `${modalHead("🛡️ Kiểm duyệt nội dung")}<div class="p-5 space-y-4"><div><h3 class="font-extrabold text-sm text-slate-800">Chờ duyệt · ${total}</h3><p class="text-[11px] text-slate-500 mt-1">Xem toàn bộ nội dung người dùng đăng rồi bấm Duyệt để hiển thị công khai.</p></div><div class="space-y-3">${pendingPosts.map(postRow).join("")}${pendingListings.map(listingRow).join("")}${total ? "" : '<p class="text-xs text-slate-500 text-center py-5">Không có nội dung chờ duyệt.</p>'}</div></div>`;
  }
  function categoryModal() {
    return `${modalHead("\uFF0B T\u1EA1o danh m\u1EE5c m\u1EDBi")}
  <div class="p-5 space-y-3">
    <p class="text-xs text-slate-600">Ngo\xE0i Ch\u1EE3 \u0111\u1ED3 c\u0169, Vi\u1EC7c l\xE0m v\xE0 Ph\xF2ng tr\u1ECD, b\u1EA1n c\xF3 th\u1EC3 t\u1EA1o danh m\u1EE5c ri\xEAng (t\u1ED1i \u0111a 8) \u0111\u1EC3 \u0111\u0103ng tin theo ch\u1EE7 \u0111\u1EC1 c\u1EE7a m\xECnh.</p>
    <div><label class="text-xs font-bold text-slate-600" for="cat-name">T\xEAn danh m\u1EE5c (2 \u0111\u1EBFn 20 k\xFD t\u1EF1)</label><input id="cat-name" data-autofocus maxlength="20" placeholder="V\xED d\u1EE5: \u0110\u1ED3 \u0103n, T\xECm b\u1EA1n \u0111i chung" class="${field} mt-1"></div>
    <div><p class="text-xs font-bold text-slate-600 mb-1">Bi\u1EC3u t\u01B0\u1EE3ng</p>
      <div class="flex flex-wrap gap-2">${CATEGORY_EMOJIS.map((e, i) => `<label class="cursor-pointer"><input type="radio" name="cat-emoji" value="${e}" class="peer sr-only" ${i === 0 ? "checked" : ""}><span class="block w-10 h-10 rounded-xl border border-slate-200 text-xl flex items-center justify-center peer-checked:border-teal-500 peer-checked:bg-teal-50">${e}</span></label>`).join("")}</div></div>
    <button data-action="submit-category" class="w-full ${btnPrimary}">T\u1EA1o danh m\u1EE5c</button>
  </div>`;
  }
