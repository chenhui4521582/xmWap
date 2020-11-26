<template>
  <article class="guide-wrapper">
    <PayHeader />
    <PayStep @submit="$emit('submit')">
      <slot />
    </PayStep>
  </article>
</template>

<script>
import PayHeader from './components/pay-header'
import PayStep from './components/pay-step'

export default {
  components: {
    PayHeader,
    PayStep
  }
}
</script>

<style lang="less" scoped>
.guide-wrapper {
  padding: 126px 26px 46px;
  background: #F7F7F7;
  box-sizing: border-box;
  min-height: 100vh;
}
</style>
