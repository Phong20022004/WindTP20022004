/*@file js/lessons/seoul1a-bai1/07-exam-seed-and-duel-setup.js
 * Đề thi cố định theo seed (hai người cùng đề) và biến thách đấu.
 */
/* đề thi cố định theo seed (thách đấu: hai người cùng đề) */
function genExam(seed,n){const r=mb(seed),K=META&&META.noType?["mc","mc","mc","mc"]:SW.length?["mc","fill","listen","type"]:["mc","listen","type","mc"],ws=shufR(W,r).slice(0,Math.min(n,W.length));
 const ks=shufR(Array.from({length:ws.length},(_,i)=>K[i%4]),r);
 return ws.map((w,i)=>{const k=ks[i];return{kind:k,w,ops:k=="type"?null:k=="fill"?optsR(w,SW,r):optsR(w,W,r)}})}
let TC=null,duelOpts=null,duelView="lobby",duelSels=[],duelAllReq=false,duelN=15;
const WT=()=>window.WINDTP;
/* mỗi lời thách đấu gắn với một bài (c.lesson); "s1a-1" = Seoul 1A bài 1 làm tay */
const lessonKey=()=>META?META.key:"s1a-1",lessonLabel=()=>META?META.label:"Seoul Korean 1A · Bài 1";
const sameLesson=c=>(c.lesson||"s1a-1")===lessonKey();
const openOther=(c,route)=>{const k=c.lesson||"s1a-1";if(k==="s1a-1")window.__s1aOpen(route);else if(window.__openLessonByKey)window.__openLessonByKey(k,route)};
const fmtT=ms=>(ms/1000).toFixed(1)+"s";
