export default {
  SET_USERINFO (state, data) {
    state.userInfo = data
  },
  SET_USER_SIGN (state, data) {
    state.userSign = data
  },
  /**红点操作**/
  SET_TURNTABLE_REDDOT (state, data) {
    state.redDot.turntable = data
  },
  SET_MYPRIZE_REDDOT (state, data) {
    state.redDot.myPrize = data
  },
  SET_MESSAGE_REDDOT (state, data) {
    state.redDot.message = data
  },
  SET_TASK_REDDOT (state, data) {
    state.redDot.taskawards = data
  },
  SET_ACTIVITIES_REDDOT (state, data) {
    state.redDot.activity = data
  },
  /** 抽免单 不需的时候删除 **/
  SET_GRATIS (state, data) {
    state.openGratis = data
  },
  /** 支付方式抽免单 不需的时候删除 **/
  SET_FIRSTPAYMENT (state, data) {
    state.firstPayment.show = data.show
    state.firstPayment.message = data.message
  },
  /** 猫加成信息 **/
  SET_CATPRIVILEGE (state, data) {
    state.catPrivilege.frozenStatus = data.frozenStatus
    state.catPrivilege.privilegeDetails = data.privilegeDetails
    state.catPrivilege.privileges = data.privileges
    state.catPrivilege.additions = data.additions
  },
  /** 有福袋可领取 **/
  SET_FINDBAGCANRECEIVE (state, data) {
    state.findBagCanReceive = data
  },
  SET_RETURNBAG_REDDOT (state, data) {
    state.redDot.returnBagAwards = data
  },
  SET_THREEHOURS_ENTRANCE(state, data){
    state.showThreeHoursEntrance = data
  },
  SET_AGGREEMENT_TYPE(state, data){
    state.agreementPopType = data
  },
  SET_EC_REDDOT(state, data){
    state.getEcRedDot = data
  },
  SET_TURNTABLEREFRESH (state, data) {
    state.turntableRefresh = data
  }
}
