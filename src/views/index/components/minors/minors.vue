<template>
  <section class="minors">
    <Modal v-model="showMinorsPop" :type="2" :title="'温馨提示'" :closeButtonShow="false" saveText="知道了"
      @on-save="sure">
      <div class="close_content">
        <p class="content-text" v-if="poptype===1">
          根据防沉迷规定，未成年人在每日22点<br />至次日8点不可进行游戏。
        </p>
        <p class="content-text" v-if="poptype===2">
          您已累计在线游戏1.5小时，根据防沉<br />迷规定，您本日不可继续游戏，请及时<br />下线。
        </p>
      </div>
    </Modal>
  </section>
</template>

<script>
import indexServices from '@/services/index'
export default {
  name: 'minors',
  components: {

  },
  data () {
    return {
      showMinorsPop: false,
      poptype: 1
    }
  },
  mounted () {
  },
  methods: {
    async init (callback) {
      let res = await indexServices.getUserIsAdult()
      let { code, data } = res.data
      if (code === 200 && !data) {
        let currentHours = new Date().getHours()
        if (currentHours >= 22 || currentHours <= 7) {
          this.showMinorsPop = true
          this.poptype = 1
        } else {
          this.checkUserOnlineTime()
        }
        return
      }
      callback({
        name: 'minors',
        isShow: false
      })
    },
    async checkUserOnlineTime () {
      let res = await indexServices.checkUserOnlineTime(0)
      let { code, data } = res.data
      if (code === 200 && data) {
        this.showMinorsPop = true
        this.poptype = 2
      }
    },
    sure () {
      this.showMinorsPop = false
      localStorage.removeItem('ACCESS_TOKEN')
      this.$parent.initDialog()
      window.location.reload()
    }
  }
}
</script>

<style lang="less" scoped>
.close_content {
  .content-text {
    white-space: nowrap;
    margin-top: 0;
    text-align: left;
  }
}
</style>
