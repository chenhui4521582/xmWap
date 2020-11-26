<template>
  <div class="billcomment">
    <wf-header title="晒单专区" :needShow='true' :customize="true" @on-click="requenPage"
      @on-back="requenPage" style="background-color: #fff;" />
    <!-- tab 切换 -->
    <div class="billcomment-tab-wrap">
      <div class="tab-item" v-for="(tab,index) in tabList"
        :class="{'tab-item-active': index===tabSelected}" :key="index" @click="switchTab(index)">
        <span>{{tab}}{{index==0?'':`(${totalNum})`}}</span>
        <i class="line" v-show="index===tabSelected"></i>
      </div>
    </div>
    <div class="billcomment-shop-content" :class="$moduleConfig.plantVersion" ref="shopContent">
      <div class="content-warp">
        <template v-if="currentList.length>0">
          <better-scroll :data="currentList" ref="better_scroll" @scroll="scroll"
            :listenScroll="true" :probeType="3">
            <ul class="list-warp">
              <li class="list-item" v-for="(item ,index) in currentList" :key="index">
                <div class="list-content">
                  <img :src="(item.profilePhoto||avatar) | filter" class="img">
                  <div class="name">{{item.nickname}}</div>
                  <div class="cat_level">Lv.{{item.catVipLev}}</div>
                </div>
                <div class="time_product">{{item.createTime}} {{item.awardName}}</div>
                <div class="comment-info">{{item.commentRemark||'用户暂时没有填写评价~'}}</div>
              </li>
              <div class="bottom-line"
                v-if="(tabSelected==0&&comment0End)||(tabSelected==1&&comment1End)">
                <bottom-line></bottom-line>
              </div>
            </ul>
          </better-scroll>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import BetterScroll from '@/components/betterScroll/betterScroll'
import { getContentCommentListByProductId } from '@/services/user'

export default {
  name: 'index',
  props: {
    detailItem: {
      type: Object,
      default: null
    }
  },
  data () {
    return {
      tabSelected: 0,
      tabList: ['全部', '有内容'],
      currentCommentItem: null,
      comment0PageNum: 1,
      comment1PageNum: 1,
      comment0List: [],
      comment1List: [],
      comment0End: false,
      comment1End: false,
      pageSize: 40,
      totalNum: 0
    }
  },
  computed: {
    currentList () {
      return this.tabSelected == 0 ? this.comment0List : this.comment1List
    },
    avatar () {
      return '/group1/M00/43/24/CmcEHV56zD2ALRGgAAAhuTmu1OY154.png'
    },
  },
  components: {
    BetterScroll
  },
  methods: {
    async init () {
      this.comment0PageNum = 1
      this.comment1PageNum = 1
      this.comment0List = []
      this.comment1List = []
      this.comment0End = false
      this.comment1End = false
      await this.getContentCommentListByProductIdData()
      if (this.totalNum) {
        this.tabSelected = 1
      }
      await this.getALLCommentListByProductIdData()
    },
    // tab 切换
    switchTab (index) {
      this.tabSelected = index
      this.$refs.better_scroll.scrollTo(0, 0)
    },
    commentExit (flag) {
      this.currentCommentItem = null
      if (flag) {
        this.init()
      }
    },
    async getContentCommentListByProductIdData () {
      const { code, data } = await getContentCommentListByProductId({
        phyAwardsId: this.detailItem && this.detailItem.phyAwardsId,
        type: 2,
        page: this.comment0PageNum,
        pageSize: this.pageSize
      })
      if (code === 200) {
        this.totalNum = data.totalNum
        if (data && data.commentList.length) {
          this.comment1PageNum === 1 ? this.comment1List = data.commentList : this.comment1List = [...this.comment1List, ...data.commentList]
          /** 解除滚动限制 **/
          if (data.commentList.length == this.pageSize) {
            this.comment1End = false
          } else {
            this.comment1End = true
          }
        } else {
          this.comment1End = true
        }
      }
    },
    async getALLCommentListByProductIdData () {
      const { code, data } = await getContentCommentListByProductId({
        phyAwardsId: this.detailItem && this.detailItem.phyAwardsId,
        type: 1,
        page: this.comment0PageNum,
        pageSize: this.pageSize
      })
      if (code === 200) {
        if (data && data.commentList.length) {
          this.comment0PageNum === 1 ? this.comment0List = data.commentList : this.comment0List = [...this.comment0List, ...data.commentList]
          /** 解除滚动限制 **/
          if (data.commentList.length == this.pageSize) {
            this.comment0End = false
          } else {
            this.comment0End = true
          }
        } else {
          this.comment0End = true
        }
      }
    },
    /** 列表滚动到底部重新获取数据 **/
    scroll (pos) {
      let height = document.querySelector('.billcomment-shop-content .content-warp').clientHeight
      let boxHeight = document.querySelector('.billcomment-shop-content').clientHeight
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
            this.getALLCommentListByProductIdData()
          } else {
            this.comment1PageNum++
            this.getContentCommentListByProductIdData()
          }
        }, 100)
      }
    },
    // 返回按钮
    async requenPage () {
      this.$emit('close')
    }
  },
  mounted () {
    // 监听滚动事件
    window.addEventListener('scroll', this.handleScroll)
    this.init()
  },
  destroyed () {
    window.removeEventListener('scroll', this.handleScroll)
  }
}
</script>
<style lang="less" scoped>
.billcomment {
  min-height: 100vh;
  background-color: #f7f7f7;
  overflow-x: hidden;
  position: fixed;
  left: 0;
  right: 0;
  margin: auto;
  z-index: 11;
  .billcomment-tab-wrap {
    padding: 0 24px;
    position: absolute;
    top: 90px;
    left: 0;
    z-index: 10;
    width: 100%;
    height: 80px;
    display: flex;
    align-items: center;
    .tab-item {
      position: relative;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 120px;
      height: 42px;
      background: rgba(237, 237, 237, 1);
      opacity: 1;
      border-radius: 10px;
      font-size: 24px;
      font-weight: 500;
      line-height: 36px;
      color: rgba(136, 136, 136, 1);
      &:nth-child(2) {
        width: 150px;
        margin-left: 20px;
      }
    }
    .tab-item-active {
      background: rgba(255, 65, 65, 1);
      color: rgba(255, 255, 255, 1);
    }
  }
  .billcomment-shop-content {
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
      padding: 0 24px 0;
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
        align-items: center;
        .img {
          width: 30px;
          height: 30px;
        }
        .name {
          font-size: 28px;
          font-weight: bold;
          line-height: 42px;
          color: rgba(0, 0, 0, 1);
          margin: 0 0.15rem;
        }
        .cat_level {
          width: 80px;
          height: 30px;
          line-height: 30px;
          text-align: center;
          background: url('../../images/cat_level.png');
          background-size: 100% 100%;
          font-size: 20px;
          font-weight: 500;
          line-height: 28px;
          color: rgba(255, 255, 255, 1);
        }
      }
      .time_product {
        font-size: 24px;
        font-weight: 400;
        line-height: 36px;
        color: rgba(187, 187, 187, 1);
        margin: 22px 0 9px;
      }
      .comment-info {
        margin-top: 16px;
        font-size: 24px;
        font-weight: 400;
        line-height: 36px;
        color: rgba(0, 0, 0, 1);
      }
    }
    .bottom-line {
      padding: 30px 0;
    }
  }
}
</style>
