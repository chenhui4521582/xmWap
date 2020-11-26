<template>
  <div class="comment">
    <wf-header :customize="true" title="评价晒单" @on-back="returnpage" @on-click="returnpage"/>
    <div class="commit" @click="commit" v-if="!ischeck">提交</div>
    <div class="shop-content" :class="$moduleConfig.plantVersion">
      <div class="content-warp">
        <ul class="list-warp">
          <li class="list-item">
            <div class="list-content">
              <img :src="item.awardImage | filter" class="img">
              <div class="product-right">
                <div class="product-title">{{item.awardName}}</div>
                <div class="decmatch">
                  <span>描述相符</span>
                  <div class="star">
                    <template v-for="item in desRedStarNum">
                      <img src="../../../image/redstar.png" alt="" :key="'desc1'+item" @click="setRedStarNum(0,item)"/>
                    </template>
                    <template v-for="item in (5-desRedStarNum)">
                      <img src="../../../image/graystar.png" alt="" @click="setRedStarNum(0,desRedStarNum+item)"
                           :key="'desc0'+item"/>
                    </template>
                  </div>
                  <span class="comment_text">{{commentText[desRedStarNum-1]}}</span>
                </div>
                <div class="speedmatch">
                  <span>发货速度</span>
                  <div class="star">
                    <template v-for="item in speedRedStarNum">
                      <img src="../../../image/redstar.png" alt="" :key="'speed1'+item" @click="setRedStarNum(1,item)"/>
                    </template>
                    <template v-for="item in (5-speedRedStarNum)">
                      <img src="../../../image/graystar.png" alt="" :key="'speed0'+item"
                           @click="setRedStarNum(1,speedRedStarNum+item)"/>
                    </template>
                  </div>
                  <span class="comment_text">{{commentText[speedRedStarNum-1]}}</span>
                </div>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <div class="comment-content">
      <div class="content-warp" :class="{hastxt:commenttxt}" v-if="!ischeck">
        <div class="title" :class="{hastxt:commenttxt}">您的评价</div>
        <textarea v-model="commenttxt" placeholder="请描述评价内容（30字以内）" maxlength="30"></textarea>
      </div>
      <div class="content-warp ischeck" v-else>
        <div class="title">
          <div class="item">您的评价</div>
          <div class="item">{{commentTime}}</div>
        </div>
        <div class="commenttxt">{{commenttxt||'您没有填写评价内容~'}}</div>
      </div>
    </div>
    <comment-success v-if="showSuccessPop" @checkComment="checkComment" @back="refresh"></comment-success>
    <Modal v-model="showPop" type="2" title="温馨提示" closeText="退出" saveText="继续编辑" @on-close="exit" @on-save="gotoedit">
      <div class="pop-content">
        您有未提交的评价，返回后评论将<br>不被保存，确定要退出吗？
      </div>
    </Modal>
    <loading :mask="true" v-if="showLoading"></loading>
  </div>
</template>

<script>
  import { getCommentList, getNoCommentList, getCommentDetail, prizeComment } from '@/services/user'
  import commentSuccess from './commentSuccess'
  import Loading from '../../../../../components/ui_compontents/loading/loading'

  export default {
    name: 'comment',
    props: {
      item: {
        type: Object,
        default: null
      }
    },
    data() {
      return {
        commenttxt: '',
        showPop: false,
        showSuccessPop: false,
        desRedStarNum: 5,
        speedRedStarNum: 5,
        commentText: ['非常差', '差', '一般', '好', '非常好'],
        ischeck: false,
        successid: 0,
        showLoading: false,
        commentTime:''
      }
    },
    components: {
      Loading,
      commentSuccess
    },
    methods: {
      returnpage() {
        if (this.ischeck) {
          this.$emit('exit', true)
        } else {
          this.showPop = true
        }
      },
      refresh() {
        this.$emit('exit', true)
      },
      exit() {
        this.$emit('exit', this.ischeck)
      },
      gotoedit() {
        this.showPop = false
      },
      async commit() {
        this.showLoading = true
        try {
          const { code, data, message } = await prizeComment({
            logId: this.item.id,
            descStars: this.desRedStarNum,
            remark: this.commenttxt,
            sendTimeStars: this.speedRedStarNum
          })
          this.showLoading = false
          if (code == 200) {
            this.successid = data
            this.showSuccessPop = true
          } else {
            this.$Toast(message)
          }
        } catch (e) {
          this.showLoading = false
        }

      },
      async checkComment() {
        const { code,data, message } = await getCommentDetail(this.successid)
        if (code == 200) {
          this.commentTime=data.commentTime
          this.showSuccessPop = false
          this.ischeck = true
        }
      },
      setRedStarNum(flag, num) {
        if (!this.ischeck) {
          if (flag == 0) {
            this.desRedStarNum = num
          } else {
            this.speedRedStarNum = num
          }
        }
      }
    }
  }
</script>

<style lang="less" scoped>
  .comment {
    position: fixed;
    left: 0;
    right: 0;
    margin: auto;
    z-index: 11;
    min-height: 100vh;
    background-color: #f7f7f7;
    overflow-x: hidden;
    .commit {
      position: absolute;
      top: 25px;
      right: 30px;
      font-size: 24px;
      font-weight: 500;
      color: rgba(255, 65, 65, 1);
      z-index: 11;
    }
    .shop-content {
      position: absolute;
      top: 110px;
      width: 100%;
      .content-warp {
        position: relative;
        height: 100%;
        width: 100%;
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
            &.comment_text {
              color: rgba(187, 187, 187, 1);
            }
          }
          .star {
            img {
              margin: 0 11px;
              width: 26.17px;
              height: 25px;
            }
          }
        }
      }
      .bottom-line {
        padding: 30px 0;
      }
    }
    .comment-content {
      position: absolute;
      top: 320px;
      width: 100%;
      .content-warp {
        margin: 10px 24px 0;
        display: flex;
        flex-direction: column;
        background-color: #fff;
        border-radius: 16px;
        padding: 20px;
        box-shadow: 0 0 10px rgba(208, 208, 208, 0.2);
        font-size: 24px;
        font-weight: 400;
        color: rgba(136, 136, 136, 1);
        &:not(.ischeck) {
          height: 200px;
        }
        &.ischeck {
          min-height: 120px;
        }
        .title {
          display: flex;
          justify-content: space-between;
          .item {
            &:nth-child(2) {
              font-size: 20px;
              font-weight: 500;
              color: rgba(187, 187, 187, 1);
            }
          }
        }
        textarea {
          font-size: 24px;
          margin-top: 16px;
          background: rgba(247, 247, 247, 1);
          width: 628px;
          height: 110px;
          border-radius: 16px;
          border: none;
          padding: 17px 19px;
        }
        &.hastxt {
          color: rgba(0, 0, 0, 1);
        }
        .commenttxt {
          color: rgba(0, 0, 0, 1);
        }
      }
    }
  }

  .pop-content {
    font-size: 24px;
    font-weight: 400;
    text-align: center;
    color: rgba(136, 136, 136, 1);
  }
</style>
