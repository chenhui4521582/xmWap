  <template>
  <div class="auto-icon-desc-guide" v-if="isShowAutoIconDescGuide">
    <img class="desc-guide-bg" src="./img/auto-icon-guide-bg.png" alt="" />
    <Modal v-model="isShowAutoIconDescGuide" :isShowMask="false" :type="2" title="图标含义">
      <div class="auto-icon-content">
        <p>
          我们将为您在每天凌晨查询1次京东卡绑卡状态，标记
          <img src="./img/auto-icon.png" alt="" />表示为系统查询<br />
          1、仅限2020年7月1日后领取，且查询框中提供了卡号的京东卡<br />
          2、每天凌晨查1次
        </p>
      </div>
      <div slot="footer">
        <p class="btn cancel" v-if="countdownTime > 0">
          知道了（{{ countdownTime }}s）
        </p>
        <p class="btn confirm" @click="closeGuide" v-else>知道了</p>
      </div>
    </Modal>
  </div>
  <div v-else class="prize-warp">
    <wf-header title="奖品领取" @on-back="returnPage" :isSystemQueryUser="isSystemQueryUser"
      :customize="customize" @on-click="returnPage" />
    <template v-if="airListShow">
      <template v-if="$moduleConfig.isShowHeader">
        <p class="auto-check has-header" v-if="isSystemQueryUser" @click.stop="showAutoIconDesc(0)">
          <img src="./img/auto-icon.png" alt="" /><span>系统查询</span>每日03:00更新
        </p>
        <span class="managetitle" v-if="showmanage" @click="showmanage = !showmanage">管理</span>
        <span class="managetitle" v-else @click="showmanage = !showmanage">完成</span>
      </template>
      <template v-else>
        <div class="title-btn-wrapper">
          <p class="auto-check" v-if="isSystemQueryUser" @click.stop="showAutoIconDesc(0)">
            <img src="./img/auto-icon.png" alt="" /><span>系统查询</span>每日03:00更新
          </p>
          <span class="managetitle" v-if="showmanage" @click="showmanage = !showmanage">管理</span>
          <span class="managetitle" v-else @click="showmanage = !showmanage">完成</span>
        </div>
      </template>
      <sf-comment :isSystemQueryUser="isSystemQueryUser"></sf-comment>
      <!-- sf-comment 与 show-comment是相对应的 -->
      <div class="prize-title show-comment" :class="[
          isSystemQueryUser && 'show-auto-icon',
          $moduleConfig.isShowHeader && 'show-header',
        ]">
        <ul class="title-content">
          <li class="item">序号</li>
          <li class="item">奖品</li>
          <li class="item">中奖时间</li>
          <li class="item">发放状态</li>
          <li class="item">使用状态</li>
        </ul>
      </div>
      <ul class="prize-content show-comment" :class="[
          isSystemQueryUser && 'show-auto-icon',
          $moduleConfig.isShowHeader && 'show-header',
        ]">
        <li class="list-warp" v-for="(item, index) in prizeList" :key="index">
          <div class="item" v-if="showmanage">{{ index + 1 }}</div>
          <div class="item complete" v-else style="position: relative">
            <input type="checkbox" name="quesion" v-model="checked" :value="item.recordId"
              class="schedule_checkbox" v-if="!showmanage" :disabled="
                !item.allowSetFlag || (!!item.systemQuery && item.useFlag === 1)
              " />
            <label :for="item.recordId" :class="{
                disabled:
                  !item.allowSetFlag ||
                  (!!item.systemQuery && item.useFlag === 1),
              }">
            </label>{{ index + 1 }}
          </div>
          <div class="item">
            <p>{{ item.awardsName }}</p>
          </div>
          <div class="item" v-html="item.createTime.replace(/\-/, '<br>')"></div>
          <div class="item">
            <!-- 领取 -->
            <span v-if="item.receiveStatus === 1" class="main-class"
              @click="receivePrize(item)">领取</span>
            <!-- 审核中 -->
            <span v-if="item.receiveStatus === 2" @click="exchangeTips" class="audit">审核中<br /><em
                v-if="havePrivilege" @click.stop="showPopCat()">加速</em></span>
            <!-- 已发放 -->
            <span v-if="item.receiveStatus === 3 && !awardsType(item.awardsType)">已发放</span>
            <!-- 审核失败 -->
            <span v-if="item.receiveStatus === 5" class="error-class"
              @click="exchangeErrorTips">审核失败</span>
            <!-- 查询 -->
            <span v-if="item.receiveStatus === 3 && awardsType(item.awardsType)" class="main-class"
              @click="inquiryAwards(item)">查询</span>
          </div>
          <div class="item" v-if="item.useFlag == 1" style="color: rgba(139, 139, 140, 1)">
            已使用
            <img class="auto-icon" v-if="item.systemQuery && isSystemQueryUser"
              src="./img/auto-icon.png" alt="" @click.stop="showAutoIconDesc(index + 1)" />
          </div>
          <div class="item" v-else-if="item.useFlag == 2">
            未使用
            <img class="auto-icon" v-if="item.systemQuery && isSystemQueryUser"
              src="./img/auto-icon.png" alt="" @click.stop="showAutoIconDesc(index + 1)" />
          </div>
          <div class="item" v-else>
            <div class="unmarkusestate" @click="changestate(item)">-</div>
          </div>
        </li>
        <li class="list-bottom"></li>
      </ul>
      <div class="bottom" @click="showMore" :class="{ showcomplete: !showmanage }">
        <bottom-line :message="bottomMsg" />
      </div>
    </template>
    <template v-else>
      <no-list message="暂时没有奖品">
        <p class="to-blind" @click="toBlindBox">抽盲盒100%中奖，去试试>></p>
      </no-list>
    </template>
    <div class="schedule-footer" v-if="prizeList && prizeList.length && !showmanage">
      <div class="all-checked" @click="allchecked">
        <div class="circle" :class="{
            checked:
              checked.length &&
              checked.length ==
                prizeList.filter(
                  (item) =>
                    item.allowSetFlag && !(item.useFlag && item.systemQuery)
                ).length,
          }"></div>
        <span>全选</span>
      </div>
      <div class="btn">
        <div class="unuse" @click="updateUseFlag(2)">标为未使用</div>
        <div class="use" @click="updateUseFlag(1)">标为已使用</div>
      </div>
    </div>
    <!-- 领取实物奖品 -->
    <actual-item v-model="actualShow" :params="currentItem" :addressList="addressList"
      @on-click="getSuccess"></actual-item>
    <!-- 领取话费卡奖品 -->
    <call-item v-model="callShow" :params="currentItem" @on-click="getSuccess"></call-item>
    <!-- 酷彩吧彩金 -->
    <ku-caiBa @closePopKucaiBa="closePopKucaiBa" v-model="showKuCaiba" :params="currentItem">
    </ku-caiBa>
    <!-- 查询京东卡和话费卡奖品 -->
    <inquiry-jd-and-call v-model="JDAndCallShow" :params="currentItem"
      @updateUseFlagpop="updateUseFlagpop" @changestate="changestate"></inquiry-jd-and-call>
    <!-- 腾讯视频 -->
    <popQQ v-model="isPopQQ" :params="currentItem" @on-click="getSuccess"></popQQ>
    <!-- 实物的物流查询和 -->
    <Modal v-model="logisticsShow" :close-button-show="false" :title="logisticsTitle"
      @on-save="logisticsShow = false">
      <template>
        <div class="logistics-No">
          <span class="label">物流单号：</span>
          <span class="value">{{ logisticsNo }}</span>
        </div>
        <div class="logistics-name">
          <span class="label">承运公司：</span>
          <span class="value">{{ logisticsName }}</span>
        </div>
        <div class="logistics-explain">复制快递单号进行查询</div>
        <wf-button :long="true" slot="footer" class="copy" v-clipboard:copy="logisticsNo"
          v-clipboard:success="copyCode" v-clipboard:error="onError">复制
        </wf-button>
      </template>
    </Modal>
    <!-- 一些成功提示 -->
    <Modal v-model="promptShow" :close-button-show="false" :title="promptTitle"
      @on-save="promptShow = false">
      <template>
        <div class="prompt-warp" v-html="promptMessage"></div>
      </template>
    </Modal>
    <!-- 兑换审核中提示 -->
    <Modal v-model="showExchangeTips" :close-button-show="false" :type="2" :title="'温馨提示'"
      @on-save="showExchangeTips = false">
      <div class="exchange-tips">
        <p>
          奖品正在审核，预计1~3个工作日<br />
          内到账，请耐心等待~
        </p>
        <p @click="goKefu">
          如超时未到账，请及时联系 <a href="javascript:void(0);">在线客服</a>
        </p>
      </div>
    </Modal>
    <!-- 兑换失败提示 -->
    <Modal v-model="showExchangeErrorTips" :close-button-show="false" :type="2" :title="'温馨提示'"
      @on-save="showExchangeErrorTips = false">
      <div class="exchange-error-tips">
        <p>
          审核失败可能原因：<br />
          1.游戏中作弊行为；<br />
          2.一部手机切换登录,两个及以上账号；<br />
          3.使用模拟器/插件/外挂等工具；<br />
          4.恶意篡改设备数据,伪造用户进行游戏。
        </p>
        <p @click="goKefu" v-if="isCanNotPhotoChannel">
          如有异议，请及时联系<a>在线客服</a>
        </p>
        <p @click="goUploadID" v-else>如有异议，可进入<a>申诉通道</a></p>
      </div>
    </Modal>
    <!-- 加速权益 -->
    <Modal v-if="!haveFrozen && havePrivilege" v-model="showCatPop" :close-button-show="false"
      title="添加专属客服 为您催促审核" @on-close="closePopCat()">
      <div class="exchange-error-tips">
        <p class="exchange-wx-dec">专属客服微信号</p>
        <p class="exchange-wx">
          {{ weChatNo }}
        </p>
        <p class="exchange-dec wx">
          复制微信号至微信添加，验证信息填写游戏ID即可
        </p>
        <p class="exchange-dec wx mb6">已添加直接打开微信联系</p>
      </div>
      <wf-button :long="true" slot="footer" class="copy" v-clipboard:copy="weChatNo"
        v-clipboard:success="copyCode" v-clipboard:error="onError">复制微信号</wf-button>
    </Modal>
    <!-- 权益冻结 -->
    <Modal v-if="haveFrozen && havePrivilege" v-model="showCatPop" :close-button-show="false"
      title="权益被冻结" @on-close="closePopCat()" save-text="去招财猫解封权益">
      <div class="exchange-error-tips" style="text-align: center; line-height: 1.2rem">
        亲爱的玩家，您的招财猫生病了<br />
        此项招财猫权益已被冻结
      </div>
      <wf-button :long="true" slot="footer" @click="goCat()">去招财猫解封权益</wf-button>
    </Modal>
    <!-- 更新使用状态弹窗提示 -->
    <Modal v-model="showPop" :type="2" :title="'温馨提示'" :closeIcon2Show="true" closeText="标为未使用"
      saveText="标为已使用" @on-close="closePop" @on-save="updateUseFlag(1)">
      <div class="exchange-tips" style="text-align: center">
        <p>是否需要修改使用状态？</p>
      </div>
    </Modal>
    <!-- 自动查询图标 -->
    <Modal v-model="isShowAutoIconDesc" :close-button-show="false" confirm-button-text="知道了"
      :type="2" title="图标含义" @on-save="closeAutoIconDesc">
      <div class="auto-icon-content">
        <p>
          我们将为您在每天凌晨查询1次京东卡绑卡状态，标记
          <img src="./img/auto-icon.png" alt="" />表示为系统查询<br />
          1、仅限2020年7月1日后领取，且查询框中提供了卡号的京东卡<br />
          2、每天凌晨查1次
        </p>
      </div>
    </Modal>
  </div>
</template>
<script>
import { mapMutations, mapActions } from 'vuex'
import { getPrizeList, systemQueryUser, getPhoneBindInfo, saveAddress, getExclusiveCustomerServiceInfo, getPrivilege, updateUseFlag, getUser } from '@/services/user'
import { getAddressList } from '@/services/address'
import actualItem from './components/actualItem' // 领取实物奖品
import callItem from './components/callItem' // 领取话费卡
import popQQ from './components/popQQ' // 领取话费卡
import inquiryJdAndCall from './components/inquiryJdAndCall' // 京东卡和话费卡卡密
import kuCaiBa from './components/kuCaiBa' // 酷彩吧弹框
import { jumpUrl } from '@/utils/utils'
import sfComment from './components/sfComment'
import _get from 'lodash.get'
export default {
  name: 'myPrize',
  components: {
    actualItem,
    callItem,
    inquiryJdAndCall,
    popQQ,
    sfComment,
    kuCaiBa
  },
  data () {
    return {
      userInfo: {},
      prizeList: [],
      bindPhoneNumber: '',
      // 领取实物领取实物
      actualShow: false,
      // 领取话费卡
      callShow: false,
      // 京东卡和话费卡领取查询
      JDAndCallShow: false,
      showKuCaiba: false,
      currentItem: {},
      promptMessage: '',
      promptTitle: '',
      isPopQQ: false,
      promptShow: false,
      pageNumber: 1,
      isEnd: false,
      // 审核中失败提示
      showExchangeTips: false,
      // 审核中提示
      showExchangeErrorTips: false,
      // 是否有权益
      havePrivilege: false,
      // 是否被冻结
      haveFrozen: false,
      // 是否弹出招财猫的权益弹窗
      showCatPop: false,
      weChatNo: '',
      showmanage: true,//展示管理按钮
      checked: [],//选中的奖品ID的集合
      currentSeItemId: 0,//选中的奖品
      showPop: false,//更新使用状态弹窗
      customize: true,
      addressList: [], // 收货地址列表
      logisticsShow: false, // 物流信息是否展示
      logisticsTitle: '物流详情',
      isShowAutoIconDesc: false,
      isShowAutoIconDescGuide: false,
      countdownTime: 0,
      guideTimer: null,
      isSystemQueryUser: false
    }
  },
  computed: {
    bottomMsg () {
      return this.isEnd ? '不要再拉了，我是有底线的' : '点击查看更多'
    },
    airListShow () {
      return this.prizeList && this.prizeList.length > 0 ? true : false
    },
    isCanNotPhotoChannel () {
      let canNotPhotoChannel = ['100001', '100006', '100030', '100045', '100068', '100069', '100070', '100076', '100056']
      return canNotPhotoChannel.indexOf(localStorage.getItem('APP_CHANNEL')) > -1
    },
    logisticsNo () {
      if (this.promptMessage) {
        return this.promptMessage.split(/；|;/g)[1]
      }
      return ''
    },
    logisticsName () {
      if (this.promptMessage) {
        return this.promptMessage.split(/；|;/g)[0]
      }
      return ''
    }
  },
  mounted () {
    // 监听滚动事件
    window.addEventListener('scroll', this.handleScroll)
    this.systemQueryUser()
    this.pageInit()
    this.getPrivilege()
    this._getUser()
  },
  destroyed () {
    window.removeEventListener('scroll', this.handleScroll)
    clearInterval(this.guideTimer)
  },
  methods: {
    ...mapActions(['GET_MYPRIZE_REDDOT']),
    ...mapMutations(['SET_MYPRIZE_REDDOT']),
    /**
     * @description 页面初始化 奖品列表
     * @returns awardsType 3 <话费>
     * @returns awardsType 4 <京东卡>
     * @returns awardsType 9 <实物>
     * @returns awardsType 15 <PPTV优惠劵>
     * @returns awardsType 16 <苏宁卡>
     * @returns awardsType 17 <腾讯视频>
     * @returns awardsType 18 <芒果视频>
     * @returns awardsType 33 <移动话费卡密>
     * @returns awardsType 34 <联通话费卡密>
     * @returns awardsType 35 <电信话费卡密>
     * @returns awardsType 36 <优酷视频>
     * @returns awardsType 37 <爱奇艺视频>
     * @returns awardsType 44 <猫眼电影通兑券>
     * @returns awardsType 47 <人人勋章>
     * @returns awardsType 50 <酷彩吧>
     */
    async systemQueryUser () {
      const { code, data } = await systemQueryUser()
      if (code === 200) {
        this.isSystemQueryUser = !!data
        if (this.isSystemQueryUser) {
          this.isShowAutoIconDescGuide = !localStorage.getItem('isShowAutoIconDescGuide')
          if (this.isShowAutoIconDescGuide) {
            this.countdown(3)
            this.$marchSetsPoint("A_H5PT0020004389")// H5平台-领奖-奖品列表页-新手引导
          }
        }
      }
    },
    async pageInit () {
      if (this.pageNumber === 1) {
        // this.$marchSetsPoint('P_H5PT0073')
      }
      const { code, data } = await getPrizeList(this.pageNumber)

      if (code === 200) {
        if (data && data.length) {
          this.pageNumber === 1 ? this.prizeList = data : this.prizeList = [...this.prizeList, ...data]
          /**判断是否需要红点**/
          let unclaimed = data.filter(item => {
            return item.receiveStatus === 1
          }).length
          if (unclaimed) {
            this.SET_MYPRIZE_REDDOT(unclaimed)
          }
        } else {
          this.isEnd = true
        }

      }
    },
    // 奖项状态
    awardsType (type) {
      let typeArray = [4, 18, 17, 16, 15, 9, 33, 34, 35, 36, 37, 44, 47, 50]
      if (typeArray.indexOf(type) != -1) {
        return true
      } else {
        return false
      }
    },
    // 领取奖品
    async receivePrize (item) {
      if (item.authStatus === 0) {
        this.$router.push({
          name: 'authentication'
        })
      } else {
        const { awardsType, awardsName, recordId } = item
        this.currentItem = Object.assign({}, item, this.userInfo)
        switch (awardsType) {
          case 4: // 京东卡 话费卡 卡号卡密
          case 33:
          case 34:
          case 35:
          case 36:
          case 37:
          case 44:
          case 47:
            this.getJDFragment(item)
            break
          case 17:
            this.isPopQQ = true
            break
          case 9: // 实物
            this._getAddressList()
            break
          case 11:
          case 3:
            this.callShow = true
            break
          default:
            break
          // }
        }
      }
    },
    // 查询奖品
    inquiryAwards (item) {
      const { awardsType, receiveRemark } = item
      if ([17, 33, 34, 35, 36, 37, 44].indexOf(awardsType) > -1) {
        // 话费卡卡密
        item.type = 'call'
        this.JDAndCallShow = true
      } else if (awardsType === 9) {
        // 物流信息查询
        this.logisticsShow = true
        this.promptMessage = receiveRemark
      } else if (awardsType === 4) {
        const receiveRemarkLength = receiveRemark.split('，').length > 1
        if (receiveRemarkLength) {
          item.type = 'call'
        } else {
          item.type = 'jd'
        }
        this.JDAndCallShow = true
      }
      else if (awardsType == 47) {
        item.type = 'renren'
        this.JDAndCallShow = true
      }
      else if (awardsType == 50) {
        this.showKuCaiba = true
      }
      this.currentItem = item
    },
    // 领取京东卡
    async getJDFragment (item) {
      const { recordId } = item
      const { code, data, message } = await saveAddress({ recordId })
      if (code === 200 && data.isSuccess) {
        this.getSuccess(recordId)
      }
      else if (code == 104) {
        this.$Toast(message)
      }
      else {
        this.$Toast('领取失败')
      }
    },
    // 领取成功后的回调
    getSuccess (recordId) {
      this.prizeList.forEach(item => {
        if (recordId === item['recordId']) {
          this.$set(item, 'receiveStatus', 2)
        }
      })
      this.promptShow = true
      this.promptMessage = '个人信息提交成功<br />审核无误后，奖品48小时内发放'
      this.promptTitle = '提交成功'
      /** 获取我的奖品红点 **/
      this.GET_MYPRIZE_REDDOT()
    },
    showMore () {
      if (!this.isEnd) {
        this.pageNumber++
        this.pageInit()
      }
    },
    // 获取地址列表
    _getAddressList () {
      getAddressList().then(res => {
        let { code, data, message } = _get(res, 'data')
        if (code == 200) {
          this.addressList = _get(res, 'data.data', [])
          this.actualShow = true
        }
      })
    },
    // 获取用户默认手机号
    _getUser () {
      getUser().then(res => {
        let { code, data } = res
        if (code == 200) {
          this.userInfo = data
        }
      })
    },
    handleScroll () {
      let st = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop
      let ch = document.documentElement.clientHeight
      let sh = document.documentElement.scrollHeight
      let end = st + ch == sh ? true : false
      if (end && !this.isEnd) {
        this.pageNumber++
        this.pageInit()
      }
    },
    // 页面返回按钮
    returnPage () {
      this.$marchSetsPoint('A_H5PT0073000669')
      if (this.customize) {
        this.$router.push({ name: 'mall' })
      }
    },
    // 审核中提示
    exchangeTips () {
      this.showExchangeTips = true
    },
    // 审核中失败提示
    exchangeErrorTips () {
      this.showExchangeErrorTips = true
    },
    goKefu () {
      this.$router.push({ name: 'customerService' })
    },
    async getPrivilege () {
      try {
        const { code, data, message } = await getPrivilege({ privilegeType: 12 })
        if (code === 200) {
          this.havePrivilege = data.havePrivilege
          this.haveFrozen = data.haveFrozen
          if (data.havePrivilege) {
            this.getWxInfo()
            this.$marchSetsPoint('A_H5PT0028001754') // H5平台-我的奖品-加速按钮展示
          }
        }
      } catch (error) {

      }
    },
    async getWxInfo () {
      const { code, data } = await getExclusiveCustomerServiceInfo()
      if (code === 200) {
        this.weChatNo = data.weChatNo
      }
    },
    toBlindBox () {
      this.$marchSetsPoint('A_H5PT0225003041')
      location.href = 'https://wap.beeplaying.com/activities/blindBox.html#/'
    },
    copyCode (e) {
      this.showCatPop = false
      let isPoint = e.trigger.classList[0] === 'copyWechat'
      isPoint && this.$marchSetsPoint('A_H5PT0028001757') // H5平台-我的奖品-联系客服提醒弹窗-复制微信号点击
      this.$Toast('复制成功')
    },
    onError (e) {
      this.showCatPop = false
      let isPoint = e.trigger.classList[0] === 'copyWechat'
      isPoint && this.$marchSetsPoint('A_H5PT0028001757') // H5平台-我的奖品-联系客服提醒弹窗-复制微信号点击
      this.$Toast('当前浏览器不支持此功能，请手动复制。')
    },
    showPopCat () {
      this.$marchSetsPoint('A_H5PT0028001755') // H5平台-我的奖品-加速按钮点击
      this.showCatPop = true
    },
    closePopCat () {
      this.$marchSetsPoint('A_H5PT0028001758') // H5平台-我的奖品-联系客服提醒弹窗-关闭点击
    },
    goCat () {
      this.showCatPop = false
      jumpUrl({ url: '/petcat/' }, null, '&catright=1')
    },
    allchecked () {//点击全选
      let data = this.prizeList.filter(item => item.allowSetFlag && !(item.useFlag && item.systemQuery))
      if (this.checked.length == data.length) {
        this.checked = []
      } else {
        this.checked = data.map(item => item.recordId)
      }
    },
    changestate (item) {
      if (item.allowSetFlag && !(item.useFlag && item.systemQuery)) {
        this.currentSeItemId = item.recordId
        this.showPop = true
      }
    },
    closePopKucaiBa () {
      this.showKuCaiba = false
    },
    async updateUseFlag (useFlag) {
      if (this.currentSeItemId || this.checked.length) {
        let { code, message } = await updateUseFlag({
          useFlag: useFlag,
          recordIds: this.currentSeItemId ? [this.currentSeItemId] : this.checked
        })
        if (code == 200) {
          this.$Toast('修改成功！')
          this.currentSeItemId = 0
          this.showPop = false
          this.JDAndCallShow = false
          this.pageNumber = 1
          this.isEnd = false
          this.pageInit()
        } else {
          this.$Toast(message)
        }
      }
    },
    updateUseFlagpop (item) {
      this.currentSeItemId = item.recordId
      this.updateUseFlag(1)
    },
    closePop (type) {
      if (type) {
        this.updateUseFlag(2)
      }
      this.showPop = false
      this.JDAndCallShow = false
    },
    goUploadID () {
      this.$router.push({ name: 'sfeedback' })
    },
    showAutoIconDesc (index) {
      this.isShowAutoIconDesc = true
      if (index) {
        this.$marchSetsPoint("A_H5PT0020004388")// H5平台-领奖-奖品列表页-自动图标点击
      } else {
        this.$marchSetsPoint("A_H5PT0020004387")// H5平台-领奖-系统查询点击
      }
    },
    closeAutoIconDesc () {
      this.isShowAutoIconDesc = false
      this.$marchSetsPoint("A_H5PT0020004390")// H5平台-领奖-奖品列表页-图标说明弹窗-知道了点击
    },
    closeGuide () {
      this.isShowAutoIconDescGuide = false
      localStorage.setItem('isShowAutoIconDescGuide', true)
    },
    countdown (date) {
      this.countdownTime = date
      this.guideTimer = setInterval(() => {
        date = date - 1
        if (date <= 0) {
          date = 0
          clearInterval(this.guideTimer)
        }
        this.countdownTime = date
      }, 1000)
    },
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      vm.customize = from.name == 'sfeedback'
    })
  }
}
</script>
<style lang="less" scoped>
* {
  box-sizing: border-box;
}
p.to-blind {
  color: #d0ab40;
  font-size: 28px;
  font-weight: bold;
}
.prize-warp {
  min-height: 100vh;
  background: #f7f7f7;
  .title-btn-wrapper {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: 85px;
    background-color: #f7f7f7;
    z-index: 10;
  }
  .auto-check {
    position: absolute;
    top: 30px;
    display: flex;
    font-size: 24px;
    font-weight: 500;
    line-height: 36px;
    color: #bbb;
    background-color: #f7f7f7;
    z-index: 10;
    img {
      width: 30px;
      height: 30px;
      margin-left: 24px;
    }
    span {
      color: #ff7800;
      text-decoration: underline;
      margin: 0 6px;
    }
    &.has-header {
      position: fixed;
      top: 100px;
      left: 0;
      right: 0;
      height: 58px;
    }
  }
  .managetitle {
    position: fixed;
    right: 50px;
    top: 30px;
    z-index: 10;
    font-size: 24px;
    font-weight: 500;
    line-height: 36px;
    color: rgba(255, 120, 0, 1);
  }
  .schedule_checkbox {
    position: relative;
    width: 30px;
    height: 30px;
    opacity: 0;
    z-index: 1;
    margin-right: 20px;
    & + label {
      position: absolute;
      left: 10px;
      width: 30px;
      height: 30px;
      border: 2px solid rgba(187, 187, 187, 1);
      border-radius: 50%;
      top: 0;
      bottom: 0;
      margin: auto;
      &.disabled {
        background: rgba(204, 204, 204, 1);
      }
    }
    &:checked + label {
      &:before {
        content: '';
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        margin: auto;
        width: 20px;
        height: 20px;
        background: rgba(255, 65, 65, 1);
        border-radius: 50%;
      }
    }
  }
  .schedule-footer {
    height: 90px;
    background: rgba(255, 255, 255, 1);
    width: 100%;
    position: fixed;
    left: 0;
    bottom: 0;
    z-index: 10;
    box-sizing: border-box;
    padding: 0 0 0 30px;
    display: flex;
    align-items: center;
    .all-checked {
      width: 90px;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      font-size: 24px;
      color: rgba(136, 136, 136, 1);
      .circle {
        width: 30px;
        height: 30px;
        border: 1px solid rgba(112, 112, 112, 1);
        border-radius: 50%;
        position: relative;
        &.checked {
          &:before {
            content: '';
            position: absolute;
            left: 0;
            right: 0;
            top: 0;
            bottom: 0;
            margin: auto;
            width: 20px;
            height: 20px;
            background: rgba(238, 111, 11, 1);
            border-radius: 50%;
          }
        }
      }
    }
    justify-content: space-between;
    .btn {
      display: flex;
      justify-content: space-between;
      text-align: center;
      line-height: 90px;
      font-size: 24px;
      font-weight: 500;
      color: rgba(255, 255, 255, 1);
      .unuse {
        width: 200px;
        background: rgba(238, 111, 11, 1);
      }
      .use {
        width: 200px;
        background: rgba(255, 60, 60, 1);
      }
    }
  }
}
.prize-title {
  top: 85px;
  &.show-header {
    top: 100px;
  }
  &.show-auto-icon&.show-header {
    top: 158px;
  }
  &.show-comment {
    top: 175px;
    &.show-header {
      top: 190px;
    }
    &.show-auto-icon&.show-header {
      top: 248px;
    }
  }
  left: 0;
  width: 100%;
  padding: 0 24px 0;
  position: fixed;
  background-color: #f7f7f7;
  z-index: 10;
  .title-content {
    height: 50px;
    background-color: #fffad4;
    border-radius: 16px 16px 0px 0px;
    width: 100%;
    display: flex;
    line-height: 50px;
    text-align: center;
  }
  .item {
    flex: 1;
    font-size: 24px;
    color: #000;
  }
}
.prize-content {
  padding: 135px 24px 24px 24px;
  &.show-header {
    padding: 150px 24px 24px 24px;
  }
  &.show-auto-icon&.show-header {
    padding: 208px 24px 24px 24px;
  }
  &.show-comment {
    padding: 225px 24px 24px 24px;
    &.show-header {
      padding: 240px 24px 24px 24px;
    }
    &.show-auto-icon&.show-header {
      padding: 298px 24px 24px 24px;
    }
  }
  .list-warp {
    width: 100%;
    display: flex;
    height: 90px;
    /*line-height: 90px;*/
    text-align: center;
    font-size: 24px;
    color: #000000;
    .item {
      flex: 1;
      min-width: 0;
      padding: 0 5px;
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      position: relative;
      &:not(.complete) {
        justify-content: center;
      }
      p {
        max-height: 70%;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
      }
      .unmarkusestate {
        width: 80px;
        height: 42px;
        background: rgba(240, 240, 240, 1);
        border-radius: 16px;
        margin: auto;
        line-height: 42px;
        color: rgba(255, 65, 65, 1);
      }
      .auto-icon {
        position: absolute;
        width: 20px;
        height: 20px;
        right: 21px;
        top: 24px;
      }
    }
    &:nth-child(n) {
      background-color: #fff;
    }
    &:nth-child(2n) {
      background-color: #fffdef;
    }
    .main-class {
      color: #ff9a3b;
    }
    .error-class {
      color: #e8382b;
    }
    .audit {
      color: #3f8cff;
      position: relative;
      em {
        height: 30px;
        line-height: 30px;
        box-sizing: border-box;
        width: 48px;
        white-space: nowrap;
        background: #ffbc00;
        color: #fff;
        font-size: 20px;
        font-weight: 500;
        border-radius: 10px;
        text-align: center;
      }
    }
    .exchangeTips {
      color: #5186ca;
    }
  }
  .list-bottom {
    height: 20px;
    background-color: #fffad4;
    border-radius: 0px 0px 6px 6px;
    width: 100%;
  }
}
.bottom {
  padding-bottom: 30px;
  &.showcomplete {
    padding-bottom: 120px;
  }
}
.prompt-warp {
  padding: 30px;
  text-align: center;
  font-size: 30px;
  line-height: 45px;
}
.exchange-tips,
.exchange-error-tips {
  font-size: 24px;
  color: #888888;
  p {
    line-height: 50px;
    &:last-child {
      font-size: 24px;
      color: #888888;
      a {
        color: #5186ca;
        text-decoration: underline;
      }
    }
  }
  .exchange-wx-dec,
  .exchange-wx {
    font-size: 24px;
    color: #000;
  }
  .exchange-wx {
    background: #f7f7f7;
    height: 70px;
    line-height: 70px;
    border-radius: 16px;
    padding: 0 20px;
    margin-top: 10px;
    margin-bottom: 20px;
  }
  .exchange-dec {
    font-size: 20px;
    color: #bbbbbb !important;
    line-height: 30px;
    &.wx {
      position: relative;
      padding-left: 16px;
      &::before {
        content: '*';
        position: absolute;
        left: 0;
      }
    }
  }
  .mb6 {
    margin-bottom: 6px;
  }
}
.logistics-No {
  margin: 20px 0 15px;
  font-size: 24px;
  color: #000;
}
.logistics-name {
  margin-bottom: 20px;
  font-size: 24px;
  color: #000;
}
.logistics-explain {
  font-size: 20px;
  color: #bbbbbb;
  text-align: center;
}
.copy {
  height: 70px;
  width: 100%;
  line-height: 72px;
  font-size: 24px;
  color: #fff;
  background: #ff4141;
  border-radius: 16px;
}
.auto-icon-content {
  font-size: 24px;
  color: #888;
  line-height: 36px;
  img {
    width: 30px;
    height: 30px;
    vertical-align: text-top;
  }
}
.auto-icon-desc-guide {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 10;
  .desc-guide-bg {
    max-width: 100%;
    position: fixed;
    top: 0;
    left: 0;
    box-shadow: 0 0 0 1000px rgba(0, 0, 0, 0.6);
  }
  .btn.cancel {
    color: #bbb;
  }
}
</style>



