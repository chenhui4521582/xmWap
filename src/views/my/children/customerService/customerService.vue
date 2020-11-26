<template>
  <div class="service-warp">
    <wf-header title="联系客服"></wf-header>
    <div class="service-content" :class="{'showHeader': $moduleConfig.isShowHeader}">
      <!-- 车票宝渠道客服优化 -->
      <special v-if="!qiyukfShow" />
      <!-- vip -->
      <vip-user v-if="weChatNo" :we-chat-no="weChatNo" :rechargeLevel="rechargeLevel" :user-info="userInfo" />
      <!-- 客服热线 -->
      <hotline :source="weChatNo" />
      <!-- 普通 -->
      <ordinary v-if="!weChatNo" />
    </div>
    <div class="privacy-protocol" v-if="showPrivacyProtocol">
      <a href="javascript:void(0)" @click="goUserAgreement">用户协议</a>
      <a href="javascript:void(0)" @click="goPrivacyProtocol">隐私协议</a>
      <p>如需注销账户，请联系客服</p>
    </div>
    <div class="user-agreement" @click="goUserAgreement" v-else>
      <a href="javascript:void(0)">用户协议</a>
    </div>
    <div v-if="qiyukfShow" class="service-online" @click="openBelong">咨询在线客服</div>
  </div>
</template>
<script>
import ordinary from './components/ordinary'
import vipUser from './components/vipUser'
import hotline from './components/hotline'
import special from './components/special'
import { getExclusiveCustomerServiceInfo, getUserServiceInfo } from '@/services/user'
import { mapState } from 'vuex'

var isSdkReady = false
export default {
  name: 'customerService',
  components: { ordinary, vipUser, hotline, special },
  data () {
    return {
      qiyukfShow: false,
      weChatNo: '',
      rechargeLevel:0
    }
  },
  computed: {
    ...mapState(['userInfo']),
    showPrivacyProtocol () {
      return localStorage.getItem('APP_CHANNEL') === '100070'
    }
  },
  mounted () {
    document.body.style.background = '#ffffff'
    this.getWxInfo()
    this.getUserServiceInfo()
    ysf('onready', function () {
      isSdkReady = true
    })
  },
  methods: {
    configUser (userInfo) {
      let info = [
        {
          'key': 'user_id',
          'label': '用户ID',
          'value': userInfo.userId.toString()
        },
        {
          'key': 'nickname',
          'label': '用户昵称',
          'value': userInfo.nickname.toString()
        },
        {
          'key': 'channel',
          'label': '渠道号',
          'value': userInfo.channelId
        },
        {
          'key': 'channel_name',
          'label': '渠道名称',
          'value': userInfo.channelName
        },
        {
          'key': 'cat_level',
          'label': '猫等级',
          'value': userInfo.catVipLev.toString()
        },
        {
          'key': 'sum_recharge',
          'label': '充值数量',
          'value': userInfo.sumRecharge.toString() + '元'
        },
        {
          'key': 'add_time',
          'label': '创建时间',
          'value': userInfo.createTime.toString()
        }
      ]
      ysf('config', {
        uid: userInfo.userId, //用户ID
        level: userInfo.catVipLev, //招财猫等级
        data: JSON.stringify(info)
      })
    },
    // 打开专属客服
    openBelong () {
      if (this.weChatNo) {
        this.$marchSetsPoint('A_H5PT0155001752') // H5平台-专属客服页-咨询客服按钮点击
      } else {
        this.$marchSetsPoint('A_H5PT0030001748') // H5平台-普通客服页-咨询客服按钮点击
      }
      if (isSdkReady) {
        location.href = ysf('url')
      }
      else {
        alert('未加载完成，请稍后再试')
      }
    },
    goUserAgreement () {
      this.$router.push({ name: 'userAgreement' })
    },
    goPrivacyProtocol () {
      this.$router.push({ name: 'privacyProtocol' })
    },

    async getWxInfo () {
      const { code, data } = await getExclusiveCustomerServiceInfo()
      if (code === 200) {
        this.weChatNo = data.weChatNo
        this.rechargeLevel=data.rechargeLevel//0 累充<1万 1 累充>=1万 2 累充>=10万
      }
    },
    async getUserServiceInfo () {
      const { code, data } = await getUserServiceInfo()
      if (code === 200) {
        this.configUser(data)
      }
    }
  },
  created () {
    let channelArr = ['100100']
    let currentChannel = localStorage.getItem('APP_CHANNEL') || ''
    if (!channelArr.includes(currentChannel)) {
      this.qiyukfShow = true
      try {
        (function (w, d, n, a, j) {
          w[n] = w[n] || function () {
            return (w[n].a = w[n].a || []).push(arguments)
          }
          j = d.createElement('script')
          j.async = true
          j.src = 'https://qiyukf.com/script/f6ec9f5a8ce5c1e5285e3f769d2b52fd.js?hidden=1'
          d.body.appendChild(j)
        })(window, document, 'ysf')
      } catch (error) {
      }
    } else {
      this.qiyukfShow = false
    }
  }
}
</script>
<style lang="less" scoped>
.service-content {
  &.showHeader {
    padding: 100px 0 20px;
  }
  padding: 30px 0 20px;
  height: 100%;
  background-color: #f7f7f7;
  .sftips {
    font-size: 24px;
    font-weight: 400;
    line-height: 36px;
    color: rgba(255, 65, 65, 1);
    padding: 0 24px;
    margin-bottom: 20px;
  }
}
.user-agreement {
  padding: 0 24px;
  font-size: 24px;
  font-weight: 500;
  background-color: #f7f7f7;
  text-align: right;
  a {
    text-decoration: underline;
    color: #5186ca;
  }
}
.privacy-protocol {
  padding: 0 24px;
  font-size: 24px;
  font-weight: 500;
  background-color: #f7f7f7;
  text-align: center;
  line-height: 36px;
  position: fixed;
  left: 0;
  right: 0;
  bottom: 250px;
  a {
    text-decoration: underline;
    color: #5186ca;
    margin: 0 24px;
  }
  p {
    color: #bbbbbb;
  }
}
.service-online {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 90px;
  line-height: 90px;
  background-color: #ff4141;
  color: #ffffff;
  font-size: 24px;
  font-weight: 500;
  text-align: center;
}
</style>

/* 一定要记得改掉 */
<style>
body {
  background: #f7f7f7 !important;
}
</style>


