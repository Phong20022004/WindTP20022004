/*@file game/js/11-patch-v9-js.js
 * Patch v9: thời gian máy nghĩ.
 */

/* ===== PATCH v9 ===== */
/* Thời gian máy nghĩ: 70% từ 3-5s, 20% từ 1-3s, 10% còn lại (nhanh dưới 1s hoặc chậm 5-9,6s) */
function botThink(){const r=Math.random();
if(r<.7)return 3000+Math.random()*2000;
if(r<.9)return 1000+Math.random()*2000;
return Math.random()<.7?5000+Math.random()*4600:400+Math.random()*600}
/* Vòng sáng của máy luôn chạy đủ 10 giây, máy đánh sớm hơn thì vòng sáng biến mất */
async function bw(i){const ms=botThink(),t0=Date.now(),D=10000;
const ring=()=>{const av=document.getElementById('av'+i);if(av&&!av.querySelector('.tmr.bt')){const el=Date.now()-t0;av.insertAdjacentHTML('beforeend',`<svg class="tmr bt" viewBox="0 0 100 100"><circle cx="50" cy="50" r="47" pathLength="100" style="animation:tmrr ${D}ms linear forwards,tmrc ${D}ms linear forwards;animation-delay:${-el}ms,${-el}ms"/></svg>`)}};
const mo=new MutationObserver(ring);mo.observe(document.body,{childList:true,subtree:true});
ring();while(Date.now()-t0<ms){await sleep(Math.min(300,Math.max(30,ms-(Date.now()-t0))));ring()}
mo.disconnect();document.querySelectorAll('.tmr.bt').forEach(e=>e.remove())}

/* Nền vòng quay casino */
function VQBG(){return '<div class="vqbg"><i class="rays"></i><i class="spot a"></i><i class="spot b"></i>'+Array.from({length:16},(_,i)=>`<i class="vf" style="left:${(i*29+7)%94}%;font-size:${14+(i*7)%18}px;animation-duration:${9+(i*5)%10}s;animation-delay:-${(i*3)%12}s">${'♠♥♦♣✦'[i%5]}</i>`).join('')+'</div>'}

/* Hiệu ứng đánh heo: số 2 + chất Cơ / Rô / Chuồn / Bích (lẻ, đôi, sám, tứ quý) */
function tlheo(i,cs){const fx=document.getElementById('fxl');if(!fx)return;
const tw=cs.filter(v=>rk(v)===15).sort((a,b)=>a-b),n=tw.length;if(!n)return;
const SG=['♠','♣','♦','♥'],SN=['BÍCH','CHUỒN','RÔ','CƠ'],SC=['#8fb4ff','#43e08a','#ffa63d','#ff4d6d'];
const sc=[0,1.25,1.05,.92,.82][n],ro=[[],[0],[-5,5],[-8,0,8],[-9,-3,3,9]][n];
const w=document.createElement('div');w.className='heo';w.style.gap=(n>2?8:12)+'px';
let h='<i class="hg"></i><i class="hrg"></i>';
tw.forEach((v,k)=>{const s=v&3;h+=`<div class="hc2${s>1?' r':''}" style="--c:${SC[s]};--k:${k};--sc:${sc};--r:${ro[k]}deg"><b>2</b><u>${SG[s]}</u><em>${SN[s]}</em></div>`});
for(let k=0;k<12;k++)h+=`<i class="hpt" style="--a:${k*30}deg;color:${k%2?'#ffd36a':SC[tw[k%n]&3]}">✦</i>`;
w.innerHTML=h;fx.append(w);setTimeout(()=>w.remove(),2700)}

/* Hiệu ứng chiếu tướng cho cờ vua và cờ tướng */
function chkFx(o){const lay=document.getElementById(o.lay);if(!lay)return;
const w=document.createElement('div');w.className='chk'+(o.mate?' mate':'');
const rings=[0,1,2].map(k=>`<i class="ck-r" style="left:${o.x}%;top:${o.y}%;width:${o.sz}%;animation-delay:${k*.25}s"></i>`).join('');
w.innerHTML=`<i class="ck-v"></i>${rings}<i class="ck-s"></i><div class="ck-b"><b>${o.txt}</b><small>${o.sub}</small></div>`;
lay.append(w);setTimeout(()=>w.remove(),o.mate?3000:2400);
try{snd('ban');setTimeout(()=>snd('ban'),200)}catch(e){}
if(o.el){const e=o.el;e.classList.remove('chkd');void e.offsetWidth;e.classList.add('chkd');setTimeout(()=>e.classList.remove('chkd'),1500)}
const bd=lay.parentElement;if(bd){bd.classList.remove('bump');void bd.offsetWidth;bd.classList.add('bump')}}

/* Gắn tên môn vào nền bàn bài (CSS đọc thuộc tính data-g) */
[['tien','tl'],['phom','phom'],['c3','c3'],['lieng','lieng'],['pkg','pk']].forEach(([n,g])=>{const o=window[n];if(typeof o!=='function')return;
window[n]=function(...a){const r=o.apply(this,a);const t=document.getElementById('tb');if(t)t.dataset.g=g;return r}});
