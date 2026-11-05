/*@file js/lessons/seoul1a-bai1/05-sound-effects.js
 * Hiệu ứng và âm thanh đúng/sai, âm thanh màn leo núi.
 */
/* hiệu ứng + âm thanh đúng/sai */
let AC=null,SND=true;
function tone(f,t0,d,type,v){try{AC=AC||new(window.AudioContext||window.webkitAudioContext)();if(AC.state=="suspended")AC.resume();const o=AC.createOscillator(),g=AC.createGain(),t=AC.currentTime+t0;o.type=type||"sine";o.frequency.setValueAtTime(f,t);g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(v||.18,t+.02);g.gain.exponentialRampToValueAtTime(.0001,t+d);o.connect(g);g.connect(AC.destination);o.start(t);o.stop(t+d+.05)}catch(e){}}
function sfx(ok){if(!SND)return;if(ok){tone(660,0,.14,"triangle");tone(880,.09,.16,"triangle");tone(1175,.19,.28,"triangle")}else{tone(220,0,.2,"sawtooth",.14);tone(165,.16,.34,"sawtooth",.14)}try{navigator.vibrate&&navigator.vibrate(ok?30:[80,40,80])}catch(e){}}
function noise(t0,d,f,q,v,type){if(!SND)return;try{AC=AC||new(window.AudioContext||window.webkitAudioContext)();if(AC.state=="suspended")AC.resume();const n=Math.max(1,AC.sampleRate*d|0),buf=AC.createBuffer(1,n,AC.sampleRate),a=buf.getChannelData(0);for(let i=0;i<n;i++)a[i]=Math.random()*2-1;const s=AC.createBufferSource(),fl=AC.createBiquadFilter(),g=AC.createGain(),t=AC.currentTime+t0;s.buffer=buf;fl.type=type||"bandpass";fl.frequency.setValueAtTime(f,t);fl.Q.value=q||1;g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(v||.1,t+Math.min(.03,d/3));g.gain.exponentialRampToValueAtTime(.0001,t+d);s.connect(fl);fl.connect(g);g.connect(AC.destination);s.start(t);s.stop(t+d+.05)}catch(e){}}
function sweep(f0,f1,t0,d,type,v){if(!SND)return;try{AC=AC||new(window.AudioContext||window.webkitAudioContext)();if(AC.state=="suspended")AC.resume();const o=AC.createOscillator(),g=AC.createGain(),t=AC.currentTime+t0;o.type=type||"sine";o.frequency.setValueAtTime(f0,t);o.frequency.exponentialRampToValueAtTime(Math.max(20,f1),t+d);g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(v||.12,t+.03);g.gain.exponentialRampToValueAtTime(.0001,t+d);o.connect(g);g.connect(AC.destination);o.start(t);o.stop(t+d+.05)}catch(e){}}
const SCALE=[262,294,330,392,440,523,587,659,784,880,1047,1175,1319,1568,1760,2093,2349,2637];
/* âm thanh màn leo núi: bước chân, trượt ngã, cắm cờ, hôn, phi ngựa... */
function snd(k,n){if(!SND)return;switch(k){
case"start":sweep(520,980,0,.28,"sine",.08);break;
case"step":{noise(0,.07,1900,2,.13);noise(.17,.07,1500,2,.1);const f=SCALE[Math.min(Math.max((n||1)-1,0),SCALE.length-1)];tone(f,.04,.22,"triangle",.11);tone(f*2,.1,.16,"sine",.05);break}
case"slip":sweep(700,110,0,.75,"sawtooth",.09);noise(0,.6,900,.7,.12,"lowpass");tone(80,.75,.22,"sine",.22);noise(.75,.14,350,1,.16);break;
case"bump":tone(130,0,.16,"square",.09);tone(95,.12,.2,"square",.09);break;
case"run":for(let i=0;i<5;i++)noise(i*.1,.05,1400,2,.07);break;
case"summit":[523,659,784,1047].forEach((f,i)=>tone(f,i*.12,i==3?.6:.18,"triangle",.14));noise(.4,.8,3000,.5,.04,"highpass");break;
case"flag":tone(110,0,.18,"sine",.22);noise(.12,.55,2600,.6,.07,"highpass");tone(880,.1,.1,"square",.05);break;
case"kiss":sweep(480,1150,0,.12,"sine",.12);tone(1500,.14,.07,"sine",.1);[1568,2093,2637].forEach((f,i)=>tone(f,.3+i*.14,.3,"sine",.07));break;
case"fanfare":[[523,659,784],[587,740,880],[659,784,1047]].forEach((c,i)=>c.forEach(f=>tone(f,i*.22,i==2?.9:.2,"sawtooth",.045)));break;
case"clop":noise(0,.05,720,3,.14);tone(170,0,.05,"sine",.12);noise(.14,.05,600,3,.1);tone(150,.14,.05,"sine",.09);break;
case"gust":noise(0,1.8,480,.6,.045,"lowpass");break;
case"flip":noise(0,.09,3500,.8,.09,"highpass");tone(900,.02,.05,"triangle",.05);tone(1300,.07,.05,"triangle",.04);break;
case"slide":if((n||1)>0)sweep(500,900,0,.14,"sine",.05);else sweep(900,500,0,.14,"sine",.05);noise(0,.16,2200,.7,.07);break;
case"shuffle":for(let i=0;i<7;i++)noise(i*.045,.04,3000,1.2,.07);break;
case"tick":tone(1000,0,.04,"square",.04);break;
case"pop":tone(740,0,.07,"sine",.1);tone(990,.04,.08,"sine",.08);break;
case"listen":tone(784,0,.12,"sine",.08);tone(1175,.1,.18,"sine",.08);break;
case"done":[523,659,784,1047].forEach((f,i)=>tone(f,i*.11,i==3?.5:.16,"triangle",.12));break;
case"send":sweep(400,1200,0,.25,"sawtooth",.06);tone(1568,.22,.12,"sine",.08);break;
case"end":[784,659,523].forEach((f,i)=>tone(f,i*.16,.4,"triangle",.1));tone(1047,.55,.7,"triangle",.1);break}}
function fx(ok,el){sfx(ok);if(!root)return;const r=(el&&el.getBoundingClientRect&&el.getBoundingClientRect())||{left:innerWidth/2,top:innerHeight/2,width:0,height:0};
 const cx=r.left+r.width/2,cy=r.top+r.height/2,L=document.createElement("div");L.className="fxl";
 if(ok){const E=["⭐","✨","💖","🎉","🌟"];for(let i=0;i<14;i++){const p=document.createElement("i"),a=Math.PI*2*i/14,d=50+Math.random()*50;p.textContent=E[i%5];p.style.cssText=`left:${cx}px;top:${cy}px;--x:${Math.cos(a)*d}px;--y:${Math.sin(a)*d-20}px`;L.appendChild(p)}
  const b=document.createElement("b");b.textContent=["Tuyệt vời!","Chính xác!","Giỏi lắm!","Đúng rồi!"][Math.random()*4|0];b.style.cssText=`left:${cx}px;top:${Math.max(40,r.top-8)}px`;L.appendChild(b);if(el&&el.classList)el.classList.add("pulse")}
 else{const b=document.createElement("b");b.className="bd";b.textContent=["Chưa đúng 😢","Tiếc quá!","Thử lại nhé!"][Math.random()*3|0];b.style.cssText=`left:${cx}px;top:${Math.max(40,r.top-8)}px`;L.appendChild(b);const v=document.createElement("u");L.appendChild(v);if(el&&el.classList)el.classList.add("shk");const c=el&&el.closest&&el.closest(".card");if(c){c.classList.add("shk");setTimeout(()=>c.classList.remove("shk"),500)}}
 root.appendChild(L);setTimeout(()=>{L.remove();if(el&&el.classList)el.classList.remove("pulse","shk")},1300)}
function sndBtn(){if(!root||root.querySelector("#snd"))return;const b=document.createElement("button");b.id="snd";b.textContent="🔊";b.title="Bật/tắt âm thanh";b.onclick=()=>{SND=!SND;b.textContent=SND?"🔊":"🔇";if(SND)sfx(true)};root.appendChild(b)}
