<template>
  <section class="number-change">
    <ul ref="groups" v-for="(i,key) in animationList" :key="`groups-${key}`">
      <li v-for="j in round" ref="groupItem" :key="`groupItem${j}`">
        <div ref="item" v-for="(item,index) in numberList" :key="index">
          <img :src="item" />
        </div>
      </li>
    </ul>
  </section>
</template>

<script>
export default {
  name: '',
  props: {
    number: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      round: 4, // 转几回合后停下来
      groups: '', // 单位元素
      groupItemHeight: '', // ul元素高度
      itemHeight: '', // 奖品元素高度
      awardTop: [],
      currentNumber: 0,
      numberList: [
        require('../img/number/0.png'),
        require('../img/number/1.png'),
        require('../img/number/2.png'),
        require('../img/number/3.png'),
        require('../img/number/4.png'),
        require('../img/number/5.png'),
        require('../img/number/6.png'),
        require('../img/number/7.png'),
        require('../img/number/8.png'),
        require('../img/number/9.png')
      ]
    }
  },
  computed: {
    animationList () {
      return this.number.toString().split('').map(Number)
    }
  },
  mounted () {
    this.start()
  },
  methods: {
    start () {
      /** 价格单位元素 **/
      this.groups = this.$refs.groups
      /** 价格单位元素高度 **/
      this.groupsHeight = this.$refs.groups[0].getBoundingClientRect().height
      /** 价格单位内容元素 **/
      this.groupItemHeight = this.$refs.groupItem[0].getBoundingClientRect().height
      /** 价格单位奖品 **/
      this.itemHeight = this.$refs.item[0].getBoundingClientRect().height
      /** 设置位置 **/
      this.runGame(this.animationList)
    },
    runGame (indexArr) {
      this.groups.map((item, index) => {
        /** 获取每个单位停止位置 **/
        let groupsIndex = indexArr[index]
        let pos = (groupsIndex * this.itemHeight) + (this.groupItemHeight * (this.round - 1))
        setTimeout(() => {
          item.style.transform = 'translate(0, -' + pos + 'px)'
          item.classList.add('animation-ease')
        }, index * 20 + 200)
      })
    },
    /** 重置状态 **/
    resetGame (indexArr) {
      this.groups.map((item, index) => {
        // if (indexArr[index].state == 1) return 
        item.style.transform = ''
        item.classList.remove('animation-ease')
      })
    },
  },
  watch: {
    animationList (value) {
      this.resetGame(value)
      this.start()
    }
  }
}
</script>

<style lang="less" scoped>
.number-change {
  height: 42px;
  overflow: hidden;
  display: flex;
  margin: auto;
  ul {
    width: min-content;
    padding: 0;
    font-size: 0;
    margin: 0;
    border: 0;
    li {
      width: min-content;
      padding: 0;
      font-size: 0;
      margin: 0;
      border: 0;
      height: 420px;
      margin-left: -4px;
      div {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 42px;
        padding: 0;
        font-size: 0;
        margin: 0;
        border: 0;
        img {
          height: 42px;
          padding: 0;
          font-size: 0;
          margin: 0;
          border: 0;
        }
      }
    }
  }
}

.animation-ease {
  transition-property: transform;
  transition-duration: 1s;
  transition-timing-function: ease;
}
</style>
