<template>
  <div class="tabs-warp" :class="`theme-${theme}`">
    <slot>
      <div class="tab-item" v-for="(item,index) in list"
        :class="{'tab-active':selectedIndex===index}" :key="index" @click="changeItem(item,index)">
        <span class="item-sapn">{{tabItemText(item)}}</span>
      </div>
    </slot>
  </div>
</template>
<script>
export default {
  name: 'Tabs',
  data () {
    return {
      selectedIndex: 0
    }
  },
  props: {
    list: {
      type: Array,
      default: () => ([])
    },
    valueKey: {
      type: String,
      default: ''
    },
    theme: {
      type: String, // dark有背景 light无背景
      default: 'dark'
    }
  },
  methods: {
    tabItemText (item) {
      return this.valueKey ? item[this.valueKey] : item
    },
    // 切换tab
    changeItem (item, index) {
      this.selectedIndex = index
      this.$emit('on-change', item, index)
    }
  }
}
</script>
<style lang="less" scoped>
.tabs-warp {
  height: 90px;
  width: 100%;
  display: flex;
  .tab-item {
    flex: 1;
    text-align: center;
    line-height: 90px;
    font-size: 28px;
  }
  .item-sapn {
    padding: 10px 0;
  }
}
.theme-dark {
  background-color: #f7f7f7;
  color: #000;
  .tab-active span {
    font-size: 32px;
    font-weight: bold;
    border-bottom: 6px solid #ff4141;
  }
}
.theme-light {
  background-color: #fff;
  .tab-active span {
    font-size: 32px;
    font-weight: bold;
    border-bottom: 6px solid #ff4141;
  }
}
</style>


