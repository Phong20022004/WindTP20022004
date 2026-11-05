/*@file game/js/10-wind-bridge.js
 * Cổng duy nhất tới app WINDTP (trang cha); trả null khi game chạy độc lập.
 */
/* Cổng duy nhất tới app WINDTP (trang cha). Trả null khi game chạy độc lập. */
window.__WIND=()=>{try{return window.parent&&window.parent!==window?window.parent.WINDTP||null:null}catch(e){return null}};
