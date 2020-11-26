<template>
  <div class="awards-dialog" v-show="value">
    <div class="mask"></div>
    <div class="dialog-content">
      <div class="title">
        <img v-if="titleImg" :src="titleImg" alt="" />
        <img v-else src="./img/title.png" alt="" />
      </div>
      <div class="wrapper">
        <!-- 关闭按钮 -->
        <div class="closed iconfont icon-close" @click="hideDialog"></div>
        <div class="tips">{{tipsTxt}}
          <p v-if="tipsOtherText">{{tipsOtherText}}</p>
        </div>
        <!--奖品-->
        <div class="awards" v-if="showAwards" :class="{more:awards.length>1}">
          <div class="item" v-for="(item,index) in awards" :key="index">
            <!--奖品图片-->
            <div class="awards-img" :class="{'height-auto':item.autoHeight}">
              <img v-if="item.nofilter" :src="item.awardsImage" alt="">
              <img v-else :src="item.awardsImage | filter" alt="" />
            </div>
            <!--奖品名称-->
            <div class="awards-name" v-html="item.awardsName">
            </div>
            <div class="awards-info" v-html="item.info"></div>
          </div>
        </div>
        <!-- 说明 -->
        <div class="explain" v-if="explainText.text" :style="`color:${explainText.color}`">
          {{ explainText.text }}
        </div>
        <div class="explain" v-if="explainText.html" v-html="explainText.html">
        </div>
        <!-- 确认按钮 -->
        <div class="confirm-btn" v-if="confirmBtnText" @click="confirmCallback">
          {{ confirmBtnText }}
        </div>
        <div class="normal-btn" v-if="normalBtnText && normalBtnText.length">
          <div @click="confirmCallback('cancel')">{{normalBtnText[0]}}</div>
          <div v-if="normalBtnText[1]" @click="confirmCallback('sure')">{{normalBtnText[1]}}</div>
        </div>
        <div class="bottom-link" v-if="bottomLink.text" @click="bottomLink.callback">
          {{ bottomLink.text }}
        </div>
      </div>
      <!-- 强广位置 -->
      <div class="recommend" v-if="showRecommend" @click="recommendClick">
        <img :src="recommend.cdnImage | filter" alt="" />
      </div>
    </div>
  </div>
</template>

<script>
import { jumpUrl, newUtils } from '@/utils/utils'
export default {
  name: 'awardsDialog',
  props: {
    value: {
      type: Boolean,
      default: false
    },
    /** 头部图片 **/
    titleImg: {
      type: String,
      default: ''
    },
    /** 确认按钮文字 **/
    confirmBtnText: {
      type: String,
      default: '朕收下了'
    },
    /** 确认按钮文字 **/
    normalBtnText: {
      type: Array,
      default: () => ([])
    },
    /** 底部链接 **/
    bottomLink: {
      type: Object,
      default: () => ({
        text: '',
        callback: function () { }
      })
    },
    /** 说明文字 **/
    explainText: {
      type: Object,
      default: () => ({
        text: '',
        color: '#ACACAC'
      })
    },
    /** 奖品 **/
    awards: {
      type: Array,
      default: () => []
    },
    /** 推广位 **/
    recommend: {
      type: Object,
      default: () => ({
        cdnImage: '',
        url: ''
      })
    },
    tipsTxt: {
      type: String,
      default: '恭喜您获得'
    },
    tipsOtherText: {
      type: String,
      default: ''
    }
  },
  methods: {
    /** 关闭弹出框 **/
    hideDialog () {
      this.$emit('input', false)
      this.$emit('closedCallback', 'close')
    },
    /** 确认按钮回掉 **/
    confirmCallback (type) {
      this.$emit('callback', type)
    },
    /** 强广位点击 **/
    async recommendClick () {
      this.$marchSetsPoint('A_H5PT0022001137')
      jumpUrl(this.recommend.url)
    }
  },
  computed: {
    showAwards () {
      return this.awards.length
    },
    showRecommend () {
      return this.recommend.cdnImage && this.recommend.url
    }
  },
  watch: {
    value (val) {
      if (val) {
        newUtils.ScrollNoMove()
      }
      else {
        newUtils.ScrollMove()
      }
    }
  }
}
</script>

<style scoped lang="less">
.awards-dialog {
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  z-index: 11;
  .mask {
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    z-index: 10;
    background: rgba(0, 0, 0, 0.7);
  }
  .dialog-content {
    position: absolute;
    left: 50%;
    top: 50%;
    z-index: 11;
    width: 470px;
    transform: translate(-50%, -50%);
    .title {
      position: absolute;
      left: 50%;
      top: -78px;
      transform: translate(-50%, 0);
      width: 275px;
      height: 155px;
      img {
        vertical-align: top;
        width: 100%;
      }
    }
    .wrapper {
      padding: 78px 0 1px;
      width: 100%;
      background: #fff;
      overflow: visible;
      border-radius: 32px;
      .closed {
        position: absolute;
        right: 30px;
        top: 30px;
        color: #666666;
        font-size: 18px;
      }
      .tips {
        margin-top: 15px;
        font-size: 28px;
        font-weight: bold;
        color: #000;
        text-align: center;
        p {
          font-weight: 400;
        }
      }
      .awards {
        margin-top: 19px;
        display: flex;
        justify-content: center;
        position: relative;
        .item{
          .awards-img {
            margin: 0 auto;
            height: 160px;
            text-align: center;
            img {
              max-width: 100%;
              height: 100%;
              vertical-align: top;
            }
            &.height-auto {
              height: auto;
              img {
                max-width: 100%;
                height: auto;
              }
            }
          }
          .awards-name {
            color: #ff4141;
            font-size: 24px;
            text-align: center;
          }
          .awards-info{
            font-size: 20px;
            font-weight: 500;
            line-height: 30px;
            color: #888;
            text-align: center;
          }
        }
        &.more:before{
          content: '';
          width: 30px;
          height: 30px;
          background: url("./img/plus.png");
          background-size: 100% 100%;
          position: absolute;
          top:70px;
          left: 200px;
        }
      }
      .explain {
        margin-top: 6px;
        font-size: 20px;
        color: #bbbbbb;
        text-align: center;
      }
      .confirm-btn {
        margin: 28px auto 42px;
        width: 250px;
        height: 70px;
        line-height: 70px;
        text-align: center;
        font-size: 24px;
        color: #fff;
        border-radius: 16px;
        overflow: hidden;
        background: #ff4141;
      }
      .normal-btn {
        color: #000;
        text-align: center;
        border-top: 1px solid #eee;
        line-height: 90px;
        font-size: 24px;
        font-weight: 500;
        display: flex;
        align-items: center;
        justify-content: center;
        div {
          flex: 1;
          &:last-child {
            color: #ff4141;
          }
        }
      }
      .bottom-link {
        margin: 20px auto 0;
        color: #5186ca;
        text-align: center;
        font-size: 24px;
      }
    }
    .recommend {
      margin: 20px auto 0;
      width: 470px;
      text-align: center;
      border-radius: 16px;
      overflow: hidden;
      img {
        max-width: 100%;
        vertical-align: top;
      }
    }
  }
}
@keyframes rotate {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
<style>
.explain .fs24 {
  font-size: 24px;
  line-height: 36px;
}
.explain .margin30auto {
  margin: 30px auto;
}
.explain .color888 {
  color: #888;
}
.explain .red-text {
  color: #ff4141;
}
</style>
