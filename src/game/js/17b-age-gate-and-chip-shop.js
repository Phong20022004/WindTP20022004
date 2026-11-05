/*@file game/js/17b-age-gate-and-chip-shop.js
 * ⚠ Trong IIFE patch v28: giới hạn tuổi, thời gian chơi, khu mua Chips.
 */
/* ===== v26: giới hạn độ tuổi + khu vực mua Chips ===== */
const CARD=new Set(['tl','phom','3c','lieng','pk']),
LIM={minorDaily:100000,adultDaily:5000000,dayMin:180,restMin:60},
PACKS=[10000,20000,50000,100000,200000,500000],
METH=['MoMo','ZaloPay','Chuyển khoản ngân hàng','Thẻ ATM / Visa'],
AK='bbl_age',BK='bbl_buy',PK='bbl_play',WK='bbl_wind',CK2='bbl_chips',
today=()=>{const d=new Date();return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')},
ls=(k,def)=>{try{const v=JSON.parse(localStorage.getItem(k));return v==null?def:v}catch(e){return def}},
ss=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}},
sig=d=>hs(d+'|bbl-age-v1');
let AGE=null;
function ageInfo(){let d=null,P=window.__WIND();
try{const p=P&&P.profile&&P.profile();if(p&&/^\d{4}-\d{2}-\d{2}$/.test(p.birth||''))d=p.birth}catch(e){}
if(!d){const o=ls(AK,null);if(o&&typeof o.d==='string'&&o.c===sig(o.d)){d=o.d;try{P&&P.setProfile&&P.setProfile({birth:d})}catch(e){}}}
if(!d)return null;
const[y,m,dd]=d.split('-').map(Number),n=new Date();let a=n.getFullYear()-y;if(n.getMonth()+1<m||(n.getMonth()+1===m&&n.getDate()<dd))a--;
return{d,y,m,dd,age:a,grp:a<12?'u12':a<18?'minor':'adult'}}
AGE=ageInfo();
const dmy=a=>String(a.dd).padStart(2,'0')+'/'+String(a.m).padStart(2,'0')+'/'+a.y,
play12=a=>String(a.dd).padStart(2,'0')+'/'+String(a.m).padStart(2,'0')+'/'+(a.y+12),
dayMin=()=>{const p=ls(PK,{});return p.d===today()?p.m||0:0},
lim=()=>{try{const W=window.__WIND();return W&&W.chipLimit?W.chipLimit():null}catch(e){return null}}, /* hạn mức theo tuổi do app giữ */
bought=()=>{const L=lim();if(L)return L.bought;const p=ls(BK,{});return p.d===today()?p.n||0:0},
cap=()=>{const L=lim();if(L)return L.cap;return !AGE?0:AGE.grp==='minor'?LIM.minorDaily:AGE.grp==='adult'?LIM.adultDaily:0};
function forceExit(){const t=$('#tb'),x=$('#tbx');if(t&&!t.hidden&&x)x.click()}
function blockU12(a){box(`<h4>🔞 Game đánh bài từ 12 tuổi</h4><div class="rms">Bé chưa đủ 12 tuổi nên chưa thể chơi Tiến lên, Phỏm, Ba cây, Liêng và Poker.</div><div class="rms">Bé sẽ chơi được từ ngày <b>${play12(a)}</b>.</div><div class="rma"><button data-a="x">Đã hiểu</button></div><p class="rnote">Bé vẫn chơi được Cờ vua, Cờ tướng và Quay may mắn. Tài khoản dưới 12 tuổi không thể mua Chips.</p>`,(x,m)=>m.remove())}
function blockTime(){box(`<h4>⏰ Hết giờ chơi hôm nay</h4><div class="rms">Tài khoản dưới 18 tuổi chỉ chơi game đánh bài tối đa ${LIM.dayMin} phút mỗi ngày. Hẹn bạn vào ngày mai nhé!</div><div class="rma"><button data-a="x">Về sảnh</button></div>`,(x,m)=>{m.remove();forceExit()})}
function gate(g){if(!AGE){ageGate();return false}if(!CARD.has(g))return true;
if(AGE.grp==='u12'){blockU12(AGE);return false}
if(AGE.grp==='minor'&&dayMin()>=LIM.dayMin){blockTime();return false}return true}
function markTiles(){document.querySelectorAll('.gt').forEach(t=>{if(!CARD.has(t.dataset.id))return;if(getComputedStyle(t).position==='static')t.style.position='relative';
if(!t.querySelector('.a12')){const s=document.createElement('span');s.className='a12';s.textContent='12+';t.append(s)}
t.classList.toggle('a12lk',!!AGE&&AGE.grp==='u12')})}
function ageGate(){if(document.getElementById('ag'))return;const ag=document.createElement('div');ag.id='ag';const Y=new Date().getFullYear();
const opt=(a,b,f)=>{let s='';for(let i=a;i<=b;i++)s+=`<option value="${i}">${f?f(i):i}</option>`;return s};
let yo='';for(let y=Y;y>=Y-100;y--)yo+=`<option value="${y}">${y}</option>`;
ag.innerHTML=`<div class="agb"><h2>Xác nhận độ tuổi</h2><p>Để chơi an toàn, hãy nhập ngày sinh của bạn.</p><div class="agr"><select id="agd"><option value="">Ngày</option>${opt(1,31)}</select><select id="agm"><option value="">Tháng</option>${opt(1,12)}</select><select id="agy"><option value="">Năm</option>${yo}</select></div><div class="agr"><select id="agg"><option value="">Giới tính</option><option value="nam">♂ Nam</option><option value="nu">♀ Nữ</option><option value="khac">⚧ Khác</option></select></div><label class="agc"><input type="checkbox" id="agk"> Tôi cam đoan ngày sinh trên là đúng sự thật. Ngày sinh không thể thay đổi sau khi xác nhận.</label><ul><li>Game đánh bài (Tiến lên, Phỏm, Ba cây, Liêng, Poker) <b>không dành cho trẻ dưới 12 tuổi</b>.</li><li>Từ 12 đến dưới 18 tuổi: giới hạn thời gian chơi, nhắc nghỉ, không mua Chips bằng tiền.</li><li>Đây là game giải trí, Chips không đổi thưởng.</li></ul><div class="agm" id="agmsg"></div><button class="agok" id="ago" disabled>Xác nhận</button></div>`;
document.body.append(ag);
const chk=()=>{const d=+$('#agd').value,m=+$('#agm').value,y=+$('#agy').value;let ok=false,msg='';
if(d&&m&&y){const t=new Date(y,m-1,d);if(t.getFullYear()!==y||t.getMonth()!==m-1||t.getDate()!==d)msg='Ngày sinh không hợp lệ.';else if(t>new Date())msg='Ngày sinh không thể ở tương lai.';else ok=true}
$('#agmsg').textContent=msg;$('#ago').disabled=!(ok&&$('#agk').checked&&$('#agg').value)};
['#agd','#agm','#agy','#agk','#agg'].forEach(s=>$(s).onchange=chk);try{const p=window.__WIND().profile();if(p&&p.gender){$('#agg').value=p.gender;chk()}}catch(e){}
$('#ago').onclick=()=>{const d=$('#agy').value+'-'+String($('#agm').value).padStart(2,'0')+'-'+String($('#agd').value).padStart(2,'0');ss(AK,{d,c:sig(d)});try{window.__WIND().setProfile({birth:d,gender:$('#agg').value})}catch(e){}AGE=ageInfo();ag.remove();markTiles();
if(AGE.grp==='u12')blockU12(AGE);else if(AGE.grp==='minor')toast('Tài khoản dưới 18 tuổi: có giới hạn thời gian chơi và mua Chips.')}}
/* chưa xác nhận tuổi thì không vào được bất kỳ game nào: hỏi ngay khi mở game */
setTimeout(()=>{if(!AGE)ageGate()},0);
setInterval(()=>{if(!AGE&&!document.getElementById('ag'))ageGate()},1500);
/* thời gian chơi cho tài khoản 12 đến 17 tuổi */
let sess=0,idle=0;
setInterval(()=>{if(!AGE||AGE.grp!=='minor')return;const on=document.visibilityState==='visible'&&document.body.classList.contains('ingame')&&CARD.has(cur);
if(!on){idle+=.25;if(idle>=5)sess=0;return}idle=0;sess+=.25;const p=ls(PK,{}),m=(p.d===today()?p.m||0:0)+.25;ss(PK,{d:today(),m});
if(m>=LIM.dayMin){forceExit();blockTime()}
else if(sess>=LIM.restMin){sess=0;box(`<h4>☕ Nghỉ ngơi một chút</h4><div class="rms">Bạn đã chơi ${LIM.restMin} phút liên tục. Hãy nghỉ mắt và vận động nhẹ nhé.</div><div class="rma"><button class="sec" data-a="x">Tiếp tục</button><button data-a="e">Về sảnh</button></div>`,(a,mm)=>{mm.remove();if(a==='e')forceExit()})}},15000);
/* chip dùng chung với app WINDTP (state.chips) */
const WTP=window.__WIND;
{const pull=()=>{const x=WTP();return x&&typeof x.chips==='function'?Math.max(0,Math.floor(Number(x.chips())||0)):null};
const push=()=>{const x=WTP();if(x&&x.setChips)x.setChips(chips)};
let v=pull();if(v===null){const s=localStorage.getItem(CK2);v=s===null?5000:Math.max(0,+s||0)}
setChips(v);let last=chips;
setInterval(()=>{if(chips!==last){last=chips;push();try{localStorage.setItem(CK2,String(chips))}catch(e){}}else{const p=pull();if(p!==null&&p!==chips){setChips(p);last=chips}}},600);
window.__bblFlush=()=>{last=chips;push()};
window.__bblChips=p=>{p=Math.max(0,Math.floor(Number(p)||0));if(chips===last&&p!==chips){setChips(p);last=chips}}; /* chỉ nhận khi game chưa có thay đổi chờ đẩy */
addEventListener('pagehide',()=>{window.__bblFlush()})}
/* ===== khu vực mua Chips: đồng bộ logic WINDTP ===== */
let SH=null;
function openShop(msg){if(typeof msg!=='string')msg=null;if(!AGE){ageGate();return}
const W=WTP(),minor=AGE.grp==='minor',u12=AGE.grp==='u12',plans=W&&W.plans?W.plans():[];
const MIN=(W&&W.MINPAY)||{VND:30000,KRW:2000,JPY:200},PRE=(W&&W.presets)||{VND:[30000,50000,100000,200000,500000,1000000],KRW:[2000,5000,10000,20000,50000,100000],JPY:[200,500,1000,2000,5000,10000]},SYM={VND:'₫',KRW:'₩',JPY:'¥'};
const rate=c=>W&&W.chipRate?W.chipRate(c):({VND:1,KRW:19,JPY:160})[c];
let cur=(W&&W.currency&&MIN[W.currency()])?W.currency():'VND',pack=null,cus='',cv='';
if(SH)SH.remove();const el=SH=document.createElement('div');el.id='shop';document.body.append(el);
const amt=()=>cus!==''?+cus:(pack||PRE[cur][1]),got=a=>Math.round((a||0)*rate(cur)),
err=()=>{const a=amt();if(!(a>0&&Number.isInteger(a)))return'Nhập số tiền hợp lệ.';if(a<MIN[cur])return'Thanh toán tối thiểu '+SYM[cur]+nf(MIN[cur])+'.';return''},
left=()=>Math.max(0,cap()-bought()),bal=()=>W&&W.balance?Math.floor(Number(W.balance())||0):0,
cerr=()=>{const n=+cv;if(!(n>0&&Number.isInteger(n)))return'Nhập số WIND Coin muốn đổi.';if(n>bal())return'Không đủ WIND Coin (thiếu '+nf(n-bal())+').';if(n>left())return'Vượt giới hạn hôm nay (còn '+nf(left())+' Chips).';return''};
const blocked=()=>{if(u12){toast('Tài khoản dưới 12 tuổi không thể mua Chips.');return true}if(!W){toast('Hãy mở game từ app WINDTP để mua Chips.');return true}return false};
function R(){const st0=el.scrollTop;const lim=u12?'Tài khoản dưới 12 tuổi không thể mua Chips.':`Độ tuổi đã xác nhận: ${AGE.age} tuổi (${minor?'dưới 18, chưa thể mua bằng tiền':'từ 18'}).`;
el.innerHTML=`<div class="zw"><div class="rh"><button id="spb">‹ Về</button><h2>Mua Chips</h2><span class="rc">${fmt(chips)}</span></div>
<div class="srate">💱 1.000 ₫ = 1.000 Chips · 1 ₩ = ${rate('KRW')} Chips · 1 ¥ = ${rate('JPY')} Chips · 1 WIND Coin = 1 Chip</div>
<div class="swarn">⚠ <b>Lưu ý:</b> Chip dùng chung với app WINDTP, chỉ dùng để chơi trong game, không thể rút ra, không đổi lại thành tiền hoặc WIND Coin.</div>
<div class="sinfo">${lim}</div>
<h3 style="margin:10px 2px 4px;font-size:15px">💳 Mua chip bằng tiền</h3>
<div class="stabs">${['VND','KRW','JPY'].map(c=>`<button class="stab${c===cur?' on':''}" data-c="${c}">${SYM[c]} ${c}<small>Tối thiểu ${SYM[c]}${nf(MIN[c])}</small></button>`).join('')}</div>
<div class="spacks">${PRE[cur].map(a=>`<button class="spk${cus===''&&amt()===a?' on':''}" data-p="${a}"><span>${PCH()}</span><b>${nf(got(a))}</b><small>Chips</small><em>${SYM[cur]}${nf(a)}</em></button>`).join('')}</div>
<label class="scus">Số tiền khác (${SYM[cur]})<input id="scu" type="number" inputmode="numeric" min="${MIN[cur]}" placeholder="VD: ${PRE[cur][2]}" value="${cus}"></label>
<div class="ssum" id="ssum"></div><div class="serr" id="serr"></div><button class="sbuy" id="sbuy">Mua chip</button>
<h3 style="margin:16px 2px 4px;font-size:15px">🪙 Đổi WIND Coin sang chip</h3>
<div class="srate">Số dư: <b>${nf(bal())}</b> WIND Coin · 1 WIND Coin = 1 Chip</div>
<label class="scus">Số WIND Coin muốn đổi<input id="scv" type="number" inputmode="numeric" min="1" placeholder="VD: 10000" value="${cv}"></label>
<div class="ssum" id="csum"></div><div class="serr" id="cerr"></div><button class="sbuy" id="cbuy">Đổi sang chip</button>
<h3 style="margin:16px 2px 4px;font-size:15px">🎁 Cách nhận chip khác</h3>
${plans.length?`<div class="swarn" style="border-color:#a16207">Gói khóa học tặng chip: ${plans.map(p=>`${p.label} +${nf(p.chips)}`).join(' · ')}</div>`:''}
<button class="sbuy" id="sbc">📚 Mua gói khóa học nhận Chip</button>
<button class="sbuy" id="sbt" style="margin-top:8px">🎯 Làm nhiệm vụ nhận chip</button>
<p class="rnote">${W?'Chuyển khoản được xác minh trong app WINDTP, chip được cộng sau khi xác minh.':'Chế độ thử: hãy mở game từ app WINDTP để mua Chips.'}</p></div>`;
$('#spb').onclick=()=>{el.remove();SH=null};
const sum=()=>{const a=amt(),e=err();$('#ssum').innerHTML='Bạn trả <b>'+SYM[cur]+nf(a||0)+'</b> → nhận <b>'+nf(got(a))+' Chips</b>';$('#serr').textContent=e;$('#sbuy').disabled=!!e;$('#sbuy').textContent=e?'Mua chip':'Thanh toán '+SYM[cur]+nf(a)+' · nhận '+nf(got(a))+' Chips';
const n=+cv,e2=cv===''?'':cerr();$('#csum').innerHTML='Đổi <b>'+nf(n>0?n:0)+' WIND Coin</b> → nhận <b>'+nf(n>0?n:0)+' Chips</b>';$('#cerr').textContent=e2;$('#cbuy').disabled=cv===''||!!e2};
const conv=(f,t,a)=>{if(f===t)return a;const i=PRE[f].indexOf(a);if(i>=0)return PRE[t][i];return Math.max(MIN[t],Math.round(a*rate(f)/rate(t)))};
el.querySelectorAll('.stab').forEach(b=>b.onclick=()=>{const c=b.dataset.c;if(c===cur)return;const a=amt(),had=cus!=='',na=conv(cur,c,a);cur=c;if(had){cus=String(na);pack=null}else{pack=na;cus=''}R()});
const go=()=>{if(blocked())return false;if(minor){toast('Tài khoản dưới 18 tuổi chưa thể mua bằng tiền.');return false}if(err())return false;return W.buyChips(cur,amt())!==false};
el.querySelectorAll('.spk').forEach(b=>b.onclick=()=>{pack=+b.dataset.p;cus='';const c=$('#scu');if(c)c.value='';el.querySelectorAll('.spk').forEach(x=>x.classList.toggle('on',x===b));sum();go()});
$('#scu').oninput=e=>{cus=e.target.value;el.querySelectorAll('.spk').forEach(x=>x.classList.remove('on'));sum()};
let _gt=0;const _go=()=>{if(Date.now()-_gt<700)return;_gt=Date.now();if(cus!==''&&!err())go()};$('#scu').onchange=_go;$('#scu').onkeydown=e=>{if(e.key==='Enter'){e.preventDefault();_go();e.target.blur()}};
$('#scv').oninput=e=>{cv=e.target.value;sum()};
$('#sbuy').onclick=go;
$('#cbuy').onclick=()=>{if(blocked()||cerr())return;const n=+cv;if(W.xuToChips(n)){if(!W.chipLimit)ss(BK,{d:today(),n:bought()+n});cv='';toast('Đã đổi '+nf(n)+' WIND Coin thành '+nf(n)+' Chips.');setTimeout(R,800)}else toast('Đổi chưa thành công.')};
$('#sbc').onclick=()=>{if(blocked())return;if(minor){toast('Tài khoản dưới 18 tuổi chưa thể mua bằng tiền.');return}W.openCourses()};
$('#sbt').onclick=()=>{if(blocked())return;W.gotoTasks()};
sum();el.scrollTop=st0;if(msg){toast(msg);msg=null}}
R()}
window.__bblShop=openShop;
(()=>{const st=document.createElement('style');st.textContent='#shop .spacks{grid-template-columns:repeat(2,minmax(0,1fr))!important}#shop .spk{min-width:0}#shop .spk em{white-space:normal;font-size:11px;line-height:1.3}#shop .stabs{display:grid;grid-template-columns:repeat(3,1fr);gap:6px}';document.head.append(st)})();
/* điểm vào khu mua Chips */
document.querySelectorAll('.chips').forEach(c=>{c.classList.add('shopbtn');c.onclick=openShop});
{const d=document.querySelector('.dock');if(d&&!$('#dks')){const b=document.createElement('button');b.id='dks';b.innerHTML='<b>'+PCH()+'</b>Mua Chips';b.onclick=openShop;d.insertBefore(b,d.lastElementChild)}}
markTiles();setTimeout(()=>{if(!AGE)ageGate()},250);
setTimeout(()=>{try{const W=WTP(),p=W&&W.profile&&W.profile();let seen='';try{seen=sessionStorage.getItem('bbl_gq')||''}catch(e){}
if(AGE&&p&&!p.gender&&!seen){try{sessionStorage.setItem('bbl_gq','1')}catch(e){}
box('<h4>Giới tính của bạn</h4><div class="rms">Giới tính hiện trên khung người chơi cùng avatar, cảnh giới và tuổi. Bạn có thể đổi trong Cài đặt.</div><div class="rma"><button data-a="nam">♂ Nam</button><button data-a="nu">♀ Nữ</button><button data-a="khac">⚧ Khác</button></div><div class="rma"><button class="sec" data-a="x">Để sau</button></div>',(a,m)=>{if(a!=='x'){try{W.setProfile({gender:a})}catch(e){}toast('Đã lưu giới tính')}m.remove()})}}catch(e){}},1600);setInterval(()=>{const a=ageInfo();if((a&&a.d)!==(AGE&&AGE.d)){AGE=a;markTiles()}},3000);

})();

