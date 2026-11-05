/*@file js/app/02-data-config-courses-seeds.js
 * Tiền tệ, mức thưởng, gói khóa học/sản phẩm, dữ liệu mẫu tin đăng và bài cộng đồng.
 */
  var CURRENCIES = {
    VND: { symbol: "\u20AB", name: "Vi\u1EC7t Nam \u0111\u1ED3ng", flag: "\u{1F1FB}\u{1F1F3}", methods: ["Chuy\u1EC3n kho\u1EA3n ng\u00E2n h\u00E0ng", "V\u00ED \u0111i\u1EC7n t\u1EED"] },
    KRW: { symbol: "\u20A9", name: "Won H\xE0n Qu\u1ED1c", flag: "\u{1F1F0}\u{1F1F7}", methods: ["Th\u1EBB t\xEDn d\u1EE5ng / ghi n\u1EE3", "Kakao Pay", "Naver Pay"] },
    JPY: { symbol: "\xA5", name: "Y\xEAn Nh\u1EADt", flag: "\u{1F1EF}\u{1F1F5}", methods: ["Th\u1EBB t\xEDn d\u1EE5ng / ghi n\u1EE3", "PayPay", "LINE Pay"] }
  };
  function money(n, cur) {
    if (cur === "XU") return Math.round(n).toLocaleString("en-US") + " Xu";
    return `${CURRENCIES[cur].symbol}${Math.round(n).toLocaleString("en-US")}`;
  }
  var LOGIN_REWARD = 150;
  var SHOP_REWARD = 1e4;
  var SHOP_BIG_REWARD = 5e4;
  var SHOP_BIG_THRESHOLD = 5e4;
  var GAME_REWARD = 150;
  var DOC_PRICE = 1e5;
  var POST_REWARD = 150;
  var LANG_VOICE = { vi: "vi-VN", en: "en-US", ko: "ko-KR", ja: "ja-JP", "zh-CN": "zh-CN", fr: "fr-FR", de: "de-DE", es: "es-ES" };
  var LIFE_TS = 4102444800000;
  var COURSE_PLANS = [
    { id: "1m", label: "1 tháng", months: 1, vnd: 100000, chips: 10000 },
    { id: "3m", label: "Combo 3 tháng", months: 3, vnd: 285000, chips: 30000 },
    { id: "6m", label: "Combo 6 tháng", months: 6, vnd: 550000, chips: 60000 },
    { id: "12m", label: "Combo 12 tháng", months: 12, vnd: 1000000, chips: 100000 },
    { id: "24m", label: "Combo 24 tháng", months: 24, vnd: 1700000, chips: 200000 },
    { id: "life", label: "Mua vĩnh viễn", months: 0, life: true, vnd: 2000000, chips: 500000 }
  ];
  function courseProducts() {
    const out = [];
    LANGUAGES.forEach((l) => COURSE_PLANS.forEach((pl) => out.push({
      id: "cr-" + l.code + "-" + pl.id, plan: pl.id, lang: l.code, cat: "study", sub: "Khóa học", emoji: l.flag,
      name: "Khóa học " + l.name + " · " + pl.label,
      desc: (pl.life ? "Premium trọn đời" : "Premium " + pl.months + " tháng") + " + " + pl.chips.toLocaleString("en-US") + " chip",
      price: { VND: pl.vnd, KRW: Math.max(100, Math.round(pl.vnd / 19 / 100) * 100), JPY: Math.max(10, Math.round(pl.vnd / 160 / 10) * 10) }
    })));
    LANGUAGES.forEach((l) => out.push({
      id: "docm-" + l.code, docOf: l.code, cat: "study", sub: "Tài liệu", emoji: l.flag,
      name: "Tài liệu tổng hợp " + l.name, desc: "Từ vựng và ngữ pháp " + l.name + " · file .txt",
      price: { VND: DOC_PRICE, KRW: Math.max(100, Math.round(DOC_PRICE / 19 / 100) * 100), JPY: Math.max(10, Math.round(DOC_PRICE / 160 / 10) * 10) }
    }));
    return out;
  }
  var PRODUCTS = courseProducts();
  var COURSES = [];
  function seedListings(now) {
    const m = 6e4;
    return [
      { id: "l-macbook", cat: "market", title: "MacBook Air M1 RAM 8G SSD 256G", price: "12,500,000 VN\u0110", loc: "\u0110\u1ED1ng \u0110a, H\xE0 N\u1ED9i", ts: now - 2 * m, desc: "M\xE1y like new, pin c\xF2n t\u1ED1t, \u0111\u1EA7y \u0111\u1EE7 s\u1EA1c. Xem m\xE1y tr\u1EF1c ti\u1EBFp t\u1EA1i \u0110\u1ED1ng \u0110a.", seller: "Minh Qu\xE2n", img: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=200&q=80", emoji: "\u{1F4BB}" },
      { id: "l-wave", cat: "market", title: "Xe Honda Wave Alpha 2022 Ch\xEDnh Ch\u1EE7", price: "14,200,000 VN\u0110", loc: "TP. H\u1ED3 Ch\xED Minh", ts: now - 60 * m, desc: "Xe ch\xEDnh ch\u1EE7, gi\u1EA5y t\u1EDD \u0111\u1EA7y \u0111\u1EE7, b\u1EA3o d\u01B0\u1EE1ng \u0111\u1ECBnh k\u1EF3. \u01AFu ti\xEAn giao d\u1ECBch tr\u1EF1c ti\u1EBFp.", seller: "Thu H\xE0", img: "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=200&q=80", emoji: "\u{1F6F5}" },
      { id: "l-books", cat: "market", title: "Tr\u1ECDn B\u1ED9 Gi\xE1o Tr\xECnh Minna no Nihongo N5", price: "350,000 VN\u0110", loc: "Th\u1EE7 \u0110\u1EE9c, TP.HCM", ts: now - 5 * 60 * m, desc: "S\xE1ch c\xF2n m\u1EDBi 90%, k\xE8m CD v\xE0 s\xE1ch b\xE0i t\u1EADp.", seller: "B\u1EA3o Ng\u1ECDc", emoji: "\u{1F4D7}" },
      { id: "l-tutor", cat: "jobs", title: "Gia S\u01B0 Ti\u1EBFng Anh Part-Time C\u1EA7u Gi\u1EA5y", price: "150,000 VN\u0110 / Gi\u1EDD", loc: "C\u1EA7u Gi\u1EA5y, H\xE0 N\u1ED9i", ts: now - 30 * m, desc: "D\u1EA1y k\xE8m h\u1ECDc sinh c\u1EA5p 2, 3 bu\u1ED5i m\u1ED7i tu\u1EA7n. Y\xEAu c\u1EA7u TOEIC 700+ ho\u1EB7c t\u01B0\u01A1ng \u0111\u01B0\u01A1ng.", seller: "Trung t\xE2m Sao Mai", emoji: "\u{1F4BC}" },
      { id: "l-cafe", cat: "jobs", title: "Ph\u1EE5c V\u1EE5 Qu\xE1n C\xE0 Ph\xEA Ca T\u1ED1i", price: "28,000 VN\u0110 / Gi\u1EDD", loc: "Qu\u1EADn 1, TP.HCM", ts: now - 3 * 60 * m, desc: "Ca 17h \u2013 22h, \u01B0u ti\xEAn sinh vi\xEAn, c\xF3 h\u1ED7 tr\u1EE3 b\u1EEFa \u0103n.", seller: "C\xE0 ph\xEA G\xF3c Ph\u1ED1", emoji: "\u2615" },
      { id: "l-room", cat: "housing", title: "Nh\u01B0\u1EE3ng Ph\xF2ng Tr\u1ECD Kh\xE9p K\xEDn Full \u0110\u1ED3", price: "3,200,000 VN\u0110 / Th\xE1ng", loc: "Qu\u1EADn 10, TP.HCM", ts: now - 60 * m, desc: "Ph\xF2ng 25m\xB2, c\xF3 g\xE1c, \u0111i\u1EC1u h\xF2a, n\xF3ng l\u1EA1nh. G\u1EA7n c\xE1c tr\u01B0\u1EDDng \u0111\u1EA1i h\u1ECDc.", seller: "Anh Tu\u1EA5n", img: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=200&q=80", emoji: "\u{1F3E0}" },
      { id: "l-share", cat: "housing", title: "T\xECm B\u1EA1n \u1EDE Gh\xE9p Qu\u1EADn C\u1EA7u Gi\u1EA5y", price: "1,800,000 VN\u0110 / Th\xE1ng", loc: "C\u1EA7u Gi\u1EA5y, H\xE0 N\u1ED9i", ts: now - 8 * 60 * m, desc: "Ph\xF2ng 2 ng\u01B0\u1EDDi, \u01B0u ti\xEAn n\u1EEF sinh vi\xEAn, gi\u1EDD gi\u1EA5c tho\u1EA3i m\xE1i.", seller: "Kh\xE1nh Linh", emoji: "\u{1F6CF}\uFE0F" }
    ];
  }
  function seedPosts(now) {
    const m = 6e4;
    return [
      { id: "po-1", author: "Tr\u1EA7n Th\u1ECB B", tag: "TOEIC", text: "C\xF3 ai \u0111ang \xF4n thi TOEIC Listening Part 3 kh\xF4ng cho m\xECnh xin b\u1ED9 t\xE0i li\u1EC7u ghi ch\xFA b\u1EABy hay g\u1EB7p v\u1EDBi \u1EA1! C\u1EA3m \u01A1n m\u1ECDi ng\u01B0\u1EDDi nhi\u1EC1u \u2764\uFE0F", ts: now - m, likes: 24, liked: false, status: "approved", comments: [
        { id: "c-1", author: "L\xEA Minh", text: "B\u1EA1n th\u1EED xem kho t\xE0i li\u1EC7u b\xEAn m\u1EE5c Ti\u1EC7n \xEDch nh\xE9.", ts: now - 30 * m }
      ] },
      { id: "po-2", author: "Ph\u1EA1m Gia Huy", tag: "HSK", text: "M\xECnh m\u1EDBi \u0111\u1EA1t HSK 4 sau 5 th\xE1ng, b\xED quy\u1EBFt l\xE0 \xF4n flashcard 20 ph\xFAt m\u1ED7i s\xE1ng. Ai c\u1EA7n l\u1ED9 tr\xECnh th\xEC h\u1ECFi nh\xE9!", ts: now - 120 * m, likes: 41, liked: false, status: "approved", comments: [] },
      { id: "po-3", author: "\u0110\u1ED7 Th\u1EA3o Vy", tag: "JLPT", text: "Nh\xF3m luy\u1EC7n n\xF3i ti\u1EBFng Nh\u1EADt t\u1ED1i th\u1EE9 B\u1EA3y c\xF2n 3 ch\u1ED7, b\u1EA1n n\xE0o N5 \u2013 N4 v\xE0o gh\xE9p \u0111\xF4i nh\xE9.", ts: now - 6 * 60 * m, likes: 17, liked: false, status: "approved", comments: [] }
    ];
  }
  var LEVELS = ["M\u1EDBi b\u1EAFt \u0111\u1EA7u", "C\u01A1 b\u1EA3n", "Trung c\u1EA5p", "N\xE2ng cao"];
  var GOALS = ["Giao ti\u1EBFp", "Thi ch\u1EE9ng ch\u1EC9", "Du h\u1ECDc", "C\xF4ng vi\u1EC7c"];
  var PARTNERS = [
    { id: "pt-1", name: "Ho\xE0ng Nam", lang: "en", level: 1, goal: "Thi ch\u1EE9ng ch\u1EC9", bio: "\u0110ang \xF4n TOEIC, mu\u1ED1n luy\u1EC7n nghe m\u1ED7i t\u1ED1i." },
    { id: "pt-2", name: "Mai Anh", lang: "en", level: 2, goal: "C\xF4ng vi\u1EC7c", bio: "L\xE0m marketing, c\u1EA7n ti\u1EBFng Anh h\u1ECDp h\u1EB1ng tu\u1EA7n." },
    { id: "pt-3", name: "Qu\u1ED1c B\u1EA3o", lang: "en", level: 3, goal: "Du h\u1ECDc", bio: "Chu\u1EA9n b\u1ECB IELTS 7.0 \u0111i \xDAc." },
    { id: "pt-4", name: "Thanh H\u1EB1ng", lang: "zh", level: 1, goal: "Giao ti\u1EBFp", bio: "Th\xEDch phim Hoa ng\u1EEF, h\u1ECDc \u0111\u1EC3 hi\u1EC3u kh\xF4ng c\u1EA7n ph\u1EE5 \u0111\u1EC1." },
    { id: "pt-5", name: "Vi\u1EC7t C\u01B0\u1EDDng", lang: "zh", level: 2, goal: "Thi ch\u1EE9ng ch\u1EC9", bio: "\u0110ang \xF4n HSK 4." },
    { id: "pt-6", name: "Y\u1EBFn Nhi", lang: "ja", level: 0, goal: "Giao ti\u1EBFp", bio: "M\u1EDBi h\u1ECDc b\u1EA3ng ch\u1EEF c\xE1i, c\u1EA7n b\u1EA1n nh\u1EAFc h\u1ECDc \u0111\u1EC1u." },
    { id: "pt-7", name: "\u0110\u1EE9c Th\u1ECBnh", lang: "ja", level: 1, goal: "C\xF4ng vi\u1EC7c", bio: "Chu\u1EA9n b\u1ECB \u0111i th\u1EF1c t\u1EADp sinh Nh\u1EADt." },
    { id: "pt-8", name: "H\u1EA3i Y\u1EBFn", lang: "ko", level: 1, goal: "Giao ti\u1EBFp", bio: "M\xEA nh\u1EA1c H\xE0n, luy\u1EC7n n\xF3i m\u1ED7i cu\u1ED1i tu\u1EA7n." },
    { id: "pt-9", name: "Tu\u1EA5n Ki\u1EC7t", lang: "ko", level: 2, goal: "Thi ch\u1EE9ng ch\u1EC9", bio: "\u0110ang \xF4n TOPIK II." },
    { id: "pt-10", name: "Ng\u1ECDc Lan", lang: "de", level: 0, goal: "Du h\u1ECDc", bio: "B\u1EAFt \u0111\u1EA7u A1, d\u1EF1 \u0111\u1ECBnh du h\u1ECDc ngh\u1EC1 t\u1EA1i \u0110\u1EE9c." },
    { id: "pt-11", name: "B\u1EA3o Ch\xE2u", lang: "de", level: 1, goal: "Thi ch\u1EE9ng ch\u1EC9", bio: "\xD4n A2 \u0111\u1EC3 thi Goethe." },
    { id: "pt-12", name: "Ph\u01B0\u01A1ng Linh", lang: "fr", level: 1, goal: "Giao ti\u1EBFp", bio: "Th\xEDch \u1EA9m th\u1EF1c Ph\xE1p, h\u1ECDc \u0111\u1EC3 \u0111i du l\u1ECBch." },
    { id: "pt-13", name: "Anh Khoa", lang: "fr", level: 2, goal: "Du h\u1ECDc", bio: "\xD4n DELF B1 \u0111\u1EC3 n\u1ED9p h\u1ECDc b\u1ED5ng." },
    { id: "pt-14", name: "Di\u1EC7u Linh", lang: "es", level: 0, goal: "Giao ti\u1EBFp", bio: "H\u1ECDc v\xEC th\xEDch b\xF3ng \u0111\xE1 v\xE0 \xE2m nh\u1EA1c Latin." },
    { id: "pt-15", name: "Gia B\u1EA3o", lang: "es", level: 2, goal: "C\xF4ng vi\u1EC7c", bio: "L\xE0m xu\u1EA5t kh\u1EA9u, c\u1EA7n giao d\u1ECBch v\u1EDBi \u0111\u1ED1i t\xE1c Mexico." }
  ];

