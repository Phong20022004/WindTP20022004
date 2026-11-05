/*@file js/app/25-app-banner.js
 * Banner trang chủ và đổi banner.
 */
  var BANNER_THEMES = [
    { logo: "from-sky-500 via-blue-500 to-indigo-600", char: "text-sky-600", brand: "from-sky-600 via-indigo-600 to-blue-600" },
    { logo: "from-orange-500 via-pink-500 to-purple-600", char: "text-orange-600", brand: "from-orange-600 via-pink-600 to-purple-600" },
    { logo: "from-emerald-500 via-teal-500 to-blue-600", char: "text-emerald-600", brand: "from-emerald-600 via-teal-600 to-blue-600" },
    { logo: "from-purple-500 via-indigo-500 to-sky-600", char: "text-purple-600", brand: "from-purple-600 via-indigo-600 to-sky-600" },
    { logo: "from-indigo-500 via-violet-500 to-sky-500", char: "text-indigo-600", brand: "from-indigo-600 via-violet-600 to-sky-600" }
  ];
  function setBanner(i) {
    ui.slide = (i % BANNERS.length + BANNERS.length) % BANNERS.length;
    const slider = $("#banner-slider");
    if (slider) slider.style.transform = `translateX(-${ui.slide * 100}%)`;
    $$(".banner-dot").forEach((dot, idx) => {
      const on = idx === ui.slide;
      dot.classList.toggle("w-4", on);
      dot.classList.toggle("bg-white", on);
      dot.classList.toggle("w-2", !on);
      dot.classList.toggle("bg-white/50", !on);
    });
    const th = BANNER_THEMES[ui.slide];
    const logo = $("#logo-circle");
    const ch = $("#logo-char");
    const brand = $("#brand-text");
    if (logo) logo.className = `w-10 h-10 rounded-full bg-gradient-to-tr ${th.logo} p-0.5 shadow-md shadow-sky-200 group-hover:scale-105 transition-all duration-500 flex items-center justify-center`;
    if (ch) ch.className = `font-black ${th.char} text-lg transition-colors duration-500`;
    if (brand) brand.className = `font-extrabold text-lg tracking-tight bg-gradient-to-r ${th.brand} bg-clip-text text-transparent transition-all duration-500`;
  }
