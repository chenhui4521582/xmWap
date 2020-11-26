<template>
  <div class="complaint">
    <wf-header title="申诉通道" />
    <div class="content">
      <div class="title">
        *同一设备登录多个账号、游戏作弊、使用模拟器、插件、外挂<br>
        等工具参与游戏等行为会引发账号登录异常。
      </div>
      <div class="input-group">
        <div class="label">输入您的意见</div>
        <div class="texatarea-center">
          <textarea 
            name="" 
            id="" 
            cols="30" 
            rows="10" 
            class="idea" 
            placeholder="请将您的情况填写下来，我们将在2~3个工作日内给您回复（字数限制在5~300以内）"
            v-model="complaint"
          ></textarea>
        </div>
      </div>
      <div class="input-group">
        <div class="label">输入您的手机号码</div>
        <div class="mobile-input">
          <input v-model="mobile" type="text" class="mobile" placeholder="输入您的手机号码" maxlength= "11"> 
        </div>
      </div>
      <div class="input-group">
        <div class="label">验证码</div>
        <div class="code-input">
          <input v-model="code" type="text" class="code" placeholder="验证码" maxlength= "6">
          <div class="code-btn" v-if="!countTime" @click="_sendCode">获取验证码</div>
          <div class="code-btn" v-if="countTime">{{countTime}}</div>
        </div>
      </div>
      <div class="submit-btn" :class="{'active': !validate}" @click="_submit" >确认提交</div>
    </div>
  </div>
</template>
<script>
import {getUrlParams} from '@/utils/utils'
import Services from '@/services/authentication'
import _get from 'lodash.get'
export default {
  name: 'complaint',
  data: () => ({
    complaint: '',
    mobile: '',
    code: '',
    countTime: ''
  }),
  computed: {
    validate() {
      let mobileReg = /^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/
      if(this.complaint == "") {
        return false
      }
      if(!mobileReg.test(this.mobile)) {
        return false
      }
      if(!this.code || this.code.length < 6) {
        return  false
      }
      return true
    }
  },
  methods: {
    _submit() {
      if(this.validate) {
        Services.complaintSubmit({
          description: this.complaint,
          isLogin: 0,
          phone: this.mobile,
          smsCode: this.code,
          typeId: 5,
          userId: getUrlParams('uid')
        }).then(res => {
          let {code, data, message} = _get(res, 'data', {})
          if(code == 200) {
            this.isClick = true
            this.$Toast('提交成功，我们将在3个工作日内联系您，请耐心等待~')
            setTimeout(()=> {
              window.history.go(-1)
            }, 2000)
          }else {
            this.$Toast(message)
          }
        })
      }
    },
    /** 发送验证码 **/
    _sendCode() {
      let mobileReg = /^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/
      if (!this.mobile || !mobileReg.test(this.mobile)) {
        this.$Toast('手机号码有误，请重填')
        return false
      }
      Services.complaintSendCode(this.mobile).then(res => {
        let {code, data, message} = _get(res, 'data', {})
        if(code === 200) {
          this.showCountDown = true
          this.countDown()
        }else {
          this.$Toast(message)
        }
      })
    },
    /** 倒计时 60 **/
    countDown() {
      let date = 60
      this.timer = setInterval(() => {
        date = date - 1
        if (date < 0) {
          date = 0
          clearInterval(this.timer)
          this.countTime = ''
          return false
        }
        this.countTime = date+'s后重发'
      }, 1000)
    },
  }
}
</script>
<style lang="less" scoped>
.complaint {
  min-height: 100vh;
  background: #fff;
  .content {
    padding:24px 24px 100px;
    .title {
      margin-bottom: 20px;
      color: #FF4141;
      font-size: 24px;
      line-height:36px;
    }
    .input-group {
      .label {
        margin-bottom: 15px;
        font-size: 24px;
        color: #000;
      }
      .texatarea-center {
        margin-bottom: 30px;
        textarea {
          padding: 24px 13px;
          width: 100%;
          height: 350px;
          border: none;
          background: #f7f7f7;
          border-radius: 16px;
          color: #000;
          font-size: 24px;
        }
      }
      .mobile-input {
        margin-bottom: 27px;
        height: 90px;
        padding: 20px 13px;
        background: #F7F7F7;
        border-radius: 16px;
        input {
          line-height: 50px;
          font-size: 24px;
          color: #000000;
        }
      }
      .code-input {
        height: 90px;
        padding: 20px 13px;
        background: #F7F7F7;
        border-radius: 16px;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        .code {
          line-height: 50px;
          font-size: 24px;
          color: #000000;
          flex: 1;
        }
        .code-btn {
          padding-left: 24px;
          width: 160px;
          color: #FF4141;
          font-size: 24px;
          text-align: center;
          line-height: 50px;
          border-left: 1px solid #E6E6E6;
        }
      }
    }
    .submit-btn {
      position: fixed;
      left: 0;
      right: 0;
      bottom: 0;
      height: 90px;
      line-height: 90px;
      font-size: 24px;
      text-align: center;
      color: #fff;
      background: #FF4141;
      opacity: 1;
      &.active {
        opacity: .5;
      }
    }
  }
}
</style>