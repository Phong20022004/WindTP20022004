/*@file game/js/19-patch-v45-js.js
 * Patch v45.
 */

(()=>{
const RM=()=>matchMedia('(prefers-reduced-motion:reduce)').matches;
const ITEMS=[['🧱','Gạch','#9aa0a6','💥','fly'],['🥚','Trứng','#ffd84d','🍳','splat'],['🍅','Cà chua','#d92b2b','🍅','splat'],['👟','Dép','#7aa7d9','💢','fly'],['🌹','Hoa','#ff7aa8','💖','fly'],['💩','Rác','#7a4a22','💩','splat'],['🥊','Đấm bốc','#fff3b0','💫','punch'],['💣','Lựu đạn','#ff9a2e','💥','nade'],['🚀','Tên lửa','#ff6a1a','💥','rocket'],['🍈','Sầu riêng','#e6c84a','🤢','durian']];
const REPLY=['Ê, ném gì thế!','Hừm, nhớ mặt đấy','Ha ha ha','Chơi bẩn nha','Đợi đấy!'];
const CSS=`#cvthr{position:fixed;inset:0;pointer-events:none;z-index:480;overflow:hidden}
#cvthr .t{position:absolute;left:0;top:0;line-height:1;will-change:transform}
#cvthr .b{position:absolute;display:grid;place-items:center;border-radius:50%;background:radial-gradient(circle,var(--c) 0,transparent 70%);animation:cvB .9s ease-out forwards}
@keyframes cvB{0%{transform:scale(.2);opacity:1}25%{transform:scale(1.25)}70%{opacity:1}100%{transform:scale(1.05) translateY(8px);opacity:0}}
#cvthr .s{position:absolute;border-radius:50% 50% 45% 55%;animation:cvS 3.2s ease-in forwards}
@keyframes cvS{0%,70%{opacity:.85}100%{opacity:0;transform:translateY(8px)}}
#cvthr .r{position:absolute;border-radius:50%;border:3px solid var(--c);animation:cvR .7s ease-out forwards}
@keyframes cvR{from{transform:scale(.2);opacity:1}to{transform:scale(2.6);opacity:0}}
#cvthr .m{position:absolute;transform:translate(-50%,-100%);background:#fff7df;color:#3a2203;border:2px solid #d9a45a;border-radius:12px;padding:4px 9px;font:700 13px/1.2 system-ui,sans-serif;white-space:nowrap;animation:cvM 2.2s ease forwards}
@keyframes cvM{0%{opacity:0;scale:.6}12%{opacity:1;scale:1}80%{opacity:1}100%{opacity:0}}
#cvthp{position:fixed;left:0;right:0;bottom:0;z-index:470;background:linear-gradient(#2a1a10,#150c07);border-top:2px solid #d9a45a;padding:10px 10px calc(12px + env(safe-area-inset-bottom,0px));border-radius:18px 18px 0 0;box-shadow:0 -10px 30px rgba(0,0,0,.6);animation:cvUp .22s ease-out}
@keyframes cvUp{from{transform:translateY(100%)}}
#cvthp .hd{display:flex;justify-content:space-between;align-items:center;color:#ffe9a8;font-weight:800;font-size:14px;margin-bottom:8px}
#cvthp .hd button{border:1px solid #d9a45a;background:#7a1c36;color:#f6e7c8;border-radius:50%;width:28px;height:28px;padding:0}
#cvthp .g{display:grid;grid-template-columns:repeat(5,1fr);gap:6px}#cvthp .qp{display:flex;flex-wrap:wrap;gap:5px;margin-bottom:6px}#cvthp .qp button{font-size:12px;padding:4px 9px;border-radius:999px;border:1px solid #8a5a3a;background:#3a2314;color:#f6e7c8}#cvthp .in{display:flex;gap:6px;margin-bottom:8px}#cvthp .in input{flex:1;min-width:0;border-radius:10px;border:1px solid #8a5a3a;background:#1a0f08;color:#fff;padding:7px 9px;font-size:13px}#cvthp .in .sd{border-radius:10px;border:1px solid #fff3b0;background:linear-gradient(#ffd978,#d08a1c);color:#3a1a00;font-weight:800;padding:7px 12px;font-size:13px}
#cvthp .g button{display:flex;flex-direction:column;align-items:center;gap:2px;padding:6px 2px;border-radius:12px;border:1px solid #8a5a3a;background:#3a2314;color:#f6e7c8;font-size:22px}
#cvthp .g small{font-size:10px;font-weight:700}
@media(prefers-reduced-motion:reduce){#cvthr .b,#cvthr .s,#cvthr .r,#cvthr .m,#cvthp{animation-duration:.01s}}`;
let L=null;
function layer(){if(!document.getElementById('cvthr-css')){const s=document.createElement('style');s.id='cvthr-css';s.textContent=CSS;document.head.append(s)}
 if(!L||!L.isConnected){L=document.createElement('div');L.id='cvthr';document.body.append(L)}return L}
const ctr=el=>{const r=el.getBoundingClientRect();return[r.left+r.width/2,r.top+r.height/2]};
function ev(tag,cls,css,txt){const e=document.createElement(tag);e.className=cls;e.style.cssText=css;if(txt)e.textContent=txt;layer().append(e);return e}
const blob=(c,d,col,txt,sz)=>{const e=ev('div','b',`left:${c-sz/2}px;top:${d-sz/2}px;width:${sz}px;height:${sz}px;--c:${col};font-size:${Math.round(sz*.5)}px`,txt);setTimeout(()=>e.remove(),950)};
const ring=(c,d,col)=>{const e=ev('i','r',`left:${c-30}px;top:${d-30}px;width:60px;height:60px;--c:${col}`);setTimeout(()=>e.remove(),750)};
function stain(c,d,col,n,sz){for(let k=0;k<n;k++){const r=6+Math.random()*sz,e=ev('i','s',`left:${c+(Math.random()-.5)*110}px;top:${d+(Math.random()-.5)*90}px;width:${r}px;height:${r*(1+Math.random())}px;background:${col}`);setTimeout(()=>e.remove(),3300)}}
function shake(el){if(el&&el.animate&&!RM())el.animate([{translate:'0 0'},{translate:'-6px 0'},{translate:'6px 0'},{translate:'-4px 0'},{translate:'0 0'}],{duration:400})}
function flash(){const e=ev('i','','position:absolute;inset:0;background:rgba(255,240,200,.55)');if(e.animate)e.animate([{opacity:1},{opacity:0}],{duration:450}).onfinish=()=>e.remove();else e.remove()}
function fly(txt,a,b,c,d,dur,arc,rot,cb,fs){fs=fs||34;const e=ev('div','t',`font-size:${fs}px`,txt);
 if(!e.animate||RM()){e.remove();cb&&cb();return}
 const n=12,kf=[];for(let i=0;i<=n;i++){const k=i/n,x=a+(c-a)*k,y=b+(d-b)*k-Math.sin(Math.PI*k)*arc;kf.push({transform:`translate(${x-fs/2}px,${y-fs/2}px) rotate(${rot*k}deg)`})}
 e.animate(kf,{duration:dur,easing:'linear'}).onfinish=()=>{e.remove();cb&&cb()}}
function say(el,txt){if(!el)return;const[x,y]=ctr(el),e=ev('div','m',`left:${x}px;top:${y-30}px`,txt);setTimeout(()=>e.remove(),2300)}
function thr(fe,te,k){if(!fe||!te||!fe.isConnected||!te.isConnected)return;const it=ITEMS[k],[a,b]=ctr(fe),[c,d]=ctr(te),kd=it[4],root=fe.closest('#cv2,#xq2');
 const done=()=>{shake(te);shake(root)};
 if(kd==='punch'){fly('🥊',a,b,c,d,260,0,0,()=>{blob(c,d,'#fff3b0','POW!',84);ring(c,d,'#ffe066');done()},40);return}
 if(kd==='nade'){fly('💣',a,b,c,d,800,110,720,()=>{flash();blob(c,d,'rgba(255,150,40,.85)','💥',140);blob(c,d,'rgba(30,20,10,.55)','💥',90);ring(c,d,'#ff9a2e');stain(c,d,'#3a2a1a',8,14);done()});return}
 if(kd==='rocket'){fly('🚀',a,b,c,d,520,25,0,()=>{flash();blob(c,d,'rgba(255,120,30,.85)','💥',150);ring(c,d,'#ff6a1a');stain(c,d,'#3a2a1a',8,14);done()},38);
  for(let q=0;q<9;q++)setTimeout(()=>{const k2=q/9,e=ev('div','t',`font-size:18px;transform:translate(${a+(c-a)*k2-9}px,${b+(d-b)*k2-Math.sin(Math.PI*k2)*25-9}px)`,'🔥');setTimeout(()=>e.remove(),350)},q*55);return}
 if(kd==='durian'){fly('🍈',a,b,c,d,800,80,540,()=>{blob(c,d,'#e6c84a','🤢',100);stain(c,d,'#d9b93a',9,16);stain(c,d,'#8a9a2a',5,10);
  for(let q=0;q<4;q++)setTimeout(()=>{const s=ev('div','t','font-size:26px','💨');if(s.animate)s.animate([{transform:`translate(${c-20+q*12}px,${d-10}px)`,opacity:.9},{transform:`translate(${c-30+q*18}px,${d-70}px)`,opacity:0}],{duration:1400});setTimeout(()=>s.remove(),1400)},q*250);done()},34);return}
 fly(it[0],a,b,c,d,750,70,560,()=>{if(kd==='splat'){blob(c,d,it[2],it[3],96);stain(c,d,it[2],10,16)}else blob(c,d,it[2],it[3],70);done()})}
function avs(pl){const root=pl.closest('#cv2,#xq2');if(!root)return{};let me=null,op=null;root.querySelectorAll('.pcard').forEach(c=>{const nb=[...c.querySelectorAll('b')].find(x=>!x.closest('.av2')),nm=((nb||{}).textContent||'').trim(),a=c.querySelector('.av2');if(nm==='Bạn')me=a;else op=a});return{me,op}}
window.__cvThrowPanel=function(pl){const old=document.getElementById('cvthp');if(old){old.remove();return}layer();
 const PH=['Nhanh lên nào!','Hay lắm!','Cho qua nhé','Gg!','Xui quá…','Nước cờ đẹp!'],CR=['Ừ nhỉ','Haha','Đi đi chứ!','Đợi tí','Chơi tiếp nào'];
 const p=document.createElement('div');p.id='cvthp';
 p.innerHTML=`<div class="hd"><span>💬 Bảng chung · chat và ném đồ</span><button type="button" aria-label="Đóng">✕</button></div><div class="qp">${PH.map(t=>`<button type="button">${t}</button>`).join('')}</div><div class="in"><input maxlength="40" placeholder="Gõ tin nhắn..." aria-label="Tin nhắn"><button type="button" class="sd">Gửi</button></div><div class="g">${ITEMS.map((m,k)=>`<button type="button" data-k="${k}">${m[0]}<small>${m[1]}</small></button>`).join('')}</div>`;
 document.body.append(p);
 p.querySelector('.hd button').onclick=()=>p.remove();
 const talk=t=>{t=(t||'').trim();if(!t)return;p.remove();const A=avs(pl);say(A.me,t);setTimeout(()=>{const B=avs(pl);if(B.op)say(B.op,CR[Math.random()*CR.length|0])},1200)};
 p.querySelectorAll('.qp button').forEach(bt=>bt.onclick=()=>talk(bt.textContent));
 const inp=p.querySelector('input');p.querySelector('.sd').onclick=()=>talk(inp.value);inp.onkeydown=e=>{if(e.key==='Enter')talk(inp.value)};
 p.querySelectorAll('.g button').forEach(bt=>bt.onclick=()=>{const k=+bt.dataset.k;p.remove();const A=avs(pl);thr(A.me,A.op,k);
  setTimeout(()=>{const B=avs(pl);if(!B.op||!B.me)return;if(Math.random()<.85)say(B.op,REPLY[Math.random()*REPLY.length|0]);
   if(Math.random()<.5)setTimeout(()=>{const C=avs(pl);thr(C.op,C.me,Math.random()*ITEMS.length|0)},900)},900)})};
/* nút 💬 ở thanh dưới của cờ vua / cờ tướng */
const addBtn=()=>document.querySelectorAll('#cv2 .bbar,#xq2 .bbar').forEach(bar=>{if(bar.querySelector('.bchat'))return;const b=document.createElement('button');b.className='bb bchat';b.type='button';b.innerHTML='<span>💬</span>Chat';b.onclick=()=>window.__cvThrowPanel(b);bar.append(b)});
new MutationObserver(addBtn).observe(document.body,{childList:true,subtree:true});addBtn();
})();
