/*@file game/js/22-v41-js.js
 * v41.
 */

(()=>{
function addX(){const p=document.getElementById('chp');if(!p||p.querySelector('.chx'))return;
const b=document.createElement('button');b.type='button';b.className='chx';b.setAttribute('aria-label','Đóng bảng tin nhắn');b.textContent='✕';
b.onclick=e=>{e.stopPropagation();e.preventDefault();p.remove()};p.prepend(b)}
new MutationObserver(addX).observe(document.body,{childList:true,subtree:true});
document.addEventListener('keydown',e=>{if(e.key==='Escape'){const p=document.getElementById('chp');if(p)p.remove()}});
addX()})();
