<template>
  <div class="rich-list" :style="zIndex">
    <div class="header-bg">
      <div class="center"></div>
      <div class="bottom"></div>
    </div>
    <div class="profit-content">
      <!-- 我的盈利榜 -->
      <div class="my-profit">
        <div class="item">
          <div class="title">
            <span class="icon iconfont icon-people"></span>
            <span>我的排名</span>
          </div>
          <div class="value">
            {{myProfit.myRank}}
          </div>
        </div>
        <div class="item">
          <div class="title">
            <span class="icon iconfont icon-leaf"></span>
            <span>我的金叶子</span>
          </div>
          <div class="value">
            {{userInfo.amount | tenThousand}}
          </div>
        </div>
      </div>
      <!-- 排行榜 -->
      <div class="ranking">
        <div class="top-three">
          <div :class="`item item${index}`" v-for="(item, index) in topThreeData" :key="index">
            <div class="img">
              <div class="avatar">
                <div :class="`avatar-index avatar-index${index}`"></div>
                <div class="avatar-img">
                  <img v-if="item.headImg" :src="item.headImg | filter" alt="" @click="viewImg(item.headImg)">
                  <img v-else src="//file.beeplaying.com/cdn/common/images/common/img_photo.png" alt="" />
                </div>
              </div>
              <div class="user-info">
                <p class="nick-name">{{item.nickName}}</p>
                <p class="amount">{{item.amount | tenThousand}}</p>
              </div>
              <div :class="`raning-index raning-index${index}`">{{index+1}}</div>
            </div>
          </div>
        </div>
        <div class="ranking-list">
          <div class="ranking-title">
            <ul>
              <li class="num">排名</li>
              <li class="name">玩家</li>
              <li class="rich">财富</li>
            </ul>
          </div>
          <div class="ranking-center">
            <better-scroll
              ref="scroll"
              :data="scrollData"
              :listenScroll="true"
              :probeType="3"
              @scroll="scroll"
            >
              <ul>
                <template v-for="(item, index) in scrollData" >
                  <li v-if="index > 2" :key="index">
                    <span class="num">
                      <i>{{ item.index }}</i>
                    </span>
                    <span class="name">
                      <img v-if="item.headImg" :src="item.headImg | filter" alt="" @click="viewImg(item.headImg)">
                      <img v-else src="//file.beeplaying.com/cdn/common/images/common/img_photo.png" alt="" />
                      <i>{{ item.nickName }}</i>
                    </span>
                    <span class="rich">{{
                      item.amount | tenThousand
                    }}</span>
                  </li>
                </template>
              </ul>
            </better-scroll>
            <!-- 返回顶部按钮 -->
            <div v-show="isBackTop" class="scroll-top" @click="backTop()"></div>
          </div>
        </div>
      </div>
    </div>
   <viewImage :src="viewImage" @on-close="onClose()"/>
  </div>
</template>
<script>
import BetterScroll from "@/components/betterScroll/betterScroll"
import { mapState } from 'vuex'
import { getUrlParams } from '@/utils/utils'
import Services from '@/services/profit'
import _get from 'lodash.get'


export default {
  name: 'richList',
    data() {
    return {
      zIndex:{},
      viewImage:'',
      currentPage: 1,
      from: getUrlParams('from') || 'index',
      /** 我的数据 **/
      myProfit: {
        myRank: 0,
        myRank: ''
      },
      /** 滚动到底部锁 **/
      scrollLock: false,
      /** 前三名数据 **/
      topThreeData: [],
      /** 传入scroll展示的数据 **/
      scrollData: [],
      /** 是否显示返回顶部按钮 **/
      isBackTop: false
    }
  },
  components: {
    BetterScroll
  },
  filters: {
    tenThousand: value => {
      if(!value) {
        return 0
      }
      if (value < 10000) {
        return value
      } else {
        return Math.round((value / 10000) * 100) / 100 + '万'
      }
    }
  },
  computed: {
    ...mapState(['userInfo'])
  },
  methods: {
    viewImg(img){
      this.viewImage = img;
      this.zIndex = {
        'z-index':12
      }
    },
    onClose(){
      this.viewImage='';
      this.zIndex = {}
    },
    /** 获取列表 **/
    _getRankList() {
      this.showLoading = true
      Services.getRichList({ pageSize: 100, page: this.currentPage })
        .then(res => {
          this.showLoading = false
          this.list = _get(res, 'data.data.list', [])
          /** 我的财富数据 **/
          this.myProfit.myRank = _get(res, 'data.data.me') || '1000+'
          /** 列表数据 **/
          this.topThreeData = this.list.filter((item, index) => {
            if(index < 3) {
              return item
            }
          })
          this.scrollData = this.list
          /** 解除滚动限制 **/
          this.scrollLock = false
        })
        .catch(error => {
          /** 解除滚动限制 **/
          this.scrollLock = false
        })
    },
    /** 列表滚动到底部重新获取数据 **/
    scroll(pos) {
      /** 是否显示返回顶部 **/
      if (Math.abs(Math.round(pos.y)) > 200) {
        this.isBackTop = true
      } else {
        this.isBackTop = false
      }
    },
    /** 列表返回顶部 **/
    backTop() {
      this.$marchSetsPoint('A_H5PT0025001195')
      this.$refs.scroll.scrollTo(0, 0)
      this.isBackTop = false
    },
    init() {
      this.from = getUrlParams('from') || 'index'
      this._getRankList()
    }
  },
  mounted() {
    this.init()
  }
}
</script>
<style lang="less" scoped>
.rich-list {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 123px;
  top: 104px;
  padding: 0 24px;
  z-index: 2;
  .profit-content {
    position: relative;
    z-index: 1;
    .my-profit {
     position: relative;
      display: flex;
      justify-content: center;
      background: #fff;
      border-radius: 16px;
      height: 150px;
      padding: 30px 0;
      box-shadow:0px 3px 6px rgba(0,0,0,0.08);
      .item {
        flex: 1;
        border-right: 1px solid #e6e6e6;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        .title {
          line-height: 1;
          text-align: center;
          span {
            color: #000000;
            font-size: 24px;
            &:first-child {
              font-size: 30px;
              color: #FF4141;
              margin-right: 6px;
            }
          }
        }
        .value {
          text-align: center;
          font-size: 38px;
          color: #252525;
          font-weight: bold;
          line-height: 1;
        }
        &:nth-child(2) {
          border: none;
        }
      }
    }

    .ranking {
      overflow: hidden;
      .top-three {
        position: relative;
        margin: 50px 0 20px;
        height: 230px;
        .item {
          position: relative;
          width: 216px;
          height: 100%;
          .avatar {
            position: relative;
            margin: 0 auto;
            width: 80px;
            height: 80px;
            .avatar-img {
              width: 80px;
              height: 80px;
              border-radius: 50%;
              border: 2px solid #ff4141;
              img {
                vertical-align: top;
                width: 100%;
                height: 100%;
              }
            }
            .avatar-index {
              position: absolute;
              left: -22px;
              top: -35px;
              width: 72px;
              height: 65px;
              &.avatar-index0 {
                background: url(../img/top-three1.png) no-repeat center center ;
                background-size: 100% 100%;
              }
              &.avatar-index1 {
                background: url(../img/top-three3.png) no-repeat center center ;
                background-size: 100% 100%;
              }
              &.avatar-index2 {
                background: url(../img/top-three2.png) no-repeat center center ;
                background-size: 100% 100%;
              }
            }
          }
          .user-info {
            text-align: center;
            .nick-name {
              margin-top: 8px;
              font-size: 24px;
              line-height:36px;
              color:#000000;
            }
            .amount {
              font-size: 20px;
              line-height:30px;
              color:#FF4141;
            }
          }
          .raning-index {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            font-size: 28px;
            color: #888;
            font-weight: bold;
            text-align: center;
            box-shadow:0px 3px 6px rgba(0,0,0,0.08);
            border-radius:10px 10px 0px 0px;
            background:#FFFFFF;
            &.raning-index0{
              height: 70px;
              line-height: 70px;
            }
            &.raning-index1{
              height: 50px;
              line-height: 50px;
            }
            &.raning-index2{
              height: 30px;
              line-height: 32px;
            }
          }
          &.item0 {
            position: absolute;
            left: 50%;
            top: 0;
            transform: translate(-50%, 0);
          }
          &.item1 {
            padding-top: 15px;
            float: left;
          }
          &.item2 {
            padding-top: 39px;
            float: right;
          }
        }

      }
      .ranking-list {
        position: relative;
        border-radius: 16px 16px 0 0;
        overflow: hidden;
        .ranking-title {
          height: 50px;
          line-height: 50px;
          background: #FFFAD4;
          ul {
            display: flex;
            justify-content: space-between;
            align-items: center;
            li {
              text-align: center;
              font-size: 24px;
              color: #000000;
              &.num {
                width: 26%;
              }
              &.name {
                width: 37%;
              }
              &.rich {
                width: 37%;
              }
            }
          }
        }
        .ranking-center {
          position: fixed;
          padding-bottom: 26px;
          top: 606px;
          left: 24px;
          right: 24px;
          bottom: 100px;
          overflow: hidden;
          background: #FFFDEF;
          border-radius: 0 0 16px 16px;
          box-shadow:0px 3px 6px rgba(0,0,0,0.08);
          ul {
            li {
              width: 100%;
              height: 90px;
              line-height: 90px;
              font-size: 24px;
              color: #000000;
              display: flex;
              justify-content: space-between;
              align-items: center;
              &:nth-of-type(odd) {
                background: #fff;
              }
              &:nth-of-type(even) {
                background: #FFFDEF;
              }
              span {
                display: block;
                text-align: center;
                &.num {
                  width: 26%;
                  color: #acacac;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                }
                &.name {
                  width: 37%;
                  overflow: hidden;
                  text-align: left;
                  white-space: nowrap;
                  line-height: 30px;
                  img {
                    margin-right: 10px;
                    vertical-align: top;
                    width: 30px;
                    height: 30px;
                  }
                }
                &.rich {
                  width: 37%;
                }
              }
            }
          }
          .scroll-top {
            position: absolute;
            right: 0;
            bottom: 59px;
            width: 53px;
            height: 53px;
            background: url('../img/back_top.png') no-repeat center center;
            background-size: 52px 52px;
          }
        }

      }
    }
  }
}
</style>
