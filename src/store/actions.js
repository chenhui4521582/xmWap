import { getBaseInfo, getUserSign, getTurntableRedDot, getMyPrizeRedDot, getMessageUnread, getusertaskRedDot, getActivitiesRedDot,judgeAddAgreement,closeAgreementTips,getEcRedDot} from '@/services/user'
import Services_activity from '@/services/activity'
import Services_sdk from '@/services/SDK'
import _get from 'lodash.get'
export default {
  GET_USER_SIGN ({ commit }) {
    return getUserSign().then(res => {
      let isSign = res.haveSignedIn || false
      let userType = res.userType || 0
      commit('SET_USER_SIGN', isSign)
      return { isSign, userType }
    })
  },
  async GET_USERINFO ({ commit }) {
    let result = await getBaseInfo()
    if (!result && localStorage.getItem('user_Info')) {
      result = JSON.parse(localStorage.getItem('user_Info'))
    }
    commit('SET_USERINFO', result || {})
  },
  async GET_MYPRIZE_REDDOT ({ commit }) {
    let { data, code } = await getMyPrizeRedDot()
    if (code === 200) {
      commit('SET_MYPRIZE_REDDOT', data.unclaimed)
    }
  },
  async GET_TURNTABLE_REDDOT ({ commit }) {
    let { data, code } = await getTurntableRedDot()
    if (code === 200 && (data.enable === '1' || data.enable == '3')) {
      if (!localStorage.getItem('zhuanpanTipsDate')) {
        localStorage.setItem('zhuanpanTipsDate', new Date(new Date().toLocaleDateString()).getTime())
      }
      commit('SET_TURNTABLE_REDDOT', true)
    }
  },
  async GET_MESSAGE_REDDOT ({ commit }) {
    let { data, code } = await getMessageUnread()
    if (code === 200) {
      commit('SET_MESSAGE_REDDOT', data.quantity)
    }
  },
  async GET_TASK_REDDOT ({ commit }) {
    try{
      let { data, code } = await getusertaskRedDot()
      if (code === 200) {
        commit('SET_TASK_REDDOT', data.showRedDot)
        if(!data.showRedDot){
          let res = await Services_sdk.returnBagTask()
          if (res.data.code === 200) {
            commit('SET_TASK_REDDOT', res.data.data.open&&res.data.data.haveUnReceived)
            commit('SET_RETURNBAG_REDDOT', res.data.data)
          }
        }
      }else{
        let res = await Services_sdk.returnBagTask()
        if (res.data.code === 200) {
          commit('SET_TASK_REDDOT', res.data.data.open&&res.data.data.haveUnReceived)
          commit('SET_RETURNBAG_REDDOT', res.data.data)
        }
      }
    }catch (e) {
      let res = await Services_sdk.returnBagTask()
      if (res.data.code === 200) {
        commit('SET_TASK_REDDOT', res.data.data.open&&res.data.data.haveUnReceived)
        commit('SET_RETURNBAG_REDDOT', res.data.data)
      }
    }
  },
  async GET_ACTIVITIES_REDDOT ({ commit }) {
    let { data, code } = await getActivitiesRedDot()
    if (code === 200) {
      commit('SET_ACTIVITIES_REDDOT', data.unreadQuantity)
    }
  },
  /** 抽免单 不需的时候删除 **/
  GET_GRATIS ({ commit }, order) {
    Services_activity.getGratis({ value: order || '' }).then(res => {
      let { code } = _get(res, 'data', {})
      if (code === 200) {
        let type = _get(res, 'data.data.type', '')
        if (type === 'firstOrder' || type === 'sendCoupon'||type === 'wheel') {
          commit('SET_GRATIS', type) // 原为置为true 但是无法区分 免单 还是 发优惠券 所以 替换为 置为 type
        } else {
          commit('SET_GRATIS', false)
        }
      }
    })
  },
  /** 支付方式抽免单 不需的时候删除 **/
  GET_FIRSTPAYMENT ({ commit }, order) {
    Services_activity.getFirstPayment({ value: order || '' }).then(res => {
      let { code, data, message } = _get(res, 'data', {})
      if (code == 200) {
        commit('SET_FIRSTPAYMENT', {
          show: true,
          message: ''
        })
      }
      if (code == 201) {
        commit('SET_FIRSTPAYMENT', {
          show: true,
          message
        })
      }
    })
  },
  async GET_CATPRIVILEGE ({ commit }) {
    const res = await Services_sdk.sdkPrivilegeList()
    commit('SET_CATPRIVILEGE', {
      frozenStatus: _get(res, 'data.data.frozenStatus', 0),
      privilegeDetails: _get(res, 'data.data.privilegeDetails', []) || [],
      privileges: _get(res, 'data.data.privileges', []),
      additions: _get(res, 'data.data.additions', [])
    })
  },
  async JUDGE_ADD_AGREEMENT ({ commit }) {
    let {code,data} = await judgeAddAgreement()
    if(code==200){
      commit('SET_AGGREEMENT_TYPE', data.isOpen?1 :2)
    }
  },
  async CLOSE_AGREEMENT_POP ({ commit }) {
    let result = await closeAgreementTips()
    commit('SET_AGGREEMENT_TYPE',2)
  },
  async GET_EC_REDDOT ({ commit }) {
    let {code,data} = await getEcRedDot()
    if(code==200){
      commit('SET_EC_REDDOT', data)
    }
  },
}
