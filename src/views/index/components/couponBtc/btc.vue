<template>
  <div class="coupon-btc">
    <!-- 注册 -->
    <Modal 
      v-model="showCoupon"
      title="下载多多玩 福利多多"
      :buttonShow="false"
      @on-save="saveCallback"
    >
      <div class="bind-header">
        <div class="step" :class="{'active': step == 1}">
          <div class="wrap">
            <div class="icon">
              <img src="../../img/btc/phone-icon.png" alt="">
            </div>
          </div>
          <p v-if="step == 1">第1步<br>绑定手机号</p>
          <p v-if="step == 2">第1步<br>{{hidePhone}}绑定成功</p>
        </div>
        <div class="step" :class="{'active': step == 2}">
          <div class="wrap">
            <div class="icon">
              <img src="../../img/btc/down-icon.png" alt="">
            </div>
          </div>
          <p>第2步<br>下载并登录多多玩</p>
        </div>
        <div class="line">
          <div class="progress" :style="{width: countWidth}"></div>
        </div>
      </div>
      <!-- 绑定手机号 -->
      <div class="bind-phone" v-if="step == 1">
        <div class="binding-warp">
          <div class="input-wrap">
            <input v-model.trim="phone" maxlength="11" type="tel" placeholder="手机号">
          </div>
          <div class="input-wrap">
            <input v-model.trim="code" maxlength="6" type="tel" placeholder="验证码">
            <div class="get-code" @click="getCode">
              <div class="code-warp">{{countdownText}}</div>
            </div>
          </div>
        </div>
        <div class="submit" @click="saveBinding">立即绑定</div>
        <div class="explain">绑定手机号，优惠券才能发放到账</div>
      </div>
      <!-- 绑定完成 -->
      <div class="bind-finish" v-if="step == 2">
        <div class="explain">
          用绑定手机号登录多多玩，即能领取优 惠券。
        </div>
        <div v-if="isIOS"
          class="submit" 
          v-clipboard:copy="copyText"
          v-clipboard:success="onCopy" 
          v-clipboard:error="onError">复制前往</div>
        <div v-else class="submit" @click="toMiddle">立即下载</div>
        <!-- <div class="copy">
          复制下载链接
        </div> -->
        <div class="explain1">
          游戏服务由多多玩官方提供，如有问题<br>
          咨询多多玩客服微信：youxikefu2020
        </div>
      </div>
    </Modal>
    <!-- 弹框 -->
    <award-popup 
      v-model="showPopup"
      :awards="awards"
      confirmBtnText="立即领取"
      @callback="couponCallback"
      @closedCallback="closedCallback"
    />
  </div>
</template>
<script type="text/javascript">
import AwardPopup from '@/components/awardsDialog/awardsDialog'
import Services from '@/services/index'
import { getPhoneCode, bindMobilePhone, getPhoneBindInfo } from '@/services/user'
import { newUtils } from '@/utils/utils'
import _get from 'lodash.get'
export default {
  name: 'couponBtc',
  props: {
    animation: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    /** 是否显示 **/
    showCoupon: false,
    /** 抽到的奖品 **/
    awards: {},
    showPopup: false,
    phone: '',
    code: '',
    countdown: 60,
    countdownText: '获取验证码',
    step: 1,
    copyText: 'https://wap.beeplaying.com/ddwgame/'
  }),
  components: {
    AwardPopup
  },
  computed: {
    countWidth () {
      if(this.step == 2) {
        return `100%`
      }
      return ''
    },
    hidePhone () {
      var reg = /^(\d{3})\d{4}(\d{4})$/;
      return this.phone.replace(reg, "$1****$2");
    },
    isIOS () {
      return newUtils.isIOS()
    }
  },
  methods: {
    /** 获取用户是否是标签用户是否需要打开弹框 **/
    _getCouponBtcInfo () {
      Services.getCouponBtcInfo().then(res => {
        const {code, data, message} = _get(res, 'data')
        if(code == 200) {
          let {name, popup, url} = data
          this.showPopup = popup
          this.awards = {
            awardsImage: url,
            awardsName: `多多玩APP专属-${name}`,
          }
          if(this.showPopup) {
            this.$marchSetsPoint('A_H5PT0019003874')
          }
        }
      })
    },
    /** 告诉后端立即领取 **/
    _CToServiceReceive () {
        Services.CToServiceReceive()
    },
    /** C端通知后端发优惠券奖品 **/
    _CToService () {
      let channel = localStorage.getItem('APP_CHANNEL')
      let channelArray = ['100030', '100030001', '100030004', '100095', '100096', '100097', '100098', '100099']
      if(channelArray.indexOf(channel) > -1 ) {
        Services.CToService()
      }
    },
    /** 领取优惠券回调 **/
    couponCallback () {
      this._CToServiceReceive()
      this._getBindPhone()
      this.$marchSetsPoint('A_H5PT0019003875')
    },
    closedCallback () {
      this.$marchSetsPoint('A_H5PT0019003876')
    },
    saveCallback () {
      this.$marchSetsPoint('A_H5PT0019003880')
    },
    // 绑定手机号码
    async saveBinding () {
      let phoneReg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/
      if (this.phone === '') {
        this.$Toast('请输入手机号码')
        return
      }
      if (!phoneReg.test(this.phone)) {
        this.$Toast('请输入正确的手机号码')
        return
      }
      if (this.code === '') {
        this.$Toast('请输入短信验证码')
        return
      }
      const { code, data, message } = await bindMobilePhone(this.phone, this.code)
      if (code === 200) {
        this.$Toast('绑定成功', () => {
          this.step = 2
        })
      } else {
        this.$Toast(message)
      }
      this.$marchSetsPoint('A_H5PT0019003878')
    },
    // 获取短信验证吗
    async getCode () {
      let phoneReg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/
      if (this.countdown !== 60) {
        return
      }
      if (this.phone === '') {
        this.$Toast('请输入手机号码')
        return
      }
      if (!phoneReg.test(this.phone)) {
        this.$Toast('请输入正确的手机号码')
        return
      }
      const { code, data, message } = await getPhoneCode(this.phone)
      if (code === 200) {
        this.$Toast('短信验证码已发送，注意查收')
        this.countdownFn()
      } else {
        this.$Toast(message)
        clearInterval(this.time)
      }
    },
    // 验证码倒计时计算
    countdownFn () {
      if (this.countdown === 0) {
        this.countdown_text = '重新获取'
        this.countdown = 60
        this.code = ''
        clearTimeout(this.time)
        return false
      } else {
        this.countdown--
        if (this.countdown === 0) {
          this.countdownText = '重新获取'
        } else {
          this.countdownText = this.countdown + 's'
        }
        this.time = setTimeout(() => {
          this.countdownFn()
        }, 1000)
      }
    },
    onCopy () {
      this.$Toast('链接已复制，请在浏览器打开。')
    },
    onError () {
      this.$Toast('复制失败')
    },
    // 前往中间页
    toMiddle () {
      this.$marchSetsPoint('A_H5PT0019003879') // H5平台-首页-迁移转盘领奖提示弹窗-立即下载点击
      Services.btcDownLoad().then( res => {
        const {code, data} = _get(res, 'data')
        if(code == 200) {
          this.$Toast('正在下载多多玩，请稍候', () => {
            parent.location.href = data
          })
        }
      })
    },
    /** 获取绑定手机数据 **/
    _getBindPhone () {
      getPhoneBindInfo().then(res => {
        const { code, data } = res
        if (code == 200) {
          /** 没有绑定手机号的时候打开弹框 **/
          const { existsFlag, phone } = data
          if (existsFlag) {
            this.showPopup = false
            this.showCoupon = true
            this.phone = phone
            this.step = 2
          } else {
            this.showPopup = false
            this.showCoupon = true
            this.step = 1
          }
        }
        this.$marchSetsPoint('A_H5PT0019003877')
      })
    },
    init () {
      this._getCouponBtcInfo()
      this._CToService()
    }
  },
  mounted () {
    this.init()
  },
  watch: {
    showCoupon (value) {
      if (value) {
        newUtils.ScrollNoMove()
      } else {
        newUtils.ScrollMove()
      }
    }
  }
}
</script>
<style lang="less" scoped>
.coupon-btc {
  .bind-header {
    position: relative;
    margin: 10px auto 30px;
    width: 410px;
    display: flex;
    justify-content: space-between;
    .step {
      position: relative;
      z-index: 3;
      text-align: center;
      font-size: 20px;
      color: #BBBBBB;
      .wrap {
        margin: 0 auto 15px;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 90px;
        height: 90px;
        border-radius: 50%;
        .icon {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 72px;
          height: 72px;
          border-radius: 50%;
        }
 
      }
      p {
        white-space: nowrap;
      }
      &:nth-child(1) {
        .icon {
          background: #FFBD82;
          img {
            width: 26px;
            height: 40px;
          }
        }
      }
      &:nth-child(2) {
        .icon {
          background: #FFE7A9;
          img {
            width: 33px;
            height: 30px;
          }
        }
      }
      &.active {
        color: #000000;
        .wrap {
          background: #FFD7B3;
        }
        .icon {
          background: #FF7800;
        }
      }
    }
    .line {
      position: absolute;
      top: 42px;
      left: 0;
      width: 290px;
      height: 6px;
      background: #FFE7A9;
      .progress {
        width: 180px;
        height: 6px;
        background: #FF7800;
      }
    }
  }
  .bind-phone {
    overflow: hidden;
    .binding-warp {
      padding-top: 30px;
      border-top: 1px solid #EEEEEE;
      .input-wrap {
        margin-bottom: 20px;
        display: flex;
        justify-content: space-between;
        background: #F7F7F7;
        border-radius: 16px;
        input {
          padding: 10px 0 10px 20px;
          width: 100%;
          height: 70px;
          line-height: 50px;
          font-size: 24px;
          color: #BBBBBB;
        }
        input::-webkit-input-placeholder {
          color: #cdcdcd;
        }
        input::-moz-input-placeholder {
          color: #cdcdcd;
        }
        input::-ms-input-placeholder {
          color: #cdcdcd;
        }
        &:last-child {
          input {
            width: 164px;
          }
        }
        .code-warp {
          margin-top:15px;
          width: 153px;
          height: 40px;
          font-size: 24px;
          color: #FF7800;
          text-align: center;
          line-height: 40px;
          border-left: 1px solid #E6E6E6;
        }
      }
    }
    .submit {
      margin: 0 auto 20px;
      width: 410px;
      height: 70px;
      line-height: 70px;
      background: #FF4141;
      text-align: center;
      font-size: 24px;
      color: #FFFFFF;
      border-radius: 16px;
    }
    .explain {
      text-align: center;
      font-size: 20px;
      color: #BBBBBB;
    }
  }
  .bind-finish {
    padding-top: 13px;
    border-top: 1px solid #EEEEEE;
    .explain {
      margin-bottom: 27px;
      font-size: 24px;
      color: #000000;
    }
    .submit {
      margin: 0 auto 20px;
      width: 410px;
      height: 70px;
      line-height: 70px;
      background: #FF4141;
      text-align: center;
      font-size: 24px;
      color: #FFFFFF;
      border-radius: 16px;
    }
    .explain1 {
      text-align: center;
      font-size: 20px;
      color: #BBBBBB;
    }
    
  }
}
@keyframes btnScale {
  0% {
    transform: scale(1);
  }
  25% {
    transform: scale(1.1);
  }

  50% {
    transform: scale(1);
  }
  75% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}
</style>
