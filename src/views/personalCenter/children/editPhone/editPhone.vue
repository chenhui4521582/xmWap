<template>
  <div class="edit-warp" :class="{'showHeader':$moduleConfig.isShowHeader}">
    <wf-header title="验证原手机" />
    <div v-if="verificationCode" class="edit-content">
      <div class="edit-text">
        <p>输入发送至</p>
        <p>+86 {{phoneNumber}}的验证码</p>
      </div>
      <ul class="captcha-ul">
        <li v-for="(item, index) in inputArr" :key="index">
          <input type="tel" :disabled="item.disabled" pattern="\d*" class="captcha-input"
            v-model="item.val" @input="inputFn(item,index,$event)" maxlength="1" />
        </li>
      </ul>
      <p class="send" @click="getUpdateCaptcha" :class="{gray:!canTap}" v-html="countDownText"></p>
      <p class="no-code" @click="verificationCode=false">收不到验证码？</p>
    </div>
    <div v-else class="edit-content">
      <p class="tips">
        *解绑手机号码之前，您需要做一个简短的验证：请提交已绑定的账号信息以证明您是账号主人，以防他人冒充。
      </p>
      <p class="mobile-number">原手机号码</p>
      <input type="tel" v-model="originalMobile" maxlength="11" class="mobile__input">
      <div @click="submit" class="submit">确认提交</div>
    </div>
  </div>
</template>
<script>
import { updatePhoneCode, changeUpdatePhoneCode, checkOriginalPhoneNo } from "@/services/user"
export default {
  name: "editPhone",
  data () {
    return {
      verificationCode: true,
      inputArr: [],
      captcha: '', // 验证码
      countDownText: '',
      canTap: true,
      inputIndex: 0,
      originalMobile: null
    }
  },
  computed: {
    phoneNumber () {
      const { phone } = this.$route.query
      return phone
    },
    inputElArr () {
      return Array.from(document.getElementsByClassName('captcha-input'))
    }
  },
  mounted () {
    this.initInputArr()
    this.listenDelFn()
    this.getUpdateCaptcha()
  },
  destroyed () {
    this.listenDelFn('remove')
  },
  methods: {
    // 创建验证码输入框数据对象
    createInputData (num) {
      let arr = []
      for (let i = 0; i < num; i++) {
        arr.push({
          val: '',
          disabled: i == 0 ? false : true,
        })
      }
      return arr
    },
    // 初始化input数组
    initInputArr (inputIndex) {
      if (inputIndex) { // 如果inputIndex存在或大于0 初始化对应inputIndex的input框
        this.inputArr[inputIndex].val = ''
        this.inputArr[inputIndex].disabled = false
        this.inputArr[inputIndex + 1].disabled = true
        this.$nextTick(() => {
          this.inputElArr[inputIndex].focus()
        })
        this.inputIndex -= 1
        if (this.inputIndex < 0) {
          this.inputIndex = 0
        }
        return
      }
      this.inputArr = this.createInputData(6)
      this.$nextTick(() => {
        if (this.inputElArr && this.inputElArr.length > 0) {
          this.inputElArr[0].focus()
        }

      })
    },
    // input输入事件，初始化时，第一个input可输入后面的全部disabled
    inputFn (item, i) {
      this.inputIndex = i // 保存下一下输入框索引，以便删除时使用
      if (item.val) { // 如果有输入值
        if (i == this.inputArr.length - 1) { // 全部输入完毕提交验证接口
          // ...
          this.inputArr[i].disabled = true // 当前的输入框disabled
          let smsCode = this.inputArr.map(item => {
            return item.val
          }).join('')
          document.activeElement.blur() // 收起键盘
          this.inputIndex = 0 // 重置索引
          changeUpdatePhoneCode(smsCode).then(this.checkCaptchaFn)
          return
        }
        this.inputArr[i].disabled = true // 当前的输入框disabled
        this.inputArr[i + 1].disabled = false // 下一个输入框可输入
        this.$nextTick(() => {
          this.inputElArr[i + 1].focus() // 下一个输入框获得焦点
        })
      }
    },
    // 验证换绑验证码后的判断逻辑
    checkCaptchaFn (r) {
      if (r.code == 200) { // 验证通过 直接跳转绑定页面
        this.$router.replace({ name: "bindPhoneView" })
      } else { // 如果验证不通过 初始化输出框数据
        this.$Toast(r.message)
        this.initInputArr()
      }
    },
    // 监听键盘删除键
    listenDelFn (flag) {
      if (flag == 'remove') {
        document.onkeydown = null
        return
      }
      document.onkeydown = (e) => {
        if (e.keyCode == 8) {
          this.initInputArr(this.inputIndex)
        }
      }
    },
    // 获取换绑手机验证码
    async getUpdateCaptcha () {
      if (!this.canTap) return
      const { code, data, message } = await updatePhoneCode()
      if (code === 200) {
        this.countDown()
      } else {
        this.$Toast(message)
      }
    },
    // 倒计时
    countDown () {
      this.canTap = false
      let time = 60
      let stop = setInterval(() => {
        time -= 1
        this.countDownText = `验证码已发送<br>${time}S重新获取`
        if (time <= 0) {
          clearInterval(stop)
          this.countDownText = `重新获取验证码`
          this.canTap = true
        }
      }, 1000)
    },
    // 填写原手机号码
    async submit () {
      const phoneReg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/
      if (!this.originalMobile) {
        this.$Toast('请输入手机号码')
        return
      }
      if (!phoneReg.test(this.originalMobile)) {
        this.$Toast('手机号码输入有误')
        return
      }
      const { data, code, message } = await checkOriginalPhoneNo(this.originalMobile)
      if (code === 200) {
        this.$router.replace({ name: 'bindPhoneView' })
      } else {
        this.$Toast(message)
      }
    }
  }
}
</script>
<style lang="less" scoped>
.edit-warp {
  &.showHeader {
    padding-top: 94px;
  }
  padding-top: 20px;
  .edit-text {
    margin-top: 200px;
    text-align: center;
    font-size: 28px;
    font-weight: bold;
    line-height: 40px;
  }
}
.edit-content {
  padding: 0 22px 0 26px;
}

.tips {
  color: #ff4141;
  font-size: 24px;
  line-height: 1.6;
  padding: 14px 0 40px;
}

.mobile-number {
  font-size: 24px;
  color: #000000;
  padding-bottom: 15px;
}

.mobile__input {
  background: rgba(247, 247, 247, 1);
  border-radius: 16px;
  font-size: 24px;
  color: #bbb;
  padding: 0 20px;
  line-height: 90px;
  width: 100%;
}
.submit {
  width: 100%;
  line-height: 90px;
  background: #ff4141;
  text-align: center;
  position: fixed;
  left: 0;
  bottom: 0;
  color: #fff;
  font-size: 24px;
}

.captcha-ul {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 30px 150px;
  li {
    width: 60px;
    height: 60px;
    overflow: hidden;
    border-radius: 16px;
    background: #f7f7f7;
    input {
      border: none;
      display: block;
      padding: 0;
      margin: 0;
      width: 100%;
      height: 100%;
      text-align: center;
      font-size: 24px;
      color: #000;
    }
  }
}
.send {
  font-size: 24px;
  color: #ff7800;
  text-align: center;
  margin-top: 38px;
  &.gray {
    color: #ff4141;
  }
}

.no-code {
  text-align: center;
  width: fit-content;
  margin: 0 auto;
  color: #5186ca;
  font-size: 24px;
  border-bottom: 1px solid #5186ca;
  padding-top: 120px;
}
</style>


