import $axios from '@/services/http/http'
const OPS_API_BASE_URL = '//ops-api.beeplaying.com'
/**
 * @description 活动信息
 * @return {Object} data
 */
export const getWarningTask = async () => {
  const { data } = await $axios.post(`${OPS_API_BASE_URL}/ops/api/user/lose/warning/task`)
  return data
}
/**
 * @description 活动信息
 * @return {Object} data
 */
export const receive = async (params) => {
  const { data } = await $axios.post(`${OPS_API_BASE_URL}/ops/api/user/lose/warning/receive`, params)
  return data
}
