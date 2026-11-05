/*@file game/js/04b-phom.js
 * Game Phỏm.
 */
function bt(i){const all=gen(HD[i]);let c;
const two=a=>+a.some(v=>rk(v)===15),chp=a=>+(ana(a).t==='q'||ana(a).t==='d');
if(!last){all.sort((a,b)=>two(a)-two(b)||Math.min(...a)-Math.min(...b)||b.length-a.length);c=all[0]}
else{const ok=all.filter(x=>beats(ana(x),last.c));ok.sort((a,b)=>chp(a)-chp(b)||ana(a).k-ana(b).k);c=ok[0]}
c?mv(i,c):ps(i)}
let FH=[],FX=[],FD=[],FT=0,FP='x',STK=[],DISC=[],fo=false,fm='',fs=null,fk=0,ff=0;
const pl=v=>({1:'A',11:'J',12:'Q',13:'K'}[v>>2]||v>>2)+S[v&3];
function melds(h){const g={},o=[];h.forEach(v=>(g[v>>2]??=[]).push(v));
for(const r in g)if(g[r].length>=3){o.push(...comb(g[r],3));if(g[r].length===4)o.push([...g[r]])}
const bs={};h.forEach(v=>bs[(v&3)+'_'+(v>>2)]=v);
for(let s=0;s<4;s++)for(let a=1;a<=11;a++){const run=[];for(let r=a;r<=13&&bs[s+'_'+r]!==undefined;r++){run.push(bs[s+'_'+r]);if(run.length>=3)o.push([...run])}}
return o}
function solve(h){const ms=melds(h);
const f=(rem,i)=>{let b={p:rem.reduce((a,v)=>a+(v>>2),0),m:[]};
for(let j=i;j<ms.length;j++){const m=ms[j];if(m.every(v=>rem.includes(v))){const r=f(rem.filter(v=>!m.includes(v)),j+1);if(r.p<b.p)b={p:r.p,m:[m,...r.m]}}}
return b};return f(h,0)}
function phom(){let t=$('#tb');if(!t){t=document.createElement('div');t.id='tb';document.body.append(t)}
t.hidden=false;const d=deck().map(c=>c.r*4+c.s);
{const pf=PF<NA?PF:0;let o=0;FH=[0,1,2,3].map(i=>{if(i>=NA)return [];const n=i===pf?10:9,s=d.slice(o,o+n);o+=n;return s.sort((a,b)=>a-b)});
STK=d.slice(9*NA+1);DISC=[];FX=[[],[],[],[]];FD=[0,0,0,0];FT=pf;FP=pf===0?'x':'d';fo=false;fs=null;ff=0;fk++;
fm=pf===0?(PFW?'Bạn thắng ván trước, đánh trước':'Bạn là chủ bàn, đánh trước'):NM[pf]+(PFW?' thắng ván trước, đánh trước':' là chủ bàn, đánh trước');pr();
if(pf!==0){PBF=1;pbot()}}}
function pr(){const t=$('#tb'),h=FH[0],m=new Set(solve(h).m.flat()),top=DISC[DISC.length-1];
const sc=FH.map(x=>solve(x).p),ex=i=>FX[i].flat().map(v=>C(pl(v),'meld')).join('');
const can=!fo&&FT===0&&FP==='d'&&top&&top.by===NA-1&&melds([...h,top.v]).some(x=>x.includes(top.v));
const ops=fo?'':FT!==0?`<button class="btn alt" disabled>Đang chờ ${NM[FT]}</button>`:FP==='d'?`<button class="btn alt" id="dr1"${STK.length?'':' disabled'}>Bốc bài</button><button class="btn" id="ea"${can?'':' disabled'}>Ăn ${top?pl(top.v):''}</button>`:'<button class="btn" id="di">Đánh lá chọn</button>';
t.innerHTML=`<div class="top"><button class="bet" id="tbx">Về sảnh</button><h3>Phỏm</h3><span class="chips" id="tc" style="padding:4px 10px">${fmt(chips)}</span></div>
<div class="seats">${[1,2,3].map(i=>`<div class="st${FT===i&&!fo?' on':''}">${NM[i]}<b>${fo?sc[i]+' điểm':FH[i].length+' lá, đã đánh '+FD[i]+'/4'}</b></div>`).join('')}</div>
${[1,2,3].filter(i=>FX[i].length).map(i=>`<div class="row2" style="zoom:.6"><span>${NM[i]}</span>${ex(i)}</div>`).join('')}
<div class="mid"><div class="row2">${BK(1)}<span>Bốc (${STK.length})</span>${top?C(pl(top.v),ff?'new':''):''}<span>${top?NM[top.by]+' vừa đánh':'Chưa có lá đánh'}</span></div><div id="ms" class="pot" style="font-size:16px">${fm}</div></div>
${FX[0].length?`<div class="row2">${ex(0)}</div>`:''}
<div class="fan">${h.map(v=>C(pl(v),(m.has(v)?'meld ':'')+(fs===v?'sel':'')).replace('<button','<button data-v="'+v+'"')).join('')}</div>
<div class="ops">${ops}</div><p class="lead" style="font-size:12px;text-align:center;margin:0">${fo?'Bạn: '+sc[0]+' điểm':'Viền vàng là bạn đang ghép được phỏm. Đánh đủ 4 lá, điểm rác ít nhất thắng.'}</p>`;
ff=0;$('#tbx').onclick=()=>{fk++;t.hidden=true};
t.querySelectorAll('.fan .mc').forEach(b=>b.onclick=()=>{const v=+b.dataset.v;fs=fs===v?null:v;t.querySelectorAll('.fan .mc').forEach(x=>x.classList.toggle('sel',+x.dataset.v===fs))});
if($('#nw'))$('#nw').onclick=phom;
if($('#dr1'))$('#dr1').onclick=()=>{FH[0]=[...h,STK.pop()].sort((a,b)=>a-b);FP='x';fm='';pr()};
if($('#ea'))$('#ea').onclick=()=>{const c=DISC.pop().v,mm=melds([...h,c]).filter(x=>x.includes(c)).sort((a,b)=>a.length-b.length)[0];
FX[0].push(mm);FH[0]=h.filter(v=>!mm.includes(v));FP='x';fm='Bạn ăn '+pl(c);pr()};
if($('#di'))$('#di').onclick=()=>{if(fs===null){$('#ms').textContent='Chọn một lá để đánh';return}
FH[0]=h.filter(v=>v!==fs);DISC.push({v:fs,by:0});FD[0]++;fs=null;ff=1;fm='';aft(0)}}
function aft(i){if(solve(FH[i]).p===0)return pfin(i,1);
if(FD.slice(0,NA).every(x=>x>=4)||!STK.length)return pfin(null,0);
FT=(i+1)%NA;FP='d';pr();if(FT!==0)pbot()}
async function pbot(){const k=++fk;await bw(FT);if(k!==fk||fo)return;
const i=FT,top=DISC[DISC.length-1];let h=FH[i],ate=false;
if(!PBF&&top&&top.by===(i+NA-1)%NA){const mm=melds([...h,top.v]).filter(x=>x.includes(top.v)).sort((a,b)=>a.length-b.length)[0];
if(mm){DISC.pop();FX[i].push(mm);h=h.filter(v=>!mm.includes(v));fm=NM[i]+' ăn '+pl(top.v);ate=true}}
if(!ate&&!PBF){h=[...h,STK.pop()];fm=''}
let b=null;h.forEach(v=>{const r=solve(h.filter(x=>x!==v)).p;if(!b||r<b.r||(r===b.r&&v>>2>b.v>>2))b={v,r}});
FH[i]=h.filter(x=>x!==b.v).sort((a,c)=>a-c);DISC.push({v:b.v,by:i});FD[i]++;ff=1;PBF=0;aft(i)}
function pfin(w,kind){fo=true;const sc=FH.map(x=>solve(x).p);
if(w===null)w=sc.indexOf(Math.min(...sc));
let d;if(w===0){d=kind?600:300;burst();fm=(kind?'Ù! ':'')+'Bạn thắng +'+fx(d)}
else{d=kind?300:Math.max(50,(sc[0]-sc[w])*10);fm=NM[w]+(kind?' ù':' thắng')+'. Bạn thua −'+d}
count(Math.max(0,chips+(w===0?fx(d):-d)));pr();setTimeout(()=>{const e=$('#tc');if(e)e.textContent=fmt(chips)},700)}
let QH=[],QA=[],QC=[],QU=0,QP=0,QQ=[],QR=0,Qo=false,Qm='',Qk=0,Qf=0;
function qev(h){const r=h.map(v=>v>>2).sort((a,b)=>a-b),top=Math.max(...h);
if(r[0]===r[2])return[3,r[0]===1?14:r[0],top,'Sáp '+pl(r[0]*4).slice(0,-1)];
const lq=(r[1]===r[0]+1&&r[2]===r[1]+1)?r[2]:(r[0]===1&&r[1]===12&&r[2]===13)?14:0;
if(lq)return[2,lq,top,'Liêng'];
if(r[0]>=11)return[1,0,top,'Ba tây'];
const p=r.reduce((a,x)=>a+(x>=10?0:x),0)%10;return[0,p,top,p+' điểm']}
const qcmp=(a,b)=>a[0]-b[0]||a[1]-b[1]||a[2]-b[2];
function lieng(){let t=$('#tb');if(!t){t=document.createElement('div');t.id='tb';document.body.append(t)}
t.hidden=false;if(chips<100){needChips();return}
const d=deck().map(c=>c.r*4+c.s);QH=[0,1,2,3].map(i=>d.slice(i*3,i*3+3));
QA=[1,1,1,1];QC=[0,0,0,0];QU=0;QR=0;Qo=false;Qf=1;Qk++;QP=400;setChips(chips-100);
QQ=[0,1,2,3];Qm='Mỗi người góp 100 Chips';qr();qn()}
function qn(){if(!QQ.length)return qfin(null);if(QQ[0]!==0)qbot()}
function qr(){const t=$('#tb'),me=QH[0],call=QU-QC[0],my=!Qo&&QQ[0]===0;
const rv=i=>QH[i].map(v=>Qo&&QA[i]?C(pl(v),'new'):BK(1)).join('');
t.innerHTML=`<div class="top"><button class="bet" id="tbx">Về sảnh</button><h3>Liêng</h3><span class="chips" id="tc" style="padding:4px 10px">${fmt(chips)}</span></div>
<div class="seats">${[1,2,3].map(i=>`<div class="st${QQ[0]===i&&!Qo?' on':''}">${NM[i]}<b>${QA[i]?(Qo?qev(QH[i])[3]:'Cược '+(QC[i]+100)):'Đã bỏ'}</b><div class="row2" style="zoom:.55;margin-top:4px">${rv(i)}</div></div>`).join('')}</div>
<div class="mid"><div class="pot">Pot ${fmt(QP)}</div><div>Mức cược hiện tại: ${QU}</div><div id="ms" class="pot" style="font-size:16px">${Qm}</div></div>
<div class="row2">${me.map(v=>C(pl(v),Qf?'new':'')).join('')}</div><div>${qev(me)[3]}</div>
<div class="ops">${Qo?'':`<button class="btn alt" id="qf"${my?'':' disabled'}>Bỏ</button><button class="btn alt" id="qc"${my?'':' disabled'}>${call?'Theo '+call:'Xem'}</button><button class="btn" id="qa"${my&&QR<3?'':' disabled'}>Tố +200</button>`}</div>`;
Qf=0;$('#tbx').onclick=()=>{Qk++;t.hidden=true};
if($('#nw'))$('#nw').onclick=lieng;
if($('#qf')){$('#qf').onclick=()=>qact(0,'f');$('#qc').onclick=()=>qact(0,'c');$('#qa').onclick=()=>qact(0,'r')}
if(shk){t.classList.remove('shake');void t.offsetWidth;t.classList.add('shake');shk=0}}
function qact(i,a){
if(a==='f'){QA[i]=0;QQ.shift();Qm=NM[i]+' bỏ';if(i===0)return qfin(null)}
else{if(a==='r'){QU+=200;QR++}const need=QU-QC[i],pay=i===0?Math.min(chips,need):need;
QC[i]+=pay;QP+=pay;if(i===0)setChips(chips-pay);
Qm=NM[i]+(a==='r'?' tố lên '+QU:need?' theo '+need:' xem');
QQ.shift();if(a==='r')QQ=[1,2,3].map(k=>(i+k)%4).filter(x=>QA[x])}
if(QA.filter(Boolean).length===1)return qfin(QA.indexOf(1));
qr();qn()}
async function qbot(){const k=++Qk;await sleep(1100);if(k!==Qk||Qo)return;const i=QQ[0];
const e=qev(QH[i]),s=e[0]===3?100:e[0]===2?80:e[0]===1?60:e[1]*6+Math.random()*8,call=QU-QC[i];
let a='c';
if(s>=80)a=QR<3&&Math.random()<.6?'r':'c';
else if(s>=60)a=QR<3&&Math.random()<.25?'r':'c';
else if(call>0&&(s<30||call>400)&&Math.random()<.7)a='f';
else if(s>=45&&QR<3&&Math.random()<.15)a='r';
qact(i,a)}
function qfin(w){Qo=true;
if(w===null){const al=[0,1,2,3].filter(x=>QA[x]);w=al.reduce((b,x)=>qcmp(qev(QH[x]),qev(QH[b]))>0?x:b)}
const mine=QC[0]+100;
if(w===0){feeWin(QP,mine);burst();Qm='Bạn thắng +'+fx(QP-mine)+' ('+qev(QH[0])[3]+')'}
else{Qm=NM[w]+' thắng với '+qev(QH[w])[3]+'. Bạn mất '+mine;shk=1}
qr();setTimeout(()=>{const e=$('#tc');if(e)e.textContent=fmt(chips)},700)}
const isW=c=>c!==' '&&c===c.toUpperCase();
const D8=[[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]],KN=[[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]];
const PV={p:100,n:320,b:330,r:500,q:900,k:0};
function cat(b,sq,w){const r=sq>>3,c=sq&7,at=(y,x)=>y>=0&&y<8&&x>=0&&x<8?b[y*8+x]:null;
const P=w?'P':'p',N=w?'N':'n',K=w?'K':'k',B=w?'B':'b',R=w?'R':'r',Q=w?'Q':'q',pr=w?r+1:r-1;
if(at(pr,c-1)===P||at(pr,c+1)===P)return true;
for(const[d,e]of KN)if(at(r+d,c+e)===N)return true;
for(const[d,e]of D8){if(at(r+d,c+e)===K)return true;let y=r+d,x=c+e,z;
while((z=at(y,x))===' '){y+=d;x+=e}
if(z===Q||z===((d&&e)?B:R))return true}
return false}
function cg(b,st,w){const o=[];
for(let i=0;i<64;i++){const p=b[i];if(p===' '||isW(p)!==w)continue;const r=i>>3,c=i&7,t=p.toLowerCase();
const add=(y,x)=>{if(y<0||y>7||x<0||x>7)return false;const q=b[y*8+x];if(q!==' '&&isW(q)===w)return false;o.push({f:i,t:y*8+x});return q===' '};
if(t==='p'){const d=w?-1:1,s0=w?6:1,pr=w?0:7;
if(b[(r+d)*8+c]===' '){o.push({f:i,t:(r+d)*8+c,p:r+d===pr});if(r===s0&&b[(r+2*d)*8+c]===' ')o.push({f:i,t:(r+2*d)*8+c,dbl:1})}
for(const e of[-1,1]){const x=c+e,y=r+d;if(x<0||x>7)continue;const q=b[y*8+x];
if(q!==' '&&isW(q)!==w)o.push({f:i,t:y*8+x,p:y===pr});else if(y*8+x===st.ep)o.push({f:i,t:y*8+x,ep:1})}}
else if(t==='n')KN.forEach(([d,e])=>add(r+d,c+e));
else if(t==='k'){D8.forEach(([d,e])=>add(r+d,c+e));const h=w?7:0;
if(r===h&&c===4&&!cat(b,i,!w)){
if(st.c[w?'K':'k']&&b[h*8+5]===' '&&b[h*8+6]===' '&&b[h*8+7]===(w?'R':'r')&&!cat(b,h*8+5,!w))o.push({f:i,t:h*8+6,ca:1});
if(st.c[w?'Q':'q']&&b[h*8+3]===' '&&b[h*8+2]===' '&&b[h*8+1]===' '&&b[h*8]===(w?'R':'r')&&!cat(b,h*8+3,!w))o.push({f:i,t:h*8+2,ca:2})}}
else{const ds=t==='r'?D8.filter(([d,e])=>!(d&&e)):t==='b'?D8.filter(([d,e])=>d&&e):D8;
ds.forEach(([d,e])=>{let y=r+d,x=c+e;while(add(y,x)){y+=d;x+=e}})}}
return o}
