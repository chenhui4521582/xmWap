<template>
  <div class="select-address">
    <div class="mask" v-if="value"></div>
    <transition name="fade">
      <div class="center" v-if="value">
        <div class="nav">
          <div class="item" v-for="(item, index) in nav" :key="index"
            @click="handleClickNav(index)">
            {{ item.name }}
            <div class="line" v-if="currentIndex == index"></div>
          </div>
          <div class="close iconfont icon-close" @click="hideArea"></div>
        </div>
        <div class="body">
          <transition name="left">
            <ul v-if="showList">
              <li v-for="(item, index) in list"
                :class="{ active: nav[currentIndex].id == item.code }" :key="index"
                @click="handleClickList(item, index)">
                <span>{{ item.name }}</span>
                <span class="icon iconfont icon-next">
                </span>
              </li>
            </ul>
          </transition>
        </div>
      </div>
    </transition>
  </div>
</template>
<script>
import { getProvince, getCity, getArea } from '@/services/address'
import _get from 'lodash.get'
export default {
  name: 'select-address',
  props: {
    areaData: {
      type: Array,
      default: () => ([])
    },
    value: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    nav: [{ name: '请选择' }],
    currentIndex: 0,
    list: []
  }),
  computed: {
    showList () {
      return this.list.length
    }
  },
  methods: {
    /** 导航点击 **/
    handleClickNav (index) {
      if (this.currentIndex == index) {
        return false
      }
      this.currentIndex = index
      let parentId = this.nav[this.currentIndex].parentId
      this._getList(parentId)
    },
    /** 地区点击选择 **/
    handleClickList (item) {
      if (this.currentIndex == 2) {
        this.$set(this.nav, 2, { name: item.name, id: item.code, parentId: item.cityCode, itemId: item.id })
        this.hideArea()
        return false
      }
      this.$set(this.nav, this.currentIndex, { name: item.name, id: item.code, parentId: item.provinceCode, itemId: item.id })
      this.nav.splice(this.currentIndex + 1)
      this.nav.push({ name: '请选择', parentId: item.code })
      this.currentIndex = this.currentIndex + 1
      /** 触发动画 **/
      this.list = []
      /** 重新拉取接口 **/
      this._getList(item.code)
    },
    /** 关闭地区 **/
    hideArea () {
      let isSubmit = this.nav.find(item => {
        return item.name == '请选择'
      })
      if (!isSubmit) {
        this.$emit('usedArea', this.nav)
      }
      window.scrollTo(0, 0)
      this.$emit('input', false)
    },
    /** 获取地址 **/
    _getList (id) {
      if (this.currentIndex == 0) {
        this._getProvince()
      }
      if (this.currentIndex == 1) {
        this._getCity(id)
      }
      if (this.currentIndex == 2) {
        this._getArea(id)
      }
    },
    /** 获取省 **/
    _getProvince () {
      getProvince().then(res => {
        let { code, data, message } = _get(res, 'data')
        if (code == 200) {
          this.list = _get(res, 'data.data', [])
        }
      })
    },
    /** 获取市 **/
    _getCity (id) {
      getCity(id).then(res => {
        let { code, data, message } = _get(res, 'data')
        if (code == 200) {
          this.list = _get(res, 'data.data', [])
        }
      })
    },
    /** 获取区 **/
    _getArea (id) {
      getArea(id).then(res => {
        let { code, data, message } = _get(res, 'data')
        if (code == 200) {
          this.list = _get(res, 'data.data', [])
        }
      })
    }
  },
  watch: {
    value (newValue) {
      if (newValue) {
        if (this.areaData.length) {
          this.nav = this.areaData
          this.currentIndex = 2
          this._getList(this.areaData[2].parentId)
        } else {
          let id = this.nav[this.currentIndex].parentId
          this._getList(id)
        }
      }
    }
  }
}
</script>
<style lang="less" scoped>
.select-address {
  .mask {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.6);
    z-index: 11;
  }
  .center {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 11;
    background: #fff;
    border-radius: 32px 32px 0px 0px;
    .nav {
      position: relative;
      padding: 0 24px;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      height: 86px;
      color: #000000;
      .item {
        position: relative;
        padding: 0 0 10px;
        margin-right: 30px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        font-size: 28px;
        font-weight: bold;
        .line {
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translate(-50%, 0);
          width: 32px;
          height: 6px;
          background: #ff4141;
          opacity: 1;
          border-radius: 3px;
        }
      }
      .close {
        position: absolute;
        right: 20px;
        top: 20px;
        width: 27px;
        height: 27px;
        color: #888888;
      }
    }
    .body {
      padding: 0 24px;
      height: 760px;
      overflow-x: hidden;
      overflow-y: scroll;
      -webkit-overflow-scrolling: touch;
      li {
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 90px;
        border-bottom: 1px solid #eee;
        .icon {
          color: #bbbbbb;
        }
        &.active {
          color: #ff5300;
          .icon {
            display: block;
          }
        }
      }
    }
  }
}
.left-enter {
  transform: translate(50%);
  opacity: 0;
}
.left-enter-to {
  transform: translate(0);
  opacity: 1;
}
.left-leave {
  transform: translate(0);
  opacity: 1;
}
.left-leave-to {
  transform: translate(-50%);
  opacity: 0;
}
.left-enter-active,
.left-leave-active,
.fade-enter-active,
.fade-leave-active {
  transition: all 0.2s;
}

.fade-enter {
  transform: translate(0, 100%);
}
.fade-enter-to {
  transform: translate(0, 0);
}
.fade-leave {
  transform: translate(0, 0);
}
.fade-leave-to {
  transform: translate(0, 100%);
}
</style>
