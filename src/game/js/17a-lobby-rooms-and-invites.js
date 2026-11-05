/*@file game/js/17a-lobby-rooms-and-invites.js
 * ⚠ Mở IIFE patch v28 (đóng ở 17d): sảnh chọn bàn, mời bạn, tạo bàn.
 */
(function(){
const ST=[100000,50000,20000,10000,5000,2000,1000,500,200,100],
GM={tl:{p:'TL',s:[2,3,4],b:ST},phom:{p:'PH',s:[2,3,4],b:ST},'3c':{p:'BC',s:[2,3,4,5,6,7,8],b:ST},lieng:{p:'LG',s:[2,3,4,5,6,7,8],b:ST},pk:{p:'PK',s:[2,3,4,5,6,7,8],b:ST},cv:{p:'CV',s:[2,2,2],b:ST},ct:{p:'CT',s:[2,2,2],b:ST}},
BG={tl:'linear-gradient(#2f9a5a,#0d3d27)',phom:'linear-gradient(#8a45c8,#2a1050)','3c':'linear-gradient(#3a78e0,#10265e)',lieng:'linear-gradient(#cf3a58,#4a0b1d)',cv:'linear-gradient(#5a7fae,#17283d)',ct:'linear-gradient(#c08a4a,#6a3a12)',pk:'linear-gradient(#22a08a,#073a34)'},
SC=['#e8341c','#2f6fd0','#2a8a4a','#8a3fc0','#e0a21c','#c2185b','#1fa3b8','#e66a1c'],
hs=s=>{let x=7;for(const c of s)x=(Math.imul(x,31)+c.charCodeAt(0))>>>0;return x},
nf=n=>n.toLocaleString('vi-VN'),
rl=document.createElement('div');rl.id='rl';rl.hidden=true;document.body.append(rl);
const tt=document.createElement('div');tt.className='rlt';tt.hidden=true;document.body.append(tt);
let tm=0,Q='',OK=false,GG='',SEL=0,MY=[];const SK='bbl_rooms_v1';
try{MY=(JSON.parse(localStorage.getItem(SK)||'[]')||[]).filter(r=>r&&GM[r.g]&&typeof r.id==='string'&&r.n>=2&&r.b>=100)}catch(e){MY=[]}
const sv=()=>{try{localStorage.setItem(SK,JSON.stringify(MY))}catch(e){}};
const toast=s=>{tt.textContent=s;tt.hidden=false;clearTimeout(tm);tm=setTimeout(()=>tt.hidden=true,2200)};
const rid=(g,n,b,k)=>{const h=hs(g+n+b+k);return GM[g].p+String(h%1000).padStart(3,'0')+'ABCDEFGHJKLMNPQRSTUVWXYZ'[(h>>>10)%24]};
const tier=b=>b>=2000?3:b>=500?2:1;
const TS=(g,id,n)=>window.BBL_TS?window.BBL_TS(g,id,n):'',
STX={live:'Đang diễn ra',prep:'Đang chuẩn bị'},
rmH=(st,o,n)=>st?`<span class="rm rst ${st}">${STX[st]}</span>`:`<span class="rm">${o}/${n} người</span>`;
function seats(n,o,key){let s='';for(let i=0;i<n;i++){const a=i*2*Math.PI/n,x=50+46*Math.sin(a),y=50-44*Math.cos(a),on=i<o,d=((hs(key+i)%16)/10).toFixed(1)+'s';
s+=`<i class="rs ${on?'o':'e'}${n>=6?' s':''}" style="left:${x.toFixed(1)}%;top:${y.toFixed(1)}%;--sc:${SC[i%8]};--d:-${d}">${on?'👤':'+'}</i>`}return s}
const hl=(id,q)=>{const i=q?id.indexOf(q):-1;return i<0?id:id.slice(0,i)+'<mark class="hl">'+q+'</mark>'+id.slice(i+q.length)};
function card(g,n,b,k,q){const id=rid(g,n,b,k),o=1+hs(id)%(n-1),need=b*10,lk=chips<need,st=TS(g,id,n);
return `<button class="rt t${tier(b)}${lk?' lk':''}" style="--g:${BG[g]}" data-g="${g}" data-n="${n}" data-b="${b}" data-need="${need}" data-st="${st}" aria-label="Bàn ${id}, ${n} người, cược ${nf(b)}${st?', '+STX[st].toLowerCase():''}${lk?', chưa đủ Chips':''}"><span class="rid">ID ${hl(id,q)}</span><div class="rtt"><div class="rf">${nf(b)}</div>${seats(n,o,id)}</div><span class="zb">${nf(b)} Chips</span>${rmH(st,o,n)}</button>`}
function mine(r,q){const lk=chips<r.b*10;return `<div class="rt own t${tier(r.b)}${lk?' lk':''}" role="button" tabindex="0" style="--g:${BG[r.g]}" data-g="${r.g}" data-n="${r.n}" data-b="${r.b}" data-need="${r.b*10}" data-id="${r.id}"><span class="rid">ID ${hl(r.id,q)}</span><div class="rtt"><div class="rf">${nf(r.b)}</div>${seats(r.n,1,r.id)}</div><span class="zb">${nf(r.b)} Chips</span><span class="rm">1/${r.n}</span><button class="rx" data-a="del" aria-label="Xóa bàn">✕</button><button class="rcp" data-a="inv" aria-label="Mời bạn bè">📤</button></div>`}
function match(id,b,q){return !q||id.includes(q)||(/^\d+$/.test(q)&&String(b)===q)}
function cols(g){const c=GM[g],q=Q.trim().toUpperCase(),SU=[...new Set(c.s)],SL=SU.length>1&&SEL?SEL:0,hq=/^\d+$/.test(q)?'':q,vis=b=>!OK||chips>=b*10;
const items=(n,cnt)=>{const a=[];c.b.forEach(b=>{for(let k=0;k<cnt;k++){const id=rid(g,n,b,k);if(match(id,b,q)&&vis(b))a.push(card(g,n,b,k,hq))}
MY.filter(r=>r.g===g&&r.n===n&&r.b===b).sort((x,y)=>x.t-y.t).forEach(r=>{if(match(r.id,r.b,q)&&vis(b))a.push(mine(r,hq))})});return a};
let cs,tot=0;
if(SU.length>1&&!SL)cs=SU.map(n=>({n,pick:1,l:items(n,2)}));
else{const n=SL||SU[0],l=items(n,6);cs=[0,1,2].map(i=>({n,pick:0,l:l.filter((x,j)=>j%3===i)}))}
const h=cs.filter(x=>x.l.length).map(x=>{tot+=x.l.length;return `<div class="rcol"><h3 style="--g:${BG[g]}"${x.pick?` class="pick" data-n="${x.n}"`:''}>${x.n} người${x.pick?' ›':''}</h3>${x.l.join('')}</div>`}).join('');
return{h:h||'<div class="rnone">Không tìm thấy bàn nào. Thử ID khác hoặc bỏ lọc.</div>',tot,q}}
function draw(g){const r=cols(g);rl.querySelectorAll('.rtab').forEach(x=>x.classList.toggle('on',+x.dataset.n===SEL));$('#rlc2').innerHTML=r.h;{const d=r.tot?null:decId(Q.trim().toUpperCase());if(d&&d.g===g){$('#rlc2').innerHTML=`<div class="rnone">Có bàn ID <b>${d.id}</b> · ${d.n} người · cược ${nf(d.b)} Chips.<br><button class="rjid" id="rjid">Xem bàn và vào</button></div>`;$('#rjid').onclick=()=>invIn(d)}}$('#rln').textContent=(r.q||OK)?'Tìm thấy '+r.tot+' bàn':(SEL&&GM[g].s.length>1?'Toàn bộ là bàn '+SEL+' người. ':'')+'Cược giảm dần từ trên xuống. Vào bàn cần ít nhất 10 lần tiền cược. Bàn "Đang diễn ra": bạn vào xem hết ván rồi mới được chơi. Bấm ＋ Tạo để tự tạo bàn.';
$('#rlx').hidden=!Q;rl.querySelectorAll('.rcol>h3.pick').forEach(h=>h.onclick=()=>{SEL=+h.dataset.n;draw(g);rl.scrollTop=0});
rl.querySelectorAll('.rt').forEach(t=>{const own=!!t.dataset.id;if(own)t.onkeydown=e=>{if(e.key==='Enter')t.onclick(e)};t.onclick=e=>{const a=e&&e.target&&e.target.dataset&&e.target.dataset.a;if(a){e.stopPropagation();if(a==='inv'){const r=MY.find(x=>x.id===t.dataset.id);if(r)inv(r)}else{MY=MY.filter(r=>r.id!==t.dataset.id);sv();draw(g);toast('Đã xóa bàn '+t.dataset.id)}return}const b=+t.dataset.b,n=+t.dataset.n,need=+t.dataset.need;
if(chips<need){toast('Cần '+nf(need)+' Chips để vào bàn cược '+nf(b)+'. Bấm ＋ cạnh số Chips để mua thêm.');return}let jn=n;if(!own){const idn=t.querySelector('.rid'),id=idn?idn.textContent.replace(/^\s*ID\s*/,'').trim():'';jn=1+hs(id)%(n-1)+1}join(g,jn,b)}})}
function refSt(){if(rl.hidden)return;rl.querySelectorAll('.rt:not(.own)').forEach(t=>{const idn=t.querySelector('.rid');if(!idn)return;const id=idn.textContent.replace(/^\s*ID\s*/,'').trim(),n=+t.dataset.n,st=TS(t.dataset.g,id,n);
if((t.dataset.st||'')===st)return;t.dataset.st=st;const o=1+hs(id)%(n-1),m=t.querySelector('.rm');if(m)m.outerHTML=rmH(st,o,n)})}
setInterval(()=>{if(!document.hidden)refSt()},3000);
function box(html,fn){const m=document.createElement('div');m.className='rmo';m.innerHTML='<div class="rmb">'+html+'</div>';document.body.append(m);m.onclick=e=>{if(e.target===m){m.remove();return}const a=e.target.dataset&&e.target.dataset.a;if(a)fn(a,m)};return m}
const PW=window.__WIND;
const escH=s=>String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const appUrl=()=>{try{const W=PW();if(W&&W.appUrl){const u=W.appUrl();if(u)return u}}catch(e){}try{const u=window.parent.location.href.split('#')[0];if(/^https?:|^file:/.test(u))return u}catch(e){}return ''};
const link=r=>appUrl()+'#room='+r.id+'&c='+r.g+'-'+r.n+'-'+r.b;
const msg=r=>'Mời bạn chơi '+G[r.g].n+' · bàn '+r.n+' người · cược '+nf(r.b)+' Chips · ID '+r.id;
const invText=r=>msg(r)+(appUrl()?'\n'+link(r):'');
async function copyTxt(t){try{if(navigator.clipboard&&navigator.clipboard.writeText){await navigator.clipboard.writeText(t);return true}}catch(e){}
try{const a=document.createElement('textarea');a.value=t;a.setAttribute('readonly','');a.style.cssText='position:fixed;left:0;top:0;width:1px;height:1px;opacity:0';document.body.append(a);a.focus();a.select();a.setSelectionRange(0,t.length);const ok=document.execCommand('copy');a.remove();if(ok)return true}catch(e){}
return false}
function cpt(t,m){copyTxt(t).then(ok=>{if(ok){toast(m);return}
const bx=box(`<h4>Sao chép thủ công</h4><div class="rms">Thiết bị đang chặn tự động sao chép. Hãy giữ vào ô dưới, chọn tất cả rồi sao chép.</div><textarea class="rtx" readonly rows="4">${escH(t)}</textarea><div class="rma"><button data-a="x">Đóng</button></div>`,(a,mm)=>mm.remove());const ta=bx.querySelector('textarea');if(ta){ta.focus();ta.select()}})}
function enter(r){if(chips<r.b*10){toast('Cần '+nf(r.b*10)+' Chips để vào bàn cược '+nf(r.b));return false}join(r.g,r.n,r.b);return true}
function shareOut(r){const t=invText(r);if(navigator.share){const o={title:'Mời chơi bài',text:msg(r)};const u=appUrl();if(u)o.url=link(r);navigator.share(o).catch(()=>{})}else cpt(t,'Đã sao chép lời mời, hãy dán gửi bạn bè')}
function frPfp(f){try{window.__pfpEnsure&&window.__pfpEnsure();const W=PW();if(W&&W.pfp)return W.pfp(f.name,f.avatarId||'default','r-'+f.realm,38,f.realm)}catch(e){}return '<span class="fa0">'+escH((f.name||'?').trim().split(/\s+/).pop().charAt(0))+'</span>'}
function invFr(r){const W=PW(),fr=W&&W.friends?W.friends().slice():[];
if(!fr.length){shareOut(r);return}
fr.sort((x,y)=>(y.online?1:0)-(x.online?1:0));
const info=G[r.g].n+' · '+r.n+' người · cược '+nf(r.b)+' Chips',m=document.createElement('div');m.className='rmo';document.body.append(m);
m.innerHTML=`<div class="rmb"><h4>Mời bạn bè WINDTP</h4><div class="rms">Bàn ${r.id} · ${info}</div><div class="frl">${fr.map(f=>`<div class="fr"><span class="fa">${frPfp(f)}</span><span class="fn"><b>${escH(f.name)}</b><small>${f.online?'<i class="on">● Đang online</i>':'○ Offline'} · ${escH(f.rank||'')}</small></span><button data-f="${escH(f.id)}">Mời</button></div>`).join('')}</div><div class="rma"><button class="sec" data-a="x">Đóng</button><button class="sec" data-a="o">Chia sẻ ngoài app</button></div><p class="rnote">Lời mời được gửi vào tin nhắn WINDTP của bạn bè kèm ID bàn${appUrl()?' và link vào bàn':''}.</p></div>`;
m.onclick=e=>{const t=e.target,d=t.dataset||{};if(t===m){m.remove();return}
if(d.f){let ok=false;try{ok=W.inviteFriend&&W.inviteFriend(d.f,invText(r),{id:r.id,g:r.g,n:r.n,b:r.b,name:G[r.g].n,url:appUrl()?link(r):''})}catch(x){}
if(ok){const x=fr.find(z=>z.id===d.f);t.textContent='Đã mời ✓';t.disabled=true;toast('Đã gửi lời mời cho '+(x?x.name:'bạn bè')+(x&&!x.online?' · bạn ấy sẽ thấy khi online':''))}else toast('Chưa gửi được lời mời, thử lại nhé');return}
if(d.a==='x')m.remove();else if(d.a==='o')shareOut(r)}}
function inv(r){const info=G[r.g].n+' · '+r.n+' người · cược '+nf(r.b)+' Chips',hl=!!appUrl();
box(`<h4>Mời bạn bè</h4><div class="rinv">${r.id}</div><div class="rms">${info}</div><div class="rma"><button data-a="s">👥 Mời bạn bè WINDTP</button></div><div class="rma">${hl?'<button class="sec" data-a="l">Sao chép link</button>':'<button class="sec" data-a="u">🔗 Đặt link app</button>'}<button class="sec" data-a="i">Sao chép ID</button></div><div class="rma"><button class="sec" data-a="t">Sao chép lời mời</button></div><div class="rma"><button class="sec" data-a="x">Đóng</button><button data-a="g">Vào bàn</button></div><p class="rnote">Bạn bè nhập ID ${r.id} vào ô "Tìm ID bàn"${hl?' hoặc mở link mời':''} để vào bàn cùng mức cược và số người. Game chưa có máy chủ nên chơi với máy trên thiết bị của họ.</p>`,(a,m)=>{
if(a==='x')m.remove();
else if(a==='i')cpt(r.id,'Đã sao chép ID '+r.id);
else if(a==='l')cpt(link(r),'Đã sao chép link vào bàn');
else if(a==='t')cpt(invText(r),'Đã sao chép lời mời, hãy dán gửi bạn bè');
else if(a==='u')askUrl(()=>{m.remove();inv(r)});
else if(a==='s')invFr(r);
else if(a==='g'){if(enter(r))m.remove()}})}
function askUrl(done){const W=PW();let cur='';try{cur=localStorage.getItem('windtp-app-url')||''}catch(e){}
const bx=box(`<h4>Link app WINDTP</h4><div class="rms">Dán địa chỉ trang WINDTP mà bạn bè mở được (bắt đầu bằng https://). Link mời sẽ dẫn thẳng vào bàn.</div><input class="rtx" id="aurl" style="min-height:0;height:38px" inputmode="url" autocomplete="off" placeholder="https://..." value="${escH(cur)}"><div class="rma"><button class="sec" data-a="x">Hủy</button><button data-a="s">Lưu link</button></div>`,(a,mm)=>{
if(a==='x'){mm.remove();return}
if(a==='s'){const v=($('#aurl')||{}).value||'';let ok=false;try{ok=W&&W.setAppUrl&&W.setAppUrl(v)}catch(e){}
if(ok){mm.remove();toast('Đã lưu link app');done&&done()}else toast('Link chưa hợp lệ. Hãy dán địa chỉ bắt đầu bằng https://')}})}
function invIn(r){const info=G[r.g].n+' · '+r.n+' người · cược '+nf(r.b)+' Chips';
box(`<h4>Lời mời của bạn bè</h4><div class="rinv">${r.id}</div><div class="rms">${info}</div><div class="rms">Cần ${nf(r.b*10)} Chips để vào bàn</div><div class="rma"><button class="sec" data-a="x">Bỏ qua</button><button class="sec" data-a="k">Lưu bàn</button><button data-a="g">Vào bàn</button></div><p class="rnote">Game chưa có máy chủ: bàn này chạy cùng mức cược và số người, bạn chơi với máy.</p>`,(a,m)=>{
if(a==='x')m.remove();
else if(a==='k'){if(!MY.some(x=>x.id===r.id)){if(MY.filter(x=>x.g===r.g).length>=5){toast('Mỗi game giữ tối đa 5 bàn. Hãy xóa bớt bàn cũ.');return}MY.push({g:r.g,id:r.id,n:r.n,b:r.b,t:Date.now()});sv()}m.remove();toast('Đã lưu vào Bàn của bạn')}
else if(a==='g'){if(enter(r))m.remove()}})}
function inc(h){if(typeof h!=='string'){const W=PW();h=(W&&W.pendingRoom?W.pendingRoom():'')||location.hash||''}
if(!/room=/.test(h))return;const p=new URLSearchParams(h.replace(/^#/,'')),id=(p.get('room')||'').toUpperCase().replace(/[^A-Z0-9]/g,'').slice(0,8),c=(p.get('c')||'').split('-'),g=c[0],n=+c[1],b=+c[2];
try{if(location.hash)history.replaceState(null,'',location.href.split('#')[0])}catch(e){}
if(!id||!GM[g]||!GM[g].s.includes(n)||!GM[g].b.includes(b)){toast('Link mời không hợp lệ');return}
invIn({id,g,n,b})}
window.__bblInvite=inc;
setTimeout(inc,500);addEventListener('hashchange',()=>inc());
function cp(id){cpt(id,'Đã sao chép ID '+id)}
/* ID bàn tự tạo mã hóa mức cược + số người để bạn bè nhập ID là vào được */
function decId(s){const m=/^([A-Z]{2})(\d)(\d)(\d)([A-Z])$/.exec(s||'');if(!m)return null;const g=Object.keys(GM).find(k=>GM[k].p===m[1]);if(!g)return null;const b=GM[g].b[+m[2]],n=+m[3];if(!b||!GM[g].s.includes(n))return null;return{id:s,g,n,b}}
function newId(g,n,b){const c=GM[g],used=new Set(MY.map(r=>r.id));c.s.forEach(n=>c.b.forEach(b=>[0,1,2,3,4,5].forEach(k=>used.add(rid(g,n,b,k)))));const bi=Math.max(0,c.b.indexOf(b));let id,t=0;do{id=c.p+bi+(n%10)+(Math.random()*10|0)+'ABCDEFGHJKLMNPQRSTUVWXYZ'[Math.random()*24|0]}while(used.has(id)&&++t<300);return id}
function mdl(g){const c=GM[g];if(MY.filter(r=>r.g===g).length>=5){toast('Mỗi game tạo tối đa 5 bàn. Hãy xóa bớt bàn cũ.');return}
const SU=[...new Set(c.s)];let sb=c.b.find(b=>chips>=b*10)||c.b[c.b.length-1],sn=SU.includes(SEL)?SEL:SU.includes(4)?4:SU[0];
const m=document.createElement('div');m.className='rmo';document.body.append(m);
const R=()=>{m.innerHTML=`<div class="rmb"><h4>Tạo bàn ${G[g].n}</h4><p>Mức cược</p><div class="rmr">${c.b.map(b=>`<button class="rop${b===sb?' on':''}${chips<b*10?' lk':''}" data-b="${b}">${nf(b)}</button>`).join('')}</div>${SU.length>1?`<p>Số người</p><div class="rmr">${SU.map(n=>`<button class="rop${n===sn?' on':''}" data-n="${n}">${n}</button>`).join('')}</div>`:''}<div class="rms">Cần ${nf(sb*10)} Chips để vào bàn · ${sn} người</div><div class="rma"><button class="sec" data-a="x">Hủy</button><button class="sec" data-a="c">Tạo và mời</button><button data-a="g">Tạo và vào</button></div></div>`};
R();
m.onclick=e=>{const t=e.target;if(t===m){m.remove();return}const b=t.dataset&&t.dataset;if(!b)return;
if(b.b){if(chips<+b.b*10){toast('Cần '+nf(+b.b*10)+' Chips để tạo bàn cược '+nf(+b.b));return}sb=+b.b;R()}
else if(b.n){sn=+b.n;R()}
else if(b.a==='x')m.remove();
else if(b.a==='c'||b.a==='g'){if(chips<sb*10){toast('Cần '+nf(sb*10)+' Chips để tạo bàn cược '+nf(sb));return}
const r={g,id:newId(g,sn,sb),n:sn,b:sb,t:Date.now()};MY.push(r);sv();m.remove();if(SEL&&SEL!==sn)SEL=sn;Q='';{const i=$('#rls');if(i)i.value=''}
if(b.a==='g'){join(g,sn,sb)}else{draw(g);const e=rl.querySelector('.rt[data-id="'+r.id+'"]');if(e){e.classList.add('nw');e.scrollIntoView({block:'center'})}inv(r)}}}}
function open(g){if(!gate(g))return;GG=g;Q='';OK=false;SEL=0;$('#play').style.display='';
rl.innerHTML=`<div class="zw"><div class="rh"><button id="rlb">‹ Về</button><h2>${G[g].n}</h2><button id="rlr">Luật</button><span class="rc shopbtn" id="rcs">${fmt(chips)}</span></div><div class="rsb"><div class="rsi"><i>🔍</i><input id="rls" type="search" inputmode="text" autocomplete="off" autocapitalize="characters" maxlength="8" placeholder="Tìm ID bàn" aria-label="Tìm bàn"><button id="rlx" hidden aria-label="Xóa">✕</button></div><button class="rok" id="rlo">Vào được</button><button class="rnew" id="rln2">＋ Tạo</button></div>${[...new Set(GM[g].s)].length>1?`<div class="rtabs" id="rtb"><button class="rtab on" data-n="0">Tất cả</button>${[...new Set(GM[g].s)].map(n=>`<button class="rtab" data-n="${n}">${n} người</button>`).join('')}</div>`:''}<p class="rn" id="rln"></p><div class="rcols" id="rlc2"></div></div>`;
rl.hidden=false;rl.scrollTop=0;draw(g);
$('#rlb').onclick=()=>rl.hidden=true;$('#rcs').onclick=openShop;
$('#rlr').onclick=()=>{$('#st').textContent=G[g].n;$('#sr').innerHTML=G[g].r.map(x=>`<li>${x}</li>`).join('');$('#play').style.display='none';$('#sheet').hidden=false};
$('#rls').oninput=e=>{Q=e.target.value;draw(g)};
$('#rlx').onclick=()=>{Q='';$('#rls').value='';draw(g);$('#rls').focus()};
$('#rln2').onclick=()=>mdl(g);
rl.querySelectorAll('.rtab').forEach(t=>t.onclick=()=>{SEL=+t.dataset.n;draw(g);rl.scrollTop=0;t.scrollIntoView&&t.scrollIntoView({block:'nearest',inline:'center'})});
$('#rlo').onclick=e=>{OK=!OK;e.currentTarget.classList.toggle('on',OK);draw(g)}}
function join(g,n,b){if(!gate(g))return;TB=b;if(g==='tl'||g==='phom')NA=n;if(g==='tl'){try{TLW=-1}catch(e){}}
if(CFG[g]){CFG[g].n=n;CFG[g].b=b}
if(g==='3c'||g==='lieng')CK=CK.map((x,i)=>i?Math.max(x,b*15):x);
cur=g;rl.hidden=true;$('#sheet').hidden=true;$('#play').onclick()}
$('#lobby').addEventListener('click',e=>{const t=e.target.closest('.gt');if(!t||!GM[t.dataset.id])return;e.stopPropagation();e.preventDefault();open(t.dataset.id)},true);
$('#close').addEventListener('click',()=>{$('#play').style.display=''});
