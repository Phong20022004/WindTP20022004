/*@file js/app/49-vocab-lessons.js
 * Bài học tự động từ danh sách từ vựng (src/data/vocab → window.WINDTP_VOCAB):
 * làm sạch từ tiếng Hàn, tạo phiên âm (RR theo âm tiết) và mở bộ bài học dùng chung (window.__lessonOpen).
 */
const VOCAB_INITIALS = ["g", "kk", "n", "d", "tt", "r", "m", "b", "pp", "s", "ss", "", "j", "jj", "ch", "k", "t", "p", "h"];
const VOCAB_VOWELS = ["a", "ae", "ya", "yae", "eo", "e", "yeo", "ye", "o", "wa", "wae", "oe", "yo", "u", "wo", "we", "wi", "yu", "eu", "ui", "i"];
const VOCAB_FINALS = ["", "k", "k", "k", "n", "n", "n", "t", "l", "k", "m", "l", "l", "l", "p", "l", "m", "p", "p", "t", "t", "ng", "t", "t", "k", "t", "p", "t"];
function romanizeKo(text) {
  let out = "", prevSyl = false;
  for (const ch of String(text)) {
    const n = ch.charCodeAt(0) - 44032;
    if (n >= 0 && n <= 11171) {
      out += (prevSyl ? "-" : "") + VOCAB_INITIALS[Math.floor(n / 588)] + VOCAB_VOWELS[Math.floor((n % 588) / 28)] + VOCAB_FINALS[n % 28];
      prevSyl = true;
    } else { out += ch; prevSyl = false; }
  }
  return out;
}
/** Đưa từ trong sheet về dạng gõ được: bỏ [ghi chú], (ghi chú), chỉ lấy phương án đầu trước "/". Trả "" nếu không gõ được (có chữ Latin/số). */
function cleanKoWord(raw) {
  const base = String(raw).replace(/\[[^\]]*\]/g, " ").replace(/\([^)]*\)/g, " ");
  if (/[A-Za-z0-9]/.test(base)) return "";
  return base.split("/")[0].replace(/[^가-힣 ]/g, "").replace(/\s+/g, " ").trim();
}
function vocabLessonsOf(code, gi, vi) {
  const g = (BOOK_CATALOG[code] || [])[gi];
  return g && window.WINDTP_VOCAB ? window.WINDTP_VOCAB[code + "|" + g[0] + "|" + vi] || [] : [];
}
function openVocabLesson(code, gi, vi, li, route) {
  const g = (BOOK_CATALOG[code] || [])[gi], L = vocabLessonsOf(code, gi, vi)[li];
  if (!g || !L || typeof window.__lessonOpen !== "function") return false;
  const grammar = g[0] === "Cấu trúc ngữ pháp", seen = new Set(), words = [];
  for (const [ko, vn] of L.words) {
    if (grammar) {
      const m = String(ko).match(/^(.*?)\s*\(([^()]*)\)\s*$/), key = m ? m[1] : ko;
      if (!key || seen.has(key)) continue;
      seen.add(key); words.push([key, "", (m ? m[2] + " — " : "") + vn]);
    } else {
      const c = cleanKoWord(ko);
      if (!c || seen.has(c)) continue;
      seen.add(c); words.push([c, romanizeKo(c), vn]);
    }
  }
  if (words.length < 4) return false;
  const sents = grammar ? [] : (L.sents || []).filter((s) => seen.has(s[0]));
  const vol = g[2][vi];
  window.__lessonOpen({ key: code + "|" + gi + "|" + vi + "|" + li, words, sents, noType: grammar, eyebrow: (g[0] + " · " + vol).toUpperCase(), title: L.title + " · " + (grammar ? "Ngữ pháp" : "Từ vựng"), label: g[0] + " " + vol + " · " + L.title }, route);
  return true;
}
/** Mở lại bài từ khóa "mã|nhóm|quyển|bài" (dùng cho lời thách đấu gắn với bài đó). */
window.__openLessonByKey = (key, route) => {
  const p = String(key).split("|");
  return p.length === 4 && openVocabLesson(p[0], Number(p[1]), Number(p[2]), Number(p[3]), route);
};
