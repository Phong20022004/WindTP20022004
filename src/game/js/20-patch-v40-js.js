/*@file game/js/20-patch-v40-js.js
 * Patch v40: khung người chơi (avatar, cảnh giới, giới tính, tuổi).
 */

/* v40: khung người chơi (avatar + khung + cảnh giới + giới tính + tuổi) */
(()=>{
const PW=window.__WIND;
let cssOk=false;
window.__pfpEnsure=()=>{if(cssOk)return true;const W=PW();if(!W||!W.pfpCss)return false;try{const s=document.createElement('style');s.id='pfp-css';s.textContent=W.pfpCss();document.head.append(s);cssOk=true}catch(e){}return cssOk};
const H=s=>{let h=2166136261;for(const ch of String(s)){h^=ch.codePointAt(0);h=Math.imul(h,16777619)}return h>>>0};
const FEM=new Set(['Hà','Lan','Thảo','Mai','Linh','Vy','Trang','Ngân','Yến','Hân','Thư','An']),MAL=new Set(['Minh','Phúc','Nam','Hùng','Tú','Đạt','Quân','Bảo','Khoa','Phát','Duy','Lộc','Huy']);
const RW=[25,20,16,12,10,7,5,3,2],RN=['Luyện Khí','Trúc Cơ','Kim Đan','Nguyên Anh','Hóa Thần','Luyện Hư','Hợp Thể','Đại Thừa','Độ Kiếp'],GI={nam:'♂',nu:'♀',khac:'⚧'};
function bot(name){try{const Q=PW();const p=Q&&Q.player&&Q.player(name);if(p)return{g:p.gender,age:p.age,realm:p.realm,realmName:p.realmName}}catch(e){}return bot0(name)}
/* Dự phòng khi game chạy độc lập (không có app). Cùng thuật toán với WINDTP.player — khi có app luôn dùng app. */
function bot0(name){const h=H('wind|'+name),g=FEM.has(name)?'nu':MAL.has(name)?'nam':(h&1?'nu':'nam'),age=18+((h>>>3)%23);let x=(h>>>9)%100,r=0;for(let i=0;i<RW.length;i++){if(x<RW[i]){r=i;break}x-=RW[i]}return{g,age,realm:r,realmName:RN[r]}}
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
function fq(s){let t=document.getElementById('fq-toast');if(!t){t=document.createElement('div');t.id='fq-toast';t.className='rlt';t.style.zIndex=95;document.body.append(t)}t.textContent=s;t.hidden=false;clearTimeout(fq.t);fq.t=setTimeout(()=>{t.hidden=true},3200)}
const FLAST={};
function fid(W,nm){try{if(W&&W.idOf)return W.idOf(nm)||''}catch(e){}return ''}
function fstat(W,nm,id0){try{const id=id0||fid(W,nm);if(W&&W.friendStatus)return W.friendStatus(id||nm)||'';if(W&&W.hasFriend&&W.hasFriend(id||nm))return 'friend'}catch(e){}return ''}
function fadd(pl,av,nm,me,info){if(me||!nm)return;
if(getComputedStyle(av).position==='static')av.style.position='relative';
let b=av.querySelector('.fadd');
if(!b){b=document.createElement('button');b.type='button';b.className='fadd';b.textContent='+';b.title='Gửi lời mời kết bạn';av.append(b);
b.addEventListener('pointerdown',e=>e.stopPropagation());
b.onclick=e=>{e.stopPropagation();e.preventDefault();const s=b.dataset.s||'';
if(s==='ok'){fq('Đã là bạn bè của bạn');return}
if(s==='pend'){fq('Đã gửi lời mời, đang chờ '+nm+' phản hồi');return}
const W=PW();let r=null;try{r=W&&W.requestFriend?W.requestFriend(nm,{id:fid(W,nm),g:info.g,age:info.age,realm:info.realm}):null}catch(x){}
if(r&&r.ok){const st=r.status==='friend'?'ok':'pend';FLAST[nm]=st==='ok'?'friend':'pending';b.dataset.s=st;b.className='fadd '+st;b.textContent=st==='ok'?'✓':'⏳';b.title=st==='ok'?'Đã là bạn bè':'Đã gửi lời mời, chờ phản hồi';
fq(st==='ok'?'Đã là bạn bè của bạn':(r.already?'Đã gửi lời mời trước đó, đang chờ '+nm+' phản hồi':'Đã gửi lời mời kết bạn tới '+nm))}
else fq('Chưa thể gửi lời mời lúc này')}}
b._nm=nm;b._id=fid(PW(),nm);fsync(b,nm)}
function fsync(b,nm){const st=fstat(PW(),nm,b._id),want=st==='friend'?'ok':st==='pending'?'pend':'';
if(b.dataset.s!==want){b.dataset.s=want;b.className='fadd '+want;b.textContent=want==='ok'?'✓':want==='pend'?'⏳':'+';b.title=want==='ok'?'Đã là bạn bè':want==='pend'?'Đã gửi lời mời, chờ phản hồi':'Gửi lời mời kết bạn'}
const prev=FLAST[nm];if(prev==='pending'&&st==='friend')fq('🤝 '+nm+' đã chấp nhận lời mời kết bạn');else if(prev==='pending'&&st==='')fq(nm+' chưa phản hồi lời mời kết bạn');FLAST[nm]=st}
function fsyncAll(){document.querySelectorAll('.fadd').forEach(b=>{if(b._nm)fsync(b,b._nm)})}
window.__bblFriendSync=fsyncAll; /* app đẩy sự kiện khi lời mời được chấp nhận / từ chối */
setInterval(()=>{if(!document.hidden)fsyncAll()},5000); /* chỉ còn là lưới an toàn */
const PFC=new Map();function deco(){const W=PW();window.__pfpEnsure();
document.querySelectorAll('#tb .pl, .pcard').forEach(pl=>{
const av=pl.querySelector('.av,.av2'),nb=[...pl.querySelectorAll('b')].find(x=>!x.closest('.av,.av2,.pfw'));if(!av||!nb)return;
const nm=(nb.textContent||'').replace(/[★🛡️]|\(.*?\)/g,'').trim();let emoji='';
for(const n of av.childNodes){if(n.nodeType===3&&n.nodeValue.trim()){emoji=n.nodeValue.trim();break}}
const me=nm==='Bạn';let P=null;try{P=me&&W&&W.profile?W.profile():null}catch(e){}
const key=nm+'|'+emoji+'|'+(P?JSON.stringify([P.gender,P.age,P.realm,P.avatarId,P.frameId]):'');
if(pl.dataset.pfk===key&&(pl.dataset.pfd==='0'||av.querySelector('.pfw')))return;
pl.dataset.pfk=key;av.querySelectorAll('.pfw').forEach(e=>e.remove());pl.querySelectorAll('.pin').forEach(e=>e.remove());
const info=P?{g:P.gender,age:P.age,realm:P.realm,realmName:P.realmName}:bot(nm);
const px=Math.max(28,Math.round(av.getBoundingClientRect().width)||36);let html='';
const ck=key+'|'+px;html=PFC.get(ck)||'';if(!html){try{if(W&&W.pfp){html=P&&W.myPfp?W.myPfp(px):W.pfp(nm,'default','r-'+info.realm,px,info.realm,emoji)}}catch(e){}if(html)PFC.set(ck,html)}
pl.dataset.pfd=html?'1':'0';if(html){av.classList.add('pfa');const s=document.createElement('span');s.className='pfw';s.innerHTML=html;av.append(s)}
const em=document.createElement('em');em.className='pin';
em.innerHTML=(info.g&&GI[info.g]?'<span class="g '+info.g+'">'+GI[info.g]+'</span>':'')+(info.age!=null&&info.age!==''?' '+esc(info.age)+'t':'')+(info.realmName?(info.g||info.age!=null?' · ':'')+'<span class="r">'+esc(info.realmName)+'</span>':'');
const sm=pl.classList.contains('pcard')?pl.querySelector('small'):null;if(sm)sm.after(em);else nb.parentElement.append(em);fadd(pl,av,nm,me,info)})}

/* v46: đã bỏ bảng chat riêng và ném đồ từng người; chỉ giữ bảng chung (nút 💬) */
let busy=0,pend=0;const run=()=>{pend=0;if(busy||document.hidden)return;busy=1;try{deco()}catch(e){}busy=0};const sch=()=>{if(!pend)pend=requestAnimationFrame(run)};
new MutationObserver(sch).observe(document.body,{childList:true,subtree:true});
setInterval(()=>{if(document.hidden)return;document.querySelectorAll('[data-pfd="0"]').forEach(e=>{delete e.dataset.pfk});sch()},1500);sch();
})();

