/*@file game/js/07-chess-xiangqi-v2.js
 * Cờ vua + cờ tướng (v2).
 */

/* ===== cờ vua + cờ tướng (từ v2) ===== */
(()=>{
const E=(h)=>{const d=document.createElement('div');d.innerHTML=h;return d.firstElementChild};
const layer=id=>{let t=document.getElementById(id);if(!t){t=document.createElement('div');t.className='gx';t.id=id;document.body.append(t)}t.hidden=false;return t};
const hideOthers=()=>['tb','game','cv2','xq2'].forEach(i=>{const e=document.getElementById(i);if(e)e.hidden=true});
const unlock=()=>{try{screen.orientation.unlock()}catch(e){}};
const so=window.setChips;
window.setChips=n=>{so(n);document.querySelectorAll('.chp').forEach(e=>e.textContent=fmt(n))};
const mkW=src=>{try{return new Worker(URL.createObjectURL(new Blob([src],{type:'text/javascript'})))}catch(e){return null}};
const askW=(w,msg,fb)=>new Promise(res=>{if(!w)return setTimeout(()=>res(fb(msg)),40);
const h=e=>{w.removeEventListener('message',h);res(e.data)};w.addEventListener('message',h);
w.onerror=()=>{w.removeEventListener('message',h);w.onerror=null;res(fb(msg))};w.postMessage(msg)});
const pct=n=>n*100+'%';
const tr=(r,c)=>`transform:translate(${c*100}%,${r*100}%)`;
/* ================= CỜ VUA ================= */
if(!document.getElementById('cvdefs'))document.body.insertAdjacentHTML('beforeend',`<svg id="cvdefs" width="0" height="0" style="position:absolute"><defs>
<linearGradient id="gw" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fffef9"/><stop offset=".55" stop-color="#ece3cc"/><stop offset="1" stop-color="#b9ad90"/></linearGradient>
<linearGradient id="gb" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#7a746c"/><stop offset=".5" stop-color="#34302c"/><stop offset="1" stop-color="#0c0b0a"/></linearGradient>
<symbol id="cp-p" viewBox="0 0 45 45"><circle cx="22.5" cy="12.5" r="5.2"/><path d="M17 20.5H28V22.2C28 22.7 27.6 23 27.1 23H17.9C17.4 23 17 22.7 17 22.2Z"/><path d="M18.3 23C18.3 28 15 30.5 13.8 34H31.2C30 30.5 26.7 28 26.7 23Z"/><path d="M10.5 38.5V36C10.5 34.8 11.6 34 12.8 34H32.2C33.4 34 34.5 34.8 34.5 36V38.5Z"/><path class="d" d="M20 9.8C21 8.9 22.4 8.6 23.6 9.1"/></symbol>
<symbol id="cp-r" viewBox="0 0 45 45"><path d="M14.5 34L16 21H29L30.5 34Z"/><path d="M13.5 21H31.5V18.2H13.5Z"/><path d="M13.5 18.2V9H17.6V12H20.4V9H24.6V12H27.4V9H31.5V18.2Z"/><path d="M10.5 38.5V36C10.5 34.8 11.6 34 12.8 34H32.2C33.4 34 34.5 34.8 34.5 36V38.5Z"/><path class="d" d="M17 24.5H28M16.2 29.5H28.8"/></symbol>
<symbol id="cp-n" viewBox="0 0 45 45"><path d="M14 34C13.5 28.5 15 25 19 22C20.2 21 19.5 20.2 18 21L14.2 23.6C12.7 24.6 11 23 11.7 21.5L15 15.4C16.8 12 19 9.8 21 8.8L21.4 5.6L24.4 8.2C31 9.2 35 14.5 35 22.5C35 27 34.8 30.5 34.6 34Z"/><path d="M10.5 38.5V36C10.5 34.8 11.6 34 12.8 34H32.2C33.4 34 34.5 34.8 34.5 36V38.5Z"/><circle class="e" cx="19.6" cy="14.4" r="1.3"/><circle class="e" cx="12.6" cy="21.6" r=".8"/><path class="d" d="M25.5 9.6C29.5 12 31.5 17 31 23.5M17.6 11.5C18.6 11 19.5 11 20.3 11.4"/></symbol>
<symbol id="cp-b" viewBox="0 0 45 45"><circle cx="22.5" cy="7.2" r="2.4"/><path d="M22.5 9.6C28 13.6 29.4 18.6 26.4 22.6H18.6C15.6 18.6 17 13.6 22.5 9.6Z"/><path d="M17 22.6H28V25.1H17Z"/><path d="M18.3 25.1C18.3 29 16.3 31.6 14.8 34H30.2C28.7 31.6 26.7 29 26.7 25.1Z"/><path d="M10.5 38.5V36C10.5 34.8 11.6 34 12.8 34H32.2C33.4 34 34.5 34.8 34.5 36V38.5Z"/><path class="d" d="M22.5 12.8V17.6M20.2 15.2H24.8"/></symbol>
<symbol id="cp-q" viewBox="0 0 45 45"><path d="M11.8 17.2L15.4 29.6L18.6 15.6L22.5 28.8L26.4 15.6L29.6 29.6L33.2 17.2L31.4 34H13.6Z"/><circle cx="11.8" cy="15.2" r="2.1"/><circle cx="18.6" cy="12.8" r="2.1"/><circle cx="22.5" cy="10.4" r="2.1"/><circle cx="26.4" cy="12.8" r="2.1"/><circle cx="33.2" cy="15.2" r="2.1"/><path d="M10.5 38.5V36C10.5 34.8 11.6 34 12.8 34H32.2C33.4 34 34.5 34.8 34.5 36V38.5Z"/><path class="d" d="M15.6 31.4H29.4"/></symbol>
<symbol id="cp-k" viewBox="0 0 45 45"><path d="M21 2.8H24V5.6H26.8V8.6H24V11.4H21V8.6H18.2V5.6H21Z"/><path d="M13 22C13 16.5 17.4 12.6 22.5 12.6C27.6 12.6 32 16.5 32 22C32 26.2 30.4 29.4 31 34H14C14.6 29.4 13 26.2 13 22Z"/><path d="M10.5 38.5V36C10.5 34.8 11.6 34 12.8 34H32.2C33.4 34 34.5 34.8 34.5 36V38.5Z"/><path class="d" d="M16 24.5C19 26 26 26 29 24.5M15.6 30H29.4"/></symbol>
</defs></svg>`);
const csrc=`const D8=${JSON.stringify(D8)},KN=${JSON.stringify(KN)},PV=${JSON.stringify(PV)};
const isW=${isW};
${cat}\n${cg}\n${cap}\nconst cle=${cle};\n${cev}\n${cnm}\n
onmessage=e=>{const{b,st,w}=e.data;let best=null,bs=-1e9;for(const m of cle(b,st,w)){const r=cap(b,st,m),s=-cnm(r.b,r.st,!w,2,-1e9,1e9)+Math.random()*8;if(s>bs){bs=s;best=m}}postMessage(best)}`;
const cfb=({b,st,w})=>{let best=null,bs=-1e9;for(const m of cle(b,st,w)){const r=cap(b,st,m),s=-cnm(r.b,r.st,!w,2,-1e9,1e9)+Math.random()*8;if(s>bs){bs=s;best=m}}return best};
let cW=null,vB,vS,vT,vH,vLm,vSel,vL,vOver,vk=0,vE,vHint;
let vHW=true,vPP=false,vBusy=false,vDc=0;
const cfi=i=>vHW?i:63-i,cwt=()=>vT===vHW;
const sp=p=>{const w=isW(p);return `<svg viewBox="0 0 45 45"><use href="#cp-${p.toLowerCase()}" fill="url(#${w?'gw':'gb'})" stroke="${w?'#3b2f22':'#000'}" stroke-width="1.3" stroke-linejoin="round"/></svg>`}
const VAL={p:1,n:3,b:3,r:5,q:9},INIT={p:8,n:2,b:2,r:2,q:1};
function boom(layer,x,y,rw,cols,txt){let h=`<i class="rg2" style="left:${x}%;top:${y}%;width:${rw}%"></i>`;
for(let k=0;k<14;k++){const a=Math.random()*6.28,d=18+Math.random()*32;h+=`<i class="pt" style="left:${x}%;top:${y}%;--dx:${Math.cos(a)*d}px;--dy:${Math.sin(a)*d}px;background:${cols[k%cols.length]}"></i>`}
if(txt)h+=`<b class="fv" style="left:${x}%;top:${y}%">${txt}</b>`;
const w=document.createElement('div');w.style.cssText='position:absolute;inset:0';w.innerHTML=h;layer.append(w);setTimeout(()=>w.remove(),1000)}
const cEl=(p,i)=>{const e=document.createElement('div');e.className='cpc '+(isW(p)?'pw':'pb');e.style.cssText=tr(cfi(i)>>3,cfi(i)&7);e.innerHTML=sp(p);return e};
const cMv=(e,i)=>{const j=cfi(i);e.style.transform=`translate(${(j&7)*100}%,${(j>>3)*100}%)`};
function cRebuild(){const pl=document.getElementById('cvpl');pl.innerHTML='';vE=Array(64).fill(null);
vB.forEach((p,i)=>{if(p!==' '){const e=cEl(p,i);pl.append(e);vE[i]=e}})}
function cHl(){const h=document.getElementById('cvh');if(!h)return;let s='';const q=(c,i)=>s+=`<i class="h ${c}" style="${tr(cfi(i)>>3,cfi(i)&7)}"></i>`;
vLm.forEach(i=>i>=0&&q('l',i));
const ks=vB.indexOf(cwt()?'K':'k');if(vOver||true){if(cat(vB,ks,!cwt()))q('k',ks)}
if(vSel>=0)q('s',vSel);
vL.forEach(m=>q(vB[m.t]!==' '||m.ep?'c':'d',m.t));
if(vHint)vHint.forEach(i=>q('t',i));
h.innerHTML=s}
function cEv(){const ev0=cev(vB),ev=vHW?ev0:-ev0,f=document.getElementById('cve'),t=document.getElementById('cvt');if(!f)return;
f.style.transform=`scaleX(${0.5+0.5*Math.tanh(ev/700)})`;t.textContent=(ev>0?'+':'')+(ev/100).toFixed(2);
const cnt={};vB.forEach(x=>{if(x!==' ')cnt[x]=(cnt[x]||0)+1});let sw=0,sb=0,hw='',hb='';
for(const k of 'qrbnp'){const lw=INIT[k]-(cnt[k.toUpperCase()]||0),lb=INIT[k]-(cnt[k]||0);
for(let i=0;i<lw;i++)hb+=`<span class="mi pw">${sp(k.toUpperCase())}</span>`;sb+=Math.max(0,lw)*VAL[k];
for(let i=0;i<lb;i++)hw+=`<span class="mi pb">${sp(k)}</span>`;sw+=Math.max(0,lb)*VAL[k]}
const d=sw-sb,e1=document.getElementById('cvt1'),e0=document.getElementById('cvt0');
{const dd=vHW?d:-d,tp=vHW?hb:hw,bt=vHW?hw:hb;e1.innerHTML=tp+(dd<0?`<em class="adv">+${-dd}</em>`:'');e0.innerHTML=bt+(dd>0?`<em class="adv">+${dd}</em>`:'')}}
const cMsg=m=>{const e=document.getElementById('cvm');if(e)e.textContent=m};
function cvg2(){hideOthers();unlock();const t=layer('cv2');
vB='rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR'.replace(/\//g,'').replace(/8/g,'        ').split('');
vS={c:{K:1,Q:1,k:1,q:1},ep:-1};vHW=Math.random()<.5;vT=vHW;vPP=false;vBusy=false;vDc=0;vH=[];vLm=[-1,-1];vSel=-1;vL=[];vOver=false;vHint=null;vk++;
let co='';for(let r=0;r<8;r++)co+=`<span class="co" style="left:1%;top:${r*12.5+.8}%;color:${r%2?'#efd2a2':'#b17a45'}">${vHW?8-r:r+1}</span>`;
for(let c=0;c<8;c++)co+=`<span class="co" style="left:${c*12.5+10.2}%;top:96.2%;color:${c%2?'#b17a45':'#efd2a2'}">${'abcdefgh'[vHW?c:7-c]}</span>`;
t.innerHTML=`<div class="gtop"><button class="rb2" id="cvx">‹</button><b>Cờ vua</b><span class="chp">${fmt(chips)}</span></div>
<div class="evb"><i id="cve"></i><span id="cvt">0.00</span></div>
<div class="pcard"><div class="av2">🦊</div><div class="pi"><b>Hà</b><small>Máy · quân ${vHW?'đen':'trắng'}</small><div class="tray" id="cvt1"></div></div></div>
<div class="bwrap"><div class="cvf"><div class="cvb" id="cvb">${co}<div id="cvh"></div><div id="cvpl"></div><div class="fxl" id="cvfx"></div></div></div></div>
<div class="pcard"><div class="av2">🦁</div><div class="pi"><b>Bạn</b><small>Quân ${vHW?'trắng':'đen'}</small><div class="tray" id="cvt0"></div></div></div>
<div class="smsg" id="cvm">${vHW?'Bạn cầm quân trắng, đi trước':'Bạn cầm quân đen, Hà đi trước'}</div>
<div class="bbar"><button class="bb" id="cvr"><span>🏳</span>Đầu hàng</button><button class="bb" id="cvhint"><span>💡</span>Gợi ý</button><button class="bb" id="cvd"><span>🤝</span>Xin hòa</button><button class="bb" id="cvu"><span>↶</span>Hoàn tác</button></div>`;
if(!cW)cW=mkW(csrc);
cRebuild();cHl();cEv();
document.getElementById('cvx').onclick=()=>{if(!vOver&&vH.length&&!t.classList.contains('spec')){vOver=true;count(Math.max(0,chips-TB));try{toast('Bạn rời bàn giữa ván cờ nên bị xử thua, mất '+TB+' chip')}catch(e){}}vk++;t.hidden=true};
if(document.getElementById('cvn'))document.getElementById('cvn').onclick=cvg2;
document.getElementById('cvr').onclick=()=>{if(vOver||vBusy)return;cPpClose();vOver=true;vk++;cMsg('Bạn đầu hàng. Mất '+TB);count(Math.max(0,chips-TB));endFx('resign','Bạn mất '+TB+' Chips')};
document.getElementById('cvu').onclick=()=>{if(vBusy||!vH.length||(!vT&&!vOver))return;cPpClose();vk++;const h=vH.pop();vB=h.b;vS=h.st;vLm=h.lm;vT=true;vOver=false;vSel=-1;vL=[];vHint=null;cRebuild();cHl();cEv();cMsg('Đã đi lại')};
document.getElementById('cvhint').onclick=async()=>{if(!vT||vOver||vPP||vBusy)return;const k=vk;const m=await askW(cW,{b:vB,st:vS,w:vHW},cfb);if(k!==vk||!m)return;vHint=[m.f,m.t];cHl();setTimeout(()=>{if(vHint&&vHint[0]===m.f){vHint=null;cHl()}},2200)};
document.getElementById('cvb').onpointerdown=e=>{if(vOver||!vT||vPP||vBusy)return;const r=e.currentTarget.getBoundingClientRect();
const c=Math.min(7,Math.max(0,Math.floor((e.clientX-r.left)/r.width*8))),rw=Math.min(7,Math.max(0,Math.floor((e.clientY-r.top)/r.height*8))),i=cfi(rw*8+c);
const m=vSel>=0&&vL.find(z=>z.t===i);
if(m){if(m.p)return cPromo(m);vH.push({b:vB,st:vS,lm:vLm});vHint=null;cApply(m);vT=false;vSel=-1;vL=[];return cAfter()}
if(vB[i]!==' '&&isW(vB[i])===vHW){vSel=i;vL=cle(vB,vS,vHW).filter(z=>z.f===i)}else{vSel=-1;vL=[]}
cHl()};
cSetup(t);
}

function cPpClose(){vPP=false;const p=document.getElementById('cvpp');if(p){p.hidden=true;p.innerHTML=''}}
function cPromo(m){const p=document.getElementById('cvpp');if(!p)return;vPP=true;
const LS=[['q','Hậu'],['r','Xe'],['b','Tượng'],['n','Mã']];
p.innerHTML=`<div class="ppc"><div class="ppt">✨ Phong cấp Tốt ✨</div><div class="pps">Chọn quân thay thế</div><div class="ppr">${LS.map(([k,n],j)=>`<button class="ppb" data-k="${k}" style="animation-delay:${j*90}ms"><span class="ppi">${sp(vHW?k.toUpperCase():k)}</span><small>${n}</small></button>`).join('')}</div><button class="ppx">Hủy</button></div>`;
p.hidden=false;
p.querySelectorAll('.ppb').forEach(b=>b.onclick=()=>{const k=b.dataset.k;cPpClose();vH.push({b:vB,st:vS,lm:vLm});vHint=null;cApply({...m,pc:k});vT=false;vSel=-1;vL=[];
const lay=document.getElementById('cvfx');if(lay)setTimeout(()=>boom(lay,((cfi(m.t)&7)+.5)*12.5,((cfi(m.t)>>3)+.5)*12.5,16,['#ffe27a','#fff3b0','#ff9d1c','#7ff3d2'],'Phong cấp!'),180);
try{snd('win')}catch(e){}cAfter()});
p.querySelector('.ppx').onclick=cPpClose}
async function cDraw(){if(vOver||vPP||vBusy)return;
if(!vT){cMsg('Hãy chờ đến lượt của bạn rồi hãy xin hòa');return}
if(vH.length<vDc){cMsg('Hà vừa từ chối hòa. Hãy đi thêm vài nước rồi xin lại');return}
vBusy=true;const k=vk;cMsg('Đã gửi lời xin hòa. Hà đang cân nhắc...');
await sleep(1100+Math.random()*1300);
if(k!==vk||vOver){vBusy=false;return}
const ev=cev(vB),adv=vHW?-ev:ev,pr=adv>300?0:adv>120?.1:adv>0?.35:adv>-150?.65:.9;vBusy=false;
if(Math.random()<pr){vOver=true;vk++;cMsg('Hà đồng ý hòa');endFx('draw','Hai bên đồng ý hòa · không ai mất Chips')}
else{vDc=vH.length+3;cMsg('Hà từ chối hòa. Ván đấu tiếp tục!')}}
function cSetup(t){const d=document.getElementById('cvd');if(d)d.onclick=cDraw;
t.insertAdjacentHTML('beforeend','<div class="ppk" id="cvpp" hidden></div>');
if(!vHW)setTimeout(()=>{if(!vOver&&!vT)cAfter()},450)}
function cApply(m){snd(vB[m.t]!==' '||m.ep?'splat':'tap');const w=isW(vB[m.f]),mover=vE[m.f],cs=m.ep?m.t+(w?8:-8):m.t,cp=vE[cs],lay=document.getElementById('cvfx');
if(cp){vE[cs]=null;cp.classList.add('x');setTimeout(()=>cp.remove(),430);const v=VAL[(vB[cs]||'p').toLowerCase()]||1;
if(lay)setTimeout(()=>boom(lay,((cfi(cs)&7)+.5)*12.5,((cfi(cs)>>3)+.5)*12.5,12.5,['#ffd23c','#ff8a3c','#fff3b0'],'+'+v),160);
const bd=document.getElementById('cvb');if(bd){bd.classList.remove('bump');void bd.offsetWidth;bd.classList.add('bump')}
mover.classList.add('hit')}
mover.classList.add('up');setTimeout(()=>mover.classList.remove('up','hit'),700);
vE[m.f]=null;vE[m.t]=mover;cMv(mover,m.t);
if(m.ca){const h=w?7:0,rf=m.ca===1?h*8+7:h*8,rt=m.ca===1?h*8+5:h*8+3,re=vE[rf];vE[rf]=null;vE[rt]=re;cMv(re,rt)}
const r=cap(vB,vS,m);vB=r.b;vS=r.st;vLm=[m.f,m.t];
if(m.p)mover.innerHTML=sp(vB[m.t])}
function ckC(mate){const ki=vB.indexOf(cwt()?'K':'k');if(ki<0)return;const hc=vHW?'trắng':'đen',bc=vHW?'đen':'trắng',j=cfi(ki);chkFx({lay:'cvfx',x:((j&7)+.5)*12.5,y:((j>>3)+.5)*12.5,sz:25,el:vE[ki],mate:mate,txt:mate?'CHIẾU HẾT!':'CHIẾU TƯỚNG!',sub:mate?(vT?'Vua '+hc+' của bạn bị chiếu hết':'Vua '+bc+' của Hà bị chiếu hết'):(vT?'Vua '+hc+' của bạn đang bị chiếu':'Vua '+bc+' của Hà đang bị chiếu')})}
async function cAfter(){cHl();cEv();const ms=cle(vB,vS,cwt()),ck=cat(vB,vB.indexOf(cwt()?'K':'k'),!cwt());
if(!ms.length||vB.filter(x=>x!==' ').length===2){vOver=true;
if(!ms.length&&ck){if(!vT){cMsg('Chiếu hết! Bạn thắng +'+fx(TB));count(chips+fx(TB));burst()}else{cMsg('Chiếu hết. Hà thắng, bạn mất '+TB);count(Math.max(0,chips-TB))}ckC(1);{const lw=vT;setTimeout(()=>endFx(lw?'lose':'win',lw?'Bạn mất '+TB+' Chips':'Bạn nhận '+fx(TB)+' Chips'),1700)}}
else{cMsg('Hòa');setTimeout(()=>endFx('draw','Không ai thắng, không ai mất Chips'),600)}return}
cMsg(ck?'Chiếu!':vT?'Lượt của bạn':'Hà đang nghĩ...');if(ck)ckC(0);
if(!vT){const k=++vk;const t0=Date.now(),th=botThink();const m=await askW(cW,{b:vB,st:vS,w:!vHW},cfb);const rs=th-(Date.now()-t0);if(rs>0)await sleep(rs);if(k!==vk||vOver||!m)return;cApply(m);vT=true;cAfter()}}
window.cvg=cvg2;

/* ================= CỜ TƯỚNG ================= */
const XCH={K:'帥',A:'仕',E:'相',H:'傌',R:'俥',C:'砲',P:'兵',k:'將',a:'士',e:'象',h:'馬',r:'車',c:'包',p:'卒'};
const xsrc=`const X4=${JSON.stringify(X4)},XV=${JSON.stringify(XV)};
const isW=${isW};const xap=${xap};const xle=${xle};
${xgen}\n${xchk}\n${xev}\n${xnm}\n
onmessage=e=>{const{b,w}=e.data;let best=null,bs=-1e9;for(const m of xle(b,w)){const s=-xnm(xap(b,m),!w,2,-1e9,1e9)+Math.random()*8;if(s>bs){bs=s;best=m}}postMessage(best)}`;
const xfb=({b,w})=>{let best=null,bs=-1e9;for(const m of xle(b,w)){const s=-xnm(xap(b,m),!w,2,-1e9,1e9)+Math.random()*8;if(s>bs){bs=s;best=m}}return best};
let xW=null,wB,wT,wH,wLm,wSel,wL,wOver,wk=0,wE,wHint;
let wHR=true,wBusy=false,wDc=0;
const xfi=i=>wHR?i:89-i,xwt=()=>wT===wHR;
const xEl=(p,i)=>{const e=document.createElement('div');e.className='xpc';const j=xfi(i);e.style.cssText=tr((j/9)|0,j%9);e.innerHTML=`<div class="xd ${isW(p)?'r':'b'}">${XCH[p]}</div>`;return e};
const xMv=(e,i)=>{const j=xfi(i);e.style.transform=`translate(${(j%9)*100}%,${((j/9)|0)*100}%)`;e.classList.add('up');setTimeout(()=>e.classList.remove('up'),260)};
function xRebuild(){const pl=document.getElementById('xqp');pl.innerHTML='';wE=Array(90).fill(null);
wB.forEach((p,i)=>{if(p!==' '){const e=xEl(p,i);pl.append(e);wE[i]=e}})}
function xHl(){const h=document.getElementById('xqh');if(!h)return;let s='';const q=(c,i)=>s+=`<i class="xh ${c}" style="${tr((xfi(i)/9)|0,xfi(i)%9)}"></i>`;
wLm.forEach(i=>i>=0&&q('l',i));
if(xchk(wB,xwt()))q('k',wB.indexOf(xwt()?'K':'k'));
if(wSel>=0)q('s',wSel);
wL.forEach(m=>q(wB[m[1]]!==' '?'c':'d',m[1]));
if(wHint)wHint.forEach(i=>q('t',i));
h.innerHTML=s}
const xMsg=m=>{const e=document.getElementById('xqm');if(e)e.textContent=m};
function xg2(){hideOthers();unlock();const t=layer('xq2');
wB=['rheakaehr','         ',' c     c ','p p p p p','         ','         ','P P P P P',' C     C ','         ','RHEAKAEHR'].join('').split('');
wHR=Math.random()<.5;wT=wHR;wBusy=false;wDc=0;wH=[];wLm=[-1,-1];wSel=-1;wL=[];wOver=false;wHint=null;wk++;
let ln='';for(let i=0;i<10;i++)ln+=`<path d="M20 ${20+i*40}H340"/>`;
for(let c=0;c<9;c++){const x=20+c*40;ln+=c%8?`<path d="M${x} 20V180M${x} 220V380"/>`:`<path d="M${x} 20V380"/>`}
ln+='<path d="M140 20L220 100M220 20L140 100M140 300L220 380M220 300L140 380"/>';
const mk=(x,y)=>[[-1,-1],[-1,1],[1,-1],[1,1]].map(([a,b])=>{const X=x+b*4,Y=y+a*4;return `M${X} ${Y+a*8}V${Y}H${X+b*8}`}).join('');
let mks='';[[2,1],[2,7],[7,1],[7,7],[3,0],[3,2],[3,4],[3,6],[3,8],[6,0],[6,2],[6,4],[6,6],[6,8]].forEach(([r,c])=>mks+=mk(20+c*40,20+r*40));
t.innerHTML=`<div class="gtop"><button class="rb2" id="xqx">‹</button><b>Cờ tướng</b><span class="chp">${fmt(chips)}</span></div>
<div class="pcard"><div class="av2">🦊</div><div><b>Hà</b><small>Máy · quân ${wHR?'đen':'đỏ'}</small></div></div>
<div class="xqb" id="xqb"><svg viewBox="0 0 360 400" preserveAspectRatio="none"><g stroke="#6b4413" stroke-width="1.5" fill="none">${ln}<path d="${mks}" stroke-width="1"/></g><rect x="20" y="20" width="320" height="360" fill="none" stroke="#6b4413" stroke-width="3"/><text x="105" y="207" fill="#6b4413" font-size="22" font-weight="700" text-anchor="middle" font-family="KaiTi,STKaiti,serif">楚 河</text><text x="255" y="207" fill="#6b4413" font-size="22" font-weight="700" text-anchor="middle" font-family="KaiTi,STKaiti,serif">漢 界</text></svg><div id="xqh"></div><div id="xqp"></div><div class="fxl" id="xqfx"></div></div>
<div class="pcard"><div class="av2">🦁</div><div><b>Bạn</b><small>Quân ${wHR?'đỏ':'đen'}</small></div></div>
<div class="smsg" id="xqm">${wHR?'Bạn cầm quân đỏ, đi trước':'Bạn cầm quân đen, Hà (đỏ) đi trước'}</div>
<div class="bbar"><button class="bb" id="xqr"><span>🏳</span>Đầu hàng</button><button class="bb" id="xqhint"><span>💡</span>Gợi ý</button><button class="bb" id="xqd"><span>🤝</span>Xin hòa</button><button class="bb" id="xqu"><span>↶</span>Đi lại</button></div>`;
if(!xW)xW=mkW(xsrc);
xRebuild();xHl();
document.getElementById('xqx').onclick=()=>{if(!wOver&&wH.length&&!t.classList.contains('spec')){wOver=true;count(Math.max(0,chips-TB));try{toast('Bạn rời bàn giữa ván cờ nên bị xử thua, mất '+TB+' chip')}catch(e){}}wk++;t.hidden=true};
if(document.getElementById('xqn'))document.getElementById('xqn').onclick=xg2;
document.getElementById('xqr').onclick=()=>{if(wOver||wBusy)return;wOver=true;wk++;xMsg('Bạn đầu hàng. Mất '+TB);count(Math.max(0,chips-TB));endFx('resign','Bạn mất '+TB+' Chips')};
document.getElementById('xqu').onclick=()=>{if(wBusy||!wH.length||(!wT&&!wOver))return;wk++;const h=wH.pop();wB=h.b;wLm=h.lm;wT=true;wOver=false;wSel=-1;wL=[];wHint=null;xRebuild();xHl();xMsg('Đã đi lại')};
document.getElementById('xqhint').onclick=async()=>{if(!wT||wOver||wBusy)return;const k=wk;const m=await askW(xW,{b:wB,w:wHR},xfb);if(k!==wk||!m)return;wHint=[m[0],m[1]];xHl();setTimeout(()=>{if(wHint&&wHint[0]===m[0]){wHint=null;xHl()}},2200)};
document.getElementById('xqb').onpointerdown=e=>{if(wOver||!wT||wBusy)return;const r=e.currentTarget.getBoundingClientRect();
const c=Math.min(8,Math.max(0,Math.floor((e.clientX-r.left)/r.width*9))),rw=Math.min(9,Math.max(0,Math.floor((e.clientY-r.top)/r.height*10))),i=xfi(rw*9+c);
const m=wSel>=0&&wL.find(z=>z[1]===i);
if(m){wH.push({b:wB,lm:wLm});wHint=null;xApply(m);wT=false;wSel=-1;wL=[];return xAfter()}
if(wB[i]!==' '&&isW(wB[i])===wHR){wSel=i;wL=xle(wB,wHR).filter(z=>z[0]===i)}else{wSel=-1;wL=[]}
xHl()};
xSetup();
}

async function xDraw(){if(wOver||wBusy)return;
if(!wT){xMsg('Hãy chờ đến lượt của bạn rồi hãy xin hòa');return}
if(wH.length<wDc){xMsg('Hà vừa từ chối hòa. Hãy đi thêm vài nước rồi xin lại');return}
wBusy=true;const k=wk;xMsg('Đã gửi lời xin hòa. Hà đang cân nhắc...');
await sleep(1100+Math.random()*1300);
if(k!==wk||wOver){wBusy=false;return}
const ev=xev(wB),adv=wHR?-ev:ev,pr=adv>300?0:adv>120?.1:adv>0?.35:adv>-150?.65:.9;wBusy=false;
if(Math.random()<pr){wOver=true;wk++;xMsg('Hà đồng ý hòa');endFx('draw','Hai bên đồng ý hòa · không ai mất Chips')}
else{wDc=wH.length+3;xMsg('Hà từ chối hòa. Ván đấu tiếp tục!')}}
function xSetup(){const d=document.getElementById('xqd');if(d)d.onclick=xDraw;
if(!wHR)setTimeout(()=>{if(!wOver&&!wT)xAfter()},450)}
function xApply(m){const mover=wE[m[0]],cp=wE[m[1]];snd(cp?'splat':'tap');
if(cp){wE[m[1]]=null;cp.classList.add('x');setTimeout(()=>cp.remove(),430);const lay=document.getElementById('xqfx'),i=m[1];
if(lay)setTimeout(()=>boom(lay,(xfi(i)%9+.5)/9*100,(((xfi(i)/9)|0)+.5)/10*100,11.1,['#ffd23c','#ff8a3c','#fff3b0']),160);
const bd=document.getElementById('xqb');if(bd){bd.classList.remove('bump');void bd.offsetWidth;bd.classList.add('bump')}}
wE[m[0]]=null;wE[m[1]]=mover;xMv(mover,m[1]);wB=xap(wB,m);wLm=m}
function ckX(mate){const ki=wB.indexOf(xwt()?'K':'k');if(ki<0)return;const hc=wHR?'đỏ':'đen',bc=wHR?'đen':'đỏ',j=xfi(ki);chkFx({lay:'xqfx',x:(j%9+.5)/9*100,y:(((j/9)|0)+.5)/10*100,sz:22,el:wE[ki],mate:mate,txt:mate?'CHIẾU BÍ!':'CHIẾU TƯỚNG!',sub:mate?(wT?'Tướng '+hc+' của bạn bị chiếu bí':'Tướng '+bc+' của Hà bị chiếu bí'):(wT?'Tướng '+hc+' của bạn đang bị chiếu':'Tướng '+bc+' của Hà đang bị chiếu')})}
async function xAfter(){xHl();const ms=xle(wB,xwt()),ck=xchk(wB,xwt());
if(!ms.length){wOver=true;const w=ck?'Chiếu bí':'Hết nước đi';
if(!wT){xMsg(w+'! Bạn thắng +'+fx(TB));count(chips+fx(TB));burst()}else{xMsg(w+'. Hà thắng, bạn mất '+TB);count(Math.max(0,chips-TB))}if(ck)ckX(1);{const lw=wT;setTimeout(()=>endFx(lw?'lose':'win',lw?'Bạn mất '+TB+' Chips':'Bạn nhận '+fx(TB)+' Chips'),ck?1700:600)}return}
xMsg(ck?'Chiếu tướng!':wT?'Lượt của bạn':'Hà đang nghĩ...');if(ck)ckX(0);
if(!wT){const k=++wk;const t0=Date.now(),th=botThink();const m=await askW(xW,{b:wB,w:!wHR},xfb);const rs=th-(Date.now()-t0);if(rs>0)await sleep(rs);if(k!==wk||wOver||!m)return;xApply(m);wT=true;xAfter()}}
window.xg=xg2;
})();
