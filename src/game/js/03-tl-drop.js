/*@file game/js/03-tl-drop.js
 * Thả bài Tiến lên.
 */

function tlDrop(){try{if(!sel||!sel.size||!last)return;const a=ana([...sel]);if(!a||beats(a,last.c))return;sel.clear();ms=(ms?ms+'. ':'')+'Bài chọn trước không đánh được nên đã bỏ chọn'}catch(e){}}
