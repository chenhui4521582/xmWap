<template>
  <article class="sdk-title">
    <section class="left">
      <div class="content">
        <div class="normal leaf-wrapper">
          <div class="icon"></div>
          <div class="text-container">{{userInfo.amount | conversion}}</div>
          <div class="plus-icon" @click.stop="handleMall"></div>
        </div>
        <div class="normal coin-wrapper">
          <div class="icon"></div>
          <div class="text-container" @click.stop="handlePrize">
            {{(userInfo.hfSum / 10) | conversion}}
            <em>满50可领取</em>
          </div>
        </div>
      </div>
      <div class="content">
        <div class="normal fish-wrapper">
          <div class="icon"></div>
          <div class="text-container">{{userInfo.catDriedFish | conversion}}</div>
          <div class="problem-icon" v-if="!userInfo.catOwnCat" @click.stop="showCatPop(1)">?</div>
          <div class="to-cat" v-else @click.stop="goToCat">去喂猫</div>
        </div>
        <div class="normal buff-wrapper">
          <div class="icon"></div>
          <div class="text-container">
            鱼干加成 <em @click.stop="showCatPop(2)">+{{additionValue}}%</em>
          </div>
        </div>
        <div class="cat-pop-wrapper" :class="{'type-1':catPopType===1}" v-if="catPopType">
          <div class="cat-pop">
            <div class="cat-pop-close" @click.stop="closeCatPop()">
            </div>
            <template v-if="catPopType===1">
              <div class="title">鱼干说明：</div>
              <div class="detail">
                <p>鱼干是招财猫道具，喂养鱼干可提升招财猫等级，开启特权。</p>
                <p>游戏中每消耗1000金叶子，可自动获得1g鱼干。</p>
              </div>
            </template>
            <template v-else>
              <div class="title">鱼干加成详情：</div>
              <div class="detail">
                <p v-for="(item,index) in catPrivilege.additions" :key="index">
                  {{item.additionSourceType|sourceTypeFilter}}:
                  <span>+{{item.additionValue}}%</span></p>
              </div>
            </template>
          </div>
        </div>
      </div>
    </section>
    <section class="right" @click.stop="handleKefu">
      <div class="service-icon"></div>
      <p>客服</p>
    </section>
    <sdk-popup v-model="showPopup" :to-text="toText" title="温馨提示" @on-confirm="toOtherPage()">
    </sdk-popup>
  </article>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import Services from '@/services/SDK'
import _get from 'lodash.get'
import { jumpUrl, getUrlParams } from '@/utils/utils'
export default {
  name: 'sdkTitle',
  components: {

  },
  data () {
    return {
      showPopup: false,
      url: '',
      toText: '',
      catPopType: 0 // 0 不显示 1 鱼干介绍 2 加成详情
    }
  },
  computed: {
    ...mapState(['userInfo', 'catPrivilege']),
    additionValue () {
      if (this.catPrivilege.additions.length > 0) {
        return this.catPrivilege.additions.reduce((accumulator, currentValue) => {
          return accumulator + currentValue.additionValue
        }, 0)
      }
      return 0
    },
    gameType () {
      return getUrlParams('gametype') && parseInt(getUrlParams('gametype')) || getUrlParams('gameType') && parseInt(getUrlParams('gameType'))
    }
  },
  filters: {
    sourceTypeFilter (value) {
      switch (value) {
        case 1:
          return '猫道具加成'
        case 2:
          return '特权“鱼干加成”'
        case 3:
          return '好感度加成'
        default:
          return ''
      }
    },
    conversion (value) {
      if (!value && value != 0) return ''
      let unit = ''
      let number = 0
      if (value >= 100000000) {
        unit = '亿'
        number = Math.floor(value / 1000000) / 100
      } else if (value >= 10000) {
        unit = '万'
        number = Math.floor(value / 100) / 100
      } else {
        number = Math.floor(value * 10) / 10
      }

      let numberArr = number.toString().split('.')
      if (Number(numberArr[1]) === 0) {
        return numberArr[0] + unit
      } else if (numberArr[1] && numberArr[1].split('')[1] === '0') {
        numberArr[1] = numberArr[1].split('')[0]
      }
      return numberArr.join('.') + unit
    },
  },
  mounted () {
    this._getCatPrivilege()
  },
  methods: {
    ...mapActions({ _getCatPrivilege: 'GET_CATPRIVILEGE' }),
    handleMall () {
      this.showPopup = true
      this.url = '/xmWap/#/payment'
      this.toText = '“商城”页面'
      this.$marchSetsPoint('A_H5PT0061002861', { from_project_id: this.gameType }) // H5平台-游戏内SDK-金叶子加号点击
    },
    handlePrize () {
      this.showPopup = true
      this.url = '/xmWap/#/my'
      this.toText = '“我的”页面'
      this.$marchSetsPoint('A_H5PT0061000534')
    },
    handleKefu () {
      this.showPopup = true
      this.url = '/xmWap/#/my/customerService'
      this.toText = '“客服”页面'
      this.$marchSetsPoint('A_H5PT0061000535')
    },
    goToCat () {
      this.showPopup = true
      this.url = '/petcat/'
      this.toText = '“招财猫”'
      this.$marchSetsPoint('A_H5PT0061002862', { from_project_id: this.gameType }) // H5平台-游戏内SDK-鱼干数去喂猫点击
    },
    toOtherPage () {
      jumpUrl({ url: this.url }, 'SDK')
    },
    showCatPop (type) {
      this.catPopType = type
      switch (type) {
        case 1:
          this.$marchSetsPoint('A_H5PT0061002867', { from_project_id: this.gameType }) // H5平台-游戏内SDK(无猫状态)-鱼干数帮助点击
          break
        case 2:
          this.$marchSetsPoint('A_H5PT0061002863', { from_project_id: this.gameType }) // H5平台-游戏内SDK-鱼干加成查看详情点击
          break

        default:
          break
      }
    },
    closeCatPop () {
      this.catPopType = 0
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
.sdk-title {
  display: flex;
  padding: 18px 0;
  align-items: center;
  color: #fff;
  font-size: 20px;
  .left {
    flex: 1;
    padding: 0 20px;
    .content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      .normal {
        display: flex;
        align-items: center;
      }
      .icon {
        width: 40px;
        height: 40px;
        position: relative;
        z-index: 1;
      }
      .text-container {
        height: 30px;
        line-height: 30px;
        border-radius: 10px;
        background-color: #0052ae;
        margin-left: -20px;
        padding: 0 0 0 30px;
      }
      .leaf-wrapper {
        .icon {
          .bg-center('../img/leaf-icon.png');
        }
        .text-container {
          width: 150px;
        }
        .plus-icon {
          width: 30px;
          height: 30px;
          margin-left: -20px;
          .bg-center('../img/plus-icon.png');
        }
      }
      .coin-wrapper {
        .icon {
          .bg-center('../img/coin-icon.png');
        }
        .text-container {
          width: 230px;
          em {
            font-size: 18px;
            color: #62acff;
            float: right;
            margin-right: 6px;
          }
        }
      }
      .fish-wrapper {
        .icon {
          .bg-center('../img/fish-icon.png');
        }
        .text-container {
          width: 124px;
        }
        .problem-icon {
          color: #54fff1;
          border: 2px solid #54fff1;
          border-radius: 50%;
          width: 30px;
          height: 30px;
          text-align: center;
          line-height: 30px;
          font-weight: bold;
          font-size: 20px;
          line-height: 25px;
          margin-left: 8px;
        }
        .to-cat {
          color: #54fff1;
          text-decoration: underline;
          margin-left: 8px;
        }
      }
      .buff-wrapper {
        .icon {
          .bg-center('../img/buff-icon.png');
        }
        .text-container {
          width: 200px;
          em {
            font-weight: bold;
            color: #ffed5e;
            float: right;
            margin-right: 6px;
            text-decoration: underline;
          }
        }
      }
    }
    .cat-pop-wrapper {
      position: absolute;
      z-index: 2;
      top: 93px;
      left: auto;
      right: 0;
      &.type-1 {
        left: 15px;
        right: auto;
      }
      .cat-pop {
        position: relative;
        width: 320px;
        height: 218px;
        padding: 42px 24px 24px;
        font-weight: bold;
        .bg-center('../img/cat-pop-bg.png');
        .cat-pop-close {
          position: absolute;
          width: 72px;
          height: 72px;
          right: -9px;
          top: 12px;
          .bg-center('../img/cat-pop-close.png');
        }
        .title {
          font-size: 24px;
          color: #9f752a;
          padding-bottom: 6px;
          margin-bottom: 6px;
          border-bottom: 3px dashed #bc9c64;
        }
        .detail {
          font-size: 18px;
          color: #bc9c64;
          span {
            color: #ea4726;
          }
        }
      }
    }
  }
  .right {
    width: 94px;
    border-left: 2px #1063a7 solid;
    text-align: center;
    .service-icon {
      width: 50px;
      height: 50px;
      margin: auto;
      .bg-center('../img/service-icon.png');
    }
    p {
      margin-top: 10px;
      font-weight: bold;
      color: #62acff;
    }
  }
}
</style>
