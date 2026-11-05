/*@file game/js/14-patch-v14-js.js
 * Patch v14: banner Thanh Long - Bạch Hổ.
 */

/* v14: banner Thanh Long - Bạch Hổ to hơn, hiệu ứng 3D */
(()=>{
const st=document.createElement('style');
st.textContent=`@property --rx{syntax:'<angle>';inherits:false;initial-value:0deg}
@property --ry{syntax:'<angle>';inherits:false;initial-value:0deg}
.promo.pt{margin:4px -6px 34px;transform:perspective(800px) rotateX(var(--rx)) rotateY(var(--ry));transform-style:preserve-3d;will-change:transform;animation:ptSway 7s ease-in-out infinite;
 border:3px solid #d8fff4;border-radius:22px;
 box-shadow:inset 0 0 0 2px rgba(255,255,255,.28),inset 0 -30px 40px rgba(0,0,0,.35),0 7px 0 #0f6258,0 14px 0 #0a3d39,0 21px 0 #062a27,0 34px 36px rgba(0,0,0,.75),0 0 34px rgba(80,255,210,.45)}
.promo.pt.tilt{animation:none;transition:transform .1s linear}
@keyframes ptSway{0%,100%{--ry:-4deg;--rx:2deg}50%{--ry:4deg;--rx:-2deg}}
.promo.pt::after{content:'';position:absolute;inset:0;border-radius:inherit;pointer-events:none;z-index:3;background:linear-gradient(115deg,rgba(255,255,255,.38) 0,rgba(255,255,255,.08) 22%,transparent 40%),linear-gradient(180deg,rgba(255,255,255,.22),transparent 18%)}
.pt .ptimg{aspect-ratio:1.5}
.pt .ptimg::before{inset:-7%;background-position:50% 32%;translate:calc(var(--px,0)*-12px) calc(var(--py,0)*-9px);filter:saturate(1.2) contrast(1.1) drop-shadow(0 10px 14px rgba(0,0,0,.6))}
.pt .glow,.pt .sp{translate:calc(var(--px,0)*16px) calc(var(--py,0)*11px)}
.pt .ptx{transform:translateZ(30px);padding:8px 14px 16px}
.pt .ptx b.hst{font-size:30px;filter:drop-shadow(0 2px 0 #4a2c05) drop-shadow(0 4px 0 #2a1803) drop-shadow(0 8px 10px rgba(0,0,0,.7)) drop-shadow(0 0 8px rgba(255,190,70,.5))}
.pt .ptx small{font-size:12px}.pt .ptx span{font-size:13px}
.pt .ptx button{padding:11px 22px;font-size:16px;box-shadow:0 5px 0 #0a5b4c,0 9px 14px rgba(0,0,0,.5),0 0 16px rgba(110,255,220,.55)}
@media(prefers-reduced-motion:reduce){.promo.pt{animation:none}}`;
document.head.append(st);
const b=document.querySelector('.promo.pt');if(!b)return;
const K=['--rx','--ry','--px','--py'];
const mv=e=>{const r=b.getBoundingClientRect(),x=((e.clientX-r.left)/r.width-.5)*2,y=((e.clientY-r.top)/r.height-.5)*2;
 b.classList.add('tilt');b.style.setProperty('--ry',(x*10).toFixed(1)+'deg');b.style.setProperty('--rx',(-y*8).toFixed(1)+'deg');b.style.setProperty('--px',x.toFixed(2));b.style.setProperty('--py',y.toFixed(2))};
const rs=()=>{b.classList.remove('tilt');K.forEach(k=>b.style.removeProperty(k))};
['pointermove','pointerdown'].forEach(n=>b.addEventListener(n,mv));
['pointerleave','pointerup','pointercancel'].forEach(n=>b.addEventListener(n,rs));
})();
