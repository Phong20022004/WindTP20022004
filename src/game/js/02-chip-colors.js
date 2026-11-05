/*@file game/js/02-chip-colors.js
 * Màu chip theo mệnh giá.
 */

window.PCH=function(c){var P=['#c62828','#1565c0','#2e7d32','#2b2b2b','#6a1b9a','#ef6c00'];c=c||P[Math.random()*P.length|0];return '<i class="pchip" style="--c:'+c+'"></i>'};
