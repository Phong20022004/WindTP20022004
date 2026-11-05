/*@file game/js/04d-poker.js
 * Poker (bản đầu).
 */
const HN=['Mậu thầu','Đôi','Hai đôi','Sám cô','Sảnh','Thùng','Cù lũ','Tứ quý','Thùng phá sảnh'];
const kl=v=>({11:'J',12:'Q',13:'K',14:'A'}[v>>2]||v>>2)+S[v&3];
const cmpA=(a,b)=>{for(let i=0;i<Math.max(a.length,b.length);i++){const d=(a[i]||0)-(b[i]||0);if(d)return d}return 0};
function r5(c){const r=c.map(v=>v>>2).sort((a,b)=>b-a),fl=c.every(v=>(v&3)===(c[0]&3));
let st=0;if(new Set(r).size===5){if(r[0]-r[4]===4)st=r[0];else if(r[0]===14&&r[1]===5)st=5}
const g={};r.forEach(x=>g[x]=(g[x]||0)+1);
const e=Object.entries(g).map(([k,n])=>[n,+k]).sort((a,b)=>b[0]-a[0]||b[1]-a[1]),k=e.map(x=>x[1]),n=e.map(x=>x[0]).join('');
if(st&&fl)return[8,st];if(n==='41')return[7,...k];if(n==='32')return[6,...k];if(fl)return[5,...r];if(st)return[4,st];
if(n==='311')return[3,...k];if(n==='221')return[2,...k];if(n==='2111')return[1,...k];return[0,...r]}
const pkbest=c=>comb(c,5).map(r5).reduce((m,x)=>cmpA(x,m)>0?x:m);
let HH=[],BD=[],PO=0,BC=[],TC=[],AL=[],AI=[],CU=0,PQ=[],KS=[0,2000,2000,2000],DL=-1,SG=0,EF=0,RC=0,PM='',Pk=0,Pf=0,Po=false,DK=[],LR=100,Psh=false,Psc={},Pn=0;
const pko=s=>{const N=CFG.pk.n;return Array.from({length:N},(_,k)=>(s+k)%N).filter(i=>AL[i]&&!AI[i])};
function pkc(i,a){a=Math.max(0,Math.min(a,EF-TC[i]));BC[i]+=a;TC[i]+=a;PO+=a;if(TC[i]>=EF)AI[i]=1;if(i===0)setChips(chips-a)}
function pkg(){let t=$('#tb');if(!t){t=document.createElement('div');t.id='tb';document.body.append(t)}
t.hidden=false;if(chips<200){needChips();return}[1,2,3].forEach(i=>{if(KS[i]<200)KS[i]=2000});
EF=Math.floor(Math.min(chips,KS[1],KS[2],KS[3],2000)/50)*50;
DL=(DL+1)%4;Pk++;Po=false;Psh=false;Psc={};Pn=1;
DK=deck().map(c=>(c.r===1?14:c.r)*4+c.s);HH=[0,1,2,3].map(()=>[DK.pop(),DK.pop()]);BD=[];
PO=0;BC=[0,0,0,0];TC=[0,0,0,0];AL=[1,1,1,1];AI=[0,0,0,0];SG=0;RC=0;CU=0;Pf=0;
pkc((DL+1)%4,50);pkc((DL+2)%4,100);CU=100;LR=100;
PQ=pko((DL+3)%4);PM='Mù nhỏ 50, mù lớn 100';pkr();pkn()}
function pkn(){if(AL.filter(Boolean).length===1)return pkw([AL.indexOf(1)],false);
if(!PQ.length)return pkst();if(PQ[0]!==0)pkbot()}
async function pkst(){if(SG===3)return pks();
SG++;const n=SG===1?3:1;for(let k=0;k<n;k++)BD.push(DK.pop());Pf=n;BC=[0,0,0,0];CU=0;LR=100;RC=0;
PQ=pko((DL+1)%4);PM=['','Flop','Turn','River'][SG];
if(PQ.length<2){PQ=[];pkr();const k=++Pk;await sleep(1300);if(k!==Pk)return;return pkst()}
pkr();pkn()}
function pks(){const al=[0,1,2,3].filter(i=>AL[i]);al.forEach(i=>Psc[i]=pkbest([...HH[i],...BD]));
let b=al[0];al.forEach(i=>{if(cmpA(Psc[i],Psc[b])>0)b=i});pkw(al.filter(i=>cmpA(Psc[i],Psc[b])===0),true,Psc[b][0])}
function pkw(w,show,cat){Po=true;Psh=show;const sh=Math.floor(PO/w.length);
[1,2,3].forEach(i=>{KS[i]+=(w.includes(i)?sh:0)-TC[i]});
if(w.includes(0)){feeWin(sh,TC[0]);burst();PM='Bạn thắng +'+fx(sh-TC[0])+(show?' ('+HN[cat]+')':'')}
else PM=w.map(i=>NM[i]).join(' & ')+' thắng'+(show?' với '+HN[cat]:'');
pkr();setTimeout(()=>{const e=$('#tc');if(e)e.textContent=fmt(chips)},700)}
function pka(i,a,to){let m;
if(a==='f'){AL[i]=0;PQ.shift();m=NM[i]+' bỏ'}
else if(a==='c'){const n=Math.min(CU-BC[i],EF-TC[i]);pkc(i,n);PQ.shift();m=NM[i]+(n?' theo '+n:' xem')}
else{to=Math.min(to,EF-TC[i]+BC[i]);pkc(i,to-BC[i]);
if(BC[i]>CU){LR=Math.max(LR,BC[i]-CU);CU=BC[i];RC++;PQ=[1,2,3].map(k=>(i+k)%4).filter(x=>AL[x]&&!AI[x])}else PQ.shift();
m=NM[i]+(AI[i]?' all-in ':' tố lên ')+BC[i]}
PM=m;pkr();pkn()}
async function pkbot(){const k=++Pk;await bw(PQ[0]);if(k!==Pk||Po)return;const i=PQ[0],hc=HH[i],need=CU-BC[i];let s;
if(!BD.length){const a=hc[0]>>2,b=hc[1]>>2,h=Math.max(a,b),l=Math.min(a,b);s=(h+l)/32+(a===b?.35+h/50:0)+((hc[0]&3)===(hc[1]&3)?.05:0)+(h-l<=2?.03:0)}
else s=[.15,.42,.65,.75,.8,.85,.92,.97,1][pkbest([...hc,...BD])[0]];
s+=Math.random()*.2-.1;let a='c',to=0;const bet=Math.max(100,Math.round(PO/100)*50);
if(need===0){if(s>.6&&RC<4&&Math.random()<.7){a='r';to=CU+bet}}
else{if(s<.28+need/(PO+1)*.35&&Math.random()<.9)a='f';else if(s>.78&&RC<4&&Math.random()<.45){a='r';to=CU+bet}}
pka(i,a,to)}
function pkr(){const t=$('#tb'),my=HH[0],me=!Po&&PQ[0]===0,call=Math.min(CU-BC[0],EF-TC[0]);
const rs=Math.min(CU+Math.max(100,Math.round(PO/100)*50),EF-TC[0]+BC[0]),canR=me&&RC<4&&rs>CU&&EF-TC[0]>call;
const seat=i=>`<div class="st${PQ[0]===i&&!Po?' on':''}">${NM[i]}${DL===i?' (D)':''}<b>${AL[i]?(AI[i]?'All-in':(KS[i]-TC[i])+' Chips'):'Đã bỏ'}</b><div class="row2" style="zoom:.55;margin-top:4px">${AL[i]?(Psh?HH[i].map(v=>C(kl(v),'new')).join(''):BK(2)):''}</div><small>${Psh&&AL[i]?HN[Psc[i][0]]:BC[i]?'Cược '+BC[i]:'&nbsp;'}</small></div>`;
const hn=BD.length?HN[pkbest([...my,...BD])[0]]:((my[0]>>2)===(my[1]>>2)?'Đôi':'');
t.innerHTML=`<div class="top"><button class="bet" id="tbx">Về sảnh</button><h3>Poker</h3><span class="chips" id="tc" style="padding:4px 10px">${fmt(chips)}</span></div>
<div class="seats">${[1,2,3].map(seat).join('')}</div>
<div class="mid"><div class="pot">Pot ${fmt(PO)}</div><div class="row2">${Array.from({length:5},(_,k)=>BD[k]!==undefined?C(kl(BD[k]),k>=BD.length-Pf?'new':''):'<div class="mc" style="opacity:.18"></div>').join('')}</div><div id="ms" class="pot" style="font-size:16px">${PM}</div></div>
<div class="row2">${my.map(v=>C(kl(v),Pn?'new':'')).join('')}</div><div>${(DL===0?'(D) ':'')+(AL[0]?hn:'Bạn đã bỏ')}${BC[0]?' | Cược '+BC[0]:''}</div>
<div class="ops">${Po?'':`<button class="btn alt" id="pf"${me?'':' disabled'}>Bỏ</button><button class="btn alt" id="pc"${me?'':' disabled'}>${call?'Theo '+call:'Xem'}</button><button class="btn" id="pr2"${canR?'':' disabled'}>Tố ${rs}</button><button class="btn" id="pa"${me&&EF-TC[0]>call?'':' disabled'}>All-in</button>`}</div>`;
Pn=0;Pf=0;$('#tbx').onclick=()=>{Pk++;t.hidden=true};
if($('#nw'))$('#nw').onclick=pkg;
if($('#pf')){$('#pf').onclick=()=>pka(0,'f');$('#pc').onclick=()=>pka(0,'c');$('#pr2').onclick=()=>pka(0,'r',rs);$('#pa').onclick=()=>pka(0,'r',EF-TC[0]+BC[0])}}
let tlsort=0;
const AVT=['🦁','🦊','🐼','🐯'],SN=['Bích','Chuồn','Rô','Cơ'];
const tlpc=(v,x='',st='')=>{const lab={11:'J',12:'Q',13:'K',14:'A',15:'2'}[rk(v)]||rk(v),s=S[v&3];return `<div class='pc${(v&3)>1?' r':''}${x}' ${st}><i>${lab}</i><s>${s}</s><u>${s}</u></div>`};
function tlname(a){const k=a.k;if(a.t==='s')return rk(k)===15?'Heo '+SN[k&3]:'Lá lẻ';if(a.t==='p')return rk(k)===15?'Đôi heo':'Đôi';if(a.t==='t')return 'Sám cô';if(a.t==='q')return 'Tứ quý';if(a.t==='r')return 'Sảnh '+a.n+' lá';return a.n/2+' đôi thông'}
function tlpick(h){const all=gen(h),two=a=>+a.some(v=>rk(v)===15),chp=a=>+(ana(a).t==='q'||ana(a).t==='d');
if(!last){all.sort((a,b)=>two(a)-two(b)||Math.min(...a)-Math.min(...b)||b.length-a.length);return all[0]}
const ok=all.filter(x=>beats(ana(x),last.c));ok.sort((a,b)=>chp(a)-chp(b)||ana(a).k-ana(b).k);return ok[0]}
const tlseat=(i,pos)=>{const n=HD[i].length,k=Math.min(n,9);
const fb=Array.from({length:k},(_,j)=>`<span class='cb' style='--r:${(j-(k-1)/2)*7}deg'></span>`).join('');
return `<div class='sp ${pos}${turn===i&&!over?' on':''}'><div class='fb'>${fb}<em class='nc'>${n}</em></div><div class='pl' data-t='${i}'><div class='av' id='av${i}'>${AVT[i]}</div><div><b>${NM[i]}</b><span>${fmt(TLK[i])}</span></div></div>${PS[i]&&!over?"<div class='pass'>Bỏ lượt</div>":''}</div>`};
function dr(){const t=$('#tb'),n=HD[0].length,step=Math.min(44,(t.clientWidth-24-58)/Math.max(1,n-1)),c=(n-1)/2;
const hand=tlsort?[...HD[0]].sort((a,b)=>(a&3)-(b&3)||a-b):HD[0],f0=n===13&&!last&&!over;
const cards=hand.map((v,i)=>tlpc(v,' hc'+(sel.has(v)?' sel':'')+(f0?' dl':''),`data-v='${v}' style='--x:${i*step}px;--r:${(i-c)*2.4}deg;--y:${Math.pow(Math.abs(i-c),2)*.5}px;--d:${i*50}ms'`)).join('');
const mid=last?`<div class='cc'>${[...last.cards].sort((a,b)=>a-b).map((v,i,a)=>tlpc(v,' sm'+(fresh?' new':''),`style='--r:${(i-(a.length-1)/2)*5}deg'`)).join('')}</div><div class='lab'>${NM[last.by]}: ${tlname(last.c)}</div>`:"<div class='lab'>Vòng mới, đánh tự do</div>";
t.innerHTML=`<div class='tlx'><div class='tt'><button class='rb' id='tbx'>‹</button><button class='rb' id='hint'>?</button><div class='inf'>Luật: Truyền thống<br>Cược: 500 Chips</div></div>
${NA===2?tlseat(1,'tp'):NA===4?tlseat(2,'tp'):''}
<div class='tlt'><div class='tlf'>${NA===4?tlseat(3,'tl2'):NA===3?tlseat(2,'tl2'):''}${NA>=3?tlseat(1,'tr2'):''}<div class='mid2'>${mid}<div class='ms' id='ms'>${ms}</div></div></div></div>
<div class='bt2'>${over?"":`<button class='b2 r' id='pb'${last&&turn===0?'':' disabled'}>Bỏ lượt</button><button class='b2 g' id='pl2'${turn===0?'':' disabled'}>${turn===0||over||!sel.size?'ĐÁNH BÀI':'ĐÃ CHỌN TRƯỚC '+sel.size+' LÁ'}</button>`}</div>
<div class='hand' style='width:${58+(n-1)*step}px'>${cards}</div>
<div class='me${turn===0&&!over?' on':''}'><div class='pl'><div class='av' id='av0'>${AVT[0]}</div><div><b>Bạn</b><span id='tc'>${fmt(chips)}</span></div></div><button class='b2 s' id='srt'>Xếp bài</button></div></div>`;
fresh=0;$('#tbx').onclick=()=>{tok++;t.hidden=true};
$('#srt').onclick=()=>{tlsort^=1;dr()};
$('#hint').onclick=()=>{if(over||turn!==0)return;const k=tlpick(HD[0]);sel=new Set(k||[]);ms=k?'Gợi ý: '+tlname(ana(k)):'Không đánh được, hãy bỏ lượt';dr()};
t.querySelectorAll('.hc').forEach(b=>b.onclick=()=>{const v=+b.dataset.v;sel.has(v)?sel.delete(v):sel.add(v);b.classList.toggle('sel')});
if(over){}else{
$('#pb').onclick=()=>ps(0);
$('#pl2').onclick=()=>{const cs=[...sel],a=cs.length&&ana(cs);
if(!a||!beats(a,last&&last.c)){$('#ms').textContent=!a?'Bộ bài không hợp lệ':'Chưa lớn hơn bộ trước';return}mv(0,cs)}}
if(shk){t.classList.remove('shake');void t.offsetWidth;t.classList.add('shake');shk=0}}
