/*@file game/js/17c-ready-and-spectator.js
 * ⚠ Trong IIFE patch v28: nút SẴN SÀNG, khán giả.
 */
/* ===== v29: vào bàn chơi ngay · hết ván có nút SẴN SÀNG 12 giây (không bấm bị mời ra) · vào bàn đang đấu thì làm khán giả ===== */
(()=>{
const q=s=>document.querySelector(s);
const MULTI=new Set(['tl','phom','3c','lieng','pk']),
DG={tl:'tl',phom:'phom','3c':'c3',lieng:'lieng',pk:'pk'},
POOL_N=['Hùng','Linh','Tú','Vy','Đạt','Quân','Trang','Bảo','Khoa','Ngân','Phát','Yến','Duy','Hân','Lộc','Thư'],
POOL_A=['🐻','🐰','🦉','🐧','🦖','🐲','🐶','🐱','🐨','🦋','🐢','🦈','🐳','🐞','🦜','🐘'],
NM0=NM.slice(),AVT0=AVT.slice(),
READY_DELAY=3000,  /* bảng VÁN MỚI / RỜI BÀN hiện sau 3 giây kể từ khi ván kết thúc */
READY_MS=12000,   /* thời gian bấm sẵn sàng sau mỗi ván */
LIVE_P=55,        /* % bàn (đã có từ 2 người trở lên) đang có ván diễn ra khi bạn bước vào */
LIVE_WIN=180000;  /* một bàn giữ nguyên trạng thái đang đấu / đang chờ trong từng khoảng 3 phút */
let SPECCH=null,SPECUNTIL=0,SC0=null,BYPASS=false,CTX={own:false,id:''},SES=null,RS=[],INMATCH=false,MC=0,RD=null,RDC=0,PANEL=false,PCONF=-1,TT=0,PCT=0,SPECEL=null,MO=null,MOH=null;
const STARTER={},PIN=new Set();let JT=[],KKT=0;const isHost=()=>!!SES&&SES.ownerSeat===0;
window.SPEC=false;
const newRS=()=>Array.from({length:8},()=>({k:0,l:0}));RS=newRS();
const hs=s=>{let x=7;for(const c of s)x=(Math.imul(x,31)+c.charCodeAt(0))>>>0;return x};
const seatN=g=>g==='tl'||g==='phom'?NA:g==='cv'||g==='ct'?2:CFG[g].n;
const isOpen=g=>{if(g==='cv'||g==='ct'){const e=document.getElementById(g==='cv'?'cv2':'xq2');return !!e&&!e.hidden}
const t=document.getElementById('tb');return !!t&&!t.hidden&&t.dataset.g===DG[g]};
const hostOf=g=>document.getElementById(g==='cv'?'cv2':g==='ct'?'xq2':'tb');
const fxNow=()=>document.querySelector('.endfx');
const ended=g=>g==='tl'?over:g==='phom'?fo:g==='lieng'?Lo:g==='pk'?Po:g==='3c'?(C3o&&C3H.length>0):(g==='cv'||g==='ct')?(!!fxNow()&&fxNow()!==(SES&&SES.fx0)):false;
/* bàn có ít nhất 2 người đang ngồi thì có thể đang giữa ván (cùng công thức số người ở sảnh) */
/* trạng thái bàn: 'live' = đang diễn ra, 'prep' = hết ván, đang chờ mọi người bấm ván mới, '' = chưa đủ người.
   Sảnh (ô bàn) và lúc vào bàn dùng chung hàm này nên nhãn luôn khớp với việc bạn được xem hay được chơi. */
function tstate(g,id,n){if(!MULTI.has(g)||!id||!(n>=3))return '';const o=1+hs(id)%(n-1);if(o<2)return '';
const w=Math.floor((Date.now()+hs(id+'|off')%LIVE_WIN)/LIVE_WIN);
return hs(id+'|live|'+w)%100<LIVE_P?'live':'prep'}
window.BBL_TS=tstate;
function isLive(g,id){return tstate(g,id,seatN(g))==='live'}

const st=document.createElement('style');
st.textContent=`#rdy{position:absolute;left:50%;bottom:10px;transform:translateX(-50%);z-index:55;width:min(440px,94%);pointer-events:auto;color:#f6e7c8;font-family:system-ui,sans-serif}
#rdy.cvx{bottom:86px}
.rdb{border:2px solid #d9b25f;border-radius:16px;padding:10px;background:linear-gradient(rgba(58,40,18,.97),rgba(21,13,5,.97));box-shadow:0 8px 24px rgba(0,0,0,.65)}
.rdlog{min-height:0;margin-bottom:4px;text-align:center;font-size:11px;font-weight:700;color:#ffb48a}
.rdg{display:flex;flex-wrap:wrap;gap:6px;justify-content:center;margin-bottom:8px}
.rds{display:flex;flex-direction:column;align-items:center;gap:1px;min-width:84px;padding:5px 6px;border-radius:10px;border:2px solid #7a5a2a;background:#150d05;min-width:0}
.rds.ok{border-color:#5fd68a}.rds.rme{box-shadow:0 0 0 2px rgba(255,217,120,.5)}
.rda{font-size:20px;line-height:1.1}
.rds b{max-width:96px;font-size:10px;color:#ffe9a8;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.rds em{font-style:normal;font-size:10px;font-weight:800;white-space:nowrap}.rdok{color:#7dff9a}.rdwt{color:#d8c49a}
.rdk{margin-top:2px;height:18px;padding:0 8px;border-radius:999px;border:1.5px solid #ff9a8a;background:#2a0a07;color:#ff9a8a;font-size:10px;font-weight:800}
.rdk.cf{background:#b3261e;color:#fff;border-color:#fff}
.rdi{text-align:center;font-weight:800;font-size:13px;color:#ffd978}
.rdbar{height:7px;margin:6px 0 3px;border-radius:99px;background:#150d05;border:1px solid #7a5a2a;overflow:hidden}
.rdbar i{display:block;height:100%;width:100%;background:linear-gradient(90deg,#ff4b3a,#ffd24a);transition:width .25s linear}
.rdt{min-height:15px;text-align:center;font-size:11px;color:#d8c49a}
.rda2{display:flex;gap:8px;margin-top:6px}
.rdbtn{flex:1;height:44px;border-radius:12px;border:2px solid #fff3b0;background:linear-gradient(#ffd978,#d08a1c);color:#3a1a00;font:900 15px system-ui,sans-serif;box-shadow:0 3px 0 #6a3a05}
.rdbtn.sec{flex:0 0 30%;background:#150d05;color:#ffd978;border-color:#7a5a2a;box-shadow:none}
.rdbtn.on{background:linear-gradient(#7dff9a,#2fa85a);border-color:#d8ffe3;color:#04290f}
.rdbtn:disabled{opacity:.55}
#rdspec{position:absolute;top:6px;left:50%;transform:translateX(-50%);z-index:56;display:flex;align-items:center;gap:8px;max-width:80%;padding:4px 5px 4px 12px;border-radius:999px;border:2px solid #d9b25f;background:rgba(21,13,5,.93);color:#ffd978;font:800 12px system-ui,sans-serif;white-space:nowrap;pointer-events:auto}
#rdspec button{height:24px;padding:0 10px;border-radius:999px;border:1.5px solid #ff9a8a;background:#2a0a07;color:#ff9a8a;font-size:11px;font-weight:800}
#tb.spec .me,#tb.spec .hand,#tb.spec .hand2,#tb.spec .fan,#tb.spec .bt2,#tb.spec #rdsb,#tb.spec #hint,#tb.spec .tmr{visibility:hidden!important;pointer-events:none!important}
.rdp{position:absolute;left:8px;top:54px;z-index:45;width:min(300px,70%);max-height:78%;overflow:auto;padding:10px;border:2px solid #d9a45a;border-radius:14px;background:rgba(30,8,16,.97);color:#f6e7c8;font-size:12px;pointer-events:auto}
.rdp h4{margin:0 0 6px;display:flex;justify-content:space-between;align-items:center;font:900 13px Georgia,serif;color:#ffd978}
.rdp h4 button{border:0;background:none;color:#ffd978;font-size:16px}
.rdr{display:flex;align-items:center;gap:6px;padding:5px 0;border-top:1px solid rgba(255,255,255,.1)}
.rdr span.a{font-size:18px}.rdr b{flex:1;min-width:0;font-size:12px}
.rdr em{font-style:normal;font-size:10px;font-weight:800;color:#ff9a8a;margin-right:4px}
.rdr button,.rdp .rdpl{border:1.5px solid #ff9a8a;background:#2a0a07;color:#ff9a8a;border-radius:999px;padding:3px 9px;font-size:11px;font-weight:800}
.rdr button.cf{background:#b3261e;color:#fff}
.rdp .rdpl{display:block;width:100%;margin-top:8px;padding:7px;border-color:#ffd978;color:#ffd978;font-size:12px}
.rdp small{display:block;margin-top:6px;color:#d8c49a;line-height:1.35}
/* bảng VÁN MỚI thu nhỏ, nằm chính giữa bàn để không che bài và số tiền cộng/trừ quanh các ghế */
#rdy{left:50%;top:50%;bottom:auto;transform:translate(-50%,-50%);width:min(244px,68%)}
#rdy.cvx{top:auto;bottom:86px;transform:translateX(-50%);width:min(300px,88%)}
.rdb{padding:6px 8px 7px;border-width:1.5px;border-radius:12px;background:linear-gradient(rgba(58,40,18,.93),rgba(21,13,5,.93));box-shadow:0 4px 14px rgba(0,0,0,.55)}
.rdlog{font-size:9px;margin-bottom:2px}
.rdg{gap:3px;margin-bottom:4px}
.rds{padding:2px 3px;border-width:1.5px;border-radius:8px;gap:0;min-width:46px}
.rda{font-size:15px;line-height:1.05}
.rds b{max-width:50px;font-size:8px}
.rds em{font-size:8px}
.rdk{height:15px;padding:0 6px;font-size:8px;margin-top:1px}
.rdi{font-size:11px}
.rdbar{height:5px;margin:4px 0 2px}
.rdt{min-height:11px;font-size:9px}
.rda2{margin-top:3px;gap:6px}
.rdbtn{height:32px;font-size:12px;border-radius:9px;border-width:1.5px;box-shadow:0 2px 0 #6a3a05}
.rdbtn.sec{flex:0 0 30%;box-shadow:none}`;
document.head.append(st);

const who=k=>{if(k===0&&NM[0]==='Bạn'){try{const P=window.__WIND();const n=P&&P.me&&P.me().name;if(n)return n+' (Bạn)'}catch(e){}}return NM[k]+(k===0&&NM[k]!=='Bạn'?' (Bạn)':'')};
function toast(s){let t=q('#rdtoast');if(!t){t=document.createElement('div');t.id='rdtoast';t.className='rlt';t.style.zIndex=90;document.body.append(t)}t.textContent=s;t.hidden=false;clearTimeout(TT);TT=setTimeout(()=>{t.hidden=true},3200)}

/* gắn phần tử (nút sẵn sàng, thanh khán giả) vào đúng màn hình bàn; bàn vẽ lại thì tự gắn lại */
function pin(el,g){const h=hostOf(g);if(!h)return;PIN.add(el);el._h=h;
if(getComputedStyle(h).position==='static')h.style.position='relative';h.append(el);
if(MO&&MOH!==h){MO.disconnect();MO=null}
if(!MO){MOH=h;MO=new MutationObserver(()=>{PIN.forEach(e=>{if(e._h&&!e._h.contains(e))e._h.append(e)})});MO.observe(h,{childList:true})}}
function unpin(el){PIN.delete(el);el.remove();if(!PIN.size&&MO){MO.disconnect();MO=null;MOH=null}}

/* ngữ cảnh bàn: bàn do bạn tạo thì bạn là chủ bàn */
document.addEventListener('click',e=>{const el=e.target;if(!el||!el.closest)return;
const t=el.closest('.rt');
if(t){const r=t.querySelector('.rid');CTX={st:t.dataset.st||'',own:!!t.dataset.id,id:r?r.textContent.replace(/^\s*ID\s*/,'').trim():''};return}
const b=el.closest('.rmo [data-a="g"]');
if(b){const m=b.closest('.rmo'),h=m.querySelector('h4'),tx=h?h.textContent:'',iv=m.querySelector('.rinv');
if(/^Lời mời/.test(tx))CTX={own:false,id:iv?iv.textContent.trim():''};
else CTX={own:true,id:iv?iv.textContent.trim():''}}},true);

function resetSession(g){closeRd();endSpec();NM.splice(0,NM.length,...NM0);AVT.splice(0,AVT.length,...AVT0);RS=newRS();
let c=CTX;
if(c.own&&!c.id){try{const a=JSON.parse(localStorage.getItem('bbl_rooms_v1')||'[]').filter(r=>r&&r.g===g).sort((x,y)=>y.t-x.t)[0];if(a)c={own:true,id:a.id}}catch(e){}}
SES={g,own:!!c.own,id:c.id||'',ownerSeat:c.own?0:1,fresh:true,live:false,liveDone:false,spec:false,fx0:null};
SES.live=!SES.own&&(typeof c.st==='string'?c.st==='live':isLive(g,SES.id));
if(g==='phom')window.__PHF={seat:SES.ownerSeat};
{const n=Date.now();JT=Array.from({length:8},(_,k)=>k===SES.ownerSeat?n-36e5:k===0?n:n-6e4*(3+Math.random()*40|0))}
CTX={own:false,id:''};INMATCH=false;MC++;closePanel()}

function newBot(k){const un=new Set(NM),ua=new Set(AVT),ps=POOL_N.filter(x=>!un.has(x)),pa=POOL_A.filter(x=>!ua.has(x));
NM[k]=ps.length?ps[Math.random()*ps.length|0]:'Khách '+(10+Math.random()*89|0);AVT[k]=pa.length?pa[Math.random()*pa.length|0]:'🙂';
const w=Math.round((6000+Math.random()*24000)/500)*500;if(k<TLK.length)TLK[k]=w;CK[k]=w;KS[k]=Math.max(2000,w);JT[k]=Date.now();if(SES&&k===SES.ownerSeat)passHost()}

function exitTable(){const b=q('#tb:not([hidden]) #tbx')||q('#cv2:not([hidden]) #cvx')||q('#xq2:not([hidden]) #xqx');if(b)b.click();
try{screen.orientation.unlock()}catch(e){}INMATCH=false;closePanel();closeRd();endSpec()}

/* ===== bắt đầu ván: không còn phòng chờ khi mới vào bàn ===== */
function launch(g,go){
if(SES){SES.fresh=false;if(SES.live&&!SES.liveDone){SES.liveDone=true;startSpec(g)}}
STARTER[g]=go;closeRd();closePanel();
BYPASS=true;try{go()}finally{BYPASS=false}
INMATCH=true;if(SES)SES.fx0=fxNow();
if(SES&&SES.spec)decorateSpec(g);
schedBotLeave(g)}

/* ===== nút SẴN SÀNG sau khi hết ván (12 giây) ===== */
function logAdd(s){if(!RD)return;RD.log.push(s);if(RD.log.length>2)RD.log.shift();const l=RD.el.querySelector('#rdlog');if(l)l.innerHTML=RD.log.map(x=>'<div>'+x+'</div>').join('')}
function plan(k,isNew){const R=RD,s=R.SS[k];clearTimeout(s.t);s.ready=false;s.deadline=Date.now()+READY_MS;s.afk=false;if(k===0)return;
const noAfk=isNew||k===SES.ownerSeat||R.g==='cv'||R.g==='ct';s.afk=!noAfk&&Math.random()<.05;
if(!s.afk)s.t=setTimeout(()=>{if(RD!==R||R.starting)return;s.ready=true;renderSeats();checkAll()},isNew?1000+Math.random()*2500:(R.g==='cv'||R.g==='ct')?500+Math.random()*900:1000+Math.random()*5000)}
function renderSeats(){const R=RD;if(!R)return;const canKick=isHost()&&R.g!=='cv'&&R.g!=='ct'&&!R.starting;
R.el.querySelector('#rdg').innerHTML=R.SS.map((s,k)=>{const me=k===0,ow=k===SES.ownerSeat,
stt=s.ready?'<em class="rdok">✓ Sẵn sàng</em>':'<em class="rdwt">'+(me?'Chưa sẵn sàng':'Đang chờ…')+'</em>',
btn=canKick&&!me&&!ow?`<button class="rdk${R.confirm===k?' cf':''}" data-i="${k}">${R.confirm===k?'Chắc chưa?':'Đuổi'}</button>`:'';
return `<div class="rds${s.ready?' ok':''}${me?' rme':''}"><span class="rda">${AVT[k]}</span><b>${ow?'🛡️ ':''}${who(k)}</b>${stt}${btn}</div>`}).join('')}
function ctl(){const R=RD;if(!R)return;const f=s=>R.el.querySelector(s),h=R.SS[0],rc=R.SS.filter(x=>x.ready).length,left=Math.max(0,h.deadline-Date.now());
f('#rdi').textContent=R.starting?'Tất cả đã sẵn sàng. Bắt đầu ván!':'Hết ván · sẵn sàng '+rc+'/'+R.N+(h.ready?' · chờ người khác':'');
f('#rdb').style.width=(h.ready||R.starting?0:left/READY_MS*100)+'%';
f('#rdt').textContent=h.ready||R.starting?'':'Còn '+Math.ceil(left/1000)+'s · không bấm sẽ bị mời ra';
const b=f('#rdgo');b.textContent=h.ready?'ĐÃ CHỌN ✓ (bấm hủy)':'VÁN MỚI';b.classList.toggle('on',h.ready);b.disabled=R.starting}
function closeRd(){const R=RD;if(!R)return;clearInterval(R.iv);clearTimeout(R.ct);clearTimeout(R.st);R.SS.forEach(s=>clearTimeout(s.t));if(R.el)unpin(R.el);RD=null}
function leaveRd(msg){closeRd();exitTable();toast(msg)}
function checkAll(){const R=RD;if(!R||R.starting)return;if(R.SS.every(s=>s.ready))startRd()}
function setReady(k,v){const R=RD;if(!R||R.starting)return;R.SS[k].ready=v;renderSeats();ctl();checkAll()}
function schedBotLeave(g){const mt=MC,N=seatN(g);if(N<3||Math.random()>=.15)return;
const c=[];for(let k=1;k<N;k++)if(!RS[k].l&&!RS[k].k)c.push(k);if(!c.length)return;const k=c[Math.random()*c.length|0];
setTimeout(()=>{if(MC===mt&&INMATCH&&isOpen(g)&&!RS[k].l){RS[k].l=1;toast(NM[k]+' đăng ký rời bàn sau khi hết ván');if(PANEL)renderPanel()}},8000+Math.random()*35000)}
function startRd(){const R=RD;R.starting=true;R.confirm=-1;renderSeats();ctl();
R.st=setTimeout(()=>{if(RD!==R)return;launch(R.g,R.go)},800)}
function openReady(g,go){if(RD||!SES)return;const host=hostOf(g);if(!host||host.hidden)return;
const N=seatN(g);
RD={id:++RDC,g,N,go,starting:false,log:[],confirm:-1,SS:Array.from({length:N},()=>({ready:false,deadline:Date.now()+READY_MS,t:0,afk:false}))};
const R=RD,el=document.createElement('div');el.id='rdy';if(g==='cv'||g==='ct')el.className='cvx';R.el=el;
el.innerHTML=`<div class="rdb"><div class="rdlog" id="rdlog"></div><div class="rdg" id="rdg"></div><div class="rdi" id="rdi"></div><div class="rdbar"><i id="rdb"></i></div><div class="rdt" id="rdt"></div><div class="rda2"><button class="rdbtn sec" id="rdl">Rời bàn</button><button class="rdbtn" id="rdgo">VÁN MỚI</button></div></div>`;
pin(el,g);
const msgs=[];
for(let k=0;k<N;k++){
 if(k>0&&(RS[k].k||RS[k].l)){const why=RS[k].k?' đã bị chủ bàn mời ra':' đã rời bàn',old=NM[k];newBot(k);RS[k]={k:0,l:0};msgs.push(old+why+', '+NM[k]+' vào thay');plan(k,true)}
 else plan(k,false)}
msgs.forEach(m=>logAdd(m));
renderSeats();ctl();
el.onclick=e=>{const b=e.target.closest('button');if(!b||RD!==R||R.starting)return;
 if(b.id==='rdl')return leaveRd('Bạn đã rời bàn');
 if(b.id==='rdgo'){setReady(0,!R.SS[0].ready);return}
 if(b.classList.contains('rdk')){const k=+b.dataset.i;
  if(R.confirm!==k){R.confirm=k;renderSeats();clearTimeout(R.ct);R.ct=setTimeout(()=>{if(RD===R&&R.confirm===k){R.confirm=-1;renderSeats()}},2500);return}
  R.confirm=-1;const old=NM[k];RS[k]={k:0,l:0};newBot(k);plan(k,true);logAdd(old+' đã bị chủ bàn mời ra, '+NM[k]+' vào thay');renderSeats();ctl()}};
R.iv=setInterval(()=>{if(RD!==R)return;if(!isOpen(R.g)){closeRd();return}const now=Date.now();
 for(let k=1;k<R.N;k++){const s=R.SS[k];if(!s.ready&&!R.starting&&now>s.deadline){const old=NM[k];newBot(k);plan(k,true);logAdd(old+' không sẵn sàng nên bị mời ra, '+NM[k]+' vào thay');renderSeats()}}
 const h=R.SS[0];if(!h.ready&&!R.starting&&now>h.deadline){leaveRd('Bạn không bấm Ván mới sau 12 giây nên bị mời ra khỏi bàn');return}
 ctl()},250)}
/* người chơi bấm "Ván mới" trong bàn: tính là bấm sẵn sàng */
function requestNew(g,go){if(!SES||SES.g!==g){resetSession(g);launch(g,go);return}
STARTER[g]=go;if(SES.spec)return;
if(RS[0].l){exitTable();toast('Bạn đã rời bàn theo đăng ký');return}
if(!RD)openReady(g,go);else RD.go=go;
if(RD)setReady(0,true)}

/* ===== khán giả: vào bàn đang có ván thì xem hết ván đó, ván sau mới được chơi ===== */
function startSpec(g){window.SPEC=true;SES.spec=true;SPECCH=chips;
const un=new Set(NM),ua=new Set(AVT),ps=POOL_N.filter(x=>!un.has(x)),pa=POOL_A.filter(x=>!ua.has(x));
NM[0]=ps.length?ps[Math.random()*ps.length|0]:'Khách';AVT[0]=pa.length?pa[Math.random()*pa.length|0]:'🙂';
SES.sw=Math.round((6000+Math.random()*24000)/500)*500;window.SPECW=SES.sw;toast('Bàn đang có ván diễn ra. Bạn vào xem, ván sau sẽ được chơi')}
function decorateSpec(g){const h=hostOf(g);if(!h)return;h.classList.add('spec');
if(!SPECEL){const e=document.createElement('div');e.id='rdspec';e.innerHTML='<span>👁 Đang xem · ván đang diễn ra</span><button id="rdsx">Rời bàn</button>';
e.onclick=ev=>{if(ev.target&&ev.target.id==='rdsx'){exitTable();toast('Bạn đã rời bàn')}};SPECEL=e}
pin(SPECEL,g)}
function endSpec(){if(!window.SPEC&&!(SES&&SES.spec))return;window.SPEC=false;if(SES)SES.spec=false;
SPECUNTIL=Date.now()+1700;setTimeout(()=>{if(SPECCH!=null&&SC0&&!INMATCH&&chips!==SPECCH)SC0(SPECCH);SPECCH=null},1800);
NM[0]=NM0[0];AVT[0]=AVT0[0];const h=SES?hostOf(SES.g):null;if(h)h.classList.remove('spec');
if(SPECEL){unpin(SPECEL);SPECEL=null}}

