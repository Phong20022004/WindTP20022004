/*@file game/js/06-patch-3-cay-chuong.js
 * Patch: Ba cây Chương miền Bắc theo đúng luật.
 */

/* ===== PATCH: Bài 3 cây Chương miền Bắc theo đúng luật ===== */
(()=>{
let C3R=[],C3G=0,C3pend=null,C3bet=0;
CFG['3c'].gio=0;
const nm=i=>NM[i];

c3r=function(){const t=$('#tb'),N=NPL,B=CFG['3c'].b;tbase(t);
 const cards=(i,sm)=>(C3H[i]||[]).map((v,j)=>C3V[i]?pcx(v,(sm?' xs':'')+(C3n.has(i)?' new':''),`style='animation-delay:${j*90}ms'`):`<div class='cb2${sm?' s':''}${C3n.has(i)?' new':''}' style='animation-delay:${j*90}ms'></div>`).join('');
 const seat=k=>`<div class='pl' data-t='${k}'><div class='av' id='av${k}'>${AVT[k]}</div><div><b>${nm(k)}${k===CD?' ★':''}</b><span>${fmt(CK[k])}</span></div></div><div class='sc'>${cards(k,1)}</div>${C3V[k]?`<small class='stt'>${lab3(ev3(C3H[k]))}</small>`:(C3bet&&k!==CD?`<small class='stt'>Cược ${B}</small>`:'')}${C3R[k]&&C3R[k].t?`<small class='stt' style='color:${C3R[k].p?'#7dff9a':'#ff7b7b'}'>${C3R[k].t}</small>`:''}`;
 const mid=`<div class='pot'>${C3m}</div><div class='lab'>Chương: ${CD<0?'chưa có':nm(CD)} · Cược ${B}</div>${C3G?`<div class='lab'>Hũ gió: ${fmt(C3G)}</div>`:''}${C3V[0]?`<div class='lab'>Bạn: ${lab3(ev3(C3H[0]))}</div>`:''}`;
 const ops=C3pend?`<button class='b2 g' id='c3k'${C3pend.canKeep?'':' disabled'}>LÀM CHƯƠNG</button><button class='b2 r' id='c3s'${C3pend.buyer>=0?'':' disabled'}>BÁN CHƯƠNG +${fmt(C3pend.price)}</button>`:(C3H.length?'':`<button class='b2 g' id='c3b'${C3o?'':' disabled'}>CHIA BÀI</button>`);
 $('#tli').innerHTML=tfr(N,seat,mid,`<div class='hand2'>${cards(0,0)}</div>`,ops,B+' Chips',!C3pend);
 tbind(t,()=>{C3k++;if(C3pend&&C3pend.res)C3pend.res('x')});
 if($('#c3b'))$('#c3b').onclick=c3deal;
 if($('#c3k'))$('#c3k').onclick=()=>C3pend.res('keep');
 if($('#c3s'))$('#c3s').onclick=()=>C3pend.res('sell')};

c3deal=async function(){
 const k=++C3k,N=NPL,B=CFG['3c'].b,gio=CFG['3c'].gio?Math.max(10,Math.round(B/5)):0,need=B*(N-1),all=[...Array(N).keys()],cap=i=>i===0?chips:CK[i];
 if(chips<B*2){needChips();return}
 let note='';
 if(CD<0||CD>=N){CD=Math.random()*N|0;note=nm(CD)+' bốc được Chương'}
 if(cap(CD)<need){const alt=all.filter(i=>i!==CD&&cap(i)>=need).sort((a,b)=>cap(b)-cap(a))[0];if(alt!==undefined){note=nm(CD)+' không đủ vốn, '+nm(alt)+' làm Chương';CD=alt}}
 HF.c3={f:[0,0,0],active:0,done:0};C3H=all.map(()=>[]);C3V=Array(N).fill(0);C3R=Array(N).fill(null);C3pend=null;C3G=gio*N;C3o=false;C3bet=1;C3n=new Set();
 C3m=note||'Nhà Con đặt cược '+B+' Chips';c3r();if(note)tlbanner(note,'#ffd36a');
 all.forEach((i,q)=>{if(i!==CD)setTimeout(()=>{if(k===C3k)chipFly(i)},q*110)});snd('chip');
 await sleep(900+N*60);if(k!==C3k)return;
 const d=deck().filter(c=>c.r<=9).map(c=>c.r*4+c.s);C3H=all.map((_,i)=>d.slice(i*3,i*3+3));
 C3n=new Set(all);C3m='Chương '+nm(CD)+' chia bài...';c3r();snd('deal');
 await sleep(900+N*90);if(k!==C3k)return;
 C3m='Lật bài của bạn';HF.c3.active=1;c3r();await humanFlip(k);if(k!==C3k)return;C3V[0]=1;C3n=new Set([0]);snd('flip');c3r();await sleep(600);if(k!==C3k)return;const order=[...all.filter(i=>i!==0&&i!==CD),...(CD!==0?[CD]:[])];
 C3m='Nhà Con ngửa bài';
 for(const i of order){if(k!==C3k)return;C3V[i]=1;C3n=new Set([i]);if(i===CD)C3m='Chương ngửa bài';snd('flip');c3r();await sleep(i===0?700:420)}
 const E=C3H.map(ev3),net=Array(N).fill(0);
 all.forEach(i=>{if(i===CD)return;const w=cmp3(E[i],E[CD])>0;net[i]+=w?B:-B;net[CD]+=w?-B:B;C3R[i]={t:(w?'Thắng +':'Thua −')+B,p:w}});
 {const nc=net[CD];C3R[CD]={t:(nc>=0?'+':'−')+Math.abs(nc),p:nc>=0}}
 let gw=-1;
 if(gio){gw=all.reduce((b,i)=>cmp3(E[i],E[b])>0?i:b,0);all.forEach(i=>net[i]-=gio);net[gw]+=gio*N}
 for(let i=1;i<N;i++)CK[i]=Math.max(0,CK[i]+fx(net[i]));
 count(Math.max(0,chips+fx(net[0])));
 C3m=net[0]>=0?'Bạn thắng!':'Bạn thua';
 if(net[0]>0)burst();else snd('lose');
 C3n=new Set();c3r();fl4(net,N);tcu();talk(N);
 if(E.some(e=>e.p===10))tlbanner('10 ĐIỂM!','#ffd36a');
 if(gio)tlbanner('ĂN HŨ GIÓ: '+nm(gw),'#7ad7ff');
 const rob=all.filter(i=>i!==CD&&E[i].p===10&&cmp3(E[i],E[CD])>0).sort((a,b)=>cmp3(E[b],E[a]))[0];
 if(rob!==undefined){
  await sleep(2300);if(k!==C3k)return;
  tlbanner(nm(rob)+' CƯỚP CHƯƠNG!','#ff4d4d');tlflash('rgba(255,70,70,.45)');burst();snd('ban');
  const price=B*3,elig=i=>cap(i)>=need;
  if(rob===0){
   const bu=all.filter(i=>i!==0&&elig(i)).sort((a,b)=>CK[b]-CK[a]);
   C3pend={canKeep:chips>=need,buyer:bu.length?bu[0]:-1,price};C3m='Bạn cướp được Chương! Làm hay bán?';c3r();
   const ch=await new Promise(r=>{C3pend.res=r});if(k!==C3k)return;
   const bi=C3pend.buyer;C3pend=null;
   if(ch==='sell'&&bi>=0){CK[bi]-=price;count(chips+price);CD=bi;C3m='Bạn bán Chương cho '+nm(bi);tlfloat(0,price);tlfloat(bi,-price)}
   else if(ch==='keep'||bi<0){CD=0;C3m='Bạn làm Chương ván sau'}
   else{CD=0}
  }else if(!elig(rob)){
   const bi=all.filter(i=>i!==0&&i!==rob&&elig(i)).sort((a,b)=>CK[b]-CK[a])[0];
   if(bi!==undefined){CK[bi]-=price;CK[rob]+=price;CD=bi;C3m=nm(rob)+' bán Chương cho '+nm(bi)}else{CD=rob;C3m=nm(rob)+' làm Chương ván sau'}
  }else{CD=rob;C3m=nm(rob)+' làm Chương ván sau'}
 }
 C3o=true;C3n=new Set();c3r()};

{const c30=c3;c3=function(){CD=-1;C3R=[];C3pend=null;C3bet=0;C3G=0;C3k++;c30()}}

/* tùy chọn Góp gió trong màn tạo bàn */
{const cs0=cfgShow;cfgShow=function(){cs0();if(cur!=='3c')return;const c=$('#cfg'),g=CFG['3c'];if(!c)return;
 c.insertAdjacentHTML('beforeend',`<div class='cf'>Góp gió: <button data-gio='0' class='${g.gio?'':'on'}'>Tắt</button><button data-gio='1' class='${g.gio?'on':''}'>Bật</button></div>`);
 c.querySelectorAll('[data-gio]').forEach(b=>b.onclick=()=>{g.gio=+b.dataset.gio;cfgShow()})}}
document.querySelectorAll('.tile').forEach(b=>b.addEventListener('click',()=>cfgShow()));

G['3c'].r=['Bộ 36 lá: bỏ 10, J, Q, K khỏi bộ 52 lá. 2 đến 8 người. Một người làm Chương, những người còn lại là Nhà Con.',
'Trước khi chia, mỗi Nhà Con đặt một mức cược cố định. Chương chia 3 lá cho mỗi người (kể cả Chương), các Nhà Con ngửa bài rồi so trực tiếp với Chương.',
'Điểm là hàng đơn vị của tổng 3 lá, A = 1. Tổng chẵn chục tính 10 điểm (không có điểm 0).',
'Bằng điểm thì so lá lớn nhất trong 3 lá: chất trước Rô > Cơ > Chuồn > Bích, rồi số 9 > 8 > ... > 2 > A. Ngoại lệ: A Rô và A Cơ lớn hơn mọi lá khác (A Rô hơn A Cơ).',
'Nhà Con hơn Chương: Chương trả đúng tiền cược. Ngược lại Chương ăn cược đó. Chương phải đủ vốn trả cho tất cả Nhà Con (cược × số Nhà Con), không đủ thì nhường cho người khác.',
'Cướp Chương: Nhà Con được 10 điểm và hơn Chương thì giành Chương ván sau (nhiều người 10 điểm thì lá lớn nhất). Người cướp được chọn Làm Chương hoặc Bán Chương cho người đủ vốn, nhận phí bằng 3 lần cược.',
'Góp gió (tùy chọn khi tạo bàn): mỗi người góp một khoản nhỏ vào hũ, ai cao điểm nhất cả bàn lấy hũ. Chưa có: đánh biên, ké cửa.'];
})();
