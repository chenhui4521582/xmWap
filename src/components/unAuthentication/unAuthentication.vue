<template>
  <div class="unAuthentication">
    <Modal v-model="showModal" title="温馨提示" :closeButtonShow=false :saveText="'实名认证通道'"
      @on-save="toAuthentication" @on-close="closed">
      <div class="center">
        亲爱的玩家<br>
        按照《网络游戏管理暂行办法》的有关要求及您的个人权益保障，请尽快完成实名认证。
      </div>
    </Modal>
  </div>
</template>
<script>
import Services from '@/services/authentication'
import _get from 'lodash.get'
export default {
  name: 'unAuthentication',
  data: () => ({
    showModal: false
  }),
  methods: {
    closed () {
      this.$parent.initDialog()
    },
    /** 去实名认证 **/
    toAuthentication () {
      this.showModal = false
      let { name } = this.$route
      if (name == 'index') {
        this.$marchSetsPoint('A_H5PT0019001217')
      }
      if (name == 'my') {
        this.$marchSetsPoint('A_H5PT0021001211')
      }
      this.$router.push({ name: 'authentication' })
    },
    /** 获取是否需要实名认证 **/
    _getAuthentication (params, callback) {
      Services.isAuthentication(params).then(res => {
        let { code, data } = _get(res, 'data', '')
        let { popUpNonAge, authRemind, isConfigChannel, countDownTime } = _get(res, 'data.data', {})
        if (code === 200) {
          this.showModal = !!authRemind
          // if(popUpNonAge) {
          //   let id = JSON.parse(localStorage.getItem('user_Info')).userId
          //   window.location.href = `https://wap.beeplaying.com/xmWap/#/riskManagement?id=${id}&type=juveniles`
          // }
          callback({
            name: 'unAthentication',
            isShow: this.showModal
          })
        }
      })
    },
    init (callback) {
      let { name } = this.$route
      if (name == 'index') {
        this._getAuthentication('admin', callback)
        this.$marchSetsPoint('A_H5PT0019001216')
      }
      if (name == 'my') {
        this._getAuthentication('center', callback)
        this.$marchSetsPoint('A_H5PT0021001210')
      }
    }
  },
  mounted () {
    //this.init()
  }
}
</script>
<style lang="less" scoped>
.center {
  font-size: 24px;
  color: #888888;
  line-height: 36px;
}
</style>