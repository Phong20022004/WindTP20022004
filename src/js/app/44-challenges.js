/*@file js/app/44-challenges.js
 * Thách đấu: chấm điểm, mô phỏng đối thủ, đối tượng CH.
 */
  function scoreQ(ok, t, limit, streak) {
    if (!ok) return 0;
    return 100 + Math.round(50 * Math.max(0, 1 - t / limit)) + Math.min(streak, 5) * 10;
  }
  function mulberry(a) { return function () { a |= 0; a = a + 1831565813 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  function hashStr(s) { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
  function simulateOpponent(ch, kinds) {
    const f = friendById(ch.fid) || FRIENDS[0];
    const rng = mulberry((ch.seed ^ hashStr(f.id)) >>> 0);
    let score = 0, correct = 0, streak = 0, ms = 0;
    for (let i = 0; i < ch.n; i++) {
      const kind = kinds && kinds[i] || "mc", limit = kind === "type" ? Q_LIMIT.type : Q_LIMIT.choice;
      const ok = rng() < f.skill - (kind === "type" ? .08 : 0);
      const t = limit * (.18 + .5 * rng());
      score += scoreQ(ok, t, limit, streak);
      streak = ok ? streak + 1 : 0;
      if (ok) correct++;
      ms += t * 1e3;
    }
    return { score, correct, total: ch.n, ms: Math.round(ms) };
  }
  var challengeListeners = [];
  function challengeChanged() { commit(); challengeListeners.forEach((fn) => { try { fn(); } catch (e) { } }); refreshFriends(); }
  var CH = {
    list: () => socialState().challenges,
    get: (id) => socialState().challenges.find((c) => c.id === id),
    onChange: (fn) => { challengeListeners.push(fn); },
    create(fid, n) {
      if (!isPremium()) return null;
      const f = friendById(fid);
      if (!f || !friendOnline(f)) { toast("Bạn bè đang offline, hãy thử chọc bạn trước nhé"); return null; }
      const s = socialState();
      if (s.challenges.some((c) => c.dir === "out" && c.fid === fid && (c.status === "pending" || c.status === "accepted"))) { toast("Bạn đang có một lời thách đấu chưa xong với bạn này"); return null; }
      const ch = { id: uid("ch"), dir: "out", fid, n, seed: Math.floor(Math.random() * 2147483647), ts: Date.now(), status: "pending", replyAt: Date.now() + 3e3 + Math.random() * 4e3, my: null, their: null, lesson: "s1a-1" };
      s.challenges.unshift(ch);
      if (s.challenges.length > 30) s.challenges.length = 30;
      challengeChanged();
      return ch;
    },
    respond(id, accept) {
      const ch = CH.get(id);
      if (!ch || ch.status !== "pending" || ch.dir !== "in") return;
      const f = friendById(ch.fid);
      ch.status = accept ? "accepted" : "declined";
      notify(accept ? "✅" : "\u{1F6AB}", accept ? `Bạn đã chấp nhận thách đấu của ${f.name}` : `Bạn đã từ chối thách đấu của ${f.name}`);
      challengeChanged();
    },
    remove(id) {
      const s = socialState(), ch = s.challenges.find((c) => c.id === id);
      if (!ch) return false;
      const before = s.challenges.length;
      s.challenges = s.challenges.filter((c) => ch.gid ? c.gid !== ch.gid : c.id !== id);
      if (s.challenges.length === before) return false;
      challengeChanged();
      return true;
    },
    clearNotices() {
      const s = socialState();
      const isNotice = (c) => (c.dir === "in" && c.status === "pending") || c.status === "accepted";
      const gids = new Set(s.challenges.filter((c) => isNotice(c) && c.gid).map((c) => c.gid));
      const before = s.challenges.length;
      s.challenges = s.challenges.filter((c) => !isNotice(c) && !(c.gid && gids.has(c.gid)));
      const removed = before - s.challenges.length;
      if (removed) challengeChanged();
      return removed;
    },
    createGroup(fids, n) {
      if (!isPremium()) return [];
      const s = socialState(), gid = uid("gp"), seed = Math.floor(Math.random() * 2147483647), made = [], skipped = [];
      [...new Set(fids)].forEach((fid) => {
        const f = friendById(fid);
        if (!f || !friendOnline(f)) { skipped.push(f ? f.name : fid); return; }
        if (s.challenges.some((c) => c.dir === "out" && c.fid === fid && (c.status === "pending" || c.status === "accepted"))) { skipped.push(f.name); return; }
        made.push({ id: uid("ch"), dir: "out", fid, n, seed, gid, ts: Date.now(), status: "pending", replyAt: Date.now() + 3e3 + Math.random() * 5e3, my: null, their: null, lesson: "s1a-1" });
      });
      if (!made.length) { toast("Không gửi được: các bạn đã chọn đang offline hoặc đang có lời thách đấu chưa xong"); return []; }
      made.reverse().forEach((c) => s.challenges.unshift(c));
      if (s.challenges.length > 40) s.challenges.length = 40;
      if (skipped.length) toast(`Bỏ qua: ${skipped.join(", ")}`);
      challengeChanged();
      return made;
    },
    finishGroup(gid, my, kinds) {
      const s = socialState();
      const all = s.challenges.filter((c) => c.gid === gid && c.dir === "out");
      const acc = all.filter((c) => c.status === "accepted");
      if (!acc.length) return null;
      all.forEach((c) => { if (c.status === "pending") c.status = "expired"; });
      const rows = acc.map((c) => { CH.finish(c.id, my, kinds, true); const f = friendById(c.fid); return { id: c.fid, name: f.name, ...c.their, me: false }; });
      const board = [{ id: "me", name: state.userName, ...my, me: true }, ...rows]
        .sort((a, b) => b.score - a.score || a.ms - b.ms).map((r, i) => ({ ...r, rank: i + 1 }));
      const mine = board.find((r) => r.me), size = board.length;
      acc.forEach((c) => { c.grp = { rank: mine.rank, size }; });
      s.points += mine.rank === 1 ? 40 : mine.rank === 2 ? 25 : mine.rank === 3 ? 15 : 0;
      notify(["\u{1F947}", "\u{1F948}", "\u{1F949}"][mine.rank - 1] || "\u{1F3C1}", `Thách đấu nhóm: bạn đứng hạng ${mine.rank}/${size}`);
      challengeChanged();
      return { gid, n: acc[0].n, board, size, rank: mine.rank };
    },
    finish(id, my, kinds, quiet) {
      const ch = CH.get(id);
      if (!ch || ch.status !== "accepted") return null;
      const s = socialState(), f = friendById(ch.fid);
      ch.my = my;
      ch.their = simulateOpponent(ch, kinds);
      ch.status = "done";
      const r = s.record[ch.fid] || (s.record[ch.fid] = { w: 0, l: 0, d: 0 });
      if (my.score > ch.their.score) { r.w++; s.points += 30; } else if (my.score < ch.their.score) { r.l++; s.points += 5; } else { r.d++; s.points += 15; }
      s.points += Math.round(my.score / 100);
      if (!quiet) notify("⚔️", `Kết quả thách đấu với ${f.name}: ${my.score} - ${ch.their.score}`);
      challengeChanged();
      return ch;
    },
    scoreQ, limits: Q_LIMIT
  };
