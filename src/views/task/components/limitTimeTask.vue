<template>
  <section class="limittime-task" v-if="isShow">
    <div class="title">
      <p>
        <span><i class="line"></i>限时任务</span>
      </p>
    </div>
    <div class="limittime-container" @click="gotopage">
      <div class="info">
        <div class="name">回归礼包</div>
        <div class="desc">老用户回归礼包，可获得{{task.activityShowAwards}}奖励</div>
      </div>
      <div class="btn">{{task.haveUnReceived?'奖励待领取':'立即前往'}}</div>
    </div>
  </section>
</template>

<script>
  import Services from '@/services/SDK'
  import { mapState, mapActions } from 'vuex'
  import { jumpUrl } from '@/utils/utils'

  export default {
    name: '',
    components: {},
    data() {
      return {
        showAwards: false,
        awards: {
          awardsImage: '',
          awardsName: ''
        },
        task: null,
        showRule: false,
        ruleImg: '',
        isShow: false
      }
    },
    computed: {
      ...mapState(['redDot'])
    },
    mounted() {
      this.init()
    },
    methods: {
      async getData() {
        let res = await Services.returnBagTask()
        if (res.data.code == 200) {
          this.task = res.data.data
          this.isShow = res.data.data.open
        }
      },
      init() {
        if (!this.redDot.returnBagAwards) {
          this.getData()
        } else {
          this.task = this.redDot.returnBagAwards
          this.isShow = this.redDot.returnBagAwards && this.redDot.returnBagAwards.open
        }
      },
      gotopage() {
        this.$marchSetsPoint('A_H5PT0022003476')
        location.href = '//wap.beeplaying.com/activities/returnbags.html?from=index'
      }
    }
  }
</script>

<style lang="less" scoped>
  .limittime-task {
    margin: 60px 24px 24px;
    .title {
      display: flex;
      justify-content: space-between;
      align-items: center;
      p {
        display: flex;
        align-items: center;
        margin-bottom: 4px;
        color: #e8382b;
        font-size: 24px;
        margin-left: 10px;
        line-height: 1;
      }
      span {
        &:first-child {
          color: #303133;
          font-size: 32px;
          font-weight: bold;
          line-height: 1.1;
          display: flex;
          justify-content: flex-start;
          align-items: center;
          i {
            margin-right: 10px;
            width: 6px;
            height: 32px;
            border-radius: 3px;
            background: #ff4141;
          }
        }
      }
    }
    .limittime-container {
      margin-top: 15px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 30px;
      box-sizing: border-box;
      width: 672px;
      height: 120px;
      background: url("../img/limittimetask/banner.png");
      background-size: 100% 100%;
      .info {
        .name {
          font-size: 28px;
          font-weight: bold;
          color: rgba(255, 255, 255, 1);
        }
        .desc {
          margin-top: 3px;
          font-size: 24px;
          font-weight: 400;
          color: rgba(255, 255, 255, 1);
        }
      }
      .btn {
        width: 150px;
        height: 56px;
        background: rgba(255, 213, 0, 1);
        border-radius: 16px;
        font-size: 24px;
        font-weight: 500;
        color: rgba(72, 45, 129, 1);
        line-height: 56px;
        text-align: center;
      }
    }
  }
</style>
