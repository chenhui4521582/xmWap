<template>
  <section class="cat-supply-box" :class="`status-${supplyBoxStatus}`">
    <sdk-popup v-model="showOutPop" :title="title" :type="popType" :showCancel="false"
      :confirmText="confirmText" :inactivated="inactivated" :close-flag="false"
      @on-close="closeCallback" @on-confirm="confirmCallback">
      <div class="text">
        <template v-if="supplyBoxStatus==1">
          <p>您的招财猫生病了</p>
          <p>任意付费可使猫自动恢复健康</p>
          <p>之后可继续使用</p>
        </template>
        <template v-else-if="supplyBoxStatus==2">
          <p>补给箱为招财猫Lv.86权益：</p>
          <p>每天可在补给箱领取一次金叶子，</p>
          <p> 一次最多可领{{maxAmount|conversion}}</p>
        </template>
        <template v-else-if="supplyBoxStatus==3||supplyBoxStatus==4">
          <div class="supply-box-icon"></div>
          <p v-if="supplyBoxStatus==3">最高<i>{{maxAmount}}</i>金叶子，每日限领<i>1</i>次</p>
          <p v-if="supplyBoxStatus==4">已领取<i v-if="receiveAmount">{{receiveAmount}}</i>金叶子</p>
        </template>
        <template v-else>
          <div class="award-bg">
            <img src="../../img/cat-leaf.png" alt="">
          </div>
          <p>金叶子x{{gainleafamount}}</p>
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
  name: '',
  components: {

  },
  data () {
    return {
      showOutPop: false,
      catSupplyInfo: {},
      receiveAmount: 0,
      supplyBoxStatus: 0,
      gainleafamount: 0,
      maxAmount: 0
    }
  },
  computed: {
    popType () {
      switch (this.supplyBoxStatus) {
        case 5:
          return 2
        default:
          return 0
      }
    },
    title () {
      switch (this.supplyBoxStatus) {
        case 1:
          return '权益被冻结'
        case 2:
          return '权益未开启'
        case 5:
          return '补给领取成功'
        default:
          return '补给箱'
      }
    },
    //1 权益被冻结 2权益未开启 3 要求领取补给 4 补给已领 5 补给领取成功
    confirmText () {
      switch (this.supplyBoxStatus) {
        case 1:
          return '去救猫'
        case 2:
          return '去招财猫开启权益'
        case 3:
          return '领取补给'
        case 4:
          return '今日已领'
        case 5:
          return '好的'

        default:
          return ''
      }
    },
    inactivated () {
      switch (this.supplyBoxStatus) {
        case 4:
          return true
        default:
          return false
      }
    }
  },
  filters: {
    conversion (value) {
      if (!value && value != 0) return ''
      let unit = ''
      let number = 0
      if (value >= 100000000) {
        unit = '亿'
        number = Math.floor(value / 1000000) / 100
      } else if (value >= 10000) {
        unit = '万'
        number = Math.floor(value / 100) / 100
      } else {
        number = Math.floor(value * 10) / 10
      }

      let numberArr = number.toString().split('.')
      if (Number(numberArr[1]) === 0) {
        return numberArr[0] + unit
      } else if (numberArr[1] && numberArr[1].split('')[1] === '0') {
        numberArr[1] = numberArr[1].split('')[0]
      }
      return numberArr.join('.') + unit
    },
  },
  mounted () {

  },
  methods: {
    async handleCatSupplyBox () {
      this.$marchSetsPoint('A_H5PT0061001713')//H5平台-游戏内SDK-顶部补给箱按钮点击
      const res = await Services.getCatSupplyReceiveStatus()
      const { data, code } = res.data
      if (code == 200 || code == 203) {//203 表示用户没猫 状态对应 权益未开启
        if (code == 200) {
          this.catSupplyInfo = data.receiveStatusInfos.filter(item => item.type == 1)
          this.maxAmount = this.catSupplyInfo[0] && this.catSupplyInfo[0].maxAmount || 0
          this.supplyBoxStatus = this.getSupplyBoxStatus()
        } else {
          this.supplyBoxStatus = 2
        }
        if (this.supplyBoxStatus) {
          if (this.supplyBoxStatus == 1) {
            this.$marchSetsPoint('A_H5PT0061001717')//H5平台-游戏内SDK-补给箱点击触发-权益被冻结弹窗加载完成
          } else if (this.supplyBoxStatus == 2) {
            this.$marchSetsPoint('A_H5PT0061001714')//H5平台-游戏内SDK-补给箱点击触发-权益未开启弹窗加载完成
          } else {
            if (this.supplyBoxStatus == 4) {
              this.$marchSetsPoint('A_H5PT0061001727')//H5平台-游戏内SDK-补给箱点击触发-奖励已领取弹窗加载完成
              this.receiveAmount = this.catSupplyInfo[0] && this.catSupplyInfo[0].receiveAmount || 0
            } else {
              this.$marchSetsPoint('A_H5PT0061001720')//H5平台-游戏内SDK-补给箱点击触发-奖励待领取弹窗加载完成
            }
          }
          this.showOutPop = true
        }
      }
    },
    getSupplyBoxStatus () {
      //1 权益被冻结 2权益未开启 3 要求领取补给 4 补给已领 5 补给领取成功
      if (!this.catSupplyInfo.length) {
        return 0
      } else {
        let item = this.catSupplyInfo[0]
        if (item.isExist) {
          if (item.frozenStatus) {
            return 1
          } else {
            if (item.receiveStatus) {
              return 4
            } else {
              return 3
            }
          }
        } else {
          return 2
        }
      }
    },
    closeCallback () {
      let points = ['A_H5PT0061001719', 'A_H5PT0061001716', 'A_H5PT0061001723', 'A_H5PT0061001729', 'A_H5PT0061001726']
      points[this.supplyBoxStatus - 1] && this.$marchSetsPoint(points[this.supplyBoxStatus - 1])//弹窗-关闭点击
      this.showOutPop = false
    },
    async confirmCallback () {
      //招财猫领取补给
      if (this.supplyBoxStatus == 4) return
      this.showOutPop = false
      if (this.supplyBoxStatus == 1) {
        this.$marchSetsPoint('A_H5PT0061001718')//去招财猫开启权益点击
        jumpUrl({ url: '/xmWap/#/payment/' }, 'SDK')
      } else if (this.supplyBoxStatus == 2) {
        this.$marchSetsPoint('A_H5PT0061001715')//去招财猫开启权益点击
        jumpUrl({ url: '/petcat/' }, 'SDK', '&catright=1')
      } else if (this.supplyBoxStatus == 3) {
        this.$marchSetsPoint('A_H5PT0061001721')//H5平台-游戏内SDK-补给箱点击触发-奖励待领取弹窗-领取补给点击
        let { data: data } = await Services.getCatSupplyReceive({ receiveType: 1 })
        if (data.code == 200) {
          this.$marchSetsPoint('A_H5PT0061001724')//H5平台-游戏内SDK-补给箱点击触发-奖励领取成功弹窗加载完成
          this.supplyBoxStatus = 5
          this.gainleafamount = data.data.amount || 0
          this.showOutPop = true
        }
      } else {
        this.$marchSetsPoint('A_H5PT0061001725')//H5平台-游戏内SDK-补给箱点击触发-奖励领取成功弹窗-好的点击
        this.showOutPop = false
      }
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
.cat-supply-box {
  &.status-1,
  &.status-2 {
    .text {
      margin-top: 39px;
    }
  }
  &.status-3,
  &.status-4 {
    .supply-box-icon {
      width: 256px;
      height: 160px;
      .bg-center('../../img/supply-box-icon.png');
      margin: 12px auto;
    }
    p {
      font-size: 20px;
      font-weight: bold;
      color: #fff;
      line-height: 30px;
      text-align: center;
      i {
        font-size: 24px;
        color: #ffed5e;
      }
    }
  }
  &.status-5 {
    .award-bg {
      width: 420px;
      height: 350px;
      margin: -30px auto 0;
      display: flex;
      align-items: center;
      justify-content: center;
      .bg-center('../../img/award-bg.png');
      img {
        max-height: 160px;
      }
    }
    p {
      font-size: 20px;
      font-weight: bold;
      color: #fff;
      line-height: 30px;
      text-align: center;
      margin-top: -42px;
      i {
        font-size: 24px;
        color: #ffed5e;
      }
    }
  }
}
</style>

<style scoped>
.cat-supply-box.status-3 >>> .sdk-popup-wrapper .main-container.type-0 .title,
.cat-supply-box.status-4 >>> .sdk-popup-wrapper .main-container.type-0 .title {
  margin-top: 51px;
}
</style>