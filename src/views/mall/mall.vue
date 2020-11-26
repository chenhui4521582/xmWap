<template>
  <div class="shop-warp">
    <productDetails v-if="showdetail" :account="accountBalance" :detailItem="detailItem"
      @close="refreshData"></productDetails>
    <!-- 公共头部 -->
    <base-header></base-header>
    <!-- recommend -->
    <recommend />
    <!-- tab 切换 -->
    <div class="tab-warp" :class="{'center': tabList.length < 5}">
      <div class="tab-item" v-for="(tab,index) in tabList"
        :class="{'tab-item-active': index===tabSelected}" :key="index" @click="switchTab(index)">
        <span>{{tab}}</span>
        <i class="line" v-show="index===tabSelected"></i>
      </div>
    </div>
    <div class="shop-content" :class="$moduleConfig.plantVersion">
      <div class="content-warp">
        <template v-if="rewardList.length>0">
          <better-scroll :data="rewardList[tabSelected].items" ref="better_scroll">
            <ul class="list-warp">
              <li class="list-item" v-for="(item ,index) in currentList" :key="index"
                @click="goDetails(item)">
                <template v-if="item.productList.length>0">
                  <div class="list-content">
                    <div class="icons">
                      <!-- 今日已经购完icon -->
                      <div class="buyover-icon" v-if="buyover(item.productList)">今日已购完</div>
                      <!-- 缺货icon -->
                      <div class="nosurplus-icon" v-else-if="nosurplus(item.productList)">缺货</div>
                      <!-- 后台配置icon -->
                      <div class="custom-icon" v-else-if="custom(item.productList)">
                        <img :src="item.productList[0].cornerImg | filter" alt="">
                      </div>
                      <!-- 每日限购一次icon -->
                      <div class="buyone-icon" v-else-if="buyone(item.productList)">每日限购一次</div>
                    </div>
                    <img :src='$moduleConfig.mall.label'
                      v-if="$moduleConfig.mall&&$moduleConfig.mall.label" class="icon_label" />
                    <div class="img-warp">
                      <img :src="item.productList[0].picture | filter">
                    </div>
                    <div class="product-title">{{item.productList[0].name}}</div>
                    <div class="specs">
                      {{item.productList[0].commentInfo&&item.productList[0].commentInfo.recommendRemark||item.productList[0].specs}}
                    </div>
                    <div class="button-warp">
                      <div class="price"><span
                          class="num">{{item.productList[0].purchasePrice}}</span>元话费券</div>
                      <div class="right">换取</div>
                    </div>
                  </div>
                </template>
              </li>
              <div class="bottom-line">
                <bottom-line></bottom-line>
              </div>
            </ul>
          </better-scroll>
        </template>
      </div>
    </div>
    <!-- 新手引导 -->
    <new-user-guide />
    <!-- 公共底部 -->
    <base-footer></base-footer>
  </div>
</template>
<script>
import baseHeader from '@/components/baseHeader/baseHeader'
import baseFooter from '@/components/baseFooter/baseFooter'
import newUserGuide from '@/components/newUserGuide/page1'
import Recommend from './components/recommend/recommend'
import { shopLlist } from '@/services/shop'
import BetterScroll from '@/components/betterScroll/betterScroll'
import productDetails from './productDetails'
import { saveNewUserTask } from '@/services/global'
export default {
  name: 'mall',
  components: {
    baseHeader,
    baseFooter,
    newUserGuide,
    BetterScroll,
    Recommend,
    productDetails
  },
  data () {
    return {
      tabSelected: 0,
      rewardList: [],
      accountBalance: 0,
      showdetail: false,
      detailItem: null
    }
  },
  mounted () {
    this.init()
    this._saveNewUserTask()
    localStorage['isHideTip_mall'] = 1 //隐藏tip的显示
  },
  computed: {
    tabList () {
      if (this.rewardList.length > 0) {
        return this.rewardList.map(item => {
          return item.name
        })
      } else {
        return []
      }
    },
    currentList () {
      return this.rewardList.length > 0 ? this.rewardList[this.tabSelected].items : []
    },
  },
  methods: {
    async init () {
      this.$marchSetsPoint('P_H5PT0020')
      const { data, code } = await shopLlist()
      if (code === 200) {
        this.rewardList = data.categoryList
        this.accountBalance = data.accountBalance
      }
    },
    // tab 切换
    switchTab (index) {
      this.tabSelected = index
      this.$refs.better_scroll.scrollTo(0, 0)
      switch (index) {
        case 0:
          this.$marchSetsPoint('A_H5PT0035000634', {
            residual_phone: this.accountBalance
          })// H5平台-话费券商城-好物推荐
          break
        case 2:
          this.$marchSetsPoint('A_H5PT0035000636', {
            residual_phone: this.accountBalance
          })// H5平台-话费券商城-手机数码
          break
        case 1:
          this.$marchSetsPoint('A_H5PT0035000635', {
            residual_phone: this.accountBalance
          })// H5平台-话费券商城-虚拟卡券
          break
        default:
          break
      }
    },
    // 打开详情
    async goDetails (item) {
      this.$marchSetsPoint('A_H5PT0020001263', {
        awards_name: item.phyAwardsTypeName,
        residual_phone: localStorage.getItem('user_Info') ? JSON.parse(localStorage.getItem('user_Info'))['hfSum'] : ''
      }) // H5平台-领奖-商品点击
      this.detailItem = item.productList[0]
      this.showdetail = true
      // this.$router.push({
      //   name: 'productDetails',
      //   query: {
      //     accountBalance: this.accountBalance,
      //     phyAwardsType: item.productList[0].phyAwardsType,
      //     phyAwardsId: item.productList[0].phyAwardsId,
      //     name: item.productList[0].name,
      //   }
      // })
    },
    // 每日限购一次
    buyone (list) {
      if (list.length > 1) {
        return false
      }
      if (list.length === 1 && list[0].limitPerPersonDay === 1) {
        return true
      }
    },
    // 缺货
    nosurplus (list) {
      let number = 0
      list.forEach(item => {
        if (item['allUsersTodayAvailableQuota'] !== 0) {
          number++
        }
      })
      return number === 0 ? true : false
    },
    // 今日已经购完
    buyover (list) {
      let number = 0
      list.forEach(item => {
        if (item['currentUserTodayAvailableQuota'] === 0) {
          number++
        }
      })
      return number === list.length ? true : false
    },
    // 自定义icon
    custom (list) {
      if (list[0].cornerImg) {
        return true
      }
    },
    refreshData () {
      //刷新数据
      this.init()
      this.showdetail = false
      this.detailItem = null
    },
    // 保存新手任务进入我的页面
    _saveNewUserTask () {
      saveNewUserTask({ value: 7 })
    }
  }
}
</script>
<style lang="less" scoped>
.shop-warp {
  min-height: 100vh;
  background-color: #f7f7f7;
  overflow-x: hidden;
}
.tab-warp {
  padding: 0 24px;
  position: absolute;
  top: 220px;
  left: 0;
  z-index: 10;
  width: 100%;
  height: 80px;
  display: flex;
  justify-content: center;
  &.center {
    justify-content: center;
  }
  .tab-item {
    flex: 1;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 32px;
    color: #888888;
    .line {
      position: absolute;
      bottom: 2px;
      left: 50%;
      margin-left: -16px;
      overflow: hidden;
      width: 32px;
      height: 6px;
      background: #ff4141;
      border-radius: 3px;
    }
  }
  .tab-item-active {
    color: #000000;
    font-weight: bold;
  }
}

.shop-content {
  position: absolute;
  top: 307px;
  bottom: 110px;
  width: 100%;
  &.red {
    bottom: 0;
  }
  .content-warp {
    position: relative;
    height: 100%;
    width: 100%;
  }
  .list-warp {
    padding: 10px 24px 0;
    display: flex;
    flex-wrap: wrap;
  }
  .list-item {
    width: 50%;
    flex: 0 50%;
    margin-bottom: 12px;
    &:nth-child(even) {
      padding-left: 6px;
    }
    &:nth-child(odd) {
      padding-right: 6px;
    }
    .list-content {
      position: relative;
      background-color: #fff;
      height: 410px;
      border-radius: 16px;
      padding: 49px 20px 27px;
      box-shadow: 0 0 10px rgba(208, 208, 208, 0.2);
      .icon_label {
        position: absolute;
        right: 16px;
        top: 16px;
        height: 44px;
      }
      .icons {
        position: absolute;
        top: 16px;
        left: 20px;
        z-index: 2;
        .buyone-icon {
          padding: 0 10px;
          height: 30px;
          line-height: 30px;
          border-radius: 6px;
          color: #ff7800;
          font-size: 20px;
          text-align: center;
          border: 2px solid #ff7800;
        }
        .buyover-icon {
          padding: 0 10px;
          height: 30px;
          line-height: 30px;
          border-radius: 6px;
          color: #888888;
          font-size: 20px;
          text-align: center;
          border: 2px solid #888888;
        }
        .nosurplus-icon {
          padding: 0 10px;
          height: 30px;
          line-height: 30px;
          border-radius: 6px;
          color: #888888;
          font-size: 20px;
          text-align: center;
          border: 2px solid #888888;
        }
        .custom-icon {
          height: 34px;
          img {
            vertical-align: top;
            height: 34px;
          }
        }
      }
    }
    .img-warp {
      position: relative;
      width: 100%;
      height: 202px;
      img {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        max-width: 100%;
        max-height: 100%;
      }
    }
    .product-title {
      margin-top: 10px;
      font-size: 28px;
      line-height: 1.1;
      color: #333333;
      font-weight: bold;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .specs {
      font-size: 24px;
      color: #acacac;
      height: 46px;
      padding: 8px 0 4px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .button-warp {
      display: flex;
      justify-content: space-between;
      align-items: center;
      position: relative;
      color: #333;
      height: 42px;
      .price {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        font-size: 20px;
        color: #ff4141;
        span {
          font-size: 32px;
          font-weight: bold;
        }
      }
      span {
        font-size: 32px;
        font-weight: bold;
      }
      .right {
        position: absolute;
        top: 0;
        right: 0;
        width: 90px;
        height: 42px;
        line-height: 42px;
        color: #fff;
        text-align: center;
        font-size: 24px;
        background-color: #ff4141;
        border-radius: 10px;
      }
    }
    .hot {
      position: absolute;
      top: 16px;
      left: 20px;
      width: 60px;
      height: 30px;
      background-color: #f02235;
      text-align: center;
      line-height: 32px;
      font-size: 20px;
      color: #fff;
      border-radius: 6px;
    }
  }
  .bottom-line {
    padding: 30px 0;
  }
}
</style>

