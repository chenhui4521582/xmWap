let state = {
  /** 用户信息 **/
  userInfo: {},
  /** 用户是否签到 **/
  userSign: false,
  /** 站点红点提示管理 **/
  redDot: {
    turntable: false,
    myPrize: 0,
    activity: 0,
    message: 0,
    taskawards: false,
    returnBagAwards:null
  },
  /** 抽免单 不需的时候删除 **/
  openGratis: false,
  /** 支付方式抽免单 **/
  firstPayment: {
    show: false,
    message: ''
  },
  shopUrl: `${process.env['VUE_APP_HOST_PLATFORM']}/xmWap/#/payment/`, // 商城跳转链接
  FILE_HOST: process.env['VUE_APP_FILE_HOST'], //文件域名
  HOST_PLATFORM: process.env['VUE_APP_HOST_PLATFORM'], //主域名
  catPrivilege: {
    frozenStatus: 0, // 冻结状态 0:正常 1:冻结
    privilegeDetails: [], // 激活特权详情
    privileges: [], // 特权未激活详情
    additions: [] // 加成信息
  },
  findBagCanReceive:false,
  showThreeHoursEntrance:null,
  agreementPopType:0,//0 没调过是否弹出协议窗口 1 需要弹窗 2已弹
  getEcRedDot:null,//个人中心专属客服红点、副标题
  turntableRefresh: 0 //btc转盘 刷新接口
}
export default state
