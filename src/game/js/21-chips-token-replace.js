/*@file game/js/21-chips-token-replace.js
 * Đổi chữ "chip" thành WIND Coin trong giao diện.
 */

(()=>{
const TOK=/🪙|🎰|WIND Coin|(?<![\p{L}\p{N}_])chips?(?![\p{L}\p{N}_])/giu,CHW=/(?<![\p{L}\p{N}_])chips?(?![\p{L}\p{N}_])/iu,SKIP=/^(SCRIPT|STYLE|TEXTAREA|OPTION|TITLE|NOSCRIPT|INPUT)$/;
const isMark=n=>n&&n.nodeType===1&&n.classList&&(n.classList.contains('pchip')||n.classList.contains('wind-coin-mark'));
const mkCoin=()=>{const s=document.createElement('span');s.className='wind-coin-mark';s.setAttribute('role','img');s.setAttribute('aria-label','WIND Coin');const w=document.createElement('span');w.className='wind-coin-mark__w';w.textContent='W';s.appendChild(w);return s};
const mkChip=()=>{const i=document.createElement('i');i.className='pchip';i.style.setProperty('--c','#c62828');i.setAttribute('role','img');i.setAttribute('aria-label','Chip');return i};
function patch(node){const par=node.parentElement;if(!par||SKIP.test(par.tagName)||par.closest('.pchip,.wind-coin-mark,.cn'))return;
const v=node.nodeValue||'';if(!/🪙|🎰|WIND Coin|chip/i.test(v))return;
const hasChip=CHW.test(v);let prev=isMark(node.previousSibling),last=0,ch=false,m;const f=document.createDocumentFragment();TOK.lastIndex=0;
while((m=TOK.exec(v))){const t=m[0],b=v.slice(last,m.index);if(b){f.appendChild(document.createTextNode(b));if(b.trim())prev=false}
if(t==='🪙'){f.appendChild(mkCoin());prev=true;ch=true}
else if(t==='🎰'){if(hasChip){f.appendChild(mkChip());prev=true;ch=true}else{f.appendChild(document.createTextNode(t));prev=false}}
else{if(!prev){f.appendChild(t==='WIND Coin'?mkCoin():mkChip());ch=true}f.appendChild(document.createTextNode(t));prev=false}
last=m.index+t.length}
if(!ch)return;const r=v.slice(last);if(r)f.appendChild(document.createTextNode(r));node.parentNode&&node.parentNode.replaceChild(f,node)}
function walk(root){if(!root)return;if(root.nodeType===3){patch(root);return}if(root.nodeType!==1)return;if(SKIP.test(root.tagName)||root.closest&&root.closest('.pchip,.wind-coin-mark'))return;
const w=document.createTreeWalker(root,NodeFilter.SHOW_TEXT),a=[];while(w.nextNode())a.push(w.currentNode);a.forEach(patch)}
const q=new Set();let sc=0;
function init(){walk(document.body);new MutationObserver(rs=>{rs.forEach(r=>{if(r.type==='characterData')q.add(r.target);else r.addedNodes.forEach(n=>q.add(n))});
if(!sc)sc=requestAnimationFrame(()=>{sc=0;const a=[...q];q.clear();a.forEach(n=>{if(n.isConnected)walk(n)})})}).observe(document.body,{subtree:true,childList:true,characterData:true})}
if(document.body)init();else addEventListener('DOMContentLoaded',init)
})();
