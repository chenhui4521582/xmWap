<template>
  <div class="slot-machine" v-if="showAwards">
    <div class="mask"></div>
    <div class="wrapper">
      <div class="title">您{{timeLine}}参与的幸运摇奖机</div>
      <div class="awards">奖励{{awardsAmount}}金叶子</div>
      <div class="tips">已经发到您的账户啦,请注意查收。</div>
      <div class="closed" @click="hide"></div>
    </div>
  </div>
</template>

<script>
import Axios from '@/services/http/http'
import _get from 'lodash.get'
export default {
  name: 'slotMachine',
  data: ()=> ({
    showAwards: false,
    timeLine: '',
    awardsAmount: ''
  }),
  methods: {
    getAwards(callback) {
      let url = '//ops-api.beeplaying.com/ops/api/number-wheel/send-awards'
      Axios.post(url).then(res=> {
        // res = {
        //   data: {
        //     code: 200,
        //     data: {
        //       timeline: '10月17日',
        //       amount:1368999
        //     }
        //   }
        // }
        let {code, data, message} = _get(res, 'data')
        if(code === 200) {
          this.timeLine = _get(res, 'data.data.timeline')
          this.awardsAmount = _get(res, 'data.data.amount')
          if(this.timeLine && this.awardsAmount) {
            this.showAwards = true
            this.$marchSetsPoint('A_H5PT0203002136')
          }
        }
        callback({
          name:"slotMachine",
          isShow: this.showAwards
        })
      })
    },
    hide() {
      this.showAwards = false
      this.$parent.initDialog()
    },
    init(callback){
      this.getAwards(callback)
    }
  },
  mounted() {
    
  }

}
</script>
<style lang="less" scoped>
  .slot-machine {
    position: fixed;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    z-index: 11;
    .mask {
      position: absolute;
      width: 100%;
      height: 100%;
      z-index: 1;
      background: rgba(0,0,0,.7)
    }
    .wrapper {
      padding-top: 176px;
      position: absolute;
      left: 50%;
      top: 50%;
      z-index: 2;
      transform: translate(-50%, -50%);
      width: 622px;
      height: 685px;
      background: url(../img/slotMachine/award-bg.png) no-repeat center center;
      background-size: 100% 100%;
      overflow: visible;
      .title {
        height: 64px;
        line-height: 64px;
        font-size:24px;
        color:#F38F36;
        text-align: center;
      }
      .awards {
        margin-top: 260px;
        color: #D52319;
        font-size: 32px;
        text-align: center;
        font-weight:bold;
      }
      .tips {
        margin-top: 20px;
        color: #7D2F14;
        font-size: 24px;
        text-align: center;
      }
      .closed {
        position: absolute;
        left: 50%;
        bottom: -100px;
        z-index: 3;
        transform: translate(-50%, 0);
        width: 60px;
        height: 60px;
        background: url(../img/slotMachine/close.png) no-repeat center center;
        background-size: 100% 100%;
      }
    }
  }
</style>