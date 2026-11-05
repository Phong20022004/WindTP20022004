/*@file js/lessons/seoul1a-bai1/10-modes-flash-quiz-listen-match.js
 * ⚠ Mở object `modes` (đóng ở 11-mode-everest.js): flashcard, trắc nghiệm, gõ, đọc hiểu, luyện nghe, ghép cặp, thách đấu.
 */
const modes={
flash(){let d=shuf(W),i=0,show=false,aud=true,dir=0,auto=false,sec=3;
 let last="";const tick=()=>{clearInterval(timer);if(auto)timer=setInterval(()=>{if(!show){show=true;snd("flip")}else{show=false;i=(i+1)%d.length;snd("slide",1)}r()},sec*1000)};
 const K=w=>`<div class="ko">${w[0]}</div><div class="rom">${w[1]}</div>`,V=w=>`<div class="vi">${w[2]}</div>`;
 const r=()=>{const w=d[i];app.innerHTML=`<div class="mut" style="text-align:center">${i+1} / ${d.length} từ · chạm thẻ để lật</div><div class="bar"><i style="width:${(i+1)/d.length*100}%"></i></div><div class="card fc" id="c">${(dir?!show:show)?V(w):K(w)}</div>
 <div class="row"><button class="btn" id="p">←</button><button class="btn pri" id="n">→</button><button class="btn" id="sh">🔀 Xáo</button></div>
 <div class="row"><button class="btn" id="d">${dir?"VI → KO":"KO → VI"}</button><button class="btn" id="a">${aud?"🔊 Audio: Bật":"🔇 Audio: Tắt"}</button><button class="btn ${auto?"pri":""}" id="au">${auto?"⏸ Dừng tự phát":"▶ Tự động phát"}</button><select id="t">${[2,3,5,8].map(x=>`<option ${x==sec?"selected":""} value="${x}">${x}s lật</option>`).join("")}</select></div>`;
  const key=i+"|"+show+"|"+dir;if(aud&&(dir?show:!show)&&key!==last)speak(w[0]);last=key;
  $("#c").onclick=()=>{show=!show;snd("flip");r()};$("#n").onclick=()=>{i=(i+1)%d.length;show=false;snd("slide",1);r()};$("#p").onclick=()=>{i=(i-1+d.length)%d.length;show=false;snd("slide",-1);r()};
  $("#sh").onclick=()=>{d=shuf(W);i=0;show=false;snd("shuffle");r()};$("#d").onclick=()=>{dir^=1;show=false;snd("flip");r()};$("#a").onclick=()=>{aud=!aud;snd("tick");r()};
  $("#au").onclick=()=>{auto=!auto;snd("tick");tick();r()};$("#t").onchange=e=>{sec=+e.target.value;tick()}};r()},
quiz(){session(shuf(W).map(w=>["mc",w]),"Trắc nghiệm")},
type(){session(shuf(W).map(w=>["type",w]),"Gõ từ vựng")},
read(){session(shuf(SW).map(w=>["fill",w]),"Đọc hiểu")},
listen(){let lvl="easy",ord=shuf(S),i=0,got=0;
 const r=()=>{if(i>=ord.length){snd("done");app.innerHTML=`<div class="card"><div class="vi">🎉 Hoàn thành Luyện nghe</div><div class="rom">Đúng ngay lần đầu ${got}/${ord.length} câu · đủ ${ord.length}/${W.length} từ vựng</div><div class="row"><button class="btn pri" onclick="__s1aGo()">Làm lại</button></div></div>`;return}
  const s=ord[i],ko=s[1].replace(/[{}]/g,""),T=ko.split(" "),clean=x=>x.replace(/[\s.,?!]/g,"");let first=true;
  app.innerHTML=`<div class="mut">Luyện nghe câu · Câu ${i+1}/${ord.length} · Đúng lần đầu ${got}</div><div class="bar"><i style="width:${i/ord.length*100}%"></i></div><div class="row" style="margin:0 0 10px"><button class="btn ${lvl=="easy"?"pri":""}" id="e">Dễ · Ghép</button><button class="btn ${lvl=="hard"?"pri":""}" id="h">Khó · Gõ</button></div><div class="card"><div class="row"><button class="btn pri" id="sp">🔊 Nghe câu</button></div><div class="rom">Nghĩa: ${s[2]}</div><div id="z"></div><div class="msg" id="m"></div><div class="row"><button class="btn pri" id="ck">Kiểm tra</button><button class="btn" id="nx">Câu khác</button></div></div>`;
  $("#sp").onclick=()=>{snd("listen");speak(ko)};snd("listen");speak(ko);$("#e").onclick=()=>{lvl="easy";snd("tick");r()};$("#h").onclick=()=>{lvl="hard";snd("tick");r()};$("#nx").onclick=()=>{i++;snd("slide",1);r()};
  const ok=()=>{sfx(true);if(first)got++;$("#m").style.color="var(--ok)";$("#m").textContent="✔ Chính xác!";later(()=>{i++;r()},1300)},no=()=>{sfx(false);first=false;$("#m").style.color="var(--bad)";$("#m").textContent="✘ Chưa đúng, thử lại"};
  if(lvl=="easy"){let pick=[];const pool=shuf(T.map((_,k)=>k));
   const d=()=>{$("#z").innerHTML=`<div class="ans tiles" id="an">${pick.map(k=>`<button class="tile" data-k="${k}">${T[k]}</button>`).join("")}</div><div class="tiles">${pool.filter(k=>!pick.includes(k)).map(k=>`<button class="tile" data-k="${k}">${T[k]}</button>`).join("")}</div>`;
    root.querySelectorAll("#z .tile").forEach(b=>b.onclick=()=>{snd("pop");const k=+b.dataset.k;pick=pick.includes(k)?pick.filter(x=>x!=k):[...pick,k];d()})};d();
   $("#ck").onclick=()=>clean(pick.map(k=>T[k]).join(""))==clean(ko)?ok():no()}
  else{$("#z").innerHTML=`<input type="text" id="in" autocomplete="off" placeholder="Nghe và gõ lại câu…">${kbHTML()}`;const inp=$("#in");kbBind(inp);inp.onkeydown=e=>{if(e.key=="Enter")$("#ck").click()};
   $("#ck").onclick=()=>clean(inp.value)==clean(ko)?ok():no()}};r()},
match(){const set=shuf(W).slice(0,10);let tiles=shuf(set.flatMap(w=>[{w,t:w[0],s:"k"},{w,t:w[2],s:"v"}])),a=null,left=10,miss=0;
 const info=()=>$("#mi").textContent=`Ghép từ tiếng Hàn với nghĩa tiếng Việt · Còn ${left} cặp · Sai ${miss} lần`;
 app.innerHTML=`<div class="mut" id="mi"></div><div class="g20">${tiles.map((x,k)=>`<button class="mt" data-k="${k}">${x.t}</button>`).join("")}</div>`;info();
 const bs=root.querySelectorAll(".mt");
 bs.forEach(b=>b.onclick=()=>{const k=+b.dataset.k,x=tiles[k];if(b.classList.contains("done")||b.classList.contains("bad"))return;
  if(x.s=="k")speak(x.t);
  if(a==null){a=k;b.classList.add("sel");return}
  if(a==k){b.classList.remove("sel");a=null;return}
  if(tiles[a].s==x.s){bs[a].classList.remove("sel");a=k;b.classList.add("sel");return}
  const p=bs[a],y=tiles[a];a=null;
  if(y.w===x.w){fx(true,b);p.classList.remove("sel");p.classList.add("done");b.classList.add("done");left--;info();
   if(!left)later(()=>{app.innerHTML=`<div class="card"><div class="ko">🎉</div><div class="vi">Hoàn thành! Sai ${miss} lần</div><div class="row"><button class="btn pri" onclick="__s1aGo()">Chơi lại</button></div></div>`},600)}
  else{fx(false,b);miss++;info();p.classList.add("bad");b.classList.add("bad");later(()=>{p.classList.remove("sel","bad");b.classList.remove("bad")},500)}})},
duel(){const o=duelOpts;duelOpts=null;if(o&&o.duelFriend&&WT()&&WT().premium())duelSels=[o.duelFriend];if(o&&o.duelAll)duelAllReq=true;if(o&&o.duelGroup){duelPlayGroup(o.duelGroup);return}if(o&&o.duel){duelPlay(o.duel);return}duelLobby()},
