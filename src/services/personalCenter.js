import $axios from './http/http'
import API from './API/API'

const services = {
  findUserFragmentRecord (data) {
    return $axios.post(API.findUserFragmentRecord, data)
  },
  findUserComposeRecord (data) {
    return $axios.post(API.findUserComposeRecord, data)
  },
  getLeafDetail (data) {
    return $axios.post(API.getLeafDetail, data)
  },
  getUserPersonalInfo () {
    return $axios.post(API.GetUserPersonalInfo)
  },
  getUpdateUserHeadImg (data) {
    return $axios.post(API.UpdateUserHeadImg, data)
  },
  getUpdateUserNickname (data) {
    return $axios.post(API.UpdateUserNickname, data)
  },
  getLimit (data) {
    return $axios.get(API.getLimit, data)
  },
  submitLimit (data) {
    return $axios.post(API.submitLimit, data)
  },
  sendLimitCode (data) {
    return $axios.get(API.sendLimitCode, data)
  },
  getSurveyInfo () {
    return $axios.post(API.getSurveyInfo)
  },
  commitSurveyInfo (data) {
    return $axios.post(API.commitSurveyInfo, data)
  },
  getCatSickState: function () {
    return $axios.post(API.getCatSickState)
  },
  getCloseSendStatus: function () {
    return $axios.post(API.getCloseSendStatus)
  },
  closeSend: function () {
    return $axios.post(API.closeSend)
  },
  getHeadFrame: function () {
    return $axios.post(API.getHeadFrame)
  },
  cancelHeadFrame: function () {
    return $axios.post(API.cancelHeadFrame)
  },
  useHeadFrame: function (data) {
    return $axios.post(API.useHeadFrame, data)
  },
  exchangeCDKey: function (cdk) {
    return $axios.post(API.exchangeCDKey + cdk)
  }
}

export default services
