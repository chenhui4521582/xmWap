import $axios from './http/http'
import API from './API/API'

const services = {
  getTasks: function (isKing = false) {
    let value = 'achievementTask';
    if (isKing) {
      value = 'kingTask';
    }
    return $axios.post(API.getUserTasks, {
      value
    });
  },
  getTaskInfo (taskName = '') {
    return $axios.post(API.getUserTasks, {
      value: taskName
    });
  },
  finishTask: function (params) {
    return $axios.post(API.userTaskFinish, params)
  },
  cacheGameType: function (params) {
    return $axios.post(API.cacheGameType, params)
  },
  getAchievementTaskInfo: function (params) {
    return $axios.post(API.achievementTaskInfo, params)
  },
}

export default services
