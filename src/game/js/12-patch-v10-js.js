/*@file game/js/12-patch-v10-js.js
 * Patch v10: hiệu ứng chặt chồng.
 */

/* ===== PATCH v10 ===== */
/* Hiệu ứng chặt chồng: nhân tiền phạt */
function tlchain(dep,mul,amt){const fx=document.getElementById('fxl');if(!fx)return;
const w=document.createElement('div');w.className='chn d'+Math.min(dep,4);
let h=`<i class="chr"></i><b>${amt} LÁ</b><small>TIỀN CHẶT CỘNG DỒN${dep>1?' · TỔNG '+mul+' LÁ NẾU BỊ CHẶT TIẾP':''}</small>`;
const n=Math.min(40,8+dep*9);
for(let k=0;k<n;k++)h+=`<i class="chc" style="left:${(Math.random()*100).toFixed(1)}%;animation-delay:${(Math.random()*.7).toFixed(2)}s;animation-duration:${(1.1+Math.random()*.8).toFixed(2)}s;font-size:${16+(Math.random()*12|0)}px">${PCH()}</i>`;
w.innerHTML=h;fx.append(w);setTimeout(()=>w.remove(),2700)}

/* Hiệu ứng kết thúc ván cờ: thắng / thua / hòa / đầu hàng */
function endFx(kind,sub){if(kind==='draw'){const dc=TB-Math.floor(TB*.95);count(Math.max(0,chips-dc));sub='Hòa cờ · mỗi bên nhận lại 95% mức cược (mất '+dc.toLocaleString('vi-VN')+' Chips)'}document.querySelectorAll('.endfx').forEach(e=>e.remove());
const T={win:['CHIẾN THẮNG','👑'],lose:['THẤT BẠI','💀'],draw:['HÒA CỜ','🤝'],resign:['ĐẦU HÀNG','🏳️']}[kind];if(!T)return;
const n={win:46,lose:22,draw:16,resign:14}[kind];let p='';
for(let k=0;k<n;k++){const c=kind==='win'?['#ffd36a','#ff5f7a','#6ad8ff','#8dff7a','#ffffff'][k%5]:'#888';
p+=`<i class="ep" style="left:${(Math.random()*100).toFixed(1)}%;--c:${c};--dl:${(Math.random()*1.2).toFixed(2)}s;--du:${(2+Math.random()*1.8).toFixed(2)}s;--x:${(Math.random()*80-40)|0}px;--s:${6+(Math.random()*8|0)}px"></i>`}
const w=document.createElement('div');w.className='endfx '+kind;
w.innerHTML=`<div class="eg"></div>${p}<div class="ec"><span class="ei">${T[1]}</span><b>${T[0]}</b><small>${sub||''}</small></div>`;
document.body.append(w);
try{if(kind==='lose'||kind==='resign')snd('lose');else if(kind==='draw')snd('flip')}catch(e){}
setTimeout(()=>w.classList.add('out'),3400);setTimeout(()=>w.remove(),4100)}

/* Chọn bài Tiến lên phản hồi tức thì: bắt pointerdown thay vì chờ click */
(()=>{const hit=e=>{const b=e.target.closest&&e.target.closest('#tb .hc');const t=document.getElementById('tb');
return b&&t&&t.dataset.g==='tl'&&!t.hidden&&!(typeof over!=='undefined'&&over)?b:null};
document.addEventListener('pointerdown',e=>{const b=hit(e);if(!b)return;const v=+b.dataset.v;sel.has(v)?sel.delete(v):sel.add(v);b.classList.toggle('sel',sel.has(v));b._pd=Date.now()},true);
document.addEventListener('click',e=>{const b=hit(e);if(b&&b._pd&&Date.now()-b._pd<1500){e.stopPropagation();b._pd=0}},true)})();
