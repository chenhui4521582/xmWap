<template>
  <div class="authentication" :class="{'showHeader':$moduleConfig.isShowHeader}">
    <wf-header bgColor="#fff" title="实名认证" />
    <div class="content">
      <div class="title">
        <p>
          *按照文化部《网络游戏管理暂行办法》的有关要求及您
          的个人权益保障，网络游戏用户需要使用有效身份证件
          进行实名注册，确保安全登录游戏。
        </p>
        <p>*以下信息仅用于实名注册，不会泄露于任何第三方。</p>
        <p>*注册信息只能提交一次，不可修改，请慎重填写。</p>
      </div>
      <div class="form">
        <div class="user-name">
          <p class="label">真实姓名</p>
          <div class="input">
            <input type="text" placeholder="请输入真实姓名" v-model.trim="userName" />
          </div>
        </div>
        <div class="id-card">
          <p class="label id-card-label">
            <span>证件号码</span>
            <span>（目前仅支持中国大陆第二代身份证认证）</span>
          </p>
          <div class="input">
            <input type="text" placeholder="请输入证件号码" v-model.trim="idCard" />
          </div>
        </div>
        <div class="mobile">
          <p class="label">手机号</p>
          <div class="input">
            <p v-if="bindPone">{{bindPone}}</p>
            <input type="text" v-model="mobile" maxlength="11" placeholder="请输入手机号" v-else />
          </div>
        </div>
        <div class="code">
          <p class="label">验证码</p>
          <div class="input">
            <input v-model.trim="code" type="text" placeholder="请输入验证码" maxlength="6" />
            <div class="send-btn" v-if="!showCountDown" @click="_sendCode">获取验证码</div>
            <div class="send-btn" v-if="showCountDown">{{ countTime }}s 后重发</div>
          </div>
        </div>
        <div class="submit" @click="submit">提交认证</div>
      </div>
    </div>
    <Modal v-model="showModal" :title="'温馨提示'" :type="2" :saveText="saveText"
      :closeButtonShow="false" @on-save="hideModal">
      <div class="text">
        <p>您已实名认证</p>
        <p>请重新进入游戏中心玩游戏</p>
      </div>
    </Modal>

  </div>
</template>
<script>
import { getUrlParams } from '@/utils/utils'
import Services from '@/services/authentication'
import _get from 'lodash.get'
export default {
  name: 'authentication',
  data: () => ({
    /** 用户名 **/
    userName: '',
    /** 身份证 **/
    idCard: '',
    /** 用户输入的手机号 **/
    mobile: '',
    /** 用户绑定的手机号 **/
    bindPone: '',
    /** 验证码 **/
    code: '',
    /** 倒计时 **/
    showCountDown: false,
    countTime: 60,
    /** 是否限制实名认证 **/
    isDisabled: '',
    /**风控token**/
    riskToken: getUrlParams('riskToken'),
    /** 显示弹框 **/
    showModal: false,
    saveText: '进入游戏中心'
  }),
  methods: {
    /** 获取用户绑定的手机号 **/
    _getBindPhone () {
      Services.getBindPhone(this.riskToken).then(res => {
        let { code, data } = _get(res, 'data', {})
        if (code === 200) {
          if (data.existsFlag) {
            this.bindPone = data.phone
          } else {
            this.bindPone = ''
          }
          this.isDisabled = data.authButtonGray
        }
      })
    },
    /** 提交form表单 **/
    _formSubmit () {
      let params = {
        idCardNo: this.idCard,
        name: this.userName,
        phone: this.bindPone ? null : this.mobile,
        smsCode: this.code,
        riskToken: this.riskToken
      }
      Services.authenticationSubmit(params).then(res => {
        let { code, data, message } = _get(res, 'data', {})
        if (code === 200) {
          if (this.riskToken && data.requestToken) {
            localStorage.setItem('ACCESS_TOKEN', data.requestToken)
            this.showModal = true
          } else {
            this.$Toast('认证成功')
            setTimeout(res => {
              this.$router.back(-1)
            }, 2000)
          }
        } else {
          this.$Toast(message)
        }
      })
    },
    /** 发送验证码 **/
    _sendCode () {
      let mobileReg = /^1[3456789]\d{9}$/
      if (!this.bindPone) {
        if (!this.mobile || !mobileReg.test(this.mobile)) {
          this.$Toast('手机号码有误，请重填')
          return false
        }
      }
      let params = {
        riskToken: this.riskToken,
        phone: this.bindPone ? null : this.mobile
      }
      Services.sendCode(params).then(res => {
        let { code, data, message } = _get(res, 'data', {})
        if (code === 200) {
          this.showCountDown = true
          this.countDown()
        } else {
          this.$Toast(message)
        }
      })
    },
    /** 提交 **/
    submit () {
      this.$marchSetsPoint('A_H5PT0125001202')
      let idcardReg = /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/
      let mobileReg = /^1[3456789]\d{9}$/
      if (this.isDisabled) {
        this.$Toast('今日认证次数已达上限，请明日再试')
        return false
      }
      if (!this.userName) {
        this.$Toast('请输入真实姓名')
        return false
      }
      if (!idcardReg.test(this.idCard)) {
        this.$Toast('身份证格式有误')
        return false
      }
      if (!this.bindPone) {
        if (!this.mobile || !mobileReg.test(this.mobile)) {
          this.$Toast('手机号码有误，请重填')
          return false
        }
      }
      if (!this.code || this.code.length < 6) {
        this.$Toast('请输入验证码')
        return false
      }
      this._formSubmit()
    },
    /** 倒计时 60 **/
    countDown () {
      let date = 60
      this.timer = setInterval(() => {
        date = date - 1
        if (date <= 0) {
          date = 0
          clearInterval(this.timer)
          this.showCountDown = false
        }
        this.countTime = date
      }, 1000)
    },
    /** 关闭弹框 **/
    hideModal () {
      this.showModal = false
      this.$router.push({ name: 'index' })
    },
    init () {
      this.$marchSetsPoint('P_H5PT0125')
      this._getBindPhone()
    }
  },
  created () {
    this.init()
  },
  beforeDestroy () {
    clearInterval(this.timer1)
    clearInterval(this.timer)
  }
}
</script>
<style lang="less" scoped>
.authentication {
  &.showHeader {
    padding-top: 94px;
  }
  .content {
    padding: 24px;
    .title {
      font-size: 24px;
      color: #666666;
      p {
        line-height: 40px;
        margin-bottom: 10px;
        &:nth-child(3) {
          margin-bottom: 20px;
          color: #ff4141;
        }
      }
    }
    .form {
      .label {
        margin-bottom: 15px;
        font-size: 24px;
        color: #000;
        &.id-card-label {
          display: flex;
          justify-content: flex-start;
          align-items: flex-end;
          span {
            &:last-child {
              font-size: 20px;
              color: #acacac;
            }
          }
        }
      }
      .input {
        margin-bottom: 25px;
        padding: 20px;
        width: 100%;
        height: 90px;
        background: #f7f7f7;
        border-radius: 16px;
        input,
        p {
          width: 100%;
          height: 50px;
          line-height: 50px;
          font-size: 26px;
          color: #666666;
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
      }
      .submit {
        position: fixed;
        bottom: 0;
        left: 0;
        width: 100%;
        margin-top: 160px;
        background-color: #ff4141;
        height: 90px;
        display: flex;
        justify-content: center;
        align-items: center;
        color: #fff;
        font-size: 24px;
      }
      .code {
        .input {
          display: flex;
          justify-content: flex-start;
          input {
            flex: 1;
          }
        }
        .send-btn {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 200px;
          font-size: 26px;
          color: #ff4141;
          border-left: 1px solid #e6e6e6;
        }
      }
    }
  }
}
.text {
  text-align: center;
  white-space: nowrap;
  font-size: 24px;
  color: #888888;
  line-height: 36px;
}
</style>


