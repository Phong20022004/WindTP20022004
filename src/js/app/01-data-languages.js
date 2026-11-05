/*@file js/app/01-data-languages.js
 * Dữ liệu 7 ngôn ngữ (LANGUAGES): từ vựng, ngữ pháp, hội thoại, câu hỏi mẫu.
 */
  // src/data.ts
  var LANGUAGES = [
    {
      code: "en",
      name: "Ti\u1EBFng Anh",
      flag: "\u{1F1EC}\u{1F1E7}",
      vocab: [
        { term: "negotiate", reading: "/n\u026A\u02C8\u0261o\u028A\u0283ie\u026At/", meaning: "\u0111\xE0m ph\xE1n", example: "We need to negotiate the contract.", exampleVi: "Ch\xFAng ta c\u1EA7n \u0111\xE0m ph\xE1n h\u1EE3p \u0111\u1ED3ng." },
        { term: "deadline", reading: "/\u02C8dedla\u026An/", meaning: "h\u1EA1n ch\xF3t", example: "The deadline is Friday.", exampleVi: "H\u1EA1n ch\xF3t l\xE0 th\u1EE9 S\xE1u." },
        { term: "invoice", reading: "/\u02C8\u026Anv\u0254\u026As/", meaning: "h\xF3a \u0111\u01A1n", example: "Please send me the invoice.", exampleVi: "Vui l\xF2ng g\u1EEDi cho t\xF4i h\xF3a \u0111\u01A1n." },
        { term: "schedule", reading: "/\u02C8sked\u0292u\u02D0l/", meaning: "l\u1ECBch tr\xECnh", example: "Let me check my schedule.", exampleVi: "\u0110\u1EC3 t\xF4i xem l\u1ECBch tr\xECnh c\u1EE7a m\xECnh." },
        { term: "recommend", reading: "/\u02CCrek\u0259\u02C8mend/", meaning: "gi\u1EDBi thi\u1EC7u, \u0111\u1EC1 xu\u1EA5t", example: "I recommend this hotel.", exampleVi: "T\xF4i gi\u1EDBi thi\u1EC7u kh\xE1ch s\u1EA1n n\xE0y." },
        { term: "available", reading: "/\u0259\u02C8ve\u026Al\u0259bl/", meaning: "c\xF3 s\u1EB5n, r\u1EA3nh", example: "Is the manager available?", exampleVi: "Qu\u1EA3n l\xFD c\xF3 r\u1EA3nh kh\xF4ng?" }
      ],
      grammar: [
        { title: "Hi\u1EC7n t\u1EA1i ho\xE0n th\xE0nh", pattern: "have/has + V3", explain: "Di\u1EC5n t\u1EA3 h\xE0nh \u0111\u1ED9ng b\u1EAFt \u0111\u1EA7u trong qu\xE1 kh\u1EE9 v\xE0 c\xF2n li\xEAn quan \u0111\u1EBFn hi\u1EC7n t\u1EA1i.", example: "I have worked here for three years.", exampleVi: "T\xF4i \u0111\xE3 l\xE0m vi\u1EC7c \u1EDF \u0111\xE2y \u0111\u01B0\u1EE3c ba n\u0103m." },
        { title: "C\xE2u \u0111i\u1EC1u ki\u1EC7n lo\u1EA1i 1", pattern: "If + hi\u1EC7n t\u1EA1i \u0111\u01A1n, will + V", explain: "N\xF3i v\u1EC1 \u0111i\u1EC1u c\xF3 th\u1EC3 x\u1EA3y ra \u1EDF hi\u1EC7n t\u1EA1i ho\u1EB7c t\u01B0\u01A1ng lai.", example: "If it rains, we will stay home.", exampleVi: "N\u1EBFu tr\u1EDDi m\u01B0a, ch\xFAng ta s\u1EBD \u1EDF nh\xE0." },
        { title: "C\xE2u b\u1ECB \u0111\u1ED9ng", pattern: "be + V3", explain: "Nh\u1EA5n m\u1EA1nh \u0111\u1ED1i t\u01B0\u1EE3ng ch\u1ECBu t\xE1c \u0111\u1ED9ng c\u1EE7a h\xE0nh \u0111\u1ED9ng.", example: "The report was finished yesterday.", exampleVi: "B\u1EA3n b\xE1o c\xE1o \u0111\xE3 \u0111\u01B0\u1EE3c ho\xE0n th\xE0nh h\xF4m qua." }
      ],
      dialogs: [
        { scene: "T\u1EA1i qu\xE1n c\xE0 ph\xEA", line: "What can I get for you?", lineVi: "B\u1EA1n mu\u1ED1n d\xF9ng g\xEC \u1EA1?", options: [
          { text: "I'd like a latte, please.", correct: true },
          { text: "I am fine, thank you.", correct: false },
          { text: "Yesterday I go there.", correct: false }
        ] },
        { scene: "H\u1ECFi \u0111\u01B0\u1EDDng", line: "Excuse me, how do I get to the station?", lineVi: "Xin l\u1ED7i, \u0111\u1EBFn nh\xE0 ga \u0111i th\u1EBF n\xE0o \u1EA1?", options: [
          { text: "Go straight and turn left at the corner.", correct: true },
          { text: "I have eaten lunch.", correct: false },
          { text: "It is a blue shirt.", correct: false }
        ] }
      ],
      certs: [
        { id: "toeic", name: "TOEIC", sub: "Nghe & \u0110\u1ECDc hi\u1EC3u", tone: "sky", desc: "Ch\u1EE9ng ch\u1EC9 ti\u1EBFng Anh giao ti\u1EBFp trong m\xF4i tr\u01B0\u1EDDng c\xF4ng s\u1EDF qu\u1ED1c t\u1EBF.", structure: ["Listening: 100 c\xE2u, 45 ph\xFAt", "Reading: 100 c\xE2u, 75 ph\xFAt", "Thang \u0111i\u1EC3m 10 \u2013 990"], levels: "T\u1ED5ng \u0111i\u1EC3m 10 \u2013 990" },
        { id: "ielts", name: "IELTS", sub: "Academic / General", tone: "indigo", desc: "Ch\u1EE9ng ch\u1EC9 ph\u1EE5c v\u1EE5 du h\u1ECDc v\xE0 \u0111\u1ECBnh c\u01B0, \u0111\xE1nh gi\xE1 \u0111\u1EE7 b\u1ED1n k\u1EF9 n\u0103ng.", structure: ["Listening, Reading, Writing, Speaking", "Academic ho\u1EB7c General Training", "Thang band 0 \u2013 9"], levels: "Band 0 \u2013 9" }
      ]
    },
    {
      code: "zh",
      name: "Ti\u1EBFng Trung",
      flag: "\u{1F1E8}\u{1F1F3}",
      vocab: [
        { term: "\u4F60\u597D", reading: "n\u01D0 h\u01CEo", meaning: "xin ch\xE0o", example: "\u4F60\u597D\uFF0C\u5F88\u9AD8\u5174\u8BA4\u8BC6\u4F60\u3002", exampleVi: "Xin ch\xE0o, r\u1EA5t vui \u0111\u01B0\u1EE3c quen b\u1EA1n." },
        { term: "\u8C22\u8C22", reading: "xi\xE8xie", meaning: "c\u1EA3m \u01A1n", example: "\u8C22\u8C22\u4F60\u7684\u5E2E\u52A9\u3002", exampleVi: "C\u1EA3m \u01A1n s\u1EF1 gi\xFAp \u0111\u1EE1 c\u1EE7a b\u1EA1n." },
        { term: "\u5B66\u4E60", reading: "xu\xE9x\xED", meaning: "h\u1ECDc t\u1EADp", example: "\u6211\u6BCF\u5929\u5B66\u4E60\u6C49\u8BED\u3002", exampleVi: "M\u1ED7i ng\xE0y t\xF4i h\u1ECDc ti\u1EBFng Trung." },
        { term: "\u670B\u53CB", reading: "p\xE9ngyou", meaning: "b\u1EA1n b\xE8", example: "\u4ED6\u662F\u6211\u7684\u597D\u670B\u53CB\u3002", exampleVi: "Anh \u1EA5y l\xE0 b\u1EA1n t\u1ED1t c\u1EE7a t\xF4i." },
        { term: "\u5DE5\u4F5C", reading: "g\u014Dngzu\xF2", meaning: "c\xF4ng vi\u1EC7c", example: "\u6211\u7684\u5DE5\u4F5C\u5F88\u5FD9\u3002", exampleVi: "C\xF4ng vi\u1EC7c c\u1EE7a t\xF4i r\u1EA5t b\u1EADn." },
        { term: "\u660E\u5929", reading: "m\xEDngti\u0101n", meaning: "ng\xE0y mai", example: "\u660E\u5929\u89C1\uFF01", exampleVi: "Mai g\u1EB7p nh\xE9!" }
      ],
      grammar: [
        { title: "C\xE2u ch\u1EEF \u628A", pattern: "S + \u628A + O + V + th\xE0nh ph\u1EA7n kh\xE1c", explain: "\u0110\u01B0a t\xE2n ng\u1EEF l\xEAn tr\u01B0\u1EDBc \u0111\u1ED9ng t\u1EEB \u0111\u1EC3 nh\u1EA5n m\u1EA1nh k\u1EBFt qu\u1EA3 x\u1EED l\xFD t\xE2n ng\u1EEF.", example: "\u6211\u628A\u4E66\u653E\u5728\u684C\u5B50\u4E0A\u3002", exampleVi: "T\xF4i \u0111\u1EB7t quy\u1EC3n s\xE1ch l\xEAn b\xE0n." },
        { title: "Tr\u1EE3 t\u1EEB \u4E86", pattern: "V + \u4E86", explain: "Bi\u1EC3u th\u1ECB h\xE0nh \u0111\u1ED9ng \u0111\xE3 ho\xE0n th\xE0nh.", example: "\u6211\u5403\u4E86\u65E9\u996D\u3002", exampleVi: "T\xF4i \u0111\xE3 \u0103n s\xE1ng r\u1ED3i." },
        { title: "Nguy\xEAn nh\xE2n \u2013 k\u1EBFt qu\u1EA3", pattern: "\u56E0\u4E3A\u2026\u2026\u6240\u4EE5\u2026\u2026", explain: "N\u1ED1i hai v\u1EBF ch\u1EC9 nguy\xEAn nh\xE2n v\xE0 k\u1EBFt qu\u1EA3.", example: "\u56E0\u4E3A\u4E0B\u96E8\uFF0C\u6240\u4EE5\u6211\u6CA1\u53BB\u3002", exampleVi: "V\xEC tr\u1EDDi m\u01B0a n\xEAn t\xF4i kh\xF4ng \u0111i." }
      ],
      dialogs: [
        { scene: "T\u1EA1i nh\xE0 h\xE0ng", line: "\u4F60\u60F3\u5403\u4EC0\u4E48\uFF1F", lineVi: "B\u1EA1n mu\u1ED1n \u0103n g\xEC?", options: [
          { text: "\u6211\u60F3\u5403\u9762\u6761\u3002", correct: true },
          { text: "\u6211\u5F88\u597D\uFF0C\u8C22\u8C22\u3002", correct: false },
          { text: "\u4ED6\u662F\u8001\u5E08\u3002", correct: false }
        ] },
        { scene: "H\u1ECFi \u0111\u01B0\u1EDDng", line: "\u8BF7\u95EE\uFF0C\u5730\u94C1\u7AD9\u5728\u54EA\u513F\uFF1F", lineVi: "Xin h\u1ECFi, ga t\xE0u \u0111i\u1EC7n ng\u1EA7m \u1EDF \u0111\xE2u?", options: [
          { text: "\u4E00\u76F4\u8D70\uFF0C\u7136\u540E\u53F3\u8F6C\u3002", correct: true },
          { text: "\u6211\u559C\u6B22\u82F9\u679C\u3002", correct: false },
          { text: "\u73B0\u5728\u4E09\u70B9\u3002", correct: false }
        ] }
      ],
      certs: [
        { id: "hsk", name: "HSK 1 \u2013 6", sub: "Chu\u1EA9n H\xE1n ng\u1EEF", tone: "emerald", desc: "K\u1EF3 thi n\u0103ng l\u1EF1c H\xE1n ng\u1EEF chu\u1EA9n qu\u1ED1c t\u1EBF, chia c\u1EA5p \u0111\u1ED9 t\u1EEB s\u01A1 c\u1EA5p \u0111\u1EBFn cao c\u1EA5p.", structure: ["Nghe hi\u1EC3u", "\u0110\u1ECDc hi\u1EC3u", "Vi\u1EBFt (t\u1EEB HSK 3)"], levels: "C\u1EA5p 1 \u2013 6" }
      ]
    },
    {
      code: "ja",
      name: "Ti\u1EBFng Nh\u1EADt",
      flag: "\u{1F1EF}\u{1F1F5}",
      vocab: [
        { term: "\u6C34", reading: "mizu", meaning: "n\u01B0\u1EDBc", example: "\u6C34\u3092\u304F\u3060\u3055\u3044\u3002", exampleVi: "Cho t\xF4i xin n\u01B0\u1EDBc." },
        { term: "\u5B66\u6821", reading: "gakk\u014D", meaning: "tr\u01B0\u1EDDng h\u1ECDc", example: "\u5B66\u6821\u306B\u884C\u304D\u307E\u3059\u3002", exampleVi: "T\xF4i \u0111\u1EBFn tr\u01B0\u1EDDng." },
        { term: "\u6BCE\u65E5", reading: "mainichi", meaning: "m\u1ED7i ng\xE0y", example: "\u6BCE\u65E5\u65E5\u672C\u8A9E\u3092\u52C9\u5F37\u3057\u307E\u3059\u3002", exampleVi: "M\u1ED7i ng\xE0y t\xF4i h\u1ECDc ti\u1EBFng Nh\u1EADt." },
        { term: "\u5148\u751F", reading: "sensei", meaning: "gi\xE1o vi\xEAn", example: "\u5148\u751F\u306F\u512A\u3057\u3044\u3067\u3059\u3002", exampleVi: "Th\u1EA7y/c\xF4 gi\xE1o r\u1EA5t hi\u1EC1n." },
        { term: "\u98DF\u3079\u308B", reading: "taberu", meaning: "\u0103n", example: "\u3054\u98EF\u3092\u98DF\u3079\u307E\u3059\u3002", exampleVi: "T\xF4i \u0103n c\u01A1m." },
        { term: "\u5927\u304D\u3044", reading: "\u014Dkii", meaning: "to, l\u1EDBn", example: "\u5927\u304D\u3044\u72AC\u3067\u3059\u306D\u3002", exampleVi: "Con ch\xF3 to nh\u1EC9." }
      ],
      grammar: [
        { title: "Tr\u1EE3 t\u1EEB ch\u1EE7 \u0111\u1EC1 \u306F", pattern: "N1 \u306F N2 \u3067\u3059", explain: "Gi\u1EDBi thi\u1EC7u ch\u1EE7 \u0111\u1EC1 c\xE2u v\xE0 kh\u1EB3ng \u0111\u1ECBnh danh t\u1EEB.", example: "\u79C1\u306F\u5B66\u751F\u3067\u3059\u3002", exampleVi: "T\xF4i l\xE0 h\u1ECDc sinh." },
        { title: "Mu\u1ED1n l\xE0m g\xEC", pattern: "V(b\u1ECF \u307E\u3059) + \u305F\u3044\u3067\u3059", explain: "Di\u1EC5n \u0111\u1EA1t mong mu\u1ED1n c\u1EE7a ng\u01B0\u1EDDi n\xF3i.", example: "\u6C34\u3092\u98F2\u307F\u305F\u3044\u3067\u3059\u3002", exampleVi: "T\xF4i mu\u1ED1n u\u1ED1ng n\u01B0\u1EDBc." },
        { title: "\u0110ang l\xE0m g\xEC", pattern: "V(\u3066) + \u3044\u307E\u3059", explain: "H\xE0nh \u0111\u1ED9ng \u0111ang di\u1EC5n ra ho\u1EB7c tr\u1EA1ng th\xE1i k\xE9o d\xE0i.", example: "\u4ECA\u3001\u52C9\u5F37\u3057\u3066\u3044\u307E\u3059\u3002", exampleVi: "B\xE2y gi\u1EDD t\xF4i \u0111ang h\u1ECDc." }
      ],
      dialogs: [
        { scene: "G\u1ECDi \u0111\u1ED3 u\u1ED1ng", line: "\u4F55\u3092\u98F2\u307F\u307E\u3059\u304B\uFF1F", lineVi: "B\u1EA1n u\u1ED1ng g\xEC?", options: [
          { text: "\u30B3\u30FC\u30D2\u30FC\u3092\u304A\u9858\u3044\u3057\u307E\u3059\u3002", correct: true },
          { text: "\u306F\u3058\u3081\u307E\u3057\u3066\u3002", correct: false },
          { text: "\u5B66\u6821\u306F\u5927\u304D\u3044\u3067\u3059\u3002", correct: false }
        ] },
        { scene: "L\xE0m quen", line: "\u304A\u540D\u524D\u306F\u4F55\u3067\u3059\u304B\uFF1F", lineVi: "T\xEAn b\u1EA1n l\xE0 g\xEC?", options: [
          { text: "\u79C1\u306F\u7530\u4E2D\u3067\u3059\u3002", correct: true },
          { text: "\u304A\u3044\u3057\u3044\u3067\u3059\u3002", correct: false },
          { text: "\u3042\u3057\u305F\u884C\u304D\u307E\u3059\u3002", correct: false }
        ] }
      ],
      certs: [
        { id: "jlpt", name: "JLPT N5 \u2013 N1", sub: "N\u0103ng l\u1EF1c ti\u1EBFng Nh\u1EADt", tone: "rose", desc: "K\u1EF3 thi n\u0103ng l\u1EF1c ti\u1EBFng Nh\u1EADt, N5 l\xE0 c\u1EA5p d\u1EC5 nh\u1EA5t v\xE0 N1 l\xE0 c\u1EA5p cao nh\u1EA5t.", structure: ["Ki\u1EBFn th\u1EE9c ng\xF4n ng\u1EEF (ch\u1EEF, t\u1EEB v\u1EF1ng, ng\u1EEF ph\xE1p)", "\u0110\u1ECDc hi\u1EC3u", "Nghe hi\u1EC3u"], levels: "N5, N4, N3, N2, N1" }
      ]
    },
    {
      code: "ko",
      name: "Ti\u1EBFng H\xE0n",
      flag: "\u{1F1F0}\u{1F1F7}",
      vocab: [
        { term: "\uAC10\uC0AC\uD569\uB2C8\uB2E4", reading: "gamsahamnida", meaning: "c\u1EA3m \u01A1n (l\u1ECBch s\u1EF1)", example: "\uB3C4\uC640\uC8FC\uC154\uC11C \uAC10\uC0AC\uD569\uB2C8\uB2E4.", exampleVi: "C\u1EA3m \u01A1n v\xEC \u0111\xE3 gi\xFAp \u0111\u1EE1." },
        { term: "\uACF5\uBD80", reading: "gongbu", meaning: "vi\u1EC7c h\u1ECDc", example: "\uC800\uB294 \uB9E4\uC77C \uACF5\uBD80\uD574\uC694.", exampleVi: "T\xF4i h\u1ECDc m\u1ED7i ng\xE0y." },
        { term: "\uCE5C\uAD6C", reading: "chingu", meaning: "b\u1EA1n b\xE8", example: "\uCE5C\uAD6C\uB97C \uB9CC\uB098\uC694.", exampleVi: "T\xF4i g\u1EB7p b\u1EA1n." },
        { term: "\uB9DB\uC788\uB2E4", reading: "masitda", meaning: "ngon", example: "\uAE40\uCE58\uAC00 \uB9DB\uC788\uC5B4\uC694.", exampleVi: "Kim chi ngon." },
        { term: "\uCC45", reading: "chaek", meaning: "s\xE1ch", example: "\uCC45\uC744 \uC77D\uC5B4\uC694.", exampleVi: "T\xF4i \u0111\u1ECDc s\xE1ch." },
        { term: "\uB9E4\uC77C", reading: "maeil", meaning: "m\u1ED7i ng\xE0y", example: "\uB9E4\uC77C \uC6B4\uB3D9\uD574\uC694.", exampleVi: "T\xF4i t\u1EADp th\u1EC3 d\u1EE5c m\u1ED7i ng\xE0y." }
      ],
      grammar: [
        { title: "Tr\u1EE3 t\u1EEB ch\u1EE7 \u0111\u1EC1 \uC740/\uB294", pattern: "N + \uC740/\uB294 + N + \uC774\uC5D0\uC694/\uC608\uC694", explain: "D\xF9ng \uC740 sau ph\u1EE5 \xE2m cu\u1ED1i, \uB294 sau nguy\xEAn \xE2m.", example: "\uC800\uB294 \uD559\uC0DD\uC774\uC5D0\uC694.", exampleVi: "T\xF4i l\xE0 h\u1ECDc sinh." },
        { title: "Mu\u1ED1n l\xE0m g\xEC", pattern: "V + \uACE0 \uC2F6\uB2E4", explain: "Di\u1EC5n \u0111\u1EA1t mong mu\u1ED1n l\xE0m m\u1ED9t vi\u1EC7c.", example: "\uBB3C\uC744 \uB9C8\uC2DC\uACE0 \uC2F6\uC5B4\uC694.", exampleVi: "T\xF4i mu\u1ED1n u\u1ED1ng n\u01B0\u1EDBc." },
        { title: "\u0110u\xF4i c\xE2u l\u1ECBch s\u1EF1", pattern: "V + \uC544\uC694/\uC5B4\uC694", explain: "\u0110u\xF4i c\xE2u th\xE2n m\u1EADt l\u1ECBch s\u1EF1 d\xF9ng h\u1EB1ng ng\xE0y.", example: "\uD559\uAD50\uC5D0 \uAC00\uC694.", exampleVi: "T\xF4i \u0111\u1EBFn tr\u01B0\u1EDDng." }
      ],
      dialogs: [
        { scene: "T\u1EA1i qu\xE1n c\xE0 ph\xEA", line: "\uBB50 \uB4DC\uB9B4\uAE4C\uC694?", lineVi: "B\u1EA1n d\xF9ng g\xEC \u1EA1?", options: [
          { text: "\uCEE4\uD53C \uC8FC\uC138\uC694.", correct: true },
          { text: "\uCC98\uC74C \uBD59\uACA0\uC2B5\uB2C8\uB2E4.", correct: false },
          { text: "\uD559\uAD50\uC5D0 \uAC00\uC694.", correct: false }
        ] },
        { scene: "L\xE0m quen", line: "\uC774\uB984\uC774 \uBB50\uC608\uC694?", lineVi: "T\xEAn b\u1EA1n l\xE0 g\xEC?", options: [
          { text: "\uC81C \uC774\uB984\uC740 \uBBFC\uC218\uC608\uC694.", correct: true },
          { text: "\uB9DB\uC788\uC5B4\uC694.", correct: false },
          { text: "\uB0B4\uC77C \uB9CC\uB098\uC694.", correct: false }
        ] }
      ],
      certs: [
        { id: "topik", name: "TOPIK I / II", sub: "N\u0103ng l\u1EF1c ti\u1EBFng H\xE0n", tone: "amber", desc: "K\u1EF3 thi n\u0103ng l\u1EF1c ti\u1EBFng H\xE0n, TOPIK I l\xE0 s\u01A1 c\u1EA5p v\xE0 TOPIK II l\xE0 trung v\xE0 cao c\u1EA5p.", structure: ["TOPIK I: Nghe v\xE0 \u0110\u1ECDc", "TOPIK II: Nghe, Vi\u1EBFt v\xE0 \u0110\u1ECDc"], levels: "C\u1EA5p 1 \u2013 2 (TOPIK I), c\u1EA5p 3 \u2013 6 (TOPIK II)" }
      ]
    },
    {
      code: "de",
      name: "Ti\u1EBFng \u0110\u1EE9c",
      flag: "\u{1F1E9}\u{1F1EA}",
      vocab: [
        { term: "Danke", reading: "/\u02C8da\u014Bk\u0259/", meaning: "c\u1EA3m \u01A1n", example: "Danke f\xFCr deine Hilfe.", exampleVi: "C\u1EA3m \u01A1n b\u1EA1n \u0111\xE3 gi\xFAp." },
        { term: "der Freund", reading: "/f\u0281\u0254\u028Fnt/", meaning: "b\u1EA1n (nam)", example: "Er ist mein Freund.", exampleVi: "Anh \u1EA5y l\xE0 b\u1EA1n c\u1EE7a t\xF4i." },
        { term: "lernen", reading: "/\u02C8l\u025B\u0281n\u0259n/", meaning: "h\u1ECDc", example: "Ich lerne Deutsch.", exampleVi: "T\xF4i h\u1ECDc ti\u1EBFng \u0110\u1EE9c." },
        { term: "die Schule", reading: "/\u02C8\u0283u\u02D0l\u0259/", meaning: "tr\u01B0\u1EDDng h\u1ECDc", example: "Die Schule beginnt um acht.", exampleVi: "Tr\u01B0\u1EDDng b\u1EAFt \u0111\u1EA7u l\xFAc t\xE1m gi\u1EDD." },
        { term: "das Wasser", reading: "/\u02C8vas\u0250/", meaning: "n\u01B0\u1EDBc", example: "Ich trinke Wasser.", exampleVi: "T\xF4i u\u1ED1ng n\u01B0\u1EDBc." },
        { term: "der Bahnhof", reading: "/\u02C8ba\u02D0nho\u02D0f/", meaning: "ga t\xE0u", example: "Der Bahnhof ist gro\xDF.", exampleVi: "Nh\xE0 ga r\u1EA5t l\u1EDBn." }
      ],
      grammar: [
        { title: "\u0110\u1ED9ng t\u1EEB \u0111\u1EE9ng v\u1ECB tr\xED th\u1EE9 hai", pattern: "Th\xE0nh ph\u1EA7n 1 + \u0111\u1ED9ng t\u1EEB chia + \u2026", explain: "Trong c\xE2u tr\u1EA7n thu\u1EADt, \u0111\u1ED9ng t\u1EEB chia lu\xF4n \u0111\u1EE9ng \u1EDF v\u1ECB tr\xED th\u1EE9 hai.", example: "Heute lerne ich Deutsch.", exampleVi: "H\xF4m nay t\xF4i h\u1ECDc ti\u1EBFng \u0110\u1EE9c." },
        { title: "C\xE1ch 4 (Akkusativ)", pattern: "haben + einen/eine/ein + N", explain: "T\xE2n ng\u1EEF tr\u1EF1c ti\u1EBFp d\xF9ng c\xE1ch 4, danh t\u1EEB gi\u1ED1ng \u0111\u1EF1c \u0111\u1ED5i ein th\xE0nh einen.", example: "Ich habe einen Hund.", exampleVi: "T\xF4i c\xF3 m\u1ED9t con ch\xF3." },
        { title: "Th\xEC ho\xE0n th\xE0nh (Perfekt)", pattern: "haben/sein + Partizip II", explain: "D\xF9ng \u0111\u1EC3 k\u1EC3 vi\u1EC7c \u0111\xE3 x\u1EA3y ra trong v\u0103n n\xF3i.", example: "Ich habe gelernt.", exampleVi: "T\xF4i \u0111\xE3 h\u1ECDc." }
      ],
      dialogs: [
        { scene: "G\u1ECDi \u0111\u1ED3 u\u1ED1ng", line: "Was m\xF6chten Sie trinken?", lineVi: "Qu\xFD kh\xE1ch mu\u1ED1n u\u1ED1ng g\xEC?", options: [
          { text: "Ich m\xF6chte einen Kaffee, bitte.", correct: true },
          { text: "Der Bahnhof ist gro\xDF.", correct: false },
          { text: "Ich habe gelernt.", correct: false }
        ] },
        { scene: "L\xE0m quen", line: "Wie hei\xDFen Sie?", lineVi: "\xD4ng/b\xE0 t\xEAn l\xE0 g\xEC?", options: [
          { text: "Ich hei\xDFe Anna.", correct: true },
          { text: "Das Wasser ist kalt.", correct: false },
          { text: "Ich habe einen Hund.", correct: false }
        ] }
      ],
      certs: [
        { id: "goethe", name: "Goethe-Zertifikat", sub: "A1 \u2013 C2", tone: "teal", desc: "Ch\u1EE9ng ch\u1EC9 ti\u1EBFng \u0110\u1EE9c c\u1EE7a Vi\u1EC7n Goethe theo khung tham chi\u1EBFu ch\xE2u \xC2u.", structure: ["Lesen (\u0110\u1ECDc)", "H\xF6ren (Nghe)", "Schreiben (Vi\u1EBFt)", "Sprechen (N\xF3i)"], levels: "A1, A2, B1, B2, C1, C2" }
      ]
    },
    {
      code: "fr",
      name: "Ti\u1EBFng Ph\xE1p",
      flag: "\u{1F1EB}\u{1F1F7}",
      vocab: [
        { term: "merci", reading: "/m\u025B\u0281si/", meaning: "c\u1EA3m \u01A1n", example: "Merci beaucoup !", exampleVi: "C\u1EA3m \u01A1n r\u1EA5t nhi\u1EC1u!" },
        { term: "un ami", reading: "/\u0153\u0303n\u203Fami/", meaning: "ng\u01B0\u1EDDi b\u1EA1n", example: "Paul est mon ami.", exampleVi: "Paul l\xE0 b\u1EA1n c\u1EE7a t\xF4i." },
        { term: "apprendre", reading: "/ap\u0281\u0251\u0303d\u0281/", meaning: "h\u1ECDc h\u1ECFi", example: "J'apprends le fran\xE7ais.", exampleVi: "T\xF4i h\u1ECDc ti\u1EBFng Ph\xE1p." },
        { term: "une \xE9cole", reading: "/yn\u203Fek\u0254l/", meaning: "ng\xF4i tr\u01B0\u1EDDng", example: "L'\xE9cole est pr\xE8s d'ici.", exampleVi: "Tr\u01B0\u1EDDng \u1EDF g\u1EA7n \u0111\xE2y." },
        { term: "la boulangerie", reading: "/la bul\u0251\u0303\u0292\u0281i/", meaning: "ti\u1EC7m b\xE1nh m\xEC", example: "Je vais \xE0 la boulangerie.", exampleVi: "T\xF4i \u0111\u1EBFn ti\u1EC7m b\xE1nh m\xEC." },
        { term: "demain", reading: "/d\u0259m\u025B\u0303/", meaning: "ng\xE0y mai", example: "\xC0 demain !", exampleVi: "H\u1EB9n mai g\u1EB7p!" }
      ],
      grammar: [
        { title: "Pass\xE9 compos\xE9", pattern: "avoir/\xEAtre + participe pass\xE9", explain: "Di\u1EC5n t\u1EA3 h\xE0nh \u0111\u1ED9ng \u0111\xE3 ho\xE0n t\u1EA5t trong qu\xE1 kh\u1EE9.", example: "J'ai mang\xE9 une pomme.", exampleVi: "T\xF4i \u0111\xE3 \u0103n m\u1ED9t qu\u1EA3 t\xE1o." },
        { title: "Ph\u1EE7 \u0111\u1ECBnh", pattern: "ne + \u0111\u1ED9ng t\u1EEB + pas", explain: "Bao quanh \u0111\u1ED9ng t\u1EEB chia \u0111\u1EC3 ph\u1EE7 \u0111\u1ECBnh.", example: "Je ne parle pas anglais.", exampleVi: "T\xF4i kh\xF4ng n\xF3i ti\u1EBFng Anh." },
        { title: "M\u1EA1o t\u1EEB x\xE1c \u0111\u1ECBnh", pattern: "le / la / les", explain: "D\xF9ng khi n\xF3i v\u1EC1 v\u1EADt \u0111\xE3 x\xE1c \u0111\u1ECBnh, le cho gi\u1ED1ng \u0111\u1EF1c v\xE0 la cho gi\u1ED1ng c\xE1i.", example: "La table est grande.", exampleVi: "C\xE1i b\xE0n r\u1EA5t l\u1EDBn." }
      ],
      dialogs: [
        { scene: "T\u1EA1i ti\u1EC7m b\xE1nh", line: "Qu'est-ce que vous d\xE9sirez ?", lineVi: "Qu\xFD kh\xE1ch d\xF9ng g\xEC \u1EA1?", options: [
          { text: "Je voudrais un croissant, s'il vous pla\xEEt.", correct: true },
          { text: "Je ne parle pas anglais.", correct: false },
          { text: "Demain, il pleut.", correct: false }
        ] },
        { scene: "Ch\xE0o h\u1ECFi", line: "Comment \xE7a va ?", lineVi: "B\u1EA1n kh\u1ECFe kh\xF4ng?", options: [
          { text: "\xC7a va bien, merci. Et toi ?", correct: true },
          { text: "Il est \xE0 la gare.", correct: false },
          { text: "J'ai mang\xE9 une pomme.", correct: false }
        ] }
      ],
      certs: [
        { id: "delf", name: "DELF / DALF", sub: "A1 \u2013 C2", tone: "indigo", desc: "V\u0103n b\u1EB1ng ti\u1EBFng Ph\xE1p do B\u1ED9 Gi\xE1o d\u1EE5c Ph\xE1p c\u1EA5p, kh\xF4ng c\xF3 th\u1EDDi h\u1EA1n.", structure: ["Compr\xE9hension orale (Nghe)", "Compr\xE9hension \xE9crite (\u0110\u1ECDc)", "Production \xE9crite (Vi\u1EBFt)", "Production orale (N\xF3i)"], levels: "DELF A1 \u2013 B2, DALF C1 \u2013 C2" }
      ]
    },
    {
      code: "es",
      name: "T\xE2y Ban Nha",
      flag: "\u{1F1EA}\u{1F1F8}",
      vocab: [
        { term: "gracias", reading: "/\u02C8\u0261\u027Ea.sjas/", meaning: "c\u1EA3m \u01A1n", example: "Muchas gracias por todo.", exampleVi: "C\u1EA3m \u01A1n b\u1EA1n v\xEC t\u1EA5t c\u1EA3." },
        { term: "el amigo", reading: "/el a\u02C8mi\u0263o/", meaning: "ng\u01B0\u1EDDi b\u1EA1n", example: "Mi amigo vive en Madrid.", exampleVi: "B\u1EA1n t\xF4i s\u1ED1ng \u1EDF Madrid." },
        { term: "aprender", reading: "/ap\u027Een\u02C8de\u027E/", meaning: "h\u1ECDc h\u1ECFi", example: "Quiero aprender espa\xF1ol.", exampleVi: "T\xF4i mu\u1ED1n h\u1ECDc ti\u1EBFng T\xE2y Ban Nha." },
        { term: "la escuela", reading: "/la es\u02C8kwela/", meaning: "ng\xF4i tr\u01B0\u1EDDng", example: "La escuela est\xE1 cerca.", exampleVi: "Tr\u01B0\u1EDDng \u1EDF g\u1EA7n." },
        { term: "la biblioteca", reading: "/la \u03B2i\u03B2ljo\u02C8teka/", meaning: "th\u01B0 vi\u1EC7n", example: "Estudio en la biblioteca.", exampleVi: "T\xF4i h\u1ECDc \u1EDF th\u01B0 vi\u1EC7n." },
        { term: "ma\xF1ana", reading: "/ma\u02C8\u0272ana/", meaning: "ng\xE0y mai", example: "Nos vemos ma\xF1ana.", exampleVi: "Mai g\u1EB7p nh\xE9." }
      ],
      grammar: [
        { title: "Ser v\xE0 estar", pattern: "ser = b\u1EA3n ch\u1EA5t; estar = tr\u1EA1ng th\xE1i, v\u1ECB tr\xED", explain: 'C\u1EA3 hai \u0111\u1EC1u ngh\u0129a l\xE0 "l\xE0/\u1EDF" nh\u01B0ng kh\xE1c c\xE1ch d\xF9ng.', example: "Soy estudiante. Estoy cansado.", exampleVi: "T\xF4i l\xE0 sinh vi\xEAn. T\xF4i \u0111ang m\u1EC7t." },
        { title: "\u0110\u1ED9ng t\u1EEB gustar", pattern: "me/te/le + gusta(n) + ch\u1EE7 ng\u1EEF", explain: "Ch\u1EE7 ng\u1EEF l\xE0 th\u1EE9 \u0111\u01B0\u1EE3c th\xEDch, ng\u01B0\u1EDDi th\xEDch l\xE0 t\xE2n ng\u1EEF gi\xE1n ti\u1EBFp.", example: "Me gusta el caf\xE9.", exampleVi: "T\xF4i th\xEDch c\xE0 ph\xEA." },
        { title: "Qu\xE1 kh\u1EE9 \u0111\u01A1n (pret\xE9rito)", pattern: "comer \u2192 com\xED, comiste, comi\xF3\u2026", explain: "Di\u1EC5n t\u1EA3 h\xE0nh \u0111\u1ED9ng \u0111\xE3 x\u1EA3y ra v\xE0 k\u1EBFt th\xFAc.", example: "Ayer com\xED paella.", exampleVi: "H\xF4m qua t\xF4i \u0111\xE3 \u0103n paella." }
      ],
      dialogs: [
        { scene: "T\u1EA1i qu\xE1n c\xE0 ph\xEA", line: "\xBFQu\xE9 desea tomar?", lineVi: "B\u1EA1n mu\u1ED1n d\xF9ng g\xEC?", options: [
          { text: "Quisiera un caf\xE9, por favor.", correct: true },
          { text: "Me llamo Luis.", correct: false },
          { text: "La escuela est\xE1 cerca.", correct: false }
        ] },
        { scene: "L\xE0m quen", line: "\xBFC\xF3mo te llamas?", lineVi: "B\u1EA1n t\xEAn l\xE0 g\xEC?", options: [
          { text: "Me llamo Ana.", correct: true },
          { text: "Estoy en la biblioteca.", correct: false },
          { text: "Ma\xF1ana voy a clase.", correct: false }
        ] }
      ],
      certs: [
        { id: "dele", name: "DELE", sub: "A1 \u2013 C2", tone: "rose", desc: "V\u0103n b\u1EB1ng ti\u1EBFng T\xE2y Ban Nha do Vi\u1EC7n Cervantes c\u1EA5p thay m\u1EB7t B\u1ED9 Gi\xE1o d\u1EE5c T\xE2y Ban Nha.", structure: ["Comprensi\xF3n de lectura", "Comprensi\xF3n auditiva", "Expresi\xF3n e interacci\xF3n escritas", "Expresi\xF3n e interacci\xF3n orales"], levels: "A1, A2, B1, B2, C1, C2" }
      ]
    }
  ];
