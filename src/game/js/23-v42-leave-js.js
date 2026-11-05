/*@file game/js/23-v42-leave-js.js
 * v42: rời bàn giữa ván bị xử thua.
 */

(()=>{
/* v42: rời bàn giữa ván -> bị xử thua, ván vẫn tính kết quả với các người chơi còn lại */
let CURG='';
['tien','phom','lieng','pkg','c3deal'].forEach(n=>{const o=window[n];if(typeof o==='function')window[n]=function(...a){CURG=n==='tien'?'tl':n==='phom'?'ph':n==='c3deal'?'3c':'';return o.apply(this,a)}});
function toast2(s){try{toast(s)}catch(e){}}
function forfeit(){
 const t=document.getElementById('tb');if(!t||t.hidden)return;
 try{
  if(CURG==='tl'&&typeof over!=='undefined'&&!over&&Array.isArray(HD)&&HD.length){
   if(t.classList.contains('spec'))return;
   let w=1,m=99;for(let i=1;i<NA;i++)if(HD[i]&&HD[i].length<m){m=HD[i].length;w=i}
   fin(w);toast2('Bạn rời bàn giữa ván nên bị xử thua. Ván đấu vẫn được tính kết quả.');
  }else if(CURG==='3c'&&typeof C3o!=='undefined'&&C3o===false&&!C3pend&&Array.isArray(C3H)&&C3H.length){
   if(t.classList.contains('spec'))return;
   const N=C3H.length,B=CFG['3c'].b,E=C3H.map(ev3);let n0=0;
   for(let i=0;i<N;i++){if(i===CD)continue;const w=cmp3(E[i],E[CD])>0,a=B*((w?E[i].tay:E[CD].tay)?2:1);if(i===0)n0+=w?a:-a;else if(CD===0)n0+=w?-a:a}
   C3o=true;C3k++;count(Math.max(0,chips+fx(n0)));
   toast2('Bạn rời bàn giữa ván. Ván vẫn được tính: '+(n0>=0?'bạn thắng +'+fmt(fx(n0)):'bạn thua '+fmt(Math.abs(n0)))+' chip.');
  }else if(CURG==='ph'&&typeof fo!=='undefined'&&!fo){
   if(t.classList.contains('spec'))return;
   const net=Math.min((PEN[0]||0)-4,-1)*TB;fo=true;count(Math.max(0,chips+net));
   toast2('Bạn rời bàn giữa ván nên bị xử móm, mất '+fmt(Math.abs(net))+' chip.');
  }
 }catch(e){}
}
document.addEventListener('click',e=>{const b=e.target.closest&&e.target.closest('#tbx');if(b)forfeit()},true);
})();
