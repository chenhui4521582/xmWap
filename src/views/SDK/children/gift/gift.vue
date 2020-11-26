<template>
  <article class="sdk-gift-wrapper">
    <section ref="sdkGift" class="sdk-gift-container">
      <section class="sdk-gift">
        <template v-if="cdkArr&&cdkArr.length">
          <h4 class="title">福利礼包</h4>
          <ul>
            <template v-for="(item,index) in cdkArr">
              <li :key="index">
                <div class="top">
                  <div class="left">
                    <p class="name">{{item.gameCdkeyRsp.name}}</p>
                    <p class="desc">
                      {{item.gameCdkeyRsp.description}}<br />
                      <template v-if="item.IF_GET">
                        兑换码: <span>{{item.gameCdkeyRsp.cdKey}}</span>
                        <template v-if="item.gameCdkeyRsp.getWay">
                          <br />
                          兑换方式: {{item.gameCdkeyRsp.getWay}}
                        </template>
                      </template>
                    </p>
                  </div>
                  <div class="right">
                    <div class="btn blue copy" v-if="item.IF_GET"
                      v-clipboard:copy="item.gameCdkeyRsp.cdKey" v-clipboard:success="onCopy"
                      v-clipboard:error="onError">复制兑换码
                    </div>
                    <div class="btn orange" v-else-if="item.gameCdkeyRsp.remainNum*100 > 0"
                      @click.stop="getAward(item.gameCdkeyRsp.batchId)">免费领取</div>
                    <div class="btn grey" v-else>已领完</div>
                  </div>
                </div>
                <div class="bottom" v-if="!item.IF_GET">
                  <div class="g-percent-bg">
                    <div class="g-percent"
                      :style="{width: Math.floor(item.gameCdkeyRsp.remainNum*100)+'%'}">
                    </div>
                    <p>{{Math.floor(item.gameCdkeyRsp.remainNum*100)}}%剩余</p>
                  </div>
                </div>
              </li>
            </template>
          </ul>
        </template>
        <template v-else>
          <div class="nolist">
            <img src="../../img/no-message.png" alt="">
          </div>
        </template>
      </section>
    </section>
    <sdk-popup v-model="showAwards" title="恭喜获得" :type="2" :showCancel="false" confirmText="朕收下了"
      @on-close="awardsCallback" @on-confirm="awardsCallback">
      <div class="award-pop-wrap">
        <div class="award-bg">
          <img src="../../img/gift-awards-img.png" alt="">
        </div>
        <p>福利礼包x1</p>
      </div>
    </sdk-popup>
  </article>
</template>

<script>
import { mapState } from 'vuex'
import { getUrlParams, jumpUrl } from '@/utils/utils'
import Services from '@/services/SDK'
import { getAwardsCDKey } from '@/services/global'
import _get from 'lodash.get'
import BScroll from 'better-scroll'
export default {
  name: 'sdk-gift',
  computed: {
    wfCurLink () {
      return getUrlParams('wf_cur_link') || ''
    },
    gameType () {
      return getUrlParams('gametype') && parseInt(getUrlParams('gametype')) || getUrlParams('gameType') && parseInt(getUrlParams('gameType'))
    }
  },
  data () {
    return {
      cdkArr: [],
      showAwards: false
    }
  },
  mounted () {
    this.getCdkeyStatus()
    new BScroll(this.$refs.sdkGift, { scrollY: true, click: true })
  },
  methods: {
    async getCdkeyStatus () {
      const res = await Services.cdkeyStatus({
        value: this.wfCurLink
      })
      const { data, code, message } = res.data
      if (code == 200) {
        this.cdkArr = data
      }
    },
    async getAward (value) {
      const res = await getAwardsCDKey({ value: value })
      const { code, data, message } = _get(res, 'data', {})
      if (code === 200) {
        this.showAwards = true
      } else {
        this.cdkey = message
      }
    },
    awardsCallback () {
      this.getCdkeyStatus()
    },
    onCopy () {
      this.$marchSetsPoint('A_H5PT0121001159', { from_project_id: this.gameType }) // H5平台-游戏内SDK-CDKey兑换
      this.$Toast('复制成功')
    },
    onError () {
      this.$Toast('当前浏览器不支持此功能，请手动复制。')
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
.sdk-gift-container {
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
  .title {
    text-align: center;
    font-size: 26px;
    font-weight: bold;
    color: #9f752a;
    display: flex;
    align-items: center;
    justify-content: center;
    padding-top: 20px;
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
  ul {
    li {
      margin: 0 12px;
      padding: 22px 8px 20px;
      border-bottom: 2px #e6ad5d dashed;
      .top {
        display: flex;
        justify-content: space-between;
        .left {
          flex: 1;
          margin-right: 6px;
          .name {
            font-size: 22px;
            font-weight: bold;
            color: #000;
          }
          .desc {
            font-size: 20px;
            line-height: 26px;
            color: #5b5b5b;
            span {
              font-weight: bold;
              color: #fe7506;
            }
          }
        }
        .right {
          .btn {
            min-width: 140px;
            max-width: 140px;
            height: 70px;
            line-height: 70px;
            font-size: 20px;
            text-align: center;
            color: #ffefef;
            font-weight: bold;
            background-repeat: no-repeat;
            background-position: center center;
            background-size: 100% 100%;
            &.orange {
              background-image: url(../../img/gift-orange-btn-bg.png);
            }
            &.blue {
              background-image: url(../../img/gift-blue-btn-bg.png);
            }
            &.grey {
              background-image: url(../../img/gift-grey-btn-bg.png);
            }
          }
        }
      }
      .bottom {
        margin-top: 8px;
        .g-percent-bg {
          position: relative;
          width: 100%;
          height: 24px;
          background: #ceb68b;
          border-radius: 8px;
          .g-percent {
            position: absolute;
            top: 2px;
            left: 2px;
            height: 20px;
            background: #fe7506;
            border-radius: 7px;
            max-width: calc(~'100%' - 4px);
          }
          p {
            position: absolute;
            font-size: 16px;
            color: #fff;
            left: 50%;
            width: 100px;
            white-space: nowrap;
            text-align: center;
            margin-left: -50px;
          }
        }
      }
    }
  }
  .nolist {
    margin: 249px auto 0;
    width: 338px;
    height: 226px;
    img {
      vertical-align: top;
      width: 100%;
    }
  }
}
.award-pop-wrap {
  .award-bg {
    width: 420px;
    height: 350px;
    margin: -30px auto 0;
    display: flex;
    align-items: center;
    justify-content: center;
    .bg-center('../../img/award-bg.png');
    img {
      max-height: 160px;
    }
  }
  p {
    font-size: 20px;
    font-weight: bold;
    color: #fff;
    line-height: 30px;
    text-align: center;
    margin-top: -42px;
    i {
      font-size: 24px;
      color: #ffed5e;
    }
  }
}
</style>
