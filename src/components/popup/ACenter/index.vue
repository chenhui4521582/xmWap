<template>
  <transition name="slide">
    <div class="a-center" v-if="showACenter">
      <div class="pop-mask"></div>
      <div class="a-center-inner activity" v-if="dataArr.length">
        <div class="tabs">
          <div class="huodong" :class="{actived:tabIndex==0}" @click="setTabIndex(0)">
            <span v-if="huodongUnreadNum">{{huodongUnreadNum}}</span>
          </div>
          <div class="gonggao" :class="{actived:tabIndex==1}" @click="setTabIndex(1)">
            <span v-if="gonggaoUnreadNum">{{gonggaoUnreadNum}}</span>
          </div>
        </div>
        <div class="close" @click="closed"></div>
        <div class="left">
          <scroll ref="left">
            <div>
              <div class="li" v-for="(item,index) in dataArr"
                   :class="{select: selectIndex == index}" @click="selectTab(item, index)"
                   :key="index" ref="list">
                <img :src="item.activityTagImage|filter" alt="" v-if="item.activityTagImage"
                     class="flagicon">
                <div class="text"
                     :class="{reddot: selectIndex != index && !item.hasRead && !havaReadIndexArr.includes(item.id)}">
                  <span v-html="item.name"></span>
                </div>
              </div>
            </div>
          </scroll>
        </div>
        <div class="right" :class="{'right-img':!showBtn}" @click="burrypoint">
          <template v-if="dataArr[selectIndex]&&dataArr[selectIndex].activityCategory==1">
            <type4 :dataArr="dataArr[selectIndex]" :data="type4Data" @btndetail="switchUrl"
                   @gainPrize="gainPrize"></type4>
          </template>
          <template v-else>
            <div class="title" v-show="!isImg">{{dataArr[selectIndex].name}}</div>
            <div class="content" :class="{nobtn:!showBtn}">
              <scroll ref="right">
                <div v-if="isImg" class="img" v-html="dataArr[selectIndex].description"
                     @click="btndetail" />
                <div v-else v-html="dataArr[selectIndex].description" />
              </scroll>
            </div>
            <div class="btn_detail" v-if="showBtn" @click="btndetail">
              {{dataArr[selectIndex].buttonName}}
            </div>
          </template>
        </div>
      </div>
      <div class="a-center-inner noactivity" v-else>
        <div class="tabs">
          <div class="huodong" :class="{actived:tabIndex==0}" @click="setTabIndex(0)"><span
            v-if="huodongUnreadNum">{{huodongUnreadNum}}</span>
          </div>
          <div class="gonggao" :class="{actived:tabIndex==1}" @click="setTabIndex(1)"><span
            v-if="gonggaoUnreadNum">{{gonggaoUnreadNum}}</span>
          </div>
        </div>
        <div class="close" @click="closed"></div>
        <p>暂无公告
          <br>快去做任务赚钱吧~
        </p>
        <div @click="gototask" class="btn">去赚话费</div>
      </div>
      <success-pop :show="isShowPop" :prizeImgUrl="type4PrizeData&&type4PrizeData.awardsIcon"
        :prizeName="type4PrizeData&&type4PrizeData.awardsName" @close="isShowPop=false">
      </success-pop>
    </div>
  </transition>
</template>

<script>
import services from '@/services/index'
import scroll from './components/scroll'
import type4 from './components/type4'
import successPop from './components/successPop'
import { jumpUrl, localStorage } from '@/utils/utils'
import { mapState, mapActions, mapMutations } from 'vuex'
import _get from 'lodash.get'

export default {
  data () {
    return {
      showACenter: false,
      selectIndex: 0,
      havaReadIndexArr: [],
      isShowPop: false,
      type4Data: null,
      type4PrizeData: null,
      tabIndex: 0,
      dataArr: [],
      centerdata: null
    }
  },
  computed: {
    ...mapState(['userInfo']),
    huodongArr () {
      return ((this.centerdata && this.centerdata.activities) || []).filter(item => item.activityClassification == 0)
    },
    gonggaoArr () {
      return [...((this.centerdata && this.centerdata.activities) || []).filter(item => item.activityClassification == 1)]
    },
    huodongUnreadNum () {
      return this.huodongArr.filter(item => !item.hasRead && !this.havaReadIndexArr.includes(item.id)).length
    },
    gonggaoUnreadNum () {
      return this.gonggaoArr.filter(item => !item.hasRead && !this.havaReadIndexArr.includes(item.id)).length
    },
    isImg () {
      return this.dataArr[this.selectIndex] && this.dataArr[this.selectIndex].activityType == 3
    },
    showBtn () {
      return this.dataArr[this.selectIndex].buttonName && this.dataArr[this.selectIndex].linkUrl
    }
  },
  components: {
    scroll, type4, successPop
  },
  methods: {
    ...mapMutations({
      setActivityRedDot: 'SET_ACTIVITIES_REDDOT'
    }),
    ...mapActions({
      updateUserInfo: 'GET_USERINFO'
    }),
    setTabIndex (index) {
      if (this.tabIndex == index) {
        return
      }
      this.selectIndex = 0
      this.tabIndex = index
      this.$marchSetsPoint(index == 0 ? 'A_H5PT0019001450' : 'A_H5PT0019001451', { source_addres: this.tabIndex + 1 })
      this.dataArr = this.tabIndex == 0 ? this.huodongArr : this.gonggaoArr
      this.$refs.left && this.$refs.left.scrollTo(0, 0)
      if (this.dataArr.length && !this.dataArr[0].hasRead && !this.havaReadIndexArr.includes(this.dataArr[0].id)) {
        this.havaReadIndexArr = [...new Set([...this.havaReadIndexArr, this.dataArr[0].id])]
        services.getActivityCenterRead({
          activityId: this.dataArr[0].id
        })
      }
    },
    async selectTab (item, index, isRefresh = false) {
      if (this.selectIndex == index && !isRefresh) {
        return
      }
      let isbackponit = this.selectIndex > index
      this.selectIndex = index
      if (item.activityCategory == 1) {
        services.getBettingListNew({
          batchId: this.dataArr[this.selectIndex].batchId
        }).then(res => {
          let { code, data } = res.data
          if (code == 200) {
            this.type4Data = data
          }
        })
      }
      let fontSize = parseFloat(document.children[0].style.fontSize)
      if (this.dataArr.length > 8) {
        if (!isbackponit) {
          this.$refs.left && this.$refs.left.scrollTo(0, -index * 0.83 * fontSize)
        } else {
          this.$refs.left && this.$refs.left.scrollTo(0, (index - 7 < 0 ? 0 : -(index - 7)) * 0.83 * fontSize)
        }
      }
      this.$refs.right && this.$refs.right.scrollTo(0, 0)
      if (!item.hasRead && !this.havaReadIndexArr.includes(item.id)) {
        services.getActivityCenterRead({
          activityId: item.id
        })
      }
      this.havaReadIndexArr = [...new Set([...this.havaReadIndexArr, item.id])]
      this.$marchSetsPoint('A_H5PT0019000716', {
        position_id: index + 1,
        task_id: item.id,
        task_name: item.name,
        source_addres: this.tabIndex + 1
      })
    },
    btndetail () {
      let linkUrl = _get(this.dataArr[this.selectIndex], 'linkUrl', '')
      let activityType = _get(this.dataArr[this.selectIndex], 'activityType', '')
      let id = _get(this.dataArr[this.selectIndex], 'id', '')
      if (linkUrl) {
        if (linkUrl.indexOf('?externalLink') != -1) {
          let type = this.getUrlParam(linkUrl, 'externalLink')
          let externalLink = linkUrl.replace('?externalLink', '') + '?sojumpparm=' + this.userInfo.userId
          switch (type) {
            case '1':
              externalLink = linkUrl.replace('?externalLink=1', '') + '?sojumpparm=' + this.userInfo.userId
              break
            case '2':
              externalLink = linkUrl.replace('?externalLink=2', '') + '?openid=' + this.userInfo.userId
              break
            default:
              break
          }
          window.location.href = externalLink
          return
        }
        this.closed()
        this.switchUrl(linkUrl)
      }
    },
    // 获取地址栏问号后面的参数值新
    getUrlParam (url, ename) {
      var Request = new Object()
      if (url.indexOf('?') != -1) {
        var str = url.split('?')[1]
        var strs = str.split('&')
        for (var i = 0; i < strs.length; i++) {
          Request[strs[i].split('=')[0]] = strs[i].split('=')[1]
          // 对奇速贷  用户id 如MjcyOTAzOA==  这种类型
          if (strs[i].split('=').length > 2) {
            Request[strs[i].split('=')[0]] = strs[i].split('=')[1] + '=='
          }
        }
      }
      return ename ? (Request[ename] ? Request[ename].split('#')[0] : '') : Request
    },
    /** 关闭弹框 **/
    closed () {
      this.showACenter = false
      this.resetData()
      this.$parent.initDialog()
    },
    gototask () {
      this.$router.push('task')
    },
    switchUrl (linkUrl) {
      if (linkUrl && (linkUrl.indexOf('popup') != -1 || linkUrl == 'treasureCeremony1908')) {
        this.$emit('callback', linkUrl)
      } else {
        jumpUrl({ url: linkUrl })
      }
    },
    async gainPrize (data) {
      this.type4PrizeData = data
      this.isShowPop = data && data.awardsName
      if (this.dataArr[this.selectIndex].activityCategory == 1) {
        services.getBettingListNew({
          batchId: this.dataArr[this.selectIndex].batchId
        }).then(res => {
          let { code, data } = res.data
          if (code == 200) {
            this.type4Data = data
          }
        })
      }
      this.updateUserInfo()
    },
    async burrypoint () {
      let linkUrl = _get(this.dataArr[this.selectIndex], 'linkUrl', '')
      let activityType = _get(this.dataArr[this.selectIndex], 'activityType', '')
      let id = _get(this.dataArr[this.selectIndex], 'id', '')
      let name = _get(this.dataArr[this.selectIndex], 'name', '')
      this.$marchSetsPoint('A_H5PT0019000717', {
        target_project_name: linkUrl,
        task_id: id,
        task_name: name,
        source_addres: this.tabIndex + 1
      })
    },
    getData () {
      services.getActivityCenterDetails().then(res => {
        let { code, data } = res.data

        if (code == 200) {
          this.centerdata = data
          this.dataArr = this.huodongArr
          if (this.huodongArr.length && !this.huodongArr[0].hasRead) {
            this.havaReadIndexArr.push(this.huodongArr[0].id)
            services.getActivityCenterRead({
              activityId: this.huodongArr[0].id
            })
          }
          this.$marchSetsPoint('A_H5PT0019000715', { source_addres: this.tabIndex + 1 })
          if (this.dataArr.length) {
            if (this.dataArr[0].activityCategory == 1) {
              this.selectTab(this.dataArr[0], 0, true)
            }else{
              this.$marchSetsPoint('A_H5PT0019000716', {
                position_id: 1,
                task_id: this.dataArr[0].id,
                task_name: this.dataArr[0].name,
                source_addres: 1
              })
            }
          }
          this.showACenter = true
        }
      })
    },
    todayIsShow () {
      let date = new Date().getTime()
      let lastTime = date + 86400000
      let { isShow = false, endTime = '' } = localStorage.get('ACenter')
      if (date > endTime || !endTime) {
        localStorage.set('ACenter', { 'endTime': lastTime, 'isShow': true })
        return false
      }
      if (date <= endTime && !isShow) {
        localStorage.set('ACenter', { 'endTime': lastTime, 'isShow': true })
        return false
      }
      return true
    },
    init (callback) {
      if (callback) {
        //如果是首页判断下今天是否有弹过
        if (!this.todayIsShow()) {
          this.getData()
        }
      }
      else {
        this.getData()
      }
    },
    resetData () {
      this.showACenter = false
      this.selectIndex = 0
      this.havaReadIndexArr = []
      this.isShowPop = false
      this.type4Data = null
      this.type4PrizeData = null
      this.tabIndex = 0
      this.dataArr = []
      this.centerdata = null
    }
  },
  watch: {
    huodongUnreadNum (val) {
      if (this.showACenter && !val) {
        this.setActivityRedDot(0)
      }
    }
  }
}
</script>

<style lang="less" scoped>
.pop-mask {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  z-index: 10;
}

.a-center {
  position: fixed;
  z-index: 11;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow-y: scroll;
  .a-center-inner {
    position: relative;
    z-index: 11;
    width: 720px;
    height: 961px;
    background: url('images/bg.png') no-repeat;
    background-size: 100% 100%;
    overflow: hidden;
    .tabs {
      position: absolute;
      left: 188px;
      top: 185px;
      height: 92px;
      display: flex;
      align-items: flex-end;
      span {
        position: absolute;
        right: 20px;
        top: 15px;
        font-size: 20px;
        font-weight: 800;
        color: rgba(255, 255, 255, 1);
        background: rgba(255, 51, 0, 1);
        border-radius: 6px;
        padding: 0 6px;
        min-width: 24px;
        text-align: center;
        box-sizing: border-box;
      }
      .huodong {
        width: 152px;
        height: 51px;
        background: url('images/huodong.png') no-repeat;
        background-size: 100% 100%;
        position: relative;
        &.actived {
          width: 193px;
          height: 63px;
          background: url('images/huodong_active.png') no-repeat;
          background-size: 100% 100%;
          span {
            top: 20px;
            right: 30px;
          }
        }
      }
      .gonggao {
        width: 152px;
        height: 51px;
        background: url('images/gonggao.png') no-repeat;
        background-size: 100% 100%;
        position: relative;
        margin-left: -5px;
        &.actived {
          width: 193px;
          height: 63px;
          background: url('images/gonggao_active.png') no-repeat;
          background-size: 100% 100%;
          margin-left: -10px;
          span {
            right: 30px;
          }
        }
      }
    }
    .close {
      position: absolute;
      top: 207px;
      right: 87px;
      margin: auto;
      width: 44px;
      height: 44px;
      background: url('images/close.png') no-repeat;
      background-size: 100% 100%;
      z-index: 10;
    }
    &.activity {
      .left {
        position: absolute;
        bottom: 1px;
        left: 61px;
        width: 165px;
        height: 684px;
        background: #fdd9a0;
        overflow: hidden;
        border-radius: 0 0 0 40px;
        z-index: 1;
        .wrapper {
          border-radius: 0 0 0 40px;
        }
        .li {
          position: relative;
          padding: 0 7px 0 26px;
          height: 83px;
          line-height: 30px;
          text-align: center;
          font-size: 22px;
          font-weight: 500;
          color: #b97804;
          display: flex;
          align-items: center;
          justify-content: center;
          .text {
            position: relative;
            width: 132px;
            height: 100%;
            display: flex;
            word-break: break-all;
            align-items: center;
            justify-content: center;
            &.reddot {
              &:before {
                content: '';
                position: absolute;
                top: 4px;
                right: 16px;
                width: 12px;
                height: 12px;
                background: url('images/reddot.png') no-repeat;
                background-size: 100% 100%;
              }
            }
          }
          &.select {
            font-size: 24px;
            font-weight: bold;
            height: 100px;
            color: rgba(222, 49, 4, 1);
            background: url('images/module_1.png') no-repeat;
            background-size: 100% 100%;
            &:before {
              content: '';
              position: absolute;
              left: 0;
              top: 0;
              bottom: 0;
              margin: auto;
              width: 6px;
              height: 60px;
              background: url('images/redlignt.png') no-repeat;
              background-size: 100% 100%;
            }
          }
          &:not(.select):after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 7px;
            width: 150px;
            height: 2.1px;
            background: rgba(235, 91, 46, 1);
            opacity: 0.43;
          }
          &.reddot {
            &:before {
              content: '';
              position: absolute;
              bottom: 54px;
              right: 25px;
              width: 12px;
              height: 12px;
              background: url('images/reddot.png') no-repeat;
              background-size: 100% 100%;
            }
          }
        }
      }
      .right {
        position: absolute;
        bottom: 0;
        left: 226px;
        right: 59px;
        height: 684px;
        padding: 40px;
        box-sizing: border-box;
        .title {
          text-align: center;
          font-weight: 800;
          color: rgba(222, 49, 4, 1);
          margin-bottom: 20px;
        }
        .content {
          padding-top: 10px;
          font-size: 22px;
          font-weight: 500;
          color: rgba(59, 59, 59, 1);
          position: absolute;
          left: 40px;
          right: 40px;
          top: 83px;
          bottom: 110px;
          overflow: hidden;
          &.nobtn {
            top: 20px;
            bottom: 20px;
            left: 20px;
            right: 20px;
          }
          .img {
            width: 100%;
            height: 100%;
          }
        }
        .btn_detail {
          position: absolute;
          bottom: 20px;
          right: 0;
          left: 0;
          margin: auto;
          width: 251px;
          height: 66px;
          line-height: 66px;
          text-align: center;
          background: url('images/btnbottom.png') no-repeat;
          background-size: 100% 100%;
        }
      }
      .right-img {
        padding: 20px;
      }
    }
    &.noactivity {
      font-size: 26px;
      font-weight: bold;
      &:after {
        content: '';
        position: absolute;
        top: 396px;
        left: 0;
        right: 0;
        margin: auto;
        width: 178px;
        height: 178px;
        background: url('images/no.png') no-repeat;
        background-size: 100% 100%;
      }
      p {
        position: absolute;
        top: 611px;
        left: 0;
        right: 0;
        margin: auto;
        text-align: center;
        color: rgba(222, 49, 4, 1);
        line-height: 36px;
      }
      div.btn {
        position: absolute;
        width: 251px;
        height: 66px;
        bottom: 163px;
        left: 0;
        right: 0;
        margin: auto;
        line-height: 66px;
        text-align: center;
        background: url('images/btnbottom.png') no-repeat;
        background-size: 100% 100%;
      }
    }
  }
}

.flagicon {
  height: 70px;
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  margin: auto;
  width: 26px;
}

.slide-enter,
.slide-leave-to {
  transform-origin: 650px 700px;
  transform: scale(0);
}

.slide-enter-to,
.slide-leave {
  transform: scale(1);
}

.slide-enter-active,
.slide-leave-active {
  transition: all 0.4s ease;
}
</style>

