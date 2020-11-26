<template>
  <div class="nickname">
    <wfHeader title="修改昵称"></wfHeader>
    <div class="nMain" :class="{'showHeader': $moduleConfig.isShowHeader}">
      <!-- <div class="nMain-red" v-if="userInfo.nicknameFlag">
        <p v-if="userInfo.nickNameChangeType === 3">* 30天可免费修改一次，本次修改昵称免费。</p>
        <p v-else-if="userInfo.useAmount>=userInfo.nicknameCost">*
          本次修改金叶子需要花费{{userInfo.nicknameCost}}金叶子。</p>
        <p class="noMoney" v-else>
          本次修改昵称需要花费{{userInfo.nicknameCost}}金叶子，<br>
          您的余额不足。<a @click="goPay()">点击去充值></a>
        </p>
      </div>
      <div class="nMain-red" v-else>
        <p v-if="userInfo.nickNameChangeType === 1">未达到下次修改昵称条件（时间间隔一个月）</p>
        <p v-if="userInfo.nickNameChangeType === 2">修改昵称功能冻结中</p>
      </div> -->
      <div class="nMain-red">
        <p>温馨提示：昵称只可修改一次，修改成功后无法再次修改。</p>
      </div>
      <div class="nMain-input-wrapper">
        <input maxlength="6"
          :readonly="!userInfo.nicknameFlag ||(userInfo.nickNameChangeType !== 3 && !(userInfo.useAmount>=userInfo.nicknameCost))"
          class="nMain-input" type="text" placeholder="请输入昵称" @input="isChange = true"
          v-model="newNickname">
        <span v-if="newNickname&&isChange">
          <i class="iconfont icon-right-color n-icon-right" v-if="isRight"></i>
          <i class="iconfont icon-wrong n-icon-wrong" v-else></i>
        </span>
      </div>
      <p class="nMain-description" :class="isRight&&isChange && 'ok'">2~6个字符，不支持空格/特殊符号</p>
      <input class="nMain-btn" :class="isRight&&isChange&&'nMain-btn-right'" type="button"
        value="确认提交" @click="submitChange()">
    </div>
    <Modal v-if="isShowPop" v-model="show" title="温馨提示" :type="2" :saveButtonShow="true"
      save-text="确认" close-text="不改了" :save-button-show="false" @on-save="updateUserNickname"
      @on-close="closePop">
      <div class="receive-pop">
        <p>
          <span>
            请确认修改后昵称：{{newNickname}}
          </span><br>
          <!-- <span>
            本次修改{{userInfo.nickNameChangeType === 3?'免费':'需花费' + userInfo.nicknameCost + '金叶子'}}
          </span> -->
          <span>
            昵称只可修改一次，<br />修改成功后无法再次修改。
          </span>
        </p>
      </div>
    </Modal>

  </div>
</template>
<script>
import Services from '@/services/personalCenter'
export default {
  name: 'nickName',
  computed: {
    userInfo () {
      return sessionStorage.userInfoPersonal ? JSON.parse(sessionStorage.userInfoPersonal) : {}
    },
    isRight () {
      let reg = /^[0-9a-zA-Z\u4e00-\u9fa5]{2,6}$/
      return this.newNickname && reg.test(this.newNickname)
    }
  },
  data () {
    return {
      newNickname: null,
      isShowPop: false,
      showLoading: false,
      isChange: false,
      show: true,
    }
  },
  methods: {
    submitChange () {
      if (!this.userInfo.nicknameFlag) {
        return
      }
      if (this.userInfo.nickname === this.newNickname) {
        this.$Toast('当前昵称无需修改')
      } else if (this.isRight) {
        this.isShowPop = true
      } else {
        this.$Toast('请输入合法昵称')
      }
    },
    closePop () {
      this.isShowPop = false
    },
    async updateUserNickname () {
      this.showLoading = true
      let param = {
        nickname: this.newNickname
      }
      const res = await Services.getUpdateUserNickname(param)
      this.closePop()
      this.$Toast(res.data.message || '修改成功')
      if (res.data.code === 200) {
        history.go(-1)
      }
      this.showLoading = false
    },
    // 去充值
    goPay () {
      window.location.href = 'https://wap.beeplaying.com/payment/#/mall'
    }
  },
  mounted () {
    this.isChange = false
    this.newNickname = this.userInfo.nickname
  }
}
</script>

<style rel="stylesheet/less" lang="less" scoped>
.n-icon-right {
  font-size: 50px;
  color: #1bd6ff;
}
.n-icon-wrong {
  font-size: 50px;
  color: #e8382b;
}
.noMoney {
  font-size: 26px;
  width: 100%;
  position: absolute;
  left: 0;
  top: 50%;
  padding-left: 30px;
  a {
    color: #ff9b3d;
  }
}
.nickname {
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  overflow: hidden;
}
input[type='button'] {
  -webkit-appearance: none;
}
.nMain {
  padding: 24px;
  &.showHeader {
    margin-top: 127px;
  }
  margin-top: 20px;
  .nMain-red {
    font-size: 24px;
    color: #ff4141;
    margin: 0 auto 19px;
  }
  .nMain-input-wrapper {
    position: relative;
    .nMain-input {
      display: block;
      margin-bottom: 13px;
      width: 100%;
      height: 90px;
      line-height: 90px;
      box-sizing: border-box;
      padding: 0 25px;
      border-radius: 16px;
      color: #000;
      font-size: 24px;
      background: #f7f7f7;
    }
    .n-icon-right,
    .n-icon-wrong {
      position: absolute;
      width: 0.5 * 100px;
      height: 0.5 * 100px;
      top: 50%;
      right: 0.22 * 100px;
      margin-top: -0.26 * 100px;
    }
  }
  .nMain-description {
    margin-bottom: 0.5 * 100px;
    color: #ff4141;
    font-size: 20px;
    line-height: 0.34 * 100px;
    letter-spacing: 0.02 * 100px;
    &.nMain-description1 {
      line-height: 0.36 * 100px;
    }
    &.ok {
      color: #bbbbbb;
    }
  }
  .nMain-btn {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    display: block;
    box-sizing: border-box;
    height: 90px;
    line-height: 90px;
    background-color: #ff4141;
    color: #fff;
    font-size: 24px;
    opacity: 0.5;
    &.nMain-btn-right {
      opacity: 1;
      background-color: #ff4141;
      color: #fff;
    }
  }
  .noMoney {
    line-height: 0.38 * 100px;
    a {
      color: #ff9b3d;
      font-weight: bold;
    }
  }
}
.receive-pop {
  color: #888888;
  font-size: 24px;
  line-height: 36px;
  text-align: center;
}
.pop-mask {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  overflow: hidden;
  background-color: rgba(14, 14, 14, 0.78);
  .receive-pop {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -60%);
    width: 80%;
    height: 3.6 * 100px;
    background: #0f1726;
    text-align: center;
    z-index: 11;
    color: #fff;
    p:first-child {
      height: 0.8 * 100px;
      line-height: 0.8 * 100px;
      background: #141f33;
      font-size: 0.26 * 100px;
      position: relative;
      i {
        position: absolute;
        right: 0;
        width: 0.4 * 100px;
        height: 0.8 * 100px;
        &::after {
          content: '';
          display: inline-block;
          margin-top: 0.25 * 100px;
          margin-right: 0.2 * 100px;
          width: 0.2 * 100px;
          height: 0.2 * 100px;
          vertical-align: top;
          background: url(./images/close-small.png) no-repeat;
          background-size: 100%;
        }
      }
    }
    p:nth-of-type(2) {
      padding: 0.68 * 100px 0 0.44 * 100px;
      font-size: 0.24 * 100px;
      line-height: 0.38 * 100px;
      font-weight: 500;
      i {
        color: #ffd338;
      }
    }
    p.btn-space {
      margin: 0 auto;
      border-radius: 0.08 * 100px;
      font-size: 0.28 * 100px;
      font-weight: bold;
      text-align: center;
      input {
        height: 0.6 * 100px;
        line-height: 0.6 * 100px;
        width: 1.88 * 100px;
      }
      input:first-child {
        background: #2b3a55;
        color: #62779c;
        margin-right: 0.36 * 100px;
      }
      input:last-child {
        background: #ee6f0b;
        color: #fff;
      }
    }
  }
}
</style>
