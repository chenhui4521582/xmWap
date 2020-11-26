<template>
  <div class="details-warp" :class="{'showHeader':$moduleConfig.isShowHeader}">
    <wf-header :title="titleText" />
    <div class="details-content">
      <div class="item" v-for="(item ,index) in detailsList" :key="index">
        <div class="item-img">
          <img class="img" :src="item.senderImg | filter" alt="小图">
        </div>
        <div class="item-content">
          <div class="title">{{item.title}}</div>
          <p class="item-text" v-html="item.content"></p>
          <img class="banner" v-if="item.imgUrl" :src="item.imgUrl | filter" alt="大图">
          <!-- 奖项图片列表 -->
          <ol class="awardList" v-if="item.awards.length">
            <li v-for="(subitem,i) in item.awards" :key="i">
              <img v-if="subitem.image" :src="subitem.image | filter" alt="">
              <p>{{subitem.name}}</p>
            </li>
          </ol>
          <div class="button-warp">
            <div class="time">{{item.timeInterval}}</div>
            <!-- 领奖 -->
            <div class="button copy-btn" v-if="buttonText(item) == '复制'"
              v-clipboard:copy="item.lightLinkUrl" v-clipboard:success="copyCode"
              v-clipboard:error="onError">
              <span :class="{'gray':item.awardsStatus === 1}">{{buttonText(item)}}</span>
            </div>
            <div class="button" v-else-if="buttonShow(item)" @click="openPage(item,index)">
              <span :class="{'gray':item.awardsStatus === 1}">{{buttonText(item)}}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { getMessageDetails, receiveAwards, receivePaySend, checkRechargeGift } from '@/services/user'
import sliderImage from './components/sliderImage'
import { jumpUrl } from '@/utils/utils'
import { mapState, mapActions } from 'vuex'
import Service from '@/services/payment'
export default {
  name: 'messageDetails',
  components: { sliderImage },
  data () {
    return {
      detailsList: []
    }
  },
  computed: {
    ...mapState(['shopUrl']),
    titleText () {
      const { senderName } = this.$route.query
      return senderName
    }
  },
  mounted () {
    this.pageInit()
  },
  methods: {
    /** 抽免单 不需的时候删除 **/
    ...mapActions({
      _getGratis: 'GET_GRATIS'
    }),
    // 页面初始化--- 消息详情获取
    async pageInit () {
      const { senderType } = this.$route.query
      const { code, data } = await getMessageDetails(senderType)
      if (code === 200) {
        this.detailsList = data
      }
    },
    // 按钮是否显示逻辑判断 迁移老项目
    buttonShow (item) {
      const { awards, buttonName, lightLinkUrl } = item
      if (!awards.length && (!buttonName || !lightLinkUrl)) {
        return false
      } else {
        return true
      }
    },
    // 按钮的文案 迁移老项目
    buttonText (item) {
      const { awards, buttonName, lightLinkUrl } = item
      if (awards && awards.length) {
        return '领取'
      }
      if (buttonName && lightLinkUrl) {
        return buttonName
      }
      return '确认'
    },
    // 消息跳转指定页面 迁移老项目
    async openPage (item, index) {
      /**
       * lgame  表示是小游戏
       * profit-盈利榜
       * personal-我的
       * faq-帮助反馈
       * faq_feedback-帮助反馈_意见反馈
       * feed_contact -帮助反馈_客服联系
       * 这些逻辑是以前迁移过来的
      */
      item.linkUrl = item.lightLinkUrl || ''
      let { senderType, senderName, linkUrl, awardsStatus, messageId } = item
      const flags = ['profit', 'my', 'faq', 'openACenter', 'faq_feedback', 'feed_contact', 'COUPON-H5', 'COUPON-DEFAULT', 'COUPON-LIST']
      this.$marchSetsPoint('A_H5PT0024000646', {
        task_id: senderType,
        task_name: senderName
      })
      // 领取奖品
      if (this.buttonText(item) === '领取' && awardsStatus !== 1) {
        // 领取优惠券-话费碎片-金叶子
        if (linkUrl.indexOf('PAY-DRAW') != -1) {
          const orderSn = linkUrl && linkUrl.replace('PAY-DRAW:', '')
          this.receivePaySend(orderSn).then(res => {

          })
        } else {
          // 领取其他的奖品
          this.receiveAwards(messageId)
        }
      } else if (flags.includes(linkUrl) || linkUrl.startsWith('lgame')) {
        //系统消息可跳转
        this.systemOpen(linkUrl)
      } else {
        console.log()
        // 链接跳转
        this._jumpUrl(item, index)
      }
    },
    // 领取奖励
    async receiveAwards (value) {
      const { code, message } = await receiveAwards(value)
      if (code === 200) {
        this.$Toast('领取成功')
        this.pageInit()
      } else {
        this.$Toast(message)
      }
    },
    // 领取优惠券-话费碎片-金叶子
    async receivePaySend (orderSn) {
      const { code, data, message } = await receivePaySend(orderSn)
      if (code == 200) {
        switch (data.type) {
          case 1:
            this.$Toast(`恭喜您获得${data.awardNum}金叶子`)
            break
          case 10:
            this.$Toast(`恭喜您获得${data.awardNum * 0.1}话费券碎片`)
            break
          default:
            this.$Toast('优惠券领取成功,请到个人中心查看')
            break
        }
      } else {
        this.$Toast(message)
      }
    },
    // 系统消息可跳转
    systemOpen (linkUrl) {
      if (linkUrl.startsWith('lgame')) {
        jumpUrl({ url: `/${linkUrl.split('_')[1]}` })
      } else {
        switch (linkUrl) {
          case 'profit':
            this.$router.push({ name: 'profitRanking' })
            break
          case 'my':
            // 我的页面
            this.$router.push({ name: 'my' })
            break
          case 'faq':
            // 打开问题管理
            this.$router.push({ name: 'issues' })
            break
          case 'openACenter':
            // 首页
            this.$router.push({
              name: 'index',
              query: {
                openACenter: 1
              }
            })
            break
          case 'faq_feedback':
            // 打开问题反馈
            this.$router.push({ name: 'feedback' })
            break
          case 'feed_contact':
            // 打开联系客服
            this.$router.push({ name: 'customerService' })
            break
          case 'COUPON-H5':
            // 首页
            this.$router.push({ name: 'index', })
            break
          case 'COUPON-DEFAULT':
            // 商城
            window.location.href = this.shopUrl
            break
          case 'COUPON-LIST':
            // 优惠劵
            localStorage.setItem('openYHJ', true)
            this.$router.push({ name: 'my' })
            break
        }
      }
    },
    // 链接跳转
    _jumpUrl (item, index) {
      item.linkUrl = item.lightLinkUrl || ''
      let { linkUrl } = item
      this.$marchSetsPoint('1210110201', {
        platform_id: 40000
      })
      //跳到转首页且打开某张轮播图，其余逻辑不建议杂糅到这个判断里 暂定
      if (linkUrl.indexOf('treasureCeremony') !== -1) {
        this.$$router.push({ name: 'index' })
        return
      }
      // 双十一
      if (linkUrl == 'double11') {
        this.$$router.push({ name: 'double11' })
        return
      }
      // 跳转外部链接
      if (item && item.linkUrl.indexOf('?externalLink') != -1) {
        let type = this.getUrlParam(item.linkUrl, 'externalLink')
        let externalLink = this.trimStr(item.linkUrl.replace('?externalLink', '')) + '?sojumpparm=' + JSON.parse(localStorage.getItem('user_Info')).userId
        switch (type) {
          case '1':
            externalLink = this.trimStr(item.linkUrl.replace('?externalLink=1', '')) + '?sojumpparm=' + JSON.parse(localStorage.getItem('user_Info')).userId
            break
          case '2':
            externalLink = this.trimStr(item.linkUrl.replace('?externalLink=2', '')) + '?openid=' + JSON.parse(localStorage.getItem('user_Info')).userId
            break
          default:
            break
        }
        window.location.href = externalLink
        return
      }
      if (linkUrl && linkUrl.indexOf('WHEEL-ORDER') !== -1) {
        this.checkIsReceivePayAwards(item.linkUrl.split(':')[1])
      } else if (linkUrl && linkUrl.indexOf('BIBILEAF-ORDER') !== -1) {
        this.checkIsBibiPayAwards(item.linkUrl.split(':')[1], index)
      } else {
        if (linkUrl.indexOf('springfestival') !== -1) {
          if (localStorage.getItem('isFestivalActivityOpen') == 'true') {
            channel = localStorage.getItem('APP_CHANNEL')
            location.href = `${linkUrl}&channel=${channel}`
          } else {
            this.$Toas('活动未开启')
          }
        } else {
          jumpUrl({ url: linkUrl })
        }
      }
    },
    async checkIsReceivePayAwards (orderSn) {
      const { code, data } = await checkRechargeGift(orderSn)
      localStorage.setItem('successOrderNum', orderSn)
      if (data.code == 200) {
        if (data.data.haveReceived) {
          this.$Toast('您已经抽过奖啦~')
        } else {
          this.$router.replace({ name: 'index', query: { showLottery: '1' } })
        }
      }
    },
    checkIsBibiPayAwards (orderNumber, index) {
      Service.getRechargeGift(orderNumber).then(res => {
        if (res.data.code == 200) {
          this.$Toast(`恭喜您获得${res.data.data.awardAmount}金叶子`)
          // this._getGratis(orderNumber)
          // this.pageInit();
          // this.detailsList[index].buttonName='已抽奖'
          // this.detailsList[index].awardsStatus=1
        } else if (res.data.code == 101) {
          this.$Toast('您已经抽过奖啦~')
          // this.detailsList[index].buttonName='已抽奖'
          // this.detailsList[index].awardsStatus=1
        } else {
          this.$Toast(res.data.message)
        }
      })
    },
    trimStr (str) {
      return str.replace(/(^\s*)|(\s*$)/g, '')
    },
    // 获取地址栏问号后面的参数值新
    getUrlParam (url, ename) {
      var Request = new Object()
      if (url.indexOf('?') != -1) {
        var str = url.split('?')[1]
        var strs = str.split('&')
        for (var i = 0; i < strs.length; i++) {
          Request[strs[i].split('=')[0]] = strs[i].split('=')[1]
          // 对奇速贷  用户id 如MjcyOTAzOA==  这种类型
          if (strs[i].split('=').length > 2) {
            Request[strs[i].split('=')[0]] = strs[i].split('=')[1] + '=='
          }
        }
      }
      return ename ? (Request[ename] ? Request[ename].split('#')[0] : '') : Request
    },
    copyCode () {
      this.$Toast('复制成功')
    },
    onError () {
      this.$Toast('当前浏览器不支持此功能，请手动复制。')
    }
  }
}
</script>
<style lang="less" scoped>
* {
  box-sizing: border-box;
}
.details-warp {
  min-height: 100vh;
  background: #f7f7f7;
  &.showHeader {
    padding-top: 94px;
  }
  padding-top: 20px;
  .details-content {
    padding: 0 24px;
    .item {
      width: 100%;
      background-color: #ffffff;
      padding: 20px;
      border-radius: 16px;
      display: flex;
      margin-bottom: 20px;
    }
    .item-img {
      width: 72px;
      height: 72px;
      overflow: hidden;
      border-radius: 12px;
      margin-right: 10px;
      img {
        width: 72px;
      }
    }
  }
  .item-content {
    flex: 1;
    .title {
      font-size: 28px;
      color: #000;
      font-weight: bold;
      margin-bottom: 10px;
    }
    .item-text {
      font-size: 24px;
      line-height: 36px;
      color: #888888;
    }
    .banner {
      max-width: 100%;
      display: block;
      margin-top: 10px;
    }
    .awardList {
      margin-top: 20px;
      li {
        display: flex;
        align-items: center;
        &:last-child {
          margin: 0;
        }

        img {
          height: 12px;
          margin-right: 5px;
        }
        p {
          color: #ffd338;
          font-size: 20px;
          line-height: 34px;
        }
      }
    }
    .button-warp {
      height: 50px;
      margin-top: 10px;
      width: 100%;
      display: flex;
      line-height: 52px;
      .time {
        width: 150px;
        flex: 0 150px;
        font-size: 20px;
        color: #acacac;
      }
      .button {
        flex: 1;
        text-align: right;
        margin-left: 20px;
        span {
          display: inline-block;
          height: 42px;
          line-height: 42px;
          padding: 0 20px;
          text-align: center;
          font-size: 24px;
          color: #ffffff;
          text-align: center;
          background-color: #ff4141;
          border-radius: 16px;
          &.gray {
            background: #999;
          }
        }
      }
    }
  }
}
</style>


