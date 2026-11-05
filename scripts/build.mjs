#!/usr/bin/env node
/**
 * Build WINDTP Super-App thành MỘT file HTML duy nhất: dist/index.html
 *
 *   node scripts/build.mjs            → dist/index.html
 *   node scripts/build.mjs --check    → build vào bộ nhớ, in kích thước + SHA-256 (không ghi file)
 *
 * Không cần cài thêm thư viện nào (chỉ dùng Node >= 18).
 *
 * Cách hoạt động:
 *  - src/manifest.json liệt kê theo ĐÚNG THỨ TỰ các mảnh tạo nên trang
 *    (thứ tự CSS/JS quan trọng vì các patch đè lên nhau).
 *  - Mỗi mục là một trong:
 *      { "raw":    "html/x.html" }                      chèn nguyên văn
 *      { "style":  "css/x.css",  "attrs": " id=\"x\"" }  → <style ...>…</style>
 *      { "script": "js/x.js" | ["a.js","b.js"], "attrs", "prefix", "suffix" }  → <script ...>…</script>
 *      { "game":   "game/manifest.json", ... }          game bàn bài (iframe srcdoc), lắp từ src/game/
 *    "after" (mặc định "\n") là khoảng trắng đặt sau thẻ đóng.
 *  - Ảnh: trong code ghi @@asset:thư-mục/tên.jpg@@ → build đổi thành data URI từ src/assets/images/.
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { createHash } from "node:crypto";
import { dirname, join, resolve, extname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const SRC = join(ROOT, "src");
const ASSETS = join(SRC, "assets", "images");
const MIME = { ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".webp": "image/webp", ".png": "image/png" };

// --no-headers: bỏ chú thích đầu file (/*@file ...*/) – chỉ dùng để đối chiếu với bản gốc.
const NO_HEADERS = process.argv.includes("--no-headers");
const HEADER = /^\/\*@file[\s\S]*?\*\/\n/;
const read = (base, rel) => {
  const text = readFileSync(join(base, rel), "utf8");
  return NO_HEADERS ? text.replace(HEADER, "") : text;
};
const readParts = (base, v) => (Array.isArray(v) ? v : [v]).map((p) => read(base, p)).join("");

/** Ghép các mục của một manifest thành chuỗi. `base` là thư mục chứa manifest. */
function render(items, base, ctx) {
  let out = "";
  for (const it of items) {
    const after = it.after ?? "\n";
    if (it.raw !== undefined) {
      out += readParts(base, it.raw);
    } else if (it.style !== undefined) {
      out += `<style${it.attrs ?? ""}>${readParts(base, it.style)}</style>${after}`;
    } else if (it.script !== undefined) {
      out += `<script${it.attrs ?? ""}>${it.prefix ?? ""}${readParts(base, it.script)}${it.suffix ?? ""}</script>${after}`;
    } else if (it.game !== undefined) {
      out += renderGame(it, base, ctx) + after;
    } else {
      throw new Error("Mục manifest không hợp lệ: " + JSON.stringify(it).slice(0, 120));
    }
  }
  return out;
}

/** Game là một trang HTML hoàn chỉnh, nhúng vào app dưới dạng mảng dòng JS → iframe.srcdoc. */
function renderGame(it, base, ctx) {
  const gameBase = dirname(join(base, it.game));
  const manifest = JSON.parse(read(base, it.game));
  const doc = inlineAssets(render(manifest.items, gameBase, ctx), ctx);
  const lines = doc.split("\n").map((l) => JSON.stringify(l).replace(/<\//g, "<\\/"));
  return `<script${it.attrs ?? ""}>${it.prefix ?? ""}${lines.join(",\n")}${it.suffix ?? ""}</script>`;
}

function inlineAssets(text, ctx) {
  return text.replace(/@@asset:([^@]+)@@/g, (_, rel) => {
    if (!ctx.cache.has(rel)) {
      const buf = readFileSync(join(ASSETS, rel));
      const mime = MIME[extname(rel).toLowerCase()];
      if (!mime) throw new Error("Định dạng ảnh chưa hỗ trợ: " + rel);
      ctx.cache.set(rel, `data:${mime};base64,${buf.toString("base64")}`);
    }
    return ctx.cache.get(rel);
  });
}

export function build() {
  const ctx = { cache: new Map() };
  const manifest = JSON.parse(read(SRC, "manifest.json"));
  return inlineAssets(render(manifest.items, SRC, ctx), ctx);
}

const html = build();
if (process.argv.includes("--check")) {
  const sha = createHash("sha256").update(html).digest("hex");
  console.log(`OK  ${Buffer.byteLength(html)} bytes  sha256=${sha}`);
} else {
  const out = join(ROOT, "dist", "index.html");
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, html);
  console.log(`Đã build → ${out} (${(Buffer.byteLength(html) / 1048576).toFixed(2)} MB)`);
}
