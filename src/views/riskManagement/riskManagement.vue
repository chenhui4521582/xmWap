<template>
  <div class="risk-management">
    <div class="warn-icon">
      <img src="./img/icon-warning.png" alt="">
    </div>
    <div class="title">
      账号异常
    </div>
    <!-- 说明文字 -->
    <div class="explain">
      <template v-if="type === 'juveniles'">
        <span>亲爱的用户,目前本游戏平台暂时未对未成年人开放，</span>
        <br>
        <span>请多多见谅。如有疑问可联系在线客服。</span>
      </template>
      <template v-else>
        <span v-if="title" v-html="title"></span>
      </template>
    </div>
    <div class="btn">
      <template v-if="type == 1">
        <div class="riskTime" v-if="riskTime">还有：{{ countTime }}解封</div>
        <div class="btn-black" @click="goRealName()">去实名认证立即解封</div>
      </template>
      <template v-if="type === 'juveniles'">
        <div class="btn-intry"  @click="goIntry(2)">点击进入“在线客服”</div>
      </template>
      <template v-if="feedBackResultdata">
        <div
          class="btn-intry"
          v-if="feedBackResultdata.auditStatus==2"
          @click="goIntry(2)"
        > 
          <a href="javascript:void(0)">点击进入“申诉通道”</a>
        </div>
        <div class="btn-intry" v-else @click="goIntry(feedBackResultdata.auditStatus)">
          已申诉，点击查看申诉结果
        </div>
      </template>
    </div>
  </div>
</template>
<script>
import { getUrlParams } from '@/utils/utils'
import $axios from '@/services/http/http'
export default {
  name: 'riskManagement',
  data: () => ({
    feedBackResultdata: null,
    countTime: '00:00:00'
  }),
  computed: {
    id() {
      return decodeURIComponent(getUrlParams('id'))
    },
    params() {
      let params = decodeURIComponent(getUrlParams('parmas'))
      return params && JSON.parse(params) || {}
    },
    title() {
      return this.id.replace('平台规则', '<br><a href="https://wap.beeplaying.com/xmWap/#/riskManagement/plantRule" style="color: #FF4141; text-decoration: underline;">平台规则<a>')
    },
    type() {
      return getUrlParams('type') || this.params.type 
    },
    riskTime() {
      return this.params.riskTime
    },
    riskToken() {
      return  this.params.riskToken
    }
  },
  methods: {
    /** 倒计时 **/
    countDown() {
      if (!this.riskTime) return false
      let date = this.riskTime
      this.timer = setInterval(() => {
        date = date - 1
        if (date <= 0) {
          date = 0
          clearInterval(this.timer)
        }
        let hour = Math.floor(parseInt(date / 60 / 60) % 24)
        let minute = Math.floor(parseInt(date / 60) % 60)
        let second = Math.floor(parseInt(date) % 60)
        let countHour = hour >= 10 ? hour : '0' + hour
        let countMinute = minute >= 10 ? minute : '0' + minute
        let countSecond = second >= 10 ? second : '0' + second
        this.countTime = `${countHour}:${countMinute}:${countSecond}`
      }, 1000)
    },
    /** 获取申诉结果 **/
    async getfeedBackResult (userId) {
      if(!userId) return false
      let res = await $axios.post(
        `//platform-api.beeplaying.com/wap/api/feedback/feedBackResult/${userId}`
      )
      this.feedBackResultdata = res.data.code == 200 && res.data.data
    },
    /** 去实名认证 **/
    goRealName () {
      this.$router.push({name: 'authentication' ,query: {riskToken: this.riskToken}})
    },
    goIntry (status) {
      if (status == 2) {
        if (this.type === 'juveniles') {
          this.$router.push({name: 'customerService'})
        } else {
          this.$router.push({name: 'complaint', query: {uid: this.id.replace(/[^0-9]/gi, '')}})
        }
      } else if (status == 1) {
        this.isShowfeedBackResult = true
      } else {
        this.$Toast('请耐心等待，2~3日内可查询申诉结果')
      }
    }
  },
  mounted() {
    var userId = this.id.replace(/[^0-9]/gi, '')
    this.getfeedBackResult(userId)
    this.countDown()
  }
}
</script>
<style lang="less" scoped>
.risk-management {
  overflow: hidden;
  min-height: 100vh;
  background: #f7f7f7;
  .warn-icon {
    margin: 210px auto 46px;
    width: 150px;
    img {
      vertical-align: top;
      width: 100%;
    }
  }
  .title {
    margin-bottom: 15px;
    font-size: 32px;
    color: #000;
    text-align: center;
    font-weight: bold;
  }
  .explain {
    padding: 0 24px;
    margin-bottom: 15px;
    color: #888888;
    font-size: 24px;
    text-align: center;
    line-height: 38px;
  }
  .riskTime {
    color: #FF4141;
    font-size: 24px;
  }
  .btn {
    text-align: center;
    font-size: 24px;
    .btn-intry{
      margin-top: 50px;
      color: #FF4141;
      a {
        color: #5186CA;
        text-decoration: underline;
      }
    }
    .btn-black {
      position: fixed;
      left: 0;
      right: 0;
      bottom: 0;
      height: 90px;
      line-height: 90px;
      background: #FF4141;
      color: #fff;
    }
  }
}
</style>