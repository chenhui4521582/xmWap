
<template>
  <article class="coupon-wrapper effective" :class="type?`${type}-coupon-wrapper`:''">
    <section class="coupon-content">
      <div class="coupon-detail">
        <p class="coupon-name">
          <span>{{currentItem.name}}</span>
          <span class="red-tag" v-if="currentItem.status===6">即将过期</span>
        </p>
        <ul class="coupon-tags"
          v-if="currentItem.limitLabelList&&currentItem.limitLabelList.length>0">
          <li v-for="(tag,index) in currentItem.limitLabelList" :key="`tag-${index}`">{{tag}}</li>
        </ul>
        <p class="effective-time">有效期至{{currentItem.effectiveEndTime.replace(/-/g, '.')}}</p>
        <p class="rule-btn" @click="openDetails">
          <span>使用详情</span>
          <span class="arrow-icon" :class="isCheckIconClass"></span>
        </p>
      </div>
      <div class="coupon-info">
        <div class="coupon-desc">
          <p class="coupon-price" v-if="isNaN(currentItem.denomination)">
            {{currentItem.denomination.split('折')[0]}}<span>折</span>
          </p>
          <p class="coupon-price" v-else><span>¥</span>{{currentItem.denomination}}</p>
          <p class="coupon-instructions">(<span>{{currentItem.instructions}}</span>)</p>
        </div>
        <div class="btn-wrapper">
          <div v-if="item.status===7" class="not-use">暂无使用</div>
          <div v-else-if="item.status===3" class="in-use">使用中</div>
          <div v-else class="to-use" @click="useCoupon">立即使用</div>
        </div>
      </div>
    </section>
    <section class="coupon-rules-wrapper" v-show="currentItem.__check">
      <ul class="coupon-rules">
        <li v-for="(child,index) in useRules" :key="`rule-${index}`">{{child}}</li>
      </ul>
    </section>
  </article>
</template>
<script>
export default {
  name: 'effective',
  data () {
    return {
      currentItem: this.item
    }
  },
  props: {
    item: {
      type: Object,
      default: () => ({})
    },
    type: {
      type: String,
      default: ''
    }
  },
  computed: {
    effectiveTime () {
      let { effectiveEndTime, effectiveStartTime } = this.currentItem
      return `${effectiveStartTime.substring(0, 10)} ~${this.type && this.type === 'landscape' ? '' : '<br/>'} ${effectiveEndTime.substring(0, 10)}`.replace(/-/g, '.')
    },
    useRules () {
      let { useRules } = this.currentItem
      return useRules ? useRules.split(';') : []
    },
    isCheckIconClass () {
      const { __check } = this.currentItem
      return __check ? 'up' : 'down'
    }
  },
  methods: {
    // 打开详情
    openDetails () {
      const { __check } = this.currentItem
      if (!__check) {
        this.$set(this.currentItem, '__check', true)
      } else {
        this.$set(this.currentItem, '__check', false)
      }
      if (this.type) {
        this.$marchSetsPoint('A_H5PT0058003988', { source_address: this.type, coupon_tab: this.currentItem['__check'] ? '展开' : '关闭', coupon_id: this.currentItem.id, coupon_name: this.currentItem.name })// 游戏内-商城-优惠券弹窗-优惠券使用详情点击
      } else {
        this.$marchSetsPoint('A_H5PT0023003980', { coupon_tab: this.currentItem['__check'] ? '展开' : '关闭', coupon_id: this.currentItem.id, coupon_name: this.currentItem.name })// H5平台-商城-优惠券弹窗-优惠券使用详情点击
      }
    },
    // 立即使用
    useCoupon () {
      this.$emit('close', this.currentItem)
    }
  }
}
</script>
<style lang="less" scoped>
@import url('../css/couponCart.less');
</style>


