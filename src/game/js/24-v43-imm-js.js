/*@file game/js/24-v43-imm-js.js
 * v43.
 */

window.tlImm=function(by,vic,amt){const v=amt*TB;if(by===0)count(chips+fx(v));else if(vic===0)count(Math.max(0,chips-v));setTimeout(()=>{const e=document.getElementById('tc');if(e)e.textContent=fmt(chips)},700)};
