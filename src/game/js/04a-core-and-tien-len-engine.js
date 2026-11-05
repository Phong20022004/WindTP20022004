/*@file game/js/04a-core-and-tien-len-engine.js
 * Lõi game: bộ bài, chip, cấu hình bàn G, engine Tiến lên cơ bản.
 */

const $=s=>document.querySelector(s),sleep=ms=>new Promise(r=>setTimeout(r,ms));
function spkIcon(on){return '<svg class="ico'+(on?'':' off')+'" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4.2 9.6v4.8h3.5l4.6 3.9V5.7L7.7 9.6H4.2z" fill="currentColor" fill-opacity=".22"/>'+(on?'<path class="w1" d="M15.6 9.3a3.6 3.6 0 0 1 0 5.4"/><path class="w2" d="M18.3 6.8a7.2 7.2 0 0 1 0 10.4"/>':'<path class="x" d="M16 9.6l5 4.8M21 9.6l-5 4.8"/>')+'</svg>'}
const S=['♠','♣','♦','♥'],R=['','A','2','3','4','5','6','7','8','9','10','J','Q','K'];
const G={
tl:{n:'Tiến lên miền Nam',sub:'2 đến 4 người, 13 lá mỗi người',g:'2♥',play:1,r:[
'4 người, mỗi người 13 lá. Ván đầu ai có 3♠ đi trước, các ván sau người thắng ván trước đi trước.',
'Thứ tự quân: 3 nhỏ nhất, 2 (heo) lớn nhất. Thứ tự chất: ♠ < ♣ < ♦ < ♥.',
'Bộ được đánh: rác, đôi, sám cô, sảnh (từ 3 lá, không có heo), tứ quý, đôi thông.',
'Phải đánh cùng loại và lớn hơn. Không đánh được thì bỏ lượt, và không được vào lại trong vòng đó.',
'Chặt: 3 đôi thông chặt heo đơn. Tứ quý chặt heo đơn, đôi heo và 3 đôi thông. 4 đôi thông chặt mọi thứ trên, kể cả tứ quý. Chặt heo đen ăn 1 cược, heo đỏ 2 cược. Chặt chồng (chặt lên bộ chặt) ăn thêm 2 cược.','Hết bài trước thì thắng, mỗi người thua trả 1 cược. Cóng (chưa đánh lá nào) trả 2 cược. Thối heo (còn heo trên tay) trả thêm tiền heo cho người thắng.','Tới trắng (thắng ngay, mỗi người trả 4 cược): sảnh rồng 3 đến A, tứ quý heo, 6 đôi, 5 đôi thông.']},
phom:{n:'Phỏm (Tá lả)',sub:'4 người, 9 hoặc 10 lá',g:'Q♠',play:1,r:[
'4 người. Nhà cái chia 10 lá, ba người còn lại 9 lá.',
'Phỏm là 3 lá trở lên cùng số, hoặc sảnh cùng chất từ 3 lá (không nối vòng Q-K-A).',
'Mỗi lượt: bốc bài, hoặc ăn lá người trước vừa đánh (phải hạ phỏm ngay), rồi đánh ra một lá.',
'Mỗi người đánh đủ 4 lá thì hạ bài. Tính điểm các lá rác, ít điểm nhất thắng. Được gửi lá vào phỏm đã hạ.',
'Ù khi hết sạch bài. Ù tròn (mọi lá đều thành phỏm) thắng cả bàn.']},
'3c':{n:'Bài 3 cây',sub:'Đấu với nhà cái, 3 lá',g:'K♦',play:1,r:[
'Mỗi người nhận 3 lá và so với nhà cái.',
'Điểm là hàng đơn vị của tổng 3 lá. A = 1, từ 2 đến 9 theo số, 10 J Q K = 0.',
'Ba tây (3 lá J, Q, K) thắng mọi bài và được tính gấp đôi.',
'Bằng điểm thì so lá lớn nhất: A nhỏ nhất, K lớn nhất, chất ♠ < ♣ < ♦ < ♥.',
'Cược cố định mỗi ván. Thắng nhận đúng tiền cược, thua mất tiền cược.']},
lieng:{n:'Liêng',sub:'2 đến 6 người, 3 lá',g:'A♣',play:1,r:[
'Mỗi người 3 lá, cược nhiều vòng với 3 lựa chọn: tố, theo, bỏ.',
'Thứ hạng: Sáp (3 lá cùng số) > Liêng (3 lá liên tiếp) > Ba tây (J, Q, K) > điểm.',
'Liêng lớn nhất là Q-K-A, nhỏ nhất là A-2-3.',
'Điểm tính như Bài 3 cây. Bằng nhau thì so lá lớn nhất, rồi so chất.',
'Hết vòng cược, những người còn lại ngửa bài, bài cao nhất ăn cả pot.']},
cv:{n:'Cờ vua',sub:'2 người, bàn 8×8',g:'♞',o:0,play:1,r:[
'Mỗi bên 16 quân, bên trắng đi trước.',
'Xe đi thẳng, Tượng đi chéo, Hậu đi cả hai hướng, Vua đi một ô, Mã nhảy hình chữ L, Tốt tiến một ô và ăn chéo.',
'Nước đặc biệt: nhập thành, bắt tốt qua đường, phong cấp tốt khi tới hàng cuối.',
'Chiếu hết Vua đối phương thì thắng.',
'Hòa khi hết nước đi mà không bị chiếu, lặp thế cờ 3 lần, 50 nước không ăn quân hay đi tốt, hoặc hai bên đồng ý.','Tiền cờ: người thắng ăn mức cược từ người thua và bị trừ 10%. Hòa cờ thì mỗi bên nhận lại 95% mức cược.']},
ct:{n:'Cờ tướng',sub:'2 người, bàn 9×10',g:'帥',o:1,play:1,r:[
'Bàn có 9 đường dọc, 10 đường ngang và con sông ở giữa. Bên đỏ đi trước.',
'Tướng và Sĩ chỉ đi trong cung. Tượng không qua sông và bị cản ở mắt tượng.',
'Mã bị cản chân. Pháo muốn ăn quân phải nhảy qua đúng một quân đứng giữa. Tốt qua sông mới được đi ngang.',
'Hai Tướng không được đối mặt nhau trên cùng một đường dọc khi không có quân chắn.',
'Chiếu bí hoặc hết nước đi thì thua. Cấm chiếu liên tục một nước.']},
pk:{n:'Poker',sub:'Texas Hold’em, 2 đến 9 người',g:'A♠',play:1,r:[
'Mỗi người 2 lá riêng, 5 lá chung mở dần: flop 3 lá, turn 1 lá, river 1 lá.',
'Bốn vòng cược. Mỗi lượt chọn: check, call, raise, fold hoặc all-in.',
'Ghép 5 lá tốt nhất trong 7 lá (2 riêng và 5 chung).',
'Thứ hạng: Thùng phá sảnh > Tứ quý > Cù lũ > Thùng > Sảnh > Sám > Hai đôi > Đôi > Mậu thầu.',
'Hai người bên trái nút dealer đặt mù nhỏ và mù lớn. Nút dealer xoay một ghế sau mỗi ván.']}
};
const groups=[['Bài lá',['tl','phom','3c','lieng']],['Cờ',['cv','ct']],['Poker',['pk']]];
let chips=5000,TB=100,NA=4,bet=100,cur=null,busy=false;
const fmt=n=>n.toLocaleString('vi-VN')+' Chips';
function dealTL(d){const h=[0,1,2,3].map(i=>i<NA?d.slice(i*13,i*13+13):[]);if(NA<4&&!h.some(x=>x.includes(12))){const p=Math.random()*NA|0;h[p][Math.random()*13|0]=12}return h.map(x=>x.sort((a,b)=>a-b))}
function setChips(n){chips=n;$('#chips').textContent=$('#chips2').textContent=fmt(n)}
$('#lobby').innerHTML=groups.map(([t,ids])=>`<h2>${t}</h2>`+ids.map(id=>{const g=G[id];
const cls=g.o===undefined?(/[♦♥]/.test(g.g)?'glyph r':'glyph'):(g.o?'glyph o':'glyph');
return `<button class="tile" data-id="${id}"><div class="${cls}">${g.g}</div><div><b>${g.n}</b><span class="sub">${g.sub}</span></div><span class="tag${g.play?'':' soon'}">${g.play?'Chơi thử':'Xem bàn'}</span></button>`}).join('')).join('');
setChips(chips);
document.querySelectorAll('.tile').forEach(b=>b.onclick=()=>{cur=b.dataset.id;const g=G[cur];
$('#st').textContent=g.n;$('#sr').innerHTML=g.r.map(x=>`<li>${x}</li>`).join('');
const p=$('#play');p.disabled=false;p.textContent=g.play?'Chơi thử':'Xem bàn mẫu';$('#sheet').hidden=false});
$('#close').onclick=()=>$('#sheet').hidden=true;
$('#sheet').onclick=e=>{if(e.target.id==='sheet')$('#sheet').hidden=true};
$('#play').onclick=()=>{$('#sheet').hidden=true;if(cur==='3c')c3();else if(cur==='tl')tien();else if(cur==='phom')phom();else if(cur==='lieng')lieng();else if(cur==='cv')cvg();else if(cur==='ct')xg();else if(cur==='pk')pkg();else table(cur)};
$('#back').onclick=()=>{if(!busy)$('#game').hidden=true};
$('#bets').innerHTML=[100,500,1000,10000,100000].map(v=>`<button class="bet${v===bet?' on':''}" data-v="${v}">${v}</button>`).join('');
document.querySelectorAll('.bet[data-v]').forEach(b=>b.onclick=()=>{if(busy)return;bet=+b.dataset.v;
document.querySelectorAll('.bet[data-v]').forEach(x=>x.classList.toggle('on',x===b))});

function deck(){const d=[];for(let s=0;s<4;s++)for(let r=1;r<=13;r++)d.push({r,s});
for(let i=d.length-1;i>0;i--){const j=Math.random()*(i+1)|0;[d[i],d[j]]=[d[j],d[i]]}return d}
function ev(h){return{tay:h.every(c=>c.r>=11),pts:h.reduce((a,c)=>a+(c.r>=10?0:c.r),0)%10,top:Math.max(...h.map(c=>c.r*4+c.s))}}
const cmp=(a,b)=>a.tay!==b.tay?(a.tay?1:-1):a.pts!==b.pts?a.pts-b.pts:a.top-b.top;
const lab=e=>e.tay?'Ba tây':e.pts+' điểm';
function cardEl(c,d){const e=document.createElement('div');e.className='card';e.style.setProperty('--d',d+'ms');
e.innerHTML=`<div class="in"><div class="b"></div><div class="f${c.s>1?' r':''}"><span>${R[c.r]}</span><span class="s">${S[c.s]}</span></div></div>`;return e}
function burst(){const cols=['#e0b44f','#b3261e','#f3ebd7','#2f7a69'];
for(let i=0;i<44;i++){const p=document.createElement('i');p.className='p';
p.style.cssText=`background:${cols[i%4]};--x:${(Math.random()-.5)*360}px;--y:${-120-Math.random()*280}px;--r:${Math.random()*720}deg`;
document.body.append(p);setTimeout(()=>p.remove(),1400)}}
const fx=v=>v>0?v-Math.floor(v*.1):v;const feeWin=(x,own)=>{const p=Math.max(0,x-own);count(chips+x-Math.floor(p*.1))};
function count(to){const from=chips,t0=performance.now();
(function f(t){const k=Math.min(1,(t-t0)/600);setChips(Math.round(from+(to-from)*k));if(k<1)requestAnimationFrame(f)})(t0)}

$('#deal').onclick=async()=>{
if(busy)return;busy=true;$('#deal').disabled=true;
if(chips<bet){busy=false;$('#deal').disabled=false;needChips();return}
$('#res').textContent='';$('#meS').textContent=$('#dlS').textContent='';
const d=deck(),me=d.slice(0,3),dl=d.slice(3,6);
$('#me').innerHTML=$('#dl').innerHTML='';
const mc=me.map((c,i)=>cardEl(c,i*220)),dc=dl.map((c,i)=>cardEl(c,i*220+110));
mc.forEach(e=>$('#me').append(e));dc.forEach(e=>$('#dl').append(e));
await sleep(1100);
for(const e of mc){e.classList.add('up');await sleep(350)}
const a=ev(me),b=ev(dl);$('#meS').textContent='('+lab(a)+')';await sleep(500);
for(const e of dc){e.classList.add('up');await sleep(350)}
$('#dlS').textContent='('+lab(b)+')';await sleep(400);
const w=cmp(a,b)>0;
if(w){const g=bet*(a.tay?2:1);$('#res').textContent='Thắng +'+fx(g);count(chips+fx(g));burst()}
else{const g=bet*(b.tay?2:1);$('#res').textContent='Thua −'+g;count(Math.max(0,chips-g));
const gm=$('#game');gm.classList.remove('shake');void gm.offsetWidth;gm.classList.add('shake')}
$('#deal').textContent='Chia ván mới';$('#deal').disabled=false;busy=false};
const C=(t,x='')=>`<button class="mc${/[♦♥]/.test(t)?' r':''} ${x}"><span>${t.slice(0,-1)}</span><span>${t.slice(-1)}</span></button>`;
const L=a=>a.map(c=>C(c)).join(''),BK=n=>'<div class="mc bk"></div>'.repeat(n);
const ST=(n,s)=>`<div class="st">${n}<b>${s}</b></div>`;
const OP=a=>`<div class="ops">${a.map(([t,c])=>`<button class="btn${c?' alt':''}" style="flex:0 1 auto">${t}</button>`).join('')}</div>`;
const H={
tl:()=>`<div class="seats">${ST('Hà','13 lá')+ST('Minh','13 lá')+ST('Lan','13 lá')}</div><div class="mid"><div>Hà vừa đánh sảnh 3 lá</div><div class="row2">${L(['5♠','6♦','7♣'])}</div></div><div class="fan">${L(['3♠','4♥','5♣','7♠','8♦','9♦','10♣','J♥','Q♠','K♠','A♦','2♣','2♥'])}</div>${OP([['Bỏ lượt',1],['Đánh']])}`,
phom:()=>`<div class="seats">${ST('Hà','Đã ăn 1 lá')+ST('Minh','4 lá đã đánh')+ST('Lan','9 lá')}</div><div class="mid"><div class="row2">${BK(1)}<span>Bốc (31)</span>${C('9♣')}<span>Lá vừa đánh</span></div><div>Viền vàng là phỏm đã ghép</div></div><div class="fan">${['2♠','2♥','2♣','4♦','5♦','6♦'].map(c=>C(c,'meld')).join('')+L(['J♣','K♠','A♥'])}</div>${OP([['Bốc bài',1],['Ăn 9♣',1],['Đánh lá chọn']])}`,
lieng:()=>`<div class="seats">${ST('Hà','Cược 500')+ST('Minh','Đã bỏ')+ST('Lan','Cược 500')}</div><div class="mid"><div class="pot">Pot 2.000 Chips</div><div>Vòng cược 2 trên 3. Chạm từng lá để lật.</div></div><div class="row2">${['Q♠','K♦','A♣'].map(c=>`<button class="mc bk flip" data-t="${c}"></button>`).join('')}</div>${OP([['Bỏ',1],['Theo 500',1],['Tố 1.000']])}`,
pk:()=>`<div class="seats">${ST('Hà','2.400 Chips')+ST('Minh','Đã fold')+ST('Lan','All-in')}</div><div class="mid"><div class="pot">Pot 3.200 Chips</div><div class="row2">${L(['A♥','K♥','7♣'])+BK(2)}</div><div>Flop, đang chờ lá turn</div></div><div class="row2">${L(['Q♥','J♥'])}</div>${OP([['Fold',1],['Call 400',1],['Raise']])}`,
cv:()=>`<div class="seats">${ST('Hà (đen)','9:40')}</div><div class="mid"><div class="board" id="bd"></div></div><div class="seats">${ST('Bạn (trắng)','9:55')}</div>`,
ct:()=>`<div class="seats">${ST('Hà (đen)','9:40')}</div><div class="mid"><div id="xq"></div></div><div class="seats">${ST('Bạn (đỏ)','9:55')}</div>`
};
function chess(){
const b='rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR'.replace(/\//g,'').replace(/8/g,'        ').split('');
const gl={p:'♟',r:'♜',n:'♞',b:'♝',q:'♛',k:'♚'};let sel=-1;
const d=()=>{$('#bd').innerHTML=b.map((x,i)=>`<button class="sq${(i%8+(i>>3))%2?' d':''}${i===sel?' on':''}${x!==x.toLowerCase()?' w':''}" data-i="${i}">${x===' '?'':gl[x.toLowerCase()]}</button>`).join('')};
$('#bd').onclick=e=>{const k=e.target.closest('[data-i]');if(!k)return;const i=+k.dataset.i;if(sel<0){if(b[i]!==' ')sel=i}else{if(i!==sel){b[i]=b[sel];b[sel]=' '}sel=-1}d()};d()}
function xq(){
const T={};'車馬象士將士象馬車'.split('').forEach((c,i)=>T['0,'+i]=['b',c]);
'俥傌相仕帥仕相傌俥'.split('').forEach((c,i)=>T['9,'+i]=['r',c]);
[1,7].forEach(c=>{T['2,'+c]=['b','炮'];T['7,'+c]=['r','炮']});
[0,2,4,6,8].forEach(c=>{T['3,'+c]=['b','卒'];T['6,'+c]=['r','兵']});
let sel=null;
const d=()=>{let s='<svg class="xq" viewBox="0 0 360 400"><g stroke="#5a3a12" stroke-width="1.5" fill="none">';
for(let i=0;i<10;i++)s+=`<path d="M20 ${20+i*40}H340"/>`;
for(let c=0;c<9;c++){const x=20+c*40;s+=c%8?`<path d="M${x} 20V180M${x} 220V380"/>`:`<path d="M${x} 20V380"/>`}
s+='<path d="M140 20L220 100M220 20L140 100M140 300L220 380M220 300L140 380"/></g><text x="110" y="200" fill="#5a3a12">楚河</text><text x="250" y="200" fill="#5a3a12">漢界</text>';
for(let r=0;r<10;r++)for(let c=0;c<9;c++)s+=`<rect data-k="${r},${c}" x="${c*40}" y="${r*40}" width="40" height="40" fill="transparent"/>`;
for(const k in T){const[r,c]=k.split(',');const[sd,ch]=T[k],col=sd==='r'?'#b3261e':'#1b1b18';
s+=`<g class="pc" data-k="${k}"><circle cx="${20+c*40}" cy="${20+r*40}" r="17" fill="${sel===k?'#e0b44f':'#f3ebd7'}" stroke="${col}" stroke-width="2.5"/><text x="${20+c*40}" y="${20+r*40}" fill="${col}">${ch}</text></g>`}
$('#xq').innerHTML=s+'</svg>'};
$('#xq').onclick=e=>{const k=e.target.closest('[data-k]');if(!k)return;const id=k.dataset.k;
if(!sel){if(T[id])sel=id}else{if(id!==sel){T[id]=T[sel];delete T[sel]}sel=null}d()};d()}
function table(id){
let t=$('#tb');if(!t){t=document.createElement('div');t.id='tb';document.body.append(t)}
t.hidden=false;
t.innerHTML=`<div class="top"><button class="bet" id="tbx">Về sảnh</button><h3>${G[id].n}</h3><span></span></div>${H[id]()}<p class="lead" style="font-size:12px;text-align:center;margin:0">Bàn mẫu để duyệt thiết kế, chưa có luật tự động.</p>`;
$('#tbx').onclick=()=>t.hidden=true;
t.querySelectorAll('.fan .mc').forEach(b=>b.onclick=()=>b.classList.toggle('sel'));
t.querySelectorAll('.flip').forEach(b=>b.onclick=()=>{const v=b.dataset.t;b.className='mc'+(/[♦♥]/.test(v)?' r':'');b.innerHTML=`<span>${v.slice(0,-1)}</span><span>${v.slice(-1)}</span>`});
if(id==='cv')chess();if(id==='ct')xq()}
let HD=[],PS=[0,0,0,0],last=null,turn=0,over=false,ms='',sel=new Set(),fresh=0,shk=0,tok=0;
const NM=['Bạn','Hà','Minh','Lan'],rk=v=>v>>2;
const lb=v=>({11:'J',12:'Q',13:'K',14:'A',15:'2'}[rk(v)]||rk(v))+S[v&3];
function comb(a,k){if(k===0)return[[]];if(a.length<k)return[];const[f,...r]=a;return[...comb(r,k-1).map(x=>[f,...x]),...comb(r,k)]}
function ana(c){c=[...c].sort((a,b)=>a-b);const n=c.length,r=c.map(rk),top=c[n-1];
if(n===1)return{t:'s',n,k:top};
if(r.every(x=>x===r[0]))return n===2?{t:'p',n,k:top}:n===3?{t:'t',n,k:top}:n===4?{t:'q',n,k:top}:null;
if(n>=3&&r[n-1]<15&&r.every((x,i)=>i===0||x===r[i-1]+1))return{t:'r',n,k:top};
if(n>=6&&n%2===0&&r[n-1]<15&&r.every((x,i)=>i%2?x===r[i-1]:(i===0||x===r[i-1]+1)))return{t:'d',n,k:top};
return null}
function beats(a,l){if(!l)return !!a;if(!a)return false;
if(a.t===l.t&&a.n===l.n)return a.k>l.k;
if(l.t==='s'&&rk(l.k)===15)return a.t==='q'||(a.t==='d'&&a.n>=6);
if(l.t==='p'&&rk(l.k)===15)return a.t==='d'&&a.n>=8;
return false}
function gen(h){const g={};h.forEach(v=>(g[rk(v)]??=[]).push(v));const o=[];
for(const r in g)for(let k=1;k<=4;k++)o.push(...comb(g[r],k));
for(let s=3;s<=12;s++){const run=[],pr=[];let p2=true;
for(let r=s;r<=14&&g[r];r++){run.push(g[r][0]);if(run.length>=3)o.push([...run]);
if(g[r].length<2)p2=false;if(p2){pr.push(...g[r].slice(0,2));if(pr.length>=6)o.push([...pr])}}}
return o}
function tien(){let t=$('#tb');if(!t){t=document.createElement('div');t.id='tb';document.body.append(t)}
t.hidden=false;
const d=deck().map(c=>(c.r===1?14:c.r===2?15:c.r)*4+c.s);
HD=dealTL(d);
PS=[0,0,0,0];last=null;over=false;sel.clear();turn=HD.findIndex(h=>h.includes(12));
ms=NM[turn]+' có 3♠, đi trước';dr();stp()}
function dr(){const t=$('#tb');
const mine=HD[0].map(v=>C(lb(v),sel.has(v)?'sel':'').replace('<button','<button data-v="'+v+'"')).join('');
t.innerHTML=`<div class="top"><button class="bet" id="tbx">Về sảnh</button><h3>Tiến lên miền Nam</h3><span class="chips" id="tc" style="padding:4px 10px">${fmt(chips)}</span></div>
<div class="seats">${[1,2,3].map(i=>`<div class="st${turn===i&&!over?' on':''}">${NM[i]}<b>${PS[i]?'Bỏ lượt':HD[i].length+' lá'}</b></div>`).join('')}</div>
<div class="mid">${last?`<div>${NM[last.by]} đánh</div><div class="row2">${last.cards.slice().sort((a,b)=>a-b).map(v=>C(lb(v),fresh?'new':'')).join('')}</div>`:'<div>Vòng mới, đánh tự do</div>'}<div id="ms" class="pot" style="font-size:16px">${ms}</div></div>
<div class="fan">${mine}</div>
<div class="ops">${over?'':`<button class="btn alt" id="pb"${last&&turn===0?'':' disabled'}>Bỏ lượt</button><button class="btn" id="pl2"${turn===0?'':' disabled'}>Đánh</button>`}</div>`;
fresh=0;
$('#tbx').onclick=()=>{tok++;t.hidden=true};
t.querySelectorAll('.fan .mc').forEach(b=>b.onclick=()=>{const v=+b.dataset.v;sel.has(v)?sel.delete(v):sel.add(v);b.classList.toggle('sel')});
if(over){}else{
$('#pb').onclick=()=>ps(0);
$('#pl2').onclick=()=>{const cs=[...sel],a=cs.length&&ana(cs);
if(!a||!beats(a,last&&last.c)){$('#ms').textContent=!a?'Bộ bài không hợp lệ':'Chưa lớn hơn bộ trước';return}mv(0,cs)}}
if(shk){t.classList.remove('shake');void t.offsetWidth;t.classList.add('shake');shk=0}}
async function stp(){const k=++tok;if(over||turn===0)return;await bw(turn);if(k!==tok||over)return;bt(turn)}
function adv(i){let j=i;do{j=(j+1)%NA}while(PS[j]);
if(last&&j===last.by){last=null;PS=[0,0,0,0];ms=(ms?ms+'. ':'')+NM[j]+' đi tự do'}
turn=j;dr();stp()}
function mv(i,cs){const a=ana(cs);
const chop=last&&rk(last.c.k)===15&&last.c.t!=='q'&&(a.t==='q'||a.t==='d');
HD[i]=HD[i].filter(v=>!cs.includes(v));last={c:a,cards:cs,by:i};fresh=1;if(i===0)sel.clear();
ms=chop?NM[i]+' chặt heo!':'';shk=chop?1:0;
if(!HD[i].length)return fin(i);adv(i)}
function ps(i){PS[i]=1;ms=NM[i]+' bỏ lượt';adv(i)}
function fin(i){over=true;const left=HD[0].length;let d;
if(i===0){d=500;burst();ms='Bạn thắng +'+fx(500)}else{d=left===13?600:left*20;ms=NM[i]+' thắng. Bạn thua −'+d+(left===13?' (cóng)':'')}
count(Math.max(0,chips+(i===0?fx(d):-d)));dr();setTimeout(()=>{const e=$('#tc');if(e)e.textContent=fmt(chips)},700)}
