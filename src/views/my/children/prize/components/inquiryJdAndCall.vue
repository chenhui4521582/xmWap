<template>
  <Modal v-model="show" title="恭喜您获得" :isWidth="isWidth" :buttonShow="false" @on-close="closePop">
    <template>
      <div class="award-title">
        <div class="title">
          <span>{{params.awardsName}}</span>
        </div>
      </div>
      <div class="award-warp">
        <template v-if="params.type==='call'">
          <div class="copy-item">
            <div class="copy-title">
              请复制下方的卡号
              <span class="copy" v-clipboard:copy="callList['callNumber']['value']"
                v-clipboard:success="copyCode" v-clipboard:error="onError">复制</span>
            </div>
            <div class="input-warp">{{callList['callNumber']['value']}}</div>
          </div>
          <div class="copy-item">
            <div class="copy-title">
              请复制下方的卡密
              <span class="copy" v-clipboard:copy="callList['callPassword']['value']"
                v-clipboard:success="copyCode" v-clipboard:error="onError">复制</span>
            </div>
            <div class="input-warp">{{callList['callPassword']['value']}}</div>
          </div>
          <div class="no-bold">
            {{callList['effectiveTime']['name']}}
          </div>
        </template>
        <template v-if="params.type==='jd'">
          <div class="copy-item">
            <div class="copy-title">
              请复制下方的卡密至京东使用
              <span class="copy" v-clipboard:copy="callList['callNumber']['value']"
                v-clipboard:success="copyCode" v-clipboard:error="onError">复制</span>
            </div>
            <div class="input-warp">{{callList['callNumber']['name']}}</div>
          </div>
        </template>
        <template v-if="params.type==='renren'">
          <div class="copy-item">
            <div class="copy-title">
              请复制下方礼品卡
              <span class="copy" v-clipboard:copy="callList['callNumber']['value']"
                v-clipboard:success="copyCode" v-clipboard:error="onError">复制</span>
            </div>
            <div class="input-warp">{{callList['callNumber']['name']}}</div>
            <div class="no-bold">
              {{callList['effectiveTime']['name']}}
            </div>
          </div>
        </template>
        <p class="tips">温馨提示: 如发现卡密无法使用, 请及时联系客服处理。</p>
        <div v-if="params.awardsType==33 || params.awardsType==4 || params.awardsType==47"
          class="open-iusses">如何使用<img src="../img/expand.png" alt=""
            :style="{transform:showuse?'rotate(0deg)':'rotate(180deg)'}"
            @click="showuse=!showuse" />
          <template v-if="params.awardsType==33">
            <div class="info-content" v-if="showuse">
              1.移动：全国范围内（港澳台除外）中国移动用户，使 用手机或者固定电话拨打10086或13800138000按照 语音提示操作充值
              或登入移动网上营业厅http://www.10086.cn进行充值 <br><br>
              2.联通：全国范围内（港澳台除外）中国联通用户，使 用手机或者固定电话拨打10011按照语音提示操作充值，
              或登入联通网上营业厅www10010.com进行充值<br><br>
              3.电信：全国范围内（港澳台除外）中国电信用户，使 用手机或者固定电话拨打11888按照语音提示操作充值，
              或登入电信网上营业厅http://www.189.cn进行充值<br><br>
              <wf-button class="copy" slot="footer" :long=true @click="updateUseFlag">标记为已使用
              </wf-button>
            </div>
          </template>
          <template v-if="params.awardsType==4">
            <div class="info-content" v-if="showuse">
              一、手机端：<br>
              1、下载并登陆“京东”APP。<br>
              2、点击右下角“我的”,点击“我的京东”-点击“我的钱包”-选择“礼品卡”。<br>
              3、“绑定新卡”，输入卡密进行绑定。<br><br>
              二、电脑端：<br>
              1、浏览器中打开京东官网并登陆。<br>
              2、在页面上方点击“我的订单”-点击左侧 “资产中心”-“礼品卡”。<br>
              3、输入卡密和验证码进行绑定<br><br>
              <wf-button class="copy" slot="footer" :long=true @click="updateUseFlag">标记为已使用
              </wf-button>
            </div>
          </template>
          <template v-if="params.awardsType==47">
            <div class="info-content" v-if="showuse">
              1.复制礼品码后，打开人人视频；<br>
              2.进入“我的”页面；<br>
              3.点击进入页面底部“礼品码”； <br>
              4.输入礼品码后提交，即可获得人人视频勋章权益。<br><br>
              <wf-button class="copy" slot="footer" :long=true @click="updateUseFlag">标记为已使用
              </wf-button>
            </div>
          </template>
        </div>
        <p class="open-iusses" v-else @click="openIssues">如何使用？>></p>
      </div>
    </template>
  </Modal>
</template>
<script>
import { saveAddress } from '@/services/user'
export default {
  name: 'inquiryJdAndCall',
  data () {
    return {
      isWidth: false,
      show: this.value,
      showuse: true,
      isClickCopyBtn: false
    }
  },
  computed: {
    callList () {
      return this.callArreyObject()
    }
  },
  props: {
    value: {
      type: Boolean,
      default: false
    },
    params: {
      type: Object,
      default: () => {
        return {
          awardsName: '',
        }
      }
    }
  },
  watch: {
    value (val) {
      this.show = val
      this.showuse = true
      this.isClickCopyBtn = false
    },
    show (val) {
      this.$emit('input', val)
    }
  },
  mounted () {
  },
  methods: {
    // 话费卡卡号卡密和有效期解析
    callArreyObject () {
      const { receiveRemark, type, awardsType } = this.params
      if (!receiveRemark) {
        return {
          callNumber: {
            name: '',
            value: ''
          }
        }
      }
      if (type === 'call') {
        //卡号比较长，让弹框宽度增加显示
        this.isWidth = true
        let list = null
        if (receiveRemark.indexOf('，') !== -1) {
          list = receiveRemark.split('，')
        } else {
          list = receiveRemark.split(',')
        }
        return {
          callNumber: this.analyzeStr(list[0]),
          callPassword: this.analyzeStr(list[1]),
          effectiveTime: this.analyzeStr(list[2])
        }
      }
      else if (type == 'renren') {
        let list = null
        if (receiveRemark.indexOf('，') !== -1) {
          list = receiveRemark.split('，')
        } else {
          list = receiveRemark.split(',')
        }
        return {
          callNumber: this.analyzeStr(list[0]),
          effectiveTime: list[1] && this.analyzeStr(list[1]) || ''
        }
      }
      else {
        return {
          callNumber: this.analyzeStr(receiveRemark),
        }
      }
    },
    // 解析字符串
    analyzeStr (item) {
      let list = item.split('：')
      return {
        name: item,
        value: list[1]
      }
    },
    // 打开问题反馈
    openIssues () {
      this.$router.push({
        name: 'issues'
      })
    },
    // 复制卡号和卡密
    copyCode () {
      this.isClickCopyBtn = true
      this.$Toast('复制成功')
    },
    onError () {
      this.$Toast('当前浏览器不支持此功能，请手动复制。')
    },
    updateUseFlag () {
      this.$emit('updateUseFlagpop', this.params)
    },
    closePop () {
      if (this.isClickCopyBtn) {
        this.$emit('changestate', this.params)
      }
    }
  }
}
</script>
<style lang="less" scoped>
.award-title {
  .title {
    padding: 0 0 16px 0;
    font-size: 24px;
    text-align: center;
    border-bottom: 1px solid #e6e6e6;
    span {
      color: #ff4141;
    }
  }
  .directions {
    padding: 0 72px 40px 72px;
    font-size: 24px;
    color: #333;
    line-height: 36px;
    text-align: center;
  }
}
.award-warp {
  .small-title {
    padding: 19px 0 14px;
    font-size: 24px;
    color: #000;
  }
  .tips {
    font-size: 20px;
    color: #000;
  }
}
.input-warp {
  width: 100%;
  height: 70px;
  background-color: #f7f7f7;
  border-radius: 16px;
  font-size: 24px;
  padding: 10px 20px;
  color: #000;
  line-height: 50px;
}
.copy-item {
  .copy-title {
    margin: 20px 0 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 24px;
    color: #000;
    span {
      display: block;
      width: 70px;
      height: 42px;
      line-height: 42px;
      background-color: #ff4141;
      border-radius: 16px;
      text-align: center;
      color: #fff;
    }
  }
}
.no-bold {
  margin-top: 17px;
  color: #bbbbbb;
  font-size: 20px;
}
.open-iusses {
  font-size: 24px;
  color: rgba(255, 120, 0, 1);
  line-height: 60px;
  img {
    width: 20px;
    margin-left: 4px;
  }
  .info-content {
    font-size: 20px;
    font-weight: 500;
    line-height: 30px;
    color: rgba(187, 187, 187, 1);
    margin-top: 14px;
  }
}
.jd-button {
  height: 100px;
  width: 100%;
  text-align: center;
  span {
    display: inline-block;
    width: 220px;
    height: 70px;
    font-size: 30px;
    color: #333;
    font-weight: bold;
    border-radius: 35px;
    box-sizing: border-box;
    text-align: center;
    line-height: 74px;
    border: none;
    background-color: #ff4141;
  }
}
</style>


