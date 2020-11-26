<template>
  <div class="ranking-awards" v-show="showRankingPop">
    <div class="mask"></div>
    <div class="content-box_profit">
      <img class="bg" src="../img/pop_bg.png" alt="" />
      <img class="dear" src="../img/pop_dear.png" alt="" />
      <div class="content" v-html="contentText"></div>
      <div class="btn-check" @click="handleClick">{{ btnText }}</div>
    </div>
    <div class="btn-close profit" @click="close"></div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import _get from 'lodash.get'
import { newUtils } from '@/utils/utils'
import Services from '@/services/activity'

export default {
  name: 'rankingAwards',
  data:()=>({
    rankingAwards:{},
    showRankingPop:false
  }),
  mounted() {
    //this.init();
  },
  computed: {
    btnText() {
      let text = ''
      if (!this.rankingAwards.me) {
        return ''
      }
      if (this.rankingAwards.me.index <= 0 || this.rankingAwards.me.index > this.rankingAwards.rankcapacity) {
        text = '去打榜'
      } else {
        text = '收下继续打榜'
      }
      return text
    },
    contentText() {
      let html = ''
      if (!this.rankingAwards.me) {
        return ''
      }
      if (
        this.rankingAwards.me.index <= 0 ||
        this.rankingAwards.me.index > this.rankingAwards.rankcapacity
      ) {
        html = `<p style="margin-bottom: 10px;font-size: 15px;font-weight:bold;color:rgba(156,86,11,1);">在上期盈利榜中盈利<span>${this.rankingAwards.me.amount}</span>金叶;</p>
                <p style="font-size: 15px;font-weight:bold;color:rgba(156,86,11,1);">差一点就能拿奖了,快去打榜吧</p>`
      } else {
        html = `<p style="margin-bottom: 10px;font-size: 15px;font-weight:bold;color:rgba(156,86,11,1);">恭喜你,在上期盈利榜中获得</p>
                <p style="margin-bottom: 10px;font-size: 15px;font-weight:bold;color:rgba(156,86,11,1);">${this.rankingAwards.me.awardsName}</p>`
      }
      return html
    }
  },
  methods: {
    ...mapActions(['GET_USERINFO']),
    close() {
      this.$parent.initDialog();
      this.hideRankingPop()
    },
    /** 获取排行榜发榜数据 **/
    init (callback) {
      Services.getRankingAwards().then(res => {
        this.rankingAwards = _get(res, 'data.data', {})
        this.showRankingPop = _get(res, 'data.data.show', false)
        if (this.showRankingPop) {
          if (this.rankingAwards.me.index <= 0 || this.rankingAwards.me.index > this.rankingAwards.rankcapacity) {
            this.$marchSetsPoint('A_H5PT0019001198')
          } else {
            this.$marchSetsPoint('A_H5PT0019001196')
          }
        }
        if(callback){
          callback({
            name:'rankingAwards',
            isShow:this.showRankingPop
          })
        }
      })
    },
    handleClick() {
      if (!this.rankingAwards.me) {
        this.hideRankingPop()
      }
      if (
        this.rankingAwards.me.index <= 0 ||
        this.rankingAwards.me.index > this.rankingAwards.rankcapacity
      ) {
        this.hideRankingPop()
        this.$marchSetsPoint('A_H5PT0019001199')
      } else {
        this.hideRankingPop()
        this.$marchSetsPoint('A_H5PT0019001197')
      }
      this.GET_USERINFO()
    },
    hideRankingPop() {
      this.showRankingPop = false
    }
  },
  watch: {
    showRankingPop(value) {
      if(value) {
        newUtils.ScrollNoMove()
      }else {
        newUtils.ScrollMove()
      }
    }
  }
}
</script>

<style lang="less" scoped>
* {
  box-sizing: border-box;
}
.mask {
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.7);
  z-index: 11;
}
.shine {
  position: fixed;
  z-index: 11;
  width: 130%;
  top: -100px;
  left: 50%;
  margin-left: -65%;
  animation: rotate 2s linear infinite;
}
.content-box {
  position: fixed;
  z-index: 12;
  width: 70%;
  left: 50%;
  margin-left: -35%;
  top: 150px;
  text-align: center;
  .content-title {
    line-height: 50px;
    font-size: 30px;
    i {
      color: #ffcf52;
    }
  }
  .bg {
    width: 100%;
    display: block;
  }
  .content {
    position: absolute;
    width: 100%;
    top: 0;
    padding: 40px 2%;
    padding-bottom: 8%;
    height: 100%;
    .title {
      height: 48px;
      display: block;
      margin: 0 auto;
    }
    .icon {
      width: 160px;
      height: 160px;
      margin: 0 auto;
      background: #ffd66d;
      border: 1px solid #fff;
      border-radius: 5px;
      margin-top: 10%;
      display: flex;
      justify-content: center;
      align-items: center;
      img {
        width: 70%;
        display: block;
        margin: 0 auto;
      }
    }
    .img {
      margin: 35px auto 16px;
      width: 148px;
      height: 148px;
      background: #ffd66d;
      border-radius: 12px;
      border: 1px solid #fff;
      .hb-icon {
        width: 109px;
        height: 84px;
        margin: 0 auto;
        display: block;
        margin-top: 10%;
      }
    }
    .awards-img {
      margin: 35px auto 16px;
      width: 148px;
      height: 148px;
    }
    .num {
      font-size: 28px;
      text-align: center;
      margin-top: 3%;
    }
    .tips {
      margin-top: 27px;
      font-size: 24px;
      color: rgba(255, 255, 255, 0.5);
    }
    .btn-check {
      color: #a34c00;
      font-size: 14px;
      background: #ffcf52;
      width: 50%;
      font-weight: bold;
      margin: 0 auto;
      text-align: center;
      margin-top: 10%;
      padding: 3.5% 0;
      border-radius: 6px;
    }
  }
}
.btn-close {
  position: absolute;
  left: 50%;
  bottom: -90px;
  z-index: 2;
  display: flex;
  justify-content: center;
  width: 62px;
  height: 62px;
  transform: translate(-50%, 0);
  color: #fff;
  background: url('~@/assets/images/global-close.png') no-repeat center center;
  background-size: 60px 60px;
}
.content-box_profit {
  position: fixed;
  z-index: 12;
  width: 540px;
  left: 50%;
  top: 40%;
  transform: translate(-50%, -50%);
  .content-title {
    line-height: 50px;
    font-size: 30px;
    i {
      color: #ffcf52;
    }
  }
  .bg {
    width: 100%;
    display: block;
  }
  .dear {
    position: absolute;
    top: 243px;
    left: 95px;
    width: 126px;
    height: 28px;
    line-height: 78px;
    background: url(../img/pop_dear.png);
    background-size: 100% 100%;
  }
  .content {
    position: absolute;
    top: 286px;
    left: 95px;
    right: 50px;
    bottom: 136px;
    p {
      line-height: 26px;
      margin-bottom: 20px;
    }
  }
  .btn-check {
    position: absolute;
    bottom: 58px;
    left: 50%;
    transform: translateX(-50%);
    width: 261px;
    height: 78px;
    line-height: 78px;
    text-align: center;
    background: url(../img/pop_btn.png);
    background-size: 100% 100%;
    font-size: 28px;
    font-weight: bold;
    color: rgba(255, 249, 219, 1);
  }
}
</style>
