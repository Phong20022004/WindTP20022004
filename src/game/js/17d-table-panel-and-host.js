/*@file game/js/17d-table-panel-and-host.js
 * ⚠ Trong IIFE patch v28: bảng bàn, chủ bàn, onEnd; đóng IIFE ở cuối file.
 */
/* ===== bảng bàn chơi trong ván: đuổi / đăng ký rời ===== */
function closePanel(){closeKk();PANEL=false;PCONF=-1;const p=q('.rdp');if(p)p.remove()}
function renderPanel(){const tb=q('#tb'),x=tb&&tb.querySelector('.tlx');if(!x||!SES||!MULTI.has(SES.g)){closePanel();return}
let p=x.querySelector('.rdp');if(!p){p=document.createElement('div');p.className='rdp';p.onclick=panelClick;x.append(p)}
const N=seatN(SES.g),own=isHost();
p.innerHTML=`<h4><span>Bàn ${SES.id||''} · ${N} người</span><button class="rdpx" aria-label="Đóng">✕</button></h4>`+
Array.from({length:N},(_,k)=>{const ow=k===SES.ownerSeat,r=RS[k],tag=(r.k?'<em>Sẽ bị mời ra</em>':'')+(r.l?'<em>Sắp rời bàn</em>':'');
const btn=own&&k!==0&&!ow?`<button class="${PCONF===k&&!r.k?'cf':''}" data-i="${k}">${r.k?'Hủy lệnh':PCONF===k?'Bấm lại':'Đuổi'}</button>`:'';
return `<div class="rdr"><span class="a">${AVT[k]}</span><b>${who(k)}${ow?' 🛡️':''}</b>${tag}${btn}</div>`}).join('')+
`<button class="rdpl">${RS[0].l?'Hủy đăng ký rời bàn':INMATCH?'Đăng ký rời bàn khi hết ván':'Rời bàn ngay'}</button>
<small>${own?'':'Chỉ chủ bàn mới có quyền đuổi. '}${INMATCH?'Ván đang diễn ra: lệnh chỉ thực thi sau khi hết ván.':'Ván đã xong: lệnh thực thi trước ván mới.'}</small>`}
function panelClick(e){const b=e.target.closest('button');if(!b)return;
if(b.classList.contains('rdpx'))return closePanel();
if(b.classList.contains('rdpl')){if(!RS[0].l&&!INMATCH){exitTable();toast('Bạn đã rời bàn');return}RS[0].l=RS[0].l?0:1;toast(RS[0].l?'Bạn sẽ rời bàn khi hết ván':'Đã hủy đăng ký rời bàn');renderPanel();return}
if(b.dataset.i!==undefined){const k=+b.dataset.i,r=RS[k];
 if(r.k){r.k=0;PCONF=-1;toast('Đã hủy lệnh đuổi '+NM[k])}
 else if(PCONF!==k){PCONF=k;clearTimeout(PCT);PCT=setTimeout(()=>{if(PCONF===k){PCONF=-1;if(PANEL)renderPanel()}},2500)}
 else{PCONF=-1;r.k=1;toast(INMATCH?NM[k]+' sẽ bị mời ra sau khi hết ván':'Đã ghi nhận, '+NM[k]+' sẽ bị mời ra trước ván mới')}
 renderPanel()}}
function ensureBtn(){const tb=q('#tb');if(!tb||tb.hidden)return;const tt=tb.querySelector('.tt');if(!tt||tt.querySelector('#rdsb'))return;
const b=document.createElement('button');b.className='rb';b.id='rdsb';b.textContent='👥';b.setAttribute('aria-label','Bàn chơi');
b.onclick=()=>{if(PANEL){closePanel()}else{PANEL=true;renderPanel()}};tt.insertBefore(b,tt.querySelector('.inf'))}

/* ===== v31: chủ bàn có hiệu ứng · bấm avatar để đuổi / đăng ký rời · chủ bàn rời thì người ở lâu nhất làm chủ ===== */
function passHost(){const N=seatN(SES.g);let b=-1;for(let k=0;k<N;k++)if(k!==SES.ownerSeat&&(b<0||JT[k]<JT[b]))b=k;if(b<0)return;
SES.ownerSeat=b;const m=(b===0?'Bạn':NM[b])+' ở bàn lâu nhất nên trở thành chủ bàn';if(RD)logAdd(m);else toast(m);if(PANEL)renderPanel()}
function avOf(k){const tb=q('#tb');if(!tb)return null;return k===0?(tb.querySelector('.me .av')||tb.querySelector('#av0')):tb.querySelector('#av'+k)}
function markHost(){if(!SES||!MULTI.has(SES.g)||!isOpen(SES.g))return;const N=seatN(SES.g);for(let k=0;k<N;k++){const a=avOf(k);if(!a)continue;const h=k===SES.ownerSeat;a.classList.toggle('host',h);let b=a.querySelector(':scope>.hbdg');if(h&&!b){b=document.createElement('s');b.className='hbdg';b.textContent='🛡️';a.append(b)}else if(!h&&b)b.remove()}}
function specSeat(){const tb=q('#tb');if(!tb||tb.hidden)return;const m=tb.querySelector('.me');if(!m)return;
const a=m.querySelector('.av'),b=m.querySelector('.pl b'),s=m.querySelector('.pl span');
if(a){const n=a.firstChild;if(n&&n.nodeType===3&&n.nodeValue!==AVT[0])n.nodeValue=AVT[0]}
if(b&&b.textContent!==NM[0])b.textContent=NM[0];
if(s){const v=(SES.sw||0).toLocaleString('vi-VN')+' Chips';if(s.textContent!==v)s.textContent=v}}
function closeKk(){clearTimeout(KKT);const p=q('#kkpop');if(p)unpin(p)}
function kickSeat(k){const r=RS[k];
if(r.k){r.k=0;toast('Đã hủy lệnh đuổi '+NM[k])}
else if(RD&&!INMATCH&&!RD.starting){const old=NM[k];RS[k]={k:0,l:0};newBot(k);plan(k,true);logAdd(old+' đã bị chủ bàn mời ra, '+NM[k]+' vào thay');renderSeats();ctl()}
else{r.k=1;toast(INMATCH?NM[k]+' sẽ bị đuổi ra sau khi hết ván':'Đã ghi nhận, '+NM[k]+' sẽ bị mời ra trước ván mới')}
if(PANEL)renderPanel()}
function toggleLeave(){if(!RS[0].l&&!INMATCH){exitTable();toast('Bạn đã rời bàn');return}
RS[0].l=RS[0].l?0:1;toast(RS[0].l?'Bạn sẽ rời bàn khi hết ván':'Đã hủy đăng ký rời bàn');if(PANEL)renderPanel()}
function showKk(k,av){closeKk();const g=SES.g,h=hostOf(g);if(!h)return;
const host=isHost(),me=k===0,ow=k===SES.ownerSeat,r=RS[k],p=document.createElement('div');p.id='kkpop';
const tag=(r.k?' · sẽ bị mời ra':'')+(r.l?' · sắp rời bàn':'');
let b='';
if(me)b=`<button data-a="l">${RS[0].l?'Hủy đăng ký rời bàn':INMATCH?'Đăng ký rời bàn':'Rời bàn ngay'}</button>`;
else if(host)b=`<button class="kk" data-a="k">${r.k?'Hủy lệnh đuổi':'Đuổi khỏi bàn'}</button>`;
p.innerHTML=`<b>${ow?'🛡️ ':''}${who(k)}</b><small>${ow?'Chủ bàn':'Thành viên'}${tag}</small>${b}`;
p.onclick=ev=>{const bt=ev.target.closest('button');if(!bt)return;closeKk();if(bt.dataset.a==='l')toggleLeave();else if(bt.dataset.a==='k')kickSeat(k)};
pin(p,g);
const rc=av.getBoundingClientRect(),hr=h.getBoundingClientRect();
p.style.left=Math.max(4,Math.min(hr.width-158,rc.left-hr.left+rc.width/2-77))+'px';
p.style.top=Math.max(4,Math.min(hr.height-96,rc.bottom-hr.top+8))+'px';
KKT=setTimeout(closeKk,5000)}
document.addEventListener('click',e=>{const tb=q('#tb');if(!tb||tb.hidden||!SES||SES.spec||!MULTI.has(SES.g)||!e.target.closest||!tb.contains(e.target))return;
if(e.target.closest('#kkpop'))return;
const av=e.target.closest('.av');if(!av){closeKk();return}
const N=seatN(SES.g);for(let k=0;k<N;k++)if(avOf(k)===av){showKk(k,av);return}},true);
const hs31=document.createElement('style');hs31.textContent='#kkpop{position:absolute;z-index:70;width:154px;padding:8px;border:2px solid #ffd978;border-radius:12px;background:rgba(30,18,6,.97);color:#f6e7c8;font:700 12px system-ui,sans-serif;text-align:center;box-shadow:0 6px 18px rgba(0,0,0,.7);pointer-events:auto}#kkpop b{display:block;color:#ffe9a8;font-size:13px}#kkpop small{display:block;margin:2px 0 6px;color:#d8c49a;font-size:10px}#kkpop button{width:100%;height:30px;border-radius:999px;border:1.5px solid #ffd978;background:#3a2810;color:#ffd978;font:800 12px system-ui,sans-serif}#kkpop button.kk{border-color:#ff9a8a;background:#b3261e;color:#fff}';
document.head.append(hs31);

/* ===== hết ván: hiện nút sẵn sàng 12 giây ===== */
function onEnd(){const mt=MC,g=SES.g,wasSpec=SES.spec;
if(wasSpec){endSpec();toast('Ván đã kết thúc. Bấm VÁN MỚI để vào chơi ván sau')}
else{const pend=RS.slice(1).filter(r=>r.k||r.l).length;if(pend)toast('Hết ván: '+pend+' lệnh đuổi/rời sẽ thực thi trước ván mới')}
if(PANEL)renderPanel();
if(RS[0].l){setTimeout(()=>{if(MC===mt&&!INMATCH&&RS[0].l&&SES&&isOpen(SES.g)){exitTable();toast('Bạn đã rời bàn sau khi hết ván')}},READY_DELAY);return}
setTimeout(()=>{if(MC!==mt||INMATCH||RD||!SES||!isOpen(SES.g)||!STARTER[SES.g])return;openReady(SES.g,STARTER[SES.g])},READY_DELAY)}
setInterval(()=>{const g=SES&&SES.g;
if(!g||!isOpen(g)){INMATCH=false;if(PANEL)closePanel();if(RD)closeRd();if(SES&&SES.spec)endSpec();return}
if(SES.spec){const h=hostOf(g);if(h&&!h.classList.contains('spec'))h.classList.add('spec')}
if(MULTI.has(g)){ensureBtn();markHost();if(SES.spec)specSeat()}
if(INMATCH&&ended(g)){INMATCH=false;onEnd()}},150);

/* ===== gắn vào các hàm bắt đầu ván ===== */
function wrap(name,g,starts,reset){const orig=window[name];if(typeof orig!=='function')return;
window[name]=function(...a){if(BYPASS)return orig.apply(this,a);
const open=isOpen(g);if(!open&&reset)resetSession(g);
if(!starts){if(g==='3c'&&SES&&SES.g===g&&SES.live&&!SES.liveDone){SES.liveDone=true;startSpec(g)}
const r=orig.apply(this,a);
 /* Ba cây: bàn đang đấu thì tự chia bài để khán giả xem */
 if(g==='3c'&&SES&&SES.g===g&&SES.live&&SES.spec)setTimeout(()=>{const b=q('#c3b');if(b&&!b.disabled&&SES&&SES.live&&SES.spec&&isOpen('3c'))b.click()},700);
 return r}
const self=this,go=()=>orig.apply(self,a);
if(SES&&SES.g===g&&SES.fresh)return launch(g,go);
return requestNew(g,go)}}
wrap('tien','tl',1,1);wrap('phom','phom',1,1);wrap('lieng','lieng',1,1);wrap('pkg','pk',1,1);
wrap('cvg','cv',1,1);wrap('xg','ct',1,1);wrap('c3','3c',0,1);wrap('c3deal','3c',1,0);
/* nút Ván mới của cờ vua và cờ tướng dùng hàm nội bộ nên chặn bằng click */
document.addEventListener('click',e=>{if(BYPASS||!e.target||!e.target.closest)return;const b=e.target.closest('#cvn,#xqn');if(!b)return;
e.stopPropagation();e.preventDefault();const g=b.id==='cvn'?'cv':'ct',f=b.onclick;
requestNew(g,()=>f&&f.call(b))},true);
/* khán giả không ghi thắng thua: giữ nguyên số Chips của bạn */
SC0=window.setChips;if(typeof SC0==='function')window.setChips=function(n){if(window.SPEC||Date.now()<SPECUNTIL)return;return SC0.apply(this,arguments)};
})();
