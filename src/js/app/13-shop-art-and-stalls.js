/*@file js/app/13-shop-art-and-stalls.js
 * Dữ liệu phụ của gian hàng, hình minh họa SVG sản phẩm, avatar gian hàng. (Ảnh: assets/images/shop/)
 */
  // ===== Gian hàng thông minh: dữ liệu bổ sung, minh họa sản phẩm, gợi ý, sắp xếp =====
  var PRODUCT_META = {};
  function meta(p) { return PRODUCT_META[p.id] || (p.custom ? { tag: "new", sub: p.sub || "" } : p.sub ? { sub: p.sub } : {}); }
  function soldNum(p) { return p.custom ? 1e9 : (meta(p).sold || 0); }
  function soldLine(p) {
    if (p.custom) return "✨ Hàng mới";
    const n = soldNum(p);
    return n ? "Đã bán " + (n >= 1000 ? (n / 1000).toFixed(1).replace(".", ",") + "k" : n) : "";
  }
  var SA = 'font-family="Inter,Arial,sans-serif" font-weight="900"';
  function LG(id, a, b, h) { return '<linearGradient id="pa-' + id + '" x1="0" y1="0" x2="' + (h ? 0 : 1) + '" y2="' + (h ? 1 : 0) + '"><stop offset="0" stop-color="' + a + '"/><stop offset="1" stop-color="' + b + '"/></linearGradient>'; }
  function ARTW(id, c1, c2, defs, inner) {
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 100" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><defs><linearGradient id="pb-' + id + '" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="' + c1 + '"/><stop offset="1" stop-color="' + c2 + '"/></linearGradient>' + defs + '</defs><rect width="120" height="100" fill="url(#pb-' + id + ')"/><ellipse cx="60" cy="88" rx="38" ry="5" fill="#000" opacity=".13"/>' + inner + '</svg>';
  }
  var FOODBG = ["#fff7ed", "#fed7aa"], FASHBG = ["#fdf2f8", "#fbcfe8"], TECHBG = ["#eff6ff", "#c7d2fe"], SUPPBG = ["#ecfdf5", "#a7f3d0"], STUDYBG = ["#fffbeb", "#fde68a"];
  var PRODUCT_ART = {};
  var ARTCACHE = {};
  function productArt(p) {
    const f = PRODUCT_ART[p.id];
    if (!f) return "";
    return ARTCACHE[p.id] || (ARTCACHE[p.id] = f());
  }
  var STALL_IMG = {food: "@@asset:shop/stall-food.jpg@@",fashion: "@@asset:shop/stall-fashion.jpg@@",tech: "@@asset:shop/stall-tech.jpg@@",supp: "@@asset:shop/stall-supp.jpg@@",study: "@@asset:shop/stall-study.jpg@@"};
  var STALL_STYLE = {
    food: { bg: "#dcf5d0", grad: "linear-gradient(180deg,#8fd45a,#f5a54a)", ink: "#1f2937" },
    fashion: { bg: "#fbd0ec", grad: "linear-gradient(180deg,#f6a6d8,#b77be6)", ink: "#1f2937" },
    tech: { bg: "#cfeefb", grad: "linear-gradient(180deg,#7fd0f7,#5aa8f0)", ink: "#1f2937" },
    supp: { bg: "#f3f6b5", grad: "linear-gradient(180deg,#e8ef7a,#7fd46a)", ink: "#1f2937" },
    study: { bg: "#cfe9ea", grad: "linear-gradient(180deg,#2f8f9a,#1d5563)", ink: "#ffffff" }
  };
  (function () {
    const st = document.createElement("style");
    st.textContent = ".stall-strip{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:6px}.stall-mini{display:flex;flex-direction:column;border-radius:12px;overflow:hidden;background:#fff;box-shadow:0 2px 7px rgba(15,23,42,.16);transition:transform .15s,opacity .15s,box-shadow .15s}.stall-mini.dim{opacity:.7}.stall-mini.on{opacity:1;transform:translateY(-2px);box-shadow:0 0 0 2px #0ea5e9,0 6px 12px rgba(14,165,233,.35)}.stall-mini-img{display:block;aspect-ratio:1/.8;overflow:hidden}.stall-mini-img img{width:100%;height:100%;object-fit:cover;display:block}.stall-mini-label{display:flex;align-items:center;justify-content:center;min-height:30px;padding:2px 3px;font-size:9px;font-weight:900;line-height:1.1;text-align:center}@media(min-width:640px){.stall-mini-label{font-size:11px;min-height:34px}}.sakura-layer{position:absolute;inset:0;pointer-events:none;overflow:hidden}.sakura-p{position:absolute;top:-12px;width:9px;height:9px;background:radial-gradient(circle at 30% 30%,#fff,#ffb3cf);border-radius:80% 0 80% 0;opacity:.9;animation:sakuraFall linear infinite}@keyframes sakuraFall{0%{transform:translate3d(0,-10px,0) rotate(0)}50%{transform:translate3d(26px,85px,0) rotate(180deg)}100%{transform:translate3d(-14px,175px,0) rotate(360deg)}}@media(prefers-reduced-motion:reduce){.sakura-p{animation:none;opacity:.5;top:30px}}#banner-wrap{touch-action:pan-y}";
    document.head.appendChild(st);
  })();
  function stallAvatar(k, px) {
    const img = STALL_IMG[k], st = STALL_STYLE[k];
    if (!img) return "";
    const coin = k === "study" ? `<span style="position:absolute;right:-1px;bottom:-1px;width:${Math.round(px * 0.38)}px;height:${Math.round(px * 0.38)}px;border-radius:50%;background:radial-gradient(circle at 35% 30%,#fde68a,#f59e0b);border:2px solid #fff;color:#92400e;font:900 ${Math.round(px * 0.22)}px/${Math.round(px * 0.34)}px Inter,Arial,sans-serif;text-align:center">W</span>` : "";
    return `<span role="img" aria-label="${STALLS[k].name}" style="position:relative;display:inline-block;flex:0 0 auto;width:${px}px;height:${px}px"><span style="display:block;width:100%;height:100%;border-radius:${Math.round(px * 0.28)}px;overflow:hidden;box-shadow:0 2px 7px rgba(15,23,42,.25),0 0 0 2px #fff;background:${st.bg}"><img src="${img}" alt="" style="width:100%;height:100%;object-fit:cover;display:block"></span>${coin}</span>`;
  }
  function productThumb(p, cls) {
    const m = meta(p);
    const badge = m.tag === "hot" ? '<span class="ws-badge ws-hot">🔥 Bán chạy</span>' : m.tag === "new" ? '<span class="ws-badge ws-new">✨ Mới</span>' : "";
    return thumb(p.img, p.emoji, cls, p.img ? "" : productArt(p)).replace(/<\/div>$/, badge + "</div>");
  }
  function sortedProducts(list) {
    const price = (p) => p.price[state.settings.currency];
    const arr = list.slice();
    if (ui.shopSort === "low") arr.sort((a, b) => price(a) - price(b));
    else if (ui.shopSort === "high") arr.sort((a, b) => price(b) - price(a));
    else if (ui.shopSort === "new") arr.sort((a, b) => (meta(b).tag === "new") - (meta(a).tag === "new") || soldNum(b) - soldNum(a));
    else arr.sort((a, b) => soldNum(b) - soldNum(a));
    return arr;
  }
