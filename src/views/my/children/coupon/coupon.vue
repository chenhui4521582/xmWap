<template>
  <div class="coupon-warp-all">
    <!-- 头部 -->
    <div class="header-wap">
      <div class="return-img" @click="returnPage" v-if="$moduleConfig.isShowHeader">
        <i class="iconfont icon-return"></i>
      </div>
      <div class="title-switch">
        <div class="tab-item" v-for="(tab, index) in tabList"
          :class="{ 'tab-item-active': index === tabIndex }" @click="clickCoupons(index)"
          :key="index">
          <span>{{ tab }}</span>
          <p v-show="index === tabIndex" class="tab-line"></p>
        </div>
        <div class="rules-warp" @click="showRulesFn">
          <i class="iconfont icon-question"></i>
        </div>
      </div>
    </div>
    <!-- 内容区 -->
    <div class="coupon-warp" v-if="noListShow">
      <!-- status （1未使用，2已使用，3使用中，4未生效（虚拟状态）,5已过期（虚拟状态）,6即将过期（虚拟状态）） -->
      <template v-if="tabIndex == 0">
        <template v-for="(item, index) in ableList">
          <effective :item="item" :key="index" />
        </template>
      </template>
      <!-- 过期的优惠劵 -->
      <template v-else>
        <template v-for="(item, index) in enabledList">
          <invalid :item="item" :key="index" />
        </template>
      </template>
    </div>
    <!-- 没有优惠券展示 -->
    <template v-else>
      <no-list message="暂时没有优惠券" />
    </template>
    <!-- 规则 -->
    <rulse v-model="rulseShow" @on-close="rulseShow = false" />
  </div>
</template>
<script>
import rulse from './components/rules'
import effective from './components/effective'
import invalid from './components/invalid'
import { getCouponList } from '@/services/user'
export default {
  name: 'coupon',
  data () {
    return {
      tabList: ['有效券', '失效券'],
      tabIndex: 0,
      rulseShow: false,
      enabledList: [], // 不可用列表
      ableList: [] // 可用列表
    }
  },
  components: {
    rulse,
    effective,
    invalid
  },
  computed: {
    noListShow () {
      const list = this.tabIndex === 0 ? this.ableList : this.enabledList
      return list.length > 0 ? true : false
    }
  },
  mounted () {
    this.pageInit()
  },
  methods: {
    // 页面初始化
    async pageInit () {
      const ableList = await getCouponList()
      const enabledList = await getCouponList({ page: 1, pageSize: 100, params: false })
      if (enabledList.code === 200 && enabledList.data) {
        this.enabledList = enabledList.data
      }
      if (ableList.code === 200) {
        this.ableList = ableList.data.filter(item => {
          return item.status == 1 || item.status == 3 || item.status == 4 || item.status == 6 || item.status == 7
        })
      }
      this.$marchSetsPoint('P_H5PT0027')
    },
    // 打开规则
    showRulesFn () {
      this.rulseShow = true
      this.$marchSetsPoint('A_H5PT0027000624') // H5平台-优惠券-使用规则
    },
    // 标题切换
    async clickCoupons (index) {
      this.tabIndex = index
      this.noUseCoupons = false
      let array = index == 0 ? this.ableList : this.enabledList
      array.map(item => {
        this.$set(item, '__check', false)
      })
      index == 0
        ? this.$marchSetsPoint('A_H5PT0027000622')
        : this.$marchSetsPoint('A_H5PT0027000623') // H5平台-优惠券-[有效券,失效券]
    },
    // 页面返回按钮
    returnPage () {
      this.$router.go(-1)
      this.$marchSetsPoint('A_H5PT0027000621')
    }
  }
}
</script>
<style lang="less" scoped>
* {
  box-sizing: border-box;
}
.header-wap {
  height: 100px;
  position: fixed;
  width: 100%;
  top: 0;
  left: 0;
  z-index: 10;
  box-sizing: border-box;
  padding: 0 30px;
  color: #000;
  background-color: #f7f7f7;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  .return-img {
    position: absolute;
    top: 0;
    left: 30px;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    width: 100px;
    height: 94px;
    box-sizing: border-box;
    z-index: 10;
    .iconfont {
      font-size: 30px;
    }
  }
  .title {
    text-align: center;
    font-size: 32px;
    font-weight: bold;
  }
}
.title-switch {
  position: relative;
  width: 100%;
  text-align: center;
  font-size: 32px;
  display: flex;
  justify-content: center;
  .rules-warp {
    position: absolute;
    height: 40px;
    width: 40px;
    top: 0;
    right: 0;
    color: #bbbbbb;
    i {
      font-size: 34px;
    }
  }
  .tab-item {
    width: 110px;
    margin: 0 20px;
    position: relative;
  }
  .tab-item-active {
    font-weight: bold;
  }
  .tab-line {
    width: 32px;
    height: 6px;
    background-color: #ff4141;
    position: absolute;
    bottom: -20px;
    left: 39px;
    border-radius: 3px;
  }
}
.coupon-warp-all {
  padding-top: 100px;
  min-height: 100vh;
  background: #f7f7f7;
}
.coupon-warp {
  padding: 24px;
  width: 100%;
}
.no-list {
  text-align: center;
  color: #acacac;
  img {
    width: 152px;
    margin-top: 400px;
    margin-bottom: 20px;
  }
}
</style>
