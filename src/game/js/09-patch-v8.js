/*@file game/js/09-patch-v8.js
 * Patch v8.
 */

/* ===== PATCH v8 ===== */
async function bw(i){const ms=1000+Math.pow(Math.random(),1.3)*9000,t0=Date.now();
const ring=()=>{const av=document.getElementById('av'+i);if(av&&!av.querySelector('.tmr.bt')){const el=Date.now()-t0;av.insertAdjacentHTML('beforeend',`<svg class="tmr bt" viewBox="0 0 100 100"><circle cx="50" cy="50" r="47" pathLength="100" style="animation:tmrr ${ms}ms linear forwards,tmrc ${ms}ms linear forwards;animation-delay:${-el}ms,${-el}ms"/></svg>`)}};
const mo=new MutationObserver(ring);mo.observe(document.body,{childList:true,subtree:true});
ring();while(Date.now()-t0<ms){await sleep(Math.min(300,Math.max(30,ms-(Date.now()-t0))));ring()}
mo.disconnect();document.querySelectorAll('.tmr.bt').forEach(e=>e.remove())}
function tlpig(i,n){const fx=$('#fxl'),t=$('.mid2'),x=$('.tlx');if(!fx||!t||!$('#av'+i))return;const[a,b]=tlpos(i);let c=t.offsetWidth/2,d=t.offsetHeight/2;for(let o=t;o&&o!==x;o=o.offsetParent){c+=o.offsetLeft;d+=o.offsetTop}
for(let k=0;k<n;k++)setTimeout(()=>fly(fx,'🐷',a,b,c+(k-(n-1)/2)*34,d-6,700,60,k%2?-300:300,()=>snd('splat'),34),k*160)}
(()=>{const mk=(c,st)=>{const d=document.createElement('div');d.className='lbd';d.style.cssText=st;d.innerHTML=c;document.body.append(d)};
const P={3:[[28,28],[50,50],[72,72]],5:[[28,28],[72,28],[50,50],[28,72],[72,72]],6:[[28,24],[72,24],[28,50],[72,50],[28,76],[72,76]]};
const pips=n=>P[n].map(([x,y])=>`<i style="left:calc(${x}% - 7px);top:calc(${y}% - 7px)"></i>`).join('');
mk(pips(5),'left:-18px;top:24%;rotate:-18deg');mk(pips(3),'right:-22px;top:52%;rotate:24deg;width:80px;height:80px');mk(pips(6),'left:6%;bottom:14%;rotate:12deg;width:70px;height:70px;opacity:.16')})();
