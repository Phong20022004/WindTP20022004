/*@file game/js/04f-sound-3-cay-lieng-poker-config.js
 * Âm thanh, Ba cây, Liêng, bảng cấu hình bàn, Poker (bản 2).
 */
let SND=1,AC=null,NPL=4;
NM.push('Phúc','Thảo','Nam','Mai');AVT.push('🐸','🐵','🦄','🐙');
function snd(k){if(!SND)return;try{AC=AC||new(window.AudioContext||window.webkitAudioContext)();if(AC.state==='suspended')AC.resume();const t=AC.currentTime;
const nz=(d,f,q,v,ty,fe)=>{const n=AC.sampleRate*d|0,b=AC.createBuffer(1,n,AC.sampleRate),a=b.getChannelData(0);for(let i=0;i<n;i++)a[i]=(Math.random()*2-1)*(1-i/n);const s=AC.createBufferSource(),f1=AC.createBiquadFilter(),g=AC.createGain();s.buffer=b;f1.type=ty;f1.frequency.setValueAtTime(f,t);if(fe)f1.frequency.exponentialRampToValueAtTime(fe,t+d);f1.Q.value=q;g.gain.setValueAtTime(v,t);g.gain.exponentialRampToValueAtTime(.001,t+d);s.connect(f1);f1.connect(g);g.connect(AC.destination);s.start(t)};
const tn=(f0,f1,d,v,ty,at=0)=>{const o=AC.createOscillator(),g=AC.createGain();o.type=ty;o.frequency.setValueAtTime(f0,t+at);o.frequency.exponentialRampToValueAtTime(f1,t+at+d);g.gain.setValueAtTime(v,t+at);g.gain.exponentialRampToValueAtTime(.001,t+at+d);o.connect(g);g.connect(AC.destination);o.start(t+at);o.stop(t+at+d)};
if(k==='tap'){nz(.07,1800,1,.5,'bandpass');tn(180,60,.08,.4,'sine')}
else if(k==='flip'||k==='deal')nz(.05,4000,.7,.35,'highpass');
else if(k==='pass')tn(300,200,.12,.15,'triangle');
else if(k==='chip'){tn(2400,2000,.05,.25,'sine');tn(3000,2500,.05,.25,'sine',.06)}
else if(k==='win')[523,659,784,1047].forEach((f,i)=>tn(f,f*1.001,.18,.25,'triangle',i*.1));
else if(k==='lose')[392,330,262].forEach((f,i)=>tn(f,f*.99,.2,.22,'sawtooth',i*.14));
else if(k==='boom'){nz(.6,900,.5,.8,'lowpass',80);tn(90,30,.5,.7,'sine')}
else if(k==='whoosh')nz(.3,500,2,.3,'bandpass',2500);
else if(k==='splat')nz(.15,700,.8,.5,'lowpass',200);
else if(k==='ban'){tn(140,50,.25,.5,'sine');nz(.1,1200,1,.3,'bandpass')}}catch(e){}}
document.addEventListener('pointerdown',()=>{try{AC=AC||new(window.AudioContext||window.webkitAudioContext)();AC.resume()}catch(e){}},{once:true});
{const w=(n,f)=>{const o=window[n];window[n]=function(...a){f(...a);return o.apply(this,a)}};
w('ps',()=>snd('pass'));w('tien',()=>{NPL=NA;snd('deal')});w('phom',()=>{NPL=NA});w('tlthrow',()=>snd('whoosh'));w('blob',()=>snd('splat'));w('boom',()=>snd('boom'));w('tlbanner',()=>snd('ban'));w('burst',()=>snd('win'));w('aft',()=>snd('tap'))}
function tlmute(){const t=$('.tt');if(!t||$('#mu'))return;const b=document.createElement('button');b.className='rb';b.id='mu';b.innerHTML=spkIcon(SND);b.onclick=()=>{SND^=1;b.innerHTML=spkIcon(SND)};t.insertBefore(b,t.querySelector('.inf'))}
{const d1=dr;dr=function(){d1();tlmute()}}
function tlpanel(o){const fx=$('#fxl');if(!fx)return;let p=$('#chp');if(p){p.remove();if(!o)return}
if(tlT>=NPL)tlT=1;p=document.createElement('div');p.id='chp';
p.innerHTML=`<div class='tg'>${Array.from({length:NPL-1},(_,j)=>j+1).map(i=>`<button class='pill${i===tlT?' on':''}' data-i='${i}'>${NM[i]}</button>`).join('')}</div><div class='it'>${ITM.map((m,k)=>`<button data-k='${k}'>${m[0]}<small>${m[1]}</small></button>`).join('')}</div><div class='ph'>${PHR.map(s=>`<button>${s}</button>`).join('')}</div><div class='ci'><input id='chi' maxlength='40' placeholder='Gõ tin nhắn...'><button id='chs'>Gửi</button></div>`;
fx.append(p);
p.querySelectorAll('.pill').forEach(b=>b.onclick=()=>{tlT=+b.dataset.i;p.querySelectorAll('.pill').forEach(z=>z.classList.toggle('on',z===b))});
p.querySelectorAll('.it button').forEach(b=>b.onclick=()=>{tlthrow(0,tlT,+b.dataset.k);p.remove()});
p.querySelectorAll('.ph button').forEach(b=>b.onclick=()=>{tlsay(0,b.textContent);p.remove()});
const sd=()=>{const v=$('#chi').value.trim();if(!v)return;tlsay(0,v);p.remove();setTimeout(()=>tlsay(1+(Math.random()*(NPL-1)|0),['Ừ nhỉ','Haha','Đánh đi chứ!','Đợi tí','Chơi tiếp nào'][Math.random()*5|0]),1200)};
$('#chs').onclick=sd;$('#chi').onkeydown=e=>{if(e.key==='Enter')sd()}}
const CFG={'3c':{n:4,b:100,max:8},lieng:{n:4,b:100,max:8}},CKS=[0,15000,22000,9000,18000,12000,26000,7000];let CK=[...CKS];
const pcx=(v,x='',st='')=>{const lab={1:'A',11:'J',12:'Q',13:'K',14:'A'}[v>>2]||v>>2,s=S[v&3];return `<div class='pc${(v&3)>1?' r':''}${x}' ${st}><i>${lab}</i><s>${s}</s><u>${s}</u></div>`};
function tbase(t){if(!t.querySelector('.tlx'))t.innerHTML=`<div class='tlx'><div id='tli' style='display:contents'></div><div id='fxl'></div></div>`}
function tseats(N,fn){let h='';for(let k=1;k<N;k++){const a=6.2832*k/N,s=Math.sin(a),c=Math.cos(a);h+=`<div class='sx' style='left:${50+51*s}%;top:${50+(c>0?30:50)*c}%'>${fn(k)}</div>`}return h}
function tfr(N,fn,mid,hand,ops,bet,cen){return `<div class='tt'><button class='rb' id='tbx'>‹</button><button class='rb' id='mu'>${spkIcon(SND)}</button><div class='inf'>Cược: ${bet}</div></div><div class='neon' style='left:100px'>CASINO</div><div class='neon n2' style='right:175px'>777</div><i class='dc' style='left:1%;bottom:34%'>🎰</i><i class='dc' style='right:1%;bottom:34%'>🎰</i><div class='tlt'><i class='md' style='left:13.5%;top:13.5%'></i><i class='md' style='right:13.5%;top:13.5%'></i><div class='tlf'><div class='mid2'>${mid}</div></div>${tseats(N,fn)}</div><div class='bt2' style='justify-content:${cen?'center':'space-between'}'>${ops}</div>${hand}<div class='me'><div class='pl'><div class='av' id='av0'>${AVT[0]}</div><div><b>Bạn</b><span id='tc'>${fmt(chips)}</span></div></div></div><button class='rb' id='chat'>💬</button>`}
function tbind(t,stop){$('#tbx').onclick=()=>{stop();t.hidden=true};$('#mu').onclick=e=>{SND^=1;e.currentTarget.innerHTML=spkIcon(SND)};$('#chat').onclick=()=>tlpanel(!$('#chp'));t.querySelectorAll('.pl[data-t]').forEach(p=>p.onclick=()=>{tlT=+p.dataset.t;tlpanel(1)})}
const tcu=()=>setTimeout(()=>{const e=$('#tc');if(e)e.textContent=fmt(chips)},700),fl4=(net,N)=>{net.forEach((v,i)=>v&&i<N&&setTimeout(()=>tlfloat(i,v>0?fx(v):v),300+i*110));chipRun(net,N)},talk=N=>setTimeout(()=>tlsay(1+(Math.random()*(N-1)|0),PHR[Math.random()*PHR.length|0]),700);
function ev3(h){const p=h.reduce((a,v)=>a+(v>>2),0)%10,st=v=>(v>>2)===1&&(v&3)>1?1000+[0,1,3,2][v&3]:[0,1,3,2][v&3]*20+(v>>2);return{tay:false,p:p||10,top:Math.max(...h.map(st))}}
const cmp3=(a,b)=>a.p!==b.p?a.p-b.p:a.top-b.top,lab3=e=>e.p+' điểm';
let CD=-1,C3H=[],C3V=[],C3n=new Set(),C3o=true,C3m='',C3k=0;
function c3(){let t=$('#tb');if(!t){t=document.createElement('div');t.id='tb';document.body.append(t)}t.hidden=false;t.classList.add('land');NPL=CFG['3c'].n;C3o=true;C3H=[];c3r()}
async function c3deal(){const k=++C3k,N=NPL,B=CFG['3c'].b;if(chips<B*2){needChips();return}if(CD<0||CD>=N)CD=1;
const d=deck().filter(c=>c.r<=9).map(c=>c.r*4+c.s);C3H=Array.from({length:N},(_,i)=>d.slice(i*3,i*3+3));C3V=Array(N).fill(0);C3o=false;C3m='Chia bài...';C3n=new Set([...Array(N).keys()]);c3r();snd('deal');
await sleep(900+N*90);if(k!==C3k)return;C3V[0]=1;C3n=new Set([0]);snd('flip');c3r();await sleep(700);
for(let i=1;i<N;i++){if(k!==C3k)return;C3V[i]=1;C3n=new Set([i]);snd('flip');c3r();await sleep(380)}
const E=C3H.map(ev3),net=Array(N).fill(0);
for(let i=0;i<N;i++){if(i===CD)continue;const w=cmp3(E[i],E[CD])>0,a=B*((w?E[i].tay:E[CD].tay)?2:1);net[i]+=w?a:-a;net[CD]+=w?-a:a}
for(let i=1;i<N;i++)CK[i]=Math.max(0,CK[i]+fx(net[i]));
count(Math.max(0,chips+fx(net[0])));C3m=net[0]>=0?'Bạn thắng!':'Bạn thua';
if(net[0]>0)burst();else snd('lose');{const rob=[...Array(N).keys()].filter(i=>i!==CD&&E[i].p===10&&cmp3(E[i],E[CD])>0).sort((a,b)=>cmp3(E[b],E[a]))[0];if(E.some(e=>e.p===10))tlbanner('10 ĐIỂM!','#ffd36a');if(rob!==undefined){CD=rob;setTimeout(()=>tlbanner('CƯỚP CHƯƠNG: '+NM[rob],'#ff4d4d'),1300)}}
C3o=true;C3n=new Set();c3r();fl4(net,N);tcu();talk(N)}
function c3r(){const t=$('#tb'),N=NPL,B=CFG['3c'].b;tbase(t);
const cards=(i,sm)=>(C3H[i]||[]).map((v,j)=>C3V[i]?pcx(v,(sm?' xs':'')+(C3n.has(i)?' new':''),`style='animation-delay:${j*90}ms'`):`<div class='cb2${sm?' s':''}${C3n.has(i)?' new':''}' style='animation-delay:${j*90}ms'></div>`).join('');
const seat=k=>`<div class='pl' data-t='${k}'><div class='av' id='av${k}'>${AVT[k]}</div><div><b>${NM[k]}${k===CD?' (cái)':''}</b><span>${fmt(CK[k])}</span></div></div><div class='sc'>${cards(k,1)}</div>${C3V[k]?`<small class='stt'>${lab3(ev3(C3H[k]))}</small>`:''}`;
const mid=`<div class='pot'>${C3m}</div><div class='lab'>Nhà cái: ${CD<0?'chưa chia':NM[CD]}</div>${C3V[0]?`<div class='lab'>Bạn: ${lab3(ev3(C3H[0]))}</div>`:''}`;
$('#tli').innerHTML=tfr(N,seat,mid,`<div class='hand2'>${cards(0,0)}</div>`,(C3H.length?'':`<button class='b2 g' id='c3b'${C3o?'':' disabled'}>CHIA BÀI</button>`),B+' Chips',1);
tbind(t,()=>{C3k++});if($('#c3b'))$('#c3b').onclick=c3deal}
let LNn=4,LH=[],LA=[],LC=[],LT=[],LU=0,LP=0,LQ=[],Lo=true,Lm='',Lk=0,LF=1;
function lieng(){let t=$('#tb');if(!t){t=document.createElement('div');t.id='tb';document.body.append(t)}t.hidden=false;t.classList.add('land');LNn=CFG.lieng.n;NPL=LNn;
const N=LNn,B=CFG.lieng.b;if(chips<B*2){needChips();return}for(let i=1;i<N;i++)CK[i]=Math.max(CK[i],3000,B*15);
const d=deck().map(c=>c.r*4+c.s);LH=Array.from({length:N},(_,i)=>d.slice(i*3,i*3+3));LA=Array(N).fill(1);LC=Array(N).fill(0);LT=Array(N).fill(B);LU=0;LR=0;LP=B*N;setChips(chips-B);Lo=false;Lk++;LF=1;
LQ=[...Array(N).keys()];Lm='Mỗi người góp '+B+' Chips';snd('deal');lgr();lgn()}
function lgn(){if(!LQ.length)return lgfin(null);if(LQ[0]!==0)lgbot()}
function lgr(){const t=$('#tb'),N=LNn,B=CFG.lieng.b,call=LU-LC[0],my=!Lo&&LQ[0]===0;tbase(t);
const seat=k=>`<div class='pl' data-t='${k}'><div class='av' id='av${k}'>${AVT[k]}</div><div><b>${NM[k]}</b><span>${fmt(CK[k]-LT[k])}</span></div></div><div class='sc'>${LH[k].map(v=>Lo&&LA[k]?pcx(v,' xs new'):`<div class='cb2 s'></div>`).join('')}</div><small class='stt'>${LA[k]?(Lo?qev(LH[k])[3]:'Cược '+LT[k]):'Đã bỏ'}</small>`;
const mid=`<div class='pot'>Pot ${fmt(LP)}</div><div class='lab'>Mức cược: ${LU}</div><div class='ms'>${Lm}</div><div class='lab'>Bạn: ${qev(LH[0])[3]}</div>`;
const ops=Lo?``:`<button class='b2 r' id='qf'${my?'':' disabled'}>Bỏ</button><button class='b2 g' id='qc'${my?'':' disabled'}>${call?'Theo '+call:'Xem'}</button>`;
$('#tli').innerHTML=tfr(N,seat,mid,`<div class='hand2'>${LH[0].map((v,j)=>pcx(v,LF?' new':'',`style='animation-delay:${j*90}ms'`)).join('')}</div>`,ops,B+' Chips',Lo);LF=0;
tbind(t,()=>{Lk++});if($('#nw'))$('#nw').onclick=lieng;
if($('#qf')){$('#qf').onclick=()=>lgact(0,'f');$('#qc').onclick=()=>lgact(0,'c');slider(LU+B,LC[0]+chips,B,v=>lgact(0,'r',v),my&&LR<3)}}
function lgact(i,a,to){const B=CFG.lieng.b,N=LNn;
if(a==='f'){LA[i]=0;LQ.shift();Lm=NM[i]+' bỏ';snd('pass');if(i===0&&!window.SPEC)return lgfin(null)}
else{if(a==='r'){LU=Math.max(LU+B,to||LU+2*B);LR++}const need=LU-LC[i],pay=i===0?Math.min(chips,need):need;LC[i]+=pay;LT[i]+=pay;LP+=pay;if(i===0)setChips(chips-pay);snd('chip');chipFly(i);
Lm=NM[i]+(a==='r'?' tố lên '+LU:need?' theo '+need:' xem');LQ.shift();if(a==='r')LQ=Array.from({length:N-1},(_,k)=>(i+1+k)%N).filter(x=>LA[x])}
if(LA.filter(Boolean).length===1)return lgfin(LA.indexOf(1));lgr();lgn()}
async function lgbot(){const k=++Lk;await bw(LQ[0]);if(k!==Lk||Lo)return;const i=LQ[0],B=CFG.lieng.b,e=qev(LH[i]),s=e[0]===3?100:e[0]===2?80:e[0]===1?60:e[1]*6+Math.random()*8,call=LU-LC[i];let a='c';
if(s>=80)a=LR<3&&Math.random()<.6?'r':'c';else if(s>=60)a=LR<3&&Math.random()<.25?'r':'c';else if(call>0&&(s<30||call>4*B)&&Math.random()<.7)a='f';else if(s>=45&&LR<3&&Math.random()<.15)a='r';
lgact(i,a)}
function lgfin(w){Lo=true;Lk++;const N=LNn;if(w===null){const al=[...Array(N).keys()].filter(x=>LA[x]);w=al.reduce((b,x)=>qcmp(qev(LH[x]),qev(LH[b]))>0?x:b)}
const net=LH.map((_,i)=>(i===w?LP:0)-LT[i]);for(let i=1;i<N;i++)CK[i]=Math.max(0,CK[i]+fx(net[i]));
if(w===0){feeWin(LP,LT[0]);burst();Lm='Bạn thắng ('+qev(LH[0])[3]+')'}else{snd('lose');Lm=NM[w]+' thắng ('+qev(LH[w])[3]+')'}
lgr();fl4(net,N);tcu();talk(N);{const e=qev(LH[w]);if(e[0]>0)tlbanner(e[0]===3?'SÁP!':e[0]===2?'LIÊNG!':'BA TÂY!','#ffd36a')}}
function pmOk(){if(!PMS)return false;const need=[...PMS.sel,PMS.cc];return melds([...FH[0],PMS.cc]).some(x=>x.includes(PMS.cc)&&x.length===need.length&&need.every(v=>x.includes(v)))}
function pmUpd(){const b=$('#mph'),ok=pmOk();if(b)b.disabled=!ok;const e=$('#ms');if(e&&PMS)e.textContent=ok?'Đủ bộ, bấm HẠ PHỎM':'Chọn các lá trong tay để ăn cùng '+pl(PMS.cc)+' (đã chọn '+PMS.sel.size+')'}
function showMeldPick(opts,cc,apply){const old=$('#tli .mpk');if(old)old.remove();const d=document.createElement('div');d.className='mpk';
d.innerHTML=`<b>Chọn bộ để ăn ${pl(cc)}</b><small>Sau khi ăn bạn mới chọn lá để đánh</small><div class='mpl'>${opts.map((m,i)=>`<button class='mpo' data-i='${i}'>${[...m].sort((a,b)=>a-b).map(v=>pcx(v,' sm'+(v===cc?' mine':''))).join('')}</button>`).join('')}</div><button class='b2 r mpx'>Hủy</button>`;
$('#tli').append(d);d.querySelectorAll('.mpo').forEach(b=>b.onclick=()=>{d.remove();apply(opts[+b.dataset.i])});d.querySelector('.mpx').onclick=()=>d.remove()}
function pr(){const t=$('#tb');tbase(t);NPL=NA;const h=FH[0],m=new Set(solve(h).m.flat()),top=DISC[DISC.length-1],sc=FH.map(x=>solve(x).p),n=h.length,step=Math.min(44,(t.clientWidth-82)/Math.max(1,n-1)),c=(n-1)/2;
const can=!fo&&FT===0&&FP==='d'&&top&&top.by===NA-1&&melds([...h,top.v]).some(x=>x.includes(top.v)),ex=i=>FX[i].flat().map(v=>pcx(v,' xs meld')).join('');
const seat=k=>`<div class='pl' data-t='${k}'><div class='av' id='av${k}'>${AVT[k]}</div><div><b>${NM[k]}</b><i style='font-style:normal;font-size:11px;color:#f0c46a;font-weight:700'>${fo?sc[k]+' điểm':FD[k]+'/4, '+FH[k].length+' lá'}</i></div></div><div class='sc'>${ex(k)}</div>`;
const mid=`<div class='row2'>${BK(1)}<span>Bốc (${STK.length})</span>${top?pcx(top.v,' sm').replace('<div ',"<div id='dsc' "):''}<span>${top?NM[top.by]+' vừa đánh':''}</span></div>${FX[0].length?`<div class='row2'>${ex(0)}</div>`:''}<div class='ms' id='ms'>${fm}</div>`;
const hand=`<div class='hand' style='width:${58+(n-1)*step}px'>${h.map((v,i)=>pcx(v,' hc'+(PMS?'':(m.has(v)?' meld':''))+((PMS?PMS.sel.has(v):fs===v)?' sel':''),`data-v='${v}' style='--x:${i*step}px;--r:${(i-c)*2.4}deg;--y:${Math.pow(Math.abs(i-c),2)*.32}px'`)).join('')}</div>`;
const d2=!fo&&FT===0&&FP==='d',ops=PMS?`<button class='b2 r' id='mpc'>Hủy</button><button class='b2 g' id='mph'${pmOk()?'':' disabled'}>HẠ PHỎM</button>`:fo?``:FT!==0?`<button class='b2 r' disabled>Đang chờ ${NM[FT]}</button>`:d2?`<button class='b2 r' id='dr1'${STK.length?'':' disabled'}>Bốc bài</button><button class='b2 g' id='ea'${can?'':' disabled'}>Ăn ${top?pl(top.v):''}</button>`:`<button class='b2 g' id='di'>ĐÁNH LÁ CHỌN</button>`;
$('#tli').innerHTML=tfr(NA,seat,mid,hand,ops,'ván phỏm',!d2);if(ff&&top)flyFrom(top.by,'#dsc');ff=0;
tbind(t,()=>{fk++});
t.querySelectorAll('.hc').forEach(b=>b.onclick=()=>{const v=+b.dataset.v;if(PMS){PMS.sel.has(v)?PMS.sel.delete(v):PMS.sel.add(v);b.classList.toggle('sel',PMS.sel.has(v));pmUpd();return}fs=fs===v?null:v;t.querySelectorAll('.hc').forEach(x=>x.classList.toggle('sel',+x.dataset.v===fs))});
if($('#nw'))$('#nw').onclick=phom;
if($('#mpc'))$('#mpc').onclick=()=>{PMS=null;fm='';pr()};
if($('#mph'))$('#mph').onclick=()=>{if(!PMS||!pmOk())return;const cc=PMS.cc,need=[...PMS.sel,cc],mm=melds([...h,cc]).find(x=>x.includes(cc)&&x.length===need.length&&need.every(v=>x.includes(v)));DISC.pop();FX[0].push(mm);FH[0]=h.filter(v=>!mm.includes(v));PMS=null;FP='x';fm='Bạn ăn '+pl(cc);snd('flip');pr()};
if(PMS)pmUpd();
if($('#dr1'))$('#dr1').onclick=()=>{snd('flip');FH[0]=[...h,STK.pop()].sort((a,b)=>a-b);FP='x';fm='';pr()};
if($('#ea'))$('#ea').onclick=()=>{snd('flip');const cc=DISC[DISC.length-1].v;PMS={cc,sel:new Set()};fm='Chọn các lá trong tay để ăn cùng '+pl(cc);pr()};
if($('#di'))$('#di').onclick=()=>{if(fs===null){$('#ms').textContent='Chọn một lá để đánh';return}FH[0]=h.filter(v=>v!==fs);DISC.push({v:fs,by:0});FD[0]++;fs=null;ff=1;fm='';aft(0)}}
function cfgShow(){let c=$('#cfg');if(!c){c=document.createElement('div');c.id='cfg';$('#play').parentNode.before(c)}
const g=CFG[cur];if(!g){c.innerHTML='';return}$('#play').textContent='Tạo bàn';
c.innerHTML=`<div class='cf'>Số người: ${Array.from({length:g.max-1},(_,i)=>i+2).map(v=>`<button data-n='${v}' class='${v===g.n?'on':''}'>${v}</button>`).join('')}</div><div class='cf'>Cược: ${[100,500,1000,10000,100000].map(v=>`<button data-b='${v}' class='${v===g.b?'on':''}'>${v}</button>`).join('')}</div>`;
c.querySelectorAll('button').forEach(b=>b.onclick=()=>{if(b.dataset.n)g.n=+b.dataset.n;else g.b=+b.dataset.b;cfgShow()})}
document.querySelectorAll('.tile').forEach(b=>b.addEventListener('click',cfgShow));
G['3c'].r.push('Tạo bàn từ 2 đến 8 người. Một người làm cái, ván sau đổi cái sang người kế tiếp. Người chơi so với cái, ba tây thắng gấp đôi.');
G.lieng.r.push('Tạo bàn từ 2 đến 8 người. Mỗi ván góp 1 cược, tố thêm 2 cược mỗi lần.');
CFG.pk={n:4,b:100,max:8};
const pkN=()=>CFG.pk.n;
function pkg(){let t=$('#tb');if(!t){t=document.createElement('div');t.id='tb';document.body.append(t)}t.hidden=false;t.classList.add('land');
const N=pkN(),B=CFG.pk.b;NPL=N;if(chips<B*4){needChips();return}while(KS.length<8)KS.push(2000);for(let i=1;i<N;i++)if(KS[i]<B*4)KS[i]=Math.max(2000,B*20);
EF=Math.floor(Math.min(chips,...KS.slice(1,N),2000)/B)*B;DL=(DL+1)%N;Pk++;Po=false;Psh=false;Psc={};Pn=1;
DK=deck().map(c=>(c.r===1?14:c.r)*4+c.s);HH=Array.from({length:N},()=>[DK.pop(),DK.pop()]);BD=[];
PO=0;BC=Array(N).fill(0);TC=Array(N).fill(0);AL=Array(N).fill(1);AI=Array(N).fill(0);SG=0;RC=0;CU=0;Pf=0;
const sb=N===2?DL:(DL+1)%N,bb=N===2?(DL+1)%N:(DL+2)%N;pkc(sb,B/2);pkc(bb,B);CU=B;LR=B;
PQ=pko((bb+1)%N);PM='Mù nhỏ '+B/2+', mù lớn '+B;snd('deal');pkr();pkn()}
async function pkst(){if(SG===3)return pks();const N=pkN(),B=CFG.pk.b;SG++;const n=SG===1?3:1;for(let k=0;k<n;k++)BD.push(DK.pop());Pf=n;BC=Array(N).fill(0);CU=0;LR=B;RC=0;snd('flip');
PQ=pko((DL+1)%N);PM=['','Flop','Turn','River'][SG];
if(PQ.length<2){PQ=[];pkr();const k=++Pk;await sleep(1300);if(k!==Pk)return;return pkst()}pkr();pkn()}
function pks(){const al=[...Array(pkN()).keys()].filter(i=>AL[i]);al.forEach(i=>Psc[i]=pkbest([...HH[i],...BD]));let b=al[0];al.forEach(i=>{if(cmpA(Psc[i],Psc[b])>0)b=i});pkw(al.filter(i=>cmpA(Psc[i],Psc[b])===0),true,Psc[b][0])}
function pkw(w,show,cat){Po=true;Psh=show;const N=pkN(),sh=Math.floor(PO/w.length),net=Array.from({length:N},(_,i)=>(w.includes(i)?sh:0)-TC[i]);
for(let i=1;i<N;i++)KS[i]+=fx(net[i]);
if(w.includes(0)){feeWin(sh,TC[0]);burst();PM='Bạn thắng'+(show?' ('+HN[cat]+')':'!')}else{snd('lose');PM=w.map(i=>NM[i]).join(' & ')+' thắng'+(show?' với '+HN[cat]:'')}
pkr();fl4(net,N);tcu();talk(N);if(show&&cat>=4)tlbanner(HN[cat].toUpperCase()+'!','#ffd36a')}
function pka(i,a,to){const N=pkN();let m;
if(a==='f'){AL[i]=0;PQ.shift();m=NM[i]+' bỏ';snd('pass')}
else if(a==='c'){const n=Math.min(CU-BC[i],EF-TC[i]);pkc(i,n);PQ.shift();m=NM[i]+(n?' theo '+n:' xem');snd('chip');if(n)chipFly(i)}
else{to=Math.min(to,EF-TC[i]+BC[i]);pkc(i,to-BC[i]);snd('chip');chipFly(i);
if(BC[i]>CU){LR=Math.max(LR,BC[i]-CU);CU=BC[i];RC++;PQ=Array.from({length:N-1},(_,k)=>(i+1+k)%N).filter(x=>AL[x]&&!AI[x])}else PQ.shift();
m=NM[i]+(AI[i]?' all-in ':' tố lên ')+BC[i];if(AI[i]){tlbanner('ALL-IN!','#ff4d4d');tlflash('rgba(255,70,70,.35)')}}
PM=m;pkr();pkn()}
async function pkbot(){const k=++Pk;await bw(PQ[0]);if(k!==Pk||Po)return;const B=CFG.pk.b,i=PQ[0],hc=HH[i],need=CU-BC[i];let s;
if(!BD.length){const a=hc[0]>>2,b=hc[1]>>2,h=Math.max(a,b),l=Math.min(a,b);s=(h+l)/32+(a===b?.35+h/50:0)+((hc[0]&3)===(hc[1]&3)?.05:0)+(h-l<=2?.03:0)}
else s=[.15,.42,.65,.75,.8,.85,.92,.97,1][pkbest([...hc,...BD])[0]];
s+=Math.random()*.2-.1;let a='c',to=0;const bet=Math.max(B,Math.round(PO/B)*(B/2));
if(need===0){if(s>.6&&RC<4&&Math.random()<.7){a='r';to=CU+bet}}
else{if(s<.28+need/(PO+1)*.35&&Math.random()<.9)a='f';else if(s>.78&&RC<4&&Math.random()<.45){a='r';to=CU+bet}}
pka(i,a,to)}
function pkr(){const t=$('#tb'),N=pkN(),B=CFG.pk.b,my=HH[0],me=!Po&&PQ[0]===0,call=Math.min(CU-BC[0],EF-TC[0]);tbase(t);
const rs=Math.min(CU+Math.max(B,Math.round(PO/B)*(B/2)),EF-TC[0]+BC[0]),canR=me&&RC<4&&rs>CU&&EF-TC[0]>call;
const seat=i=>`<div class='pl' data-t='${i}'><div class='av' id='av${i}'>${AVT[i]}</div><div><b>${NM[i]}${DL===i?' (D)':''}</b><span>${AL[i]?(AI[i]?'All-in':fmt(KS[i]-TC[i])):'Đã bỏ'}</span></div></div><div class='sc'>${AL[i]?HH[i].map(v=>Psh?pcx(v,' xs new'):`<div class='cb2 s'></div>`).join(''):''}</div><small class='stt'>${Psh&&AL[i]?HN[Psc[i][0]]:BC[i]?'Cược '+BC[i]:''}</small>`;
const board=Array.from({length:5},(_,k)=>BD[k]!==undefined?pcx(BD[k],' sm'+(k>=BD.length-Pf?' new':'')):`<div class='cb2' style='opacity:.22;width:50px;height:72px'></div>`).join('');
const hn=BD.length?HN[pkbest([...my,...BD])[0]]:((my[0]>>2)===(my[1]>>2)?'Đôi':'');
const mid=`<div class='pot'>Pot ${fmt(PO)}</div><div class='row2'>${board}</div><div class='ms'>${PM}</div><div class='lab'>${AL[0]?hn||'Bài của bạn':'Bạn đã bỏ'}${BC[0]?' | Cược '+BC[0]:''}</div>`;
const ops=Po?``:`<button class='b2 r' id='pf'${me?'':' disabled'}>Bỏ</button><button class='b2 g' id='pc'${me?'':' disabled'}>${call?'Theo '+call:'Xem'}</button>`;
$('#tli').innerHTML=tfr(N,seat,mid,`<div class='hand2'>${my.map((v,j)=>pcx(v,Pn?' new':'',`style='animation-delay:${j*90}ms'`)).join('')}</div>`,ops,'mù lớn '+B,Po);
Pn=0;Pf=0;tbind(t,()=>{Pk++});if($('#nw'))$('#nw').onclick=pkg;
if($('#pf')){$('#pf').onclick=()=>pka(0,'f');$('#pc').onclick=()=>pka(0,'c');slider(rs,EF-TC[0]+BC[0],B/2,v=>pka(0,'r',v),canR)}}
G.pk.r.push('Tạo bàn từ 2 đến 8 người, mức cược là mù lớn (mù nhỏ bằng một nửa). Khi chơi 2 người, người giữ nút dealer đặt mù nhỏ và đi trước.');

function slider(mn,mx,st,cb,on){if(!on||mx<mn)return;const d=document.createElement('div');d.className='rsl';d.innerHTML=`<input type='range' id='rg' min='${mn}' max='${mx}' step='1' value='${mn}'><button class='b2 g' id='rb2'>Tố ${mn}</button>`;$('#tli').append(d);
const g=$('#rg'),b=$('#rb2'),val=()=>{let v=+g.value;v=v>=mx-st/2?mx:Math.max(mn,Math.round(v/st)*st);return v};
g.oninput=()=>{const v=val();b.textContent=v>=mx?'ALL-IN '+mx:'Tố '+v};b.onclick=()=>cb(val())}
function chipRun(net,N){const fx=$('#fxl');if(!fx)return;const ws=net.map((v,i)=>v>0?i:-1).filter(i=>i>=0);if(!ws.length)return;
net.forEach((v,i)=>{if(v<0&&i<N)for(let k=0;k<4;k++)setTimeout(()=>{if(!$('#av'+i))return;const w=ws[k%ws.length],[a,b]=tlpos(i),[c,d]=tlpos(w);fly(fx,'🪙',a,b,c,d,700,40,360,()=>snd('chip'),22)},400+k*110)})}
function chipFly(i){const fx=$('#fxl'),t=$('.mid2'),x=$('.tlx');if(!fx||!t||!$('#av'+i))return;const[a,b]=tlpos(i);let c=t.offsetWidth/2,d=t.offsetHeight/2;for(let o=t;o&&o!==x;o=o.offsetParent){c+=o.offsetLeft;d+=o.offsetTop}
for(let k=0;k<3;k++)setTimeout(()=>fly(fx,'🪙',a,b,c,d,500,30,300,()=>snd('chip'),20),k*90)}
function flyFrom(i,sel){const e=$(sel),x=$('.tlx');if(!e||!e.animate||!$('#av'+i))return;const[a,b]=tlpos(i);let cx=e.offsetWidth/2,cy=e.offsetHeight/2;for(let o=e;o&&o!==x;o=o.offsetParent){cx+=o.offsetLeft;cy+=o.offsetTop}
e.animate([{transform:`translate(${a-cx}px,${b-cy}px) scale(.5) rotate(-30deg)`,opacity:.3},{transform:'none',opacity:1}],{duration:450,easing:'cubic-bezier(.2,.8,.2,1)'})}
let PMS=null,PF=0,PFW=0,PBF=0,PX=[0,0,0,0],PEN=[0,0,0,0],AT=[[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]],PDL=-1;
{const p0=phom;phom=function(){if(window.__PHF){PF=window.__PHF.seat;PFW=0;window.__PHF=null}PMS=null;PX=[0,0,0,0];PEN=[0,0,0,0];AT=[[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]];p0()}}
{const a0=aft;aft=function(i){const n=FX[i].length;if(n>PX[i]){PX[i]=n;const by=(i+NA-1)%NA,pm=FD[by]>=4?2:1;PEN[i]+=pm;PEN[by]-=pm;tlfloat(i,fx(pm*TB));tlfloat(by,-pm*TB);AT[i][by]++;tlbanner('ĂN PHỎM!','#7ad7ff');if(AT[i][by]>=3){PDL=by;return pfin(i,2)}}a0(i)}}
function pfin(w,kind){fo=true;fk++;const B=TB,mom=i=>!FX[i].length&&!solve(FH[i]).m.length,sc=FH.map(x=>solve(x).p),net=PEN.slice(),tags=[];
if(kind===2){net[w]+=12;net[PDL]-=12;tags.push('ĂN 3 LÁ ĐỀN LÀNG!')}
else if(kind===1){for(let i=0;i<NA;i++)if(i!==w){net[w]+=4;net[i]-=4}tags.push('Ù!')}
else{const o=[0,1,2,3].filter(i=>i<NA).sort((a,b)=>(+mom(a)-+mom(b))||sc[a]-sc[b]||a-b);w=o[0];o.slice(1).forEach((p,r)=>{const pay=mom(p)?4:r+1;net[w]+=pay;net[p]-=pay});[0,1,2,3].filter(i=>i<NA).forEach(i=>{if(mom(i))setTimeout(()=>tlmark(i,'MÓM'),600+i*150)})}
PF=w;PFW=1;const my=net[0]*B;fm=(w===0?'Bạn thắng!':NM[w]+' thắng.');
if(my>0)burst();else snd('lose');count(Math.max(0,chips+fx(my)));pr();
tags.slice(0,2).forEach((e,k)=>setTimeout(()=>tlbanner(e,'#ffd36a'),300+k*1300));fl4(net.map(x=>x*B),4);tcu()}
G.phom.r=['2 đến 4 người (tốt nhất 4). Người chia 10 lá, những người còn lại 9 lá, phần còn lại là nọc.','Phỏm là 3 lá trở lên cùng số (ngang) hoặc liên tiếp cùng chất (dọc). Cạ là 2 lá đang chờ thêm 1 lá.','Mỗi lượt: ăn lá người trước vừa đánh nếu tạo được phỏm (phải hạ phỏm ngay, không bốc nọc), hoặc bốc nọc, rồi đánh ra 1 lá rác.','Ván kết thúc sau 4 vòng đánh hoặc khi có người ù (hết bài thành phỏm). Điểm: A=1, 2 đến 10 theo số, J=11, Q=12, K=13. Điểm thấp nhất thắng. Móm (không có phỏm nào) luôn xếp bét.','Tiền: hạng 2 trả 1 cược, hạng 3 trả 2, hạng 4 trả 3, móm trả 4. Ù thắng 4 cược từ mỗi người. Lá bị ăn: người đánh trả 1 cược cho người ăn, vòng cuối trả gấp đôi. Ăn 3 lá của cùng một người thì người ăn ù và người bị ăn đền cả làng.','Chưa có: gửi bài vào phỏm đã hạ.'];
G.lieng.r=['2 đến 8 người, mỗi người 3 lá. Mỗi ván góp tiền sàn, rồi vòng tố đi ngược chiều kim đồng hồ. Mỗi lượt: Úp (bỏ), Theo, Tố, hoặc Xem khi chưa ai tố. Tố bằng thanh trượt, kéo hết cỡ là tất tay. Tối đa 3 lần tố.','Thứ hạng: Sáp (3 lá cùng số, A lớn nhất) > Liêng (3 lá liên tiếp, Q-K-A lớn nhất, A-2-3 nhỏ nhất) > Ảnh (3 lá J, Q, K không liên tiếp) > bài điểm.','Điểm: cộng 3 lá lấy hàng đơn vị, A=1, J Q K=0. Bằng nhau so lá lớn nhất rồi so chất: Cơ > Rô > Chuồn > Bích.','Chỉ còn một người chưa úp thì thắng luôn, không cần ngửa bài. Hết vòng tố còn nhiều người thì ngửa bài so.'];
G['3c'].r=['Bộ 36 lá (bỏ 10, J, Q, K). 2 đến 8 người. Một người làm Chương, các nhà con so với Chương.','Điểm là hàng đơn vị của tổng 3 lá, từ 1 đến 10 (không có 0, tổng chẵn chục tính 10 điểm). A=1.','Bằng điểm so lá lớn nhất: chất trước Rô > Cơ > Chuồn > Bích, rồi số 9 > ... > 2 > A. Ngoại lệ: A Rô và A Cơ lớn hơn mọi lá khác.','Nhà con hơn Chương thì Chương trả đúng tiền cược, ngược lại Chương ăn cược.','Cướp Chương: nhà con được 10 điểm và hơn Chương thì làm Chương ván sau (nhiều người 10 điểm thì lá lớn nhất). Chưa có: góp gió, đánh biên, ké cửa.'];
$('#game').classList.add('land');
[['tien',1],['phom',1],['lieng',1],['pkg',1],['cvg',0],['xg',0]].forEach(([n,l])=>{const f=window[n];window[n]=function(){let t=$('#tb');if(!t){t=document.createElement('div');t.id='tb';document.body.append(t)}
t.classList.toggle('land',!!l);try{if(l)screen.orientation.lock('landscape').catch(()=>{});else screen.orientation.unlock()}catch(e){}f()}});
