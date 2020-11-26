import $axios from './http/http'
import API from './API/API'
import utils from '@/utils/utils'
const services = {
  getFindEntrance: function () {
    return utils.cacheRequest('post', $axios, 'getFindEntrance')
  },
  getFindRecommend: function () {
    return $axios.get(API.getFindRecommend)
  },
  getFindRank: function () {
    return $axios.post(API.getFindRank)
  },
  getFindDynamicList: function (params) {
    return $axios.post(API.getFindDynamicList, params)
  },
  getFindDynamicIncrNum: function (params) {
    return $axios.post(API.getFindDynamicIncrNum, params)
  },
  /*瓜分福袋*/
  getFindDivideBag: function (id) {
    return $axios.post(API.getFindDivideBag + id)
  },
  /*福袋领取记录*/
  getFindBagRecord: function (id) {
    return $axios.post(API.getFindBagRecord + id)
  },
  /* 分享状态*/
  getFindBagShareState: function () {
    return $axios.post(API.getFindBagShareState)
  },
  /*分享福袋*/
  getFindBagShare: function (id) {
    return $axios.post(API.getFindBagShare + id)
  },
  /*用户最近七天的动态*/
  getFindBagList: function (id) {
    return $axios.post(API.getFindBagList + id)
  },
  /*获取是否存在可领取福袋*/
  getFindBagState: function () {
    return $axios.post(API.getFindBagState)
  },
  /** 获取大神攻略数据 **/
  getMasterStrategy: function () {
    return $axios.post(API.getMasterStrategy)
  },
  /** 是否展示礼包入口 **/
  showPack: function () {
    return $axios.post(API.showPack)
  },
  /** 渠道下所有游戏礼包列表 **/
  channelGamePack: function () {
    return $axios.post(API.channelGamePack)
  }
}

export default services

