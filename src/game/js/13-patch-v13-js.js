/*@file game/js/13-patch-v13-js.js
 * Patch v13.
 */

/* v13: chặt ngoài lượt sáng nút, ván đầu 3♠, trang trí sảnh */
(()=>{
const PW=x=>x.t==='d'?(x.n===6?1:x.n===8?3:4):x.t==='q'?2:0,
 HZ=l=>(l.t==='s'||l.t==='p')&&rk(l.k)===15,
 cut4=(a,L)=>!!a&&a.t==='d'&&a.n>=8&&beats(a,L),
  trig=l=>!!l&&(HZ(l.c)||PW(l.c)>0),
  ext=()=>!over&&turn===0&&PS[0]===1&&!!last&&last.by!==0&&trig(last);
/* Máy đã bỏ lượt mà được tới lượt lại (khi có heo, 3 đôi thông, tứ quý...) thì chỉ chặt bằng 4 đôi thông, không thì bỏ */
{const bt0=bt;bt=function(i){if(PS[i]===1&&last){const c=gen(HD[i]).filter(x=>cut4(ana(x),last.c)).sort((x,y)=>ana(x).k-ana(y).k)[0];if(c){PS[i]=0;return mv(i,c)}return ps(i)}return bt0(i)}}
/* Người chơi đã bỏ lượt vẫn được 'đến lượt' lại khi có người đánh heo, đôi heo, 3 đôi thông, tứ quý */
adv=function(i){let j=i;const e=k=>PS[k]===1&&!over&&!!last&&last.by!==k&&trig(last);do{j=(j+1)%NA}while(PS[j]&&!e(j));if(last&&j===last.by){try{tlSettle()}catch(e){}last=null;PS=[0,0,0,0]}turn=j;tlDrop();dr();stp();tlidle()};
const st=document.createElement('style');
st.textContent=`.b2.ootl{animation:ootl .9s ease-in-out infinite}@keyframes ootl{50%{box-shadow:0 0 0 4px rgba(255,220,120,.55),0 0 22px rgba(255,200,80,.9);filter:brightness(1.25)}}
#ldw{position:fixed;inset:0;z-index:0;pointer-events:none;overflow:hidden}#ldw #dcr{position:absolute;inset:0;border-radius:0;opacity:.85}
@media(prefers-reduced-motion:reduce){#ldw *{animation:none!important}}`;
document.head.append(st);
const d13=dr;
dr=function(){d13();
 {const c=$('#cut');if(c)c.remove()}
 if(over||turn!==0||!last||last.by===0||!trig(last))return;
 const pb=$('#pb'),pl=$('#pl2');if(!pb||!pl)return;
 pb.disabled=false;pl.disabled=false;pb.classList.add('ootl');pl.classList.add('ootl');
 if(PS[0]!==1)return;
 let can=false;try{can=gen(HD[0]).some(x=>cut4(ana(x),last.c))}catch(e){}
 {const m=$('#ms');if(m)m.textContent=can?'Bạn có 4 đôi thông: chặt ngay hoặc bấm Bỏ lượt':''}
 pb.onclick=()=>ps(0);
 pl.onclick=()=>{const cs=[...sel],a=cs.length&&ana(cs);
  if(!a){$('#ms').textContent='Bộ bài không hợp lệ';return}
  if(!cut4(a,last.c)){$('#ms').textContent='Bạn đã bỏ lượt, chỉ chặt được bằng 4 đôi thông lớn hơn';return}
  tok++;PS[0]=0;mv(0,cs)}};
/* Ván đầu của mỗi lần vào bàn: người giữ 3♠ luôn đi trước */
$('#sheet').addEventListener('click',e=>{if(e.target.closest&&e.target.closest('#play')&&cur==='tl'){try{TLW=-1}catch(_){}}},true);
try{G.tl.r[4]+=' Khi người khác đánh heo, 3 đôi thông, tứ quý hoặc 4 đôi thông, hai nút Bỏ lượt và Đánh bài sáng khi đến lượt bạn (kể cả khi bạn đã bỏ lượt trước đó, lúc này chỉ chặt được bằng 4 đôi thông), có 10 giây để chọn. 5 đôi thông tới trắng.'}catch(e){}
/* Sảnh chờ: xí ngầu, chip, vòng quay */
if(window.__DECOR){const w=document.createElement('div');w.id='ldw';w.setAttribute('aria-hidden','true');
 const d=document.createElement('div');d.id='dcr';d.innerHTML=window.__DECOR();w.append(d);document.body.prepend(w)}
})();
