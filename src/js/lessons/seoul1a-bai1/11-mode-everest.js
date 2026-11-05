/*@file js/lessons/seoul1a-bai1/11-mode-everest.js
 * ⚠ Chế độ game leo núi Everest — nằm trong object `modes`, đóng object ở cuối file.
 */
everest(){const G=17;let pos=0,tries=1,best=0,pool=[],bag=[];
 const cum=[0];for(let i=1;i<PATH.length;i++)cum.push(cum[i-1]+Math.hypot(PATH[i][0]-PATH[i-1][0],PATH[i][1]-PATH[i-1][1]));const TOT=cum[cum.length-1];
 const P=u=>{u=Math.max(0,Math.min(1,u));const d=u*TOT;let i=1;while(i<cum.length-1&&cum[i]<d)i++;const sg=cum[i]-cum[i-1]||1,t=(d-cum[i-1])/sg,a=PATH[i-1],b=PATH[i];return[a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t,b[0]-a[0]]};
 const U=k=>k/G,SC=u=>1-.5*u,rn=(a,b)=>a+Math.random()*(b-a);
 const trD="M"+PATH.map(p=>p[0]+","+p[1]).join("L");
 const birds=[[120,110,0,34],[300,200,-9,46],[760,70,-17,40],[980,330,-5,52]].map(([x,y,d,t])=>`<g class="bdr" style="animation-duration:${t}s;animation-delay:${d}s"><g transform="translate(${x},${y}) scale(2.2)"><path d="M0,0 q9,-11 18,0 q9,-11 18,0" stroke="#fff" stroke-width="2.6" fill="none" stroke-linecap="round" class="fl"/></g></g>`).join("");
 const star=(cx,cy,R)=>Array.from({length:10},(_,i)=>{const a=-Math.PI/2+i*Math.PI/5,d=i%2?R*.382:R;return(cx+d*Math.cos(a)).toFixed(1)+","+(cy+d*Math.sin(a)).toFixed(1)}).join(" ");
 const flagSvg=(sc)=>`<line x1="0" y1="0" x2="0" y2="-${96*sc}" stroke="#d9a21a" stroke-width="${7*sc}" stroke-linecap="round"/><circle cy="-${98*sc}" r="${8*sc}" fill="#ffd43b" stroke="#c98a06" stroke-width="1.5"/><g class="wv2"><path d="M${3*sc},-${88*sc} q${30*sc},-${10*sc} ${58*sc},0 t${28*sc},0 l-${4*sc},${52*sc} q-${28*sc},${10*sc} -${54*sc},0 t-${28*sc},0Z" fill="#da251d" stroke="#a51d16" stroke-width="2"/><polygon points="${star(48*sc,-62*sc,17*sc)}" fill="#ffde00"/></g>`;
 const sp=[[690,60],[760,330],[560,250],[820,230]].map(([x,y],i)=>`<text class="tw" x="${x}" y="${y}" font-size="38" style="animation-delay:${i*.45}s">✨</text>`).join("");
 app.innerHTML=`<div class="mut" id="st"></div><div class="sc2"><svg id="fg" viewBox="0 0 1224 1285"><defs><filter id="gw" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="9"/></filter>
 <radialGradient id="hg3"><stop offset="0" stop-color="#ff7eb6" stop-opacity=".95"/><stop offset=".7" stop-color="#ff4d94" stop-opacity=".75"/><stop offset="1" stop-color="#ff4d94" stop-opacity="0"/></radialGradient>
 <clipPath id="cpP"><rect x="-80" y="-200" width="160" height="200"/></clipPath><clipPath id="cpQ"><rect x="-72" y="-150" width="144" height="150"/></clipPath></defs>
 <image href="${IMG.bg}" x="0" y="0" width="1224" height="1285" preserveAspectRatio="none"/><g font-weight="900" text-anchor="middle" fill="#fff4d6" stroke="#5a3513" stroke-width="7" paint-order="stroke" stroke-linejoin="round" transform="rotate(1.5 140 780)"><text x="140" y="778" font-size="31">Đường lên đỉnh</text><text x="140" y="818" font-size="42">Everest</text></g>${birds}${sp}
 <path id="tr0" d="${trD}" fill="none" stroke="#fff6c2" stroke-width="22" stroke-linecap="round" stroke-linejoin="round" opacity=".25" pathLength="1000" filter="url(#gw)" stroke-dasharray="0 1000"/>
 <path id="tr" d="${trD}" fill="none" stroke="#fff" stroke-width="9" stroke-linecap="round" stroke-linejoin="round" opacity=".9" pathLength="1000" stroke-dasharray="0 1000"/>
 <g id="fl2" style="display:none;transform:translate(500px,352px)"><ellipse rx="26" ry="8" fill="#000" opacity=".25"/><g class="pole2">${flagSvg(1.35)}</g></g>
 <g id="pw" style="transform:translate(707px,280px)"><g id="pcs"><ellipse cy="2" rx="48" ry="9" fill="#000" opacity=".22"/><g class="sway"><image href="${IMG.princess}" x="-77" y="-226" width="140" height="226"/></g></g></g>
 <g id="bb"><path d="M806,126 L772,176 L862,132Z" fill="#fff" stroke="#f0268f" stroke-width="5" stroke-linejoin="round"/><rect x="775" y="48" width="430" height="84" rx="42" fill="#fff" stroke="#f0268f" stroke-width="5"/><path d="M803,127 L783,157 L846,128Z" fill="#fff"/><text id="bt" x="990" y="102" text-anchor="middle" font-size="35" font-weight="800" fill="#e0187e">Hoàng tử ơi, cứu em với! 💗</text></g>
 <g id="ch" style="transform:translate(224px,1150px)"><g id="cf"><ellipse cy="4" rx="150" ry="16" fill="#000" opacity=".2"/><g id="ci"><g id="rp" style="display:none"><g transform="translate(-92,-150) scale(.66)"><image href="${IMG.princess}" x="-77" y="-226" width="140" height="226"/></g></g><image href="${IMG.prince}" x="-172" y="-352" width="345" height="352"/><g id="pf" style="transform:translate(72px,-257px)">${flagSvg(.9)}</g></g></g></g>
 <g id="cg"></g>
 <g id="kiss" style="display:none"><rect width="1224" height="1285" fill="#3b0a3f" opacity=".42"/><g transform="translate(612,640)"><g class="kheart"><path d="M0,-70 C-140,-230 -300,-60 0,200 C300,-60 140,-230 0,-70Z" fill="url(#hg3)"/></g>
 <g class="kP" transform="translate(-100,150) rotate(8) scale(1.7)"><g clip-path="url(#cpP)"><image href="${IMG.prince}" x="-180" y="-200" width="345" height="352"/></g></g><g class="kQ" transform="translate(110,130) rotate(-8) scale(1.7)"><g clip-path="url(#cpQ)"><image href="${IMG.princess}" x="-70" y="-150" width="140" height="226"/></g></g>
 <text class="kmw" x="0" y="-60" text-anchor="middle" font-size="58">💋</text></g></g>
 <text id="vic" x="612" y="520" text-anchor="middle" font-size="190" font-weight="900" fill="#ffd43b" stroke="#e03131" stroke-width="12" paint-order="stroke">VICTORY!</text></svg></div><div id="bx"></div>`;
 const ch=$("#ch"),cf=$("#cf"),ci=$("#ci"),pw=$("#pw"),svgNS="http://www.w3.org/2000/svg",tr=$("#tr"),tr0=$("#tr0");
 const st=()=>$("#st").textContent=`Bậc ${pos}/${G} · Kỷ lục ${best} · Lần leo ${tries} · Đúng lên 1 bậc, sai lùi 3 bậc`;
 const say=t=>{$("#bt").textContent=t};
 const trail=u=>{const d=(u*1000).toFixed(1)+" 1000";tr.style.strokeDasharray=d;tr0.style.strokeDasharray=d};
 const place=(u,dir)=>{const[x,y,dx]=P(u),s=SC(u);ch.style.transform=`translate(${x.toFixed(1)}px,${(y+22*s).toFixed(1)}px) scale(${s.toFixed(3)})`;cf.style.transform=`scaleX(${dir||(dx>=0?1:-1)})`};
 const slide=(u0,u1,ms,done,cls,keep,onf)=>{const t0=performance.now(),g=gen,sgn=u1>=u0?1:-1;if(cls)ci.classList.add(cls);
  const step=now=>{if(g!==gen)return;const t=Math.min(1,(now-t0)/ms),e=t<.5?2*t*t:1-Math.pow(-2*t+2,2)/2,u=u0+(u1-u0)*e,dx=P(u)[2];place(u,(dx>=0?1:-1)*(keep?1:sgn));if(onf)onf(u);if(t<1)raf=requestAnimationFrame(step);else{if(cls)ci.classList.remove(cls);done&&done()}};raf=requestAnimationFrame(step)};
 const bubble=()=>say(pos>=G-2?"Sắp tới rồi, cố lên! 💗":pos>=Math.ceil(G/2)?"Anh giỏi quá! 💕":"Hoàng tử ơi, cứu em với! 💗");
 const floatTxt=(txt,col)=>{const[x,y]=P(U(pos)),t=document.createElementNS(svgNS,"text");t.textContent=txt;t.setAttribute("x",x);t.setAttribute("y",y-200*SC(U(pos)));t.setAttribute("text-anchor","middle");t.setAttribute("font-size",52);t.setAttribute("font-weight",900);t.setAttribute("fill",col);t.setAttribute("stroke","#fff");t.setAttribute("stroke-width",8);t.setAttribute("paint-order","stroke");t.setAttribute("class","ft");$("#cg").appendChild(t);setTimeout(()=>t.remove(),1500)};
 const heart=(x,y,sz,dur)=>{const h=document.createElementNS(svgNS,"text");h.textContent=Math.random()<.5?"💖":"💗";h.setAttribute("x",x);h.setAttribute("y",y);h.setAttribute("font-size",sz||rn(34,56));h.setAttribute("class","ht");h.style.animationDuration=(dur||2)+"s";$("#cg").appendChild(h);setTimeout(()=>h.remove(),(dur||2)*1000)};
 const confetti=()=>{const cg=$("#cg");for(let i=0;i<46;i++){const c=document.createElementNS(svgNS,"rect");c.setAttribute("x",rn(300,950));c.setAttribute("y",rn(40,200));c.setAttribute("width",14);c.setAttribute("height",24);c.setAttribute("fill",["#ffd43b","#ff6b6b","#4dabf7","#69db7c","#fff"][i%5]);c.setAttribute("class","cfi");c.style.setProperty("--dx",rn(-200,200)+"px");c.style.animationDelay=rn(0,.8)+"s";cg.appendChild(c);setTimeout(()=>c.remove(),3800)}};
 const show=(id,on)=>{const e=$(id);if(e)e.style.display=on?"":"none"};
 const moveP=(x0,y0,s0,x1,y1,s1,ms,done)=>{const t0=performance.now(),g=gen,s=now=>{if(g!==gen)return;const t=Math.min(1,(now-t0)/ms),e=t*t*(3-2*t),hop=Math.abs(Math.sin(t*Math.PI*5))*22*(t<1?1:0);pw.style.transform=`translate(${(x0+(x1-x0)*e).toFixed(1)}px,${(y0+(y1-y0)*e-hop).toFixed(1)}px) scale(${(s0+(s1-s0)*e).toFixed(3)})`;if(t<1)raf=requestAnimationFrame(s);else done&&done()};raf=requestAnimationFrame(s)};
 const endCard=()=>{snd("end");$("#bx").innerHTML=`<div class="card"><div class="vi">🏆 Bạn đã chinh phục đỉnh Everest sau ${tries} lần leo!</div><div class="rom">Hai người cùng nhau cưỡi ngựa về nhà. Hạnh phúc trọn vẹn 💞</div><div class="row"><button class="btn pri" onclick="__s1aGo()">Leo lại</button></div></div>`};
 const win=()=>{snd("summit");$("#bx").innerHTML="";ci.classList.remove("run","slip");say("Hoàng tử đến rồi! 💖");$("#st").textContent="🚩 Cắm cờ trên đỉnh núi!";
  const g0=gen;
  later(()=>{snd("flag");$("#pf").style.display="none";show("#fl2",true);$("#fl2").classList.add("plant");say("Cắm cờ chinh phục! 🚩")},350);
  later(()=>{snd("run");moveP(707,280,1,752,386,.56,1500)},500);
  later(()=>{snd("kiss");snd("fanfare");$("#bb").style.display="none";show("#kiss",true);$("#kiss").classList.add("go");$("#vic").classList.add("show");$("#st").textContent="💞 Hai người ôm hôn nhau trên đỉnh núi";confetti();
   const hv=setInterval(()=>{if(gen!==g0){clearInterval(hv);return}heart(rn(320,900),rn(560,860),rn(40,70),2.4)},200);later(()=>clearInterval(hv),3800)},2400);
  later(()=>{show("#kiss",false);$("#vic").classList.remove("show");show("#pw",false);show("#rp",true);$("#st").textContent="🐎 Cùng nhau cưỡi ngựa xuống núi";ch.dataset.u=1;
   const ev=setInterval(()=>{if(gen!==g0){clearInterval(ev);return}snd("clop");const u=parseFloat(ch.dataset.u||1),[x,y]=P(u);heart(x-40,y-200*SC(u),rn(30,46),1.7)},330);
   slide(1,0,6500,()=>{clearInterval(ev);ci.classList.remove("run");trail(0);endCard()},"run",false,u=>{ch.dataset.u=u})},6700)};
 const nq=()=>{if(!bag.length)bag=shuf(["mc","type","fill","listen"]);const k=bag.pop();if(!pool.length)pool=shuf(W);const w=pool.pop();return[k,w]};
 const q=()=>{const[k,w]=nq();st();bubble();
  runQ($("#bx"),k,w,res=>{
   if(res){pos++;best=Math.max(best,pos);snd("step",pos);st();bubble();trail(U(pos));slide(U(pos-1),U(pos),780,()=>{if(pos>=G){win();return}q()},"run")}
   else{const np=Math.max(0,pos-3),from=pos;tries++;snd(from==np?"bump":"slip");floatTxt(from>np?"-"+(from-np)+" bậc":"Về chân núi","#e03131");say(np==0?"Ôi không, về chân núi rồi! 😢":"Trượt chân rồi! Cố lên nào 😢");pos=np;st();trail(U(np));
    if(from==np){later(q,900)}else slide(U(from),U(np),1000,()=>q(),"slip",true)}},{noSkip:true,strict:true})};
 if(window.__S1A_TEST)window.__s1aT={set:n=>{pos=n;place(U(n),1);trail(U(n))},win};
 place(0,1);st();snd("start");(()=>{const g1=gen,w=setInterval(()=>{if(gen!==g1||!host||host.style.display==="none"){clearInterval(w);return}snd("gust")},4200)})();q()
}
};

