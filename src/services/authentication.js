import $axios from './http/http'
import API from './API/API'
const services = {
  getBindPhone: function (params) {
    if(params) {
      return $axios.post(`${API.getRiskBindPhone}/${params}`)
    }
    return $axios.post(API.getBindPhone)
  },
  sendCode: function (params) {
    return $axios.post(API.sendCode, params)
  },
  authenticationSubmit: function (params) {
    return $axios.post(API.authenticationSubmit, params)
  },
  complaintSendCode: function (params) {
    return $axios.post(API.complaintSendCode+params,)
  },
  complaintSubmit: function (params) {
    return $axios.post(API.complaintSubmit, params)
  },
  isAuthentication: function(params){
    return $axios.post(API.isAuthentication, params)
  }
}

export default services
