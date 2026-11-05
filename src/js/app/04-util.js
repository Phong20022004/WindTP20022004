/*@file js/app/04-util.js
 * Hàm tiện ích dùng chung ($, esc, norm, ...).
 */
  // src/util.ts
  function $(sel, root = document) {
    return root.querySelector(sel);
  }
  function $$(sel, root = document) {
    return Array.from(root.querySelectorAll(sel));
  }
  function esc(s) {
    return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }
  var fmt = (n) => Math.round(n).toLocaleString("en-US");
  function norm(s) {
    return s.normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/đ/g, "d").replace(/Đ/g, "D").toLowerCase().trim();
  }
  var pad = (n) => String(n).padStart(2, "0");
  function dateKey(d = /* @__PURE__ */ new Date()) {
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  }
  function yesterdayKey() {
    const d = /* @__PURE__ */ new Date();
    d.setDate(d.getDate() - 1);
    return dateKey(d);
  }
  function fmtDateTime(ts) {
    const d = new Date(ts);
    return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} \u2022 ${pad(d.getHours())}:${pad(d.getMinutes())}`;
  }
  function timeAgo(ts) {
    const diff = Math.max(0, Date.now() - ts);
    const min = Math.floor(diff / 6e4);
    if (min < 1) return "V\u1EEBa xong";
    if (min < 60) return `${min} ph\xFAt tr\u01B0\u1EDBc`;
    const h = Math.floor(min / 60);
    if (h < 24) return `${h} gi\u1EDD tr\u01B0\u1EDBc`;
    return `${Math.floor(h / 24)} ng\xE0y tr\u01B0\u1EDBc`;
  }
  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }
  var counter = 0;
  function uid(prefix) {
    counter += 1;
    return `${prefix}-${Date.now().toString(36)}${counter}`;
  }
  function initial(name) {
    const parts = name.trim().split(/\s+/);
    return (parts[parts.length - 1] || "?").charAt(0).toUpperCase();
  }
  var AVATAR_TONES = ["from-sky-400 to-blue-500", "from-rose-400 to-pink-500", "from-emerald-400 to-teal-500", "from-amber-400 to-orange-500", "from-violet-400 to-indigo-500"];
  function avatar(name, size = "w-10 h-10") {
    let h = 0;
    for (const c of name) h = h * 31 + c.charCodeAt(0) >>> 0;
    return `<div class="${size} shrink-0 rounded-full bg-gradient-to-tr ${AVATAR_TONES[h % AVATAR_TONES.length]} text-white font-extrabold text-sm flex items-center justify-center keep-white">${esc(initial(name))}</div>`;
  }
  function thumb(src, emoji, cls, art) {
    const img = src ? `<img src="${esc(src)}" alt="" loading="lazy" class="absolute inset-0 w-full h-full object-cover" onerror="this.remove()">` : "";
    const body = art ? `<span class="ws-art">${art}</span>` : `<span>${emoji}</span>`;
    return `<div class="relative overflow-hidden bg-gradient-to-br from-sky-100 to-indigo-100 flex items-center justify-center text-3xl ${cls}">${body}${img}</div>`;
  }

