/*@file game/js/05-patch-v5-roulette.js
 * Patch v5.
 */

/* ================= PATCH v5 ================= */
(()=>{
let UID=0;
/* ---------- Roulette ---------- */
const RN=[0,32,15,19,4,21,2,25,17,34,6,27,13,36,11,30,8,23,10,5,24,16,33,1,20,14,31,9,22,18,29,7,28,12,35,3,26];
const RED=new Set([1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36]);
function wheel(){
 const u='rw'+(UID++),n=37,a=Math.PI*2/n,f=x=>x.toFixed(2);
 const P=(r,t)=>f(100+r*Math.sin(t))+' '+f(100-r*Math.cos(t));
 const sec=(r1,r2,i)=>{const t0=(i-.5)*a,t1=(i+.5)*a;return `M${P(r2,t0)}A${r2} ${r2} 0 0 1 ${P(r2,t1)}L${P(r1,t1)}A${r1} ${r1} 0 0 0 ${P(r1,t0)}Z`};
 let s=`<svg viewBox="0 0 200 200"><defs><linearGradient id="${u}g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff1b0"/><stop offset=".35" stop-color="#d9a53a"/><stop offset=".7" stop-color="#6e4a0e"/><stop offset="1" stop-color="#f3cf6a"/></linearGradient><radialGradient id="${u}c" cx="40%" cy="35%" r="70%"><stop offset="0" stop-color="#4d3c26"/><stop offset="1" stop-color="#0c0905"/></radialGradient><radialGradient id="${u}t" cx="35%" cy="30%" r="75%"><stop offset="0" stop-color="#fff3b8"/><stop offset=".5" stop-color="#e0aa38"/><stop offset="1" stop-color="#6b4508"/></radialGradient></defs>
<circle cx="100" cy="100" r="98" fill="#16110c" stroke="url(#${u}g)" stroke-width="4"/><circle cx="100" cy="100" r="92" fill="#0b0805" stroke="#c99a35" stroke-width=".8"/>`;
 RN.forEach((v,i)=>{const col=v===0?['#0f8a43','#0a5a2c']:RED.has(v)?['#c4161f','#7c0d14']:['#17171b','#050506'];
  s+=`<path d="${sec(76,90,i)}" fill="${col[0]}" stroke="#d6a840" stroke-width=".5"/><path d="${sec(56,76,i)}" fill="${col[1]}" stroke="#d6a840" stroke-width=".6"/><text transform="rotate(${(i*360/n).toFixed(1)} 100 100)" x="100" y="19.6" font-size="6.6" font-weight="700" fill="#fff" text-anchor="middle" font-family="Arial,sans-serif">${v}</text>`});
 s+=`<circle cx="100" cy="100" r="55" fill="url(#${u}c)" stroke="url(#${u}g)" stroke-width="2.5"/><circle cx="100" cy="100" r="40" fill="none" stroke="#c99a35" stroke-width=".7" opacity=".7"/><circle cx="100" cy="100" r="28" fill="none" stroke="#c99a35" stroke-width=".5" opacity=".5"/>
<path d="M100 100V58M100 100V142M100 100H58M100 100H142" stroke="#e3b84e" stroke-width="3.2" stroke-linecap="round"/>
<g fill="url(#${u}t)" stroke="#6b4508" stroke-width=".5"><circle cx="100" cy="56" r="4.8"/><circle cx="100" cy="144" r="4.8"/><circle cx="56" cy="100" r="4.8"/><circle cx="144" cy="100" r="4.8"/><circle cx="100" cy="100" r="13"/></g><circle cx="100" cy="100" r="6.5" fill="url(#${u}t)" stroke="#6b4508" stroke-width=".6"/></svg>`;
 return s}
const ball=()=>{const u='bl'+(UID++);return `<svg viewBox="0 0 200 200"><defs><radialGradient id="${u}" cx="35%" cy="30%"><stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="#b4b4b4"/></radialGradient></defs><circle cx="100" cy="34" r="4.2" fill="url(#${u})" stroke="rgba(0,0,0,.4)" stroke-width=".4"/></svg>`};
const rw=(st)=>`<div class="rw" style="${st}"><div class="rot">${wheel()}</div><div class="rot bl">${ball()}</div></div>`;

/* ---------- Xí ngầu ---------- */
const PIP=[0,[5],[1,9],[1,5,9],[1,3,7,9],[1,3,5,7,9],[1,3,4,6,7,9]];
const pips=n=>PIP[n].map(c=>`<b style="grid-row:${Math.ceil(c/3)};grid-column:${(c-1)%3+1}"></b>`).join('');
const die=(l,t,s,du,dl,rv)=>`<div class="dx" style="left:${l};top:${t};--s:${s};--du:${du}s;--dl:${dl}s;--bd:${(4+du%3).toFixed(1)}s"><div class="cube${rv?' rv':''}">${[1,6,3,4,2,5].map(n=>`<div class="fc">${pips(n)}</div>`).join('')}</div></div>`;

/* ---------- Chip ---------- */
const CHC={k:['#1a1a1f','#43434c','#e2b84e'],w:['#f6f1e4','#cdc5ae','#2b2b2b'],r:['#d3121f','#7a0911','#f4d57e'],b:['#2060d4','#0e2f7c','#f4d57e'],g:['#1f9d55','#0a5a2d','#f4d57e'],y:['#f4c433','#a9780b','#2b1c00']};
function chipSVG(c,txt){const[a,b,e]=CHC[c],u='cp'+(UID++),dash=c==='w'?'#2b2b2b':'#f8f3e6';
 return `<svg viewBox="0 0 100 100"><defs><radialGradient id="${u}a" cx="35%" cy="30%" r="85%"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></radialGradient><radialGradient id="${u}g" cx="30%" cy="24%" r="72%"><stop offset="0" stop-color="#fff" stop-opacity=".55"/><stop offset=".55" stop-color="#fff" stop-opacity="0"/></radialGradient></defs>
<circle cx="50" cy="50" r="49" fill="url(#${u}a)" stroke="#000" stroke-opacity=".4" stroke-width="1"/>
<circle cx="50" cy="50" r="42.5" fill="none" stroke="${dash}" stroke-width="11" stroke-dasharray="11.127 11.127"/>
<circle cx="50" cy="50" r="35.5" fill="none" stroke="${e}" stroke-width="1.8"/>
<circle cx="50" cy="50" r="34" fill="url(#${u}a)"/>
<circle cx="50" cy="50" r="29" fill="none" stroke="${e}" stroke-width="1.3" stroke-dasharray="1.4 3.4" stroke-linecap="round"/>
<text x="50" y="51" font-size="${txt.length>2?15:19}" font-weight="900" text-anchor="middle" dominant-baseline="central" fill="${e}" font-family="Georgia,serif">${txt}</text>
<circle cx="50" cy="50" r="49" fill="url(#${u}g)"/></svg>`}
const chip=(c,txt,l,t,w,tx,r,du)=>`<div class="cpx" style="left:${l};top:${t};width:${w};--tx:${tx}deg;--r:${r}deg;--du:${du}s">${chipSVG(c,txt)}</div>`;
function stack(c,n){const[a,b,e]=CHC[c],H=16+n*7,st=c==='w'?'#2b2b2b':'#f8f3e6';let s=`<svg viewBox="0 0 60 ${H}">`;
 for(let i=0;i<n;i++){const y=H-16-i*7;
  s+=`<path d="M2 ${y+3}v6a28 6 0 0 0 56 0v-6z" fill="${a}" stroke="${b}" stroke-width=".6"/><path d="M2 ${y+6}a28 6 0 0 0 56 0" fill="none" stroke="${st}" stroke-width="4" stroke-dasharray="4.6 4.6"/><ellipse cx="30" cy="${y+3}" rx="28" ry="6" fill="${a}" stroke="${b}" stroke-width=".7"/><ellipse cx="30" cy="${y+3}" rx="20" ry="4" fill="none" stroke="${e}" stroke-width="1"/>`}
 return s+'</svg>'}
const stk=(c,n,st)=>`<div class="stk" style="${st}">${stack(c,n)}</div>`;

/* ---------- Máy 777 ---------- */
function slot(){const u='sl'+(UID++);return `<svg viewBox="0 0 180 96"><defs>
<linearGradient id="${u}a" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff2b5"/><stop offset=".22" stop-color="#f0c24a"/><stop offset=".55" stop-color="#b98318"/><stop offset=".8" stop-color="#e2b13e"/><stop offset="1" stop-color="#7a5008"/></linearGradient>
<linearGradient id="${u}b" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8a8472"/><stop offset=".18" stop-color="#fffaf0"/><stop offset=".5" stop-color="#f4eedd"/><stop offset=".85" stop-color="#cfc6ac"/><stop offset="1" stop-color="#6e6853"/></linearGradient>
<linearGradient id="${u}s" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#000" stop-opacity=".5"/><stop offset=".25" stop-color="#000" stop-opacity="0"/><stop offset=".75" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".5"/></linearGradient></defs>
<ellipse cx="90" cy="90" rx="72" ry="5" fill="#000" opacity=".45"/>
<rect x="16" y="14" width="140" height="66" rx="6" fill="url(#${u}a)"/>
<ellipse cx="156" cy="47" rx="11" ry="33" fill="#d9a53a" stroke="#6e4a0c" stroke-width=".8"/><ellipse cx="156" cy="47" rx="6" ry="20" fill="#a97514" opacity=".6"/>
${[0,1,2].map(k=>`<rect x="${28+k*42}" y="20" width="38" height="54" rx="4" fill="url(#${u}b)"/><text x="${47+k*42}" y="62" font-size="46" font-weight="900" text-anchor="middle" fill="#d3121f" font-family="Georgia,serif" stroke="#7a0a10" stroke-width=".8">7</text><rect x="${28+k*42}" y="20" width="38" height="54" rx="4" fill="url(#${u}s)"/>`).join('')}
<ellipse cx="16" cy="47" rx="11" ry="33" fill="url(#${u}a)" stroke="#6e4a0c" stroke-width=".8"/>
<path d="M163 38l10-18" stroke="#9a9a9a" stroke-width="3" stroke-linecap="round"/><circle cx="174" cy="18" r="6.5" fill="#d3121f" stroke="#7a0a10" stroke-width=".8"/><circle cx="172" cy="16" r="2" fill="#fff" opacity=".7"/></svg>`}

/* ---------- Bài ---------- */
const fan=st=>`<div class="cfan" style="${st}">${[[55,-24],[56,0],[59,24]].map(([v,r])=>pcx(v,' sm',`style="--r:${r}deg"`)).join('')}</div>`;

/* ---------- Chips rơi ---------- */
const coins=Array.from({length:12},(_,i)=>`<div class="cn" style="left:${(7+i*8.1)%96}cqw;--sz:${7+(i*5)%6}px;--du:${10+(i*7)%9}s;--dl:-${(i*3.7)%12}s;--pc:${['#c62828','#1565c0','#2e7d32','#2b2b2b','#6a1b9a'][i%5]}"><i></i></div>`).join('');

const DECOR=()=>`<div class="glow"></div>
<i class="bo" style="left:20cqw;top:8cqh;width:16cqh;height:16cqh"></i><i class="bo" style="left:70cqw;top:60cqh;width:18cqh;height:18cqh;animation-delay:-2s"></i><i class="bo" style="left:44cqw;top:78cqh;width:22cqh;height:22cqh;animation-delay:-4s"></i>
${coins}
${rw('left:-6cqh;top:14cqh;--z:32cqh')}
${rw('right:-5cqh;top:5cqh;--z:21cqh;--sp:48s')}
${die('1cqw','58cqh','15cqh',19,0,0)}
${die('9cqw','76cqh','10cqh',23,-5,1)}
${die('calc(100% - 15cqw)','80cqh','12cqh',21,-9,0)}
${die('28cqw','1cqh','9cqh',17,-3,1)}
${die('calc(100% - 33cqw)','2cqh','8cqh',25,-12,0)}
${chip('k','VIP','22cqw','-3cqh','15cqh',55,-20,9)}
${chip('r','100','calc(100% - 27cqw)','-2cqh','13cqh',60,15,11)}
${chip('w','500','3cqw','44cqh','10cqh',50,-35,10)}
${chip('b','1K','calc(100% - 8cqw)','48cqh','10cqh',48,25,12)}
${chip('y','★','13cqw','86cqh','9cqh',60,0,8)}
${chip('g','50','calc(100% - 17cqw)','88cqh','9cqh',55,40,9)}
${stk('k',6,'left:3cqw;bottom:2cqh;width:10cqh')}
${stk('r',3,'left:calc(3cqw + 10cqh);bottom:2cqh;width:10cqh')}
${stk('b',5,'right:3cqw;bottom:2cqh;width:10cqh')}
${stk('g',3,'right:calc(3cqw + 10cqh);bottom:2cqh;width:10cqh')}
<div class="sl7" style="right:1cqw;top:65cqh">${slot()}</div>
${fan('left:calc(100% - 24cqw);top:57cqh')}`;

window.__DECOR=DECOR;function ensureDecor(){const x=document.querySelector('#tb .tlx');if(!x||x.querySelector('#dcr'))return;const d=document.createElement('div');d.id='dcr';d.innerHTML=DECOR();x.prepend(d)}
const tb0=tbase;tbase=function(t){tb0(t);ensureDecor()};
const dr0=dr;dr=function(){dr0();ensureDecor()};

/* ---------- Hiệu ứng tiền / sự kiện kéo dài hơn ---------- */
setChips=function(n){chips=n;$('#chips').textContent=$('#chips2').textContent=fmt(n);const e=$('#tc');if(e)e.textContent=fmt(n)};
count=function(to){const from=chips,t0=performance.now(),D=1400;let lu=-1e9;(function f(t){const k=Math.min(1,(t-t0)/D),e=1-Math.pow(1-k,3);if(k>=1||t-lu>=50){lu=t;setChips(Math.round(from+(to-from)*e))}if(k<1)requestAnimationFrame(f)})(t0)};
tlfloat=function(i,v){const fx=$('#fxl');if(!fx||!$('#av'+i)||!v)return;const[a,b]=tlpos(i),e=document.createElement('div');e.className='fl '+(v>0?'p':'m');e.innerHTML=(v>0?'+':'−')+Math.abs(v).toLocaleString('vi-VN')+' '+PCH();e.style.left=(a-30)+'px';e.style.top=(b-44)+'px';fx.append(e);setTimeout(()=>e.remove(),3100)};
const BQ=[];let bqRun=0;
function bqNext(){const x=BQ.shift();if(!x){bqRun=0;return}const fx=$('#fxl');
 if(fx){const e=document.createElement('div');e.className='ban';e.style.setProperty('--c',x[1]||'#ffd36a');e.textContent=x[0];fx.append(e);snd('ban');setTimeout(()=>e.remove(),2500)}
 setTimeout(bqNext,fx?2100:0)}
tlbanner=function(t,c){BQ.push([t,c]);if(!bqRun){bqRun=1;bqNext()}};
chipRun=function(net,N){const fx=$('#fxl');if(!fx)return;const ws=net.map((v,i)=>v>0?i:-1).filter(i=>i>=0);if(!ws.length)return;
 net.forEach((v,i)=>{if(v<0&&i<N)for(let k=0;k<6;k++)setTimeout(()=>{const f2=$('#fxl');if(!f2||!$('#av'+i))return;const w=ws[k%ws.length],[a,b]=tlpos(i),[c,d]=tlpos(w);fly(f2,'🪙',a,b,c,d,1100,50,420,()=>snd('chip'),22)},500+k*170)})};
{const s0=stain;stain=function(fx,c,d,col,n,sz){return s0(fx,c,d,col,Math.max(2,Math.round(n*.6)),sz)}}

/* ---------- Thanh kéo tố: dọc, bên phải, sáng dần ---------- */
slider=function(mn,mx,st,cb,on){
 if(!on||mx<mn)return;
 if(mx===mn){const o=document.createElement('div');o.className='vsl one';o.style.cssText='--p:1;top:auto;bottom:190px;height:auto;width:auto;min-width:96px';
  o.innerHTML='<button class="b2 r vb">ALL-IN '+mx.toLocaleString('vi-VN')+'</button>';$('#tli').append(o);o.querySelector('.vb').onclick=()=>cb(mx);return}
 const w=document.createElement('div');w.className='vsl';
 w.innerHTML=`<div class="vl"></div><div class="vt" tabindex="0" role="slider" aria-orientation="vertical" aria-label="Mức tố"><div class="vf"></div><div class="vk"><i class="s1">✦</i><i class="s2">✦</i></div></div><button class="b2 g vb"></button>`;
 $('#tli').append(w);
 const vt=w.querySelector('.vt'),vl=w.querySelector('.vl'),vb=w.querySelector('.vb');
 let p=0,lv=-1,down=0;
 const val=r=>{if(r>=.985)return mx;const v=Math.round((mn+r*(mx-mn))/st)*st;return Math.max(mn,Math.min(v,mx-1))};
 const set=r=>{p=Math.max(0,Math.min(1,r));const v=val(p),all=p>=.985;
  w.style.setProperty('--p',p.toFixed(3));vl.textContent=all?'ALL-IN':v.toLocaleString('vi-VN');vb.textContent=all?'ALL-IN':'TỐ';
  w.classList.toggle('max',all);vt.setAttribute('aria-valuenow',v);if(v!==lv){if(lv>=0)snd('flip');lv=v}};
 const pos=e=>set(1-e.offsetY/vt.clientHeight);
 vt.onpointerdown=e=>{down=1;try{vt.setPointerCapture(e.pointerId)}catch(_){}pos(e);e.preventDefault()};
 vt.onpointermove=e=>{if(down)pos(e)};
 vt.onpointerup=vt.onpointercancel=()=>{down=0};
 vt.onkeydown=e=>{if(e.key==='ArrowUp'||e.key==='ArrowRight'){set(p+.05);e.preventDefault()}else if(e.key==='ArrowDown'||e.key==='ArrowLeft'){set(p-.05);e.preventDefault()}};
 vb.onclick=()=>cb(val(p));
 set(0)};
})();
