<template>
  <section class="costLog">
    <div class="header">
      <span class="iconfont icon-return"
        v-if="$moduleConfig.plantVersion != 'red'&&$moduleConfig.isShowHeader" @click="back"></span>
      <ul class="tabs" :class="{'noborder':currentTab.title=='碎片合成记录'}">
        <li v-for="tab in tabs" @click="changeTab(tab)"
          :class="{ active: tab.title == currentTab.title }" :key="tab.title">
          <div class="title">{{ tab.title }}</div>
          <div class="line"></div>
        </li>
      </ul>
    </div>

    <div class="assets_table">
      <ul class="table-header">
        <li v-for="(item,index) in currentTab.items" :key="index">{{item}}</li>
      </ul>
      <ul class="table-container" v-if="logs.length>0">
        <li v-for="(log,index) in logs" :key="index">
          <span>
            <div class="time">
              {{log.time}}
            </div>
          </span>
          <span>{{log.award}}</span>
          <span>{{log.from}}</span>
        </li>
        <template v-if="currentTab.title == '金叶使用记录'">
          <div class="infinite-box">
            <infinite-loading @infinite="infiniteHandler" ref="infiniteLoading">
              <p slot="no-more"></p>
              <div slot="no-results"></div>
            </infinite-loading>
          </div>
        </template>
      </ul>
      <div class="nothing" v-else>
        <img src="../../../../assets/images/no-list.png" alt="" />
        <p>很遗憾，暂无数据</p>
      </div>
      <div class="bottom-lint" v-if="logs.length"></div>
      <p class="no-more" v-if="logs.length && currentTab.title == '金叶使用'">
        只展示最近3天数据<br>
        如需拉取更多数据，请点击<a @click="goToCustomerService">联系客服</a>
      </p>
      <bottom-line v-if="logs.length && currentTab.title != '金叶使用'" />
    </div>
  </section>
</template>
<script>
import Services from '@/services/personalCenter'
import InfiniteLoading from 'vue-infinite-loading'
import { mapState } from 'vuex'
import _map from 'lodash.map'
export default {
  components: {
    InfiniteLoading
  },
  data () {
    return {
      currentTab: {},
      curPage: 1,
      logs: [],
      tabs: [
        {
          title: '碎片领取',
          items: ['获取时间', '碎片数量', '碎片来源']
        },
        {
          title: '碎片合成',
          items: ['获取时间', '奖品合成', '奖品来源']
        },
        {
          title: '金叶使用',
          items: ['使用时间', '使用数量', '使用场景']
        }
      ]
    }
  },
  mounted () {
    this.changeTab(this.tabs[0])
  },
  computed: {
    ...mapState(['userInfo'])
  },
  methods: {
    goToCustomerService () {
      this.$router.push({ name: 'customerService' })
    },
    infiniteHandler ($state) {
      this.curPage++
      this.addList(this.curPage).then(response => {
        //debugger;
        if (response.data.code == 200) {
          if (!response.data.data.length) {
            $state.complete()
          } else {
            let params = response.data.data.map(item => {
              let param = {
                id: item.id,
                time: item.createTime,
                award: item.number,
                from: item.businessType
              }
              return param
            })
            //debugger;
            this.logs = [...this.logs, ...params]
            $state.loaded()
            if (response.data.length < this.pageSize) {
              $state.complete()
            }
          }
        }
      })
    },
    addList (curPage) {
      return Services.getLeafDetail({
        page: curPage,
        pageSize: 20,
        params: this.logs[this.logs.length - 1].id,
        userId: this.userInfo.userId
      })
    },
    changeTab (tab) {
      this.currentTab = tab
      this.logs = []
      if (tab.title == '碎片领取') {
        Services.findUserFragmentRecord({
          page: 1,
          pageSize: 100
        }).then(res => {
          this.logs = _map(res.data.data, item => {
            return {
              time: item.createTime,
              award: item.name,
              from: item.source
            }
          })
        })
      } else if (tab.title == '碎片合成') {
        Services.findUserComposeRecord({
          page: 1,
          pageSize: 100
        }).then(res => {
          this.logs = _map(res.data.data, item => {
            return {
              time: item.createTime,
              award: item.name,
              from: item.source
            }
          })
        })
      } else if (tab.title == '金叶使用') {
        Services.getLeafDetail({
          page: this.curPage,
          pageSize: 20,
          userId: this.userInfo.userId
        }).then(res => {
          this.logs = _map(res.data.data, item => {
            return {
              id: item.id,
              time: item.createTime,
              award: item.number,
              from: item.businessType
            }
          })
        })
      }
    },
    back () {
      this.$router.back(-1)
    }
  }
}
//TODO: 更多联系客服的跳转
</script>
<style lang="less" scoped>
.header {
  position: fixed;
  left: 0;
  top: 0;
  z-index: 10;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 94px;
  background: #f7f7f7;
  .iconfont {
    position: absolute;
    left: 24px;
    top: 50%;
    transform: translate(0, -50%);
    font-size: 30px;
    font-weight: bold;
  }
}
.bottom-lint {
  width: 100%;
  height: 20px;
  background: rgba(255, 250, 212, 1);
  border-radius: 0px 0px 12px 12px;
  margin-bottom: 20px;
}
.costLog {
  padding: 94px 24px 24px;
  .tabs {
    display: flex;
    align-items: center;
    box-align: center;
    li {
      position: relative;
      padding: 0 20px;
      color: #000;
      font-size: 30px;
      &.active {
        font-weight: bold;
        .line {
          position: absolute;
          bottom: -10px;
          left: 50%;
          transform: translate(-50%, 0);
          width: 32px;
          height: 6px;
          border-radius: 3px;
          background: #ff4141;
        }
      }
    }
    &.noborder {
      li {
        .title {
          border: none;
        }
      }
    }
  }
  .assets_table {
    .table-header {
      display: flex;
      li {
        margin-top: 27px;
        background: #fffad4;
        height: 50px;
        line-height: 50px;
        flex: 1;
        font-size: 24px;
        color: #000;
        text-align: center;
        &:last-child {
          border-radius: 0 16px 0 0;
        }
        &:first-child {
          border-radius: 16px 0 0 0;
        }
      }
    }
    .table-container {
      max-height: calc(100vh - 320px);
      overflow: auto;
      li {
        display: flex;
        align-items: center;
        height: 90px;
        font-size: 24px;
        color: #000;
        background: #fff;
        &:nth-child(even) {
          background: #fffdef;
        }
        span {
          text-align: center;
          flex: 1;
          .time {
            display: inline-block;
            width: 180px;
          }
          &:first-child {
            width: 30%;
            overflow: hidden;
            word-break: break-word;
          }
        }
      }
    }
    .nothing {
      position: absolute;
      top: 35%;
      left: calc((100% - 200px) / 2);
      color: #acacac;
      font-size: 20px;
      text-align: center;
      p {
        margin-top: 20px;
      }
      img {
        width: 152px;
      }
    }
    .no-more {
      text-align: center;
      margin-top: 50px;
      font-size: 20px;
      line-height: 30px;
      color: #bbbbbb;
      a {
        text-decoration: underline;
        color: #5186ca;
      }
    }
  }
}
</style>