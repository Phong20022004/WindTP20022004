/*@file game/js/15-patch-v15-js.js
 * Patch v15: trạng thái đang chơi.
 */
/* v15: trạng thái đang chơi để tạm dừng sảnh */
(()=>{const ids=['tb','game','cv2','xq2','vq2'];
const upd=()=>{const on=ids.some(i=>{const e=document.getElementById(i);return e&&!e.hidden});document.body.classList.toggle('ingame',on)};
new MutationObserver(upd).observe(document.body,{attributes:true,attributeFilter:['hidden'],subtree:true,childList:true});
upd()})();
