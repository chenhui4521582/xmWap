<template>
  <div class="feedback-warp" :class="{'showHeader':$moduleConfig.isShowHeader}">
    <wf-header bgColor="#fff" title="意见反馈" />
    <div class="feedback-content">
      <template v-if="!successShow">
        <div class="input-warp">
          <div class="label">输入您的意见</div>
          <textarea v-model.trim="feedback" class="textarea" maxlength="300" placeholder="我们重视每个人的宝贵意见，请帮助我们不断改进产品（不少于5个字）若被采纳，最高可获得88888金叶子"></textarea>
        </div>
        <div class="input-warp">
          <div class="label">输入您的手机号码</div>
          <input v-model.trim="phone" maxlength="11" type="tel" placeholder="请留下您的手机号码，以便我们回复您">
        </div>
        <div class="input-warp" v-if="showSendCode">
          <div class="label">验证码</div>
          <input v-model.trim="code" type="number" placeholder="请输入验证码">
          <div class="sendCode">
            <div class="btnSendCode" v-if="!countTime" @click="getSMS">获取验证码</div>
            <div class="count-down" else>{{countTime}}</div>
          </div>
        </div>
        <div class="buttom-body">
          <div class="buttom-warp" :class="{'buttom-warp-gray':buttomGray}" @click="saveCommit">确认提交</div>
        </div>
      </template>
      <template v-else>
        <div class="success-warp">
          <div class="icon">
            <i class="iconfont icon-right-simply"></i>
          </div>
          <h4>反馈成功</h4>
          <p>感谢您对游戏平台的支持与关注，</p>
          <p>我们会认真处理您的反馈，尽快修复和完善相关功能</p>
        </div>
      </template>

    </div>
  </div>
</template>
<script>
import { newFeedback } from "@/services/user"
import Services from '@/services/authentication'
import { getUrlParams } from '@/utils/utils'
import _get from 'lodash.get'
export default {
  name: "feedback",
  data () {
    return {
      phone: "",
      feedback: "",
      successShow: false,
      code: '',
      countTime: ''
    }
  },
  mounted () {
    this.$marchSetsPoint('P_H5PT0031')
    document.body.style.background = "#ffffff"
  },
  destroyed () {
    document.body.style.background = "#f5f5f5"
  },
  computed: {
    showSendCode () {
      let auth = getUrlParams("auth");
      return auth == 1;
    },
    buttomGray () {
      let isgray = this.feedback.length < 5;

      if (this.showSendCode && !this.code) {
        isgray = true;
      }
      return isgray;
    }
  },
  methods: {
    // 确认提交
    async saveCommit () {
      if (this.buttomGray) {
        if (this.feedback.length < 5) {
          this.$Toast('反馈内容要大于5个字哦')
        }
        else if (this.showSendCode && !this.code) {
          this.$Toast('请输入验证码')
        }
        return
      }
      let phoneReg = /^[1][3,4,5,7,8,9][0-9]{9}$/;
      if (this.phone && !phoneReg.test(this.phone)) {
        this.$Toast('手机号码格式不正确')
      }
      let params = {
        typeId: 0,
        description: this.feedback,
        phone: this.phone,
        imageUrls: []
      }

      if (this.showSendCode) {
        params.isLogin = 0;
        if (!this.code) {
          this.$Toast('请输入验证码');
          return;
        }
        else {
          params.smsCode = this.code;
        }
      }

      const { code, message } = await newFeedback(params)
      if (code === 200) {
        this.successShow = true;
      } else {
        this.$Toast(message)
      }
    },
    getSMS () {
      let mobileReg = /^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/
      if (!this.phone || !mobileReg.test(this.phone)) {
        this.$Toast('手机号码有误，请重填')
        return false
      }

      Services.complaintSendCode(this.phone).then(res => {
        let { code, data, message } = _get(res, 'data', {})
        if (code === 200) {
          this.countDown()
        } else {
          this.$Toast(message)
        }
      })
    },
    /** 倒计时 60 **/
    countDown () {
      let date = 59
      clearInterval(this.timer)
      this.countTime = '60秒后重发'
      this.timer = setInterval(() => {
        date = date - 1
        if (date < 0) {
          date = 0
          clearInterval(this.timer)
          this.countTime = ''
          return false
        }
        this.countTime = date + '秒后重发'
      }, 1000)
    },
  }
}
</script>
<style lang="less" scoped>
.feedback-warp {
  padding: 20px 24px;
  &.showHeader {
    padding: 94px 24px 30px;
  }
  .feedback-content {
    margin-top: 30px;

    .input-warp {
      position: relative;
      margin-bottom: 20px;

      .sendCode {
        position: absolute;
        top: 60px;
        right: 0;
        width: 170px;
        height: 65px;
        line-height: 65px;
        font-size: 24px;
        color: #ff7800;
        text-align: center;
        border-left: 1px solid #e6e6e6;
      }

      .label {
        margin-bottom: 15px;
        font-size: 24px;
        color: #000;
      }
      input {
        width: 100%;
        height: 90px;
        background-color: #f7f7f7;
        border-radius: 16px;
        font-size: 28px;
        padding: 15px 30px;
        color: #000;
        line-height: 50px;
      }
      input::-webkit-input-placeholder {
        color: #bbbbbb;
      }
      input::-moz-input-placeholder {
        color: #bbbbbb;
      }
      input::-ms-input-placeholder {
        color: #bbbbbb;
      }
      textarea::-webkit-input-placeholder {
        color: #bbbbbb;
      }
      textarea::-moz-input-placeholder {
        color: #bbbbbb;
      }
      textarea::-ms-input-placeholder {
        color: #bbbbbb;
      }
      .textarea {
        height: 400px;
        background-color: #f4f4f4;
        width: 100%;
        border-radius: 16px;
        border: none;
        box-sizing: border-box;
        padding: 24px;
        font-size: 24px;
        color: #000;
        line-height: 48px;
        word-break: break-all;
      }
    }
  }
  .buttom-body {
    position: fixed;
    left: 0;
    bottom: 0;
    right: 0;
    .buttom-warp {
      height: 90px;
      background-color: #ff4141;
      line-height: 90px;
      text-align: center;
      font-size: 24px;
      color: #fff;
    }
    .buttom-warp-gray {
      background-color: #e0e0e0;
    }
  }
}
.success-warp {
  text-align: center;
  .icon {
    width: 150px;
    height: 150px;
    line-height: 150px;
    border-radius: 50%;
    background-color: #ff7800;
    margin: 120px auto 40px;
    i {
      font-size: 60px;
      color: #fff;
    }
  }
  h4 {
    font-size: 32px;
    font-weight: bold;
    margin-bottom: 30px;
  }
  p {
    font-size: 24px;
    color: #888888;
    line-height: 40px;
  }
}
</style>


