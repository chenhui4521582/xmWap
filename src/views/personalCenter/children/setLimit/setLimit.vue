<template>
  <div class="set-limit"
    :class="$moduleConfig.plantVersion != 'red'&&$moduleConfig.isShowHeader?'yellow':'red'">
    <wf-header title="充值额度设置" />
    <div class="title">* 充值达到设置额度后平台会主动提示</div>
    <div class="current-limit">
      <span class="t">当前日充值额度</span>
      <span class="num">{{currentLimit}}<i>元</i></span>
    </div>
    <div class="body">
      <h5>修改日充值额度</h5>
      <div class="center">
        <div class="wrap">
          <div class="label">规格</div>
          <div class="list">
            <ul>
              <li v-for="(item, index) in list" :key="index"
                :class="{'active': currentIndex == index}" @click="handleClick(index)">
                {{item}}
              </li>
            </ul>
          </div>
        </div>
        <div class="selected" v-if="list[currentIndex]">
          <span>已选 </span><i>{{list[currentIndex]}}元 额度</i>
        </div>
      </div>
    </div>
    <div class="submit" @click="handleClickLimit">确认更改额度</div>
    <!-- 实名认证提示 -->
    <Modal v-model="showAuthenticationModal" title="温馨提示" :type="2" :closeButtonShow=false
      :saveText="'实名认证通道'" @on-save="toAuthentication">
      <div class="center">
        亲爱的玩家<br>
        按照《网络游戏管理暂行办法》的有关要求及您的个人权益保障，请尽快完成实名认证。
      </div>
    </Modal>
    <!-- 手机验证 -->
    <Modal v-model="showMobileModal" title="资产说明" :closeButtonShow=false>
      <div class="validate">
        <div class="explain">
          为了您的账号资产安全，在调整额度前，需要进行一个简短的验证
        </div>
        <div class="form">
          <div class="form-group">
            <p>{{validate.mobile}}</p>
          </div>
          <div class="form-group code">
            <input v-model="validate.code" maxlength="6" type="text" placeholder="请输入验证码">
            <div class="send-code">
              <div class="btn" v-if="!validate.countTime" @click="_sendCode">发送验证码</div>
              <div class="count-down" else>{{validate.countTime}}</div>
            </div>
          </div>
        </div>
      </div>
      <wf-button slot="footer" :long=true @click="validatePhone">提交</wf-button>
    </Modal>
    <!-- 设置限额成功弹框 -->
    <Modal v-model="showLimitSuccessModal" title="温馨提示" :type="2" :saveText="'确定'"
      :closeButtonShow=false @on-save="limitSuccess">
      <div class="limit-success">
        <div class="img">
          <img src="./img/set-limit-success.png" alt="">
        </div>
        <div class="text">
          <p>额度修改成功</p>
          <p>当前额度：<span>{{list[currentIndex]}}元</span></p>
        </div>
      </div>
    </Modal>
  </div>
</template>
<script>
import Services from '@/services/personalCenter'
import _get from 'lodash.get'
export default {
  name: 'setLimit',
  data: () => ({
    /** 当前限额金额 **/
    currentLimit: '',
    /** 当前限额索引 **/
    currentIndex: null,
    /** 限额列表 **/
    list: [],
    /** 是否显示去实名认证弹框 **/
    showAuthenticationModal: false,
    /** 是否显示手机验证弹框 **/
    showMobileModal: false,
    /** 是否显示限额成功弹框 **/
    showLimitSuccessModal: false,
    /** 手机验证数据 **/
    validate: {
      mobile: '',
      code: '',
      countTime: ''
    },
    /** 是否允许设置额度 **/
    isOpen: true
  }),
  methods: {
    handleClick (index) {
      this.currentIndex = index
      this.$marchSetsPoint('A_H5PT0126001203')
    },
    /** 去实名认证 **/
    toAuthentication () {
      this.showAuthenticationModal = false
      this.$router.push({ name: 'authentication' })
    },
    /** 倒计时 60 **/
    countDown () {
      let date = 60
      this.timer = setInterval(() => {
        date = date - 1
        if (date < 0) {
          date = 0
          clearInterval(this.timer)
          this.validate.countTime = ''
          return false
        }
        this.validate.countTime = date + '后重发'
      }, 1000)
    },
    /** 限额按钮点击 **/
    handleClickLimit () {
      /** 用户没有选择充值额度 **/
      if (!this.list[this.currentIndex]) {
        this.$Toast('请选择充值额度')
        return false
      }
      /** 限制用户不允许修改 **/
      if (!this.isOpen) {
        this.$Toast('无法修改额度')
        return false
      }
      /** 用户没有实名去实名认证弹框 **/
      if (!this.userInfo.idcardNo) {
        this.showAuthenticationModal = true
        return false
      }
      /** 打开验证手机号弹框 **/
      this.showMobileModal = true
      this.$marchSetsPoint('A_H5PT0126001204')
    },
    /** 设置限额成功之后跳转 **/
    limitSuccess () {
      this.showLimitSuccessModal = false
      this.$router.back(-1)
    },
    /** 获取限额数据 **/
    _getLimit () {
      Services.getLimit().then(res => {
        let { code, message } = _get(res, 'data', {})
        if (code == 200) {
          let { dayLimit, options, open } = _get(res, 'data.data', {})
          this.currentLimit = dayLimit
          this.isOpen = open
          this.list = options || []
          this.list.forEach((item, index) => {
            if (item == this.currentLimit) {
              this.currentIndex = index
            }
          })
        } else {
          this.$Toast(message)
        }
      })
    },
    /** 获取用户信息 **/
    _getUserInfo () {
      Services.getUserPersonalInfo().then(res => {
        let { code, message, data } = _get(res, 'data', {})
        if (code == 200) {
          this.userInfo = data
          this.validate.mobile = this.userInfo.phone
        } else {
          this.$Toast(message)
        }
      })
    },
    /** 验证手机号 **/
    validatePhone () {
      if (!this.validate.code || this.validate.code.length < 6) {
        this.$Toast('请输入验证码')
        return false
      }
      this._submitLimit()
    },
    /** 发送验证码 **/
    _sendCode () {
      Services.sendLimitCode().then(res => {
        let { code, data, message } = _get(res, 'data', {})
        if (code === 200) {
          this.countDown()
        } else {
          this.$Toast(message)
        }
      })
    },
    /** 提交修改限额 **/
    _submitLimit () {
      let params = {
        code: this.validate.code,
        dayLimit: this.list[this.currentIndex]
      }
      Services.submitLimit(params).then(res => {
        let { data, code, message } = _get(res, 'data')
        if (code === 200) {
          this.showMobileModal = false
          this.showLimitSuccessModal = true
        } else {
          this.$Toast(message)
        }
      })
      this.$marchSetsPoint('A_H5PT0126001205')
    }
  },
  created () {
    this._getLimit()
    this._getUserInfo()
    this.$marchSetsPoint('P_H5PT0126')
  },
  beforeDestroy () {
    this.$marchSetsPoint('A_H5PT0126001206')
  }
}
</script>
<style lang="less" scoped>
.set-limit {
  padding: 116px 24px 0;
  &.red {
    padding: 24px 24px 0;
  }
  .title {
    margin-bottom: 15px;
    height: 33px;
    font-size: 24px;
    font-weight: 400;
    line-height: 36px;
    color: rgba(255, 65, 65, 1);
  }
  .current-limit {
    margin-bottom: 15px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .t {
      font-size: 28px;
      font-weight: bold;
      color: rgba(0, 0, 0, 1);
    }
    .num {
      display: flex;
      align-items: center;
      font-size: 32px;
      font-weight: bold;
      color: rgba(255, 65, 65, 1);
      i {
        font-size: 20px;
        color: rgba(255, 65, 65, 1);
      }
    }
  }
  .body {
    h5 {
      margin-bottom: 10px;
      font-size: 28px;
      font-weight: bold;
      color: rgba(0, 0, 0, 1);
    }
    .center {
      padding: 25px 20px;
      background: #f7f7f7;
      opacity: 1;
      border-radius: 16px;
      .wrap {
        display: flex;
        justify-content: flex-start;
        .label {
          width: 70px;
          height: 42px;
          line-height: 42px;
          text-align: left;
          color: #888888;
          font-size: 24px;
        }
        .list {
          flex: 1;
          ul {
            display: flex;
            justify-content: flex-start;
            flex-wrap: wrap;
            li {
              margin: 0 20px 20px 0;
              width: 120px;
              height: 42px;
              line-height: 42px;
              text-align: center;
              font-size: 24px;
              color: rgba(136, 136, 136, 1);
              background: #fff;
              border-radius: 16px;
              &.active {
                background: #ff4141;
                color: #fff;
              }
            }
          }
        }
      }
      .selected {
        display: flex;
        align-items: center;
        span {
          width: 70px;
          height: 42px;
          line-height: 42px;
          text-align: left;
          color: #888888;
          font-size: 24px;
        }
        i {
          font-size: 24px;
          color: #ff4141;
        }
      }
    }
  }
  .submit {
    position: fixed;
    left: 0;
    bottom: 0;
    right: 0;
    height: 90px;
    line-height: 90px;
    background: #ff4141;
    font-size: 24px;
    color: rgba(255, 255, 255, 1);
    text-align: center;
  }
}
.center {
  font-size: 24px;
  color: #888888;
  line-height: 36px;
}
.validate {
  .explain {
    margin: 15px;
    font-size: 24px;
    color: #888888;
    line-height: 36px;
  }
  .form {
    .form-group {
      margin-bottom: 20px;
      height: 70px;
      padding: 15px 0 15px 15px;
      background: #f7f7f7;
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
      &.code {
        margin-bottom: 44px;
        .send-code {
          width: 220px;
          text-align: center;
          color: #ff4141;
          font-size: 24px;
          border-left: 1px solid #e6e6e6;
        }
      }
    }
  }
}
.limit-success {
  .img {
    margin: 0 auto 25px;
    width: 220px;
    height: 124px;
    img {
      vertical-align: top;
      width: 100%;
    }
  }
  .text {
    font-size: 24px;
    color: #888;
    line-height: 36px;
    text-align: center;
    span {
      color: #ff4141;
    }
  }
}
</style>