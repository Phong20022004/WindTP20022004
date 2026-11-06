/*@file js/lessons/seoul1a-bai1/09-friend-duel.js
 * Thách đấu bạn bè: sảnh, chơi nhóm/đơn, kết quả.
 */
function duelLobby(){
 const wd=WT();if(cur!=="duel")return;duelView="lobby";clearInterval(qt);
 if(!wd){app.innerHTML=`<div class="card"><div class="vi">Không kết nối được hệ thống bạn bè</div></div>`;return}
 if(!wd.premium()){app.innerHTML=`<div class="card"><div class="ko">👑</div><div class="vi">Thách đấu bạn bè là tính năng Premium</div><div class="rom" style="line-height:1.7;margin-top:10px">⚔️ Mời bạn bè online, họ có thể chấp nhận hoặc từ chối<br>📝 Hai người thi cùng một đề<br>🏆 Tính điểm: đúng +100, thưởng tốc độ tối đa +50, chuỗi đúng liên tiếp +10/câu (tối đa +50)</div><div class="row"><button class="btn pri" id="bp">Mở Premium qua khóa học</button></div><div class="mut" style="margin-top:8px">Số dư: ${Math.round(wd.balance()).toLocaleString("en-US")} Xu</div></div>`;
  $("#bp").onclick=()=>{if(wd.buyPremium())duelLobby()};return}
 const L=wd.ch.list(),nm=id=>(wd.friend(id)||{name:"?"}).name;
 const inc=L.filter(c=>c.dir=="in"&&c.status=="pending"),ready=L.filter(c=>c.status=="accepted"&&!c.gid),wait=L.filter(c=>c.dir=="out"&&c.status=="pending"&&!c.gid);
 const gm={};L.filter(c=>c.gid&&c.dir=="out"&&(c.status=="pending"||c.status=="accepted")).forEach(c=>(gm[c.gid]=gm[c.gid]||[]).push(c));
 const groups=Object.keys(gm).map(g=>({gid:g,list:gm[g],n:gm[g][0].n}));
 const hist=L.filter(c=>["done","declined","expired"].includes(c.status)).slice(0,8);
 const fr=wd.friends().sort((a,b)=>b.online-a.online);
 duelSels=duelSels.filter(id=>fr.some(f=>f.id==id&&f.online));
 if(duelAllReq){duelSels=fr.filter(f=>f.online).map(f=>f.id);duelAllReq=false}
 const row=h=>`<div class="drow">${h}</div>`,medal=r=>r==1?"🥇":r==2?"🥈":r==3?"🥉":"#"+r,stt=c=>c.status=="accepted"?"✅ Đã đồng ý":c.status=="declined"?"❌ Từ chối":c.status=="expired"?"⌛ Bỏ lỡ":"⏳ Đang chờ";
 const nSel=duelSels.length;
 const hsPlay=!hsAnimated;hsAnimated=true;
 app.innerHTML=`<div class="card" style="text-align:left">${hsBanner(hsPlay)}<div class="mut">👑 Premium ${wd.premiumLabel()} · ${META?META.label:"Bài 1 Seoul Korean"} · ${W.length} từ vựng</div>
 ${inc.length?`<h4 class="dh">Lời mời đến</h4>`+inc.map(c=>row(`<span><b>${nm(c.fid)}</b> thách đấu · ${c.n} câu</span><span><button class="btn pri" data-a="ac" data-id="${c.id}">Chấp nhận</button> <button class="btn" data-a="dc" data-id="${c.id}">Từ chối</button> <button class="btn" data-a="rm" data-id="${c.id}" aria-label="Xóa thông báo">🗑</button></span>`)).join(""):""}
 ${ready.length?`<h4 class="dh">Sẵn sàng thi</h4>`+ready.map(c=>row(`<span>✅ <b>${nm(c.fid)}</b> đã đồng ý · ${c.n} câu</span><span><button class="btn pri" data-a="pl" data-id="${c.id}">Vào thi</button> <button class="btn" data-a="rm" data-id="${c.id}" aria-label="Xóa thông báo">🗑</button></span>`)).join(""):""}
 ${groups.map(g=>{const acc=g.list.filter(c=>c.status=="accepted").length,pen=g.list.filter(c=>c.status=="pending").length;return `<h4 class="dh">🏁 Phòng thách đấu nhóm · ${g.n} câu</h4><div class="drow"><span>${g.list.map(c=>`<div><b>${nm(c.fid)}</b> <small>${stt(c)}</small></div>`).join("")}</span><span><button class="btn pri" data-a="gp" data-id="${g.gid}" ${acc?"":"disabled"}>${pen?`Vào thi ngay (${acc} bạn đã sẵn sàng)`:`Vào thi (${acc} bạn)`}</button></span></div>`}).join("")}
 ${wait.length?`<h4 class="dh">Đang chờ trả lời</h4>`+wait.map(c=>row(`<span>⏳ Đang chờ <b>${nm(c.fid)}</b> phản hồi…</span>`)).join(""):""}
 <h4 class="dh">Gửi thách đấu mới</h4>
 <div class="mut">Số câu hỏi</div>
 <div class="row" style="justify-content:flex-start;margin:6px 0">${[10,15,20,W.length].map(n=>`<button class="btn ${duelN==n?"pri":""}" data-a="n" data-n="${n}">${n==W.length?"Tất cả "+n:n} câu</button>`).join("")}</div>
 <div class="row" style="justify-content:space-between;margin:10px 0 2px"><span class="mut">Chọn một hoặc nhiều bạn đang online · <b>${nSel}</b> đã chọn</span><span><button class="btn" data-a="all">Chọn tất cả online</button> <button class="btn" data-a="none" ${nSel?"":"disabled"}>Bỏ chọn</button></span></div>
 ${fr.map(f=>row(`<span><i class="dot ${f.online?"on":""}"></i> <b>${f.name}</b> <small>${f.online?"Online":"Offline"} · ${f.rank}${f.record?` · ${f.record.w}T-${f.record.l}B-${f.record.d}H`:""}</small></span><span><button class="btn" data-a="pk" data-id="${f.id}">👉 Chọc</button> <button class="btn ${f.online&&duelSels.includes(f.id)?"pri":""}" ${f.online?"":"disabled"} data-a="sel" data-id="${f.id}">${f.online?(duelSels.includes(f.id)?"✓ Đã chọn":"Chọn"):"Offline"}</button></span>`)).join("")}
 <div style="position:sticky;bottom:6px;z-index:3;margin-top:12px;padding:10px;border-radius:14px;background:var(--card);border:1px solid var(--bd);box-shadow:0 6px 20px rgba(0,0,0,.18);backdrop-filter:blur(8px)"><button class="btn pri" id="dsend" style="width:100%;padding:12px;font-size:15px;font-weight:800" ${nSel?"":"disabled"}>${nSel?`⚔️ Gửi thách đấu (${nSel} bạn · ${duelN} câu)`:"⚔️ Chọn bạn để gửi thách đấu"}</button></div>
 ${hist.length?`<h4 class="dh">Gần đây</h4>`+hist.map(c=>row(c.status=="done"?`<span>${c.grp?`${medal(c.grp.rank)} Hạng ${c.grp.rank}/${c.grp.size} · `:(c.my.score>c.their.score?"✅ Thắng ":c.my.score<c.their.score?"❌ Thua ":"🤝 Hòa ")}<b>${nm(c.fid)}</b> · ${c.my.score} - ${c.their.score}</span>`:`<span>${c.status=="declined"?"🚫 Bị từ chối / đã từ chối":"⌛ Hết hạn"} · <b>${nm(c.fid)}</b></span>`)).join(""):""}
 </div>`;
 root.querySelectorAll("[data-a]").forEach(b=>b.onclick=()=>{const a=b.dataset.a,id=b.dataset.id;
  if(a=="ac"){wd.ch.respond(id,true);snd("tick")}else if(a=="dc"){wd.ch.respond(id,false)}else if(a=="rm"){wd.ch.remove(id)}else if(a=="pl")duelPlay(id);else if(a=="gp")duelPlayGroup(id);
  else if(a=="n"){duelN=+b.dataset.n;snd("tick");duelLobby()}
  else if(a=="pk"){if(wd.poke(id)&&wd.pokeFx)wd.pokeFx(b)}
  else if(a=="sel"){duelSels=duelSels.includes(id)?duelSels.filter(x=>x!=id):[...duelSels,id];snd("pop");duelLobby()}
  else if(a=="all"){duelSels=fr.filter(f=>f.online).map(f=>f.id);snd("pop");duelLobby()}
  else if(a=="none"){duelSels=[];snd("tick");duelLobby()}});
 const sd=$("#dsend");if(sd)sd.onclick=()=>{const made=duelSels.length==1?[wd.ch.create(duelSels[0],duelN)].filter(Boolean):wd.ch.createGroup(duelSels.slice(),duelN);if(made.length){snd("send");wd.toast(`⚔️ Đã gửi lời thách đấu đến ${made.length} bạn, chờ phản hồi…`);duelSels=[];duelLobby()}};
}
function duelPlayGroup(gid){
 hsAnimated=false;
 const wd=WT(),mem=wd.ch.list().filter(c=>c.gid==gid&&c.status=="accepted");if(!mem.length){duelLobby();return}
 duelView="play";stopAll();const c0=mem[0],ex=genExam(c0.seed,c0.n);let i=0,score=0,correct=0,streak=0,ms=0;const kinds=ex.map(e=>e.kind),names=mem.map(c=>(wd.friend(c.fid)||{name:"?"}).name).join(", ");
 const r=()=>{if(i>=ex.length){const res=wd.ch.finishGroup(gid,{score,correct,total:ex.length,ms},kinds);return res?duelGroupResult(res):duelLobby()}
  const e=ex[i],lim=e.kind=="type"?wd.ch.limits.type:wd.ch.limits.choice;
  app.innerHTML=`<div class="mut">⚔️ vs ${mem.length} bạn (${names}) · Câu ${i+1}/${ex.length} · Điểm <b>${score}</b> · Chuỗi ${streak}</div><div class="bar"><i style="width:${i/ex.length*100}%"></i></div><div id="bx"></div>`;
  runQ($("#bx"),e.kind,e.w,(res,t)=>{const ok=res===true,tt=res===null?lim:t,pts=wd.ch.scoreQ(ok,tt,lim,streak);score+=pts;streak=ok?streak+1:0;if(ok)correct++;ms+=tt*1000;i++;r()},{ops:e.ops,limit:lim,strict:true,noSkip:true})};
 r()}
function duelGroupResult(res){
 duelView="result";const bd=res.board,top=bd.slice(0,3),rest=bd.slice(3),mine=bd.find(p=>p.me);
 const med=["🥇","🥈","🥉"],col=["#f5c518","#c0c7d1","#cd7f32"],hgt=[150,115,90];
 const pod=[1,0,2].filter(i=>top[i]).map(i=>{const p=top[i];return `<div class="pcol"><div class="pav">${med[i]}</div><div class="pnm${p.me?" me":""}">${p.me?"Bạn":p.name}</div><div class="psc">${p.score}đ · ${p.correct}/${p.total}</div><div class="pbar" style="height:${hgt[i]}px;background:linear-gradient(180deg,${col[i]},${col[i]}aa)">${i+1}</div></div>`}).join("");
 const rows=rest.map(p=>`<div class="drow${p.me?" meRow":""}"><span><b style="display:inline-block;min-width:28px">${p.rank}.</b> ${p.me?"Bạn":p.name} <small>${p.correct}/${p.total} đúng · ${fmtT(p.ms)}</small></span><b>${p.score}đ</b></div>`).join("");
 app.innerHTML=`<style>.podium{display:flex;align-items:flex-end;justify-content:center;gap:10px;margin:18px 0 6px}.pcol{display:flex;flex-direction:column;align-items:center;width:30%;max-width:130px}.pav{font-size:36px}.pnm{font-weight:800;font-size:13px;max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.pnm.me{color:var(--pri)}.psc{font-size:11px;color:var(--mut);margin-bottom:4px}.pbar{width:100%;border-radius:10px 10px 0 0;display:flex;align-items:flex-start;justify-content:center;padding-top:8px;font-size:24px;font-weight:900;color:#fff;text-shadow:0 1px 3px rgba(0,0,0,.4);transform-origin:bottom;animation:prise .8s cubic-bezier(.2,.8,.2,1) both}@keyframes prise{from{transform:scaleY(.05)}to{transform:scaleY(1)}}.drow.meRow{background:rgba(56,189,248,.16);border-radius:8px;padding-left:6px;padding-right:6px}</style>
 <div class="card"><div class="ko">${mine.rank<=3?med[mine.rank-1]:"🏁"}</div><div class="vi">${mine.rank==1?"Bạn vô địch!":mine.rank<=3?`Bạn đứng hạng ${mine.rank}!`:`Bạn đứng hạng ${mine.rank}/${res.size}`}</div><div class="rom">${res.size} người cùng thi một đề ${res.n} câu · Xếp theo điểm, bằng điểm thì ai nhanh hơn</div>
 <div class="podium">${pod}</div><div style="text-align:left;margin-top:8px">${rows}</div><div class="row"><button class="btn pri" id="bk">Về sảnh thách đấu</button></div></div>`;
 $("#bk").onclick=duelLobby;snd(mine.rank<=3?"fanfare":"done");if(mine.rank<=3)snd("summit")}
function duelPlay(id){
 hsAnimated=false;
 const wd=WT(),ch=wd.ch.get(id);if(!ch||ch.status!="accepted"){duelLobby();return}
 duelView="play";stopAll();const ex=genExam(ch.seed,ch.n),f=wd.friend(ch.fid)||{name:"Bạn bè"};let i=0,score=0,correct=0,streak=0,ms=0;const kinds=ex.map(e=>e.kind);
 const r=()=>{if(i>=ex.length){const res=wd.ch.finish(id,{score,correct,total:ex.length,ms},kinds);return duelResult(res)}
  const e=ex[i],lim=e.kind=="type"?wd.ch.limits.type:wd.ch.limits.choice;
  app.innerHTML=`<div class="mut">⚔️ vs ${f.name} · Câu ${i+1}/${ex.length} · Điểm <b>${score}</b> · Chuỗi ${streak}</div><div class="bar"><i style="width:${i/ex.length*100}%"></i></div><div id="bx"></div>`;
  runQ($("#bx"),e.kind,e.w,(res,t)=>{const ok=res===true,tt=res===null?lim:t,pts=wd.ch.scoreQ(ok,tt,lim,streak);score+=pts;streak=ok?streak+1:0;if(ok)correct++;ms+=tt*1000;i++;r()},{ops:e.ops,limit:lim,strict:true,noSkip:true})};
 r()}
function duelResult(ch){
 const wd=WT(),f=wd.friend(ch.fid)||{name:"Bạn bè"},a=ch.my,b=ch.their,w=a.score>b.score,d=a.score==b.score;duelView="result";
 app.innerHTML=`<div class="card"><div class="ko">${w?"🏆":d?"🤝":"💔"}</div><div class="vi">${w?"Bạn thắng!":d?"Hòa nhau!":`${f.name} thắng`}</div>
 <div class="vs"><div><div class="mut">Bạn</div><div class="big">${a.score}</div><div class="rom">${a.correct}/${a.total} đúng · ${fmtT(a.ms)}</div></div><div class="vsx">VS</div><div><div class="mut">${f.name}</div><div class="big">${b.score}</div><div class="rom">${b.correct}/${b.total} đúng · ${fmtT(b.ms)}</div></div></div>
 <div class="rom">Cả hai thi cùng một đề ${a.total} câu · đúng +100, nhanh tối đa +50, chuỗi đúng +10/câu</div><div class="row"><button class="btn pri" id="bk">Về sảnh thách đấu</button></div></div>`;
 $("#bk").onclick=duelLobby}
