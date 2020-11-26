import $axios from './http/http'
import API from './API/API'

const services = {
  saveNewUserGuide: function (params) {
	return $axios.post(API.saveNewUserGuide, params)
  },
  getNewUserGuide: function (params) {
	return $axios.post(API.getNewUserGuide, params)
  }
}

export default services
