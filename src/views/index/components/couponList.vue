<template>
  <div class="wrap">
    <div
      class="awards-dialog"
      v-if="showCouponList"
    >
      <div class="mask"></div>
      <div class="dialog-content">
        <div class="title">
          <img
            src="@/assets/images/awards-dialog-title.png"
            alt=""
          />
        </div>
        <div class="wrapper">
          <!-- 关闭按钮 -->
          <div
            class="closed iconfont icon-close"
            @click="hideDialog"
          ></div>
          
          <div class="tips">恭喜您获得优惠券礼包</div>
          <div class="tips1">以下优惠券可任意选择一种</div>
          <!--奖品-->
          <div
            class="awards"
          >
            <div class="item" v-for="(item, index) in list" :key="index" @click="_getCoupon(item)">
              <div class="award-img">
                <img src="../img/couponList.png" alt="">
              </div>
              <div class="award-name">
                {{item.name}}
              </div>
              <div class="btn">选我</div>
            </div>
          </div>
        </div>
      </div>

    </div>
    <awards-dialog
      v-model="showAwards"
      :tipsTxt="'恭喜你获得'"
      :awards="AwardsData.awards"
      :explainText="AwardsData.explainText"
      :confirmBtnText="AwardsData.confirmBtnText"
      @callback="awardsCallback"
      @closedCallback="closedDialog"
    />
  </div>
</template>

<script>
import Services from '@/services/index'
import { jumpUrl, newUtils, bottomBarJump } from '@/utils/utils'
import _get from 'lodash.get'
export default {
  name: 'couponList',
  data: () => ({
    showAwards: false,
    showCouponList: false,
    AwardsData: {
      awards: {
        awardsImage: '',
        awardsName: ''
      },
      confirmBtnText: '立即使用',
      recommend: {
        cdnImage: '',
        url: ''
      },
      explainText: {
        text: '可到“我的-优惠券”页面中查看',
        color: '#ACACAC'
      }
    },
    list: []
  }),
  methods: {
    /** 获取优惠券列表 **/
    _getCouponList(callback) {
      Services.getCouponList().then(res=> {
        let {code, data, message} = _get(res, 'data')
        if(code == 200) {
          this.list = _get(res, 'data.data', [])
          if(this.list.length == 1) {
            this._getCoupon(this.list[0])
          }
          else if(this.list.length > 1) {
            this.showCouponList = true
          }
        }
        callback({
          name:'couponList',
          isShow:this.list.length > 1
        })
      })
    },
    /** 获取优惠卷详情 **/
    _getCoupon(item) {
      if(!item.id) return false
      if(this.lock) return false
      this.lock = true
      Services.getCoupon(item.id).then(res=> {
        this.AwardsData.awards.awardsImage = _get(res, 'data.data.image', '')
        this.AwardsData.awards.awardsName = _get(res, 'data.data.instructions', '')
        if(this.AwardsData.awards.awardsImage && this.AwardsData.awards.awardsName) {
          this.showAwards = true
          this.showCouponList = false
          this.$marchSetsPoint('A_H5PT0019001733')
        }
        this.lock = false
      })
    },
    /** 单张优惠券领取 **/
    awardsCallback() {
      this.showAwards = false
      bottomBarJump('#/payment','payment',this.$router)
    },
    /** 单张优惠券关闭 **/
    closedDialog() {
      this.$marchSetsPoint('A_H5PT0019001735')
    },
    /** 关闭列表弹出框 **/
    hideDialog() {
      this.$parent.initDialog();
      this.showCouponList = false
    },
    init(callback){
      this._getCouponList(callback)
    }
  },
  mounted() {
    
  },
  watch: {
    showCouponList(value) {
      if(value) {
        newUtils.ScrollNoMove()
      }else {
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
      padding: 78px 0 0;
      width: 100%;
      background: #fff;
      overflow: visible;
      border-radius: 32px;
      .closed {
        position: absolute;
        right: 30px;
        top: 30px;
        color: #666666;
        font-size: 26px;
      }
      .tips {
        margin-top: 15px;
        font-size: 28px;
        font-weight: bold;
        color: #000;
        text-align: center;
      }
      .tips1 {
        margin-bottom: 30px;
        font-size: 20px;
        color: #BBBBBB;
        text-align: center;
      }
      .awards {
        padding: 0 0 0 30px;
        overflow: hidden;
        .item {
          float: left;
          margin: 0 24px 30px 0;
          width: 120px;
        }
        .award-img {
          margin: 0 auto;
          width: 120px;
          height: 120px;
          text-align: center;
          img {
            vertical-align: top;
            width: 100%;
            height: 100%;
          }
        }
        .award-name {
          white-space: nowrap;
          color: #333333;
          font-size: 20px;
          text-align: center;
        }
        .btn {
          margin: 0 auto;
          width: 90px;
          height: 42px;
          line-height: 42px;
          font-size: 20px;
          color: #fff;
          background: #FF4141;
          text-align: center;
          border-radius:10px;
        }
      }
      .explain {
        margin-top: 6px;
        font-size: 20px;
        color: #BBBBBB;
        text-align: center;
      }
      .confirm-btn {
        margin: 28px auto 0;
        width: 250px;
        height: 70px;
        line-height: 70px;
        text-align: center;
        font-size: 24px;
        color: #fff;
        border-radius: 16px;
        overflow: hidden;
        background: #FF4141;
      }
      .bottom-link{
        margin: 20px auto 0;
        color: #5186CA;
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
