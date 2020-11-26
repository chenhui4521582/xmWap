<template>
  <main class="poolJackpot" :class="{'showHeader': $moduleConfig.isShowHeader}">
    <wf-header title="奖池汇总" bgColor="#fff" />
    <loading v-show="showLoading" />
    <article v-show="!showLoading">
      <template v-if="myList.length">
        <section class="title">
          <p>
            <span><i class="line"></i>我的关注</span>
          </p>
        </section>
        <section class="list-wrappers">
          <ul>
            <li v-for="(item,index) in myList" :key="`my-list-${index}`">
              <item :info='item' @refresh="getAwardPoolCenterHome" />
            </li>
          </ul>
        </section>
        <section class="title">
          <p>
            <span><i class="line"></i>所有奖池</span>
          </p>
        </section>
      </template>
      <section class="list-wrappers">
        <p class="sub-title" :class="myList.length?'left':'center'">开启中</p>
        <template v-if="openedList.length">
          <ul>
            <li v-for="(item,index) in openedList" :key="`opened-list-${index}`">
              <item :info='item' @refresh="getAwardPoolCenterHome" />
            </li>
          </ul>
        </template>
        <template v-else>
          <img class="empty" src="./img/empty.png" alt="">
        </template>
      </section>
      <section class="list-wrappers">
        <p class="sub-title" :class="myList.length?'left':'center'">即将开启</p>
        <template v-if="unopenedList.length">
          <ul>
            <li v-for="(item,index) in unopenedList" :key="`unopened-list-${index}`">
              <item :info='item' @refresh="getAwardPoolCenterHome" />
            </li>
          </ul>
        </template>
        <template v-else>
          <img class="empty" src="./img/empty.png" alt="">
        </template>
      </section>
    </article>
  </main>
</template>

<script>
import item from './components/item'
import Service from '@/services/index'
import _get from 'lodash.get'
export default {
  name: 'poolJackpot',
  components: {
    item
  },
  data () {
    return {
      allList: [],
      timer: null,
      showLoading: true
    }
  },
  computed: {
    myList () {
      return this.allList.filter(item => item.subscribeStatus === 1) || []
    },
    openedList () {
      return this.allList.filter(item => item.awardPoolStatus === 1) || []
    },
    unopenedList () {
      return this.allList.filter(item => item.awardPoolStatus === 0) || []
    },
  },
  mounted () {
    this.timerStart()
    this.$marchSetsPoint('P_H5PT0324') // H5平台-奖池汇总-页面加载完成
  },
  methods: {
    timerStart () {
      this.getAwardPoolCenterHome()
      this.timer = setTimeout(() => {
        clearTimeout(this.timer)
        this.timerStart()
      }, 15000)
    },
    async getAwardPoolCenterHome () {
      const res = await Service.getAwardPoolCenterHome()
      const code = _get(res, 'data.code', 0)
      if (code === 200) {
        this.showLoading = false
        this.allList = _get(res, 'data.data', [])
      }
    }
  }
}
</script>

<style lang="less" scoped>
.poolJackpot {
  background: #f7f7f7;
  min-height: 100vh;
  padding: 30px 24px;
  &.showHeader {
    padding-top: 130px;
  }
  .title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    p {
      display: flex;
      align-items: center;
      margin-bottom: 4px;
      color: #e8382b;
      font-size: 24px;
      margin-right: 10px;
      line-height: 1;
    }
    span {
      color: #000;
      font-size: 32px;
      font-weight: bold;
      line-height: 1.1;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      i {
        margin-right: 10px;
        width: 6px;
        height: 32px;
        border-radius: 3px;
        background: #ff4141;
      }
    }
  }
  .list-wrappers {
    .sub-title {
      font-size: 24px;
      font-weight: 500;
      color: #888;
      margin-top: 30px;
    }
    ul {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
    }
    .empty {
      width: 338px;
      display: block;
      margin: 60px auto;
    }
  }
  .center {
    text-align: center;
  }
  .left {
    text-align: left;
  }
}
</style>
