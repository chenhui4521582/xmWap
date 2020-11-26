<template>
  <div>
    <div class="type4_title"
         v-if="dataArr.activityCategory==1&&data&&data.isOpen&&data.bettingList&&data.bettingList.list.length">
      <!--cycle (integer, optional): 进度统计周期。1：永久；2：每天；3：每周 ,-->
      <img src="../images/type4/playgameicon.png" alt="" style="width: .73*100px;height: .29*100px;margin-right: .06rem"
           v-if="isPlayGameType">
      <template v-else>
        <img src="../images/type4/dailyicon.png" alt="" style="width: .51*100px;height: .29*100px;margin-right: .06rem"
             v-if="data.cycle==2">
        <img src="../images/type4/sevendaysicon.png" alt="" style="width: .51*100px;height: .29*100px;margin-right: .06rem"
             v-if="data.cycle==3">
      </template>
      加赠奖励送不停
    </div>
    <div class="type4_content" v-if=" data&&data.bettingList">
      <scroll ref="right" :data="data.bettingList.list">
        <div>
          <div class="type4_item" v-for="item in data.bettingList.list"
               v-if="data&&data.bettingList&&data.bettingList.list"
               @click="goto(item.status,item.level,dataArr.batchId)">
            <div class="type4_up">
              <div class="type4_left">
                <div class="item">
                  <img src="../images/type4/task_icon.png" alt="">
                  <!--每日累充：每日消费满xxx元 2-->
                  <!--7日累充：消费满xxxx元 3-->
                  <!--流水任务：累计支持xxxxxx金叶子 1-->
                  <span v-if="data.businessType==204">累积支持{{item.level|tenThousand}}金叶子</span>
                  <span v-if="data.businessType==203">消费满{{item.level}}元</span>
                </div>
                <div class="item" :class="{game:isPlayGameType,qiri:data.cycle==3}">
                  <!--phyAwardsId (integer, optional): 奖品ID。phyAwardsType 为 10 的奖品，依据该字段区分碎片种类 7：话费碎片；8：京东卡碎片 ,-->
                  <!--phyAwardsType (integer, optional): 奖品类型。1：金叶子；3：话费直充；4：京东卡；9：实物；10：碎片；26：招财猫道具；32：优惠券；33：移动卡密；-->
                  <template v-if="isPlayGameType">
                    <img src="../images/type4/play_leaf.png" alt="" v-if="item.phyAwardsType==1">
                    <img src="../images/type4/play_fee.png" alt="" v-if="item.phyAwardsId==7">
                    <img src="../images/type4/play_jd.png" alt="" v-if="item.phyAwardsId==8">
                  </template>
                  <template v-else-if="data.cycle==3">
                    <img src="../images/type4/qiri_leaf.png" alt="" v-if="item.phyAwardsType==1">
                    <img src="../images/type4/qiri_fee.png" alt="" v-if="item.phyAwardsId==7">
                    <img src="../images/type4/qiri_jd.png" alt="" v-if="item.phyAwardsId==8">
                  </template>
                  <template v-else>
                    <img src="../images/type4/leaf.png" alt="" v-if="item.phyAwardsType==1">
                    <img src="../images/type4/fee.png" alt="" v-if="item.phyAwardsId==7">
                    <img src="../images/type4/jd.png" alt="" v-if="item.phyAwardsId==8">
                  </template>
                  {{item.awardsName}}
                </div>
              </div>
              <div class="type4_right" v-if="item.status==0" @click="goto(item.status,item.level,dataArr.batchId)">去完成
              </div>
              <div class="type4_right gotogain" v-if="item.status==1"
                   @click="goto(item.status,item.level,dataArr.batchId)">领取
              </div>
              <div class="type4_right havegained" v-if="item.status==2">已领取</div>
            </div>
            <div class="type4_down" v-if="data&&data.bettingList">
              <div class="type4_progressbar"
                   :style="{width:(data.bettingList.progress>item.level?item.level:data.bettingList.progress)/item.level*100+'%'}">
              </div>
              <div class="text">
                {{data.bettingList.progress>item.level?item.level:data.bettingList.progress}}/{{item.level}}
              </div>
            </div>
          </div>
        </div>
      </scroll>
    </div>
    <!--dataArr.description-->
    <div class="type4_btn_detail">
      <div v-html="dataArr.description"></div>
    </div>
  </div>
</template>

<script>
  import indexServices from '@/services/index'
  import scroll from './scroll'
  export default {
    data() {
      return {}
    },
    props: {
      data: {
        type: Object,
        default: null
      },
      dataArr: {
        type: Object,
        default: null
      }
    },
    computed: {
      isPlayGameType() {
        return this.data && this.data.cycle == 1
      },
      actid() {
        return this.dataArr && this.dataArr.id || 0
      }
    },
    components: {
      scroll
    },
    methods: {
      async goto(status, awardsId, batchId) {
        if (status != 2) {
          if (status == 0) {//去完成
            if (!this.dataArr.linkUrl && this.data.cycle != 1) {//每日累充、七日累充去完成如果没有配置链接，则默认跳商城
              this.$router.push({ name: 'payment' })
            } else {
              this.$emit('btndetail', this.dataArr.linkUrl)
            }
          } else {//领取
            try {
              let res = await indexServices.getAcenterAwards({
                value: awardsId,
                batchId: batchId
              })
              if (res.data.code == 200 && res.data.data) {
                this.$emit('gainPrize', res.data.data)
              }
            } catch (e) {
              this.$Toast('领取失败')
            }
          }
        }
      }
    },
    watch: {
      actid() {
        this.$refs.right && this.$refs.right.scrollTo(0, 0)
      }
    },
    mounted() {
    }
  }
</script>

<style lang="less" scoped>
  .type4_title {
    text-align: center;
    font-weight: 800;
    color: rgba(222, 49, 4, 1);
    margin-bottom: 0.2*100px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: .3*100px;
    font-weight: bold;
    color: rgba(255, 96, 0, 1);
  }

  .type4_content {
    padding-top: 0.1*100px;
    font-size: 0.22*100px;
    font-weight: 500;
    color: rgba(59, 59, 59, 1);
    position: absolute;
    left: .17*100px;
    right: 0;
    top: 0.83*100px;
    bottom: 1.1*100px;
    overflow: hidden;
    .type4_item {
      width: 4*100px;
      height: 1.16*100px;
      background: url("../images/type4/bg.png") no-repeat;
      background-size: 100% 100%;
      margin-bottom: .1*100px;
      padding: .2*100px;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      font-size: .2*100px;
      img {
        width: .21*100px;
        height: .22*100px;
        margin-right: .05*100px;
      }
      .type4_up {
        height: .5*100px;
        display: flex;
        justify-content: space-between;
        .type4_left {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          display: flex;
          .item {
            align-items: center;
            display: flex;
            &:nth-child(1) {
              font-weight: 500;
              color: rgba(112, 111, 111, 1);
            }
            &:nth-child(2) {
              font-weight: 500;
              color: rgba(255, 43, 0, 1);
              &.game {
                color: #728E00;
              }
              &.qiri {
                color: #cb0178
              }
            }
          }
        }
        .type4_right {
          width: .94*100px;
          height: .5*100px;
          line-height: .5*100px;
          text-align: center;
          background: url("../images/type4/complete.png") no-repeat;
          background-size: 100% 100%;
          color: rgba(255, 255, 255, 1);
          font-weight: bold;
          &.gotogain {
            background: url("../images/type4/gain.png") no-repeat;
            background-size: 100% 100%;
          }
          &.havegained {
            background: url("../images/type4/gray.png") no-repeat;
            background-size: 100% 100%;
            color: rgba(255, 132, 0, 1);
          }
        }
      }
      .type4_down {
        height: .14*100px;
        background: url("../images/type4/progress.png") no-repeat;
        background-size: 100% 100%;
        position: relative;
        .type4_progressbar {
          position: absolute;
          left: 0;
          height: .14*100px;
          background: rgba(255, 198, 0, 1);
          border-radius: .07*100px;
        }
        .text {
          position: absolute;
          width: 100%;
          text-align: center;
          font-size: .16*100px;
          font-weight: 500;
          color: rgba(255, 132, 0, 1);
        }
      }
    }
  }

  .type4_btn_detail {
    position: absolute;
    top: 5.8*100px;
    bottom: 0;
    right: 0;
    left: 0;
    margin: auto;
    line-height: .3*100px;
    padding-left: .2*100px;
    font-size: .2*100px;
    font-weight: 500;
    color: rgba(230, 160, 69, 1);
    div {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
    }
  }
</style>
