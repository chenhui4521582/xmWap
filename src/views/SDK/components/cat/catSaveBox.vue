<template>
  <section class="cat-save-box">
    <sdk-popup v-model="showOutPop" :title="title" :type="popType" :showCancel="showCancel"
      :cancelText="cancelText" :confirmText="confirmText" :inactivated="inactivated"
      :close-flag="false" @on-cancel="cancelCallback" @on-confirm="confirmCallback">
      <div class="text" :class="`status-${saveBoxStatus}`">
        <template v-if="saveBoxStatus === 0">
          <p>保险箱为招财猫Lv.30权益：</p>
          <p>可用于存储保底金叶子，</p>
          <p>游戏再嗨 ，</p>
          <p>也不怕消耗完您的所有金叶</p>
        </template>
        <template v-if="saveBoxStatus===1">
          <p class="capacity">当前保险箱容量{{saveBoxInfo.maxNum}}</p>
          <div class="haved-leaf">已存入：<div class="leaf-icon"></div>{{saveBoxInfo.balance}}</div>
        </template>
        <template v-if="saveBoxStatus===2">
          <p>您的招财猫生病了</p>
          <p>无法继续存入（可全部取出）</p>
          <p>任意付费可使猫自动恢复健康</p>
          <p>之后可继续使用</p>
        </template>
        <template v-if="saveBoxStatus===3">
          <p>您的招财猫生病了</p>
          <p>保险箱仅能全部取出</p>
          <p>恢复健康后可使用全部功能</p>
        </template>
        <template v-if="saveBoxStatus===4">
          <div class="input-wrap">
            <input v-model.number="leafNumber" type="tel" @blur="resize()"
              placeholder="请输入要存入的金叶子数">
            <span v-if="errorString">{{errorString}}</span>
            <p>还可继续存入{{moreNumber>userInfo.amount?userInfo.amount:moreNumber}} <a
                href="javascript:;" @click.stop="allIn()">全部存入</a> </p>
          </div>
        </template>
        <template v-if="saveBoxStatus===5">
          <div class="input-wrap">
            <input v-model.number="leafNumber" type="tel" @blur="resize()"
              placeholder="请输入要取出的金叶子数">
            <span v-if="errorString">{{errorString}}</span>
            <p>您可取出{{saveBoxInfo.balance}} <a href="javascript:;" @click.stop="allIn()">全部取出</a></p>
          </div>
        </template>
        <div class="cat_surplusinfo" v-if="saveBoxStatus===1||saveBoxStatus===4||saveBoxStatus===5">
          <div class="line"></div>
          <div class="desc">
            * 金叶存入保险箱之后，<em>相应金叶数将会被减去，且不可被消耗。</em>取出之后，可正常消耗。
          </div>
          <div class="desc">
            * 提升招财猫等级，可提高保险箱容量，<br />
            <span class="gobaoxian" @click.stop="besure()">去提升保险箱容量></span>
          </div>
        </div>
      </div>
    </sdk-popup>
    <sdk-popup v-model="showEndPop" :title="endTitle" :type="2" :showCancel="false" confirmText="好的"
      @on-confirm="closeEndPop(1)" @on-close="closeEndPop(0)">
      <div class="end-text">
        <template v-if="endPopType === 4">
          <p>剩余的金叶子数量将减去{{leafNumber}}</p>
          <p>这些金叶存在保险箱不可被消耗</p>
          <p>重新取出后，恢复正常。</p>
        </template>
        <template v-if="endPopType === 5||endPopType === 3">
          <p>{{leafNumber}}金叶子已被取出</p>
          <p>已可正常消耗</p>
        </template>
      </div>
    </sdk-popup>
  </section>
</template>

<script>
import Services from '@/services/SDK'
import { jumpUrl } from '@/utils/utils'
import { mapState, mapActions } from 'vuex'
export default {
  name: 'catSaveBox',
  data () {
    return {
      showOutPop: false,
      saveBoxInfo: {
        // balance: 222, // 保险箱余额
        // bankLv: 1, // 保险箱等级
        // isFreeze: 0, // 是否已冻结 0: 否 1是
        // isOpen: 1, // 是否已开通 0：未开通 1：已开通
        // maxNum: 1000, // 当前最大存入金叶数
        // nextNum: 10000 // 下级最大存入金页数
      },
      clickType: 0, // 0 未点击 1 点击存入 2 点击取出
      catFlag: 0,
      leafNumber: null,
      errorString: null,
      timer: '',
      showEndPop: false,
      endPopType: 4,
      isShowRed: false
    }
  },
  watch: {
    leafNumber (val) {
      if (!/^\d+$/.test(val) || val === 0) {
        return this.leafNumber = null, this.errorString = null
      }
      if (this.saveBoxStatus === 4) {
        if (val > this.userInfo.amount) {
          return this.leafNumber = this.userInfo.amount, this.errorString = '剩余金叶子不足!'
        }
        if (val > this.moreNumber) {
          return this.leafNumber = this.moreNumber, this.errorString = '超出保险箱容量!'
        }
        return
      }
      if (this.saveBoxStatus === 5) {
        if (val > this.saveBoxInfo.balance) {
          return this.leafNumber = this.saveBoxInfo.balance, this.errorString = '超出已存金叶子数量!'
        }
        return
      }
      return this.errorString = null
    },
    errorString (val) {
      if (val) {
        this.timer = setTimeout(() => {
          this.errorString = null
        }, 2000)
      } else {
        clearTimeout(this.timer)
      }
    },
    saveBoxStatus (val) {
      if (this.showOutPop) {
        switch (val) {
          case 2:
            this.$marchSetsPoint('A_H5PT0061001841') // H5平台-游戏内SDK-保险箱点击触发-权益已开启-金叶保险箱弹窗-存入触发-权益被冻结弹窗加载完成
            break
          case 3:
            this.$marchSetsPoint('A_H5PT0061001851') // H5平台-游戏内SDK-保险箱点击触发-权益已开启-金叶保险箱弹窗-取出触发-权益被冻结弹窗加载完成
            break
          case 4:
            this.$marchSetsPoint('A_H5PT0061001844') // H5平台-游戏内SDK-保险箱点击触发-权益已开启-金叶保险箱弹窗-存入触发-存入输入弹窗加载完成
            break
          case 5:
            this.$marchSetsPoint('A_H5PT0061001855') // H5平台-游戏内SDK-保险箱点击触发-权益已开启-金叶保险箱弹窗-取出触发-取出输入弹窗加载完成
            break
          default:
            break
        }
      }
    }
  },
  computed: {
    ...mapState(['userInfo']),
    moreNumber () {
      return this.saveBoxInfo.maxNum - this.saveBoxInfo.balance
    },
    saveBoxStatus () {
      if (!this.saveBoxInfo.isOpen) {
        return 0 // 未开启
      }
      if (this.clickType === 1 && this.saveBoxInfo.isFreeze) {
        return 2
      }
      if (this.clickType === 2 && this.saveBoxInfo.isFreeze) {
        return 3
      }
      if (this.clickType === 1) {
        return 4
      }
      if (this.clickType === 2) {
        return 5
      }
      return 1
    },
    title () {
      switch (this.saveBoxStatus) {
        case 0:
          return '权益未开启'
        case 2:
          return '权益被冻结 无法存入'
        case 3:
          return '权益被冻结'
        case 4:
          return '存入金叶子'
        case 5:
          return '取出金叶子'
        default:
          return `保险箱V${this.saveBoxInfo.bankLv}`
      }
    },
    endTitle () {
      switch (this.endPopType) {
        case 4:
          return '存入成功'
        case 3:
        case 5:
          return '取出成功'
      }
      return ''
    },
    popType () {
      switch (this.saveBoxStatus) {
        case 0:
        case 2:
        case 3:
          return 0
        default:
          return 1
      }
    },
    showCancel () {
      switch (this.saveBoxStatus) {
        case 1:
        case 3:
          return true
        default:
          return false
      }
    },
    cancelText () {
      switch (this.saveBoxStatus) {
        case 1:
          return '存入'
        case 3:
          return '全部取出'

        default:
          return ''
      }
    },
    confirmText () {
      switch (this.saveBoxStatus) {
        case 0:
          return '去招财猫开启权益'
        case 1:
          return '取出'
        case 2:
        case 3:
          return '去救猫'
        case 4:
          return '存入'
        case 5:
          return '取出'

        default:
          return ''
      }
    },
    inactivated () {
      switch (this.saveBoxStatus) {
        case 4:
        case 5:
          return !this.leafNumber
          break

        default:
          return false
          break
      }
    }
  },
  methods: {
    ...mapActions({
      _getUserInfo: 'GET_USERINFO'
    }),
    async handleCatSaveBox () {//招财猫保险箱
      try {
        this.$marchSetsPoint('A_H5PT0061001862') // H5平台-游戏内SDK-顶部保险箱按钮点击
      } catch (error) {

      }
      await this.init()
      this.clickType = 0
      this.leafNumber = null
      this.showOutPop = true
      this.$nextTick(() => {
        if (this.saveBoxStatus) {
          this.$marchSetsPoint('A_H5PT0061001836') // H5平台-游戏内SDK-保险箱点击触发-权益已开启-金叶保险箱弹窗加载完成
        } else {
          this.$marchSetsPoint('A_H5PT0061001833') // H5平台-游戏内SDK-保险箱点击触发-权益未开启弹窗加载完成
        }
        if (!localStorage.getItem('hadShowCatSaveBoxDot')) {
          localStorage.setItem('hadShowCatSaveBoxDot', true)
          this.isShowRed = false
        }
      })
    },
    async init () {
      const res = await Services.getBankStatus()
      const { data, code } = res.data
      if (code === 200) {
        this.saveBoxInfo = data
      } else {
        this.saveBoxInfo = {
          isOpen: 0
        }
      }
    },
    closeCat () {
      this.showOutPop = false
      switch (this.saveBoxStatus) {
        case 0:
          this.$marchSetsPoint('A_H5PT0061001835') // H5平台-游戏内SDK-保险箱点击触发-权益未开启弹窗-关闭点击
          break
        case 1:
          this.$marchSetsPoint('A_H5PT0061001840') // H5平台-游戏内SDK-保险箱点击触发-权益已开启-金叶保险箱弹窗-关闭点击
          break
        case 2:
          this.$marchSetsPoint('A_H5PT0061001843') // H5平台-游戏内SDK-保险箱点击触发-权益已开启-金叶保险箱弹窗-存入触发-权益被冻结弹窗-关闭点击
          break
        case 3:
          this.$marchSetsPoint('A_H5PT0061001854') // H5平台-游戏内SDK-保险箱点击触发-权益已开启-金叶保险箱弹窗-取出触发-权益被冻结弹窗-关闭点击
          break
        case 4:
          this.$marchSetsPoint('A_H5PT0061001848') // H5平台-游戏内SDK-保险箱点击触发-权益已开启-金叶保险箱弹窗-存入触发-存入输入弹窗-关闭点击
          break
        case 5:
          this.$marchSetsPoint('A_H5PT0061001859') // H5平台-游戏内SDK-保险箱点击触发-权益已开启-金叶保险箱弹窗-取出触发-取出输入弹窗-关闭点击
          break
        default:
          break
      }
    },
    closeEndPop (val) {
      switch (this.saveBoxStatus) {
        case 4:
          if (val) {
            this.$marchSetsPoint('A_H5PT0061001849') // H5平台-游戏内SDK-保险箱点击触发-权益已开启-金叶保险箱弹窗-存入触发-存入输入弹窗-存入成功点击好的
          } else {
            this.$marchSetsPoint('A_H5PT0061001850') // H5平台-游戏内SDK-保险箱点击触发-权益已开启-金叶保险箱弹窗-存入触发-存入输入弹窗-存入成功点击关闭
          }
          break

        case 5:
          if (val) {
            this.$marchSetsPoint('A_H5PT0061001860') // H5平台-游戏内SDK-保险箱点击触发-权益已开启-金叶保险箱弹窗-取出触发-取出输入弹窗-取出成功点击好的
          } else {
            this.$marchSetsPoint('A_H5PT0061001861') // H5平台-游戏内SDK-保险箱点击触发-权益已开启-金叶保险箱弹窗-取出触发-取出输入弹窗-取出成功点击关闭
          }
          break
        default:
          break
      }
      this.clickType = 0
      this.showEndPop = false
    },
    besure (val) {
      switch (val) {
        case 0:
          this.$marchSetsPoint('A_H5PT0061001834') // H5平台-游戏内SDK-保险箱点击触发-权益未开启弹窗-去招财猫开启权益点击
          this.goCat()
          break
        case 2:
          this.$marchSetsPoint('A_H5PT0061001842') // H5平台-游戏内SDK-保险箱点击触发-权益已开启-金叶保险箱弹窗-存入触发-权益被冻结弹窗-去招财猫解封权益点击
          this.goMall()
          break
        case 3:
          this.$marchSetsPoint('A_H5PT0061001853') // H5平台-游戏内SDK-保险箱点击触发-权益已开启-金叶保险箱弹窗-取出触发-权益被冻结弹窗-去招财猫解封权益点击
          this.goMall()
          break
        case 4:
          this.updateBankNumber(this.leafNumber)
          this.$marchSetsPoint('A_H5PT0061001846') // H5平台-游戏内SDK-保险箱点击触发-权益已开启-金叶保险箱弹窗-存入触发-存入输入弹窗-存入按钮点击
          break
        case 5:
          this.updateBankNumber(-this.leafNumber)
          this.$marchSetsPoint('A_H5PT0061001857') // H5平台-游戏内SDK-保险箱点击触发-权益已开启-金叶保险箱弹窗-取出触发-取出输入弹窗-取出按钮点击
          break

        default:
          if (this.saveBoxStatus === 4) {
            this.$marchSetsPoint('A_H5PT0061001847') // H5平台-游戏内SDK-保险箱点击触发-权益已开启-金叶保险箱弹窗-存入触发-存入输入弹窗-去提升保险箱容量点击
          } else if (this.saveBoxStatus === 5) {
            this.$marchSetsPoint('A_H5PT0061001858') // H5平台-游戏内SDK-保险箱点击触发-权益已开启-金叶保险箱弹窗-取出触发-取出输入弹窗-去提升保险箱容量点击
          } else {
            this.$marchSetsPoint('A_H5PT0061001839') // H5平台-游戏内SDK-保险箱点击触发-权益已开启-金叶保险箱弹窗-去提升保险箱容量点击
          }
          this.goCat()
          break
      }
    },
    saveLeaf () {
      this.leafNumber = null
      this.clickType = 1
      this.$marchSetsPoint('A_H5PT0061001837') // H5平台-游戏内SDK-保险箱点击触发-权益已开启-金叶保险箱弹窗-存入点击
    },
    getOutLeaf () {
      this.leafNumber = null
      this.clickType = 2
      this.$marchSetsPoint('A_H5PT0061001838') // H5平台-游戏内SDK-保险箱点击触发-权益已开启-金叶保险箱弹窗-取出点击
    },
    goMall () {
      jumpUrl({ url: '/xmWap/#/payment/' }, 'SDK')
    },
    goCat () {
      jumpUrl({ url: '/petcat/' }, 'SDK', '&catright=1')
    },
    allIn () {
      if (this.saveBoxStatus === 4) {
        this.leafNumber = this.moreNumber > this.userInfo.amount ? this.userInfo.amount : this.moreNumber
        this.$marchSetsPoint('A_H5PT0061001845') // H5平台-游戏内SDK-保险箱点击触发-权益已开启-金叶保险箱弹窗-存入触发-存入输入弹窗-全部存入点击
      } else if (this.saveBoxStatus === 5) {
        this.leafNumber = this.saveBoxInfo.balance
        this.$marchSetsPoint('A_H5PT0061001856') // H5平台-游戏内SDK-保险箱点击触发-权益已开启-金叶保险箱弹窗-取出触发-取出输入弹窗-全部取出点击
      }
    },
    async updateBankNumber (changeNum) {
      if (!changeNum) {
        if (this.saveBoxStatus === 3) {
          this.$Toast('没有可取金叶')
        }
        return
      }
      const res = await Services.updateBankNumber({ changeNum })
      const { data, code } = res.data
      switch (code) {
        case 200:
          this.showEndPop = true
          this.endPopType = this.saveBoxStatus
          this._getUserInfo()
          this.init()
          break
        case 201:
          this.errorString = '剩余金叶子不足!'
          break
        case 203:
          this.errorString = '超出已存金叶子数量!'
          break
        case 204:
          this.errorString = '超出保险箱容量!'
          break

        default:
          this.$Toast('交易失败，请稍后重试')
          break
      }
    },
    cancelCallback () {
      switch (this.saveBoxStatus) {
        case 1:
          this.saveLeaf()
          break
        case 3:
          this.updateBankNumber(-this.saveBoxInfo.balance)
          this.$marchSetsPoint('A_H5PT0061001852') // H5平台-游戏内SDK-保险箱点击触发-权益已开启-金叶保险箱弹窗-取出触发-权益被冻结弹窗-全部取出点击
          break
      }
    },
    confirmCallback () {
      switch (this.saveBoxStatus) {
        case 1:
          this.getOutLeaf()
          break
        default:
          this.besure(this.saveBoxStatus)
          break
      }
    },
    resize () {
      parent.scrollTo(0, 0)
    }
  },
  mounted () {
    if (!localStorage.getItem('hadShowCatSaveBoxDot')) {
      this.isShowRed = true
    }
  }
}
</script>

<style lang="less" scoped>
.bg-center(@url) {
  background-position: center center;
  background-repeat: no-repeat;
  background-size: 100% 100%;
  background-image: url(@url);
}
.cat-save-box {
  .status-0,
  .status-2,
  .status-3 {
    margin-top: 39px;
  }
  .status-1,
  .status-4,
  .status-5 {
    text-align: center;
    font-size: 18px;
    font-weight: bold;
    color: #88c0ff;
    line-height: 30px;
    padding: 0 54px 0 48px;
  }
  .status-1 {
    .capacity {
      margin-top: 10px;
    }
    .haved-leaf {
      color: #fff;
      font-size: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 24px 0;
      .leaf-icon {
        width: 34px;
        height: 34px;
        .bg-center('../../img/leaf-icon.png');
      }
    }
  }
  .input-wrap {
    margin-top: 20px;
    width: 100%;
    padding: 0 8px 22px;
    text-align: left;
    color: #707070;
    font-size: 20px;
    position: relative;
    input {
      height: 70px;
      line-height: 70px;
      font-size: 24px;
      background: #0866b3;
      width: 100%;
      padding: 0 20px;
      border-radius: 16px;
      color: #fff;
      &::-webkit-input-placeholder {
        color: #3d95dc;
      }
    }
    p {
      margin-top: 12px;
      margin-left: 2px;
      color: #88c0ff;
    }
    span {
      color: #ff4141;
      position: absolute;
      top: 20px;
      right: 22px;
      white-space: nowrap;
      animation: tikShow 0.5s ease-in-out 1;
    }
    a {
      color: #54fff1;
      text-decoration: underline;
    }
  }
  .cat_surplusinfo {
    text-align: left;
    padding-top: 18px;
    border-top: 2px rgba(101, 176, 249, 0.5) solid;
    font-size: 20px;
    .gobaoxian {
      color: #54fff1;
      text-decoration: underline;
    }
  }
  .end-text {
    margin-top: 126px;
    font-size: 20px;
    font-weight: bold;
    color: #fff;
    line-height: 30px;
    text-align: center;
  }
}
@keyframes tikShow {
  0% {
    transform: translate(0px, 0px) rotate(0deg);
  }
  2% {
    transform: translate(-1px, 1.5px) rotate(1.5deg);
  }
  4% {
    transform: translate(1.3px, 0px) rotate(-0.5deg);
  }
  6% {
    transform: translate(1.4px, 1.4px) rotate(-2deg);
  }
  8% {
    transform: translate(-1.3px, -1px) rotate(-1.5deg);
  }
  10% {
    transform: translate(1.4px, 0px) rotate(-2deg);
  }
  12% {
    transform: translate(-1.3px, -1px) rotate(-2deg);
  }
  14% {
    transform: translate(1.5px, 1.3px) rotate(1.5deg);
  }
  16% {
    transform: translate(1.5px, -1.5px) rotate(-1.5deg);
  }
  18% {
    transform: translate(1.3px, -1.3px) rotate(-2deg);
  }
  20% {
    transform: translate(1px, 1px) rotate(-0.5deg);
  }
  22% {
    transform: translate(1.3px, 1.5px) rotate(-2deg);
  }
  24% {
    transform: translate(-1.4px, -1px) rotate(2deg);
  }
  26% {
    transform: translate(1.3px, -1.3px) rotate(0.5deg);
  }
  28% {
    transform: translate(1.6px, -1.6px) rotate(-1.5deg);
  }
  30% {
    transform: translate(-1.3px, -1.3px) rotate(-1.5deg);
  }
  32% {
    transform: translate(-1px, 0px) rotate(2deg);
  }
  34% {
    transform: translate(1.3px, 1.3px) rotate(-0.5deg);
  }
  36% {
    transform: translate(1.3px, 1.6px) rotate(1.5deg);
  }
  38% {
    transform: translate(1.3px, -1.6px) rotate(1.5deg);
  }
  40% {
    transform: translate(-1.4px, -1px) rotate(-0.5deg);
  }
  42% {
    transform: translate(-1.4px, 1.3px) rotate(-0.5deg);
  }
  44% {
    transform: translate(-1.6px, 1.4px) rotate(0.5deg);
  }
  46% {
    transform: translate(-2.1px, -1.3px) rotate(-0.5deg);
  }
  48% {
    transform: translate(1px, 1.6px) rotate(1.5deg);
  }
  50% {
    transform: translate(1.6px, 1.6px) rotate(1.5deg);
  }
  52% {
    transform: translate(-1.4px, 1.6px) rotate(0.5deg);
  }
  54% {
    transform: translate(1.6px, -1px) rotate(-2deg);
  }
  56% {
    transform: translate(1.3px, -1.6px) rotate(-2deg);
  }
  58% {
    transform: translate(-1.3px, -1.6px) rotate(0.5deg);
  }
  60% {
    transform: translate(1.3px, 1.6px) rotate(-0.5deg);
  }
  62% {
    transform: translate(0px, 0px) rotate(-1.5deg);
  }
  64% {
    transform: translate(-1.6px, -1.6px) rotate(-2deg);
  }
  66% {
    transform: translate(1.6px, -1.6px) rotate(0.5deg);
  }
  68% {
    transform: translate(0px, -1.6px) rotate(-2deg);
  }
  70% {
    transform: translate(-1.6px, 1px) rotate(1.5deg);
  }
  72% {
    transform: translate(-1.6px, 1.6px) rotate(2deg);
  }
  74% {
    transform: translate(1.3px, -1.6px) rotate(-0.5deg);
  }
  76% {
    transform: translate(1.4px, 1px) rotate(-0.5deg);
  }
  78% {
    transform: translate(-1px, 1.4px) rotate(2deg);
  }
  80% {
    transform: translate(1.4px, 1.6px) rotate(2deg);
  }
  82% {
    transform: translate(-1.6px, -1.6px) rotate(-0.5deg);
  }
  84% {
    transform: translate(-1.4px, 1.4px) rotate(-2deg);
  }
  86% {
    transform: translate(1px, 1.4px) rotate(-2deg);
  }
  88% {
    transform: translate(-1.4px, 1.4px) rotate(-1.5deg);
  }
  90% {
    transform: translate(-1.6px, -1.6px) rotate(-2deg);
  }
  92% {
    transform: translate(-1.4px, 1.6px) rotate(2deg);
  }
  94% {
    transform: translate(-1.6px, -1.6px) rotate(-2deg);
  }
  96% {
    transform: translate(-1.4px, 1.3px) rotate(-2deg);
  }
  98% {
    transform: translate(1.3px, 1px) rotate(-0.5deg);
  }
}
</style>
