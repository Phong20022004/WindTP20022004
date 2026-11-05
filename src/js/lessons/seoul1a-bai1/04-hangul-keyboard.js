/*@file js/lessons/seoul1a-bai1/04-hangul-keyboard.js
 * Bàn phím Hangul ảo kiểu 2벌식 (ghép jamo).
 */
/* Hangul virtual keyboard */
const LC="ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎ",VC="ㅏㅐㅑㅒㅓㅔㅕㅖㅗㅘㅙㅚㅛㅜㅝㅞㅟㅠㅡㅢㅣ";
const TM={0:1,1:2,2:4,3:7,5:8,6:16,7:17,9:19,10:20,11:21,12:22,14:23,15:24,16:25,17:26,18:27},TL={};for(const k in TM)TL[TM[k]]=+k;
const isSyl=c=>c>="가"&&c<="힣",chr=n=>String.fromCharCode(44032+n);
const VM={"8,0":9,"8,1":10,"8,20":11,"13,4":14,"13,5":15,"13,20":16,"18,20":19},VS={};for(const k in VM){const[a,b]=k.split(",");VS[VM[k]]=[+a,+b]}
const FC={"1,ㅅ":3,"4,ㅈ":5,"4,ㅎ":6,"8,ㄱ":9,"8,ㅁ":10,"8,ㅂ":11,"8,ㅅ":12,"8,ㅌ":13,"8,ㅍ":14,"8,ㅎ":15,"17,ㅅ":18},TSPLIT={};for(const k in FC){const[a,c]=k.split(",");TSPLIT[FC[k]]=[+a,c]}
function jamo(v,j){const l=v.slice(-1),h=v.slice(0,-1),ci=LC.indexOf(j),vi=VC.indexOf(j);
 if(ci>=0){if(isSyl(l)){const n=l.charCodeAt(0)-44032,t=n%28;
   if(t==0&&TM[ci]!==undefined)return h+chr(n+TM[ci]);
   const c=FC[t+","+j];if(c)return h+chr(n-t+c)}
  return v+j}
 if(vi>=0){const li=LC.indexOf(l);
  if(li>=0)return h+chr((li*21+vi)*28);
  if(isSyl(l)){const n=l.charCodeAt(0)-44032,t=n%28,vo=Math.floor(n%588/28);
   if(t==0){const cv=VM[vo+","+vi];if(cv!==undefined)return h+chr(n+(cv-vo)*28)}
   else{const sp=TSPLIT[t],t1=sp?sp[0]:0,ini=sp?LC.indexOf(sp[1]):TL[t];return h+chr(n-t+t1)+chr((ini*21+vi)*28)}}}
 return v+j}
function bksp(v){const l=v.slice(-1),h=v.slice(0,-1);
 if(isSyl(l)){const n=l.charCodeAt(0)-44032,t=n%28,vo=Math.floor(n%588/28),ini=Math.floor(n/588);
  if(t){const sp=TSPLIT[t];return h+chr(n-t+(sp?sp[0]:0))}
  if(VS[vo])return h+chr(ini*588+VS[vo][0]*28);
  return h+LC[ini]}
 return h}
/* Bàn phím 2벌식 (kiểu bàn phím điện thoại) */
const KR1="ㅂㅈㄷㄱㅅㅛㅕㅑㅐㅔ",KR1S="ㅃㅉㄸㄲㅆㅛㅕㅑㅒㅖ",KR2="ㅁㄴㅇㄹㅎㅗㅓㅏㅣ",KR3="ㅋㅌㅊㅍㅠㅜㅡ";
const kbk=c=>`<button class="k" data-j="${c}">${c}</button>`;
const kbHTML=()=>`<div class="kbw"><div class="row" style="margin:6px 0 4px"><button class="btn kbt">⌨️ Ẩn bàn phím ảo</button><span class="mut">Bạn cũng có thể gõ bằng bàn phím máy</span></div><div class="kbx"><div class="kr">${[..."1234567890"].map(kbk).join("")}</div><div class="kr" id="kr1">${[...KR1].map(kbk).join("")}</div><div class="kr" style="padding:0 5%">${[...KR2].map(kbk).join("")}</div><div class="kr"><button class="k wide" data-sh="1">⇧</button>${[...KR3].map(kbk).join("")}<button class="k wide" data-b="1">⌫</button></div><div class="kr"><button class="k wide" data-j="?">!#1</button>${kbk(",")}<button class="k sp" data-j=" ">‹ &nbsp; 한국어 &nbsp; ›</button>${kbk(".")}<button class="k wide" data-e="1">↵</button></div></div></div>`;
const kbBind=inp=>{let sh=false;const k1=[...root.querySelectorAll("#kr1 .k")];
 const paint=()=>{k1.forEach((b,i)=>{const c=(sh?KR1S:KR1)[i];b.dataset.j=c;b.textContent=c});const s=root.querySelector("[data-sh]");if(s)s.classList.toggle("act",sh)};
 root.querySelectorAll(".kbx .k").forEach(b=>b.onclick=()=>{if(b.dataset.sh){sh=!sh;paint();return}if(b.dataset.b){inp.value=bksp(inp.value);return}if(b.dataset.e){inp.dispatchEvent(new KeyboardEvent("keydown",{key:"Enter"}));return}inp.value=jamo(inp.value,b.dataset.j);if(sh){sh=false;paint()}});
 const t=root.querySelector(".kbt");if(t)t.onclick=()=>{const x=root.querySelector(".kbx"),hid=x.style.display==="none";x.style.display=hid?"":"none";t.textContent=hid?"⌨️ Ẩn bàn phím ảo":"⌨️ Hiện bàn phím ảo"}};

const mb=a=>function(){a|=0;a=a+1831565813|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296};
const shufR=(a,r)=>{a=[...a];for(let i=a.length-1;i>0;i--){const j=r()*(i+1)|0;[a[i],a[j]]=[a[j],a[i]]}return a};
const optsR=(w,pool,r)=>shufR([w,...shufR(pool.filter(x=>x!==w),r).slice(0,3)],r);

