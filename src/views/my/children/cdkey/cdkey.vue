<template>
  <article class="cdkey">
    <wfHeader title="游戏礼包兑换"></wfHeader>
    <section class="nMain" :class="{'showHeader': $moduleConfig.isShowHeader}">
      <div class="nMain-input-wrapper">
        <input maxlength="10" class="nMain-input" type="text" placeholder="请输入兑换码"
          @input="errorMsg = null" v-model="CDKey">
      </div>
      <div class="nMain-red" v-if="errorMsg">
        <p>兑换失败：{{errorMsg}}</p>
      </div>
      <input class="nMain-btn" :class="isRight&&'nMain-btn-right'" type="button" value="兑换"
        @click="submit()">
    </section>
    <awards-dialog v-model="isShowPop" tips-txt="兑换成功" @callback="isShowPop=false">
      <ul class="awards-list">
        <li v-for="(item,index) in awardsList" :class="{'only-one':awardsList.length===1}"
          :key="index">
          <div class="img-wrapper">
            <img :src="item.awardsImage|filter" alt="">
          </div>
          <p>{{item.awardsName}}x{{item.awardsNum|conversion}}</p>
        </li>
      </ul>
    </awards-dialog>
  </article>
</template>
<script>
import Services from '@/services/personalCenter'
import _get from 'lodash.get'
export default {
  name: 'cdkey',
  computed: {
    userInfo () {
      return sessionStorage.userInfoPersonal ? JSON.parse(sessionStorage.userInfoPersonal) : {}
    },
    isRight () {
      let reg = /^[0-9a-zA-Z]{10}$/
      return this.CDKey && reg.test(this.CDKey)
    }
  },
  data () {
    return {
      CDKey: null,
      errorMsg: null,
      isShowPop: false,
      showLoading: false,
      awardsList: []
    }
  },
  filters: {
    conversion (value) {
      if (!value && value != 0) return ''
      let unit = ''
      let number = 0
      if (value >= 100000000) {
        unit = '亿'
        number = (value / 100000000).toFixed(2)
      } else if (value >= 10000) {
        unit = '万'
        number = (value / 10000).toFixed(2)
      } else {
        number = value.toFixed(1)
      }

      let numberArr = number.split('.')
      if (Number(numberArr[1]) === 0) {
        return numberArr[0] + unit
      } else if (numberArr[1].split('')[1] === '0') {
        numberArr[1] = numberArr[1].split('')[0]
      }
      return numberArr.join('.') + unit
    },
  },
  methods: {
    closePop () {
      this.isShowPop = false
    },
    async submit () {
      if (!this.isRight) return
      this.showLoading = true
      this.$marchSetsPoint('A_H5PT0021004368')// H5平台-我的-CDK礼包兑换页面-兑换点击
      try {
        const res = await Services.exchangeCDKey(this.CDKey)
        const code = _get(res, 'data.code', 0)
        const data = _get(res, 'data.data', {})
        const message = _get(res, 'data.message', '')
        this.showLoading = false
        if (code === 200) {
          this.isShowPop = true
          this.awardsList = data.awardsList
          this.CDKey = null
          this.$marchSetsPoint('A_H5PT0021004369')// H5平台-我的-CDK礼包兑换页面-兑换成功弹窗加载完成
        } else {
          this.errorMsg = message
          this.CDKey = null
        }
      } catch (e) {
        this.showLoading = false
        this.CDKey = null
        this.errorMsg = '请稍后重试'
      }
    },
  },
  mounted () {
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
.cdkey {
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  overflow: hidden;
  background: #fff;
  .awards-list {
    display: flex;
    flex-wrap: wrap;
    align-content: space-around;
    min-height: 200px;
    margin-top: 10px;
    li {
      display: flex;
      font-size: 24px;
      color: #ff4141;
      align-items: center;
      justify-content: center;
      width: 100%;
      .img-wrapper {
        min-width: 88px;
        max-width: 88px;
        height: 56px;
        text-align: center;
        img {
          height: 100%;
        }
      }
      p {
        margin-left: 2px;
        width: 100px;
        text-align: left;
        white-space: nowrap;
      }
      &.only-one {
        display: block;
        div {
          max-width: 256px;
          height: 160px;
          margin: auto;
        }
        p {
          text-align: center;
          margin: auto;
        }
      }
    }
  }
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
      width: 50px;
      height: 50px;
      top: 50%;
      right: 22px;
      margin-top: -26px;
    }
  }
  .nMain-description {
    margin-bottom: 50px;
    color: #ff4141;
    font-size: 20px;
    line-height: 34px;
    letter-spacing: 2px;
    &.nMain-description1 {
      line-height: 36px;
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
}
</style>
