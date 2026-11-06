/*@file js/lessons/seoul1a-bai1/12-tabs-and-open-close.js
 * Thanh tab, openLesson()/closeLesson(); đóng initApp() và IIFE.
 */
const T=[["flash","🃏 Flashcard"],["quiz","✅ Trắc nghiệm"],["type","⌨️ Gõ từ vựng"],["read","📖 Đọc hiểu"],["listen","🎧 Luyện nghe"],["match","🔗 Ghép cặp"],["everest","🏔️ Giải cứu công chúa"],["duel","⚔️ Thách đấu 👑"]];
const TT=META?T.filter(t=>(t[0]!=="read"||SW.length)&&!(META.noType&&(t[0]==="type"||t[0]==="listen"))):T;
$("#tabs").innerHTML=TT.map(([k,t])=>{const[e,...r]=t.split(" "),n=r.join(" ");return`<button data-m="${k}" title="${n}"><span>${e}</span><span class="lb"> ${n}</span></button>`}).join("");
const act=k=>{clearInterval(timer);cur=k;root.querySelectorAll("#tabs button").forEach(x=>x.classList.toggle("on",x.dataset.m===k));go()};
root.querySelectorAll("#tabs button").forEach(b=>b.onclick=()=>act(b.dataset.m));
routeFn=o=>{duelOpts=o;act("duel")};
try{if(WT()&&WT().ch)WT().ch.onChange(()=>{if(cur==="duel"&&duelView==="lobby"&&host&&host.style.display!=="none")duelLobby()})}catch(e){}
if(pendingRoute){const o=pendingRoute;pendingRoute=null;routeFn(o)}else act("flash");sndBtn();
}

const syncDark=()=>{if(host)document.documentElement.classList.contains("dark")?host.setAttribute("data-dark",""):host.removeAttribute("data-dark")};
function openLesson(o){
 if(!host){host=document.createElement("div");host.id="windtp-seoul1a-host";root=host.attachShadow({mode:"open"});root.innerHTML=META?SHELL.replace("SEOUL KOREAN · 1A",META.eyebrow).replace("Bài 1 · Từ vựng",META.title):SHELL;document.body.appendChild(host);pendingRoute=o||null;initApp();
  root.querySelector("#x").onclick=closeLesson;root.querySelector("#cfg").onclick=()=>{closeLesson();const s=document.querySelector('[data-action="open-settings"]');if(s)s.click()};
  new MutationObserver(syncDark).observe(document.documentElement,{attributes:true,attributeFilter:["class"]});host.dataset.r="1"}
 if(o&&routeFn&&host.dataset.r)routeFn(o);syncDark();host.style.display="block";document.body.style.overflow="hidden"}
let curKey="s1a1";
/* W, S… nằm trong initApp(): đổi bài = dựng lại khung (initApp chạy lại với dữ liệu mới) */
function useLesson(key,meta){if(curKey===key)return;if(host){stopAll();host.remove();host=null;root=null;app=null;routeFn=null}META=meta;curKey=key}
window.__s1aOpen=o=>{useLesson("s1a1",null);openLesson(o)};
window.__lessonOpen=(d,route)=>{useLesson(d.key,{key:d.key,words:d.words,sents:d.sents,eyebrow:d.eyebrow,title:d.title,label:d.label,noType:!!d.noType});openLesson(route||null)};
function closeLesson(){hsAnimated=false;if(!host)return;stopAll();host.style.display="none";document.body.style.overflow=""}
document.addEventListener("keydown",e=>{if(e.key==="Escape"&&host&&host.style.display!=="none")closeLesson()});
})();
