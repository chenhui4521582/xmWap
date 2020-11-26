<template>
  <div class="popup" v-if="value">
    <div class="mask"></div>
    <div class="wrap">
      <!-- 关闭转盘挽留 -->
      <template v-if="popupType == 1">
        <div class="detention">
          <div class="title">
            <img src="../../img/btc/title1.png" alt="">
          </div>
          <div class="btns">
            <div class="cancel-btn" @click="cancelClick">残忍放弃</div>
            <div class="confirm-btn" @click="confirmClick">再考虑一下</div>
          </div>
        </div>
      </template>
      <!-- 放弃奖品挽留 -->
      <template v-if="popupType == 2">
        <div class="detention1">
          <div class="title">
            <img src="../../img/btc/title2.png" alt="">
          </div>
          <div class="btns">
            <div class="cancel-btn" @click="cancelClick">残忍放弃</div>
            <div class="confirm-btn" @click="confirmClick">再考虑一下</div>
          </div>
        </div>
      </template>
      <!-- 绑定手机 -->
      <template v-if="popupType == 3">
        <div class="bind-phone">
          <div class="title">
            <img src="../../img/btc/title3.png" alt="">
          </div>
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
          <div class="explain">提示：每个手机只能绑定一个游戏账号。</div>
        </div>
      </template>
      <!-- B端抽奖奖品弹框 -->
      <template v-if="popupType == 4">
        <div class="b-award">
          <div class="title">
            <img src="../../img/btc/title4.png" alt="">
          </div>
          <div class="award-img">
            <img :src="awards.awardsImg | filter" alt="">
          </div>
          <div class="award-name">{{awards.awardsName}}</div>
          <div class="btn" @click="openCopy">立即领取</div>
          <div class="explain">提示：点击领取后，奖品才能到账哦~</div>
        </div>
      </template>
      <!-- 复制弹框 -->
      <template v-if="popupType == 5">
        <div class="copy">
          <div class="title">
            <img src="../../img/btc/title5.png" alt="">
          </div>
          <div class="content">
            <p>
              用绑定的手机号, 登录多多玩APP, <br>
              奖品立即到账。
            </p>
            <div v-if="isIOS"
              class="copy-btn"
              v-clipboard:copy="copyText"
              v-clipboard:success="onCopy"
              v-clipboard:error="onError">复制前往</div>
            <div v-else class="copy-btn" @click="toMiddle">立即下载</div>
            <div class="explain">
              游戏服务由多多玩官方提供，如有问题 <br />
              咨询多多玩客服微信： <span>youxikefu2020</span>
            </div>
          </div>
        </div>
      </template>
      <!-- c端奖品弹框 -->
      <template v-if="popupType == 6">
        <div class="c-award">
          <div class="title">
            <img src="../../img/btc/title6.png" alt="">
          </div>
          <div class="explain">奉上您在“用户大酬宾”活动转盘中抽到的奖品</div>
          <div class="award-img">
            <img :src="awards.awardImg | filter" alt="">
          </div>
          <div class="award-name">{{awards.awardName}}</div>
          <div class="btn" @click="hidePopup">立即收下</div>
        </div>
      </template>
      <div class="close" v-if="showHideBtn" :class="{type4: popupType == 4}" @click="hidePopup">
      </div>
    </div>
  </div>
</template>
<script>
import { getPhoneCode, bindMobilePhone } from '@/services/user'
import Services from '@/services/index'
import _get from 'lodash.get'
import { jumpUrl, newUtils } from '../../../../utils/utils'
export default {
  name: 'btcPopup',
  props: {
    value: {
      type: Boolean,
      default: false
    },
    popupType: {
      type: Number,
      default: 0
    },
    awards: {
      type: Object,
      default: () => ({})
    }
  },
  data: () => ({
    phone: '',
    code: '',
    countdown: 60,
    countdownText: '获取验证码',
    time: null,
    copyText: 'https://wap.beeplaying.com/ddwgame/'
  }),
  computed: {
    showHideBtn () {
      return [1, 2, 6].indexOf(this.popupType) == -1
    },
    isIOS () {
      return newUtils.isIOS()
    }
  },
  methods: {
    hidePopup () {
      this.$emit('input', false)
      switch (this.popupType) {
        case 3:
          this.$marchSetsPoint('A_H5PT0281003364')
          break
        case 4:
          this.$emit('detention')
          this.$marchSetsPoint('A_H5PT0281003370')
          break
        case 5:
          this.$emit('hideTurntable')
          this.$marchSetsPoint('A_H5PT0281003376')
          break
        case 6:
          this.$marchSetsPoint('A_H5PT0281003378')
          break
      }
    },
    cancelClick () {
      this.hidePopup()
      this.$emit('hideTurntable')
      if (this.popupType == 1) {
        this.$marchSetsPoint('A_H5PT0281003367')
      }
      if (this.popupType == 2) {
        this.$marchSetsPoint('A_H5PT0281003373')
      }
    },
    confirmClick () {
      this.hidePopup()
      if (this.popupType == 2) {
        this.$emit('detentionConfirm')
        this.$marchSetsPoint('A_H5PT0281003372')
      }
      if (this.popupType == 1) {
        this.$marchSetsPoint('A_H5PT0281003366')
      }
    },
    openCopy () {
      this.$emit('openCopy')
      this.$marchSetsPoint('A_H5PT0281003369')
    },
    // 前往中间页
    toMiddle () {
      this.$marchSetsPoint('A_H5PT0019003706') // H5平台-首页-迁移转盘领奖提示弹窗-立即下载点击
      Services.btcDownLoad().then( res => {
        const {code, data} = _get(res, 'data')
        if(code == 200) {
          this.$Toast('正在下载多多玩，请稍候', () => {
            parent.location.href = data
          })
        }
      })
    },
    onCopy () {
      this.$marchSetsPoint('A_H5PT0019003706') // H5平台-首页-迁移转盘领奖提示弹窗-立即下载点击
      this.$Toast('链接已复制，请在浏览器打开。')
    },
    onError () {
      this.$Toast('复制失败')
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
          this.$emit('bindSuccess')
          this.$emit('input', false)
        })
      } else {
        this.$Toast(message)
      }
      this.$marchSetsPoint('A_H5PT0281003363')
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
    }
  }
}
</script>
<style lang="less" scoped>
.popup {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 14;
  .mask {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 1;
    background: rgba(0, 0, 0, 0.7);
  }
  .wrap {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    z-index: 2;
    .detention,
    .detention1 {
      overflow: hidden;
      width: 479px;
      height: 290px;
      background: url(../../img/btc/detention-bg.png) no-repeat center center;
      background-size: 100% 100%;
      .title {
        margin: 63px auto 31px;
        width: 314px;
        height: 41px;
        img {
          vertical-align: top;
          width: 100%;
          height: 100%;
        }
      }
      .btns {
        display: flex;
        justify-content: center;
        font-size: 30px;
        font-weight: bold;
        .cancel-btn {
          margin-right: 21px;
          text-align: center;
          width: 189px;
          height: 103px;
          line-height: 103px;
          color: #fff;
          background: url(../../img/btc/btn3.png) no-repeat center center;
          background-size: 100% 100%;
        }
        .confirm-btn {
          text-align: center;
          width: 189px;
          height: 103px;
          line-height: 103px;
          color: #df3233;
          background: url(../../img/btc/btn1.png) no-repeat center center;
          background-size: 100% 100%;
        }
      }
    }
    .detention1 {
      .title {
        margin: 63px auto 36px;
        width: 396px;
        height: 41px;
      }
    }
    .bind-phone {
      overflow: hidden;
      width: 479px;
      height: 656px;
      background: url(../../img/btc/bind-bg.png) no-repeat center center;
      background-size: 100% 100%;
      .title {
        margin: 63px auto 32px;
        width: 361px;
        height: 88px;
        img {
          vertical-align: top;
          width: 100%;
          height: 100%;
        }
      }
      .binding-warp {
        padding: 0 45px;
        .input-wrap {
          display: flex;
          justify-content: space-between;
          margin-bottom: 50px;
          input {
            padding: 20px 0 20px 20px;
            width: 100%;
            height: 90px;
            border-radius: 20px;
            background: #fff;
            line-height: 50px;
            font-size: 24px;
            color: #000;
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
            width: 189px;
            height: 90px;
            background: #FFE599;
            border-radius: 20px;
            font-size: 24px;
            color: #E37948;
            text-align: center;
            line-height: 90px;
          }
        }
      }
      .submit {
        margin: 0 auto 20px;
        width: 385px;
        height: 101px;
        line-height: 100px;
        background: url(../../img/btc/btn4.png) no-repeat center center;
        background-size: 100% 100%;
        text-align: center;
        font-size: 30px;
        color: #df3233;
        font-weight: bold;
      }
      .explain {
        text-align: center;
        font-size: 20px;
        color: #FFE599;
      }
    }
    .b-award {
      overflow: hidden;
      width: 556px;
      height: 574px;
      background: url(../../img/btc/award-bg.png) no-repeat center center;
      background-size: 100% 100%;
      .title {
        margin: 33px auto 48px;
        width: 401px;
        height: 58px;
        img {
          vertical-align: top;
          width: 100%;
          height: 100%;
        }
      }
      .award-img {
        margin-bottom: 20px;
        height: 160px;
        text-align: center;
        img {
          vertical-align: top;
          height: 100%;
        }
      }
      .award-name {
        margin-bottom: 30px;
        text-align: center;
        font-size: 30px;
        font-weight: bold;
        color: #fff;
      }
      .btn {
        margin: 0 auto 20px;
        width: 385px;
        height: 101px;
        line-height: 100px;
        background: url(../../img/btc/btn2.png) no-repeat center center;
        background-size: 100% 100%;
        text-align: center;
        font-size: 30px;
        color: #df3233;
        font-weight: bold;
      }
      .explain {
        text-align: center;
        font-size: 20px;
        color: #FFE599;
      }
    }
    .copy {
      overflow: hidden;
      width: 479px;
      height: 476px;
      background: url(../../img/btc/copy-bg.png) no-repeat center center;
      background-size: 100% 100%;
      .title {
        margin: 50px auto 26px;
        width: 300px;
        height: 93px;
        img {
          vertical-align: top;
          width: 100%;
          height: 100%;
        }
      }
      .content {
        p {
          margin: 0 auto 30px;
          width: 366px;
          font-size: 24px;
          font-weight: bold;
          color: #fff;
          white-space: nowrap;
          line-height: 34px;
        }
        .copy-btn {
          margin: 0 auto 20px;
          width: 385px;
          height: 101px;
          line-height: 100px;
          background: url(../../img/btc/btn2.png) no-repeat center center;
          background-size: 100% 100%;
          text-align: center;
          font-size: 30px;
          color: #df3233;
          font-weight: bold;
        }
        .explain {
          margin: 0 auto;
          font-size: 20px;
          color: #FDDF94;
          text-align: center;
          width: 418px;
          white-space: nowrap;
        }
      }
    }
    .c-award {
      overflow: hidden;
      width: 556px;
      height: 574px;
      background: url(../../img/btc/c-award-bg.png) no-repeat center center;
      background-size: 100% 100%;
      .title {
        margin: 54px auto 19px;
        width: 295px;
        height: 62px;
        img {
          vertical-align: top;
          width: 100%;
          height: 100%;
        }
      }
      .award-img {
        margin-bottom: 20px;
        height: 160px;
        text-align: center;
        img {
          vertical-align: top;
          height: 100%;
        }
      }
      .award-name {
        margin-bottom: 23px;
        text-align: center;
        font-size: 24px;
        color: #ffdc6e;
      }
      .btn {
        margin: 0 auto 20px;
        width: 385px;
        height: 101px;
        line-height: 100px;
        background: url(../../img/btc/btn2.png) no-repeat center center;
        background-size: 100% 100%;
        text-align: center;
        font-size: 30px;
        color: #df3233;
        font-weight: bold;
      }
      .explain {
        padding: 0 70px;
        text-align: center;
        font-size: 24px;
        color: #fff;
      }
    }
    .close {
      width: 48px;
      height: 48px;
      position: absolute;
      z-index: 3;
      top: 6px;
      right: 6px;
      background: url(../../img/btc/close1.png) no-repeat center center;
      background-size: 100% 100%;
      /*&.type4 {*/
        /*top: 33px;*/
        /*right: 46px;*/
      /*}*/
    }
  }
}
</style>
