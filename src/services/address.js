import $axios from './http/http'
import Api from './API/API'
/**
 * @description 地址管理页面  收货地址列表
 */
const getAddressList = function () {
  return $axios.get(Api.getAddressList)
}

/**
 * @description 地址管理页面  获取省份信息
 */
const getProvince = function () {
  return $axios.get(Api.getProvince)
}

/**
 * @description 地址管理页面  获取城市信息
 */
const getCity = function (id) {
  return $axios.get(Api.getCity.replace('{province}', id))
}

/**
 * @description 地址管理页面  获取区信息
 */
const getArea = function (id) {
  return $axios.get(Api.getArea.replace('{city}', id))
}

/**
 * @description 地址管理页面  删除地址
 */
const removeAddress = function (id) {
  return $axios.get(Api.removeAddress.replace('{id}', id))
}

/**
 * @description 地址管理页面  新增，修改地址
 */
const addAddress = function (params) {
  return $axios.post(Api.addAddress, params)
}


export { getAddressList, getProvince, getCity, getArea, removeAddress, addAddress }

const Services = {
  getAddressList,
  getProvince,
  getCity,
  getArea,
  removeAddress,
  addAddress
}
export default Services