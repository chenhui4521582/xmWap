<template>
  <div class="billcomment">
    <wf-header title="晒单专区"/>
    <!-- tab 切换 -->
    <div class="tab-wrap" :class="{'center': tabList.length < 5}">
      <div class="tab-item" v-for="(tab,index) in tabList" :class="{'tab-item-active': index===tabSelected}"
           :key="index" @click="switchTab(index)">
        <span>{{tab}}</span>
        <i class="line" v-show="index===tabSelected"></i>
      </div>
    </div>
    <div class="shop-content" :class="$moduleConfig.plantVersion" ref="shopContent">
      <div class="content-warp">
        <template v-if="currentList.length>0">
          <better-scroll :data="currentList" ref="better_scroll" @scroll="scroll" :listenScroll="true" :probeType="3">
            <ul class="list-warp">
              <li class="list-item" v-for="(item ,index) in currentList" :key="index" @click="goToComment(item)">
                <div class="list-content" v-if="tabSelected==0">
                  <img :src="item.awardImage | filter" class="img">
                  <div class="product-right">
                    <div class="product-title">{{item.awardName}}</div>
                    <div class="button-warp">
                      <div class="price">获奖时间：{{item.time}}</div>
                      <div class="right">去评价</div>
                    </div>
                  </div>
                </div>
                <template v-else>
                  <div class="list-content">
                    <img :src="item.awardImage | filter" class="img">
                    <div class="product-right">
                      <div class="product-title">{{item.awardName}}</div>
                      <div class="decmatch">
                        <span>描述相符</span>
                        <div class="star">
                          <template v-for="it in item.descStars">
                            <img src="../../image/redstar.png" alt="" :key="'descredstar'+it"/>
                          </template>
                          <template v-for="it in (5-item.descStars)">
                            <img src="../../image/graystar.png" alt="" :key="'descgraystar'+it">
                          </template>
                        </div>
                        <span>{{commentText[item.descStars-1]}}</span>
                      </div>
                      <div class="speedmatch">
                        <span>发货速度</span>
                        <div class="star">
                          <template v-for="it in item.sendTimeStars">
                            <img src="../../image/redstar.png" alt="" :key="'speedredstar'+it">
                          </template>
                          <template v-for="it in (5-item.sendTimeStars)">
                            <img src="../../image/graystar.png" alt="" :key="'speedgraystar'+it"/>
                          </template>
                        </div>
                        <span>{{commentText[item.sendTimeStars-1]}}</span>
                      </div>
                      <span class="comment_time">评价时间：{{item.commentTime}}</span>
                    </div>
                  </div>
                  <div class="comment-info">{{item.remark||'您没有填写评价内容~'}}</div>
                </template>
              </li>
              <div class="bottom-line" v-if="(tabSelected==0&&comment0End)||(tabSelected==1&&comment1End)">
                <bottom-line></bottom-line>
              </div>
            </ul>
          </better-scroll>
        </template>
      </div>
    </div>
    <comment :item="currentCommentItem" v-if="currentCommentItem" @exit="commentExit" @refresh="init"></comment>
  </div>
</template>

<script>
  import BetterScroll from '@/components/betterScroll/betterScroll'
  import comment from './components/comment'
  import { getCommentList, getNoCommentList, getCommentDetail, prizeComment } from '@/services/user'

  export default {
    name: 'index',
    data() {
      return {
        tabSelected: 0,
        tabList: ['待评价', '已评价'],
        currentCommentItem: null,
        comment0PageNum: 1,
        comment1PageNum: 1,
        comment0List: [],
        comment1List: [],
        comment0End: false,
        comment1End: false,
        commentText: ['非常差', '差', '一般', '好', '非常好'],
      }
    },
    computed: {
      currentList() {
        return this.tabSelected == 0 ? this.comment0List : this.comment1List
      }
    },
    components: {
      BetterScroll, comment
    },
    methods: {
      init() {
        this.comment0PageNum=1
        this.comment1PageNum=1
        this.comment0List=[]
        this.comment1List=[]
        this.comment0End=false
        this.comment1End=false
        this.getNoCommentListData()
        this.getCommentListData()
      },
      // tab 切换
      switchTab(index) {
        this.tabSelected = index
        this.$refs.better_scroll&&this.$refs.better_scroll.scrollTo(0, 0)
      },
      goToComment(item) {
        if (this.tabSelected == 0) {
          this.currentCommentItem = item
        } else {
          this.currentCommentItem = null
        }
      },
      commentExit(flag) {
        this.currentCommentItem = null
        if (flag) {
          this.init()
        }
      },
      async getNoCommentListData() {
        const { code, data } = await getNoCommentList(this.comment0PageNum)
        if (code === 200) {
          if (data && data.length) {
            this.comment0PageNum === 1 ? this.comment0List = data : this.comment0List = [...this.comment0List, ...data]
            /** 解除滚动限制 **/
            if (data.length == 10) {
              this.comment0End = false
            } else {
              this.comment0End = true
            }
          } else {
            this.comment0End = true
          }
        }
      },
      async getCommentListData() {
        const { code, data } = await getCommentList(this.comment1PageNum)
        if (code === 200) {
          if (data && data.length) {
            this.comment1PageNum === 1 ? this.comment1List = data : this.comment1List = [...this.comment1List, ...data]
            /** 解除滚动限制 **/
            if (data.length == 10) {
              this.comment1End = false
            } else {
              this.comment1End = true
            }
          } else {
            this.comment1End = true
          }
        }
      },
      /** 列表滚动到底部重新获取数据 **/
      scroll(pos) {
        let height = document.querySelector('.shop-content .content-warp').clientHeight
        let boxHeight = document.querySelector('.shop-content').clientHeight
        let endPosition = height - boxHeight
        if (Math.abs(Math.round(pos.y)) > endPosition) {
          /** 添加滚动锁数据没有回来不允许加载数据**/
          if (this.tabSelected == 0) {
            if (this.comment0End) {
              return false
            }
            this.comment0End = true
          } else {
            if (this.comment1End) {
              return false
            }
            this.comment1End = true
          }
          setTimeout(() => {
            // 向列表添加数据
            if (this.tabSelected == 0) {
              this.comment0PageNum++
              this.getNoCommentListData()
            } else {
              this.comment1PageNum++
              this.getCommentListData()
            }
          }, 100)
        }
      }
    },
    mounted() {
      // 监听滚动事件
      window.addEventListener('scroll', this.handleScroll)
      this.init()
    },
    destroyed() {
      window.removeEventListener('scroll', this.handleScroll)
    }
  }
</script>
<style lang="less" scoped>
  .billcomment {
    min-height: 100vh;
    background-color: #f7f7f7;
    overflow-x: hidden;
    .tab-wrap {
      padding: 0 24px;
      position: absolute;
      top: 80px;
      left: 0;
      z-index: 10;
      width: 100%;
      height: 80px;
      display: flex;
      justify-content: center;
      &.center {
        justify-content: center;
      }
      .tab-item {
        flex: 1;
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 32px;
        color: #888888;
        .line {
          position: absolute;
          bottom: 2px;
          left: 50%;
          margin-left: -16px;
          overflow: hidden;
          width: 32px;
          height: 6px;
          background: #ff4141;
          border-radius: 3px;
        }
      }
      .tab-item-active {
        color: #000000;
        font-weight: bold;
      }
    }
    .shop-content {
      position: absolute;
      top: 170px;
      bottom: 0;
      width: 100%;
      overflow: hidden;
      &.red {
        bottom: 0;
      }
      .content-warp {
        position: relative;
        height: 100%;
        width: 100%;
        overflow: scroll;
      }
      .list-warp {
        padding: 10px 24px 0;
        display: flex;
        flex-wrap: wrap;
      }
      .list-item {
        width: 100%;
        margin-bottom: 20px;
        display: flex;
        flex-direction: column;
        background-color: #fff;
        min-height: 180px;
        border-radius: 16px;
        padding: 30px;
        box-shadow: 0 0 10px rgba(208, 208, 208, 0.2);
        .list-content {
          position: relative;
          display: flex;
          .icon_label {
            position: absolute;
            right: 16px;
            top: 16px;
            height: 44px;
          }
        }
        .img {
          width: 120px;
          height: 120px;
        }
        .product-right {
          width: 100%;
          margin-left: 16px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          overflow: hidden;
        }
        .product-title {
          font-size: 24px;
          line-height: 1.1;
          color: #333333;
          font-weight: bold;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          margin-bottom: 5px;
        }
        .button-warp {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          position: relative;
          color: #333;
          height: 42px;
          margin-top: 5px;
          .price {
            display: flex;
            justify-content: flex-start;
            align-items: center;
            font-size: 24px;
            font-weight: 400;
            color: rgba(136, 136, 136, 1);
            line-height: 1.1;
          }
          span {
            font-size: 32px;
            font-weight: bold;
          }
          .right {
            position: absolute;
            top: 0;
            right: 0;
            width: 120px;
            height: 42px;
            line-height: 42px;
            color: #FF4141;
            text-align: center;
            font-size: 24px;
            background: rgba(240, 240, 240, 1);
            border-radius: 10px;
          }
        }
        .comment-info {
          margin-top: 16px;
          font-size: 24px;
          font-weight: 400;
          color: rgba(0, 0, 0, 1);
        }
        .decmatch, .speedmatch {
          display: flex;
          align-items: center;
          line-height: 1.1;
          span {
            font-size: 24px;
            font-weight: 400;
            color: rgba(136, 136, 136, 1);
          }
          .star {
            img {
              margin: 0 11px;
              width: 26.17px;
              height: 25px;
            }
          }
        }
        .comment_time{
          font-size: 24px;
          font-weight: 400;
          color: rgba(136, 136, 136, 1);
        }
      }
      .bottom-line {
        padding: 30px 0;
      }
    }
  }
</style>
