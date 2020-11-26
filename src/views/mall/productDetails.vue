<template>
  <!--详情页需要兼容作为子组件和路由的处理-->
  <div class="details-warp">
    <wf-header title="商品详情" :customize="customize" @on-click="requenPage" @on-back="requenPage" />
    <div class="details-content" :class="{'showHeader':$moduleConfig.isShowHeader}">
      <div class="content-wrap">
        <better-scroll>
          <div>
            <!-- 头图 -->
            <div class="title-warp">
              <div class="banner-title">
                <div class="luck-box" v-if="currentItem.phyAwardsType==7"
                  @click="$router.push('/my/schedule')">
                  我的幸运盒子 <span class="iconfont icon-next"></span>
                </div>
                <img :src="bannerImg | filter" alt="">
              </div>
              <div class="title-tet blind-box">
                <div class="price">{{currentItem.purchasePrice*specNumber}}<i class="txt">话费券</i><i
                    v-if="currentItem.marketPrice">京东价:¥{{currentItem.marketPrice*specNumber}}</i>
                </div>
                <div v-if="currentItem.phyAwardsType==7" @click="toBlindBox" class="right"><img
                    src="./images/box.png" /> 20元可抽盲盒，去试试>></div>
              </div>
              <div class="title-tet">
                <div class="item">{{currentItem.name}}</div>
                <span>{{currentItem.allConvertedQuota}}人已获取</span>
              </div>
            </div>
            <!-- 规格 -->
            <div class="spec-warp">
              <div class="spec-item" v-if="currentList.length>1">
                <div class="item-title">规格</div>
                <div class="item-content-spec">
                  <template v-for="(item,index) in currentList">
                    <span v-if="item.specs" :key="index"
                      :class="{'item-active':selectedIndex===index}" @click="changeSpec(index)"
                      class="item-content-child">
                      {{item.specs}}</span>
                  </template>
                </div>
              </div>
              <div class="spec-item">
                <div class="item-title">已选</div>
                <div class="item-content item-content-title">{{currentItem.specs}}</div>
              </div>
              <div class="spec-item-line"></div>
              <div class="spec-item">
                <div class="item-title">数量</div>
                <div class="item-content">
                  <span class="item-number-title" v-if="allUsersTodayAvailableQuota">（剩余库存充足）</span>
                  <span class="item-number-title"
                    v-if="!allUsersTodayAvailableQuota">（剩余库存为0）</span>
                  <div class="item-number-add">
                    <field v-model="specNumber" :limit-number="currentItem.limitPerPersonDay||0"
                      :store-max="currentItem.allUsersTodayAvailableQuota"></field>
                  </div>
                </div>
              </div>
            </div>
            <div class="spec-warp description-info" v-if="currentItem.ensure">
              <i>保障</i> {{currentItem.ensure}}
            </div>
            <!--评价-->
            <div class="spec-warp evaluate-info"
              v-if="currentItem.commentInfo&&currentItem.commentInfo.recommendRemark&&currentItem.commentInfo.commentNum>1">
              <div class="evaluate-item">
                <div class="item"><i>商品评价</i>({{currentItem.commentInfo.commentNum}})</div>
                <div class="item" @click="checkAllEvaluation">查看全部<i class="iconfont icon-next"></i>
                </div>
              </div>
              <div class="evaluate-item">
                <div class="item"><img
                    :src="(currentItem.commentInfo.recommendProfilePhoto||avatar)|filter"
                    alt=""><span>{{currentItem.commentInfo.recommendNickname}}</span></div>
              </div>
              <div class="evaluate-item">
                <div class="item">{{currentItem.commentInfo.recommendRemark}}</div>
              </div>
            </div>
            <!-- 详情 -->
            <div class="spec-warp description-warp">
              <div class="title">商品详情</div>
              <div class="details" id="product_description" v-html="currentItem.description"></div>
            </div>
          </div>
        </better-scroll>
      </div>
    </div>
    <div class="button-warp" @click="vaildExchange">
      <div class="save-button" :class="{'save-button-on':!allUsersTodayAvailableQuota}">
        <span v-if="allUsersTodayAvailableQuota">马上去换</span>
        <span v-if="!allUsersTodayAvailableQuota">已售罄</span>
      </div>
    </div>

    <div class="modal-wrap" @click="validDialogShow=false" v-show="validDialogShow">
      <div class="modal-mask"></div>
      <div class="modal-content">
        <div class="content">
          <div class="title">确认商品信息{{currentItem.phyAwardsType}}</div>
          <div class="info">
            <div>商品名称：{{currentItem.name}}</div>
            <div>所需：{{currentItem.purchasePrice*specNumber}}话费券</div>
          </div>
          <div class="price">
            <div>
              <div class="price_detail">{{hfSum | amountComputen }}{{hfSum > 10000 ? "万" : ""}}话费券
              </div>
              当前话费券余额
            </div>
            <div>
              <div class="price_detail">-{{currentItem.purchasePrice*specNumber}}话费券</div>
              需扣除
            </div>
          </div>
        </div>
        <div class="btn_valid" @click.stop="goExchange">确认换取</div>
      </div>
    </div>

    <!-- 提升弹框 -->
    <dialog-mask v-model="dialogShow" :status-code="statusCode"
      :awards-type="currentItem.phyAwardsType" @on-checkprize="checkprize" />

    <!-- 新版新手任务需求开始 -->
    <!-- 礼包弹窗 -->
    <Modal v-model="showModal" title="温馨提示" :type="1" :save-text="saveText" @on-close="closePop"
      @on-save="buyGift">
      <div style="text-align:center">
        <img src="./images/gift.png" style="width:8.5rem" alt="">
        <p style="color:#888;font-size:0.7rem">该奖品的换取<br>
          前提是：购买过{{currentItem.purchasePrice===30?'周卡':currentItem.purchasePrice+'元'}}礼包</p>
      </div>
    </Modal>
    <!-- 一元破冰 -->
    <one-lottery ref="oneLottery" />
    <!-- 充值特惠 -->
    <preference ref="preference" />
    <!-- 周卡礼包 -->
    <week-card ref="weekCard" />
    <!-- 活动话费卷抽奖 挽留弹框  活动下线记得删除  陈辉 -->
    <detainment v-model="showDetainment" @back="requenPage" />
    <!-- 新版新手任务需求结束 -->
    <!--展示该商品的全部评价-->
    <bill-comment v-if="showBillComment" :detailItem="detailItem" @close="showBillComment=false">
    </bill-comment>
    <Modal v-model="showAgreementPop" title="用户协议提示" close-text="暂不同意" save-text="同意" :type="2"
           @on-save="closeAgreementModal(1)" @on-close="closeAgreementModal(0)">
      <div class="modal-center agreement">
        欢迎使用多多玩，为了更好地保护您的隐私和个人信息，多多玩根据国家相关法律拟定了<i @click="goUserAgreement">《多多玩用户协议》</i>，请您在继续使用多多玩服务之前，仔细阅读并同意。
      </div>
    </Modal>
  </div>
</template>
<script>
import field from './components/field/field'
import { placeOrder, getGoodsDetail, getdetainment } from '@/services/shop'
import dialogMask from './components/dialog/dialog'
import {mapState,mapActions } from 'vuex'
import OneLottery from '@/components/popup/oneLottery'
import Preference from '@/components/popup/preference'
import weekCard from '@/components/popup/weekCard'
import BetterScroll from '@/components/betterScroll/betterScroll'
import Detainment from './components/detainment/detainment'
import billComment from './components/billcomment'
import _get from 'lodash.get'
export default {
  name: 'shopDetails',
  components: { field, dialogMask, OneLottery, Preference, weekCard, BetterScroll, Detainment, billComment },
  props: {
    account: {
      type: Number,
      default: 0
    },
    detailItem: {
      type: Object,
      default: null
    }
  },
  data () {
    return {
      showCaijinSuccess: false,
      selectedIndex: 0,
      specNumber: 1,
      validDialogShow: false,
      requestType: false,
      dialogShow: false,
      statusCode: '',
      TIME: null,
      accountBalance: 0,
      currentList: [],
      showModal: false,
      showDetainment: false,
      showBillComment: false,
      showAgreementPop:false,
    }
  },
  created () {
    this._getGoodsDetail()
  },
  filters: {
    amountComputen (val) {
      if (!val) {
        return 0
      }
      return val > 10000 ? (val / 10000).toFixed(2) : val
    }
  },
  computed: {
    ...mapState(['userInfo','agreementPopType']),
    bannerImg () {
      return this.currentList.length ? this.currentList[0].detailPicture : ''
    },
    hfSum () {
      return this.userInfo.hfSum ? (this.userInfo.hfSum / 10).toFixed(1) : 0
    },
    currentItem () {
      return this.currentList.length ? this.currentList[this.selectedIndex] : {}
    },
    saveText () {
      return `购买${this.currentItem.purchasePrice === 30 ? '周卡' : this.currentItem.purchasePrice + '元'}礼包`
    },
    allUsersTodayAvailableQuota () {
      // 当前用户今日限量
      if (this.currentItem.currentUserTodayAvailableQuota === 0) {
        return false
      }
      // 所有用户今日限量
      if (this.currentItem.allUsersTodayAvailableQuota === 0) {
        return false
      }
      // 当前用户今日不限量
      if (this.currentItem.currentUserTodayAvailableQuota === null || this.currentItem.currentUserTodayAvailableQuota !== 0) {
        return true
      }
      // 所有用户今日不限量
      if (this.currentItem.allUsersTodayAvailableQuota === null || this.currentItem.allUsersTodayAvailableQuota !== 0) {
        return true
      }
      return true
    },
    customize () {
      return !!this.detailItem
    },
    avatar () {
      return '/group1/M00/43/24/CmcEHV56zD2ALRGgAAAhuTmu1OY154.png'
    }
  },
  mounted () {
    if(this.agreementPopType==0){
      this.judgeAddAgreement()
    }
    this.accountBalance = this.detailItem ? this.account : parseFloat(this.$route.query['accountBalance'])
    this.setDetailsImgWidth()
  },
  watch: {
    selectedIndex (to, form) {
      if (to !== form) {
        this.TIME = setTimeout(() => {
          this.setDetailsImgWidth()
        }, 0)
      }
    }
  },
  beforeDestroy () {
    if (this.TIME) {
      clearTimeout(this.TIME)
    }
  },
  methods: {
    ...mapActions({
      getUserInfo: 'GET_USERINFO', // 获取用户信息
      getMyprizeRedDot: 'GET_MYPRIZE_REDDOT', // 获取用户信息
      judgeAddAgreement:'JUDGE_ADD_AGREEMENT',
      closeAgreementPop:'CLOSE_AGREEMENT_POP'
    }),
    toBlindBox () {
      this.$marchSetsPoint('A_H5PT0225003042')
      location.href = 'https://wap.beeplaying.com/activities/blindBox.html#/'
    },
    // 获取商品详情
    async _getGoodsDetail () {
      // 一元话费 二元话费 30元话费 兑换 分离
      let specialArr = [232, 539, 41]
      let { phyAwardsType, name, phyAwardsId } = (this.detailItem || this.$route.query)
      let params = {
        phyAwardsType, name
      }
      if (parseInt(phyAwardsType) !== 9) {
        delete params.name
      }
      const { data, code, message } = await getGoodsDetail(params)
      if (data && data.length) {
        this.currentList = data.filter(item => {
          if (specialArr.includes(phyAwardsId)) {
            return item.phyAwardsId === phyAwardsId
          } else {
            return !specialArr.includes(item.phyAwardsId)
          }
        })
      }
    },
    // 切换规格
    changeSpec (index) {
      this.selectedIndex = index
      this.specNumber = 1
      this.$marchSetsPoint('A_H5PT0035001265', {
        task_id: this.currentList[index].id,
        residual_phone: this.accountBalance,
      })
    },
    vaildExchange () {
      if(this.agreementPopType==1){//需要弹窗
        this.showAgreementPop=true
        this.$marchSetsPoint('P_H5PT0331',{
          source_addres:'prize'
        })
        return
      }
      if (this.allUsersTodayAvailableQuota) this.validDialogShow = true
    },
    // 兑换话费
    async goExchange () {
      const { id, name } = this.currentItem
      this.$marchSetsPoint('A_H5PT0035001266', {
        awards_name: name,
        residual_phone: this.accountBalance,
      })
      // 库存不足
      if (!this.allUsersTodayAvailableQuota) { return }
      const { data, code, message } = await placeOrder(id, this.specNumber)
      if (code === 200) {
        // 成功后执行 减去库存
        this.updateCurrentList(id, this.specNumber)
        // 更新我的奖品提示红点
        this.getMyprizeRedDot()
      }
      this.validDialogShow = false
      if (code === 102 || code === 104 || code === 200) {
        this.dialogShow = true
        this.getUserInfo()
      } else if (code === 106) {
        this.$marchSetsPoint('A_H5PT0035002651', {
          product_id: id,
          product_name: name,
        })
        this.showModal = true
      } else {
        this.$Toast(message)
      }
      this.statusCode = code
    },
    closePop () {
      this.$marchSetsPoint('A_H5PT0035002652', {
        product_id: this.currentItem.id,
        product_name: this.currentItem.name,
      }) // H5平台-1元2元话费换取引导-未达购买条件弹窗-关闭点击
    },
    buyGift () {
      this.showModal = false
      if (this.currentItem.purchasePrice === 1) {
        this.$refs.oneLottery.init()
      } else if (this.currentItem.purchasePrice === 2) {
        this.$refs.preference.init()
      } else if (this.currentItem.purchasePrice === 30) {
        this.$refs.weekCard.openPop()
      }
      this.$marchSetsPoint('A_H5PT0035002653', {
        product_id: this.currentItem.id,
        product_name: this.currentItem.name,
      }) // H5平台-1元2元话费换取引导-未达购买条件弹窗-购买点击
    },
    // 去领奖
    checkprize () {
      const item = this.currentItem
      if (item.phyAwardsType == 7) {
        this.$router.push({ name: 'mySchedule' })
      } else if (item.phyAwardsType == 48) {
        location.href = 'https://wap.beeplaying.com/activities/blindBox.html'
      }
      else {
        this.$router.push({ name: 'myPrize' })
      }
    },
    setDetailsImgWidth () {
      const product_description = document.getElementById('product_description')
      const imgList = product_description.getElementsByTagName('img')
      for (let i = 0; i < imgList.length; i++) {
        imgList[i].style.width = '100%'
        imgList[i].style.height = 'auto'
      }
    },
    // 领取后更新数据
    updateCurrentList (id, specNumber) {
      this.currentList.forEach(item => {
        if (item['id'] === id) {
          // 如果不为null的时候每次领取都减去总库存和个人领奖次数
          if (item['allUsersTodayAvailableQuota'] !== null) {
            this.$set(item, 'allUsersTodayAvailableQuota', (parseInt(item['allUsersTodayAvailableQuota']) - specNumber))
          }
          if (item['currentUserTodayAvailableQuota'] !== null) {
            this.$set(item, 'currentUserTodayAvailableQuota', (parseInt(item['currentUserTodayAvailableQuota']) - specNumber))
          }
          this.$set(item, 'allConvertedQuota', (parseInt(item['allConvertedQuota']) + specNumber))
          this.accountBalance = this.accountBalance - (specNumber * item['purchasePrice'])
        }
      })
    },
    // 返回按钮
    async requenPage () {
      this.$marchSetsPoint('A_H5PT0035000632', {
        residual_phone: this.accountBalance
      })
      try {
        getdetainment().then(res => {
          let { code, data, message } = _get(res, 'data')
          if (code == 200) {
            let popup = _get(res, 'data.data.popup', false)
            if (popup) {
              // 打开挽留弹框
              this.showDetainment = true
              this.$marchSetsPoint('A_H5PT0035003104')
            } else {
              this.showDetainment = false
              if (this.customize) {
                this.$emit('close')
              }
            }
          }
        })
      } catch {
        if (this.customize) {
          this.$emit('close')
        }
      }
    },
    checkAllEvaluation () {
      this.showBillComment = true
    },
    closeAgreementModal(flag){
      if(flag==1){
        this.closeAgreementPop()
        this.showAgreementPop=false
      }
      this.$marchSetsPoint(flag?'A_H5PT0331004181':'A_H5PT0331004182',{
        source_addres:'prize'
      })
    },
    goUserAgreement () {
      this.showAgreementPop=false
      this.$router.push({ name: 'userAgreement' })
    }
  }
}
</script>
<style lang="less" scoped>
.modal-wrap {
  position: fixed;
  height: 100%;
  width: 100%;
  top: 0;
  left: 0;
  z-index: 99;

  .modal-mask {
    position: absolute;
    height: 100%;
    width: 100%;
    top: 0;
    left: 0;
    background-color: rgba(0, 0, 0, 0.6);
    z-index: 1;
    overflow: hidden;
    pointer-events: none;
  }
  .modal-content {
    position: absolute;
    z-index: 2;
    width: 100%;
    left: 0;
    bottom: 0;
    border-radius: 32px 32px 0px 0px;
    background: #fff;

    .content {
      padding: 25px 25px 10px 25px;

      .title {
        font-size: 28px;
        color: #000;
        text-align: center;
        font-weight: 700;
        padding-bottom: 25px;
        border-bottom: 1px solid #eee;
      }
      .info {
        color: #888;
        font-size: 24px;
        padding: 20px 0;
        border-bottom: 1px solid #eee;
      }
      .price {
        .price_detail {
          float: right;
          color: #ff4141;
        }
        color: #888;
        font-size: 24px;
        padding: 20px 0;
      }
    }

    .btn_valid {
      height: 90px;
      line-height: 90px;
      text-align: center;
      color: #fff;
      font-weight: 500;
      font-size: 24px;
      background: #ff4141;
    }
  }
}

.details-warp {
  width: 100%;
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  background-color: #f7f7f7;
  z-index: 16;
  .details-content {
    position: absolute;
    left: 24px;
    right: 24px;
    top: 20px;
    bottom: 100px;
    margin: auto;
    &.showHeader {
      top: 100px;
    }
    .content-wrap {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      margin: auto;
      &.hasnotice {
        top: 70px;
      }
    }
  }
}
.title-warp {
  overflow: hidden;
  border-radius: 16px;
}
.banner-title {
  position: relative;
  height: 276px;
  .luck-box {
    position: absolute;
    right: 0;
    top: 20px;
    width: 200px;
    height: 40px;
    background: #fff;
    font-size: 24px;
    line-height: 40px;
    text-indent: 20px;
    border-radius: 20px 0px 0px 20px;
  }

  img {
    overflow: hidden;
    width: 100%;
    height: 100%;
  }
}
.title-tet {
  height: 60px;
  line-height: 60px;
  display: flex;
  padding: 0 20px;
  box-sizing: border-box;
  background-color: #ffffff;
  &.blind-box {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    .right {
      color: #d0ab40;
      font-size: 22px;
    }
    img {
      width: 24px;
    }
  }
  .item {
    flex: 1;
  }
  div {
    font-size: 32px;
    font-weight: bold;
    color: #000;
  }
  span {
    text-align: right;
    color: #888888;
    font-size: 24px;
  }
  .price {
    font-size: 42px;
    font-weight: 800;
    line-height: 63px;
    color: rgba(255, 65, 65, 1);
    i {
      font-size: 20px;
      font-weight: 500;
      line-height: 30px;
      color: rgba(187, 187, 187, 1);
      &.txt {
        color: rgba(255, 65, 65, 1);
        margin: 0 10px 0 3px;
      }
    }
  }
}
.spec-warp {
  overflow: hidden;
  margin-top: 20px;
  width: 100%;
  padding: 30px 20px 0 20px;
  border-radius: 16px;
  background-color: #ffffff;
  box-sizing: border-box;
  .spec-item {
    display: flex;
    align-items: center;
    margin-bottom: 25px;
    .item-title {
      width: 70px;
      color: #888;
      font-size: 24px;
    }
    .item-content-spec {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      height: 42px;
      .item-content-child {
        padding: 0 20px;
        margin-right: 30px;
        min-width: 120px;
        height: 42px;
        line-height: 42px;
        background-color: #ededed;
        border-radius: 10px;
        font-size: 24px;
        color: #888888;
        text-align: center;
        box-sizing: border-box;
      }
      .item-active {
        background-color: #ff4141;
        color: #fff;
      }
    }
    .item-content {
      flex: 1;
      display: flex;
      .item-number-title {
        color: #acacac;
        font-size: 24px;
        flex: 1;
        line-height: 42px;
      }
      .item-number-add {
        display: flex;
        align-items: center;
      }
    }
    .item-content-title {
      font-size: 24px;
      color: #ff4141;
    }
  }
  .spec-item-line {
    border-bottom: 2px solid #e6e6e6;
    margin-bottom: 20px;
  }
  &.description-info {
    padding: 30px 20px;
    font-size: 24px;
    font-weight: 400;
    color: rgba(0, 0, 0, 1);
    i {
      color: rgba(136, 136, 136, 1);
      margin-right: 23px;
    }
  }
  &.evaluate-info {
    padding: 24px 20px;
    .evaluate-item {
      display: flex;
      justify-content: space-between;
      font-size: 24px;
      font-weight: 400;
      line-height: 36px;
      color: rgba(0, 0, 0, 1);
      &:nth-child(1) {
        font-size: 24px;
        font-weight: 400;
        line-height: 36px;
        color: rgba(255, 120, 0, 1);
        .icon-next {
          margin-left: 0.06rem;
        }
        .item {
          display: flex;
          &:nth-child(1) {
            font-size: 20px;
            font-weight: 500;
            line-height: 30px;
            color: rgba(0, 0, 0, 1);
            align-items: flex-end;
            i {
              font-size: 28px;
              font-weight: bold;
              line-height: 42px;
            }
          }
          &:nth-child(2) {
            align-items: center;
          }
        }
      }
      &:nth-child(2) {
        display: flex;
        align-items: center;
        margin: 20px 0 10px;
        img {
          width: 30px;
          height: 30px;
        }
        font-size: 24px;
        font-weight: 400;
        line-height: 36px;
        color: rgba(187, 187, 187, 1);
      }
    }
  }
}
.description-warp {
  color: #888888;
  padding: 26px 20px;
  .title {
    margin-bottom: 5px;
    font-size: 28px;
    font-weight: bold;
    color: #000;
  }
  .details {
    font-size: 24px;
    width: 100%;
    line-height: 38px;
    overflow: hidden;
  }
}
.button-warp {
  width: 100%;
  .save-button {
    height: 90px;
    width: 100%;
    background-color: #ff4141;
    position: fixed;
    bottom: 0;
    left: 0;
    line-height: 90px;
    text-align: center;
    font-size: 28px;
    color: #fff;
  }
  .save-button-on {
    background-color: #808080;
  }
}
.modal-center {
  text-align: center;
  font-size: 24px;
  color: #888;
  &.agreement{
    text-align: left;
    line-height: 36px;
    i{
      color: #5186CA;
    }
  }
}
</style>
