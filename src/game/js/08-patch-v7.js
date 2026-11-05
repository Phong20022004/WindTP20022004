/*@file game/js/08-patch-v7.js
 * Patch v7.
 */

/* ===== PATCH v7 ===== */
var HF={c3:{f:[0,0,0],active:0,done:1},lg:{f:[0,0,0],done:1},pk:{f:[0,0],done:1}};
async function humanFlip(k){while(!HF.c3.done&&k===C3k)await sleep(120)}
(()=>{
const q=s=>document.querySelector(s);
let NOCHIP=false,lastChip=0;
/* --- âm thanh dịu hơn --- */
const snd0=snd;
function soft(k,p){if(!SND)return;try{AC=AC||new(window.AudioContext||window.webkitAudioContext)();if(AC.state==='suspended')AC.resume();const t=AC.currentTime;
const tn=(f,d,v,at=0,ty='sine')=>{const o=AC.createOscillator(),g=AC.createGain();o.type=ty;o.frequency.value=f;g.gain.setValueAtTime(.0001,t+at);g.gain.linearRampToValueAtTime(v,t+at+.015);g.gain.exponentialRampToValueAtTime(.0001,t+at+d);o.connect(g);g.connect(AC.destination);o.start(t+at);o.stop(t+at+d+.02)};
if(k==='chip'){tn(660,.11,.05);tn(990,.07,.02,.012)}
else if(k==='win')[392,494,587].forEach((f,i)=>tn(f,.45,.06,i*.13,'triangle'));
else if(k==='tick')tn(520,.04,.03);else if(k==='wtick'){/* tiếng gõ marimba theo thang ngũ cung, càng chậm càng trầm dần */const PS=[523.25,587.33,659.25,784,880,1046.5],k2=Math.round((p||0)*26),f=PS[(k2*2+(k2>>2))%PS.length]*(1-.18*(p||0));tn(f,.16,.10,0,'triangle');tn(f*2,.07,.035,0,'sine');tn(180,.03,.05,0,'square')}else if(k==='wstart'){/* trống dồn + arpeggio đi lên mở màn */[196,261.63,329.63,392,523.25,659.25,784].forEach((f,i)=>tn(f,.22,.06,i*.055,'triangle'));for(let i=0;i<6;i++)tn(120+i*8,.05,.07,i*.065,'square')}else if(k==='wcoin'){const PC=[784,988,1175,1319,1568];for(let i=0;i<(p||1);i++){tn(PC[i%PC.length]*(i>=PC.length?2:1),.14,.07,i*.09,'triangle');tn(PC[i%PC.length]*2,.08,.025,i*.09+.02)}}else if(k==='wwin'){/* nhạc trúng thưởng: hợp âm Đô trưởng bung rộng + chuông */[523.25,659.25,783.99,1046.5].forEach((f,i)=>tn(f,.6,.06,i*.1,'triangle'));[1046.5,1318.5,1568].forEach((f,i)=>tn(f,.5,.035,.42+i*.08,'sine'))}else if(k==='wlose'){/* trượt: bốn nốt đi xuống nhẹ nhàng, không gây khó chịu */[392,349.23,311.13,261.63].forEach((f,i)=>tn(f,.28,.05,i*.14,'triangle'))}else if(k==='check'){tn(210,.07,.14,0,'triangle');tn(210,.07,.12,.1,'triangle')}else if(k==='fold'){tn(400,.12,.09);tn(260,.2,.08,.09)}}catch(e){}}
snd=function(k){if(k==='chip'){if(NOCHIP)return;const n=performance.now();if(n-lastChip<200)return;lastChip=n;return soft('chip')}if(k==='win')return soft('win');return snd0(k)};
{const o=chipFly;chipFly=function(i){if(NOCHIP)return;return o(i)}}
{const o=lgact;lgact=function(i,a,to){const ck=(a==='c'&&LU-LC[i]<=0);NOCHIP=ck;try{o(i,a,to)}finally{NOCHIP=false}}}
{const o=pka;pka=function(i,a,to){const ck=(a==='c'&&Math.min(CU-BC[i],EF-TC[i])<=0);NOCHIP=ck;try{o(i,a,to)}finally{NOCHIP=false}}}
/* --- nút loa --- */
const syncSpk=()=>document.querySelectorAll('.spkb,#mu').forEach(b=>{const v=SND?'1':'0';if(b.dataset.v!==v){b.dataset.v=v;b.innerHTML=spkIcon(SND)}});
const mkSpk=c=>{const b=document.createElement('button');b.className='spkb '+(c||'');b.setAttribute('aria-label','Bật hoặc tắt âm thanh');b.innerHTML=spkIcon(SND);b.dataset.v=SND?'1':'0';b.onclick=()=>{SND^=1;syncSpk();if(SND)soft('tick')};return b};
document.addEventListener('click',()=>setTimeout(syncSpk,0),true);
{let gp=0;const gf=()=>{gp=0;document.querySelectorAll('.gtop').forEach(g=>{if(!g.querySelector('.spkb'))g.insertBefore(mkSpk('s2'),g.querySelector('.chp'))})};new MutationObserver(()=>{if(!gp)gp=requestAnimationFrame(gf)}).observe(document.body,{childList:true,subtree:true})}
/* --- đồng hồ 10 giây --- */
const TM={mine:false,t0:0,key:'',to:0},vis=()=>{const t=q('#tb');return t&&!t.hidden};
function tmrSync(key,mine,act){clearTimeout(TM.to);if(TM.mo){TM.mo.disconnect();TM.mo=null}if(!mine||!vis()){TM.mine=false;return}
if(!TM.mine||TM.key!==key){TM.mine=true;TM.key=key;TM.t0=Date.now()}
const sp=window.SPEC,el=Date.now()-TM.t0,av=q('#av0');
if(av&&!sp)av.insertAdjacentHTML('beforeend',`<svg class="tmr" viewBox="0 0 100 100"><circle cx="50" cy="50" r="47" pathLength="100" style="animation-delay:${-el}ms,${-el}ms"/></svg>`);
if(!sp){const mk=()=>{const a=q('#av0');if(TM.mine&&a&&!a.querySelector('.tmr')){const e2=Date.now()-TM.t0;a.insertAdjacentHTML('beforeend',`<svg class="tmr" viewBox="0 0 100 100"><circle cx="50" cy="50" r="47" pathLength="100" style="animation-delay:${-e2}ms,${-e2}ms"/></svg>`)}};TM.mo=new MutationObserver(mk);TM.mo.observe(document.body,{childList:true,subtree:true})}
TM.to=setTimeout(()=>{if(TM.mo){TM.mo.disconnect();TM.mo=null}if(!TM.mine||!vis())return;TM.mine=false;act()},Math.max(0,(sp?1000:10000)-el))}
const click=s=>{const b=q(s);if(b&&!b.disabled){b.click();return true}return false};
function tlAuto(){if(window.SPEC){if(!over&&turn===0)adv(0);return}
if(click('#pb'))return;let k=null;try{k=tlpick(HD[0])}catch(e){}
if(!k||!k.length){k=(typeof must3!=='undefined'&&must3&&HD[0].includes(12))?[12]:[Math.min(...HD[0])]}
sel=new Set(k);click('#pl2')}
function phAuto(){if(window.SPEC)return;if(click('#dr1')){setTimeout(phAuto,400);return}
const di=q('#di');if(!di)return;const hs=[...document.querySelectorAll('#tb .hc')],c=hs.filter(x=>!x.classList.contains('meld')),a=c.length?c:hs,p=a[a.length-1];if(p){fs=+p.dataset.v;di.click()}}
const lgAuto=()=>click(window.SPEC||LU-LC[0]>0?'#qf':'#qc'),pkAuto=()=>click(window.SPEC||Math.min(CU-BC[0],EF-TC[0])>0?'#pf':'#pc');
/* --- lật bài --- */
function flipUI(k,cards){const F=HF[k],h=q('.hand2');if(!h||F.done||!cards)return;
if(window.SPEC){F.f=F.f.map(()=>1);return flipDone(k,cards)}
h.innerHTML=cards.map((v,j)=>F.f[j]?pcx(v,''):`<div class="cb2 fl2" data-j="${j}"></div>`).join('');
const flipOne=e=>{const j=+e.dataset.j;if(F.f[j])return;F.f[j]=1;snd('flip');const n=document.createElement('div');n.innerHTML=pcx(cards[j],' flp');e.replaceWith(n.firstChild);if(F.f.every(Boolean))setTimeout(()=>flipDone(k,cards),600)};
h.querySelectorAll('.fl2').forEach(e=>e.onclick=()=>flipOne(e));h.style.touchAction='none';
h.onpointermove=ev=>{if(ev.pointerType==='mouse'&&!ev.buttons)return;const el=document.elementFromPoint(ev.clientX,ev.clientY),c=el&&el.closest?el.closest('.fl2'):null;if(c&&h.contains(c))flipOne(c)};
const bt=q('.bt2');if(bt&&!q('#flp')){bt.insertAdjacentHTML('beforeend','<button class="b2 g" id="flp">LẬT BÀI</button>');q('#flp').onclick=()=>{F.f=F.f.map(()=>1);snd('flip');flipDone(k,cards)}}
if(k==='c3'){const b=q('#c3b');if(b)b.style.display='none'}
else{const l=document.querySelectorAll('.mid2 .lab');if(l.length)l[l.length-1].style.visibility='hidden'}}
function flipDone(k,cards){const F=HF[k];if(!F.f.every(Boolean))return flipUI(k,cards);F.done=1;const p=q('#flp');if(p)p.remove();
const h=q('.hand2');if(h)h.innerHTML=cards.map((v,j)=>pcx(v,' new',`style="animation-delay:${j*80}ms"`)).join('');
document.querySelectorAll('.mid2 .lab').forEach(l=>l.style.visibility='')}
{const o=lieng;lieng=function(){HF.lg={f:[0,0,0],done:0};o()}}
{const o=pkg;pkg=function(){HF.pk={f:[0,0],done:0};o()}}
{const o=lgr;lgr=function(){o();if(Lo)HF.lg.done=1;flipUI('lg',LH[0]);tmrSync('lg',!Lo&&LQ[0]===0,lgAuto)}}
{const o=pkr;pkr=function(){o();if(Po)HF.pk.done=1;flipUI('pk',HH[0]);tmrSync('pk',!Po&&PQ[0]===0,pkAuto)}}
{const o=dr;dr=function(){o();tmrSync('tl',!over&&turn===0,tlAuto)}}
{const o=pr;pr=function(){o();tmrSync('ph',!fo&&FT===0,phAuto)}}
/* --- Chương: hiệu ứng riêng cho nhân vật cầm cái --- */
function tlcrown(i){const fx=q('#fxl');if(!fx||!q('#av'+i))return;const[a,b]=tlpos(i),e=document.createElement('div');e.className='crwn';e.style.cssText=`left:${a}px;top:${b}px`;
e.innerHTML='<b>👑</b>'+[0,1,2,3,4,5].map(k=>`<i style="--a:${k*60}deg">✦</i>`).join('');fx.append(e);setTimeout(()=>e.remove(),2300)}
let LCD=-2;
{const c0=c3;c3=function(){LCD=-2;c0()}}
{const o=c3r;c3r=function(){o();if(HF.c3.active&&!HF.c3.done)flipUI('c3',C3H[0]);
if(CD>=0){const a=q('#av'+CD);if(a)a.classList.add('cai');if(CD!==LCD){LCD=CD;setTimeout(()=>tlcrown(CD),300)}}}}
/* --- thối / móm: chỉ hiệu ứng ở avatar 2 giây --- */
window.tlmark=function(i,t){const fx=q('#fxl'),av=q('#av'+i);if(!fx||!av)return;const[a,b]=tlpos(i),e=document.createElement('div');e.className='mk';
e.innerHTML=`<i>${t==='MÓM'?'😵':t==='CÓNG'?'😱':t==='LỦNG'?'💥':'🤢'}</i><b>${t}</b>`;e.style.left=a+'px';e.style.top=b+'px';fx.append(e);av.classList.add('bad');snd('splat');
setTimeout(()=>{e.remove();av.classList.remove('bad')},2000)};
/* --- sảnh mới + quay may mắn --- */
G.vq={n:'Quay may mắn',sub:'Quay nhận Chips',g:'🎡',play:1,r:['Mỗi lượt quay tốn 200 Chips. Cứ 5 phút có 1 lượt quay miễn phí.','Vòng quay có 8 ô: 100, 200, 300, 500, 1.000, 2.000 Chips hoặc trượt (✕).','Ô nhỏ trúng nhiều hơn ô lớn. Hết Chip: mua gói khóa học Premium hoặc làm nhiệm vụ trong WINDTP để nhận thêm.','Chip dùng chung với app WINDTP, chỉ để chơi trong game, không rút hay đổi thành tiền.']};
const ART={
tl:['TIẾN LÊN','linear-gradient(#2f9a5a,#0d3d27)','<i class="ca" style="--r:-16deg;--x:-34px">2♠</i><i class="ca" style="--r:0deg;--x:0px">2♣</i><i class="ca r" style="--r:16deg;--x:34px">2♥</i>'],
phom:['PHỎM','linear-gradient(#8a45c8,#2a1050)','<i class="ca r" style="--r:-12deg;--x:-26px">Q♦</i><i class="ca" style="--r:12deg;--x:26px">Q♠</i>'],
'3c':['BA CÂY','linear-gradient(#3a78e0,#10265e)','<i class="ca" style="--r:-16deg;--x:-34px">K♣</i><i class="ca r" style="--r:0deg;--x:0px">Q♥</i><i class="ca r" style="--r:16deg;--x:34px">J♦</i>'],
lieng:['LIÊNG','linear-gradient(#cf3a58,#4a0b1d)','<i class="ca" style="--r:-16deg;--x:-34px">A♣</i><i class="ca r" style="--r:0deg;--x:0px">2♦</i><i class="ca r" style="--r:16deg;--x:34px">3♥</i>'],
cv:['CỜ VUA','linear-gradient(#5a7fae,#17283d)','<b class="pcs kn">♞</b>'],
ct:['CỜ TƯỚNG','linear-gradient(#e0c090,#8a5a2a)','<b class="pcs rd">帥</b>'],
pk:['POKER','linear-gradient(#22a08a,#073a34)','<i class="ca" style="--r:-12deg;--x:-26px">A♠</i><i class="ca r" style="--r:12deg;--x:26px">A♥</i>'],
vq:['QUAY MAY MẮN','linear-gradient(#e8aa28,#6a2a05)','<div class="wh"></div>']};
$('#lobby').innerHTML=Object.keys(ART).map(id=>{const[t,bg,a]=ART[id];return `<button class="tile gt" data-id="${id}" style="--g:${bg}" aria-label="${t}">${a}${id==='vq'?'<span class="new">MỚI</span>':''}<span class="nm${t.length>8?' sm2':''}">${t}</span></button>`}).join('');
document.querySelectorAll('.gt').forEach(b=>{b.onclick=()=>{cur=b.dataset.id;const g=G[cur];$('#st').textContent=g.n;$('#sr').innerHTML=g.r.map(x=>`<li>${x}</li>`).join('');const p=$('#play');p.style.display='';p.disabled=false;p.textContent=g.play?'Chơi thử':'Xem bàn mẫu';$('#sheet').hidden=false};b.addEventListener('click',()=>cfgShow())});
{const po=$('#play').onclick;$('#play').onclick=()=>{if(cur==='vq'){$('#sheet').hidden=true;wheelGame();return}if(!cur){$('#sheet').hidden=true;return}po()}}
{const hd=q('header'),ch=$('#chips'),w=document.createElement('div');w.className='hr';hd.append(w);w.append(mkSpk('s1'),ch)}
document.body.insertAdjacentHTML('beforeend','<nav class="dock"><button id="dkq"><b>🎡</b>Quay may mắn</button><button id="dkr"><b>📖</b>Quy định</button></nav>');
$('#dkq').onclick=()=>wheelGame();
$('#dkr').onclick=()=>{cur=null;$('#st').textContent='Quy định';$('#sr').innerHTML=['Chip dùng chung với app WINDTP, chỉ để chơi trong game, không rút hay đổi thành tiền.','Luật mỗi trò theo cách chơi phổ biến ở Việt Nam, có thể khác đôi chút theo từng bàn.','Đến lượt bạn có 10 giây để chọn. Hết giờ, vòng sáng quanh avatar tắt và bạn tự động bỏ lượt.','Bấm nút loa để bật hoặc tắt âm thanh.'].map(x=>`<li>${x}</li>`).join('');$('#play').style.display='none';$('#sheet').hidden=false};
/* vòng quay: 2 lượt miễn phí mỗi ngày, thêm lượt bằng nhiệm vụ, quay không mất Chips */
const WP=[[100,'#ff5d73'],[0,'#26324d'],[300,'#19c37d'],[200,'#2d9cff'],[1000,'#a259ff'],[0,'#1c2740'],[500,'#ffb020'],[2000,'#ff3d9a']],WW=[24,14,10,22,3,12,6,1];
let rot=0,spinning=false,hist=[],mem=null;
const pt=(r,d)=>[(r*Math.sin(d*Math.PI/180)).toFixed(2),(-r*Math.cos(d*Math.PI/180)).toFixed(2)];
const dkey=()=>{const d=new Date();return d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate()};
const ST0=()=>({d:dkey(),left:2,plays:0,wins:0,c:{share:0,play:0,win:0}});
const wload=()=>{let x=null;try{x=JSON.parse(localStorage.getItem('bbl_wheel')||'null')}catch(e){}if(!x)x=mem;if(!x||x.d!==dkey())x=ST0();mem=x;return x};
const wsave=x=>{mem=x;try{localStorage.setItem('bbl_wheel',JSON.stringify(x))}catch(e){}};
['tien','phom','lieng','pkg','cvg','xg','c3deal'].forEach(n=>{const o=window[n];if(typeof o==='function')window[n]=function(...a){const x=wload();x.plays++;wsave(x);return o.apply(this,a)}});
{const o=window.burst;window.burst=function(){const v=document.getElementById('vq2');if(!v||v.hidden){const x=wload();x.wins++;wsave(x)}return o.apply(this,arguments)}}
const MS=[{k:'share',t:'Chia sẻ link game cho bạn bè',d:'+1 lượt quay'},{k:'play',t:'Chơi 3 ván bài bất kỳ',g:3,n:x=>x.plays},{k:'win',t:'Thắng 1 ván',g:1,n:x=>x.wins}];
function wheelGame(){['tb','game','cv2','xq2'].forEach(i=>{const e=document.getElementById(i);if(e)e.hidden=true});try{screen.orientation.unlock()}catch(e){}
let t=document.getElementById('vq2');if(!t){t=document.createElement('div');t.id='vq2';t.className='gx';document.body.append(t)}t.hidden=false;if(!document.getElementById('vqst'))document.head.insertAdjacentHTML('beforeend','<style id="vqst">#vq2 .vqbg{background:radial-gradient(circle at 50% 28%,#4a2a8c,#150b38 72%)}#vq2 .vqw{background:conic-gradient(#ffe27a,#ff9f1c,#ffe27a,#ff9f1c,#ffe27a,#ff9f1c,#ffe27a);box-shadow:0 10px 30px rgba(0,0,0,.65),0 0 28px rgba(255,190,60,.45)}#vq2 .vqw::before{border-color:#fff}#vq2 .hub{background:radial-gradient(#fff,#ffb020);border-color:#9a5b00}</style>');
const nch=v=>v>=2000?5:v>=1000?4:v>=500?3:v>=200?2:v>0?1:0;
const seg=WP.map(([v,c],i)=>{const[x0,y0]=pt(100,i*45),[x1,y1]=pt(100,i*45+45),m=i*45+22.5,n=nch(v);let ch='';for(let k=0;k<n;k++){const cx=((k-(n-1)/2)*6.6).toFixed(1);ch+=`<circle cx="${cx}" cy="-42" r="3.1" fill="#ffd84a" stroke="#9a5b00" stroke-width=".7"/><circle cx="${cx}" cy="-42" r="1.5" fill="none" stroke="#fff3b0" stroke-width=".5"/>`}
return `<path d="M0 0L${x0} ${y0}A100 100 0 0 1 ${x1} ${y1}Z" fill="${c}" stroke="#fff6d0" stroke-width="1.5"/><g transform="rotate(${m})">${ch}<text transform="translate(0 -70)" text-anchor="middle" dominant-baseline="central" fill="#fff" stroke="rgba(0,0,0,.35)" stroke-width=".6" font-weight="900" font-size="${v>=1000?14:16}">${v?v.toLocaleString('vi-VN'):'✕'}</text></g>`}).join('');
t.innerHTML=`${VQBG()}<div class="gtop"><button class="rb2" id="vqx">‹</button><b>Quay may mắn</b><span class="chp">${fmt(chips)}</span></div>
<div class="vqw"><div class="ptr"></div><div class="vqr" id="vqr" style="transform:rotate(${rot}deg)"><svg viewBox="-100 -100 200 200"><defs><radialGradient id="vg"><stop offset=".5" stop-color="#fff" stop-opacity=".12"/><stop offset="1" stop-color="#000" stop-opacity=".38"/></radialGradient></defs>${seg}<circle r="100" fill="url(#vg)"/></svg></div><button class="hub" id="vqh2">SPIN</button></div>
<div class="smsg" id="vqm">Chạm SPIN hoặc nút bên dưới để quay</div><button class="btn vqb" id="vqb"></button><div class="vqn">Mỗi ngày có 2 lượt miễn phí. Quay không mất Chips.</div><div class="vqmn" id="vqmn"></div><div class="vqh" id="vqh"></div>`;
const msg=s=>{const e=$('#vqm');if(e)e.textContent=s},hh=()=>{const e=$('#vqh');if(e)e.innerHTML=hist.slice(0,6).map(v=>`<span>${v?'+'+v:'✕'}</span>`).join('')};
const ui=()=>{const x=wload(),b=$('#vqb');if(!b)return;b.textContent=x.left>0?'QUAY · CÒN '+x.left+' LƯỢT':'HẾT LƯỢT HÔM NAY';b.disabled=spinning||x.left<=0;
$('#vqmn').innerHTML='<h4>Nhiệm vụ nhận thêm lượt quay</h4>'+MS.map(m=>{const done=x.c[m.k],n=m.n?m.n(x):0,ok=m.n?n>=m.g:true;return `<div class="msn"><span>${m.t}<small>${m.d||('+1 lượt quay ('+Math.min(n,m.g)+'/'+m.g+')')}</small></span><button data-k="${m.k}" ${done||!ok?'disabled':''}>${done?'ĐÃ NHẬN':m.k==='share'?'CHIA SẺ':ok?'NHẬN +1':'CHƯA XONG'}</button></div>`}).join('');
$('#vqmn').querySelectorAll('button').forEach(bt=>bt.onclick=()=>claim(bt.dataset.k))};
const grant=k=>{const x=wload();if(x.c[k])return;x.c[k]=1;x.left++;wsave(x);msg('+1 lượt quay!');soft('win');ui()};
const claim=async k=>{if(k!=='share')return grant(k);
const url=(function(){try{const u=window.__WIND().appUrl();if(u)return u}catch(e){}try{return window.parent.location.href.split('#')[0]}catch(e){}return location.href.split('#')[0]})();let ok=false;
try{if(navigator.share){await navigator.share({title:'Long Tranh Hổ Đấu',text:'Chơi bài cùng mình nhé! Mỗi ngày có vòng quay may mắn.',url});ok=true}else if(navigator.clipboard){await navigator.clipboard.writeText(url);ok=true;msg('Đã sao chép link, hãy gửi cho bạn bè')}}catch(e){if(e&&e.name==='AbortError')return}
if(!ok){try{prompt('Sao chép link này và gửi cho bạn bè:',url);ok=true}catch(e){}}
if(ok)grant('share')};
const spin=()=>{if(spinning)return;const x=wload();if(x.left<=0){msg('Hết lượt, làm nhiệm vụ để có thêm lượt');return}
x.left--;wsave(x);spinning=true;ui();msg('Đang quay...');
let r=Math.random()*WW.reduce((a,b)=>a+b),idx=0;while(r>=WW[idx]){r-=WW[idx];idx++}
rot=rot-(rot%360)+360*6+(360-(idx*45+22.5))+(Math.random()-.5)*30;
const el=$('#vqr');el.style.transition='transform 4.8s cubic-bezier(.12,.62,.08,1)';el.style.transform=`rotate(${rot}deg)`;
soft('wstart');for(let k=1;k<=26;k++)setTimeout(()=>soft('wtick',k/26),4600*Math.pow(k/26,.45));
setTimeout(()=>{spinning=false;const v=WP[idx][0];hist.unshift(v);
if(v){count(chips+v);msg('Trúng '+fmt(v)+'!');soft('wwin');soft('wcoin',nch(v));if(v>=500)burst()}else{msg('Trượt rồi, quay tiếp nhé');soft('wlose')}
setTimeout(()=>{const c=document.querySelector('#vq2 .chp');if(c)c.textContent=fmt(chips)},700);ui();hh()},4950)};
ui();hh();$('#vqx').onclick=()=>{if(!spinning)t.hidden=true};$('#vqb').onclick=spin;$('#vqh2').onclick=spin}
G.vq.r=['Mỗi ngày có 2 lượt quay miễn phí. Quay không mất Chips, không bao giờ bị trừ Chips.','Vòng quay có 8 ô: 100, 200, 300, 500, 1.000, 2.000 Chips hoặc trượt (✕, không nhận gì và cũng không mất gì).','Chạm chữ SPIN ở giữa hoặc bấm nút bên dưới để quay.','Hết lượt thì làm nhiệm vụ để nhận thêm: chia sẻ link cho bạn bè, chơi 3 ván, thắng 1 ván, mỗi nhiệm vụ +1 lượt mỗi ngày.','Chip dùng chung với app WINDTP, chỉ để chơi trong game, không rút hay đổi thành tiền.'];
window.wheelGame=wheelGame;
})();
