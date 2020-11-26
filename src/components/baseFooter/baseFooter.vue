<template>
  <footer class="footer-warp" v-if="$moduleConfig.basefooter">
    <div class="item" v-for="(item, index) in footerList" :key="index" @click="changeRouter(item)"
      :class="{sf:!item.routerName,'long-icon':isShowNewUserMenu&&item.routerName === 'task'}">
      <template v-if="isShowNewUserMenu&&item.routerName === 'task'">
        <img src="./image/new_user_task_icon.png" alt="" />
        <div class="name" v-if="item.countDown">{{countdownTime}}</div>
        <div class="name" v-else>{{ item.name||'新人红包' }}</div>
        <div class="task-tag new-user" v-if="item.countDown&&isShowNewUserTaskTips">
          <div class="text-content">
            即将过期
          </div>
        </div>
        <div class="task-tag" v-else-if="isShowTaskTips" :class="{taskawards:redDot.taskawards}">
          <div class="text-content">
          </div>
        </div>
      </template>
      <template v-else-if="item.routerName">
        <img :src="routerName == item.routerName ? item.activeBg : item.defaultBg" alt="" />
        <div class="name">{{ item.name }}</div>
        <div class="task-tag" v-if="item.routerName === 'task' && isShowTaskTips"
          :class="{taskawards:redDot.taskawards}">
          <div class="text-content">
          </div>
        </div>
        <!-- 当‘我的’tips发生变化的时候修改isShowTip里的内容，还需要去my.vue的mounted里面修改内容  -->
        <div class="pnl_tip" v-if="item.routerName === 'my' && isShowTip('my_find')">
          发现挪至此
        </div>
        <div class="pnl_tip"
          v-if="item.routerName === 'mall' && channel=='100085' && isShowTip('mall')">
          无门槛彩金
        </div>
        <div class="pnl_tip"
          v-if="routerName != item.routerName&&item.routerName === 'find'&&findBagCanReceive">
          有福袋可领
        </div>
        <i class="dot" v-if="item.redDot||(item.routerName === 'my'&&routerName !== item.routerName&&getEcRedDot&&getEcRedDot.showEcRedDot)"></i>
      </template>
      <template v-else>
        <div class="activity-entry" v-if="isShowActivityEntrance" @click.stop="goActivity">
          <img :src="activityInfo.cdnImage | filter" alt="">
        </div>
        <div class="sf_tag"
          v-if="activityInfo.tagContent && isShowTip(`activity_${activityInfo.tagId}`)"
          v-html="activityInfo.tagContent">
        </div>
        <div class="sf_gif" v-if="isShowCatEntrance"></div>
        <div class="sf_tag" v-if="catVipTips">
          {{catVipTips}}
        </div>
      </template>
    </div>
  </footer>
</template>
<script>
import { mapState, mapMutations,mapActions} from 'vuex'
import indexServices from '@/services/index'
import findService from '@/services/find'
export default {
  name: 'baseFooter',
  data () {
    return {
      footerList: [
        {
          name: '游戏',
          routerName: 'index',
          defaultBg: require('./image/game_default.png'),
          activeBg: require('./image/game_active.png')
        },
        {
          name: '',
          routerName: 'task',
          defaultBg: '',
          activeBg: ''
        },
        {
          name: '领奖',
          routerName: 'mall',
          defaultBg: require('./image/shop_default.png'),
          activeBg: require('./image/shop_active.png')
        },
        {
          name: '我的',
          routerName: 'my',
          defaultBg: require('./image/my_default.png'),
          activeBg: require('./image/my_active.png')
        }
      ],
      isShowTaskTips: false,
      /** 是否显示 活动入口 **/
      isShowActivityEntrance: false,
      /** 活动入口数据 **/
      activityInfo: {},
      /** 是否显示 猫vip入口 **/
      isShowCatEntrance: false,
      isShowSFTips: false,
      catVipTips: '',
      timer: '',
      countdownTime: '',
      isShowNewUserMenu: false,
      isShowNewUserTaskTips: false,
    }
  },
  computed: {
    ...mapState(['redDot', 'findBagCanReceive','getEcRedDot']),
    userInfo () {
      let info = JSON.parse(localStorage.getItem('user_Info'))
      return info
    },
    channel () {
      return localStorage['APP_CHANNEL']
    },
    routerName () {
      return this.$route.name
    },
  },
  methods: {
    ...mapMutations({
      _setFindBagCanReceive: 'SET_FINDBAGCANRECEIVE'//设置福袋可领取状态
    }),
    ...mapActions({
      _getEcRedDot:'GET_EC_REDDOT'//个人中心专属客服红点、副标题
    }),
    showNewUserMenu () {
      let info = JSON.parse(localStorage.getItem('showNewUserMenu'))
      this.isShowNewUserMenu = info && info.isShowIcon === true || this.footerList[1].name === '新人红包'
      this.isShowNewUserTaskTips = info && info.isShowTips
    },
    isShowTip (name) {
      return !localStorage['isHideTip_' + name]
    },
    async changeRouter (item) {
      if (this.isShowNewUserTaskTips && item.countDown) {
        localStorage.setItem('showNewUserMenu', JSON.stringify({ isShowIcon: true, isShowTips: false }))
        this.showNewUserMenu()
      }
      if (item.routerName) {
        switch (item.routerName) {
          case 'index':
            this.$marchSetsPoint('S_00000000000003') // H5平台-首页按钮
            break
          case 'my':
            this.$marchSetsPoint('S_00000000000005') // H5平台-我的点击
            break
          case 'mall':
            this.$marchSetsPoint('S_00000000000004') // H5平台-领奖点击
            break
          case 'find':
            this.$marchSetsPoint('S_00000000000035') // H5平台-发现点击
            break
        }
        this.tipsInit()
        this.$emit('on-change', item.routerName)
        this.$router.push({ name: item.routerName })
      } else {//塞个春节聚合页 后期可删
        this.$marchSetsPoint('A_H5PT0019002742')//H5平台-首页-活动聚合页ICON点击
        location.replace(`//wap.beeplaying.com/activities/catvip.html?vt=${new Date().getTime()}`)
      }
    },
    /** 气泡初始化 **/
    tipsInit () {
      /** 今天12点时间搓 **/
      let resetTime = new Date(new Date().toLocaleDateString()).getTime()
      /** 查看储存状态 **/
      let tipsData = JSON.parse(localStorage.getItem('taskTips'))
      /** 本地没有缓存或者本地缓存时间搓不对，重新记录数据 **/
      if (!tipsData || tipsData.resetTime !== resetTime) {
        localStorage.setItem('taskTips', JSON.stringify({ resetTime, show: false }))
      }
      if (this.redDot.taskawards) {
        this.isShowTaskTips = true
      } else {
        /** 如果当前路由是task, 重新记录数据 **/
        if (this.$route.name === 'task') {
          this.isShowTaskTips = false
          localStorage.setItem('taskTips', JSON.stringify({ resetTime, show: true }))
        } else {
          /** 重新查看储存状态 **/
          let tipsData = JSON.parse(localStorage.getItem('taskTips'))
          if (tipsData && tipsData.show === false) {
            this.isShowTaskTips = true
          } else {
            this.isShowTaskTips = false
          }
        }
      }
    },
    //  活动推广入口
    async ActivityEntry () {
      try {
        let { code, data } = (await indexServices.getActivityEntry()).data
        this.isShowActivityEntrance = code == 200 && data.length > 0
        if (this.isShowActivityEntrance) {
          this.$marchSetsPoint('A_H5PT0019002741')
          this.activityInfo = data && data[0] || {}
          this.getSFTipsState()
        } else {
          /** 活动入口开启, 关闭猫入口 **/
          this.catVipInit()
        }
      } catch (e) {

      }
    },
    /** 活动推广入口气泡 **/
    async getSFTipsState () {
      try {
        let { code, data } = (await indexServices.getSFTipsState()).data
        if (code && code === 200) {
          this.activityInfo.tagContent = data.content
          this.activityInfo.tagId = data.id
        }
      } catch (e) {
      }
      this.footerList.splice(2, 0, {
        name: '',
        routerName: '',
        defaultBg: '',
        activeBg: '',
      })
    },
    /** 活动推广入口点击 **/
    goActivity () {
      localStorage[`isHideTip_activity_${this.activityInfo.tagId}`] = 1 //隐藏tip的显示
      window.location.href = this.activityInfo.url
    },
    async catVipInit () {
      try {
        let { code, data } = (await indexServices.getCatVipEntranceState()).data
        this.isShowCatEntrance = code == 200 && data.show
        this.catVipTips = code == 200 && data.message
        if (this.isShowCatEntrance) {//A_H5PT0019002741-春节聚合
          this.$marchSetsPoint('A_H5PT0019002975')//猫VIP
          this.footerList.splice(2, 0, {
            name: '',
            routerName: '',
            defaultBg: '',
            activeBg: '',
          })
        }
      } catch (e) {

      }
    },
    async newUserMenu () {
      try {
        let TIMES_7_DAY = 604800000
        let isNew = (Date.now() - this.userInfo.createTime < TIMES_7_DAY)
        if (isNew) {
          const res = await indexServices.newUserMenu()
          let { code, data } = res.data
          if (code === 200 && data.showMenu) {
            if (!localStorage.getItem('showNewUserMenu')) {
              localStorage.setItem('showNewUserMenu', JSON.stringify({ isShowIcon: true, isShowTips: true }))
            }
            this.showNewUserMenu()
            this.footerList.splice(1, 1, {
              name: '新人红包',
              routerName: 'task',
              defaultBg: require('./image/new_user_task_icon.png'),
              activeBg: require('./image/new_user_task_icon.png'),
              countDown: data.countDown
            })
            this.countDown(data.countDown)
            return
          }
        }
        localStorage.removeItem('showNewUserMenu')
        this.showNewUserMenu()
        this.footerList.splice(1, 1, {
          name: '任务',
          routerName: 'task',
          defaultBg: require('./image/task_default.png'),
          activeBg: require('./image/task_active.png')
        })
      } catch (e) {
        localStorage.removeItem('showNewUserMenu')
        this.showNewUserMenu()
        this.footerList.splice(1, 1, {
          name: '任务',
          routerName: 'task',
          defaultBg: require('./image/task_default.png'),
          activeBg: require('./image/task_active.png')
        })
      }
    },
    countDown (data) {
      if (!data || data / 86400000 > 1) {
        this.countdownTime = '新人红包'
        return
      }
      let date = data / 1000
      let fun = () => {
        date = date - 1
        if (date <= 0) {
          clearTimeout(this.timer)
          date = 0
          this.countdownTime = '新人红包'
          return
        }
        let hour = Math.floor(parseInt(date / 60 / 60) % 24)
        let minute = Math.floor(parseInt(date / 60) % 60)
        let second = Math.floor(date % 60)
        let countHour = hour >= 10 ? hour : '0' + hour
        let countMinute = minute >= 10 ? minute : '0' + minute
        let countSecond = second >= 10 ? second : '0' + second
        this.countdownTime = `${countHour}:${countMinute}:${countSecond}`
        clearTimeout(this.timer)
        this.timer = setTimeout(fun, 1000)
      }
      fun()
    },
    setFooterList () {

    }
  },
  created () {
    this.newUserMenu()
  },
  mounted () {
    this._getEcRedDot()//专属客服增强曝光 展腾飞
    this._setFindBagCanReceive(false)
    this.tipsInit()
    this.ActivityEntry()
  },
  watch: {
    'redDot.taskawards' () {
      this.tipsInit()
    }
  },
  destroyed () {
    clearTimeout(this.timer)
  }
}
</script>
<style lang="less" scoped>
* {
  box-sizing: border-box;
}
.footer-warp {
  position: fixed;
  bottom: 0;
  height: 100px;
  width: 100%;
  background-color: #ffffff;
  left: 0;
  border-top: 0.02rem solid #e6e6e6;
  display: flex;
  color: #666666;
  z-index: 10;
  .item {
    flex: 1;
    text-align: center;
    padding: 6px 0 12px 0;
    font-size: 0;
    position: relative;
    .name {
      font-size: 18px;
      line-height: 32px;
    }
    img {
      width: 54px;
    }
    .dot {
      position: absolute;
      right: 40px;
      top: 15px;
      width: 16px;
      height: 16px;
      border-radius: 50%;
      background: #ff0000;
    }
    &.sf {
      height: 110px;
      position: relative;
      left: 0;
      right: 0;
      margin: auto;
      background: rgba(255, 255, 255, 1);
      border-radius: 50%;
      z-index: 10;
      &:before {
        content: '';
        position: absolute;
        left: 7px;
        right: 7px;
        top: -35px;
        height: 130px;
        background: #fff;
        border-radius: 50%;
      }
      &:after {
        content: '';
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        height: 110px;
        background: #fff;
      }
      .sf_bg {
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        margin: auto;
        width: 100px;
        height: 100px;
        background: url('./image/springfestival/round.png');
        background-size: 100% 100%;
        z-index: 1;
      }
      .sf_gif {
        content: '';
        position: absolute;
        top: -20px;
        left: 0;
        right: 0;
        margin: auto;
        width: 100 * 6/7px;
        height: 120px;
        /*background: url("./image/springfestival/gif.gif");*/
        background: url('./image/catvip/gif.gif');
        background-size: 100% 100%;
        z-index: 2;
      }
      .activity-entry {
        content: '';
        position: absolute;
        top: -24px;
        left: 0;
        right: 0;
        margin: auto;
        width: 100px;
        height: 120px;
        background-size: 100% 100%;
        z-index: 2;
        img {
          vertical-align: top;
          width: 100%;
          height: 100%;
        }
      }
      .sf_tag {
        width: 130px;
        height: 71px;
        background: url('./image/springfestival/tips_bg.png');
        background-size: 100% 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        position: absolute;
        left: 0;
        right: 0;
        margin: auto;
        top: -100px;
        z-index: 10;
        padding-bottom: 10px;
        box-sizing: border-box;
        animation: toggleTip 1s infinite ease-in-out;
        font-size: 20px;
        font-weight: 500;
        color: rgba(255, 255, 255, 1);
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }
    &.long-icon {
      margin-top: -15px;
      .name {
        color: #ff4141;
      }
      img {
        width: 60px;
      }
    }
    .pnl_tip {
      position: absolute;
      top: -60px;
      left: 50%;
      transform: translateX(-50%);
      background: url('./image/bg_tip.png');
      background-size: 100% 100%;
      width: 130px;
      height: 71px;
      color: #fff;
      font-size: 20px;
      padding-bottom: 0.4rem;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
  .task-tag {
    position: absolute;
    top: -60px;
    left: 50%;
    width: 190px;
    height: 71px;
    transform: translateX(-50%);
    z-index: 100;
    background: url('./image/dotaskgaingift.png');
    background-size: 100% 100%;
    font-size: 24px;
    .text-content {
      height: 65px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    img {
      width: 34px;
      height: 27px;
      margin-bottom: 0;
      margin-right: 5px;
    }
    &.taskawards {
      width: 150px;
      background: url('./image/cangaingift.png');
      background-size: 100% 100%;
    }
    &.returnawards {
      width: 120px;
      background: url('./image/returnbagtips.png');
      background-size: 100% 100%;
    }
    &.new-user {
      top: -57px;
      width: 130px;
      background: url('./image/new_user_tips.png');
      background-size: 100% 100%;
      .text-content {
        font-size: 20px;
        color: #fff;
        height: 54px;
        line-height: 54px;
      }
    }
  }
}
@keyframes toggleTip {
  0% {
    top: -105px;
  }

  50% {
    top: -100px;
  }

  100% {
    top: -105px;
  }
}
</style>
