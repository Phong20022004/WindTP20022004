/*@file js/lessons/seoul1a-bai1/01-shell-css-and-assets.js
 * ⚠ Mở IIFE bài học và hàm initApp() (đóng ở 12-tabs-and-open-close.js). Chứa khung Shadow DOM + CSS màn học, ảnh nền và đường leo núi.
 */

(()=>{
let META=null,host=null,root=null,app=null,stopAll=()=>{},routeFn=null,pendingRoute=null;
const $=s=>root.querySelector(s);
const SHELL="<style>:host{display:block;position:fixed;inset:0;z-index:70;--bg:#f0f9ff;--card:rgba(255,255,255,.88);--tx:#1e293b;--mut:#64748b;--pri:#0284c7;--ok:#059669;--bad:#e11d48;--bd:#e2e8f0;font-family:Inter,system-ui,\"Noto Sans KR\",\"Malgun Gothic\",sans-serif}\
\n:host([data-dark]){--bg:#0b1220;--card:rgba(30,41,59,.84);--tx:#e2e8f0;--mut:#94a3b8;--pri:#38bdf8;--ok:#34d399;--bad:#fb7185;--bd:#334155}\
\n.s1{height:100%;overflow:auto;color:var(--tx);background:radial-gradient(circle at 0 0,rgba(56,189,248,.18),transparent 45%),radial-gradient(circle at 100% 100%,rgba(99,102,241,.14),transparent 50%),var(--bg);box-sizing:border-box;padding-bottom:calc(24px + env(safe-area-inset-bottom,0px))}\
\n\n*{box-sizing:border-box}\
html{scroll-padding-top:env(safe-area-inset-top,0px)}\
\n\nmain{max-width:880px;margin:0 auto;padding:16px}\
h1{font-size:20px;margin:0 0 12px}\
\n.wrap{display:flex;gap:12px;align-items:flex-start}\
\nnav button,.btn{border:1px solid var(--bd);background:var(--card);color:var(--tx);padding:9px 14px;border-radius:10px;font-size:14px;cursor:pointer;white-space:nowrap}\
\nnav button.on,.btn.pri{background:var(--pri);color:#fff;border-color:var(--pri)}\
\n#app{margin-top:0}\
.card{background:var(--card);border:1px solid var(--bd);border-radius:16px;padding:22px;text-align:center}\
\n.ko{font-size:32px;font-weight:700}\
.rom,.mut{color:var(--mut);font-size:14px}\
.rom{margin-top:6px}\
.vi{font-size:21px;font-weight:600}\
\n.fc{min-height:190px;display:flex;flex-direction:column;justify-content:center;cursor:pointer;user-select:none;margin-top:8px}\
\n.row{display:flex;gap:8px;justify-content:center;margin-top:12px;flex-wrap:wrap;align-items:center}\
\n.opts{display:grid;gap:8px;margin-top:14px}\
\n.opt{padding:12px;border:1px solid var(--bd);background:var(--card);color:var(--tx);border-radius:12px;font-size:17px;cursor:pointer}\
\n.opt.ok{background:var(--ok);color:#fff;border-color:var(--ok)}\
.opt.bad{background:var(--bad);color:#fff;border-color:var(--bad)}\
\n.tiles{display:flex;flex-wrap:wrap;gap:8px;justify-content:center;margin-top:12px;min-height:46px}\
\n.tile{padding:10px 14px;border:1px solid var(--bd);background:var(--bg);color:var(--tx);border-radius:10px;font-size:18px;cursor:pointer}\
\n.ans{border-bottom:2px dashed var(--bd);padding-bottom:10px;margin-top:14px;min-height:56px}\
\ninput[type=text],select{width:100%;padding:12px;font-size:20px;border-radius:12px;border:1px solid var(--bd);background:var(--bg);color:var(--tx);text-align:center;margin-top:12px}\
\nselect{width:auto;font-size:14px;padding:8px;margin:0}\
\n.msg{margin-top:10px;font-weight:600;min-height:22px}\
\n.kb{display:flex;flex-wrap:wrap;gap:4px;margin-top:8px;justify-content:center}\
\n.kb button{min-width:34px;padding:8px 2px;border:1px solid var(--bd);background:var(--card);color:var(--tx);border-radius:8px;font-size:16px;cursor:pointer}\
\n.bar{height:6px;background:var(--bd);border-radius:3px;margin:6px 0 12px}\
.bar i{display:block;height:100%;background:var(--pri);border-radius:3px}\
\n.mtn{display:flex;align-items:flex-end;gap:3px;height:110px;margin:8px 0}\
.mtn i{flex:1;background:var(--bd);border-radius:3px 3px 0 0}\
.mtn i.up{background:var(--ok)}\
.mtn i.cur{background:var(--pri)}\
\n.g20{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-top:10px}\
\n.mt{padding:6px 4px;min-height:66px;border:1px solid var(--bd);background:var(--card);color:var(--tx);border-radius:12px;font-size:15px;cursor:pointer;word-break:keep-all}\
\n.mt.sel{border-color:var(--pri);box-shadow:0 0 0 2px var(--pri)}\
.mt.bad{background:var(--bad);color:#fff}\
.mt.done{visibility:hidden}\
\n\n#ci{transform-box:fill-box;transform-origin:center}\
#ci.hop{animation:hop .5s}\
#ci.dance{animation:hop .6s infinite}\
#ci.spin{animation:sp .9s}\
\n@keyframes hop{50%{transform:translateY(-16px)}\
}\
@keyframes sp{to{transform:rotate(720deg)}\
}\
\n#vic{opacity:0;transform-box:fill-box;transform-origin:center}\
#vic.show{opacity:1;animation:pop .9s}\
\n@keyframes pop{0%{transform:scale(.2)}\
70%{transform:scale(1.2)}\
to{transform:scale(1)}\
}\
\n#cf{transition:transform .2s}\
.wv{transform-box:fill-box;transform-origin:left center;animation:wv 1s ease-in-out infinite alternate}\
\n@keyframes wv{from{transform:skewY(-7deg) scaleX(1)}\
to{transform:skewY(7deg) scaleX(.92)}\
}\
\n.tw{animation:tw 1s ease-in-out infinite alternate}\
@keyframes tw{from{opacity:.2}\
to{opacity:1}\
}\
\n.cl{animation:cl 50s linear infinite}\
@keyframes cl{from{transform:translateX(-80px)}\
to{transform:translateX(520px)}\
}\
\n.sn{animation:sn linear infinite}\
@keyframes sn{to{transform:translateY(330px)}\
}\
\n.cfi{animation:cfi 2.2s ease-in forwards;transform-box:fill-box;transform-origin:center}\
\n@keyframes cfi{0%{transform:translate(0,0) rotate(0)}\
100%{transform:translate(var(--dx),240px) rotate(720deg);opacity:0}\
}\
\n.bd{animation:bd 20s linear infinite}\
@keyframes bd{from{transform:translateX(-40px)}\
to{transform:translateX(460px)}\
}\
\nnav{display:flex;flex-direction:column;gap:6px;flex:none;width:152px;position:sticky;top:8px}\
nav button{text-align:left;white-space:normal}\
#app{flex:1;min-width:0}\
\n@media(max-width:560px){main{padding:10px}\
nav{width:48px}\
nav button{padding:10px 0;text-align:center;font-size:18px}\
.lb{display:none}\
}\
\n.lgA,.lgB,.lgC,.lgD{transform-box:fill-box;transform-origin:top center}\
\n#ci.run .lgA,#ci.run .lgB{animation:gl .2s ease-in-out infinite alternate}\
#ci.run .lgC,#ci.run .lgD{animation:gl .2s ease-in-out infinite alternate-reverse}\
\n@keyframes gl{from{transform:rotate(-30deg)}\
to{transform:rotate(30deg)}\
}\
\n.mane{transform-box:fill-box;transform-origin:left center;animation:mn .7s ease-in-out infinite alternate}\
@keyframes mn{from{transform:skewY(-6deg)}\
to{transform:skewY(6deg)}\
}\
\n.tail{transform-box:fill-box;transform-origin:right top;animation:tl .9s ease-in-out infinite alternate}\
@keyframes tl{from{transform:rotate(-9deg)}\
to{transform:rotate(9deg)}\
}\
\n.hw{transform-box:fill-box;transform-origin:0% 100%;animation:hw .6s ease-in-out infinite alternate}\
@keyframes hw{from{transform:rotate(-16deg)}\
to{transform:rotate(16deg)}\
}\
\n.ht{opacity:0;animation:ht 2s ease-out infinite}\
@keyframes ht{0%{transform:translateY(0);opacity:0}\
20%{opacity:1}\
100%{transform:translateY(-50px);opacity:0}\
}\
\n.hr{transform-box:fill-box;transform-origin:50% 0;animation:hr 2s ease-in-out infinite alternate}\
@keyframes hr{from{transform:skewX(-3deg)}\
to{transform:skewX(3deg)}\
}\
\n\n.hd{display:flex;gap:12px;align-items:center;padding:calc(14px + env(safe-area-inset-top,0px)) 16px 14px;color:#fff;background:linear-gradient(135deg,#ea580c,#f59e0b 55%,#fcd34d);box-shadow:0 4px 18px rgba(234,88,12,.25)}\
\n.back{border:0;background:rgba(255,255,255,.24);color:#fff;font-weight:800;padding:9px 12px;border-radius:12px;cursor:pointer;font-size:13px;flex:none}\
\n.eyebrow{font-size:11px;font-weight:800;opacity:.92;letter-spacing:.06em}\
.hd h2{font-size:21px;font-weight:900;margin:2px 0}\
.hd p{margin:0;font-size:12px;opacity:.95}\
\n.chips{max-width:880px;margin:12px auto 0;padding:0 16px;display:flex;gap:8px;flex-wrap:wrap}\
\n.chip{font-size:12px;font-weight:800;padding:7px 12px;border-radius:999px;border:1px solid var(--bd);background:var(--card)}\
.chip.on{background:linear-gradient(135deg,#0284c7,#6366f1);color:#fff;border-color:transparent}\
.chip.off{opacity:.55}\
\nnav button.on,.btn.pri{background:linear-gradient(135deg,#0284c7,#6366f1);border-color:transparent;color:#fff}\
\n.card{border-radius:24px;backdrop-filter:blur(10px)}\
nav button,.btn,.opt,.tile,.mt{border-radius:14px}\
\n.sc{position:relative;width:100%;aspect-ratio:400/330;border-radius:20px;overflow:hidden;margin-top:6px;box-shadow:0 10px 30px rgba(15,40,80,.25)}\
\n.sc>*{position:absolute;left:0;top:0;width:100%;height:100%;display:block}\
\n.fg{overflow:hidden}\
\n.tm{height:5px;background:var(--bd);border-radius:3px;margin-bottom:10px}\
.tm i{display:block;height:100%;width:100%;background:linear-gradient(90deg,#f59e0b,#ef4444);border-radius:3px}\
\n.dh{margin:14px 0 4px;font-size:13px;color:var(--mut)}\
\n.drow{display:flex;justify-content:space-between;align-items:center;gap:8px;padding:8px 0;border-bottom:1px solid var(--bd);font-size:14px;flex-wrap:wrap}\
\n.drow small{color:var(--mut)}\
.drow .btn{padding:6px 10px;font-size:12px}\
.btn[disabled]{opacity:.45;cursor:not-allowed}\
\n.dot{display:inline-block;width:9px;height:9px;border-radius:50%;background:#94a3b8}\
.dot.on{background:#22c55e;box-shadow:0 0 8px #4ade80}\
\n.vs{display:flex;justify-content:space-around;align-items:center;margin:14px 0}\
.big{font-size:38px;font-weight:900}\
.vsx{font-weight:900;color:var(--mut)}\
\n.ft{animation:ft 1.4s ease-out forwards}\
@keyframes ft{to{transform:translateY(-26px);opacity:0}\
}\
\n.ms{animation:cl 60s linear infinite}\
\n#fl .pole{transform-box:fill-box;transform-origin:50% 100%}\
\n#fl.plant .pole{animation:pl .9s ease-out both}\
@keyframes pl{from{transform:scaleY(0)}\
to{transform:scaleY(1)}\
}\
\n#fl .fw{transform-box:fill-box;transform-origin:0 50%}\
#fl.plant .fw{animation:fu .7s .8s ease-out both}\
@keyframes fu{from{transform:scaleX(0)}\
to{transform:scaleX(1)}\
}\
\n.wv2{transform-box:fill-box;transform-origin:left center;animation:wv 1s ease-in-out infinite alternate}\
\n.cpL,.cpR{transform-box:fill-box}\
\n#cp.hug .cpL{animation:hgL 1s ease-out both}\
#cp.hug .cpR{animation:hgR 1s ease-out both}\
\n@keyframes hgL{from{transform:translateX(-26px)}\
to{transform:translateX(0)}\
}\
@keyframes hgR{from{transform:translateX(26px)}\
to{transform:translateX(0)}\
}\
\n.kiss{opacity:0}\
#cp.hug .kiss{animation:ks 1.2s 1s ease-out infinite}\
@keyframes ks{0%{opacity:0;transform:translateY(8px) scale(.4)}\
40%{opacity:1}\
100%{opacity:0;transform:translateY(-14px) scale(1.4)}\
}\
\n.vl{transform-box:fill-box;transform-origin:0 100%;animation:vl 2.4s ease-in-out infinite alternate}\
@keyframes vl{from{transform:skewX(-4deg)}\
to{transform:skewX(5deg)}\
}\
\n#pc.happy{animation:hop .6s infinite}\
\n#ci.slip{animation:slp .35s linear infinite alternate}\
@keyframes slp{from{transform:rotate(-14deg)}\
to{transform:rotate(10deg)}\
}\
\n.kbw{margin-top:6px}\
.kbx{background:#d6d9de;border-radius:16px;padding:8px 6px}\
:host([data-dark]) .kbx{background:#1f2937}\
\n.kr{display:flex;gap:5px;margin-bottom:6px;justify-content:center}\
.kr:last-child{margin-bottom:0}\
\n.kbx .k{flex:1;min-width:0;height:46px;border:0;border-radius:9px;background:#0b0b0b;color:#ffd400;font-size:22px;font-weight:800;cursor:pointer;padding:0;touch-action:manipulation}\
\n.kbx .k:active{background:#333}\
.kbx .k.wide{flex:1.5;font-size:18px}\
.kbx .k.sp{flex:5;font-size:13px}\
.kbx .k.act{background:#ffd400;color:#000}\
\n.sc2{position:relative;width:100%;aspect-ratio:1224/1285;border-radius:20px;overflow:hidden;background:#9bd}\
\n.sc2 svg{display:block;width:100%;height:100%}\
\n.bdr{animation-name:bdf;animation-timing-function:linear;animation-iteration-count:infinite}\
@keyframes bdf{from{transform:translateX(-200px)}\
to{transform:translateX(1400px)}\
}\
\n.fl{animation:fp .5s ease-in-out infinite alternate}\
@keyframes fp{from{transform:scaleY(1)}\
to{transform:scaleY(.4)}\
}\
\n.tw{animation:twk 2s ease-in-out infinite}\
@keyframes twk{0%,100%{opacity:.2}\
50%{opacity:1}\
}\
\n.sway{transform-box:fill-box;transform-origin:50% 100%;animation:swy 2.2s ease-in-out infinite alternate}\
@keyframes swy{from{transform:rotate(-2deg)}\
to{transform:rotate(2deg)}\
}\
\n#ci.run{animation:bob .3s ease-in-out infinite alternate}\
@keyframes bob{from{transform:translateY(0)}\
to{transform:translateY(-12px)}\
}\
\n#ci.slip{animation:slp2 .3s linear infinite alternate}\
@keyframes slp2{from{transform:rotate(-5deg)}\
to{transform:rotate(4deg)}\
}\
\n#ci{transform-box:fill-box;transform-origin:50% 100%}\
\n#fl2.plant .pole2{animation:plt .6s ease-out both}\
@keyframes plt{from{transform:translateY(-120px) rotate(-25deg)}\
to{transform:none}\
}\
\n.ft{animation:fup 1.4s ease-out forwards}\
@keyframes fup{to{transform:translateY(-90px);opacity:0}\
}\
\n.ht{animation:hup 2s ease-out forwards}\
@keyframes hup{from{opacity:1;transform:translateY(0)}\
to{opacity:0;transform:translateY(-150px)}\
}\
\n.cfi{animation:cfd 3s ease-in forwards}\
@keyframes cfd{to{transform:translate(var(--dx),900px) rotate(540deg);opacity:.8}\
}\
\n#vic{opacity:0;transform-box:fill-box;transform-origin:center}\
#vic.show{animation:vpop 1.1s ease-out forwards}\
@keyframes vpop{0%{opacity:0;transform:scale(.2)}\
60%{opacity:1;transform:scale(1.15)}\
100%{opacity:1;transform:scale(1)}\
}\
\n.kheart{animation:khb 1s ease-in-out infinite alternate;transform-box:fill-box;transform-origin:center}\
@keyframes khb{from{transform:scale(.92)}\
to{transform:scale(1.06)}\
}\
\n#kiss.go .kP{animation:kpp 1s ease-out both}\
#kiss.go .kQ{animation:kqq 1s ease-out both}\
\n@keyframes kpp{from{transform:translate(-330px,150px) rotate(0) scale(1.7)}\
}\
@keyframes kqq{from{transform:translate(330px,130px) rotate(0) scale(1.7)}\
}\
\n.kmw{animation:ks 1.2s 1s ease-out infinite}\
\n\n.fxl{position:fixed;inset:0;pointer-events:none;z-index:90;overflow:hidden}\
\n.fxl i{position:absolute;font-style:normal;font-size:20px;transform:translate(-50%,-50%);animation:fxp 1s ease-out forwards}\
\n@keyframes fxp{to{transform:translate(calc(-50% + var(--x)),calc(-50% + var(--y))) scale(.6) rotate(200deg);opacity:0}\
}\
\n.fxl b{position:absolute;transform:translate(-50%,-100%);font-size:20px;font-weight:900;color:#059669;text-shadow:0 2px 0 #fff,0 0 8px #fff;animation:fxt 1.1s ease-out forwards;white-space:nowrap}\
\n.fxl b.bd{color:#e11d48}\
\n@keyframes fxt{0%{opacity:0;transform:translate(-50%,-60%) scale(.5)}\
20%{opacity:1;transform:translate(-50%,-100%) scale(1.2)}\
100%{opacity:0;transform:translate(-50%,-190%) scale(1)}\
}\
\n.fxl u{position:absolute;inset:0;background:radial-gradient(circle,transparent 45%,rgba(225,29,72,.35));animation:fxr .6s ease-out forwards}\
\n@keyframes fxr{from{opacity:1}\
to{opacity:0}\
}\
\n.pulse{animation:pls .5s ease-out}\
@keyframes pls{40%{transform:scale(1.08);box-shadow:0 0 0 6px rgba(5,150,105,.35)}\
}\
\n.shk{animation:shk .45s}\
@keyframes shk{20%{transform:translateX(-9px)}\
40%{transform:translateX(8px)}\
60%{transform:translateX(-6px)}\
80%{transform:translateX(4px)}\
}\
\n#snd{position:fixed;right:10px;bottom:10px;z-index:80;width:40px;height:40px;border-radius:50%;border:0;background:rgba(255,255,255,.9);box-shadow:0 2px 10px rgba(0,0,0,.25);font-size:18px;cursor:pointer}\
\n</style><div class=\"s1\"><header class=\"hd\"><button class=\"back\" id=\"x\">← Giáo trình</button><div><div class=\"eyebrow\">SEOUL KOREAN · 1A</div><h2>Bài 1 · Từ vựng</h2><p>43 từ · Chào hỏi, quốc gia &amp; nghề nghiệp</p></div><button class=\"back\" id=\"cfg\" style=\"margin-left:auto\" title=\"Cài đặt\">⚙️</button></header><div class=\"chips\"><span class=\"chip on\">📖 Từ vựng</span><span class=\"chip off\">✍️ Ngữ pháp · sắp có</span></div><main><div class=\"wrap\"><nav id=\"tabs\"></nav><div id=\"app\"></div></div></main></div>";
const IMG={bg:"@@asset:lessons/seoul1a-bai1/bg.jpg@@",prince:"@@asset:lessons/seoul1a-bai1/prince.webp@@",princess:"@@asset:lessons/seoul1a-bai1/princess.webp@@"};
const PATH=[[224,1121],[230,1125],[238,1130],[246,1136],[254,1138],[262,1140],[267,1144],[269,1152],[274,1159],[282,1161],[290,1161],[298,1159],[306,1156],[314,1154],[322,1157],[329,1164],[336,1169],[344,1171],[352,1171],[360,1172],[368,1175],[376,1177],[384,1175],[392,1168],[399,1161],[407,1157],[415,1158],[423,1159],[431,1160],[439,1160],[447,1159],[455,1157],[463,1153],[471,1152],[479,1152],[487,1152],[495,1153],[503,1154],[511,1154],[519,1153],[527,1152],[535,1152],[542,1149],[546,1143],[549,1135],[556,1131],[564,1131],[572,1131],[580,1133],[588,1134],[596,1135],[604,1136],[610,1133],[614,1125],[618,1117],[617,1109],[611,1104],[603,1100],[595,1097],[587,1095],[579,1092],[571,1090],[563,1086],[556,1079],[554,1071],[555,1063],[558,1055],[564,1048],[572,1043],[580,1041],[588,1040],[596,1042],[604,1043],[610,1039],[615,1033],[623,1030],[631,1029],[639,1027],[647,1024],[655,1022],[663,1021],[671,1018],[679,1014],[687,1013],[695,1010],[703,1007],[711,1003],[719,997],[727,991],[734,984],[735,976],[733,968],[729,960],[726,952],[724,944],[719,937],[711,932],[703,929],[695,927],[687,925],[679,921],[671,918],[663,916],[655,913],[647,910],[639,907],[631,903],[623,900],[615,898],[607,896],[599,893],[591,890],[583,888],[575,885],[567,882],[559,878],[551,875],[543,874],[535,871],[527,868],[519,864],[513,857],[512,849],[514,841],[517,833],[522,825],[529,819],[537,816],[545,814],[553,810],[561,806],[569,804],[577,802],[585,800],[593,797],[601,795],[609,794],[617,792],[625,790],[633,789],[641,786],[649,783],[657,781],[665,778],[673,776],[681,774],[689,772],[697,769],[702,762],[702,754],[701,746],[699,738],[694,732],[686,728],[678,726],[670,725],[662,723],[654,720],[646,719],[638,718],[630,716],[622,717],[614,719],[606,717],[599,710],[593,702],[586,697],[579,692],[574,685],[571,677],[570,669],[571,661],[576,654],[584,648],[592,641],[600,636],[608,632],[616,628],[624,626],[632,624],[640,621],[648,618],[656,614],[661,607],[666,600],[673,595],[681,595],[689,597],[697,599],[705,597],[709,590],[708,582],[705,574],[701,567],[693,562],[685,560],[677,556],[669,553],[661,550],[653,548],[645,546],[637,546],[629,542],[621,536],[613,534],[605,532],[597,532],[589,535],[581,536],[574,532],[568,524],[561,519],[553,515],[545,510],[540,503],[541,495],[545,487],[549,479],[555,473],[563,468],[571,464],[579,461],[587,458],[595,455],[603,452],[611,450],[619,446],[627,441],[631,435],[635,428],[642,426],[650,428],[658,431],[666,430],[673,424],[676,416],[675,408],[673,400],[668,394],[660,389],[652,386],[644,384],[636,382],[628,380],[620,378],[612,373],[605,367],[601,359],[602,351],[606,344],[614,338],[615,338]];


function initApp(){
