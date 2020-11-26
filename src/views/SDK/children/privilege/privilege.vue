<template>
  <article class="sdk-privilege-wrapper">
    <div ref="sdkPrivilege" class="sdk-privilege-container">
      <section class="sdk-privilege">
        <section class="cat-detail-wrapper" :class="{'have-cat':userInfo.catOwnCat}">
          <div class="cat-head-img"></div>
          <section class="cat-detail">
            <div style="width:100%">
              <p>猫等级：{{userInfo.catOwnCat?`Lv${userInfo.catVipLev}`:'暂未开启'}}</p>
              <div class="percent-wrapper" v-if="userInfo.catOwnCat">
                <div class="percent" :style="{width:percentNumber+'%'}"></div>
                <p class="percent-text">升级进度 {{percentNumber}}%</p>
              </div>
              <p class="to-cat" @click.stop="goToCat(1)" v-else>
                领猫升等级即可领特权
              </p>
            </div>
          </section>
        </section>
        <section class="title">
          本游戏内可用特权
        </section>
        <ul class="privilege-list">
          <li class="item" v-for="(item,index) in privilegelist" :key="index">
            <div class="icon-bg">
              <div class="img-wrapper">
                <img :src="item.imgUrl|filter" alt="">
              </div>
              <div class="img-wrapper black-bg" v-if="!item.ownPrivilegeStatus">
                <img src="../../img/locked.png" alt="">
              </div>
              <div class="img-wrapper black-bg"
                v-if="catPrivilege.frozenStatus&&item.ownPrivilegeStatus">
                <img src="../../img/frozen.png" alt="">
              </div>
              <div class="tag blue" v-if="!item.ownPrivilegeStatus&&item.privilegeLevel">
                Lv.{{item.privilegeLevel}}可获得
              </div>
              <div class="tag orange" v-else-if="item.ownPrivilegeStatus&&item.nextPrivilegeLevel">
                Lv.{{item.privilegeLevel}}可升级
              </div>
            </div>
            <div class="other">
              <p class="name">
                {{item.privilegeName&&item.privilegeName.includes('充值返利')?item.privilegeName.replace('充值返利','网游大作充值返利'):item.privilegeName}}
              </p>
              <p class="desc" v-if="item.tips">{{item.tips.simpleDesc}}</p>
            </div>
            <div class="btn" :class="item.ownPrivilegeStatus?'orange':'blue'"
              @click.stop="handleClick(item.ownPrivilegeStatus,index)">
              {{item.ownPrivilegeStatus?index===2?'查看详情':'立即使用':'暂未获得'}}
            </div>
          </li>
        </ul>
        <section class="more">
          <div class="img-wrapper">
            <img :src="'/group1/M00/3E/76/CmcEHF1ySECAEbz7AABQZG_5xV4461.png'|filter" alt="">
            <img :src="'/group1/M00/3E/76/CmcEHF1ySO6AA3ssAABI4dp6f1g144.png'|filter" alt="">
            <img :src="'/group1/M00/3E/76/CmcEHF1ySSOAMQ7eAABhJPnlkvs054.png'|filter" alt="">
          </div>
          <p class="to-cat" @click.stop="goToCat(2)">查看更多特权</p>
        </section>
      </section>
    </div>
    <cat-save-box ref="catSaveBox" />
    <cat-supply-box ref="catSupplyBox" />
    <cat-normal-info ref="catNormalInfo" :info="currentInfo"
      :frozen-status="catPrivilege.frozenStatus" />
  </article>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { jumpUrl, getUrlParams } from '@/utils/utils'
import { getCatDetail } from '@/services/user'
import catSaveBox from '../../components/cat/catSaveBox'
import catSupplyBox from '../../components/cat/catSupplyBox'
import catNormalInfo from '../../components/cat/catNormalInfo'
import BScroll from 'better-scroll'
export default {
  name: 'sdkPrivilege',
  components: {
    catSaveBox,
    catSupplyBox,
    catNormalInfo
  },
  data () {
    return {
      detailData: {},
      privilegeNameArr: ['保险箱', '补给箱'],
      haveAccelerate: ['2', '12', '20', '21'], // 桌球、糖果、钓鱼、弹珠
      currentInfo: {}
    }
  },
  computed: {
    ...mapState(['userInfo', 'catPrivilege']),
    percentNumber () {
      if (this.detailData.experience) {
        let number = ((this.detailData.experience - this.detailData.levelExperience) / (this.detailData.nextLevelExperience - this.detailData.levelExperience) * 100).toFixed(2)
        let numberArr = number.split('.')
        if (Number(numberArr[1]) === 0) {
          return numberArr[0]
        } else if (numberArr[1].split('')[1] === '0') {
          numberArr[1] = numberArr[1].split('')[0]
        }
        return numberArr.join('.')
      }
      return 0
    },
    privilegelist () {
      let arr = []
      for (let index = 0; index < this.privilegeNameArr.length; index++) {
        const item = this.privilegeNameArr[index]
        for (let haveIndex = 0; haveIndex < this.catPrivilege.privilegeDetails.length; haveIndex++) {
          const haveItem = this.catPrivilege.privilegeDetails[haveIndex]
          if (haveItem.privilegeInfo.privilegeName.includes(item)) {
            let haveInfo = JSON.parse(JSON.stringify(haveItem.privilegeInfo))
            haveInfo['ownPrivilegeStatus'] = 1
            haveInfo['nextPrivilegeLevel'] = haveItem.nextPrivilegeInfo && haveItem.nextPrivilegeInfo.privilegeLevel || 0
            haveInfo.tips = haveInfo.tips && JSON.parse(haveInfo.tips) || ''
            arr.push(haveInfo)
          }
        }
        for (let notHaveIndex = 0; notHaveIndex < this.catPrivilege.privileges.length; notHaveIndex++) {
          const notHaveItem = this.catPrivilege.privileges[notHaveIndex]
          if (notHaveItem.privilegeName.includes(item)) {
            let notHaveInfo = JSON.parse(JSON.stringify(notHaveItem))
            notHaveInfo['ownPrivilegeStatus'] = 0
            notHaveInfo.tips = notHaveInfo.tips && JSON.parse(notHaveInfo.tips) || ''
            arr.push(notHaveInfo)
          }
        }
      }
      return arr
    },
    gameType () {
      return getUrlParams('gametype') && parseInt(getUrlParams('gametype')) || getUrlParams('gameType') && parseInt(getUrlParams('gameType'))
    },
    wfCurLink () {
      return getUrlParams('wf_cur_link') || ''
    }
  },
  beforeRouteEnter (to, from, next) {
    if (
      document.activeElement.tagName == 'INPUT' ||
      document.activeElement.tagName == 'TEXTAREA'
    ) {
      document.activeElement.scrollIntoViewIfNeeded()
    }
    next()
  },
  created () {
    if (this.gameType && this.haveAccelerate.includes(this.gameType.toString())) {
      this.privilegeNameArr.push('动画加速')
    } else if (this.gameType && this.wfCurLink) {
      this.privilegeNameArr.push('充值返利')
    }
    this._getCatDetail()
  },
  mounted () {
    new BScroll(this.$refs.sdkPrivilege, { scrollY: true, click: true })
  },
  methods: {
    goToCat (type) {
      switch (type) {
        case 1:
          this.$marchSetsPoint('A_H5PT0061002868', { from_project_id: this.gameType }) // H5平台-游戏内SDK(无猫状态)-去开启猫等级点击
          break
        case 2:
          this.$marchSetsPoint('A_H5PT0061002866', { from_project_id: this.gameType }) // H5平台-游戏内SDK-特权页TAB-查看更多特权点击
          break

        default:
          break
      }
      jumpUrl({ url: '/petcat/' }, 'SDK', '&catright=1')
    },
    async _getCatDetail () {
      let { code, data } = await getCatDetail()
      if (code == 200) {
        this.detailData = data
      }
    },
    handleClick (status, index) {
      if (status) {
        this.$marchSetsPoint('A_H5PT0061002865', { awards_id: index, from_project_id: this.gameType }) // H5平台-游戏内SDK-特权页TAB-特权立即使用点击
        switch (index) {
          case 0:
            this.$refs.catSaveBox.handleCatSaveBox()
            break
          case 1:
            this.$refs.catSupplyBox.handleCatSupplyBox()
            break
          case 2:
            if (this.wfCurLink) {
              this.currentInfo = {
                title: '网游大作充值返利',
                desc: '每周根据累计充值，定比例返利',
                img: require('../../img/rebate-icon.png')
              }
            } else {
              this.currentInfo = {
                title: '动画加速',
                desc: '点击SDK旁加速按钮，即可调整动画速度',
                img: require('../../img/speed-up-icon.png')
              }
            }
            this.$refs.catNormalInfo.handleClick()
            break

          default:
            break
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>
.bg-center(@url) {
  background-position: center center;
  background-repeat: no-repeat;
  background-size: 100% 100%;
  background-image: url(@url);
}
.sdk-privilege-container {
  position: absolute;
  top: 225px;
  bottom: 12px;
  left: 14px;
  right: 15px;
  background: #fff5e7;
  box-shadow: 0px 2px 15px 0px #a15a21;
  border-radius: 30px 30px 30px 60px;
  box-sizing: border-box;
  overflow: hidden;
  .sdk-privilege {
    padding: 30px 22px 30px 12px;
  }
  .cat-detail-wrapper {
    display: flex;
    align-items: center;
    margin-bottom: 45px;
    .cat-head-img {
      position: relative;
      z-index: 1;
      width: 100px;
      height: 100px;
      .bg-center('../../img/no-cat-head.png');
    }
    .cat-detail {
      height: 100px;
      flex: 1;
      margin-left: -50px;
      background: #ede4d7;
      border-radius: 0 20px 20px 0;
      padding: 0 24px 0 66px;
      font-size: 26px;
      line-height: 30px;
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      font-weight: bold;
      line-height: 30px;
    }
    &.have-cat {
      .cat-head-img {
        .bg-center('../../img/cat-head.png');
      }
      .cat-detail {
        background: #ffe5bd;
        .percent-wrapper {
          margin-top: 6px;
          background: #cdb68e;
          border-radius: 8px;
          font-size: 16px;
          color: #fff;
          height: 24px;
          padding: 2px;
          position: relative;
          .percent {
            border-radius: 8px;
            background-color: #fe7506;
            height: 100%;
          }
          .percent-text {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
          }
        }
      }
    }
  }
  .to-cat {
    font-size: 20px;
    color: #fe7b12;
    text-decoration: underline;
    margin-top: 6px;
    &::after {
      content: '';
      display: inline-block;
      margin-left: 5px;
      font-size: 0;
      width: 8px;
      height: 15px;
      .bg-center('../../img/right-arrow.png');
    }
  }
  .title {
    text-align: center;
    font-size: 26px;
    font-weight: bold;
    color: #9f752a;
    display: flex;
    align-items: center;
    justify-content: center;
    &::before,
    &::after {
      content: '';
      display: block;
      width: 32px;
      height: 36px;
    }
    &::before {
      .bg-center('../../img/left-handle.png');
      margin-right: 10px;
    }
    &::after {
      .bg-center('../../img/right-handle.png');
      margin-left: 10px;
    }
  }
  .privilege-list {
    .item {
      min-height: 130px;
      box-sizing: border-box;
      border-bottom: 3px dashed #e6ad5d;
      display: flex;
      align-items: center;
      padding: 12px 0;
      .icon-bg {
        width: 112px;
        height: 114px;
        position: relative;
        .bg-center('../../img/privilege-icon-bg.png');
        padding: 20px;
        box-sizing: border-box;
        .img-wrapper {
          width: 72px;
          height: 72px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          overflow: hidden;
          background-color: #d37200;
          img {
            width: 100%;
          }
          &.black-bg {
            width: 72px;
            height: 72px;
            background-color: rgba(0, 0, 0, 0.56);
            position: absolute;
            top: 20px;
            left: 50%;
            margin-left: -36px;
          }
        }
        .tag {
          position: absolute;
          font-size: 16px;
          color: #fff;
          width: 102px;
          height: 24px;
          line-height: 24px;
          border-radius: 8px;
          text-align: center;
          left: 50%;
          transform: translateX(-50%);
          bottom: 3px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          &.orange {
            background: #ffa200;
            border: 2px solid #ffd557;
          }
          &.blue {
            background: #007de6;
            border: 2px solid #7fc5ff;
          }
        }
      }
      .other {
        flex: 1;
        p {
          width: 260px;
          // overflow: hidden;
          // white-space: nowrap;
          // text-overflow: ellipsis;
        }
        .name {
          font-size: 22px;
          font-weight: bold;
          color: #000;
        }
        .desc {
          font-size: 18px;
          font-weight: bold;
          color: #bc9c64;
        }
      }
      .btn {
        width: 130px;
        height: 60px;
        margin-left: 17px;
        color: #fff;
        font-size: 20px;
        font-weight: bold;
        text-align: center;
        line-height: 60px;
        &.orange {
          .bg-center('../../img/orange-btn-bg.png');
        }
        &.blue {
          .bg-center('../../img/blue-btn-bg.png');
        }
      }
    }
  }
  .more {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    margin-top: 20px;
    .img-wrapper {
      display: flex;
      align-items: center;
      direction: rtl;
      margin-right: 10px;
      img {
        width: 36px;
        height: 36px;
        border: 2px #fff solid;
        border-radius: 50%;
        box-shadow: 0px 2px 10px 0px rgba(161, 90, 33, 0.56);
        margin-left: -10px;
      }
    }

    .to-cat {
      margin-top: 0;
    }
  }
}
</style>
