<template>
  <Modal v-model="showModal" title="温馨提示" :saveText="saveText" @on-save="btnClick" @on-close="hide">
    <div class="renren_turntanle_enter">
      <i>{{amount}}叶子 </i>已到账
    </div>
  </Modal>
</template>
<script>
  import indexServices from '@/services/index'
  import newUtils,{ jumpUrl } from '@/utils/utils'
  export default {
    name: 'turntableEnter',
    data: () => ({
      showModal: false,
      state: 0,
      saveText: '',
      amount: 0,
      url: ''
    }),
    methods: {
      /** 获取接口数据 **/
      async _getEnter() {
        try {
          let { code, data } = (await indexServices.getUserAwards()).data
          if (code == 200) {
            this.showModal = data.show
            if (this.showModal) {
              this.saveText = data.state == 0 ? '玩游戏得原画勋章' : '赚话费得原画勋章'
              this.amount = data.amount
              this.state = data.state
              this.url = data.url
              if (this.state == 0) {
                this.$marchSetsPoint('A_H5PT0019002299')
              }
              if (this.state == 1) {
                this.$marchSetsPoint('A_H5PT0019002296')
              }
            }
          }
          callback({
            name: 'renrenTurntableEnter',
            isShow: this.showModal
          })
        } catch (e) {

        }
      },
      btnClick() {
        if (this.state == 0) {
          this.$marchSetsPoint('A_H5PT0019002300')
          jumpUrl({
            url: this.url||'/billiards'
          })
        }
        if (this.state == 1) {
          this.$marchSetsPoint('A_H5PT0019002297')
          jumpUrl({
            url: 'https://wap.beeplaying.com/xmWap/#/mall'
          })
        }
      },
      /** 关闭 **/
      hide() {
        if (this.state == 0) {
          this.$marchSetsPoint('A_H5PT0019002301')
        }
        if (this.state == 1) {
          this.$marchSetsPoint('A_H5PT0019002298')
        }
        this.$parent.initDialog()
      },
      /** 初始化 **/
      init(callback) {
        let channel = localStorage.getItem('APP_CHANNEL')
        if (channel == 100049) {
          this._getEnter(callback)
        }else{
          callback({
            name: 'renrenTurntableEnter',
            isShow: false
          })
        }
      }
    },
    watch:{
      showModal(value){
        if(value) {
          newUtils.ScrollNoMove()
        }else {
          newUtils.ScrollMove()
        }
      }
    }
  }
</script>
<style lang="less" scoped>
  .renren_turntanle_enter {
    font-size: 24px;
    color: #888888;
    text-align: center;
  }
</style>
