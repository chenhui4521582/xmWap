<template>
  <section>
    <section class="tips" @click="hanleClick" v-if="isShow">
      <img :src="img" alt="">
    </section>
    <popup v-model="showPopup" :popupType="popupType" />
  </section>
</template>

<script>
import Services from '../../../../services/index'
import _get from 'lodash.get'
import popup from './btcPopup'
import {mapState, mapMutations} from 'vuex'
export default {
  name: '',
  components: {
    popup
  },
  data () {
    return {
      isShow: false,
      haveRecord: false,
      showPopup: false,
      popupType: 5
    }
  },
  computed: {
    ...mapState(['turntableRefresh']),
    img () {
      if (this.haveRecord) {
        return require('../../img/btc/has-award-chance.gif')  
      }
      return require('../../img/btc/has-lottery-chance.gif')
    }
  },
  mounted () {
    this.btcWheelEntrance()
  },
  methods: {
    ...mapMutations({
      _setTurntableRefresh: 'SET_TURNTABLEREFRESH'
    }),
    async btcWheelEntrance () {
      const res = await Services.btcWheelEntrance()
      this.isShow = _get(res, 'data.data.show', false)
      this.haveRecord = _get(res, 'data.data.haveRecord', false)
      if (!this.isShow) {
        this.showBtc()
      }
    },
    hanleClick () {
      if (this.haveRecord) {
        this.$marchSetsPoint('A_H5PT0019003704') // H5平台-首页-迁移转盘入口-领取点击
        this.showPopup = true
      } else {
        this.$marchSetsPoint('A_H5PT0019003703') // H5平台-首页-迁移转盘入口-抽奖点击
        this.showBtc()
      }
    },
    showBtc () {
      this.$emit('show-btc')
      this._setTurntableRefresh(0)
    }
  },
  watch: {
    turntableRefresh (value) {
      if(value > 0) {
        this.btcWheelEntrance()
      }
    }
  }
}
</script>

<style lang="less" scoped>
.tips {
  margin: 20px 24px 0;
  img {
    vertical-align: top;
    width: 100%;
    height: 100%;
  }
}
</style>
