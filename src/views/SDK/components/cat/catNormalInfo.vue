<template>
  <section class="cat-normal-info" :class="`status-${frozenStatus}`">
    <sdk-popup v-model="showOutPop" :title="title" :showConfirm="!!frozenStatus"
      :showCancel="!frozenStatus" cancelText="我知道了" confirmText="去救猫" @on-cancel="cancelCallback"
      @on-confirm="confirmCallback">
      <div class="text">
        <template v-if="frozenStatus===1">
          <p>您的招财猫生病了</p>
          <p>任意付费可使猫自动恢复健康</p>
          <p>之后可继续使用</p>
        </template>
        <template v-else>
          <div class="normal-icon">
            <img :src="info.img" alt="">
          </div>
          <p>{{info.desc}}</p>
        </template>
      </div>
    </sdk-popup>
  </section>
</template>

<script>
import { jumpUrl } from '@/utils/utils'
export default {
  name: 'catNormalInfo',
  components: {

  },
  data () {
    return {
      showOutPop: false
    }
  },
  props: {
    frozenStatus: {
      type: Number,
      default: 0
    },
    info: {
      type: Object,
      default: () => ({
        title: '',
        desc: '',
        img: ''
      })
    }
  },
  computed: {
    title () {
      switch (this.frozenStatus) {
        case 1:
          return '权益被冻结'

        default:
          return this.info.title
      }
    }
  },
  methods: {
    handleClick () {
      this.showOutPop = true
    },
    cancelCallback () {
      if (parent.closeTaksPage) {
        parent.closeTaksPage()
      }
    },
    confirmCallback () {
      jumpUrl({ url: '/xmWap/#/payment/' }, 'SDK')
    }
  }
}
</script>

<style lang="less" scoped>
.cat-normal-info {
  .normal-icon {
    width: 256px;
    height: 160px;
    margin: 12px auto;
    text-align: center;
    img {
      height: 100%;
      width: auto;
    }
  }
  p {
    font-size: 20px;
    font-weight: bold;
    color: #fff;
    line-height: 30px;
    text-align: center;
  }
  &.status-1 {
    .text {
      margin-top: 39px;
    }
  }
}
</style>
<style scoped>
.cat-normal-info.status-0 >>> .sdk-popup-wrapper .main-container.type-0 .title {
  margin-top: 51px;
}
</style>