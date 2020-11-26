<template>
  <Modal v-model="show" :button-show="false" :title="titleText" @on-close="successShow=1">
    <div class="content-warp">
      <!-- 领取列表 -->
      <div v-if="successShow===1" class="content-list">
        <div class="jd-title">我的京东卡<span>{{cartNumber}}</span>元</div>
        <div class="list-warp">
          <ul class="body">
            <li class="item-warp" v-for="(item,index) in cartList" :key="index">
              <p class="item-text">
                京东E卡 {{item.rmbAmount}}元
              </p>
              <div class="item-botton" @click="saveCart(item,index)"
                :class="{'item-botton-active':item.composeState}">
                {{item.composeState?'领取':'暂不可领'}}
              </div>
            </li>
          </ul>
        </div>
        <div class="pit-warp">领取后请在"我的奖品"中查看</div>
      </div>
      <!-- 领取成功 -->
      <div class="success-warp" v-if="successShow===2">
        <p class="success-text">
          领取成功
          <span>{{cartList&&cartList[currentIndex]&&cartList[currentIndex].awardsName}}</span>
          可在我的奖品中使用
        </p>
        <div class="success-button" @click="goUse">去使用</div>
      </div>
      <!-- 领取失败 -->
      <div class="success-warp" v-if="successShow===3">
        <p class="success-text">
          50元就可以领取哦~<br>快去做任务赚
        </p>
        <div class="success-button" @click="goTask">去做任务</div>
      </div>
    </div>
  </Modal>
</template>
<script>
import { fragmentConvertList, combineAwards } from "@/services/user"
export default {
  name: "receiveJDCart",
  data () {
    return {
      show: this.value,
      cartList: [],
      successShow: 1, // 1=> 列表 2=> 成功 3=> 失败
      currentIndex: 0,
    }
  },
  props: {
    value: {
      type: Boolean,
      default: false
    },
    cart: {
      type: [Number, String],
      default: 0
    }
  },
  watch: {
    value (val) {
      this.show = val
      if (val) {
        this.getList()
      }
    },
    show (val) {
      this.$emit('input', val)
    }
  },
  computed: {
    titleText () {
      switch (this.successShow) {
        case 1:
          return '领取奖励'
          break
        case 2:
          return '领取成功'
          break
        default:
          return '领取失败'
          break
      }
    },
    cartNumber () {
      return (this.cart / 10).toFixed(1)
    }
  },
  mounted () {

  },
  methods: {
    // 获取数据
    async getList () {
      const { code, data } = await fragmentConvertList()
      if (code === 200) {
        this.cartList = data
      }
    },
    // 领取奖品
    async saveCart (item, index) {
      if (!item.composeState) { return }
      const { awardsId } = item

      const { code, data } = await combineAwards(awardsId, 8)
      if (code === 200 && data.isSuccess) {
        this.currentIndex = index
        this.successShow = 2
        this.$emit('on-success')
      }
      if (code === 200 && !data.isSuccess) {
        this.currentIndex = index
        this.successShow = 3
      }
    },
    // 去使用
    goUse () {
      this.$router.push({ name: "myPrize" })
    },
    // 去做任务
    goTask () {
      this.$marchSetsPoint('A_H5PT0021000226', { residual_jingdong: this.cart }) // H5平台-我的-京东卡-去做任务弹窗
      this.$router.push({ name: "task" })
    }
  }
}
</script>
<style lang="less" scoped>
* {
  box-sizing: border-box;
}
.content-list {
  .jd-title {
    font-size: 24px;
    text-align: center;
    color: #ff4141;
  }
}
// 显示京东卡列表
.list-warp {
  margin-top: 30px;
  border-top: 1px #eee solid;
  border-bottom: 1px #eee solid;
  .body {
    width: 100%;
    overflow: hidden;
  }
  .item-warp {
    display: flex;
    margin: 20px auto;
    align-items: center;
    justify-content: space-between;
    font-size: 24px;
    .item-botton {
      width: 120px;
      height: 42px;
      line-height: 42px;
      border-radius: 10px;
      color: #fff;
      text-align: center;
      background-color: #e0e0e0;
    }
    .item-botton-active {
      background-color: #ff4141;
    }
  }
}
.pit-warp {
  text-align: center;
  color: #999;
  font-size: 22px;
  padding-top: 18px;
}
.success-warp {
  padding: 50px;
  width: 100%;
  .success-text {
    margin-top: 30px;
    font-size: 26px;
    line-height: 34px;
    text-align: center;
    span {
      font-weight: bold;
      font-size: 28px;
    }
  }
  .success-button {
    width: 180px;
    height: 60px;
    background-color: #ff4141;
    color: #fff;
    margin: 40px auto;
    line-height: 60px;
    border-radius: 30px;
    text-align: center;
    font-weight: bold;
    font-size: 26px;
  }
}
</style>


