/*@file game/js/18-patch-v39-js.js
 * Patch v39: người xem.
 */
/* v39: người xem không có lượt, không tự đánh bài: Tiến lên và Phỏm bỏ qua ghế của bạn, Liêng và Poker tự bỏ bài */
(function(){
const sp=()=>window.SPEC===true;
const os=window.stp;
if(typeof os==='function')window.stp=function(){
 if(sp()&&!over&&turn===0){
  try{if(typeof must3!=='undefined'&&must3&&!last&&HD[0].includes(12)){
    const i=HD[0].indexOf(12),c=HD[1][0];HD[0][i]=c;HD[1][0]=12;HD[0].sort((a,b)=>a-b);HD[1].sort((a,b)=>a-b);
    turn=HD.findIndex(h=>h.includes(12));ms=NM[turn]+' có 3♠, đi trước';dr();return os.apply(this,arguments)}}catch(e){}
  return adv(0)}
 return os.apply(this,arguments)};
const op=window.phom;
if(typeof op==='function')window.phom=function(){const r=op.apply(this,arguments);
 if(sp())try{if(!fo&&FT===0){const h=FH[0];if(h.length>9){FH[1].push(h.pop());FH[1].sort((a,b)=>a-b)}FT=1%NA;FP='d';PBF=1;pr();pbot()}}catch(e){}
 return r};
const oa=window.aft;
if(typeof oa==='function')window.aft=function(i){if(!sp())return oa.apply(this,arguments);
 if(solve(FH[i]).p===0)return pfin(i,1);
 if(FD.slice(0,NA).every((x,k)=>k===0||x>=4)||!STK.length)return pfin(null,0);
 let n=(i+1)%NA;if(n===0)n=1%NA;FT=n;FP='d';pr();pbot()};
/* thông tin ghế của người xem: thay ngay khi bàn vẽ lại, không để lộ tên/avatar/Chips của bạn; hết xem thì trả lại thông tin của bạn */
let was=false;
const seatFix=(me,v)=>{me.querySelectorAll('.me').forEach(m=>{const a=m.querySelector('.av'),b=m.querySelector('.pl b'),s=m.querySelector('.pl span');
  if(a){const n=a.firstChild;if(n&&n.nodeType===3&&n.nodeValue!==AVT[0])n.nodeValue=AVT[0]}
  if(b&&b.textContent!==NM[0])b.textContent=NM[0];
  if(s&&s.textContent!==v)s.textContent=v})};
const fix=()=>{const tb=document.getElementById('tb');
 if(sp()){was=true;if(tb)seatFix(tb,(window.SPECW||0).toLocaleString('vi-VN')+' Chips');return}
 if(was){was=false;if(tb)seatFix(tb,fmt(chips))}};
new MutationObserver(()=>{if(sp()||was)fix()}).observe(document.body,{childList:true,subtree:true,characterData:true});
setInterval(()=>{if(document.hidden)return;if(sp()||was)fix()},400);
})();
