<template>
  <div class="receiveDetail-main">
    <div class="receiveDetail-list-header">
      <div class="items">
        <div class="back iconfont icon-return" @click="back"></div>
        <div class="title">福袋手气</div>
      </div>
    </div>
    <div class="receiveDetail-content">
      <p>领取明细</p>
      <div class="desc">
        <div class="item"><span>{{name}}</span>的福袋</div>
        <div class="item">领取{{scrollData.length}}/100个</div>
      </div>
      <!-- 排行榜 -->
      <div class="ranking">
        <div class="ranking-list">
          <div class="ranking-title">
            <ul>
              <li class="num"></li>
              <li class="name">用户昵称</li>
              <li class="price">奖励额度</li>
            </ul>
          </div>
          <div class="ranking-center">
            <better-scroll ref="scroll" :data="scrollData" :listenScroll="true" :probeType="3" @scroll="scroll">
              <ul>
                <li v-for="(item, index) in scrollData" :key="index">
                  <span class="num">
                    <i v-if="item.index==0&&scrollData.length==100">运气王</i>
                  </span>
                  <span class="name">
                    <!--<img v-if="item.profilePhoto" :src="item.profilePhoto | filter" alt="" @click="viewImg(item.profilePhoto)">-->
                    <!--<img v-else src="//file.beeplaying.com/cdn/common/images/common/img_photo.png" alt="" />-->
                    <i>{{item.nickname}}</i>
                  </span>
                  <span class="price">{{ item.leafNum }}金叶</span>
                </li>
              </ul>
            </better-scroll>
            <!-- 返回顶部按钮 -->
            <div v-show="isBackTop" class="scroll-top" @click="backTop()"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script type="text/javascript">
  import BetterScroll from '@/components/betterScroll/betterScroll'
  import Services from '@/services/find'
  import _get from 'lodash.get'

  export default {
    props: {
      id: {
        type: String,
        default: ''
      },
      name: {
        type: String,
        default: ''
      }
    },
    data() {
      return {
        /** 传入scroll展示的数据 **/
        scrollData: [],
        /** 是否显示返回顶部按钮 **/
        isBackTop: false
      }
    },
    components: {
      BetterScroll
    },
    methods: {
      back() {
        this.$router.replace('/find')
      },
      /** 获取列表 **/
      _getRankList() {
        this.showLoading = true
        Services.getFindBagRecord(this.id)
          .then(res => {
            const result = _get(res, 'data.data')
            this.showLoading = false
            /** 列表数据 **/
            this.scrollData = result.logList
          })
      },
      /** 列表滚动到底部重新获取数据 **/
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
        this.$refs.scroll.scrollTo(0, 0)
        this.isBackTop = false
      },
      init() {
        this._getRankList()
      }
    },
    mounted() {
      //H5平台-发现-领取记录加载完成
      this.$marchSetsPoint('A_H5PT0272003344')
      this.init()
    }
  }
</script>
<style lang="less" scoped>
  .receiveDetail-main {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0px;
    top: 100px;
    padding: 0 24px;
    z-index: 2;
    background: #f7f7f7;
    .receiveDetail-list-header {
      position: fixed;
      left: 0;
      top: 0;
      width: 100%;
      padding: 26px;
      background: #f7f7f7;
      display: flex;
      height: 100px;
      .items {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 100%;
        padding-left: 20px;
        .title {
          position: relative;
          display: block;
          margin: 0 17px;
          font-size: 32px;
          color: rgba(0, 0, 0, 1);
          font-weight: bold;
        }
      }
      .back {
        position: absolute;
        font-size: 30px;
        left: 26px;
        top: 50%;
        transform: translate(0, -50%);
      }
    }
    .receiveDetail-content {
      position: relative;
      z-index: 1;
      p {
        font-size: 32px;
        font-weight: bold;
        line-height: 48px;
        color: rgba(0, 0, 0, 1);
        text-align: center;
        margin-bottom: 20px;
      }
      .desc {
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
        font-size: 28px;
        font-weight: bold;
        line-height: 42px;
        color: rgba(0, 0, 0, 1);
        margin-bottom: 4px;
        .item:nth-child(1) {
          display: flex;
          align-items: center;
          span {
            display: inline-block;
            max-width: 400px;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
          }
        }
        .item:nth-child(2) {
          font-size: 24px;
          font-weight: 400;
          line-height: 36px;
          color: rgba(136, 136, 136, 0.87);
        }
      }
      .ranking {
        .title {
          font-size: 28px;
          color: #252525;
          font-weight: bold;
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
                  width: 15%;
                }
                &.name {
                  width: 37%;
                }
                &.price {
                  width: 37%;
                }
              }
            }
          }
          .ranking-center {
            position: fixed;
            padding-bottom: 26px;
            top: 265px;
            left: 24px;
            right: 24px;
            bottom: 53px;
            overflow: hidden;
            background: #fffdef;
            border-radius: 0 0 16px 16px;
            box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.08);
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
                  background: #fffdef;
                }
                span {
                  display: block;
                  text-align: center;
                  &.num {
                    width: 20%;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    i {
                      width: 80px;
                      height: 30px;
                      background: rgba(255, 65, 65, 1);
                      border-radius: 6px;
                      font-size: 20px;
                      font-weight: 500;
                      line-height: 30px;
                      color: rgba(255, 255, 255, 1);
                    }
                  }
                  &.name {
                    width: 37%;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
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
                  &.price {
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
              background: url('../images/back_top.png') no-repeat center center;
              background-size: 52px 52px;
            }
          }
        }
      }
    }
  }
</style>
