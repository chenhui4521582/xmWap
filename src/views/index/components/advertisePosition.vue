<template>
  <div class="advertisePosition" v-if="img" @click="goUrl">
    <img :src="img | filter" alt="">
  </div>
</template>
<script>
  import Services from '@/services/index'
  import _get from 'lodash.get'
  import { jumpUrl } from '@/utils/utils'

  export default {
    name: 'exchangeEnter',
    data: () => ({
      img: '',
      url: ''
    }),
    methods: {
      _getAdvertisePosition() {
        Services.getAdvertisePosition().then(res => {
          let { code, data, message } = _get(res, 'data')
          if (code == 200) {
            this.img = _get(res, 'data.data[0].image', '')
            this.url = _get(res, 'data.data[0].url', '')
          }
        })
      },
      goUrl() {
        this.url && jumpUrl({ url: this.url })
      }
    },
    mounted() {
      this._getAdvertisePosition()
    }
  }
</script>
<style scoped lang="less">
  .advertisePosition {
    margin: 20px 0;
    padding: 0 24px;
    display: flex;
    img {
      vertical-align: top;
      width: 100%;
      height: 120px;
    }
  }
</style>
