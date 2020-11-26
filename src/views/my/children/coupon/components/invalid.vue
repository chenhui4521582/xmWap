
<template>
  <article class="coupon-wrapper invalid">
    <section class="coupon-content">
      <div class="coupon-detail">
        <p class="coupon-name">
          <span>{{currentItem.name}}</span>
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
          <div v-if="item.status == 2">已使用</div>
          <div v-else-if="item.status == 3">核销中</div>
          <div v-else>已过期</div>
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
  name: 'invalid',
  data () {
    return {
      currentItem: this.item
    }
  },
  props: {
    item: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {
    effectiveTime () {
      let { effectiveEndTime, effectiveStartTime } = this.currentItem
      return `${effectiveStartTime.substring(0, 10)} ~ ${effectiveEndTime.substring(0, 10)}`.replace(/-/g, '.')
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
        this.$marchSetsPoint('A_H5PT0027000626', {
          marketing_id: this.currentItem.id
        })
        this.$set(this.currentItem, '__check', true)
      } else {
        this.$set(this.currentItem, '__check', false)
      }
    },
  }
}
</script>
<style lang="less" scoped>
@import url('../css/couponCart.less');
</style>


