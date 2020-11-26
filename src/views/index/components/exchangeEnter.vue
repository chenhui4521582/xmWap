<template>
  <div class="exchange" v-if="img" @click="goRing">
    <img :src="img | filter" alt="">
  </div>
</template>
<script>
import Services from '@/services/index'
import _get from 'lodash.get'
import { getRingServerStatus } from '@/services/shop'
import { jumpUrl } from '@/utils/utils'
export default {
  name: 'exchangeEnter',
  data: ()=> ({
    img: ''
  }),
  methods: {
    _getExchangeEnter() {
      Services.getExchangeEnter().then(res=> {
        let {code, data, message} = _get(res, 'data')
        if(code == 200) {
          this.img = _get(res,'data.data[0].image', '')
          if(this.img) {
            this.$emit('callback', true)
          }else {
            this.$emit('callback', false)
          }
        }
      })
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
      this.$marchSetsPoint('A_H5PT0019002353')
      let url = this.ringData.type == 2 ? '/ring2/' : '/ring/'
      jumpUrl({url})
    }
  },
  mounted() {
    this._getExchangeEnter()
    this._getRingServerStatus()
  }
}
</script>
<style scoped lang="less">
.exchange {
  margin-top: 40px;
  padding: 0 24px;
  img {
    vertical-align: top;
    width: 100%;
    height: 120px;
  }
}
</style>