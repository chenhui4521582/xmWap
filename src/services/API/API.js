export const HOST = {
  PLATFORM_API: '//platform-api.beeplaying.com',
  OPS_API: '//ops-api.beeplaying.com',
  SHOP_API: '//shop-api.beeplaying.com',
  TRANS_API: '//trans-api.beeplaying.com',
  PETCAT_API: '//petcat-api.beeplaying.com',
  UIC_API: '//uic-api.beeplaying.com',
  QUOITS_API: '//quoits-api.beeplaying.com',
  SMARTEYES_API: '//smarteyes-api.beeplaying.com',
  MARCH_BURIED_POINT: 'https://log-center.beeplaying.com/am/log/v1/json'
}
const API = {
  xmRecently: `${HOST.PLATFORM_API}/wap/api/game-category/recently`, // 玩过的游��
  xmRecentlyV2: `${HOST.PLATFORM_API}/wap/api/game-category/recentlyV2`, // 玩过的游��
  xmRecommend: `${HOST.PLATFORM_API}/wap/api/game-category/recommend`, // 推荐游戏
  xmDetail: `${HOST.PLATFORM_API}/wap/api/game-category/detail`,// 游戏分类
  NoticeList: `${HOST.PLATFORM_API}/wap/api/notice/list`, // 跑马��
  payedTurntable: `${HOST.OPS_API}/ops/api/fee/wheel/status`, // 付费转盘
  BannerList: `${HOST.PLATFORM_API}/wap/api/banner/list`, // 幻灯��
  platTaskByBatch: `${HOST.PLATFORM_API}/task/api/usertask/platTaskByBatch`, // H5成长任务
  platDayTask: `${HOST.PLATFORM_API}/task/api/cost/usertask/platDayTask`, // 新每日任务
  platNewUserStairTask: `${HOST.PLATFORM_API}/task/api/newuser/task`, // 新人任务接口
  newUserMenu: `${HOST.PLATFORM_API}/task/api/newuser/newUserMenu`, // 新人任务菜单显示
  newUserPopup: `${HOST.PLATFORM_API}/task/api/newuser/newUserPopup`, // 新人任务弹窗显示
  newUserAllFinish: `${HOST.PLATFORM_API}/task/api/newuser/newUserAllFinish`, // 新人任务最后一个领取
  getActivity: `${HOST.OPS_API}/ops/api/activityCenter/xmDetails`, // 活动中心
  taskFinish: `${HOST.PLATFORM_API}/task/api/usertask/finish`, // 任务中心领取奖励
  receivePointsAward: `${HOST.PLATFORM_API}/task/api/cost/usertask/receivePointsAward/`, // 领取积分奖励

  feedBackList: `${HOST.SHOP_API}/shop/api/mall/feedBackList`, // 充值回��
  getNewUserGuide: `${HOST.PLATFORM_API}/wap/api/plat/newUser/get-guide-position`, // 获取新用户引导到步骤接口
  saveNewUserGuide: `${HOST.PLATFORM_API}/wap/api/plat/newUser/set-guide-position`, // 保存新用户引导步骤接��
  taskGuideStatus: `${HOST.PLATFORM_API}/wap/api/plat/newUser/taskGuideStatus`, // 任务引导是否开��
  getnewUserCard: `${HOST.PLATFORM_API}/wap/api/newuseraward/firstDayAwards`, // 新手第一次进入是否打开新手礼包
  getNewUserCardAwards: `${HOST.PLATFORM_API}/wap/api/newuseraward/firstDayExchange`, //  新手第一次进入领新手礼包
  saveNewUserTask: `${HOST.PLATFORM_API}/wap/api/plat/newUser/singleBehavior`, //  新手任务进入我的或者排行榜记录状��
  getSignList: `${HOST.PLATFORM_API}/wap/api/continuous/signIn/new/list`,
  getReward: `${HOST.PLATFORM_API}/wap/api/continuous/signIn/new/sign`,
  marchBuriedPoint: `${HOST.MARCH_BURIED_POINT}`, // 2019����7��新增埋点
  getRankList: `${HOST.PLATFORM_API}/wap/api/profit/findPage`, // 盈利�� 获取排行列表
  getMyProfit: `${HOST.PLATFORM_API}/wap/api/profit/my-awards`, // 我的盈利��
  ProfitRules: `${HOST.PLATFORM_API}/wap/api/profit/profitRules`, // 规则详情
  getCatRankList: `${HOST.PETCAT_API}/petcat/api/rank/rankList`, // 招财猫榜  获取排行列表
  getLastRankList: `${HOST.PLATFORM_API}/wap/api/profit/lastRank`, // 上次盈利�� 获取排行列表
  getRemoveData: `${HOST.PLATFORM_API}/wap/api/eraser/user-info`, // 橡皮擦数��
  clear: `${HOST.PLATFORM_API}/wap/api/eraser/clear`, // 擦除
  getRankingAwards: `${HOST.PLATFORM_API}/wap/api/profit/loginPopUp/`, // 13��21点发榜数��
  getUserSign: `${HOST.PLATFORM_API}/wap/api/continuous/signIn/new/todayStatus`, // 获取用户是否签到
  getMallList: `${HOST.SHOP_API}/shop/api/mall/new/common-list`, // 获取支付商品
  getBalance: `${HOST.TRANS_API}/trans/api/pay/balance/{payType}`, // 获取余额
  getInitPay: `${HOST.TRANS_API}/trans/api/pay/initPay`, // 获取支付方式
  submitPay: `${HOST.SHOP_API}/shop/api/buy`, // 去支��
  newSdkOrder: `${HOST.TRANS_API}/trans/api/order/newSdkOrder`, // 去支��
  getScratchCard: `${HOST.TRANS_API}/trans/api/activity/paySend`, // 获取刮刮卡数��
  getHotCards: `${HOST.SHOP_API}/shop/api/mall/leaguePacksList`, // 获取热门礼包
  getUserPayStatus: `${HOST.TRANS_API}/trans/api/pay/status`, // 获取用户是否支付
  getCard: `${HOST.SHOP_API}/shop/api/mall/card/getCard`, // 获取用户是否支付
  getRecommendGames: `${HOST.PLATFORM_API}/wap/api/plat/indexGameGuide`, // 任务页到首页弹出框接��
  getPreferenceList: `${HOST.SHOP_API}/shop/api/mall/feedBackList`, // 获取充值特��
  getOneLottery: `${HOST.SHOP_API}/shop/api/mall/newUserFeedback`, // 一元破��
  getOneLotteryHornData: `${HOST.OPS_API}/ops/api/wheelgame/commonTopHores`, // 一元破冰购买用户记��
  getCardLottery: `${HOST.SHOP_API}/shop/api/mall/showLeaguePacksList/`, // 夺宝礼包
  getCardLotteryResult: `${HOST.OPS_API}/ops/api/get/bag/getbaginfo`, // 夺宝礼包状��
  getTurntable: `${HOST.OPS_API}/ops/api/fee/wheel/status`, // 付费转盘
  getBindPhone: `${HOST.UIC_API}/uic/api/user/center/getPhoneBindInfo`, // 获取用户绑定手机��
  getRiskBindPhone: `${HOST.UIC_API}/uic/api/user/center/getPhone`, // 获取风控用户绑定手机��
  sendCode: `${HOST.UIC_API}/uic/api/user/login/ddwSendSmsCode`, // 发送验证码
  authenticationSubmit: `${HOST.UIC_API}/uic/api/user/center/identityAuth`, // 实名认证提交
  getActivityRecommend: `${HOST.PLATFORM_API}/wap/api/fixed/ad/serving/18`, //首页活动中心强广��
  getOneLotteryList: `${HOST.OPS_API}/ops/api/richwheel/commonStatus`, // 一元破冰抽奖列��
  getOneLotteryAwards: `${HOST.OPS_API}/ops/api/richwheel/commonBetting`, // 一元破冰抽奖列��
  getLimitCard: `${HOST.SHOP_API}/shop/api/mall/mallExchange`, // 获取限时礼包
  getDynamicRank: `${HOST.PLATFORM_API}/wap/api/profit/dynamic-rank`, // 查询排行榜数据是否发生改变
  getLimitLeayAward: `${HOST.OPS_API}/ops/api/durations-package/receive`, // 获取限时领金叶子奖品
  getActivityList: `${HOST.OPS_API}/ops/api/sdk/operation/details`, //sdk 活动列表
  saveActivityRead: `${HOST.OPS_API}/ops/api/sdk/operation/read`, //sdk 活动列表是否读取
  getMyprizeRedDot: `${HOST.SHOP_API}/shop/api/wap/welfarebag/info`, //获取我的奖品红点
  getTurntableRedDot: `${HOST.OPS_API}/ops/api/fee/wheel/redDot`, //获取夺宝转盘红点
  getFixedAdList: `${HOST.PLATFORM_API}/wap/api/fixed/ad/get-list`, // 获取运营位的广告信息
  getMyBannerList: `${HOST.PLATFORM_API}/wap/api/fixed/ad/get-list/20`, //获取个人中心轮播��
  getTaskBannerList: `${HOST.PLATFORM_API}/wap/api/fixed/ad/get-list/21`, //获取任务页轮播图
  getGratis: `${HOST.TRANS_API}/trans/api/activity/status`, //获取抽免单活��活动信息
  getFirstPayment: `${HOST.TRANS_API}/trans/api/activity/payFirstStatus`, //获取支付方式抽免单活��活动信息
  getfirstPaymentSend: `${HOST.TRANS_API}/trans/api/activity/payFirstSend`, // 获取支付方式抽免单活动刮刮卡数据
  getPaymentBannerList: `${HOST.PLATFORM_API}/wap/api/fixed/ad/get-list/22`, //获取支付轮播��
  complaintSendCode: `${HOST.PLATFORM_API}/wap/api/feedback/sendMsg/`, //风控申述获取验证��
  complaintSubmit: `${HOST.PLATFORM_API}/wap/api/feedback/newFeedback`, //风控申述提交
  isAuthentication: `${HOST.UIC_API}/uic/api/user/center/authStatus`, //身份验证
  getMallShopList: `${HOST.OPS_API}/ops/api/exchangeMall/mainNew`, // 外显商品列表
  getAccountInfo: `${HOST.TRANS_API}/trans/api/trans/accountInfo`, // 获取用户账户信息
  getTransInfo: `${HOST.UIC_API}/uic/api/user/login/transInfo`, // 用户基本信息头像信息
  richAndconvertList: `${HOST.TRANS_API}/trans/api/fragment/richAndconvertList`, // 新碎片背��
  getUserTagsInfo: `${HOST.PLATFORM_API}/wap/api/user/tag/all`, // 获取用户标签信息
  messageUnread: `${HOST.PLATFORM_API}/wap/api/wap/usermessage/unread`, // 判断消息是否已经阅读��
  couponList: `${HOST.TRANS_API}/trans/api/coupon/list`, //优惠卷列��
  getPhoneBindInfo: `${HOST.UIC_API}/uic/api/user/center/getPhoneBindInfo`, // 判断手机是否绑定
  getPhoneCode: `${HOST.UIC_API}/uic/api/user/center/sendPhoneBindCode`, // 获取短信验证��
  bindPhone: `${HOST.UIC_API}/uic/api/user/center/bindMobilePhone`, // 绑定手机提交
  fragmentConvertList: `${HOST.TRANS_API}/trans/api/fragment/convertList/`, //京东卡列��
  combineAwards: `${HOST.TRANS_API}/trans/api/fragment/combineAwards`, // 领取奖品
  confirmCoupon: `${HOST.TRANS_API}/trans/api/coupon/confirmCoupon`, // 首页判断优惠��
  feeWheelBanner: `${HOST.PLATFORM_API}/wap/api/fixed/ad/serving/19`,
  payedBetting: `${HOST.OPS_API}/ops/api/fee/wheel/betting`, // 付费转盘 -状��
  findUserFragmentRecord: `${HOST.TRANS_API}/trans/api/fragment/findUserFragmentRecord`, //碎片领取记录
  findUserComposeRecord: `${HOST.TRANS_API}/trans/api/fragment/findUserComposeRecord`, //碎片合成记录
  getLeafDetail: `${HOST.TRANS_API}/trans/api/trans/leafDetail`, //金叶子使用记��
  prizeList: `${HOST.SHOP_API}/shop/api/wap/welfarebag/catchedawards`, // 奖品列表
  systemQueryUser: `${HOST.SHOP_API}/shop/api/wap/welfarebag/systemQueryUser`, // 是否在自动查询列表中
  bettingListNew: `${HOST.OPS_API}/ops/api/welfarebox/details`, // 活动中心的类��的列��
  activityCenterRead: `${HOST.OPS_API}/ops/api/activityCenter/read`, //等待阅读 = true  取消红点
  getAwards: `${HOST.OPS_API}/ops/api/welfarebox/accept`, // 领取奖励
  getnewuserawardlog: `${HOST.PLATFORM_API}/wap/api/newuseraward/getnewuserawardlog`, //判断是否为老用��
  activityCenterDetails: `${HOST.OPS_API}/ops/api/activityCenter/details`, //获取活动数据
  sendUpdatePhoneSmsUrl: `${HOST.UIC_API}/uic/api/user/center/sendUpdatePhoneSms`, // 换绑发送验证码
  checkUpdatePhoneSmsUrl: `${HOST.UIC_API}/uic/api/user/center/checkUpdatePhoneSms`, // 验证换绑短信
  issuesHotType: `${HOST.PLATFORM_API}/wap/api/problem/issuesHotType`, // 问题反馈热门列表
  issuesHot: `${HOST.PLATFORM_API}/wap/api/problem/issuesHot`, // 获取热门列表详情
  useful: `${HOST.PLATFORM_API}/wap/api/problem/useful`, // 反馈回答是否有效
  newFeedback: `${HOST.PLATFORM_API}/wap/api/feedback/newFeedback`, // 提交反馈意见
  GetUserPersonalInfo: `${HOST.UIC_API}/uic/api/user/center/getPersonalInfo`, // 获取用户个人信息
  GetPhoneBindInfo: `${HOST.UIC_API}/uic/api/user/center/getPhoneBindInfo`, // 获取用户个人信息
  GetBlackPhone: `${HOST.UIC_API}/uic/api/user/center/getPhone`, // 获取用户手机绑定信息
  GetAccessToken: `${HOST.UIC_API}/uic/api/user/login/accessToken`,
  UpdateUserNickname: `${HOST.UIC_API}/uic/api/user/center/updateNickname`, // 修改昵称
  UpdateUserHeadImg: `${HOST.UIC_API}/uic/api/user/center/updateHeadImg`, // 修改头像
  DdwSendSmsCode: `${HOST.UIC_API}/uic/api/user/login/ddwSendSmsCode`, // 发送短��
  IdentityAuth: `${HOST.UIC_API}/uic/api/user/center/identityAuth`, // 实名认证
  rechargeLimit: `${HOST.TRANS_API}/trans/api/recharge/limit`, // 获取/设置 用户限额信息
  SendSms: `${HOST.TRANS_API}/trans/api/recharge/limit/sendSms`, // 实名认证
  FindUserFragmentRecord: `${HOST.TRANS_API}/trans/api/fragment/findUserFragmentRecord  `, // 获取记录
  FindUserComposeRecord: `${HOST.TRANS_API}/trans/api/fragment/findUserComposeRecord`, // 合成记录
  LeafDetail: `${HOST.TRANS_API}/trans/api/trans/leafDetail`, // 金叶子消耗列��
  mseaageList: `${HOST.PLATFORM_API}/wap/api/wap/usermessage/summary`, // 消息列表
  getMessageDetails: `${HOST.PLATFORM_API}/wap/api/wap/usermessage/details`, // 获取消息详情
  receiveAwards: `${HOST.PLATFORM_API}/wap/api/wap/usermessage/receiveAward`, // 领取奖励
  paySend: `${HOST.TRANS_API}/trans/api/activity/paySend`, // 领取优惠��话费碎片-金叶��
  checkRechargeGift: `${HOST.OPS_API}/ops/api/wheel/rechargeGift/status`, //充值礼物校��
  userCenter: `${HOST.PLATFORM_API}/wap/api/plat/userCenter`, // 用户基本信息
  saveAddress: `${HOST.SHOP_API}/shop/api/wap/welfarebag/saveAddress`, // 实物领奖填写地址
  getUserTasks: `${HOST.PLATFORM_API}/task/api/usertask/achievementTaskOfHall`, //获取成就任务列表
  userTaskFinish: `${HOST.PLATFORM_API}/task/api/usertask/finish`, //成就任务领取
  adTaskProcess: `${HOST.PLATFORM_API}/task/api/usertask/adTaskProcess`, //魅族广告点击去完成表示广告已��
  cacheGameType: `${HOST.PLATFORM_API}/task/api/usertask/cacheGameType`,//成就大厅去完成点击调的接口缓存最近点击的游戏
  profitUserInfo: `${HOST.PLATFORM_API}/wap/api/plat/user/info`, //盈利榜用户弹框信��
  getHomePopupList: `${HOST.PLATFORM_API}/wap/api/popup/list`, //首页弹窗顺序
  userServiceInfo: `${HOST.PLATFORM_API}/wap/api/plat/user-service-info`, //客服七鱼用户信息
  getOpenToken: `${HOST.UIC_API}/uic/api/user/sdk/openToken`, //获取openToken

  //招财猫补给站
  getCatSupplyReceiveStatus: `${HOST.PETCAT_API}/petcat/api/privilege/receiveStatus`,//补给箱状��
  getCatSupplyReceive: `${HOST.PETCAT_API}/petcat/api/privilege/receive`,//补给箱领��
  getweekPackageInfo: `${HOST.SHOP_API}/shop/api/compensation/send-awards`,//周礼包红包入口显示接��

  // 招财猫保险箱
  getBankStatus: `${HOST.TRANS_API}/trans/api/bank/status`, //保险箱状态查��
  updateBankNumber: `${HOST.TRANS_API}/trans/api/bank/update`, //保险箱存取操��
  getshufflingGameInfo: `${HOST.OPS_API}/ops/api/open-card/popup`,//翻牌活动入口显示接口
  ring2platTaskByBatch: `${HOST.QUOITS_API}/quoits/api/exchange/list`, // 新版套圈任务列表
  ring2exchange: `${HOST.QUOITS_API}/quoits/api/exchange`, // 新版套圈任务列表领取
  getbonusOpenInfo: `${HOST.OPS_API}/ops/api/jackpot/popup`,//奖金池入口显示接��
  getExclusiveCustomerServiceInfo: `${HOST.PLATFORM_API}/wap/api/customerService/getExclusiveCustomerServiceInfo`, // 获取专属客服信息
  getPrivilege: `${HOST.PLATFORM_API}/wap/api/privilege/getPrivilegeInfo`, // 获取招财猫权��
  getusertaskRedDot: `${HOST.PLATFORM_API}/task/api/usertask/redDot`,//获得任务红点
  achievementTaskInfo: `${HOST.OPS_API}/ops/api/achievement-task/info`, // 大师任务资料
  achievementTaskPopup: `${HOST.OPS_API}/ops/api/achievement-task/popup`, // 大师任务弹窗
  getProductInfo: `${HOST.SHOP_API}/shop/api/product/info/`,//根据商品ID获取商品信息
  recordAdLog: `${HOST.PLATFORM_API}/wap/api/user/adLog/recordAdLog`,// 记录广告
  readAdStatus: `${HOST.OPS_API}/ops/api/fee/wheel/readAdStatus`,// 视频广告任务
  updateUseFlag: `${HOST.SHOP_API}/shop/api/wap/welfarebag/updateUseFlag`,//更新我的奖品使用状��
  getExtraInfo: `${HOST.OPS_API}/ops/api/get/bag/getExtraInfo`, // 夺宝加赠
  getBagNotice: `${HOST.OPS_API}/ops/api/get/bag/notice`, // 夺宝轮播
  newUserEggGuide: `${HOST.PLATFORM_API}/wap/api/newuseregg/guide`,// 新手砸蛋
  getLimit: `${HOST.TRANS_API}/trans/api/recharge/limit`, // 获取充值限��
  submitLimit: `${HOST.TRANS_API}/trans/api/recharge/limit`, // 设置充值限��
  sendLimitCode: `${HOST.TRANS_API}/trans/api/recharge/limit/sendSms`, //充值限额页面发送验证码
  getWeekBettingInfo: `${HOST.PLATFORM_API}/task/api/activity/week/task/info`,//周投注的信息 周投注活动开启将不展示每日任��
  getRichList: `${HOST.PLATFORM_API}/wap/api/history/rich`, // 财富��
  getNewUserRankingInfo: `${HOST.OPS_API}/ops/api/new/user/ranking/info`, //新手榜单排行信息
  getNewUserRankingList: `${HOST.OPS_API}/ops/api/new/user/ranking/rank-list`, //新手榜单排行列表

  // 新用户首充开��
  newUserFirstRechargeStatus: `${HOST.TRANS_API}/trans/api/activity/newUserFirstRechargeStatus`,// 用户状态接��
  getMallProductListByType: `${HOST.SHOP_API}/shop/api/mall/getMallProductListByType/`,//（后面跟随商品类型） 礼包信息
  newUserFirstRechargeReturnResult: `${HOST.TRANS_API}/trans/api/activity/newUserFirstRechargeReturnResult`,// 新用户首充抽10倍奖励返奖结果接��
  // 新用户首充结��

  //新用户承接转盘开��
  getNewUserWheelInfo: `${HOST.OPS_API}/ops/api/wheel/newUser/info`,// 新用户承接转盘信��
  getNewUserActivity: `${HOST.SMARTEYES_API}/newuser/activity`,// 新用户承接信��
  //新用户承接转盘结��
  getSurveyInfo: `${HOST.UIC_API}/uic/api/user/questionnaire/haveDo?version=20190801`,//个人中心问卷调查数据
  commitSurveyInfo: `${HOST.UIC_API}/uic/api/user/questionnaire/submit`,//个人中心问卷调查数据提交
  getCouponList: `${HOST.TRANS_API}/trans/api/coupon/tagCoupon`, //精细��获取优惠券信��
  getCoupon: `${HOST.TRANS_API}/trans/api/coupon/drawCoupon/{couponId}`, //精细��领取优惠��

  //获取余额接口结束
  firstLoad: `${HOST.PLATFORM_API}/wap/api/game/firstLoad/0`, // 首次进入接口
  getJackpotState: `${HOST.OPS_API}/ops/api/jackpot/recharge-state`, // 获取奖池瓜分信息
  getShowOpenEggIcon: `${HOST.OPS_API}/ops/api/activity/supreme-state`, //判断是否显示侧边砸蛋图标
  platWelfareTask: `${HOST.PLATFORM_API}/task/api/cost/usertask/platWelfareTask`, // 获取福利任务
  achievementRedDot: `${HOST.PLATFORM_API}/task/api/usertask/achievementRedDot`,//成就任务红点
  weekLoopRemark: `${HOST.PLATFORM_API}/task/api/cost/usertask/weekLoopRemark`,// 任务轮替描述
  getExchangeEnter: `${HOST.PLATFORM_API}/wap/api/fixed/ad/get-list/26`, // 兑换路口增强
  getHot: `${HOST.SHOP_API}/shop/api/mall/gameHShop/fire`, //横版商城
  getActivites: `${HOST.PLATFORM_API}/wap/api/fixed/ad/serving/12`, //横版商城
  getSlider: `${HOST.SHOP_API}/shop/api/mall/newBanner/3`,//横版商城
  getGift: `${HOST.SHOP_API}/shop/api/mall/gameHShop/integration`,//横版商城
  getSlider1: `${HOST.SHOP_API}/shop/api/mall/banner`, //竖版商城轮播
  getPaySlider: `${HOST.PLATFORM_API}/wap/api/fixed/ad/serving/5`, // 支付成功页轮播
  getBtcActive: `${HOST.OPS_API}/ops/user/move/recharge/exposure/activity-info`, //获取btc活动时候开启（胡瑶）
  getBtcPopup: `${HOST.OPS_API}/ops/user/move/recharge/exposure/popup`, //获取btc活动时候开启,首页弹窗（胡瑶）
  //猫身体状态接
  getCatSickState: `${HOST.PETCAT_API}/petcat/api/status/catPlatStatus`,//0:正常��：生�� 2:濒临生病��：恢复健��
  getAcenterAwards: `${HOST.OPS_API}/ops/api/welfarebox/accept`, //活动中心type4 奖励领取
  getRingServerStatus: `${HOST.QUOITS_API}/quoits/api/quoitsgame/serverStatus`, //获取套圈新版还是老板
  acenterIconData: `${HOST.PLATFORM_API}/wap/api/fixed/ad/serving/28`,//活动中心图标接口
  getUserAwards: `${HOST.OPS_API}/ops/api/renren-wheel/user-awards`,//人人转盘奖励
  getUserBankCard: `${HOST.TRANS_API}/trans/api/order/cardNum`,
  picUpload: `${HOST.PLATFORM_API}/wap/api/feedback/uploadImage`, // 反馈图片
  submitProblem: `${HOST.PLATFORM_API}/wap/api/feedback/newFeedback`, // 提交用户反馈��
  getActivityEntry: `${HOST.PLATFORM_API}/wap/api/fixed/ad/serving/29`,//春节聚合入口开��
  sfTipsState: `${HOST.OPS_API}/ops/api/aggregation/activity/bubble`,//春节聚合气泡提醒
  aboutToExpire: `${HOST.TRANS_API}/trans/api/coupon/aboutToExpire`,// 是否存在即将过期优惠��
  getShowCoupons: `${HOST.TRANS_API}/trans/api/coupon/getShowCoupons`,// 优惠券Tips显示文案
  // 校验用户原手机号��
  catrightsInfo: `${HOST.PETCAT_API}/petcat/api/privilege/privilegeList`,//猫权益详��
  catDetail: `${HOST.PETCAT_API}/petcat/api/info/catDetail`,//猫详��
  sdkPrivilegeList: `${HOST.PETCAT_API}/petcat/api/privilege/sdkPrivilegeList`,//猫特权列��
  getCommentList: `${HOST.SHOP_API}/shop/api/award-comment/comment-list/`,//奖品评价信息-评价列表
  getNoCommentList: `${HOST.SHOP_API}/shop/api/award-comment/no-comment-list/`,//奖品评价信息-未评价列��
  getCommentDetail: `${HOST.SHOP_API}/shop/api/award-comment/comment-detail/`,//奖品评价明细
  prizeComment: `${HOST.SHOP_API}/shop/api/award-comment/comment`,//奖品评价信息-奖品评价
  catPropList: `${HOST.SHOP_API}/shop/api/mall/catPropList`,//猫礼��
  frequentPurchaseList: `${HOST.SHOP_API}/shop/api/mall/frequentPurchaseList`,//获取商城模块-经常购买商品列表
  greatPackageList: `${HOST.SHOP_API}/shop/api/mall/greatPackageList`,//超值礼��
  checkOriginalPhoneNo: `${HOST.UIC_API}/uic/api/user/center/checkOriginalPhoneNo`,
  checkUserPayError: `${HOST.TRANS_API}/trans/api/again/order/status`, //检查用户是否有支付失败的订��
  getGoodsMsg: `${HOST.SHOP_API}/shop/api/mall/product/{bizid}`, // 查找商品信息
  isShowScratchCard: `${HOST.TRANS_API}/trans/api/again/order/validate/{orderSn}`, //检查用户是否支持刮刮乐
  getResetPay: `${HOST.TRANS_API}/trans/api/again/order/send/{orderSn}`, //刮刮��
  getRechargeGift: `${HOST.OPS_API}/ops/api/wheel/rechargeGift/receive`,// 笔笔送金叶刮刮卡
  getBigUserInfo: `${HOST.OPS_API}/ops/api/biguser-backflow/inlet`, //获取大户信息
  getSmallUserInfo: `${HOST.OPS_API}/ops/api/small-user-return/inlet`, //获取小户信息
  getUserIsAdult: `${HOST.PLATFORM_API}/wap/api/plat/isAdult`, // 判断用户是否成年
  checkUserOnlineTime: `${HOST.PLATFORM_API}/wap/api/plat/checkUserOnlineTime/`, // 判断未成年用户是否超时or累计时长
  getSelectRecommen: `${HOST.PLATFORM_API}/wap/api/game-search/popularKeyWord`,// 首页搜索热门推荐
  getSelect: `${HOST.PLATFORM_API}/wap/api/game-search/search`, // 首页搜索
  getAddressList: `${HOST.UIC_API}/uic/api/user/receiver/getReceiverInfoNew`, // 获取用户收货地址列表
  getProvince: `${HOST.UIC_API}/uic/api/user/receiver/getProvince`, // 获取省份信息
  getCity: `${HOST.UIC_API}/uic/api/user/receiver/getCity/{province}`, // 获取城市信息
  getArea: `${HOST.UIC_API}/uic/api/user/receiver/getArea/{city}`, //获取区信��
  removeAddress: `${HOST.UIC_API}/uic/api/user/receiver/delete/{id}`, // 删除地址
  addAddress: `${HOST.UIC_API}/uic/api/user/receiver/saveReceiverInfoNew`, // 新增，修改地址
  getUser: `${HOST.UIC_API}/uic/api/user/center/getPhone`, //查询用户手机��发货使用
  getCatVipEntranceState: `${HOST.PETCAT_API}/petcat/api/vip/day/enter`,//猫会员日
  // 获取推荐区域盲盒是否展示
  // getBlindBoxRecommend: `${HOST.PLATFORM_API}/wap/api/fixed/ad/get-list/31`,
  // 探宝狂欢 返利卡倒计��
  getState: `${HOST.OPS_API}/ops/api/rebate-wheel/rate-prop-state/1`,
  getContentCommentListByProductId: `${HOST.SHOP_API}/shop/api/award-comment/phy-awards-comment-list`,//奖品详情评价
  tokenVerify: `${HOST.UIC_API}/uic/api/user/login/tokenVerify`,
  getState: `${HOST.OPS_API}/ops/api/rebate-wheel/rate-prop-state/1`,
  //奇遇任务弹窗接口
  loseWarningPopUp: `${HOST.OPS_API}/ops/api/user/lose/warning/popup`,//奇遇任务激活弹窗
  loseWarningReceive: `${HOST.OPS_API}/ops/api/user/lose/warning/receive/0`,//奇遇任务激活弹窗-领取奖品
  //发现页接口
  //请求头中的version判断，现在设置的version=v1的话就显示
  getFindEntrance: `${HOST.SMARTEYES_API}/wap/api/notice/discovery`,//是否显示发现入口
  getFindRecommend: `${HOST.PLATFORM_API}/wap/api/fixed/ad/get-list/34`,//获取发现页推荐位数据
  getFindRank: `${HOST.PLATFORM_API}/wap/api/notice/discovery/rank-list`,//发现排行榜数据
  getFindDynamicList: `${HOST.PLATFORM_API}/wap/api/notice/discovery/dynamic-list`,//发现页动态数据
  getFindDynamicIncrNum: `${HOST.PLATFORM_API}/wap/api/notice/discovery/lucky-bag`,// 发现页新增动态数据
  getFindDivideBag: `${HOST.PLATFORM_API}/wap/api/notice/lucky/bag/divide/`,//瓜分福袋
  getFindBagRecord: `${HOST.PLATFORM_API}/wap/api/notice/lucky/bag/receive-list/`,//福袋领取记录
  getFindBagShareState: `${HOST.PLATFORM_API}/wap/api/notice/lucky/bag/sharing-status`,//分享状态
  getFindBagShare: `${HOST.PLATFORM_API}/wap/api/notice/lucky/bag/sharing/`,//分享福袋
  getFindBagList: `${HOST.PLATFORM_API}/wap/api/notice/lucky/bag/user/list/`,//用户最近七天的动态
  getFindBagState: `${HOST.PLATFORM_API}/wap/api/notice/lucky/bag/status`,//获取是否存在可领取福袋

  upgradeWheelActivityIcon: `${HOST.OPS_API}/ops/api/upgrade-wheel/activity-icon`,// 拉新活动入口
  btcGetTurntable: `${HOST.OPS_API}/ops/api/user/move/wheel/info`, //btc B端 获取活动信息
  btcGetLotteryAward: `${HOST.OPS_API}/ops/api/user/move/wheel/betting`, //btc B端 获取抽奖的奖励
  btcGetReceive: `${HOST.OPS_API}/ops/api/user/move/wheel/receive`, //btc  C端领取奖励
  btcWheelEntrance: `${HOST.OPS_API}/ops/api/user/move/wheel/entrance`,// btc 转盘查询
  btcDownLoad: `${HOST.OPS_API}/ops/api/user/move/apk-link`, //获取apk的下载地址
  // 100070渠道关闭消息推送
  getCloseSendStatus: `${HOST.UIC_API}/uic/api/user/center/noticeStatus`,
  closeSend: `${HOST.UIC_API}/uic/api/user/center/closeNotice`,
  getMasterStrategy: `${HOST.PLATFORM_API}/wap/api/wap/coterie/info`,
  // 查看头像框信息
  getHeadFrame: `${HOST.UIC_API}/uic/api/user/center/getHeadFrame`,
  // 取消头像框
  cancelHeadFrame: `${HOST.UIC_API}/uic/api/user/center/cancelHeadFrame`,
  // 设置头像框
  useHeadFrame: `${HOST.UIC_API}/uic/api/user/center/useHeadFrame`,
  getReturnBagGameInfo: `${HOST.OPS_API}/ops/api/user-return/activity-popup`,//回流礼包活动入口显示接口
  returnBagTask: `${HOST.OPS_API}/ops/api/user-return/activity-icon`, // 活动入口
  showPack: `${HOST.OPS_API}/ops/api/cdkey/show-pack`, // 是否展示礼包入口(发现页)
  channelGamePack: `${HOST.OPS_API}/ops/api/cdkey/channel-game-pack`, // 渠道下所有游戏礼包列表(发现页)
  getAwardsCDKey: `${HOST.OPS_API}/ops/api/cdkey/getAwards`, // 领取cdKey礼包
  cdkeyStatus: `${HOST.OPS_API}/ops/api/cdkey/status`, // cdKey的领取状态
  getKoiWishInfo: `${HOST.OPS_API}/ops/api/koi-jackpot/popup`, // 锦鲤许愿入口
  findCard: `${HOST.SHOP_API}/shop/api/mall/card/findCard`,//周卡信息
  getCouponBtcInfo: `${HOST.OPS_API}/ops/api/user/move/popup`, //优惠券Btc初始化信息
  CToService: `${HOST.OPS_API}/ops/api/user/move/send`, // 告诉后端立即领取
  CToServiceReceive: `${HOST.OPS_API}/ops/api/user/move/receive`, //C端通知后端发优惠券奖品
  mallCommonListAB: `${HOST.SMARTEYES_API}/shop/api/mall/common-list`, // 商城列表AB
  getThreeHoursInfo: `${HOST.OPS_API}/ops/api/three-hours/index-info`, // 火拼三小时入口
  getAdvertisePosition: `${HOST.PLATFORM_API}/wap/api/fixed/ad/get-list/36`, // 强广
  recommendPackageList: `${HOST.SHOP_API}/shop/api/mall/new/common-list/recommend`,//推荐单品数据
  getAwardPoolCenterHome: `${HOST.PLATFORM_API}/wap/api/award-pool-center/home`, // 奖池汇总
  subscribeOrUnsubscribe: `${HOST.PLATFORM_API}/wap/api/award-pool-center/subscribeOrUnsubscribe`, // 关注该游戏奖池
  getCouponBagProductListByType: `${HOST.SHOP_API}/shop/api/mall/getCouponBagProductListByType/`, //根据productType获取优惠券礼包
  judgeAddAgreement: `${HOST.PLATFORM_API}/wap/api/popup/isOpen/5`,//判断游戏平台是否需要弹出用户协议提示窗
  getAllCard: `${HOST.SHOP_API}/shop/api/mall/card/getAllCard`, // 周卡/月卡首页领取弹窗
  closeAgreementTips: `${HOST.PLATFORM_API}/wap/api/popup/close/5`,//关闭用户协议提示窗不再弹出
  paypreCheck: `${HOST.UIC_API}/uic/api/user/bindphone/check`,  //游客支付前检查
  getEcRedDot: `${HOST.PLATFORM_API}/wap/api/plat/getEcRedDot`,//个人中心专属客服红点、副标题
  getInexpensiveCard: `${HOST.SHOP_API}/shop/api/mall/getTodayGreatPackList`, // 首页弹框超划算礼包
  tjlInlet: `${HOST.PLATFORM_API}/task/api/usertask/tjlInlet`,//淘金令入口
  tjlTaskPanel: `${HOST.PLATFORM_API}/task/api/usertask/tjlTaskPanel`,//任务面板
  getSevenDaysSignEntry: `${HOST.OPS_API}/ops/api/clockin/inlet`, //多多玩连续七天打卡签到入口
  exchangeCDKey: `${HOST.SHOP_API}/shop/api/cdk/exchange/`, // 兑换CDKey
  getNewUserCoupon: `${HOST.TRANS_API}/trans/api/coupon/getNewUserCoupon`, // 新人优惠券包
  couponStayWindow: `${HOST.TRANS_API}/trans/api/coupon/couponStayWindow`, // 优惠券包挽留弹窗
  wechatSendCdkOpen: `${HOST.OPS_API}/ops/api/wechat-send-cdk/open`,//关注公众号发放CDK兑换码活动
}

export default API
