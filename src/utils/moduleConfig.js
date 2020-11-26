/*
*  配置文件控制 不同渠道不同  ui 展示方案
*  @ plantVersion  平台版本
*  @ operations   首页金刚位置
*  @ activityEntry  首页悬浮活动中心
*  @ basefooter  公共底部
*  @ baseHeader  公共头部
*  @ versionClass 不同版本ClassName
*  @ themes 当前的主题
*  @ achievement 任务大厅图标
*  @
*  @
*  @
*/


import { getUrlParams, jumpUrl } from './utils'
import profitServices from '@/services/profit'
import _get from 'lodash.get'

class ModuleConfig {
  themes = {
    //主题的单个参数，如果没有就不要配
    'christmas': {
      flowerDown: require('../assets/images/themes/chistmas/flowerDown/flower.gif'),
      flowerDownTimeout: 5800,
      my: {
        bgColor: 'none',
        bgImg: require('../assets/images/themes/chistmas/my/bg_header.png')
      },
      mall: {
        label: require('../assets/images/themes/chistmas/mall/label.png')
      },
      task: {
        signBg: require('../assets/images/themes/chistmas/hornSection/bg_sign.png'),
      },
      achievement: {
        icon: require('../assets/images/themes/chistmas/achievement/icon.png'),
      },
      hornSection: {
        hotIcon: require('../assets/images/themes/chistmas/hornSection/icon_hot.png'),
        hotBgIcon: require('../assets/images/themes/chistmas/hornSection/bg_hot.png'),
        recentIcon: require('../assets/images/themes/chistmas/hornSection/icon_recent.png')
      },
      operations: [
        require('../assets/images/themes/chistmas/operations/1.png'),
        require('../assets/images/themes/chistmas/operations/2.png'),
        require('../assets/images/themes/chistmas/operations/3.png'),
        require('../assets/images/themes/chistmas/operations/4.png'),
        require('../assets/images/themes/chistmas/operations/5.png')
      ]
    },
    'spring': {
      flowerDown: require('../assets/images/themes/spring/flowerDown/flower.gif'),
      flowerDownTimeout: 5000,
      my: {
        bgColor: 'none',
        bgImg: require('../assets/images/themes/spring/my/bg_header.png')
      },
      mall: {
        label: require('../assets/images/themes/spring/mall/label.png')
      },
      task: {
        signBg: require('../assets/images/themes/spring/hornSection/bg_sign.png'),
      },
      achievement: {
        icon: require('../assets/images/themes/spring/achievement/icon.png'),
      },
      hornSection: {
        hotIcon: require('../assets/images/themes/spring/hornSection/icon_hot.png'),
        hotBgIcon: require('../assets/images/themes/spring/hornSection/bg_hot.png'),
        recentIcon: require('../assets/images/themes/spring/hornSection/icon_recent.png')
      },
      operations: [
        require('../assets/images/themes/spring/operations/1.png'),
        require('../assets/images/themes/spring/operations/2.png'),
        require('../assets/images/themes/spring/operations/3.png'),
        require('../assets/images/themes/spring/operations/4.png'),
        require('../assets/images/themes/spring/operations/5.png')
      ]
    },
    'national':{
      operations: [
        require('../assets/images/themes/national/operations/1.png'),
        require('../assets/images/themes/national/operations/2.png'),
        require('../assets/images/themes/national/operations/3.png'),
        require('../assets/images/themes/national/operations/4.png'),
        require('../assets/images/themes/national/operations/5.png')
      ],
      operationsBg:require('../assets/images/themes/national/operations/operation_bg.png')
    }
  };
  config = {
    wapChannel: 100061,  //Wap站的渠道号，判断是否是wap站，做特殊处理
    themes: '',
    plantVersion: 'yellow',
    hornSection: {
      hotIcon: require('../views/index/img/hot_recommend.png'),
      recentIcon: require('../views/index/img/recent_playicon.png')
    },
    achievement: {
      icon: require('../views/task/img/task-icon.png'),
    },
    operations: [
      {
        id: 1,
        name: '金叶补给',
        img: require('../views/my/image/recharge.png'),
        countDown: false,
        click (_this) {
          _this.$marchSetsPoint('A_H5PT0019000193')
          _this.$router.push({ name: 'payment' })
        }
      },
      {
        id: 2,
        name: '排行榜',
        img: require('../views/index/img/ranking-icon.png'),
        get label () {
          if (!localStorage['isOpenedRankList']) {
            return '新功能'
          }
          return ''
        },
        click (_this) {
          _this.$marchSetsPoint('A_H5PT0019000194')

          //新用户直接进新人话费榜
          profitServices.getNewUserRankingInfo().then(res => {
            let code = _get(res, 'data.code', 101)
            if (code == 200) {
              _this.$router.push({ name: 'newUserRanking', query: { from: 'index' } })
            }
            else {
              _this.$router.push({ name: 'profitRanking', query: { from: 'index' } })
            }
          })

        }
      },
      {
        id: 3,
        name: '转盘夺宝',
        img: require('../views/index/img/letter-icon.png'),
        click (_this) {
          _this.$marchSetsPoint('A_H5PT0019000196')
          _this.$refs.turntable.init()
        }
      },
      {
        id: 4,
        name: '充值特惠',
        label: '送话费',
        img: require('../views/index/img/preference-icon.png'),
        click (_this) {
          _this.$marchSetsPoint('A_H5PT0019000195')
          _this._getOneLottery()
        }
      },
      {
        id: 5,
        name: '招财猫',
        label: '新版猫',
        img: require('../views/index/img/mao-icon.png'),
        async click (_this) {
          await _this.$marchSetsPoint('A_H5PT0019000197')
          jumpUrl({ url: '/petcat/' })
        }
      }
    ],
    activityEntry: true,
    basefooter: true,
    baseHeader: {
      index: false,
      task: false,
      mall: false,
      my: false,
    },
    get isShowHeader () {
      let APP_CHANNEL = localStorage.getItem('APP_CHANNEL') || 'default'
      // let noHeadChannels = ['100000', '100061', '100030', '100070', '100039']
      let noHeadChannels = ['100039']
      if (noHeadChannels.indexOf(APP_CHANNEL) > -1) {
        return false
      }
      else {
        return true
      }
    },
    get isClientC(){
      let APP_CHANNEL = localStorage.getItem('APP_CHANNEL');
      return ['100030','100097','100098','100099','100030001','100031','100095','100096'].indexOf(APP_CHANNEL) > -1
    },
    paymentCallbackChannel: ['100080', '100052', '100061']
  }
  isNationalDay(){
    let year=new Date().getFullYear()
    let month=new Date().getMonth()+1
    let day=new Date().getDate()
    return year==2020&&month==10&&(day>=1&&day<=8)
  }
  exportConfig () {
    //获取当前的主题的配置
    if(this.isNationalDay()){
      this.config.themes='national'
    }
    let themes = this.themes[this.config.themes]
    let APP_CHANNEL = localStorage.getItem('APP_CHANNEL') || 'default'
    if (themes) {
      for (var key in themes) {
        if (key != 'operations') {
          this.config[key] = themes[key]
        }
      }
      this.config.operations.forEach((operation, index) => {
        operation.img = themes.operations[index]
        return operation
      })
    }
    return this.config
  }
}

export default new ModuleConfig().exportConfig()
