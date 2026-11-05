/*@file js/lessons/seoul1a-bai1/06-question-engine.js
 * Bộ câu hỏi (recog/mc/type/fill/listen) và phiên luyện tập.
 */
/* một câu hỏi: recog | mc | type | fill | listen */
function runQ(box,kind,w,cb,o={}){
 const t0=performance.now(),el=()=>(performance.now()-t0)/1000;let fin=false;
 const end=(res,delay,fe)=>{if(fin)return;fin=true;if(res!==null&&res!==undefined)fx(res,fe||$("#bx")||box);clearInterval(qt);const t=Math.min(el(),o.limit||999);later(()=>cb(res,t),delay||0)};
 const skip=o.noSkip?"":`<button class="btn" id="sk">Khó quá bỏ qua</button>`,sk=()=>{const b=$("#sk");if(b)b.onclick=()=>end(null,0)};
 const tmr=o.limit?`<div class="tm"><i id="tmi"></i></div>`:"";
 const watch=expire=>{if(!o.limit)return;clearInterval(qt);qt=setInterval(()=>{const e=el(),i=$("#tmi");if(i)i.style.width=Math.max(0,100-e/o.limit*100)+"%";if(e>=o.limit&&!fin){clearInterval(qt);expire()}},100)};
 if(kind=="recog"){box.innerHTML=`<div class="card"><div class="mut">Nhận diện</div><div class="ko">${w[0]}</div><div class="rom">${w[1]}</div><div class="vi" id="rv" style="margin-top:12px"></div><div class="row" id="rb"><button class="btn pri" id="sh">Hiện nghĩa</button></div></div>`;
  $("#sh").onclick=()=>{$("#rv").textContent=w[2];$("#rb").innerHTML=`<button class="btn" id="n0">Chưa nhớ</button><button class="btn pri" id="n1">Đã nhớ</button>`;$("#n0").onclick=()=>{fx(false,$("#n0"));cb(false)};$("#n1").onclick=()=>{fx(true,$("#n1"));cb(true)}}}
 else if(kind=="type"){let bad=false;
  box.innerHTML=`<div class="card">${tmr}<div class="mut">Gõ từ tiếng Hàn</div><div class="vi">${w[2]}</div><div class="rom">${w[1]}</div><input type="text" id="in" autocomplete="off" placeholder="Gõ tiếng Hàn…"><div class="msg" id="m"></div>${kbHTML()}<div class="row"><button class="btn pri" id="ck">Kiểm tra</button>${skip}</div></div>`;
  const inp=$("#in");kbBind(inp);sk();
  const ck=()=>{if(fin)return;if(inp.value.replace(/\s/g,"")==w[0].replace(/\s/g,"")){$("#m").style.color="var(--ok)";$("#m").textContent="✔ Chính xác!";speak(w[0]);end(!bad,800)}else{bad=true;$("#m").style.color="var(--bad)";if(o.strict){$("#m").textContent="✘ Đáp án: "+w[0];speak(w[0]);end(false,1400)}else{$("#m").textContent="✘ Chưa đúng, thử lại";fx(false,inp)}}};
  $("#ck").onclick=ck;inp.onkeydown=e=>{if(e.key=="Enter")ck()};
  watch(()=>{$("#m").style.color="var(--bad)";$("#m").textContent="⏰ Hết giờ! Đáp án: "+w[0];end(false,1200)})}
 else{const fill=kind=="fill",lis=kind=="listen",s=fill&&S.find(x=>x[0]==w[0]),ops=o.ops||(fill?opts(w,SW):opts(w)),tx=x=>fill||lis?x[0]:x[2],say=fill?s[1].replace(/[{}]/g,""):w[0];
  box.innerHTML=`<div class="card">${tmr}<div class="mut">${fill?"Điền từ vào chỗ trống":lis?"Luyện nghe: chọn từ đúng":"Chọn nghĩa đúng"}</div>${fill?`<div class="vi">${s[1].replace(/\{.*?\}/,"____")}</div><div class="rom">${s[2]}</div>`:lis?`<div class="vi">🎧 Nghe và chọn từ bạn nghe được</div>`:`<div class="ko">${w[0]}</div><div class="rom">${w[1]}</div>`}<div class="row"><button class="btn" id="hn">🔊 Nghe gợi ý</button>${skip}</div><div class="opts">${ops.map((x,k)=>`<button class="opt" data-k="${k}">${tx(x)}</button>`).join("")}</div></div>`;
  $("#hn").onclick=()=>speak(say);if(lis)speak(say);sk();
  const lock=()=>root.querySelectorAll(".opt").forEach(x=>{if(ops[x.dataset.k]===w)x.classList.add("ok");x.onclick=null});
  root.querySelectorAll(".opt").forEach(b=>b.onclick=()=>{if(fin)return;const ok=ops[b.dataset.k]===w;b.classList.add(ok?"ok":"bad");lock();const k=$("#sk");if(k)k.onclick=null;end(ok,ok?700:1200,b)});
  watch(()=>{lock();end(false,1000)})}}
function session(items,title){let i=0,done=0,ok=0;const pc=()=>done?Math.round(ok/done*100):0;
 const r=()=>{if(i>=items.length){app.innerHTML=`<div class="card"><div class="vi">🎉 Hoàn thành ${title}</div><div class="rom">Đúng ${ok}/${done} câu (${pc()}%)${done<items.length?` · bỏ qua ${items.length-done}`:""} · đủ ${items.length}/${W.length} từ vựng</div><div class="row"><button class="btn pri" onclick="__s1aGo()">Làm lại</button></div></div>`;return}
  app.innerHTML=`<div class="mut">${title} · Câu ${i+1}/${items.length} · Đúng ${ok}/${done} · Tỷ lệ ${pc()}%</div><div class="bar"><i style="width:${i/items.length*100}%"></i></div><div id="bx"></div>`;
  runQ($("#bx"),items[i][0],items[i][1],res=>{if(res!==null){done++;if(res)ok++}i++;r()})};r()}
