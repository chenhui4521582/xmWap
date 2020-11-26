import $axios from './http/http'
import API from './API/API'
import utils from '@/utils/utils'
import { loadScripts } from '../utils/utils'

/**
 * @description 获取用户信息 接口三个和一个 兼容
 *
 */
export const getBaseInfo = async () => {
  try {
    let { data: { data, code } } = await $axios.post(API.userCenter)
    // const tags = await $axios.post(API.getUserTagsInfo)
    if (code === 200) {
      // if(tags.data.code === 200){
      //   data={ ...data, ...tags.data.data }
      // }
      localStorage.setItem('user_Info', JSON.stringify(data))
      return data
    } else {
      return {}
    }
  } catch (error) {
    console.log(error)
  }
}

/**
 * @description 获取用户是否签到
 */
export const getUserSign = async () => {
  const { data: { data, code } } = await $axios.post(API.getUserSign)
  if (code === 200) {
    return data
  } else {
    return {}
  }
}
/**
 * @description 我的话费劵和我的京东卡
 */
export const richAndconvertList = async () => {
  const { data } = await $axios.post(API.richAndconvertList, {
    page: 1,
    pageSize: 10
  })
  return data
}
/**
 * @description 判断消息是否已经阅读过
 */
export const getMessageUnread = async () => {
  const { data } = await $axios.post(API.messageUnread)
  return data
}
/**
 * @description 获取优惠劵
 */
export const getCouponList = async (
  param = { page: 1, pageSize: 100, params: true }
) => {
  const { data } = await $axios.post(API.couponList, param)
  return data
}
/**
 * @description 获取用户是否绑定了手机
 */
export const getPhoneBindInfo = async () => {
  const { data } = await $axios.post(API.getPhoneBindInfo)
  return data
}
/**
 * @description 获取短信验证吗
 */
export const getPhoneCode = async phone => {
  const { data } = await $axios.post(API.getPhoneCode, { phone })
  return data
}
/**
 * @description 绑定手机提交
 */
export const bindMobilePhone = async (phone, smsCode) => {
  const { data } = await $axios.post(API.bindPhone, { phone, smsCode })
  return data
}
/**
 * @description 获取京东卡列表
 */
export const fragmentConvertList = async () => {
  const { data } = await $axios.post(API.fragmentConvertList + '8')
  return data
}
/**
 * @description 获取京东卡奖品
 */
export const combineAwards = async (awardsId, fragmentId) => {
  const { data } = await $axios.post(API.combineAwards, {
    awardsId,
    fragmentId
  })
  return data
}
/**
 * @description 奖品列表
 * @page <number> 页数
 * @pageSize <number> 每页条数
 */
export const getPrizeList = async (page = 1, pageSize = 50) => {
  const { data } = await $axios.post(API.prizeList, { page, pageSize })
  return data
}
/**
 * @description 用户是否在自动查询的列表中
 */
export const systemQueryUser = async () => {
  const { data } = await $axios.post(API.systemQueryUser)
  return data
}
/**
 * @description 换绑发送验证码
 */
export const updatePhoneCode = async () => {
  const { data } = await $axios.post(API.sendUpdatePhoneSmsUrl)
  return data
}
/**
 * @description 换绑发送验证码校验
 */
export const changeUpdatePhoneCode = async (smsCode) => {
  const { data } = await $axios.post(API.checkUpdatePhoneSmsUrl, { smsCode })
  return data
}
/**
 * @description 问题反馈热门列表
 */
export const issuesHotType = async () => {
  const { data } = await $axios.post(API.issuesHotType)
  return data
}
/**
 * @description 获取热门列表详情
 */
export const issuesHotList = async (param) => {
  param = Object.assign({ page: 1, pageSize: 100 }, param)
  const { data } = await $axios.post(API.issuesHot, param)
  return data
}

/**
 * @description 获取热门列表详情
 * @param pid 问题详情id
 * @param useful 1= 有用 2没用
 */
export const feedbackUseful = async (pid, useful) => {
  const { data } = await $axios.post(API.useful, { pid, useful })
  return data
}

/**
 * @description 获取热门列表详情
 * @param params 参数对象 详情看页面
 */
export const newFeedback = async (params) => {
  const { data } = await $axios.post(API.newFeedback, params)
  return data
}
/**
 * @description 消息中心消息列表
 */
export const mseaageList = async () => {
  const { data } = await $axios.post(API.mseaageList)
  return data
}
/**
 * @description 获取消息详情
 */
export const getMessageDetails = async (senderType) => {
  const { data } = await $axios.post(API.getMessageDetails, { senderType })
  return data
}
/**
 * @description 消息领取奖励
 * @param value 消息id
 */
export const receiveAwards = async (value) => {
  const { data } = await $axios.post(API.receiveAwards, { value })
  return data
}
/**
 * @description 领取优惠券-话费碎片-金叶子
 * @param orderSn
 */
export const receivePaySend = async (orderSn) => {
  const { data } = await $axios.post(API.paySend, { orderSn })
  return data
}
/**
 * @description 充值礼物校验
 * @param orderSn
 */
export const checkRechargeGift = async (orderSn) => {
  const { data } = await $axios.post(API.checkRechargeGift, { orderSn })
  return data
}
/**
 * @description 实物添加收货地址
 * @param param
 */
export const saveAddress = async (param) => {
  const { data } = await $axios.post(API.saveAddress, param)
  return data
}
/**
 * @description 获取转盘夺宝红点
 * @param param
 */
export const getTurntableRedDot = async (param) => {
  const { data } = await $axios.post(API.getTurntableRedDot, param)
  return data
}
/**
 * @description 获取我的奖品红点
 * @param param
 */
export const getMyPrizeRedDot = async (param) => {
  const { data } = await $axios.post(API.getMyprizeRedDot, param)
  return data
}
/**
 * @description 任务中心轮播图
 * @param param
 */
export const getMyBannerList = async () => {
  const { data } = await utils.cacheRequest('get', $axios, 'getMyBannerList')
  return data
}
/**
 * @description 获取微信专属客服信息
 */
export const getExclusiveCustomerServiceInfo = async () => {
  const { data } = await $axios.post(API.getExclusiveCustomerServiceInfo)
  return data
}
/**
 * @description 获取微信专属客服信息
 * @param params
 */
export const getPrivilege = async (params) => {
  const { data } = await $axios.post(API.getPrivilege, params)
  return data
}
/**
 * @description 获取任务中心红点状态
 * @param params
 */
export const getusertaskRedDot = async () => {
  const { data } = await $axios.post(API.getusertaskRedDot)
  return data
}

/**
 * @description 获取首页活动中心红点状态
 * @param params
 */
export const getActivitiesRedDot = async () => {
  const { data } = await $axios.post(API.activityCenterDetails)
  return data
}

/**
 * @description 更新我的奖品使用状态
 * @param params
 */
export const updateUseFlag = async (params) => {
  const { data } = await $axios.post(API.updateUseFlag, params)
  return data
}

/**
 * @description 用户个人信息
 */
export const getUserServiceInfo = async () => {
  const { data } = await $axios.post(API.userServiceInfo)
  return data
}
/**
 * @description 奖品评价信息-评价列表
 */
export const getCommentList = async (page) => {
  const { data } = await $axios.post(API.getCommentList + page)
  return data
}
/**
 * @description 奖品评价信息-未评价列表
 */
export const getNoCommentList = async (page) => {
  const { data } = await $axios.post(API.getNoCommentList + page)
  return data
}
/**
 * @description 奖品评价明细
 */
export const getCommentDetail = async (id) => {
  const { data } = await $axios.post(API.getCommentDetail + id)
  return data
}
/**
 * @description 用户个人信息
 */
export const prizeComment = async (params) => {
  const { data } = await $axios.post(API.prizeComment, params)
  return data
}


/**
 * @description 用户原手机号校验
 */
export const checkOriginalPhoneNo = async phoneNo => {
  const { data } = await $axios.post(API.checkOriginalPhoneNo, { phoneNo })
  return data
}
/**
 * @description 猫权益详情
 */
export const getCatrightsInfo = async () => {
  const { data } = await $axios.post(API.catrightsInfo)
  return data
}
/**
 * @description 猫详情
 */
export const getCatDetail = async () => {
  const { data } = await $axios.post(API.catDetail)
  return data
}
/**
 * @description 猫健康详情
 */
export const getCatSickState = async () => {
  const { data } = await $axios.post(API.getCatSickState)
  return data
}

/**
 * @description 猫健康详情
 */
export const getUser = async () => {
  const { data } = await $axios.post(API.getUser)
  return data
}

/**
 * @description 奖品详情评价
 */
export const getContentCommentListByProductId = async (params) => {
  const { data } = await $axios.post(API.getContentCommentListByProductId, params)
  return data
}
/**
 * @description 判断游戏平台是否需要弹出用户协议提示窗
 */
export const judgeAddAgreement = async () => {
  const { data } = await $axios.post(API.judgeAddAgreement)
  return data
}
/**
 * @description 关闭用户协议提示窗不再弹出
 */
export const closeAgreementTips = async () => {
  const { data } = await $axios.post(API.closeAgreementTips)
  return data
}
/**
 * @description 关闭用户协议提示窗不再弹出
 */
export const getEcRedDot = async () => {
  const { data } = await $axios.post(API.getEcRedDot)
  return data
}

