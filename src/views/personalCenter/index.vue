<template>
  <div class="personal-center">
    <div class="pc-container" v-if="!showsurveypage">
      <wfHeader bgColor="#fff" title="个人中心"></wfHeader>
      <div class="first-section" :class="{'showHeader': $moduleConfig.isShowHeader}">
        <a class="center-cell" @click="changeHeadImg()">
          <div class="cell-wrapper">
            <div class="cell-left">头像</div>
            <div class="cell-right">
              <input v-if="userInfo.headImgFlag"
                style="opacity:0;position: absolute;right: 0;width: 100%;height: 0.68*100px;"
                type="file" id="uploaderFile" ref="uploaderFile" accept="image/*" @change="imgSure">
              <div class="head-img" :class="{'no-head-frame':!userInfo.headFrame}">
                <img
                  :src="userInfo.headImg||'//file.beeplaying.com/cdn/common/images/common/img_photo.png'"
                  alt="">
                <div v-if="userInfo.headFrame" class="head-frame">
                  <img :src="userInfo.headFrame|filter" alt="">
                </div>
              </div>

            </div>
            <i class="cell-arrow-right"></i>
          </div>
        </a>
        <a class="center-cell" @click="changeNickname()">
          <div class="cell-wrapper">
            <div class="cell-left">昵称</div>
            <div class="cell-right">
              <span>{{userInfo.nickname}}</span>
            </div>
            <i class="cell-arrow-right"></i>
          </div>
        </a>
        <a class="center-cell">
          <div class="cell-wrapper">
            <div class="cell-left">用户ID</div>
            <div class="cell-right no-arrow">
              <span>{{userInfo.userId}}</span>
            </div>
          </div>
        </a>
        <a class="center-cell no-border" @click="toBondingPhone()">
          <div class="cell-wrapper">
            <div class="cell-left">手机号绑定</div>
            <div class="cell-right">
              <span>{{userInfo.phone}}</span>
            </div>
            <i class="cell-arrow-right"></i>
          </div>
        </a>
      </div>
      <div class="second-section"></div>
      <a class="center-cell no-border" v-if="showCloseSendMsg" @click="setSendMsg">
        <div class="cell-wrapper">
          <div class="cell-left">推送通知</div>
          <switch-btn v-model="closeSendMsg" :isClick="false" />
        </div>
      </a>
      <div class="second-section"></div>
      <a class="center-cell no-border" @click="toHeadFrame()">
        <div class="cell-wrapper">
          <div class="cell-left orange">头像挂件</div>
          <i class="cell-arrow-right"></i>
        </div>
      </a>
      <div class="second-section"></div>
      <a class="center-cell" @click="toAuthentication()" v-if="!userInfo.idcardNo">
        <div class="cell-wrapper">
          <div class="cell-left">实名认证通道</div>
          <i class="cell-arrow-right"></i>
        </div>
      </a>
      <a class="center-cell" v-else>
        <div class="cell-wrapper">
          <div class="cell-left">身份证号</div>
          <div class="cell-right">
            <span>{{userInfo.idcardNo}}</span>
          </div>
        </div>
      </a>
      <a class="center-cell no-border" @click="toSetLimit()">
        <div class="cell-wrapper">
          <div class="cell-left">充值额度设置</div>
          <i class="cell-arrow-right"></i>
        </div>
      </a>
      <div class="second-section"></div>
      <a class="center-cell no-border" @click="goToAsset()">
        <div class="cell-wrapper">
          <div class="cell-left">资产记录明细</div>
          <div class="cell-right">
          </div>
          <i class="cell-arrow-right"></i>
        </div>
      </a>
      <div class="second-section"></div>
      <a class="center-cell no-border" @click="goAddress">
        <div class="cell-wrapper">
          <div class="cell-left">我的收货地址</div>
          <div class="cell-right">
          </div>
          <i class="cell-arrow-right"></i>
        </div>
      </a>
      <div class="second-section"></div>
      <a class="center-cell" v-if="showSurvey&&showSurvey.haveDo">
        <div class="cell-wrapper">
          <div class="cell-left">参与有奖调研</div>
          <div class="cell-right no-arrow">
            <span>已参与</span>
          </div>
        </div>
      </a>
      <a class="center-cell" @click="goToSurvey()" v-if="showSurvey&&!showSurvey.haveDo"
        :class="{reddot:showSurveyTip}">
        <div class="cell-wrapper">
          <div class="cell-left">参与有奖调研</div>
          <div class="cell-right">
          </div>
          <i class="cell-arrow-right"></i>
        </div>
      </a>
    </div>
    <Modal v-model="show" title="温馨提示" :type="2" :saveButtonShow="true" closeText="再考虑一下"
      saveText="确认修改" @on-save="fileChange">
      <div class="tx-center">
        头像只可以修改一次呢<br />
        修改成功后就无法再次修改了<br />
        请注意哦
      </div>
    </Modal>
    <!-- 关闭消息推送 -->
    <Modal v-model="showSendMsgModal" title="温馨提示" :type="2" @on-save="_closeSend"
      @on-close="hideCloseSendMsgModal">
      <div class="sendMsg-center">
        <p>你确定要关闭天天福利的推送通知吗? </p>
        <h5>关闭后，下周起将不再收到推送消息</h5>
        <p>提示：若要再次开启，需要联系客服</p>
      </div>
    </Modal>
    <awardsDialog v-model="showsurveyaward" :awards="awardInfo" @callback="showsurveyaward=false"
      tipsTxt="感谢参与" :explainText="awardInfo.explainText"></awardsDialog>
    <survey v-if="showsurveypage" @close="closeSurvey" @showaward="showaward"></survey>
  </div>
</template>
<script>
import SwitchBtn from '@/components/ui_compontents/switchBtn/switchBtn'
import Services from '@/services/personalCenter'
import survey from './components/survey'
import _get from 'lodash.get'
export default {
  name: 'personalCenter',
  data () {
    return {
      isShowPop: false,
      realNamePop: false,
      userInfo: {},
      showLoading: false,
      show: false,
      showSurvey: null,
      showsurveypage: false,
      showsurveyaward: false,
      showSurveyTip: false,
      awardInfo: {},
      headImgFile: null,
      showSendMsgModal: false,
      showCloseSendMsg: false,
      closeSendMsg: false
    }
  },
  components: {
    survey,
    SwitchBtn
  },
  computed: {
    curChannel () {
      return localStorage.getItem('APP_CHANNEL') ? localStorage.getItem('APP_CHANNEL') : this.getUrlParam('channel')
    },
    curToken () {
      return localStorage.getItem('ACCESS_TOKEN') ? localStorage.getItem('ACCESS_TOKEN') : this.getUrlParam('token')
    },
    isConfigChannel () {
      return sessionStorage.isConfigChannel
    }
  },
  methods: {
    /** 获取推送状态开关 **/
    _getCloseSendStatus () {
      Services.getCloseSendStatus().then(res => {
        const { code } = _get(res, 'data')
        if (code == 200) {
          this.showCloseSendMsg = true
          //true：用户已关闭   false：用户未关闭
          this.closeSendMsg = !_get(res, 'data.data', true)
          // this.closeSendMsg = true
        }
      })
    },
    /** 设置推送 **/
    setSendMsg () {
      if (this.closeSendMsg) {
        this.openCloseSendModal()
        this.$marchSetsPoint('A_H5PT0124003355')
      } else {
        this.openSendMsg()
        this.$marchSetsPoint('A_H5PT0124003359')
      }
    },
    /** 是否关闭推送询问弹框 **/
    openCloseSendModal () {
      this.showSendMsgModal = true
      this.$marchSetsPoint('A_H5PT0124003356')
    },
    /** 关闭消息推送弹框 **/
    hideCloseSendMsgModal () {
      this.showSendMsgModal = false
      this.$marchSetsPoint('A_H5PT0124003358')
    },
    /** 关闭推送 **/
    _closeSend () {
      this.showSendMsgModal = false
      Services.closeSend().then(res => {
        const { code, message } = _get(res, 'data')
        if (code == 200) {
          this.$Toast('关闭成功', () => {
            this.closeSendMsg = false
          })
        } else {
          this.$Toast(message)
        }
      })
      this.$marchSetsPoint('A_H5PT0124003357')
    },
    /** 打开推送 **/
    openSendMsg () {
      this.$Toast('若要开启，请联系客服')
    },
    // 获取地址栏问号后面的参数值
    getUrlParam: function (ename) {
      var url = window.location.href
      var Request = {}
      if (url.indexOf('?') !== -1) {
        var str = url.split('?')[1]
        var strs = str.split('&')
        for (var i = 0; i < strs.length; i++) {
          Request[strs[i].split('=')[0]] = (strs[i].split('=')[1])
        }
      } else {
        return ''
      }
      let params = Request[ename] ? Request[ename].split('#')[0] : ''
      return params
    },
    async getUserPersonalInfo () {
      const res = await Services.getUserPersonalInfo()
      if (res.data.code === 200) {
        this.$marchSetsPoint('P_H5PT0124') //H5平台-我的-个人中心-页面
        this.userInfo = res.data.data
        sessionStorage.userInfoPersonal = JSON.stringify(this.userInfo)
      } else {
        res.message && this.$Toast(res.message)
      }
      this.showLoading = false
    },
    changeHeadImg () {
      if (!this.userInfo.headImgFlag) {
        this.$Toast('头像只能修改一次哦，您已经修改过啦！')
      }
    },
    closePop () {
      this.show = false
    },
    imgSure (e) {
      if (e.target.files[0]) {
        this.headImgFile = e.target.files[0]
        this.show = true
      }
    },
    async fileChange (e) {
      this.showLoading = true
      let formData = new FormData()
      formData.append('file', this.headImgFile)
      const res = await Services.getUpdateUserHeadImg(formData)
      this.show = false
      this.showLoading = false
      this.$Toast(res.data.message || '修改成功')
      if (res.data.code === 200) {
        this.getUserPersonalInfo()
      }
    },
    changeNickname () {
      if (this.userInfo.nicknameFlag) {
        this.$router.push('/personalCenter/nickname')
      } else {
        this.$Toast('昵称只能修改一次哦，您已经修改过啦！')
      }
    },
    goToRealName () {
      this.$marchSetsPoint('A_H5PT0124001208') //H5平台-我的-个人中心-实名认证通道
      this.$router.push({ name: 'realName', query: { sourceAddress: 'normal' } })
    },
    goToLimit () {
      this.$marchSetsPoint('A_H5PT0124001207') //H5平台-我的-个人中心-充值额度设置
      this.$router.push('/rechargeLimit')
    },
    goToAsset () {
      this.$marchSetsPoint('A_H5PT0124001209') //H5平台-我的-个人中心-资产记录明细
      this.$router.push('/personalCenter/costLog')
    },
    toBondingPhone () {
      this.$router.push('/personalCenter/phoneBinding')
    },
    toHeadFrame () {
      this.$router.push('/personalCenter/headFrame')
      this.$marchSetsPoint('A_H5PT0124003431') // H5平台-我的-个人中心-头像挂件点击
    },
    toAuthentication () {
      this.$router.push('/personalCenter/authentication')
      this.$marchSetsPoint('A_H5PT0124001208')
    },
    toSetLimit () {
      this.$router.push('/personalCenter/setLimit')
      this.$marchSetsPoint('A_H5PT0124001207')
    },
    goAddress () {
      this.$marchSetsPoint('A_H5PT0124003028')
      this.$router.push({
        name: 'addressList'
      })
    },
    async getSurveyInfo (ismounted = false) {
      const res = await Services.getSurveyInfo()
      if (res.data.code === 200) {
        this.showSurvey = res.data.data// showSurveyTip
        if (this.showSurvey && !this.showSurvey.haveDo) {
          this.showSurveyTip = !localStorage.getItem('survey_entrance')
          if (ismounted && this.$router.currentRoute.name === 'survey') {
            this.goToSurvey()
          }
        }
      }
    },
    goToSurvey () {
      this.showsurveypage = true
    },
    showaward (val) {
      this.getSurveyInfo()
      this.showsurveyaward = true
      this.awardInfo = {
        nofilter: true,
        awardsName: val + '金叶子',
        awardsImage: `${require('./image/leaf.png')}`,
        explainText: {
          text: '可在【我的】页面中查看',
          color: '#ACACAC'
        }
      }
    },
    closeSurvey () {
      this.showsurveypage = false
      this.showSurveyTip = false
    }
  },
  mounted () {
    this.showLoading = true
    this.getUserPersonalInfo()
    this.$marchSetsPoint('P_H5PT0124')
    this.getSurveyInfo(true)
    if (this.curChannel == 100070) {
      this._getCloseSendStatus()
    }
  }
}
</script>
<style lang="less" scoped>
.first-section {
  &.showHeader {
    margin-top: 120px;
  }
  // margin-top:20px;
}
.tx-center {
  font-size: 24px;
  text-align: center;
  color: #888888;
  padding: 10px 0 25px 0;
}
.sendMsg-center {
  padding: 10px 0;
  font-size: 24px;
  text-align: center;
  color: #888888;
  h5 {
    margin-bottom: 0.14rem;
  }
}
.second-section {
  margin: 20px 0;
}
.pc-container {
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background: #f7f7f7;
  overflow-x: hidden;
  overflow-y: scroll;
}
a {
  text-decoration: none;
  color: #fff;
}

img {
  border: none;
  outline: none;
}
.center-cell {
  display: block;
  color: #252525;
  min-height: 90px;
  padding: 0 24px;
  background: #fff;
  position: relative;
  .cell-wrapper {
    display: flex;
    min-height: inherit;
    line-height: 1;
    align-items: center;
  }
  &:not(:last-child) {
    .cell-wrapper {
      border-bottom: 1px solid #e6e6e6;
    }
  }
  &.no-border {
    .cell-wrapper {
      border: none;
    }
  }
  &.reddot {
    &:after {
      content: '';
      position: absolute;
      left: 200px;
      top: 20px;
      width: 16px;
      height: 16px;
      border-radius: 50%;
      background: #f42424;
    }
  }
}
.cell-left {
  flex: 1;
  font-size: 28px;
  color: #000;
  font-weight: bold;
  &.orange {
    color: #ff7800;
  }
}
.cell-right {
  margin-right: 34px;
  color: #888888;
  font-size: 28px;
  span {
    color: #888888;
  }
  img {
    width: 80px;
    height: 80px;
  }
}
.no-arrow {
  margin-right: 35px;
}
.cell-arrow-right {
  position: relative;
}
.cell-arrow-right:after {
  border: 2px solid #acacac;
  border-bottom-width: 0;
  border-left-width: 0;
  content: '';
  top: 50%;
  right: 0;
  position: absolute;
  width: 12px;
  height: 12px;
  -webkit-transform: translateY(-50%) rotate(45deg);
  transform: translateY(-50%) rotate(45deg);
}
.head-img {
  width: 90px;
  height: 90px;
  margin: 6px auto;
  position: relative;
  overflow: hidden;
  img {
    position: absolute;
    top: 5px;
    left: 5px;
  }
  &.no-head-frame {
    height: 80px;
    width: 80px;
    border-radius: 50%;
    border: 3px solid #ccc;
    box-sizing: content-box;
    img {
      top: 0;
      left: 0;
    }
  }
  .head-frame {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    img {
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }
  }
}
.pop-mask {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  overflow: hidden;
  background-color: rgba(14, 14, 14, 0.78);
  z-index: 10;
  .receive-pop {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -60%);
    width: 80%;
    height: 3.6 * 100px;
    background: #0f1726;
    text-align: center;
    z-index: 11;
    color: #fff;
    p:first-child {
      height: 0.8 * 100px;
      line-height: 0.8 * 100px;
      background: #141f33;
      font-size: 0.26 * 100px;
      position: relative;
      i {
        position: absolute;
        right: 0;
        width: 0.4 * 100px;
        height: 0.8 * 100px;
        &::after {
          content: '';
          display: inline-block;
          margin-top: 0.25 * 100px;
          margin-right: 0.2 * 100px;
          width: 0.2 * 100px;
          height: 0.2 * 100px;
          vertical-align: top;
          /*background: url(../images/close-small.png) no-repeat;*/
          background-size: 100%;
        }
      }
    }
    p:nth-of-type(2) {
      padding: 0.7 * 100px 0;
      font-size: 0.24 * 100px;
      i {
        color: #ffd338;
      }
    }
    p:last-child {
      margin: 0 auto;
      width: 1.8 * 100px;
      height: 0.6 * 100px;
      line-height: 0.6 * 100px;
      background: #ee6f0b;
      border-radius: 0.08 * 100px;
      font-size: 0.28 * 100px;
      font-weight: bold;
    }
  }
}
</style>
