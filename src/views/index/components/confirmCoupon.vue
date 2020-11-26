<template>
  <!-- 领取弹出框 -->
  <awards-dialog
    v-model="showAwards"
    :awards="AwardsData.awards"
    :explainText="AwardsData.explainText"
    :confirmBtnText="AwardsData.confirmBtnText"
    @callback="awardsCallback"
    @closedCallback="closedDialog"
  />
</template>

<script>
import { bottomBarJump } from '@/utils/utils'
import Services from '@/services/index'
import _get from 'lodash.get'
export default {
  name: 'confirmCoupon',
  data: () => ({
    showAwards: false,
    isBlindBox: null,
    isBlindBoxCoupon: false,
    AwardsData: {
      awards: {
        awardsImage: '',
        awardsName: ''
      },
      confirmBtnText: '立即使用',
      recommend: {
        cdnImage: '',
        url: ''
      },
      explainText: {
        text: '可到“我的-优惠券”页面中查看',
        color: '#ACACAC'
      }
    }
  }),
  methods: {
    init(callback) {
      Services.confirmCoupon().then(res => {
        this.AwardsData.awards.awardsImage = _get(res, 'data.data.image', '')
        this.AwardsData.awards.awardsName = _get(res, 'data.data.instructions', '')
        let gameProp = _get(res, 'data.data.gameProp', '')
        if (gameProp === 3) {
          if (res.data.data.gameId === 28) this.isBlindBoxCoupon = true
        }
        if(this.AwardsData.awards.awardsImage && this.AwardsData.awards.awardsName) {
          this.showAwards = true
          this.$marchSetsPoint('A_H5PT0019001733')
        }
        if(callback){
          callback({
            name:'confirmCoupon',
            isShow:this.showAwards
          })
        }
      })
    },
    awardsCallback() {
      this.showAwards = false
      this.$marchSetsPoint('A_H5PT0019001734')
      if (this.isBlindBoxCoupon) location.href = 'https://wap.beeplaying.com/activities/blindBox.html#/'
      bottomBarJump('#/payment','payment',this.$router)
    },
    closedDialog() {
      this.$parent.initDialog();
      this.$marchSetsPoint('A_H5PT0019001735')
    }
  },
  mounted() {

  }
}
</script>

<style scoped lang="less">

</style>
