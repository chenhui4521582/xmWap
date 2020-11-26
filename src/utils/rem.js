/**
 * @description rem的值计算和键盘遮盖文本框
 */
const baseSize = 30
let baseWidth = 720
function setRem () {
  /** SDK页面页面宽度580px **/
  if (window.location.href.indexOf('oldsdk/') != -1) {
    baseWidth = 580
  }
  const scale = document.documentElement.clientWidth / baseWidth
  document.documentElement.style.fontSize = baseSize * scale + 'px'
}
// H5页面弹出的键盘遮盖文本框
function pageInput () {
  if (
    document.activeElement.tagName == 'INPUT' ||
    document.activeElement.tagName == 'TEXTAREA'
  ) {
    document.activeElement.scrollIntoViewIfNeeded()
  }
}
setRem()
window.onresize = function () {
  setRem()
  pageInput()
}
