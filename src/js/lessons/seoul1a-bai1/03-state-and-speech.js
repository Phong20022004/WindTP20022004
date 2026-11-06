/*@file js/lessons/seoul1a-bai1/03-state-and-speech.js
 * Biến trạng thái, chọn giọng đọc tiếng Hàn.
 */
let timer=null,cur="flash",qt=null,raf=0;
let KV=null;const pickV=()=>{const v=speechSynthesis.getVoices().filter(x=>/^ko/i.test(x.lang.replace("_","-")));for(const p of [/google.*(한국|korean)/i,/neural|natural|online/i,/sun-?hi|injoon|yuna|유나|heami|선히/i]){const f=v.find(x=>p.test(x.name));if(f)return f}return v[0]||null};
try{speechSynthesis.onvoiceschanged=()=>{KV=pickV()};KV=pickV()}catch(e){}
const speak=t=>{try{speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(t);u.lang="ko-KR";const v=KV||pickV();if(v)u.voice=v;u.rate=.9;u.pitch=1;later(()=>speechSynthesis.speak(u),90)}catch(e){}};
let SW=S.map(s=>W.find(w=>w[0]===s[0]));
const opts=(w,pool=W)=>shuf([w,...shuf(pool.filter(x=>x!==w)).slice(0,3)]);
let gen=0;const later=(f,ms)=>{const g=gen;return setTimeout(()=>{if(g===gen)f()},ms)};stopAll=()=>{gen++;clearInterval(timer);clearInterval(qt);cancelAnimationFrame(raf);try{speechSynthesis.cancel()}catch(e){}};const go=()=>{stopAll();modes[cur]()};window.__s1aGo=go;
