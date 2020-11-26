<template>
  <div class="login-btn"  v-if="showLoginBtn">
    <div class="fps">
      <p>development</p>
      <P>FPS: {{Fps}}</P>
      <div class="btn" @click="login">登录</div>
    </div>
    <Modal
      v-model="showModal"
      title="登录"
      :closeButtonShow=false
    >
      <div class="validate">
        <div class="nav">
          <div class="item" :class="{'active': currentIndex == 0}" @click="navClick(0)">账号登录</div>
          <div class="item" :class="{'active': currentIndex == 1}" @click="navClick(1)">手机登录</div>
        </div>
        <div class="form">
          <!-- 验证码登录 -->
          <div class="code-login" v-if="currentIndex == 1">
            <div class="form-group">
              <input v-model="validate.mobile" maxlength="11" type="text" placeholder="请输入手机号" >
            </div>
            <div class="form-group code">
              <input v-model="validate.code" maxlength="6" type="text" placeholder="请输入验证码" >
              <div class="send-code">
                <div class="btn" v-if="!validate.countTime" @click="_sendCode">发送验证码</div>
                <div class="count-down" else>{{validate.countTime}}</div>
              </div>
            </div>
          </div>
          <!-- 账号登录 -->
          <div class="user-login" v-if="currentIndex == 0">
            <div class="form-group">
              <input v-model="validate.mobile" maxlength="11" type="text" placeholder="请输入手机号" >
            </div>
            <div class="form-group pwd">
              <input v-model="validate.password" type="password" placeholder="请输入密码" >
            </div>
          </div>
        </div>
      </div>
      <wf-button slot="footer" :long=true @click="UserSubmit" v-if="currentIndex == 0">登录</wf-button>
      <wf-button slot="footer" :long=true @click="CodeSubmit" v-if="currentIndex == 1">登录</wf-button>
    </Modal>
  </div>
</template>
<script>
import Axios from 'axios'
import _get from 'lodash.get'
export default {
  name: 'login',
  data: ()=> ({
    Fps: '60',
    currentIndex: 0,
    /** 手机验证数据 **/
    showModal: false,
    validate: {
      mobile: '',
      password: '',
      code: '',
      countTime: ''
    },
    showLoginBtn: false
  }),
  methods: {
    login() {
      this.showModal = true;
      // window.open('https://wap.beeplaying.com/payment/#/login')
    },
    countFps() {
      let _this = this;
      let fps = 0;
      let startTime = new Date().getTime();
      let timer = "";
      if (timer) return false;
      let fn = () => {
        let diffTime = new Date().getTime() - startTime;
        fps++;
        timer = requestAnimationFrame(fn);
        if (diffTime >= 1000) {
          _this.Fps = fps;
          fps = 0;
          startTime = new Date().getTime();
        }
      }
      timer = requestAnimationFrame(fn);
    },
    /** 切换登录方式 **/
    navClick(index) {
      this.currentIndex = index
    },
    /** 发送验证码 **/
    _sendCode() {
      let mobileReg = /^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/
      if (!this.validate.mobile|| !mobileReg.test(this.validate.mobile)) {
        this.$Toast('手机号码有误，请重填')
        return false
      }
      let url = "//uic-api.beeplaying.com/uic/api/user/login/sendSmsCode"
      let params = {
        receiveRange: 1,
        username: this.validate.mobile
      }
      Axios.post(url, params).then(res => {
        let {code, data, message} = _get(res, 'data', {})
        if(code === 200) {
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
          this.validate.countTime = ''
          return false
        }
        this.validate.countTime = date+'后重发'
      }, 1000)
    },
    /** 获取token **/
    _getAccessToken(requestToken) {
      let url = '//uic-api.beeplaying.com/uic/api/user/login/accessToken'
      let params = {
        token: requestToken,
        type: 1
      }
      Axios.post(url, params).then(res => {
        let {code, data, message} = _get(res, 'data', {})
        if(code == 200) {
          localStorage.setItem('ACCESS_TOKEN', data.accessToken)
          this.$Toast('登录成功', function() {
            window.location.reload()
          })
        }else {
          this.$Toast(message)
        }
      })
    },
    /** 提交 **/
    UserSubmit() {
      if (!this.validate.password) {
        this.$Toast('请输入密码')
        return false
      }
      let mobileReg = /^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/
      if (!this.validate.mobile|| !mobileReg.test(this.validate.mobile)) {
        this.$Toast('手机号码有误，请重填')
        return false
      }
      let url = '//uic-api.beeplaying.com/uic/api/user/login/requestToken'
      let params = {
        username: this.validate.mobile,
        password: this.validate.password
      }
      Axios.post(url, params).then(res=> {
        let {code, data, message} = _get(res, 'data', {})
        if(code === 200) {
          this._getAccessToken(data)
        }else {
          this.$Toast(message)
        }
      })
    },
    CodeSubmit() {
      if (!this.validate.code || this.validate.code.length < 6) {
        this.$Toast('请输入验证码')
        return false
      }
      let mobileReg = /^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/
      if (!this.validate.mobile|| !mobileReg.test(this.validate.mobile)) {
        this.$Toast('手机号码有误，请重填')
        return false
      }
      let url = '//uic-api.beeplaying.com/uic/api/user/login/sms/requestToken'
      let params = {
        smsCode: this.validate.code,
        username: this.validate.mobile,
        visitorToken: ""
      }
      Axios.post(url, params).then(res=> {
        let {code, data, message} = _get(res, 'data', {})
        if(code === 200) {
          this._getAccessToken(data)
        }else {
          this.$Toast(message)
        }
      })
    },
    /** 是否显示登陆按钮 **/
    isShowLogin() {
      let token = localStorage.getItem('ACCESS_TOKEN')
      /** token不纯在并且是开发环境显示登陆按钮 **/
      if(!token && process.env.NODE_ENV === 'development') {
        this.showLoginBtn = true
        window.addEventListener('storage', storage=> {
          if(storage.key === 'ACCESS_TOKEN' && !storage.newValue) {
            this.showLoginBtn = true
            return false
          }
          this.showLoginBtn = false
        })
      }else {
        this.showLoginBtn = false
      }
    }
  },
  mounted() {
    this.countFps()
    this.isShowLogin()
  }
}
</script>
<style lang="less" scoped>
.login-btn {
  position: fixed;
  bottom: 110px;
  left: 0;
  z-index: 99;
  .fps {
    padding: 10px 20px;
    background: rgba(0,25,255,.6);
    p{
      margin-bottom: 10px;
      font-size: 24px;
      color: #FFF;
    }
    .btn {
      margin-top: 10px;
      padding: 10px;
      text-align: center;
      font-size: 24px;
      background: rgba(182,182,182, .6);
      border-radius: 28px;
      color: #FFF;
    }
    .user,.pwd {
      margin-right: 5px;
      padding-left: 5px;
      width: 200px;
      height: 40px;
      background: rgba(255,255,255, .6);
      color: #000;
    }
  }
  .validate {
    .nav {
      margin: 15px 0;
      font-size: 24px;
      color: #888888;
      display: flex;
      justify-content: space-between;
      .item {
        padding: 10px 20px;
        border: 1px solid #eee;
        border-radius: 16px;
        &.active {
          background: #ff4141;
          color: #fff;
        }
      }
    }
    .form {
      .form-group {
        margin-bottom: 20px;
        height: 70px;
        padding: 15px 0 15px 15px;
        background: #F7F7F7;
        border-radius: 16px;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        input {
          width: 100%;
        }
        p {
          width: 100%;
          font-size: 24px;
          color: #000000;
        }
        &.pwd {
          margin-bottom: 24px;
        }
        &.code {
          margin-bottom: 24px;
          .send-code {
            width: 220px;
            text-align: center;
            color: #FF4141;
            font-size: 24px;
            border-left: 1px solid #e6e6e6;
          }
        }
      }

    }
  }
}

</style>