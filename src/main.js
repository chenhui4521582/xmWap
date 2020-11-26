import Vue from 'vue'
import App from '@/Main.vue'
import router from '@/router'
import store from '@/store'
import CommonComponents from '@/components'
import { marchSetsPoint, logError } from '@/utils/utils'
import moduleConfig from '@/utils/moduleConfig'
import AppCall from '@/utils/native/index'
import './utils/rem'
import VueClipboard from 'vue-clipboard2'
Vue.use(VueClipboard)
Vue.use(CommonComponents)
Vue.config.productionTip = false
Vue.prototype.$marchSetsPoint = marchSetsPoint
Vue.prototype.$moduleConfig = moduleConfig
Vue.prototype.$AppCall = AppCall
Vue.prototype.__defineGetter__('$companyInfo', function () {
  let channel = localStorage['APP_CHANNEL']
  let wfInfo = {
    'name': '苏州玩蜂软件科技有限公司',
    'alias': '玩蜂软件科技',
    'copyright_company': '苏州玩蜂软件科技有限公司',
    'icp': '苏ICP备17060724号-2'
  }
  let infos = {
    '100042': wfInfo,
    '110002001': wfInfo,
    '110002002': wfInfo,
    '110002007': wfInfo,
    'default': wfInfo
    // 'default': {
    //   'name': '成都六六五网络科技有限公司',
    //   'alias': '六六五网络科技',
    //   'copyright_company': '成都六六五网络科技有限公司',
    //   'icp': '蜀ICP备17017217号-1'
    // }
  }
  return infos[channel] || infos['default']
})
if (location.href.indexOf('wap.beeplaying.com') > -1) {
  Vue.config.errorHandler = function (err, vm, info) {
    console.log(err)
    logError({
      err,
      vm,
      info
    })
  }
}
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')