/*@file js/lessons/seoul1a-bai1/12-tabs-and-open-close.js
 * Thanh tab, openLesson()/closeLesson(); đóng initApp() và IIFE.
 */
const T=[["flash","🃏 Flashcard"],["quiz","✅ Trắc nghiệm"],["type","⌨️ Gõ từ vựng"],["read","📖 Đọc hiểu"],["listen","🎧 Luyện nghe"],["match","🔗 Ghép cặp"],["everest","🏔️ Giải cứu công chúa"],["duel","⚔️ Thách đấu 👑"]];
$("#tabs").innerHTML=T.map(([k,t])=>{const[e,...r]=t.split(" "),n=r.join(" ");return`<button data-m="${k}" title="${n}"><span>${e}</span><span class="lb"> ${n}</span></button>`}).join("");
const act=k=>{clearInterval(timer);cur=k;root.querySelectorAll("#tabs button").forEach(x=>x.classList.toggle("on",x.dataset.m===k));go()};
root.querySelectorAll("#tabs button").forEach(b=>b.onclick=()=>act(b.dataset.m));
routeFn=o=>{duelOpts=o;act("duel")};
try{if(WT()&&WT().ch)WT().ch.onChange(()=>{if(cur==="duel"&&duelView==="lobby"&&host&&host.style.display!=="none")duelLobby()})}catch(e){}
if(pendingRoute){const o=pendingRoute;pendingRoute=null;routeFn(o)}else act("flash");sndBtn();
}

const syncDark=()=>{if(host)document.documentElement.classList.contains("dark")?host.setAttribute("data-dark",""):host.removeAttribute("data-dark")};
function openLesson(o){
 if(!host){host=document.createElement("div");host.id="windtp-seoul1a-host";root=host.attachShadow({mode:"open"});root.innerHTML=SHELL;document.body.appendChild(host);pendingRoute=o||null;initApp();
  root.querySelector("#x").onclick=closeLesson;root.querySelector("#cfg").onclick=()=>{closeLesson();const s=document.querySelector('[data-action="open-settings"]');if(s)s.click()};
  new MutationObserver(syncDark).observe(document.documentElement,{attributes:true,attributeFilter:["class"]});host.dataset.r="1"}
 if(o&&routeFn&&host.dataset.r)routeFn(o);syncDark();host.style.display="block";document.body.style.overflow="hidden"}
window.__s1aOpen=openLesson;
function closeLesson(){hsAnimated=false;if(!host)return;stopAll();host.style.display="none";document.body.style.overflow=""}
document.addEventListener("keydown",e=>{if(e.key==="Escape"&&host&&host.style.display!=="none")closeLesson()});
})();
