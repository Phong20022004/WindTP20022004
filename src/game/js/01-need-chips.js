/*@file game/js/01-need-chips.js
 * Cảnh báo khi hết chip.
 */
window.needChips=function(){var t=document.querySelector('#tb'),x=document.querySelector('#tbx');if(t&&!t.hidden&&x)x.click();setTimeout(function(){window.__bblShop&&window.__bblShop('Không đủ chip để vào bàn. Mua gói Premium hoặc làm nhiệm vụ để nhận thêm chip.')},80)};