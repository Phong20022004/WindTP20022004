/*@file game/js/04c-chess-xiangqi.js
 * Engine cờ vua / cờ tướng (bản đầu).
 */
function cap(b,st,m){const n=[...b],p=n[m.f],w=isW(p),c={...st.c};let ep=-1;
n[m.t]=p;n[m.f]=' ';if(m.ep)n[m.t+(w?8:-8)]=' ';if(m.p){const pc=m.pc||'q';n[m.t]=w?pc.toUpperCase():pc}
if(m.ca){const h=w?7:0;if(m.ca===1){n[h*8+5]=n[h*8+7];n[h*8+7]=' '}else{n[h*8+3]=n[h*8];n[h*8]=' '}}
if(m.dbl)ep=(m.f+m.t)/2;
if(p==='K'){c.K=0;c.Q=0}if(p==='k'){c.k=0;c.q=0}
if(m.f===63||m.t===63)c.K=0;if(m.f===56||m.t===56)c.Q=0;if(m.f===7||m.t===7)c.k=0;if(m.f===0||m.t===0)c.q=0;
return{b:n,st:{c,ep}}}
const cle=(b,st,w)=>cg(b,st,w).filter(m=>!cat(cap(b,st,m).b,cap(b,st,m).b.indexOf(w?'K':'k'),!w));
function cev(b){let s=0;for(let i=0;i<64;i++){const p=b[i];if(p===' ')continue;const w=isW(p),t=p.toLowerCase(),r=i>>3,c=i&7;
let v=PV[t]+(t==='p'?(w?6-r:r-1)*8:0)+((t==='n'||t==='b'||t==='p'||t==='q')?(7-Math.abs(c-3.5)-Math.abs(r-3.5))*3:0);s+=w?v:-v}return s}
function cnm(b,st,w,d,a,be){if(d===0)return(w?1:-1)*cev(b);const ms=cle(b,st,w);
if(!ms.length)return cat(b,b.indexOf(w?'K':'k'),!w)?-99999-d:0;
ms.sort((x,y)=>(b[y.t]!==' ')-(b[x.t]!==' '));
for(const m of ms){const r=cap(b,st,m),s=-cnm(r.b,r.st,!w,d-1,-be,-a);if(s>=be)return be;if(s>a)a=s}return a}
let CB=[],CS={},CT=true,CSel=-1,CL=[],CHist=[],Cover=false,Cmsg='',CLm=[-1,-1],Ck=0,Cpop=0;
function cvg(){let t=$('#tb');if(!t){t=document.createElement('div');t.id='tb';document.body.append(t)}
t.hidden=false;CB='rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR'.replace(/\//g,'').replace(/8/g,'        ').split('');
CS={c:{K:1,Q:1,k:1,q:1},ep:-1};CT=true;CSel=-1;CL=[];CHist=[];Cover=false;CLm=[-1,-1];Ck++;Cpop=0;Cmsg='Bạn cầm quân trắng, đi trước';cvr()}
function cvr(){const t=$('#tb'),ks=CB.indexOf(CT?'K':'k'),chk=cat(CB,ks,!CT);
const gl={p:'♟',r:'♜',n:'♞',b:'♝',q:'♛',k:'♚'},tg=new Set(CL.map(m=>m.t));
t.innerHTML=`<div class="top"><button class="bet" id="tbx">Về sảnh</button><h3>Cờ vua</h3><span class="chips" id="tc" style="padding:4px 10px">${fmt(chips)}</span></div>
<div class="seats">${ST('Hà (đen)','')}</div>
<div class="mid"><div class="board" id="bd">${CB.map((x,i)=>`<button class="sq${(i%8+(i>>3))%2?' d':''}${isW(x)?' w':''}${i===CSel?' on':''}${tg.has(i)?' mv':''}${tg.has(i)&&x!==' '?' cp':''}${CLm.includes(i)?' lm':''}${chk&&i===ks?' ck':''}" data-i="${i}">${x===' '?'':`<span class="${Cpop&&i===CLm[1]?'pop':''}">${gl[x.toLowerCase()]}</span>`}</button>`).join('')}</div><div id="ms" class="pot" style="font-size:16px">${Cmsg}</div></div>
<div class="seats">${ST('Bạn (trắng)','')}</div>
<div class="ops"><button class="btn alt" id="cu">Đi lại</button></div>`;
Cpop=0;$('#tbx').onclick=()=>{Ck++;t.hidden=true};if($('#nw'))$('#nw').onclick=cvg;
$('#cu').onclick=()=>{if(!CHist.length||(!CT&&!Cover))return;Ck++;const h=CHist.pop();CB=h.b;CS=h.st;CLm=h.lm;CT=true;Cover=false;CSel=-1;CL=[];Cmsg='Đã đi lại';cvr()};
$('#bd').onclick=e=>{const k=e.target.closest('[data-i]');if(!k||Cover||!CT)return;const i=+k.dataset.i,m=CL.find(z=>z.t===i);
if(CSel>=0&&m){CHist.push({b:CB,st:CS,lm:CLm});const r=cap(CB,CS,m);CB=r.b;CS=r.st;CLm=[m.f,m.t];CT=false;CSel=-1;CL=[];Cpop=1;return cend()}
if(CB[i]!==' '&&isW(CB[i])){CSel=i;CL=cle(CB,CS,true).filter(z=>z.f===i)}else{CSel=-1;CL=[]}
cvr()}}
function cend(){const ms=cle(CB,CS,CT),ck=cat(CB,CB.indexOf(CT?'K':'k'),!CT);
if(!ms.length||CB.filter(x=>x!==' ').length===2){Cover=true;
if(!ms.length&&ck){if(!CT){Cmsg='Chiếu hết, bạn thắng +'+fx(TB);count(chips+fx(TB));burst()}else{Cmsg='Chiếu hết, Hà thắng. Bạn mất '+TB;count(Math.max(0,chips-TB));shk=1}}
else Cmsg='Hòa';
cvr();setTimeout(()=>{const e=$('#tc');if(e)e.textContent=fmt(chips)},700);return}
Cmsg=ck?'Chiếu!':(CT?'Lượt của bạn':'Hà đang nghĩ...');cvr();if(ck&&CT){const t=$('#tb');t.classList.remove('shake');void t.offsetWidth;t.classList.add('shake')}
if(!CT)cbot()}
async function cbot(){const k=++Ck;await sleep(500);if(k!==Ck||Cover)return;
let best=null,bs=-1e9;for(const m of cle(CB,CS,false)){const r=cap(CB,CS,m),s=-cnm(r.b,r.st,true,2,-1e9,1e9)+Math.random()*8;if(s>bs){bs=s;best=m}}
if(k!==Ck)return;const r=cap(CB,CS,best);CB=r.b;CS=r.st;CLm=[best.f,best.t];CT=true;Cpop=1;cend()}
const XV={k:0,a:200,e:200,h:400,r:900,c:450,p:100},XM={K:'帥',A:'仕',E:'相',H:'傌',R:'俥',C:'炮',P:'兵',k:'將',a:'士',e:'象',h:'馬',r:'車',c:'砲',p:'卒'};
const X4=[[-1,0],[1,0],[0,-1],[0,1]];
function xgen(b,w){const o=[];
for(let i=0;i<90;i++){const p=b[i];if(p===' '||isW(p)!==w)continue;const r=(i/9)|0,c=i%9,t=p.toLowerCase();
const add=(y,x)=>{if(y<0||y>9||x<0||x>8)return false;const q=b[y*9+x];if(q!==' '&&isW(q)===w)return false;o.push([i,y*9+x]);return q===' '};
const inP=(y,x)=>x>=3&&x<=5&&(w?y>=7&&y<=9:y>=0&&y<=2);
if(t==='k')X4.forEach(([d,e])=>{if(inP(r+d,c+e))add(r+d,c+e)});
else if(t==='a')[[-1,-1],[-1,1],[1,-1],[1,1]].forEach(([d,e])=>{if(inP(r+d,c+e))add(r+d,c+e)});
else if(t==='e')[[-2,-2],[-2,2],[2,-2],[2,2]].forEach(([d,e])=>{const y=r+d,x=c+e;if(y<0||y>9||x<0||x>8||(w?y<5:y>4))return;if(b[(r+d/2)*9+c+e/2]!==' ')return;add(y,x)});
else if(t==='h')[[-2,-1],[-2,1],[2,-1],[2,1],[-1,-2],[-1,2],[1,-2],[1,2]].forEach(([d,e])=>{const ly=Math.abs(d)===2?r+d/2:r,lx=Math.abs(d)===2?c:c+e/2;if(b[ly*9+lx]!==' ')return;add(r+d,c+e)});
else if(t==='r')X4.forEach(([d,e])=>{let y=r+d,x=c+e;while(add(y,x)){y+=d;x+=e}});
else if(t==='c')X4.forEach(([d,e])=>{let y=r+d,x=c+e;const ib=()=>y>=0&&y<=9&&x>=0&&x<=8;
while(ib()&&b[y*9+x]===' '){o.push([i,y*9+x]);y+=d;x+=e}
y+=d;x+=e;while(ib()&&b[y*9+x]===' '){y+=d;x+=e}
if(ib()&&isW(b[y*9+x])!==w)o.push([i,y*9+x])});
else{const d=w?-1:1,cr=w?r<=4:r>=5;add(r+d,c);if(cr){add(r,c-1);add(r,c+1)}}}
return o}
function xchk(b,w){const k=b.indexOf(w?'K':'k');if(k<0)return true;const r=(k/9)|0,c=k%9;
const at=(y,x)=>y>=0&&y<10&&x>=0&&x<9?b[y*9+x]:null;
const ER=w?'r':'R',EC=w?'c':'C',EH=w?'h':'H',EK=w?'k':'K',EP=w?'p':'P';
for(const[d,e]of X4){let y=r+d,x=c+e,z;while((z=at(y,x))===' '){y+=d;x+=e}
if(z===ER||z===EK)return true;
if(z!==null){y+=d;x+=e;while((z=at(y,x))===' '){y+=d;x+=e}if(z===EC)return true}}
for(const[d,e]of[[-2,-1],[-2,1],[2,-1],[2,1],[-1,-2],[-1,2],[1,-2],[1,2]]){
if(at(r+d,c+e)!==EH)continue;
const ly=Math.abs(d)===2?r+d/2:r+d,lx=Math.abs(d)===2?c+e:c+e/2;if(at(ly,lx)===' ')return true}
if(at(r+(w?-1:1),c)===EP)return true;
for(const e of[-1,1])if(at(r,c+e)===EP&&(w?r>=5:r<=4))return true;
return false}
const xap=(b,m)=>{const n=[...b];n[m[1]]=n[m[0]];n[m[0]]=' ';return n};
const xle=(b,w)=>xgen(b,w).filter(m=>!xchk(xap(b,m),w));
function xev(b){let s=0;for(let i=0;i<90;i++){const p=b[i];if(p===' ')continue;const w=isW(p),t=p.toLowerCase(),r=(i/9)|0,c=i%9;
let v=XV[t];if(t==='p'&&(w?r<=4:r>=5))v+=100+(4-Math.abs(c-4))*5;if(t==='h'||t==='c'||t==='r')v+=(4-Math.abs(c-4))*4;s+=w?v:-v}return s}
function xnm(b,w,d,a,be){if(d===0)return(w?1:-1)*xev(b);const ms=xle(b,w);if(!ms.length)return-99999-d;
ms.sort((x,y)=>(b[y[1]]!==' ')-(b[x[1]]!==' '));
for(const m of ms){const s=-xnm(xap(b,m),!w,d-1,-be,-a);if(s>=be)return be;if(s>a)a=s}return a}
let XB=[],XT=true,XSel=-1,XL=[],XHist=[],Xover=false,Xmsg='',XLm=[-1,-1],Xk=0,Xpop=0;
function xg(){let t=$('#tb');if(!t){t=document.createElement('div');t.id='tb';document.body.append(t)}
t.hidden=false;XB=['rheakaehr','         ',' c     c ','p p p p p','         ','         ','P P P P P',' C     C ','         ','RHEAKAEHR'].join('').split('');
XT=true;XSel=-1;XL=[];XHist=[];Xover=false;XLm=[-1,-1];Xk++;Xpop=0;Xmsg='Bạn cầm quân đỏ, đi trước';xdr()}
function xdr(){const t=$('#tb'),ck=xchk(XB,XT),tg=new Set(XL.map(m=>m[1])),kk=XB.indexOf(XT?'K':'k');
const P=i=>[20+(i%9)*40,20+((i/9)|0)*40];
let s='<svg class="xq" viewBox="0 0 360 400"><g stroke="#5a3a12" stroke-width="1.5" fill="none">';
for(let i=0;i<10;i++)s+=`<path d="M20 ${20+i*40}H340"/>`;
for(let c=0;c<9;c++){const x=20+c*40;s+=c%8?`<path d="M${x} 20V180M${x} 220V380"/>`:`<path d="M${x} 20V380"/>`}
s+='<path d="M140 20L220 100M220 20L140 100M140 300L220 380M220 300L140 380"/></g><text x="110" y="200" fill="#5a3a12">楚河</text><text x="250" y="200" fill="#5a3a12">漢界</text>';
XLm.forEach(i=>{if(i>=0){const[x,y]=P(i);s+=`<rect x="${x-19}" y="${y-19}" width="38" height="38" rx="4" fill="none" stroke="#e0b44f" stroke-width="3" pointer-events="none"/>`}});
for(let i=0;i<90;i++)s+=`<rect data-k="${i}" x="${(i%9)*40}" y="${((i/9)|0)*40}" width="40" height="40" fill="transparent"/>`;
XB.forEach((p,i)=>{if(p===' ')return;const[x,y]=P(i),col=isW(p)?'#b3261e':'#1b1b18',hit=ck&&i===kk;
s+=`<g class="pc${Xpop&&i===XLm[1]?' pop':''}" data-k="${i}"><circle cx="${x}" cy="${y}" r="17" fill="${i===XSel?'#e0b44f':hit?'#f6b8ae':'#f3ebd7'}" stroke="${col}" stroke-width="${hit?5:2.5}"/><text x="${x}" y="${y}" fill="${col}">${XM[p]}</text></g>`});
tg.forEach(i=>{const[x,y]=P(i);s+=XB[i]!==' '?`<circle cx="${x}" cy="${y}" r="21" fill="none" stroke="#b3261e" stroke-width="3" pointer-events="none"/>`:`<circle cx="${x}" cy="${y}" r="6" fill="#b3261e" opacity=".7" pointer-events="none"/>`});
t.innerHTML=`<div class="top"><button class="bet" id="tbx">Về sảnh</button><h3>Cờ tướng</h3><span class="chips" id="tc" style="padding:4px 10px">${fmt(chips)}</span></div>
<div class="seats">${ST('Hà (đen)','')}</div>
<div class="mid"><div id="xq">${s}</svg></div><div class="pot" id="ms" style="font-size:16px">${Xmsg}</div></div>
<div class="seats">${ST('Bạn (đỏ)','')}</div>
<div class="ops"><button class="btn alt" id="cu">Đi lại</button></div>`;
Xpop=0;$('#tbx').onclick=()=>{Xk++;t.hidden=true};if($('#nw'))$('#nw').onclick=xg;
$('#cu').onclick=()=>{if(!XHist.length||(!XT&&!Xover))return;Xk++;const h=XHist.pop();XB=h.b;XLm=h.lm;XT=true;Xover=false;XSel=-1;XL=[];Xmsg='Đã đi lại';xdr()};
$('#xq').onclick=e=>{const g=e.target.closest('[data-k]');if(!g||Xover||!XT)return;const i=+g.dataset.k,m=XL.find(z=>z[1]===i);
if(XSel>=0&&m){XHist.push({b:XB,lm:XLm});XB=xap(XB,m);XLm=m;XT=false;XSel=-1;XL=[];Xpop=1;return xend()}
if(XB[i]!==' '&&isW(XB[i])){XSel=i;XL=xle(XB,true).filter(z=>z[0]===i)}else{XSel=-1;XL=[]}
xdr()}}
function xend(){const ms=xle(XB,XT),ck=xchk(XB,XT);
if(!ms.length){Xover=true;
if(!XT){Xmsg=(ck?'Chiếu bí':'Hết nước đi')+', bạn thắng +'+fx(TB);count(chips+fx(TB));burst()}
else{Xmsg=(ck?'Chiếu bí':'Hết nước đi')+', Hà thắng. Bạn mất '+TB;count(Math.max(0,chips-TB))}
xdr();setTimeout(()=>{const e=$('#tc');if(e)e.textContent=fmt(chips)},700);return}
Xmsg=ck?'Chiếu tướng!':(XT?'Lượt của bạn':'Hà đang nghĩ...');xdr();
if(ck&&XT){const t=$('#tb');t.classList.remove('shake');void t.offsetWidth;t.classList.add('shake')}
if(!XT)xbot()}
async function xbot(){const k=++Xk;await sleep(500);if(k!==Xk||Xover)return;
let best=null,bs=-1e9;for(const m of xle(XB,false)){const s=-xnm(xap(XB,m),true,2,-1e9,1e9)+Math.random()*8;if(s>bs){bs=s;best=m}}
if(k!==Xk)return;XB=xap(XB,best);XLm=best;XT=true;Xpop=1;xend()}
