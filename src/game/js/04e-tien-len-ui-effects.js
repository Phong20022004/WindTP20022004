/*@file game/js/04e-tien-len-ui-effects.js
 * Giao diện Tiến lên, hiệu ứng ném đồ, kết thúc ván.
 */
let tlg=null,tlord=[],tlT=1,tlLast=0;
const ITM=[['🧱','Gạch','#9aa0a6','💥'],['🥚','Trứng','#ffd84d','🍳'],['💩','Rác','#7a4a22','💩'],['🍅','Cà chua','#d92b2b','🍅'],['👟','Dép','#7aa7d9','💢'],['🌹','Hoa','#ff7aa8','💖']];
const PHR=['Nhanh lên nào!','Hay lắm!','Cho qua nhé','Chặt đi!','Xui quá…','Gg!'];
function ps(i){PS[i]=1;ms='';adv(i)}
function adv(i){let j=i;do{j=(j+1)%NA}while(PS[j]);if(last&&j===last.by){try{tlSettle()}catch(e){}last=null;PS=[0,0,0,0]}turn=j;tlDrop();dr();stp();tlidle()}
function tlpos(i){const x=$('.tlx'),e=$('#av'+i);let a=e.offsetWidth/2,b=e.offsetHeight/2;for(let o=e;o&&o!==x;o=o.offsetParent){a+=o.offsetLeft;b+=o.offsetTop}return[a,b]}
function tlthrow(f,to,k){const it=ITM[k],fx=$('#fxl');if(!fx||!$('#av'+f)||!$('#av'+to))return;const[a,b]=tlpos(f),[c,d]=tlpos(to);
const e=document.createElement('div');e.className='thr';e.textContent=it[0];fx.append(e);
if(!e.animate){e.remove();return}
const an=e.animate([{transform:`translate(${a-16}px,${b-16}px) scale(.7) rotate(0deg)`},{transform:`translate(${(a+c)/2-16}px,${Math.min(b,d)-70}px) scale(1.3) rotate(260deg)`,offset:.5},{transform:`translate(${c-16}px,${d-16}px) scale(1) rotate(560deg)`}],{duration:750,easing:'ease-in'});
an.onfinish=()=>{e.remove();const s=document.createElement('div');s.className='spl';s.style.cssText=`left:${c-34}px;top:${d-34}px;--c:${it[2]}`;s.textContent=it[3];fx.append(s);setTimeout(()=>s.remove(),1900);
const av=$('#av'+to);if(av&&av.animate)av.animate([{transform:'translateX(0)'},{transform:'translateX(-6px)'},{transform:'translateX(6px)'},{transform:'translateX(-4px)'},{transform:'none'}],{duration:400});
if(f===0)setTimeout(()=>tlreply(to),900)}}
function tlsay(i,txt){const fx=$('#fxl');if(!fx||!$('#av'+i))return;const[a,b]=tlpos(i),e=document.createElement('div');e.className='bub';e.textContent=txt;fx.append(e);
const w=e.offsetWidth;e.style.left=Math.max(4,Math.min(a-w/2,$('.tlx').clientWidth-w-4))+'px';e.style.top=(i===2?b+30:b-52)+'px';setTimeout(()=>e.remove(),2800)}
function tlreply(i){if(over)return;if(Math.random()<.85)tlsay(i,['Ê, ném gì thế!','Hừm, nhớ mặt đấy','Ha ha ha','Chơi bẩn nha'][Math.random()*4|0]);
if(Math.random()<.45)setTimeout(()=>tlthrow(i,0,Math.random()*4|0),900)}
function tlidle(){const n=Date.now();if(n-tlLast<5000||over)return;tlLast=n;const r=Math.random(),i=1+(Math.random()*(NA-1)|0);
if(r<.22)tlsay(i,PHR[Math.random()*PHR.length|0]);else if(r<.3)tlthrow(i,0,Math.random()*4|0)}
function tlpanel(o){const fx=$('#fxl');if(!fx)return;let p=$('#chp');if(p){p.remove();if(!o)return}
p=document.createElement('div');p.id='chp';
p.innerHTML=`<div class='tg'>${[1,2,3].map(i=>`<button class='pill${i===tlT?' on':''}' data-i='${i}'>${NM[i]}</button>`).join('')}</div><div class='it'>${ITM.map((m,k)=>`<button data-k='${k}'>${m[0]}<small>${m[1]}</small></button>`).join('')}</div><div class='ph'>${PHR.map(s=>`<button>${s}</button>`).join('')}</div><div class='ci'><input id='chi' maxlength='40' placeholder='Gõ tin nhắn...'><button id='chs'>Gửi</button></div>`;
fx.append(p);
p.querySelectorAll('.pill').forEach(b=>b.onclick=()=>{tlT=+b.dataset.i;p.querySelectorAll('.pill').forEach(z=>z.classList.toggle('on',z===b))});
p.querySelectorAll('.it button').forEach(b=>b.onclick=()=>{tlthrow(0,tlT,+b.dataset.k);p.remove()});
p.querySelectorAll('.ph button').forEach(b=>b.onclick=()=>{tlsay(0,b.textContent);p.remove()});
const sd=()=>{const v=$('#chi').value.trim();if(!v)return;tlsay(0,v);p.remove();setTimeout(()=>tlsay(1+(Math.random()*(NA-1)|0),['Ừ nhỉ','Haha','Đánh đi chứ!','Đợi tí','Chơi tiếp nào'][Math.random()*5|0]),1200)};
$('#chs').onclick=sd;$('#chi').onkeydown=e=>{if(e.key==='Enter')sd()}}
function dr(){const t=$('#tb');
if(!t.querySelector('.tlx'))t.innerHTML=`<div class='tlx'><div id='tli' style='display:contents'></div><div id='fxl'></div></div>`;
const n=HD[0].length,W=t.clientWidth,Hh=t.clientHeight,step=Math.min(44,(W-24-58)/Math.max(1,n-1)),c=(n-1)/2,f0=tlg!==HD;
if(f0){tlg=HD;tlord=[...HD[0]].sort((a,b)=>tlsort?(a&3)-(b&3)||a-b:a-b)}
const hand=tlord.filter(v=>HD[0].includes(v)),o=[[0,.5*Hh],[.36*W,-.1*Hh],[0,-.3*Hh],[-.36*W,-.1*Hh]][last?(NA===2&&last.by===1?2:NA===3&&last.by===2?3:last.by):0];
const cards=hand.map((v,i)=>tlpc(v,' hc'+(sel.has(v)?' sel':'')+(f0?' dl':''),`data-v='${v}' style='--x:${i*step}px;--r:${(i-c)*2.4}deg;--y:${Math.pow(Math.abs(i-c),2)*.32}px;--d:${i*50}ms'`)).join('');
const mid=last?`<div class='cc'>${[...last.cards].sort((a,b)=>a-b).map((v,i,a)=>tlpc(v,' sm'+(fresh?' new':''),`style='--r:${(i-(a.length-1)/2)*5}deg;--fx:${o[0]}px;--fy:${o[1]}px'`)).join('')}</div><div class='lab'>${tlname(last.c)}</div>`:`<div class='lab'>Vòng mới, đánh tự do</div>`;
$('#tli').innerHTML=`<div class='tt'><button class='rb' id='tbx'>‹</button><button class='rb' id='hint'>?</button><div class='inf'>Cược: ${TB} Chips/lá</div></div>
<div class='neon' style='left:100px'>CASINO</div><div class='neon n2' style='right:175px'>777</div><i class='dc' style='left:1.5%;bottom:30%'>🎰</i><i class='dc' style='right:1.5%;bottom:30%'>🎲</i>
${NA===2?tlseat(1,'tp'):NA===4?tlseat(2,'tp'):''}
<div class='tlt'><i class='md' style='left:13.5%;top:13.5%'></i><i class='md' style='right:13.5%;top:13.5%'></i><i class='md' style='left:13.5%;bottom:13.5%'></i><i class='md' style='right:13.5%;bottom:13.5%'></i><div class='tlf'><div class='dk'><span class='cb'></span><span class='cb'></span><span class='cb'></span></div><i class='pile' style='left:30%'></i><i class='pile' style='right:30%;--c:#b3182f'></i>${NA===4?tlseat(3,'tl2'):NA===3?tlseat(2,'tl2'):''}${NA>=3?tlseat(1,'tr2'):''}<div class='mid2'>${mid}<div class='ms' id='ms'>${ms}</div></div></div></div>
<div class='bt2'>${over?``:`<button class='b2 r' id='pb'${last&&turn===0?'':' disabled'}>Bỏ lượt</button><button class='b2 g' id='pl2'${turn===0?'':' disabled'}>${turn===0||over||!sel.size?'ĐÁNH BÀI':'ĐÃ CHỌN TRƯỚC '+sel.size+' LÁ'}</button>`}</div>
<div class='hand' style='width:${58+(n-1)*step}px'>${cards}</div>
<div class='me${turn===0&&!over?' on':''}'><div class='pl'><div class='av' id='av0'>${AVT[0]}</div><div><b>Bạn</b><span id='tc'>${fmt(chips)}</span></div></div></div><button class='b2 s' id='srt'>Xếp lại</button><button class='rb' id='chat'>💬</button>`;
fresh=0;$('#tbx').onclick=()=>{tok++;t.hidden=true};
$('#srt').onclick=()=>{tlsort^=1;tlord.sort((a,b)=>tlsort?(a&3)-(b&3)||a-b:a-b);dr()};
$('#chat').onclick=()=>tlpanel(!$('#chp'));
t.querySelectorAll('.pl[data-t]').forEach(p=>p.onclick=()=>{tlT=+p.dataset.t;tlpanel(1)});
$('#hint').onclick=()=>{if(over||turn!==0)return;const k=tlpick(HD[0]);sel=new Set(k||[]);ms=k?'Gợi ý: '+tlname(ana(k)):'Không đánh được, hãy bỏ lượt';dr()};
t.querySelectorAll('.hc').forEach(b=>b.onclick=()=>{const v=+b.dataset.v;sel.has(v)?sel.delete(v):sel.add(v);b.classList.toggle('sel')});
if(over){}else{
$('#pb').onclick=()=>ps(0);
$('#pl2').onclick=()=>{const cs=[...sel],a=cs.length&&ana(cs);
if(!a||!beats(a,last&&last.c)){$('#ms').textContent=!a?'Bộ bài không hợp lệ':'Chưa lớn hơn bộ trước';return}mv(0,cs)}}
if(shk){t.classList.remove('shake');void t.offsetWidth;t.classList.add('shake');shk=0}}
let TLK=[0,15000,22000,9000],CH=[];
ITM.splice(0,ITM.length,['🧱','Gạch','#9aa0a6','💥','fly'],['🥚','Trứng','#ffd84d','🍳','splat'],['🍅','Cà chua','#d92b2b','🍅','splat'],['🗑️','Đổ rác','#7a4a22','🗑️','pour'],['💦','Nhổ nước bọt','#aadcff','💦','spit'],['🟢','Móc mũi','#7ed321','🤢','nose'],['💩','Phân','#7a4a22','💩','splat'],['👟','Dép','#7aa7d9','💢','fly'],['🌹','Hoa','#ff7aa8','💖','fly']);
const pw=x=>x.t==='d'?(x.n===6?1:x.n===8?3:4):x.t==='q'?2:0,hz=l=>(l.t==='s'||l.t==='p')&&rk(l.k)===15;
function beats(a,l){if(!l)return !!a;if(!a)return false;
if(a.t===l.t&&a.n===l.n)return a.k>l.k;
const p=pw(a);if(!p)return false;
if(l.t==='s'&&rk(l.k)===15)return true;
if(l.t==='p'&&rk(l.k)===15)return p>=2;
return pw(l)>0&&p>pw(l)}
function mv(i,cs){const a=ana(cs),L=last&&last.c;
if(L&&pw(a)>0&&(hz(L)||pw(L)>0)){const amt=pw(L)>0?2:last.cards.reduce((s,v)=>s+((v&3)>1?2:1),0);CH.push({by:i,vic:last.by,amt});ms=NM[i]+(pw(L)>0?' chặt chồng! +':' chặt heo! +')+amt+' cược';shk=1}else ms='';
HD[i]=HD[i].filter(v=>!cs.includes(v));last={c:a,cards:cs,by:i};fresh=1;if(i===0)sel.clear();
if(!HD[i].length)return fin(i);adv(i)}
function tlwhite(h){const g={};h.forEach(v=>g[rk(v)]=(g[rk(v)]||0)+1);
if(g[15]===4)return 'Tứ quý heo';
let all=true;for(let r=3;r<=14;r++)if(!g[r])all=false;if(all)return 'Sảnh rồng';
if(Object.values(g).reduce((s,x)=>s+(x>>1),0)>=6)return '6 đôi';
for(let s=3;s<=10;s++){let ok=true;for(let r=s;r<s+5;r++)if((g[r]||0)<2)ok=false;if(ok)return '5 đôi thông'}
return ''}
function tien(){let t=$('#tb');if(!t){t=document.createElement('div');t.id='tb';document.body.append(t)}t.hidden=false;
const d=deck().map(c=>(c.r===1?14:c.r===2?15:c.r)*4+c.s);HD=dealTL(d);
PS=[0,0,0,0];last=null;over=false;sel.clear();CH=[];turn=HD.findIndex(h=>h.includes(12));ms=NM[turn]+' có 3♠, đi trước';
const wh=HD.findIndex(h=>tlwhite(h));if(wh>=0){ms='';return fin(wh,tlwhite(HD[wh]))}
dr();stp()}
function fin(w,kind){over=true;const net=[0,0,0,0],hv=h=>h.filter(v=>rk(v)===15).reduce((s,v)=>s+((v&3)>1?2:1),0);
[0,1,2,3].forEach(p=>{if(p===w||p>=NA)return;let pay=4;if(!kind){pay=(HD[p].length===13?2:1)+hv(HD[p])}net[w]+=pay;net[p]-=pay});
if(!kind)CH.forEach(c=>{net[c.by]+=c.amt;net[c.vic]-=c.amt});
const my=net[0]*500;[1,2,3].forEach(i=>TLK[i]=Math.max(0,TLK[i]+net[i]*500));
ms=(w===0?(kind?'Bạn tới trắng ('+kind+')! ':'Bạn thắng! '):(kind?NM[w]+' tới trắng ('+kind+'). ':NM[w]+' thắng. '))+'Bạn '+(my>=0?'+':'−')+Math.abs(fx(my));
if(my>0)burst();else shk=1;
count(Math.max(0,chips+fx(my)));dr();setTimeout(()=>{const e=$('#tc');if(e)e.textContent=fmt(chips)},700)}
function fly(fx,txt,a,b,c,d,dur,arc,rot,cb,fs){const e=document.createElement('div');e.className='thr';if(txt==='🪙')e.innerHTML=PCH();else e.textContent=txt;if(fs)e.style.fontSize=fs+'px';fx.append(e);
if(!e.animate){e.remove();cb&&cb();return}
e.animate([{transform:`translate(${a-16}px,${b-16}px) scale(.7) rotate(0deg)`},{transform:`translate(${(a+c)/2-16}px,${Math.min(b,d)-arc-16}px) scale(1.2) rotate(${rot/2}deg)`,offset:.5},{transform:`translate(${c-16}px,${d-16}px) scale(1) rotate(${rot}deg)`}],{duration:dur,easing:'ease-in'}).onfinish=()=>{e.remove();cb&&cb()}}
function stain(fx,c,d,col,n,sz){for(let k=0;k<n;k++){const s=document.createElement('i'),r=6+Math.random()*sz;s.className='sp2';s.style.cssText=`left:${c+(Math.random()-.5)*110}px;top:${d+(Math.random()-.5)*90}px;width:${r}px;height:${r*(1+Math.random())}px;background:${col}`;fx.append(s);setTimeout(()=>s.remove(),3400)}}
function blob(fx,c,d,col,txt,sz){const s=document.createElement('div');s.className='spl';s.style.cssText=`left:${c-sz/2}px;top:${d-sz/2}px;width:${sz}px;height:${sz}px;--c:${col}`;s.textContent=txt;fx.append(s);setTimeout(()=>s.remove(),2200)}
function tlthrow(f,to,k){const it=ITM[k],fx=$('#fxl');if(!fx||!$('#av'+f)||!$('#av'+to))return;const[a,b]=tlpos(f),[c,d]=tlpos(to),kd=it[4];
const done=()=>{const av=$('#av'+to);if(av&&av.animate)av.animate([{transform:'translateX(0)'},{transform:'translateX(-6px)'},{transform:'translateX(6px)'},{transform:'translateX(-4px)'},{transform:'none'}],{duration:400});if(f===0)setTimeout(()=>tlreply(to),900)};
if(kd==='punch'){fly(fx,'🥊',a,b,c,d,240,0,0,()=>{blob(fx,c,d,'#fff3b0','POW!',84);ring(fx,c,d,'#ffe066');const av=$('#av'+to);if(av&&av.animate)av.animate([{transform:'none'},{transform:'translate(14px,-6px) rotate(25deg)'},{transform:'none'}],{duration:500});tlshake();done()},40);return}
if(kd==='nade'){fly(fx,'💣',a,b,c,d,800,110,720,()=>{boom(fx,c,d,1);done()});return}
if(kd==='rocket'){const ang=Math.atan2(d-b,c-a)*180/Math.PI+45,e=document.createElement('div');e.className='thr';e.style.fontSize='36px';e.textContent='🚀';fx.append(e);if(!e.animate){e.remove();return}
e.animate([{transform:`translate(${a-16}px,${b-16}px) rotate(${ang}deg)`},{transform:`translate(${c-16}px,${d-16}px) rotate(${ang}deg)`}],{duration:520,easing:'ease-in'}).onfinish=()=>{e.remove();boom(fx,c,d,2);done()};
for(let q=0;q<9;q++)setTimeout(()=>{const t=document.createElement('div'),k=q/9;t.className='thr';t.textContent='🔥';t.style.fontSize='18px';t.style.transform=`translate(${a+(c-a)*k*k-9}px,${b+(d-b)*k*k-9}px)`;fx.append(t);setTimeout(()=>t.remove(),350)},q*55);return}
if(kd==='durian'){fly(fx,'🍈',a,b,c,d,800,80,540,()=>{blob(fx,c,d,'#e6c84a','🤢',100);stain(fx,c,d,'#d9b93a',9,16);stain(fx,c,d,'#8a9a2a',5,10);
for(let q=0;q<4;q++)setTimeout(()=>{const s=document.createElement('div');s.className='thr';s.textContent='💨';s.style.fontSize='26px';fx.append(s);if(s.animate)s.animate([{transform:`translate(${c-20+q*12}px,${d-10}px)`,opacity:.9},{transform:`translate(${c-30+q*18}px,${d-70}px)`,opacity:0}],{duration:1400});setTimeout(()=>s.remove(),1400)},q*250);done()},34);return}
if(kd==='pour'){const e=document.createElement('div');e.className='thr';e.style.fontSize='44px';e.textContent=it[0];fx.append(e);if(!e.animate){e.remove();return}
e.animate([{transform:`translate(${c-16}px,${d-130}px) rotate(0deg)`},{transform:`translate(${c-16}px,${d-84}px) rotate(-125deg)`,offset:.35},{transform:`translate(${c-16}px,${d-84}px) rotate(-125deg)`,offset:.85},{transform:`translate(${c-16}px,${d-130}px) rotate(0deg)`,opacity:0}],{duration:2000}).onfinish=()=>e.remove();
const L=['🍌','🥫','📰','🐟','🍎','🦴','🧦','🥔'];
for(let q=0;q<14;q++)setTimeout(()=>{const p=document.createElement('div');p.className='thr';p.textContent=L[q%8];p.style.fontSize='22px';fx.append(p);if(!p.animate){p.remove();return}
const x0=c-26+Math.random()*20,x1=c-24+Math.random()*40;
p.animate([{transform:`translate(${x0}px,${d-80}px) rotate(0deg)`},{transform:`translate(${x1}px,${d-6+Math.random()*14}px) rotate(${Math.random()*300-150}deg)`}],{duration:650,easing:'cubic-bezier(.5,0,1,.6)',fill:'forwards'});setTimeout(()=>p.remove(),3200)},500+q*70);
setTimeout(done,900);return}
if(kd==='spit'){for(let q=0;q<4;q++)setTimeout(()=>fly(fx,'💧',a,b,c+(Math.random()-.5)*14,d,380,20,0,q===3?()=>{blob(fx,c,d,'rgba(170,220,255,.85)','💦',70);stain(fx,c,d,'rgba(190,230,255,.9)',6,10);done()}:null,18),q*90);return}
if(kd==='nose'){const h=document.createElement('div');h.className='thr';h.textContent='👉';h.style.fontSize='30px';h.style.transform=`translate(${a-16}px,${b-16}px)`;fx.append(h);setTimeout(()=>h.remove(),450);
setTimeout(()=>fly(fx,'🟢',a,b,c,d,420,10,720,()=>{blob(fx,c,d,'#7ed321','🤢',74);stain(fx,c,d,'#8fe01f',8,9);done()},20),450);return}
fly(fx,it[0],a,b,c,d,750,70,560,()=>{if(kd==='splat'){blob(fx,c,d,it[2],it[3],96);stain(fx,c,d,it[2],10,16)}else blob(fx,c,d,it[2],it[3],70);done()})}
const BL_=100;let must3=false,TLW=-1,Tdut=0,CUTP=null,CTG=null,CTS=0;
function tlCount(d){const base=(CTG!==null&&Date.now()<CTS)?CTG:chips,t=Math.max(0,base+d);CTG=t;CTS=Date.now()+1600;count(t)}
function tlSettle(){const P=CUTP;CUTP=null;if(!P)return;
const bal=P.vic===0?chips:TLK[P.vic],pay=Math.min(P.amt*TB,Math.max(0,bal)),gain=fx(pay);if(pay<=0)return;
if(P.vic===0)tlCount(-pay);else TLK[P.vic]=Math.max(0,TLK[P.vic]-pay);
if(P.by===0)tlCount(gain);else TLK[P.by]+=gain;
try{tlfloat(P.by,gain);tlfloat(P.vic,-pay);tlbanner('ĂN CHẶT +'+gain.toLocaleString('vi-VN'),'#ffd36a')}catch(e){}
try{const nn=[0,0,0,0];nn[P.vic]=-pay;nn[P.by]=gain;chipRun(nn,NA)}catch(e){}
try{ms=NM[P.by]+' ăn chặt '+gain.toLocaleString('vi-VN')+', '+NM[P.vic]+' bị trừ '+pay.toLocaleString('vi-VN')}catch(e){}
setTimeout(()=>{const e=document.getElementById('tc');if(e)e.textContent=fmt(chips)},1700)}
ITM.push(['🥊','Đấm bốc','#fff3b0','💫','punch'],['💣','Lựu đạn','#ff9a2e','💥','nade'],['🚀','Tên lửa','#ff6a1a','💥','rocket'],['🍈','Sầu riêng','#e6c84a','🤢','durian'],['🪨','Đá','#9aa0a6','💫','fly']);
function ring(fx,c,d,col){const r=document.createElement('i');r.className='ring';r.style.cssText=`left:${c-30}px;top:${d-30}px;border-color:${col}`;fx.append(r);setTimeout(()=>r.remove(),700)}
function tlshake(){const t=$('#tb');t.classList.remove('shake');void t.offsetWidth;t.classList.add('shake')}
function tlflash(col){const fx=$('#fxl');if(!fx)return;const f=document.createElement('i');f.className='flash';f.style.background=col;fx.append(f);setTimeout(()=>f.remove(),450)}
function boom(fx,c,d,s){tlflash('rgba(255,240,200,.55)');tlshake();const b=document.createElement('i');b.className='boom';b.style.cssText=`left:${c-45*s}px;top:${d-45*s}px;width:${90*s}px;height:${90*s}px`;fx.append(b);setTimeout(()=>b.remove(),900);ring(fx,c,d,'#ff9a2e');blob(fx,c,d,'rgba(30,20,10,.55)','💥',70*s);
for(let q=0;q<8;q++){const p=document.createElement('div'),an=q/8*6.28,R=50*s+Math.random()*30;p.className='thr';p.textContent=q%2?'🔥':'💥';p.style.fontSize='20px';fx.append(p);
if(p.animate)p.animate([{transform:`translate(${c-10}px,${d-10}px)`,opacity:1},{transform:`translate(${c-10+Math.cos(an)*R}px,${d-10+Math.sin(an)*R}px) rotate(300deg)`,opacity:0}],{duration:800});setTimeout(()=>p.remove(),800)}
stain(fx,c,d,'#2a1a10',5,20)}
function tlbanner(t,c){const fx=$('#fxl');if(!fx)return;const e=document.createElement('div');e.className='ban';e.style.setProperty('--c',c||'#ffd36a');e.textContent=t;fx.append(e);setTimeout(()=>e.remove(),1700)}
function tlfloat(i,v){if(v>0)v-=Math.floor(v*.1);const fx=$('#fxl');if(!fx||!$('#av'+i)||!v)return;const[a,b]=tlpos(i),e=document.createElement('div');e.className='fl '+(v>0?'p':'m');e.innerHTML=(v>0?'+':'−')+Math.abs(v).toLocaleString('vi-VN')+' '+PCH();e.style.left=(a-30)+'px';e.style.top=(b-44)+'px';fx.append(e);setTimeout(()=>e.remove(),1800)}
function tlreply(i){if(over)return;if(Math.random()<.85)tlsay(i,['Ê, ném gì thế!','Hừm, nhớ mặt đấy','Ha ha ha','Chơi bẩn nha'][Math.random()*4|0]);if(Math.random()<.5)setTimeout(()=>tlthrow(i,0,Math.random()*ITM.length|0),900)}
function tlidle(){const n=Date.now();if(n-tlLast<5000||over)return;tlLast=n;const r=Math.random(),i=1+(Math.random()*(NA-1)|0);if(r<.22)tlsay(i,PHR[Math.random()*PHR.length|0])}
const tw0=tlwhite;tlwhite=h=>{const r=tw0(h);if(r)return r;const g={};h.forEach(v=>g[rk(v)]=(g[rk(v)]||0)+1);const n3=Object.values(g).filter(x=>x>=3).length;return n3>=4?'4 sám cô':n3>=3?'3 sám cô':''};
function mv(i,cs){if(i===0&&must3&&!cs.includes(12)){$('#ms').textContent='Ván đầu phải đánh có 3♠';return}
snd('tap');const a=ana(cs),L=last&&last.c;ms='';
let cA=0,cD=0;const de=false,cutP=!!L&&pw(a)>0&&(hz(L)||pw(L)>0);
/* giá chặt cộng dồn: heo đen 6 lá, heo đỏ 12 lá (đôi heo = tổng 2 lá); 3 đôi thông / tứ quý / 4 đôi thông = 12 lá.
   Mỗi bộ heo hoặc bộ chặt đánh nối tiếp trong một vòng được cộng vào tổng; khi bị chặt, người bị chặt cuối trả toàn bộ tổng cho người chặt. */
const pvc=(cards,x)=>x&&rk(x.k)===15&&(x.t==='s'||x.t==='p'||x.t==='t')?cards.reduce((s,v)=>s+((v&3)>1?12:6),0):(x&&pw(x)>0?12:0);
const acc0=L&&last?(last.acc!=null?last.acc:pvc(last.cards,L)):0,own=pvc(cs,a),newAcc=(own>0&&acc0>0?acc0:0)+own;
if(cutP){const amt=acc0,dep=(last.dep||0)+1;cA=amt;cD=dep;CUTP={by:i,vic:last.by,amt};
tlbanner((dep>1?'CHẶT CHỒNG! ':'CHẶT HEO! ')+amt+' LÁ',dep>1?'#ff9a3d':'#ff4d4d');
tlflash('rgba(255,70,70,'+Math.min(.7,.4+dep*.1)+')');try{tlmark(last.by,'LỦNG')}catch(e){}if(hz(a))tlheo(i,cs);tlchain(dep,newAcc,amt);shk=1}
else if(rk(a.k)===15&&(a.t==='s'||a.t==='p'||a.t==='t')){tlbanner(a.t==='s'?((a.k&3)>1?'HEO ĐỎ!':'HEO ĐEN!'):a.t==='p'?'ĐÔI HEO!':'BA HEO!',a.t==='s'?'#ff9ad0':'#ff5fa2');tlpig(i,a.n);tlheo(i,cs);if(a.n>=2)tlflash('rgba(255,120,180,.35)')}
else if(a.t==='q'){tlbanner('TỨ QUÝ!','#ffd36a');if(rk(a.k)===15)tlheo(i,cs)}else if(a.t==='d')tlbanner(a.n/2+' ĐÔI THÔNG!','#7ad7ff');else if(a.t==='r'&&a.n>=7)tlbanner('SẢNH '+a.n+' LÁ!','#b9f27a');
HD[i]=HD[i].filter(v=>!cs.includes(v));last={c:a,cards:cs,by:i,pen:cA,dep:cD,acc:newAcc};fresh=1;if(i===0)sel.clear();must3=false;
if(!HD[i].length){Tdut=cs.length===1&&cs[0]===12?1:0;return fin(i)}adv(i)}
function tien(){let t=$('#tb');if(!t){t=document.createElement('div');t.id='tb';document.body.append(t)}t.hidden=false;
const d=deck().map(c=>(c.r===1?14:c.r===2?15:c.r)*4+c.s);HD=dealTL(d);
PS=[0,0,0,0];last=null;over=false;sel.clear();CH=[];CUTP=null;Tdut=0;must3=TLW<0;turn=must3?HD.findIndex(h=>h.includes(12)):(TLW<NA?TLW:0);
ms=must3?NM[turn]+' có 3♠, đi trước':NM[turn]+' về nhất ván trước, đi trước';
const wh=HD.findIndex(h=>tlwhite(h));if(wh>=0){ms='';return fin(wh,tlwhite(HD[wh]))}
dr();stp()}
function fin(w,kind){over=true;TLW=w;const net=[0,0,0,0],evs=[];try{tlSettle()}catch(e){}
const ht=h=>h.reduce((s,v)=>s+(rk(v)===15?((v&3)>1?12:6):0),0),hg=h=>gen(h).some(x=>{const a=ana(x);return a&&(a.t==='q'||a.t==='d')})?12:0;
[0,1,2,3].forEach(p=>{if(p===w||p>=NA)return;let n;
if(kind)n=13;else{const h=HD[p],cg=h.length===13,th=ht(h),hh=hg(h),t3=h.includes(12)?12:0;n=(cg?26:h.length)+th+hh+t3;if(Tdut)n*=3;
if(cg||th||hh||t3)setTimeout(()=>tlmark(p,cg?'CÓNG':'THỐI'),500+p*150)}
net[w]+=n;net[p]-=n});
if(!kind)CH.forEach(c=>{net[c.by]+=c.amt;net[c.vic]-=c.amt});
if(kind)evs.unshift('TỚI TRẮNG: '+kind.toUpperCase());if(Tdut)evs.unshift('ĐÚT 3 BÍCH! THƯỞNG ×3');
const imm=0,my=net[0]*TB,dl=[0,0,0,0],bal=[chips,TLK[1],TLK[2],TLK[3]],gr=net.map(x=>x*TB),pay=[0,0,0,0];let pool=0,tw=0;gr.forEach((g,i)=>{if(g<0){pay[i]=Math.min(-g,Math.max(0,bal[i]));pool+=pay[i]}else if(g>0)tw+=g});gr.forEach((g,i)=>{dl[i]=g<0?-pay[i]:(g>0&&tw?fx(Math.floor(pool*g/tw)):0)});[1,2,3].forEach(i=>{TLK[i]+=dl[i]});
ms=(w===0?(kind?'Bạn tới trắng!':'Bạn thắng!'):(kind?NM[w]+' tới trắng.':NM[w]+' thắng.'));
if(my>0)burst();else shk=1;
tlCount(dl[0]);dr();
[...new Set(evs)].slice(0,3).forEach((e,k)=>setTimeout(()=>{tlbanner(e,/^(ĐÚT|TỚI)/.test(e)?'#ffd36a':'#ff6a6a');if(/^TỚI/.test(e))burst()},300+k*1300));
[0,1,2,3].forEach(i=>dl[i]&&setTimeout(()=>tlfloat(i,dl[i]),400+i*120));chipRun(net.map(x=>x*TB),4);
setTimeout(()=>{const e=$('#tc');if(e)e.textContent=fmt(chips)},700)}
G.tl.r[0]='2 đến 4 người, mỗi người 13 lá. Bàn 2 hoặc 3 người chỉ chia cho số người ngồi, nếu 3♠ nằm trong phần bài không chia thì 3♠ được đưa vào tay một người chơi để ván đầu vẫn có người giữ 3♠. Ván đầu người giữ 3♠ đi trước và bắt buộc đánh lá này (lẻ, đôi hoặc sảnh có 3♠). Ván sau người về nhất đi trước, đánh tự do.';
G.tl.r.splice(4,3,'Chặt: 3 đôi thông chặt 1 heo hoặc 3 đôi thông nhỏ hơn. Tứ quý chặt heo, đôi heo, 3 đôi thông hoặc tứ quý nhỏ hơn. 4 đôi thông chặt mọi thứ trên. Giá: heo đen (bích, chuồn) 6 lá, heo đỏ (rô, cơ) 12 lá; 3 đôi thông, tứ quý, 4 đôi thông 12 lá. Tiền cộng dồn trong một vòng: heo/bộ chặt đánh nối tiếp được cộng vào tổng, ví dụ 2 bích (6) bị 2 cơ (12) đè rồi 3 đôi thông chặt 2 cơ thì người đánh 2 cơ bị trừ 18 lá. Người bị chặt sau cùng bị trừ 100%, người chặt nhận 90%, cộng ngay khi tất cả người còn lại bỏ lượt, không đợi hết ván.','Ván kết thúc khi có người hết bài. Người thua trả số lá còn lại. Cóng (chưa đánh lá nào) trả 26 lá. Thối heo đen 6 lá, heo đỏ 12 lá, thối tứ quý hoặc đôi thông 12 lá, thối 3♠ 12 lá. Đút 3♠ (hết bài bằng lá 3♠) ăn gấp ba tiền thưởng (nhân 3).','Tới trắng (thắng ngay, mỗi người trả 13 lá): sảnh rồng, tứ quý heo, 6 đôi, 5 đôi thông, 3 sám cô (có đủ 3 bộ ba trở lên, 4 sám cô cũng tính).');
function tlcut(){if(over||turn===0||!last||last.by===0)return;const L=last.c;if(!(hz(L)||pw(L)>0))return;
const k=gen(HD[0]).filter(x=>{const a=ana(x);return a&&a.t==='d'&&a.n>=8&&beats(a,L)}).sort((x,y)=>x.length-y.length)[0];if(!k)return;
const b=document.createElement('button');b.className='b2 g';b.id='cut';b.textContent='CHẶT NGOÀI LƯỢT';b.style.cssText='position:absolute;left:50%;bottom:138px;transform:translateX(-50%);z-index:8';
$('#tli').append(b);b.onclick=()=>{tok++;PS[0]=0;mv(0,k)}}
const dr0=dr;dr=function(){dr0();tlcut()};
G.tl.r[4]+=' 4 đôi thông được chặt ngoài lượt, kể cả khi đã bỏ lượt.';
