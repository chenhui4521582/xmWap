import { getUrlParams, newUtils } from '@/utils/utils'
import axios from '@/services/http/http'
import _get from 'lodash.get'

export const payCommomMixin = {
  methods: {
    APP_CHANNEL () {
      return getUrlParams('channel') || localStorage.getItem('APP_CHANNEL')
    },
    baiduChannel () {
      let channel = localStorage.getItem('APP_CHANNEL') || this.getUrlParams('channel')
      try {
        return
        window.linkUrl.getBackUrlFlag(channel) === 'miniWap' ||
          (window.linkUrl.getBackUrlFlag(channel) === 'bdWap' &&
            this.channel != this.channelEnum.jinshan.channel)
      } catch (err) {
        return false
      }
    },
    channelEnum () {
      return {
        'jinshan': { channel: '100001', isOPen: true },
        'meizu': { channel: '100013', isOPen: true },
        'quanmin': { channel: '100015', isOPen: true },
        'aicai': { channel: '100016', isOPen: true },
        'okooo': { channel: '100006', isOPen: true },
        'yiqicai': { channel: '100022', isOPen: true }, // 17彩
        'sixwechat': { channel: '110002', isOPen: true }, // 665
        'baoying': { channel: '100035', isOPen: true }, // 豹赢
        'baidu': { channel: '100039', isOPen: true }, // baidu
        'qmVideo': { channel: '100042', isOPen: true }, // 小视频
        'miniHk': { channel: '100047001', isOPen: true }, // 迷你baidu
        'miniQm': { channel: '100048001', isOPen: true }, // 迷你小视频
        'renrenVideo': { channel: '100049', isOPen: true }, // 人人视频
        'juhaokan': { channel: '100050', isOPen: true }, // 聚好看(花生快讯)
        'baiduNovel': { channel: '100058', isOPen: true }, // 百度小说
        'juhaokannew': { channel: '100064', isOPen: true }, // 聚好看
        'qtt': { channel: '100067', isOPen: true }, // 趣头条
        'bdVideo': { channel: '100074', isOPen: true } // 趣头条
      }
    },
    // 获取用户状态
    getUserTansInfo () {
      let url = '//uic-api.beeplaying.com/uic/api/user/login/transInfo'
      return this.$http.post(url).then((res) => {
        this.userTansInfo = _get(res, 'res.data.data', {})
      })
    },
    goToPay (item, isReload = false) {
      // 不能购买 或 已售罄
      if (item.buyFlag == 0) {
        this.$Toast('该商品暂时不能购买！')
      } else if (item.buyStatus == 2) {
        this.$Toast('该商品已经售完！')
      } else {
        let currentToken = null
        let payFlow = localStorage.getItem('payFlow') || 1
        let isWechatChannel = ['110002', '110003', '110004'].includes(channel)
        let gzhRefferStatus = localStorage.getItem('gzh_reffer')
        if (gzhRefferStatus && !isWechatChannel) {
          currentToken = localStorage.getItem('ACCESS_TOKEN_' + localStorage.getItem('APP_CHANNEL'))
        } else {
          currentToken = localStorage.getItem('ACCESS_TOKEN')
        }
        // 验证是否登录
        if (currentToken) {
          localStorage.setItem('JDD_PARAM', JSON.stringify(item))
          setTimeout(() => {
            if (this.channel == this.channelEnum.jinshan.channel && payFlow == 1) {
              // 金山h5支付
              this.goJddPayment(item)
            } else if (this.channel == this.channelEnum.meizu.channel && this.channelEnum.meizu.isOPen) {
              // 魅族支付
              this.mzhandlePay(item)
            } else if (this.channel == this.channelEnum.yiqicai.channel && this.channelEnum.yiqicai.isOPen && payFlow == 1) {
              // 17彩支付
              this.yiqicaihandlePay(item)
            } else {
              window.location.href = '//wap.beeplaying.com/xmWap/#/gamepayment/list'
            }
          }, 0)
        } else {
          this.$Toast('未授权，请先登录')
        }
      }
    }
  }
}
