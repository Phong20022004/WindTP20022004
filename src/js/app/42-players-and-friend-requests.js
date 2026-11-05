/*@file js/app/42-players-and-friend-requests.js
 * v48: dữ liệu người chơi dùng chung (game ↔ WINDTP) và lời mời kết bạn.
 */
  // ===== v48: dữ liệu người chơi dùng chung (game ↔ WINDTP) + lời mời kết bạn =====
  var FEM_N = ["Hà", "Lan", "Thảo", "Mai", "Linh", "Vy", "Trang", "Ngân", "Yến", "Hân", "Thư", "An"];
  var MAL_N = ["Minh", "Phúc", "Nam", "Hùng", "Tú", "Đạt", "Quân", "Bảo", "Khoa", "Phát", "Duy", "Lộc", "Huy"];
  var REALM_W = [25, 20, 16, 12, 10, 7, 5, 3, 2];
  function nameHash(s) { let h = 2166136261; for (const ch of String(s)) { h ^= ch.codePointAt(0); h = Math.imul(h, 16777619); } return h >>> 0; }
  var GID_CACHE = new Map();
  function gameFriendId(n) {
    const k = String(n || "").trim().slice(0, 40); let v = GID_CACHE.get(k);
    if (v === undefined) { v = "fr-g-" + nameHash(k).toString(36); if (GID_CACHE.size > 2000) GID_CACHE.clear(); GID_CACHE.set(k, v); }
    return v;
  }
  function givenKey(n) { return norm(String(n || "").trim().split(/\s+/).pop()); }
  function friendByName(name) {
    restoreGameFriends();
    name = String(name || "").trim(); if (!name) return null;
    if (/^fr-/.test(name)) return FRIENDS.find((f) => f.id === name) || FRIENDS.find((f) => gameFriendId(f.name) === name) || null;
    const gid = gameFriendId(name);
    return FRIENDS.find((f) => f.id === gid) || FRIENDS.find((f) => gameFriendId(f.name) === gid) || null;
  }
  function playerInfo(name) {
    name = String(name || "").trim();
    const f = friendByName(name), h = nameHash("wind|" + (f ? f.name : name)), top = Math.min(CULTIVATION_RANKS.length, REALM_W.length);
    const meta = f ? (FRIEND_META[f.id] || []) : [];
    const first = (f ? f.name : name).split(/\s+/).pop();
    const gender = meta[0] || (FEM_N.includes(first) ? "nu" : MAL_N.includes(first) ? "nam" : (h & 1 ? "nu" : "nam"));
    const age = Number(meta[1]) || 18 + ((h >>> 3) % 23);
    let realm;
    if (f) realm = Math.max(0, Math.min(top - 1, Number(f.realm) || 0));
    else { let x = (h >>> 9) % 100; realm = 0; for (let i = 0; i < top; i++) { if (x < REALM_W[i]) { realm = i; break; } x -= REALM_W[i]; } }
    return { name: f ? f.name : name, gender, age, realm, realmName: CULTIVATION_RANKS[realm].name, friend: !!f, friendId: f ? f.id : "" };
  }
  function reqList() { const s = socialState(); if (!Array.isArray(s.friendReq)) s.friendReq = []; return s.friendReq; }
  function friendStatus(name) {
    name = String(name || "").trim(); if (!name) return "";
    if (friendByName(name)) return "friend";
    const gid = /^fr-/.test(name) ? name : gameFriendId(name);
    return reqList().some((r) => (r.id || gameFriendId(r.name)) === gid) ? "pending" : "";
  }
  function requestFriend(name, meta) {
    try {
      name = String(name || "").trim().slice(0, 40); if (!name) return { ok: false };
      meta = meta || {};
      const pid = gameFriendId(name); // ID tính từ tên; ID game gửi lên (meta.id) chỉ dùng để đối chiếu
      const st = friendStatus(pid);
      if (st) return { ok: true, status: st, already: true };
      const info = playerInfo(name), h = nameHash(name + "|req" + Math.floor(Date.now() / 36e5)), now = Date.now();
      meta = meta || {};
      reqList().push({ id: pid, name, meta: { g: meta.g || info.gender, age: Number(meta.age) || info.age, realm: meta.realm != null ? meta.realm : info.realm }, ts: now, due: now + 3000 + (h % 7000), accept: (h >>> 7) % 100 < 85 });
      notify("🤝", `Đã gửi lời mời kết bạn tới ${name}`);
      commit();
      return { ok: true, status: "pending" };
    } catch (e) { return { ok: false }; }
  }
  function friendReqTick() {
    try {
      const a = reqList(); if (!a.length) return;
      const now = Date.now(); let ch = false;
      a.slice().forEach((r) => {
        if (now < r.due) return;
        a.splice(a.indexOf(r), 1); ch = true;
        if (r.accept) { addGameFriend(r.name, r.meta); state.invited = (state.invited || []).filter((id) => { const d = FRIEND_DIR.find((x) => x.id === id); return !(d && gameFriendId(d.name) === r.id); }); notify("🤝", `${r.name} đã chấp nhận lời mời kết bạn`); if (!bblEl) toast(`🤝 ${r.name} đã chấp nhận lời mời kết bạn`); }
        else { notify("⏳", `${r.name} chưa phản hồi lời mời kết bạn`); if (!bblEl) toast(`${r.name} chưa phản hồi lời mời kết bạn`); }
      });
      if (ch) { commit(); refreshFriends(); try { const w = bblEl && bblEl.querySelector("iframe").contentWindow; if (w && w.__bblFriendSync) w.__bblFriendSync(); } catch (e) { } }
    } catch (e) { }
  }
