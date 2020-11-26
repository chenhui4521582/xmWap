<template>
  <Modal v-model="dialogShow" :title="title" :type="2">
    <div class="wrapper">
      <img v-if="statusCode===104" src="./image/out-of-stock.png" alt="">
      <img v-if="statusCode===102" src="./image/short.png" alt="">
      <img v-if="statusCode===200" src="./image/succecc.png" alt="">
      <img v-if="statusCode===103" src="./image/succecc.png" class="img-size" alt="">
      <div v-if="statusCode===102" class="content-text"> 您的话费券不足<br />快去欢乐套圈快速赚话费吧</div>
      <div v-if="statusCode===104" class="content-text">当前商品库存不足<br />去看看其他商品吧</div>
      <div v-if="statusCode===103" class="content-text"> 每日限购一次<br />请明天再来~</div>
      <div v-if="statusCode===200" class="content-text">
        <template v-if="awardsType==50">
          审核通过后将发放至酷彩吧
          <div @click="openIssues()" class="btn_howToUse">如何使用</div>
        </template>
        <template v-else>
          换取成功<br />快去领取吧
        </template>
      </div>
    </div>
    <template v-if="statusCode===200 && awardsType==46" v-slot:footer>
      <div class="btn" @click="closeDialog()">返回</div>
      <div class="btn confirm"   @click="goMiniLottery">去夺宝</div>
    </template>
    <template v-else v-slot:footer >
      <div class="btn" @click="closeDialog()">返回</div>
      <div class="btn confirm" v-if="statusCode===102 || statusCode===200 && awardsType===1" @click="earnMoney">去赚话费</div>
      <div class="btn confirm" v-if="statusCode===104" @click="lookMall">看看其他</div>
      <div class="btn confirm" v-if="statusCode===200 && awardsType!==1" @click="checkprize">{{awardsType==50?'去查看':awardsType==48?'去使用':'去领取'}}</div>
    </template>
  </Modal>
</template>
<script>
import { getRingServerStatus } from '@/services/shop'
import { jumpUrl } from '@/utils/utils'
export default {
  name: 'dialogPage',
  data () {
    return {
      dialogShow: this.value
    }
  },
  computed:{
    title(){
      if(this.awardsType==50){
        return '换取成功'
      }
      return '温馨提示'
    }
  },
  props: {
    value: {
      type: Boolean,
      default: true
    },
    statusCode: {
      type: [Number, String],
      default: ''
    },
    awardsType: {
      type: [Number, String],
      default: ''
    }
  },
  watch: {
    value (val) {
      this.dialogShow = val
    },
    dialogShow (val) {
      this.$emit('input', val)
    }
  },
  methods: {
    openIssues(){
      this.$router.push({
        name: 'issues'
      })
    },
    closeDialog(){
      this.$emit('on-close');
      this.dialogShow=false
    },
    // 去赚话费
    async earnMoney () {
      this.dialogShow = false;
      this.$marchSetsPoint('A_H5PT0035000638', {
        residual_phone: this.$route.query['accountBalance']
      })
      this.goRing()
    },
    // 去看看其他
    async lookMall () {
      this.$marchSetsPoint('A_H5PT0035001268', {
        residual_phone: this.$route.query['accountBalance']
      })
      history.go(-1)
    },
    // 去领奖
    async checkprize () {
      this.dialogShow = false;
      this.$marchSetsPoint('A_H5PT0035001267', {
        residual_phone: this.$route.query['accountBalance']
      })
        this.$emit('on-checkprize')
    },
    //去小额夺宝
    goMiniLottery() {
      let CHANNEL = localStorage.getItem('APP_CHANNEL') || 100070
      let TOKEN = localStorage.getItem('ACCESS_TOKEN') || 100070
      window.location.href = `https://wap.beeplaying.com/activities/miniLottery.html#/?channel=${CHANNEL}&token=${TOKEN}`
    },
    _getRingServerStatus () {
      getRingServerStatus().then(res => {
        let { data, code } = res.data
        if (code === 200) {
          if (data.type === '1' || (data.distanceStop < 0 && data.distanceStart >= 0)) {
            this.ringData = data
          }
        }
      })
    },
    goRing() {
      let url = this.ringData.type == 2 ? '/ring2/' : '/ring/'
      jumpUrl({url})
    }
  },
  mounted() {
    this._getRingServerStatus()
  }
}
</script>
<style lang="less" scoped>
.wrapper {
  width: 100%;
  text-align: center;
  img {
    width: 220px;
  }
  .content-text {
    font-size: 24px;
    margin-top: 24px;
    color: #888888;

    .btn_howToUse {
      color: #5186CA;
      font-size: 24px;
      font-weight: 600;
      margin-top: 15px;
    }
  }
  .img-size {
    width: 167px;
    height: 172px;
  }
}
</style>

