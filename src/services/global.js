import $axios from './http/http'
import API from './API/API'
import utils from '@/utils/utils'
/**
 * @description 地址管理页面  新增，修改地址
 */
const saveNewUserTask = function (params) {
  return $axios.post(`${API.saveNewUserTask}/${params.value}`)
}
/**
 * @description 领取礼包 ,参数传value，值是batchId的值，批次号
 * @param params 
 */
const getAwardsCDKey = function (params) {
  return $axios.post(API.getAwardsCDKey, params)
}
/**
 * @description 根据productType获取优惠券礼包
 * @param productType
 */
const getCouponBag = function (productType) {
  return $axios.post(API.getCouponBagProductListByType + productType)
}

/**
 * @description 获取周卡信息
 */
const findCard = function () {
  return utils.cacheRequest('post', $axios, 'findCard')
}

export {
  saveNewUserTask, getAwardsCDKey, findCard, getCouponBag
}

const Services = {
  saveNewUserTask,
  getAwardsCDKey,
  findCard,
  getCouponBag
}
export default Services