<template>
  <section class="header-list" :class="{'showHeader': $moduleConfig.isShowHeader}" @click="closeTips">
    <header class="header" v-if="$moduleConfig.isShowHeader">
      <div class="back iconfont icon-return" @click.stop="back"></div>
      <div class="items">新手任务</div>
      <div class="closed"></div>
    </header>
    <ul class="list-wrap">
      <li class="list-item">
        <section class="item-top" @click.stop="openPayment">
          <img src="../../img/newVersionTask/coin-icon.png" alt="">
          <span>{{userInfo.amount | amountComputen}}{{userInfo.amount > 10000 ? "万" : ""}}</span>
        </section>
        <section class="item-bottom">
          <span>我的金叶子</span>
          <div class="item-bottom-right">
            <img src="../../img/newVersionTask/question-mark-icon.png" @click.stop="toggleTip(0)" alt="">
            <div v-if="showTips && tipType===0" class="tips" :class="`tip-${tipType}`">
              <p class="horn"></p>
              <p class="desc">{{descList[tipType]}}</p>
            </div>
          </div>
        </section>
      </li>
      <li class="list-item">
        <section class="item-top" @click.stop="openMall(0)">
          <img src="../../img/newVersionTask/leaf-icon.png" alt="">
          <span>{{hfSum | amountComputen }}{{hfSum > 10000 ? "万" : ""}}<span class="unit">元</span></span>
        </section>
        <section class="item-bottom">
          <span>累计话费</span>
          <div class="item-bottom-right">
            <img src="../../img/newVersionTask/question-mark-icon.png" @click.stop="toggleTip(1)" alt="">
            <div v-if="showTips && tipType===1" class="tips" :class="`tip-${tipType}`">
              <p class="horn"></p>
              <p class="desc">{{descList[tipType]}}</p>
            </div>
          </div>
        </section>
      </li>
      <li class="btn" @click.stop="openMall(1)">
        使用话费
      </li>
    </ul>
  </section>
</template>

<script>
import { mapState } from 'vuex'
import { bottomBarJump } from '@/utils/utils'
export default {
  name: '',
  components: {

  },
  data () {
    return {
      tipType: '',
      showTips: false,
      descList: ['金叶子是平台虚拟资产，可以使用金叶子进行游戏等行为获取话费。', '完成任务、玩游戏可获取话费，话费可换取各类奖品福利'],
      timer: ''
    }
  },
  computed: {
    ...mapState(['userInfo']),
    hfSum () {
      return this.userInfo.hfSum ? (this.userInfo.hfSum / 10).toFixed(1) : 0
    }
  },
  filters: {
    amountComputen (val) {
      if (!val) { return 0 }
      return val > 10000 ? (val / 10000).toFixed(2) : val
    }
  },
  methods: {
    back () {
      if (history.length > 1) {
        history.go(-1)
      } else {
        this.$router.push('/')
      }
    },
    // 点击金叶子
    async openPayment () {
      this.$marchSetsPoint('A_H5PT0022001297') // H5平台-任务-新手任务-顶部菜单-我的金叶子点击
      bottomBarJump('#/payment', 'payment', this.$router)
    },
    toggleTip (type) {
      if (this.tipType === type) {
        this.showTips = !this.showTips
      } else {
        clearTimeout(this.timer)
        this.tipType = type
        this.showTips = true
        this.timer = setTimeout(() => {
          clearTimeout(this.timer)
          this.showTips = false;
        }, 10000)
      }
      if (type) {
        this.$marchSetsPoint("A_H5PT0022002250") // H5平台-任务-新手任务-顶部菜单-累计话费问号点击
      } else {
        this.$marchSetsPoint("A_H5PT0022002249") // H5平台-任务-新手任务-顶部菜单-我的金叶子问号点击
      }
    },
    // 打开商城页面
    async openMall (type) {
      if (type) {
        this.$marchSetsPoint('A_H5PT0022002251') // H5平台-任务-新手任务-顶部菜单-立即提现点击(跳转到话费券商城)
      } else {
        this.$marchSetsPoint('A_H5PT0022001314') // H5平台-任务-新手任务-顶部菜单-累计话费点击
      }
      bottomBarJump('#/mall', 'mall', this.$router)
    },
    closeTips () {
      this.showTips = false
      clearTimeout(this.timer)
    }
  }
}
</script>

<style lang="less" scoped>
.header-list {
  &.showHeader {
    padding-top: 100px;
  }
  .header {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    padding: 26px 24px;
    background: #f7f7f7;
    display: flex;
    z-index: 3;
    justify-content: center;
    align-items: center;
    box-sizing: border-box;
    height: 100px;
    .items {
      font-weight: bold;
      font-size: 36px;
      color: #252525;
    }
    .closed,
    .back {
      position: absolute;
      font-size: 30px;
      top: 50%;
      transform: translate(0, -50%);
    }
    .closed {
      right: 24px;
    }
    .back {
      left: 24px;
    }
  }
  .list-wrap {
    display: flex;
    height: 156px;
    align-items: center;
    background: #ff5e00;
    box-sizing: border-box;
    flex-wrap: nowrap;
    position: relative;
  }
  .list-item {
    box-sizing: border-box;
    padding: 0 24px;
    .item-top {
      display: flex;
      align-items: center;
      img {
        width: 30px;
        height: 30px;
      }
      span {
        font-size: 32px;
        font-weight: bold;
        line-height: 44px;
        color: #fff;
        margin-left: 8px;
        .unit {
          font-size: 20px;
        }
      }
    }
    .item-bottom {
      display: flex;
      align-items: center;
      margin-left: 34px;
      img {
        width: 24px;
        height: 24px;
        margin-left: 10px;
      }
      span {
        font-size: 22px;
        font-weight: 500;
        line-height: 44px;
        color: #fff;
      }
      .item-bottom-right {
        position: relative;
      }
      .tips {
        position: absolute;
        color: #fff;
        font-size: 20px;
        font-weight: 500;
        line-height: 30px;
        top: 42px;
        left: -98px;
        .horn {
          background: rgba(0, 0, 0, 0.7);
          height: 13px;
          position: relative;
          overflow: hidden;
          &::before {
            content: '';
            display: block;
            width: 124px;
            height: 30px;
            left: 0;
            bottom: 0;
            position: absolute;
            border-bottom-right-radius: 30px;
            background: #ff5e00;
          }
          &::after {
            content: '';
            display: block;
            width: 154px;
            height: 30px;
            right: 0;
            bottom: 0;
            position: absolute;
            border-bottom-left-radius: 30px;
            background: #ff5e00;
          }
        }
        .desc {
          background: rgba(0, 0, 0, 0.7);
          width: 270px;
          padding: 18px;
          border-radius: 16px;
          font-size: 20px;
          font-weight: 500;
          line-height: 30px;
        }
      }
    }
    &:first-child {
      width: 250px;
      border-right: rgba(238, 238, 238, 0.6) 1px solid;
    }
    &:nth-child(2) {
      padding-left: 28px;
    }
  }
  .btn {
    width: 156px;
    height: 58px;
    background: #ffe600;
    border-radius: 17px;
    color: #ff4141;
    font-size: 25px;
    line-height: 60px;
    text-align: center;
    position: absolute;
    right: 27px;
  }
}
</style>
