<template>
  <section class="eraser">
    <span class="eraser-btn" @click="showClearModal">擦除</span>
    <!-- 擦除弹出框 -->
    <Modal v-model="showModal" :title="clearTitle" :closeButtonShow=false @on-save="removeProfit"
      :buttonShow="isCat&&(privilegeTime>0&&clearData.privilegeState===1||clearData.privilegeState===0||clearData.privilegeState===2)||!isCat&&normalTime>0"
      @on-close="closeModal">
      <div v-if="isCat" class="remove-wrap">
        <div v-if="privilegeTime>0&&clearData.privilegeState===1">
          因您的招财猫尊贵等级,享每自然周额外1次免费擦除本期亏损,限当周使用。
          <p class="font20" style="color:#BBBBBB;">* 周一到周日为一个自然周</p>
        </div>
        <div v-if="privilegeTime<=0&&clearData.privilegeState===1">
          <img src="../img/notimes-icon.png" alt="">
          <div class="font24" style="text-align:center;margin:0.3rem 0 0;">本周机会已用完</div>
          <div class="font20" style="text-align:center;color:#8B8B8C;">
            提升招财猫等级可获得更多权益
          </div>
        </div>
        <div v-if="clearData.privilegeState===0">
          赠送免费擦除为招财猫Lv.65权益：<br>
          在原有的擦除机会之外，可免费进行额外擦除。
        </div>
        <div v-if="clearData.privilegeState===2">
          您的招财猫生病了，此项招财猫权益已经被冻结。
        </div>
      </div>
      <div v-else class="remove-wrap">
        <div v-if="normalTime>0">橡皮擦可擦除当前亏损, 本期还可使用{{normalTime}}次,
          <span v-if="currentUseTimes==0">本次擦除免费</span>
          <span v-else>本次擦除需要花费{{currentUseTimes}}金叶子</span>
        </div>
        <div v-else>
          <img src="../img/notimes-icon.png" alt="">
          <div class="font24" style="text-align:center;margin:0.3rem 0 0;">原有机会已用完</div>
        </div>
      </div>
      <wf-button :long=true v-if="isCat&&clearData.privilegeState===0" slot="footer"
        @click="goCat()">去招财猫开启权益</wf-button>
      <wf-button :long=true v-if="isCat&&clearData.privilegeState===2" slot="footer"
        @click="goCat()">去招财猫解封权益</wf-button>
      <wf-button :long=true
        v-if="!isCat&&normalTime>0 || isCat&&clearData.privilegeState===1&&privilegeTime>0"
        slot="footer" @click="removeProfit()">确定擦除</wf-button>
      <div slot="other">
        <div class="more-des"
          v-if="isCat&&clearData.privilegeState===1&&privilegeTime>0 || isCat&&privilegeTime<=0&&clearData.privilegeState===1"
          @click="goCat()">去获取更多权益<i class="iconfont icon-next"></i></div>
        <div @click="toggleType()" class="other actived">
          <span>{{isCat?'原有擦除机会':'招财猫赠送擦除'}}</span>
          <span v-if="isCat">（{{normalTime}}/{{clearData.normalTotalTime}}）</span>
          <span v-else>（{{privilegeTime}}/{{clearData.privilegeTotalTime}}）</span>
          <i class="iconfont icon-up"></i>
        </div>
      </div>
    </Modal>
    <Modal v-model="showBigModal" title="大额亏损专属擦除" :closeButtonShow="true" :is-timeout="true"
      @on-close="closeBigModal">
      <div class="big-price remove-wrap">
        当您的亏损达到<em>{{Math.abs(clearData.lossThreshold)}}</em>时，赠送您专属擦除机会，该擦除
        <em>
          免费
        </em>
      </div>
      <wf-button :long=true slot="footer" @click="removeBigProfit()">使用专属擦除</wf-button>
      <p class="timeout-desc font24" slot="other">
        限时实验功能
      </p>
    </Modal>
    <!-- 擦除引导弹框 -->
    <template v-if="firstClearShow">
      <div class="tips">
        <img class="inner-img" src="../img/tips.png" alt="">
      </div>
      <div class="hand-click">
        <img class="inner-img" src="../img/hand-click.png" alt="">
      </div>
      <div class="hand">
        <img class="inner-img" src="../img/hand.png" alt="">
      </div>
    </template>
  </section>
</template>

<script>
import Services from '@/services/profit'
import _get from 'lodash.get'
import { jumpUrl } from '@/utils/utils'
export default {
  name: '',
  props: {
    firstClearShow: {
      type: Boolean,
      default: false
    },
    amount: {
      type: Number,
      default: 0
    }
  },
  inject: ['gameType', 'screenType'],
  data () {
    return {
      /** 是否显示擦除弹出框 **/
      showModal: false,
      /** 是否显示大额擦除弹出框 **/
      showBigModal: false,
      /** 橡皮擦数据 **/
      clearData: {},
      isCat: false
    }
  },
  mounted () {
    this._getRemoveData()
  },
  computed: {
    /** 当前擦除需要多少金叶子 **/
    currentUseTimes () {
      return this.clearData.normalAmount
    },
    /** 橡皮檫头部文字 **/
    clearTitle () {
      if (this.isCat) {
        if (this.clearData.privilegeState === 0) {
          return '赠送擦除未开启'
        }
        if (this.clearData.privilegeState === 2) {
          return '赠送擦除被冻结'
        }
        else {
          return `招财猫每周赠1次(${this.privilegeTime}/${this.clearData.privilegeTotalTime})`
        }
      } else {
        return `擦除本期亏损(${this.normalTime}/${this.clearData.normalTotalTime})`
      }
    },
    normalTime () {
      return this.clearData.normalTotalTime - this.clearData.normalUseTime
    },
    privilegeTime () {
      return this.clearData.privilegeTotalTime - this.clearData.privilegeUseTime
    }
  },
  methods: {
    /** 获取擦除数据 **/
    _getRemoveData () {
      Services.getRemoveData().then(res => {
        let { code, data } = res.data
        if (code === 200) {
          this.clearData = data
          this.isCat = !(this.clearData.normalUseTime < this.clearData.normalTotalTime)
        }
      })
    },
    /** 擦除盈利 **/
    removeProfit () {
      try {
        if (this.isCat) {
          this.$marchSetsPoint('A_H5PT0025001874', { lost_leaf: this.amount }) // H5平台-盈利榜-擦除按钮点击-机会未用完-招财猫赠送擦除区域点击-权益已开启-额外机会未用完-招财猫区域弹窗-确定擦除点击
        } else {
          this.$marchSetsPoint('A_H5PT0025001865', { lost_leaf: this.amount }) // H5平台-盈利榜-擦除按钮点击-机会未用完-擦除本期亏损弹窗-确认擦除按钮点击
        }
      } catch (error) {

      }
      Services.clear(`?category=${this.isCat ? 2 : 1}`).then(res => {
        let { code, message } = res.data
        if (code === 200) {
          this.$Toast('擦除成功')
          this.$emit('getMyProfit')
        } else {
          this.$Toast(message)
        }
        this.showModal = false
      })
    },
    /** 显示擦除提示框 **/
    showClearModal () {
      if (this.amount < this.clearData.lossThreshold) {
        this.$marchSetsPoint('A_H5PT0019004106', { edition: this.screenType, project_id: this.gameType }) // H5平台-大额专属擦除弹窗完成
        this.showBigModal = true
        return
      }
      this.$marchSetsPoint('A_H5PT0025001863') // H5平台-盈利榜-擦除按钮点击
      this.showModal = true
      this.$nextTick(() => {
        if (this.isCat) {
          if (this.clearData.privilegeState === 0) {
            this.$marchSetsPoint('A_H5PT0025001868') // H5平台-盈利榜-擦除按钮点击-机会未用完-招财猫赠送擦除区域点击-权益未开启弹窗加载完成
          } else if (this.clearData.privilegeState === 1) {
            if (this.privilegeTime > 0) {
              this.$marchSetsPoint('A_H5PT0025001873') // H5平台-盈利榜-擦除按钮点击-机会未用完-招财猫赠送擦除区域点击-权益已开启-额外机会未用完-招财猫区域弹窗加载完成
            } else {
              this.$marchSetsPoint('A_H5PT0025001872') // H5平台-盈利榜-擦除按钮点击-机会未用完-招财猫赠送擦除区域点击-权益已开启-额外机会已用完-弹窗加载完成
            }
          } else if (this.clearData.privilegeState === 2) {
            this.$marchSetsPoint('A_H5PT0025001870') // H5平台-盈利榜-擦除按钮点击-机会未用完-招财猫赠送擦除区域点击-权益已开启但被冻结弹窗加载完成
          }
        } else {
          this.$marchSetsPoint('A_H5PT0025001864') // H5平台-盈利榜-擦除按钮点击-机会未用完-擦除本期亏损弹窗加载完成
        }
      })
    },
    goCat () {
      try {
        if (this.clearData.privilegeState === 0) {
          this.$marchSetsPoint('A_H5PT0025001869') // H5平台-盈利榜-擦除按钮点击-机会未用完-招财猫赠送擦除区域点击-权益未开启弹窗加载-去招财猫开启权益点击
        } else if (this.clearData.privilegeState === 2) {
          this.$marchSetsPoint('A_H5PT0025001871') // H5平台-盈利榜-擦除按钮点击-机会未用完-招财猫赠送擦除区域点击-权益已开启但被冻结弹窗-去招财猫解封权益点击
        } else if (this.clearData.privilegeState === 1) {
          this.$marchSetsPoint('A_H5PT0025001875') // H5平台-盈利榜-擦除按钮点击-机会未用完-招财猫赠送擦除区域点击-权益已开启-额外机会未用完-招财猫区域弹窗-去获取更多权益点击
        }
      } catch (error) {

      }
      jumpUrl({ url: '/petcat/' }, null, '&catright=1')
    },
    closeModal () {
      if (this.isCat) {
        this.$marchSetsPoint('A_H5PT0025001876') // H5平台-盈利榜-擦除按钮点击-机会未用完-招财猫赠送擦除区域点击-权益已开启-额外机会未用完-招财猫区域弹窗-关闭点击
      } else {
        this.$marchSetsPoint('A_H5PT0025001866') // H5平台-盈利榜-擦除按钮点击-机会未用完-擦除本期亏损弹窗-关闭点击
      }
    },
    removeBigProfit () {
      Services.clear('?category=3').then(res => {
        this.$marchSetsPoint('A_H5PT0019004107', {
          edition: this.screenType, project_id: this.gameType, lost_leaf: this.amount
        }) // H5平台-大额专属擦除弹窗-使用专属擦除点击
        let { code, message } = res.data
        if (code === 200) {
          this.$Toast('擦除成功')
          this.$emit('getMyProfit')
        } else {
          this.$Toast(message)
        }
        this.showBigModal = false
      })
    },
    closeBigModal () {
      this.$marchSetsPoint('A_H5PT0019004108', { edition: this.screenType, project_id: this.gameType }) // H5平台-大额专属擦除弹窗-专属擦除弹窗关闭
    },
    toggleType () {
      if (this.isCat) {
        this.$marchSetsPoint('A_H5PT0025001877') // H5平台-盈利榜-擦除按钮点击-机会未用完-招财猫赠送擦除区域点击-权益已开启-额外机会未用完-招财猫区域弹窗-原有擦除机会点击
      } else {
        this.$marchSetsPoint('A_H5PT0025001867') // H5平台-盈利榜-擦除按钮点击-机会未用完-擦除本期亏损弹窗-招财猫赠送擦除区域点击
      }
      this.isCat = !this.isCat
    }
  }
}
</script>

<style lang="less" scoped>
.eraser {
  display: inline-block;
  align-items: center;
  font-size: 0;
  position: relative;
  .eraser-btn {
    width: 24px;
    height: 15px;
    line-height: 15px;
    margin-left: 5px;
    text-align: center;
    background: #ffbc00;
    border-radius: 10px;
    font-size: 20px;
    color: #fff;
    font-weight: normal;
    white-space: nowrap;
  }
  img {
    max-width: 220px;
    display: block;
    margin: auto;
  }
  .remove-wrap {
    font-size: 24px;
    color: #000;
    text-align: left;
    font-weight: normal;
    line-height: 36px;
  }
  .big-price {
    padding: 50px 0;
    color: #888;
    text-align: center;
    em {
      color: #ff4141;
    }
  }
  .actived {
    color: #ff7800;
  }
  .more-des {
    margin-top: -15px;
    font-size: 24px;
    margin-bottom: 24px;
    color: #5186ca;
    font-weight: 500;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    .icon-next {
      font-size: 18px;
      &::before {
        position: relative;
        top: 3px;
      }
    }
  }
  .other {
    border-top: 1px solid #e6e6e6;
    font-weight: normal;
    font-size: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    span {
      display: inline-block;
      height: 90px;
      line-height: 90px;
    }
    .icon-up {
      background: #f0f0f0;
      width: 30px;
      height: 30px;
      border-radius: 15px;
      position: relative;
      &::before {
        position: absolute;
        color: #000;
        top: 50%;
        left: 50%;
        transform: translate(-37%, -60%) scale(0.8);
      }
    }
  }
  .tips {
    position: absolute;
    top: -90px;
    left: -68px;
    width: 190px;
    height: 71px;
  }
  .hand-click {
    position: absolute;
    width: 59px;
    height: 59px;
    left: 29px;
    top: 9px;
    z-index: 20;
    animation: hand-click 1s infinite 1s;
  }
  .hand {
    position: absolute;
    width: 150px;
    height: 131px;
    left: 22px;
    top: 30px;
    z-index: 20;
    animation: hand 1s infinite 1s;
  }
  .inner-img {
    vertical-align: top;
    width: 100%;
    height: 100%;
  }
  .timeout-desc {
    color: #888;
    padding-bottom: 40px;
  }
}
.font20 {
  font-size: 20px;
  line-height: 30px;
}
.font24 {
  font-size: 24px;
  line-height: 36px;
}
@keyframes hand {
  0% {
    transform: rotateZ(0deg);
  }
  50% {
    transform: rotateZ(10deg);
  }
  100% {
    transform: rotateZ(0deg);
  }
}
@keyframes hand-click {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
</style>
