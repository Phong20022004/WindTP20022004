/*@file game/js/16-patch-v16-js.js
 * Patch v16: đút 3 bích, lủng, lật bài thối.
 */
/* ===== v16: đút 3 bích, lủng, lật bài thối ===== */
(()=>{
const q=s=>document.querySelector(s);
function zoom3(w){const fx=q('#fxl');if(!fx)return;let sx=0,sy=0;try{const[a,b]=tlpos(w),x=q('.tlx');sx=(a-x.clientWidth/2)+'px';sy=(b-x.clientHeight/2)+'px'}catch(e){sx='0px';sy='0px'}
 const z=document.createElement('div');z.className='z3';z.style.setProperty('--sx',sx);z.style.setProperty('--sy',sy);
 let h='<i class="rg"></i><i class="rg b"></i>'+tlpc(12,'')+'<b>ĐÚT 3 BÍCH · GẤP ĐÔI</b>';
 for(let k=0;k<14;k++){const a=k*(360/14)*Math.PI/180,r=110+(k%3)*30;h+=`<i class="sp" style="left:0;top:0;--x:${(Math.cos(a)*r).toFixed(0)}px;--y:${(Math.sin(a)*r).toFixed(0)}px;--dl:${(k%5)*.15}s">✦</i>`}
 z.innerHTML=h;fx.append(z);try{snd('ban')}catch(e){}setTimeout(()=>z.remove(),3100)}
function thoi(h){const set=new Map(),add=(v,t)=>{if(!set.has(v))set.set(v,[]);if(!set.get(v).includes(t))set.get(v).push(t)};
 h.forEach(v=>{if(rk(v)===15)add(v,(v&3)>1?'HEO ĐỎ':'HEO ĐEN');if(v===12)add(v,'3♠')});
 try{gen(h).forEach(c=>{const a=ana(c);if(a&&a.t==='q')c.forEach(v=>add(v,'TỨ QUÝ'));else if(a&&a.t==='d')c.forEach(v=>add(v,'ĐÔI THÔNG'))})}catch(e){}
 return set}
function reveal(w,white){const fx=q('#fxl');if(!fx)return;document.querySelectorAll('.rvl').forEach(e=>e.remove());let any=false;
 [1,2,3].forEach(p=>{if(p===w||!HD[p]||!HD[p].length||!q('#av'+p))return;
  const h=[...HD[p]].sort((a,b)=>a-b),th=white?new Map():thoi(h),[a,b]=tlpos(p),W=q('.tlx').clientWidth;
  const rows=h.length>8?[h.slice(0,Math.ceil(h.length/2)),h.slice(Math.ceil(h.length/2))]:[h];let k=0;
  const e=document.createElement('div');e.className='rvl';
  e.innerHTML=rows.map(r=>`<div class="rw2">${r.map(v=>tlpc(v,th.has(v)?' th':'',`style="--d:${(k++)*.07}s"`)).join('')}</div>`).join('')+
   (th.size?`<div class="tg2">${[...new Set([...th.values()].flat())].map(t=>`<em>THỐI ${t}</em>`).join('')}</div>`:'');
  fx.append(e);const ew=e.offsetWidth;e.style.left=Math.max(ew/2+4,Math.min(a,W-ew/2-4))+'px';e.style.top=(p===2?b+30:b+34)+'px';any=true});
 if(any)try{snd('flip')}catch(e){}}
const f0=fin;fin=function(w,kind){const r=f0.apply(this,arguments);
 try{if(Tdut)setTimeout(()=>zoom3(w),250);setTimeout(()=>reveal(w,!!kind),Tdut?1400:350)}catch(e){}return r};
const t0=tien;tien=function(){document.querySelectorAll('.rvl,.z3').forEach(e=>e.remove());return t0.apply(this,arguments)};
})();
