<template>
  <week-dialog
    :tipsTxt="tipsTxt"
    v-model="weeksAwardsShow"
    :awards="AwardsData.awards"
    :explainText="AwardsData.explainText"
    @callback="confirmAwardDialog"
    @closedCallback="closeDialog"
  />

</template>

<script>
import Services from '@/services/index'
import _get from 'lodash.get'
import {mapActions} from 'vuex'
export default {
	name: 'weeksAwards',
	data: () => ({
    tipsTxt:'',//周卡加赠、月卡加赠、周卡及月卡加赠
	  weeksAwardsShow: false,
	  AwardsData: {
			awards: []
	  },
    popType:0,
	}),
  components:{
    weekDialog:()=>import('./weekDialog')
  },
	methods: {
	  ...mapActions({
        getUserInfo: 'GET_USERINFO'
		}),
	  openWeeksAwards () {
	    this.weeksAwardsShow = true
		},
	  confirmAwardDialog() {
	    let points=['A_H5PT0019004157','A_H5PT0019004151','A_H5PT0019004154']
      points[this.popType-1]&&this.$marchSetsPoint(points[this.popType-1])
		  this.$parent.initDialog();
			this.weeksAwardsShow = false
		},
		init (callback){
			Services.getAllCard().then(res => {
				let {code, data} = res.data
        if(code==200){
          data.week=data.week.code==200?data.week:null
          data.month=data.month.code==200?data.month:null
          if(data.week||data.month){
            let weekSurplusDays=data.week&&(7-data.week.days)
            let monthSurplusDays=data.month&&(30-data.month.days)
            if(data.week&&data.month){
              this.popType=3
              this.$marchSetsPoint('A_H5PT0019004153')
              this.tipsTxt='周卡及月卡加赠'
              this.AwardsData.awards=[{
                awardsImage: require(`../img/weekcard/${data.week.awardsType}.png`),
                awardsName: data.week.awardsName,
                nofilter: true,
                info:`周卡${!weekSurplusDays?'最后1天':`剩<i style="color: #FF4141">${weekSurplusDays||1}天</i>`}`
              },{
                awardsImage: require(`../img/weekcard/${data.month.awardsType}.png`),
                awardsName: data.month.awardsName,
                nofilter: true,
                info:`月卡${!monthSurplusDays?'最后1天':`剩<i style="color: #FF4141">${monthSurplusDays||1}天</i>`}`
              }]
            }else if(data.week){
              this.popType=1
              this.$marchSetsPoint('A_H5PT0019004156')
              this.tipsTxt='周卡加赠'
              let info=''
              if(weekSurplusDays){
                info=`剩余<i style="color: #FF4141">${weekSurplusDays}天</i>，每天登录领取哦~`
              }else{
                info='加赠最后1天'
              }
              this.AwardsData.awards=[{
                awardsImage: require(`../img/weekcard/${data.week.awardsType}.png`),
                awardsName: data.week.awardsName,
                nofilter: true,
                info:info
              }]
            }else{
              this.popType=2
              this.$marchSetsPoint('A_H5PT0019004150')
              this.tipsTxt='月卡加赠'
              let info=''
              if(monthSurplusDays){
                info=`剩余<i style="color: #FF4141">${monthSurplusDays}天</i>，每天登录领取哦~`
              }else{
                info='加赠最后1天'
              }
              this.AwardsData.awards=[{
                awardsImage: require(`../img/weekcard/${data.month.awardsType}.png`),
                awardsName: data.month.awardsName,
                nofilter: true,
                info:info
              }]
            }
            this.openWeeksAwards()
            this.getUserInfo()
          }
          if(callback){
            callback({
              name:'weekAwards',
              isShow:data.week||data.month
            })
          }
        }else{
          callback({
            name:'weekAwards',
            isShow:false
          })
        }
			})
		},
    closeDialog(){
      let points=['A_H5PT0019004158','A_H5PT0019004152','A_H5PT0019004155']
      points[this.popType-1]&&this.$marchSetsPoint(points[this.popType-1])
      this.$parent.initDialog()
    }
	},
	mounted() {
	}
}
</script>

<style scoped lang="less">

</style>
