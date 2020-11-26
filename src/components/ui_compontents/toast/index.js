import toastComponent from './toast.vue'
const Toast = {}
// 注册Notify
Toast.install = function(Vue) {
  // 防止内存
  let time = null
  // 继承
  const ToastConstructor = Vue.extend(toastComponent)
  // new 对象
  const instance = new ToastConstructor()
  // 挂载到创建的div
  instance.$mount(document.createElement('div'))
  // 在挂载到body
  document.body.appendChild(instance.$el)
  // 注册全局方法
  Vue.prototype.$Toast = (msg, callback, position, duration = 1500, ) => {
    clearTimeout(time)
    instance.message = msg
    instance.position = position
    instance.visible = true
    time = setTimeout(() => {
      instance.visible = false,
      callback && callback()
    }, duration)
  }
}
export default Toast
