import $axios from './http/http'
import utils from '@/utils/utils'
import API from './API/API'

export const shopLlist = async () => {
  const { data } = await await $axios.post(API.getMallShopList)
  return data
}
/**
 * @description 话费券获取
 * @param {Number} productId
 */
export const placeOrder = async (productId, count) => {
  const { data } = await $axios.post(
    '//ops-api.beeplaying.com/ops/api/exchangeMall/placeOrder',
    { productId, count }
  )
  return data
}
export const getGoodsDetail = async (params) => {
  const { data } = await $axios.post(
    '//ops-api.beeplaying.com/ops/api/exchangeMall/detail',
    params
  )
  return data
}
//获取盲盒列表
export const getBlindBox = async () => {
  const { data } = await $axios.post(
    '//ops-api.beeplaying.com/ops/api/blindBox/list'
  )
  return data
}
//打开盲盒
export const openBlindBox = async (orderId) => {
  const { data } = await $axios.post(
    '//ops-api.beeplaying.com/ops/api/blindBox/open',
    { orderId }
  )
  return data
}

//查看秒杀活动
export const getSeckillStatus = async () => {
  const { data } = await $axios.post(
    '//ops-api.beeplaying.com/ops/api/seckillActivity/isOpen'
  )
  return data
}

export const getRingServerStatus = async () => {
  return await utils.cacheRequest('post', $axios, 'getRingServerStatus')
}

// 查看盲盒推荐
// export const getBlindBoxRecommend = async () =>{
//   return utils.cacheRequest('get', $axios, 'getBlindBoxRecommend')
// }

// 查询是否要挽留
export const getdetainment = async () => {
  return $axios.post('//quoits-api.beeplaying.com/quoits/api/exchange/popup')
}
