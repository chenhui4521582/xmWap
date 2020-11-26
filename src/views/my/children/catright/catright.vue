<template>
  <div class="catright-wrap" :class="{'showHeader': $moduleConfig.isShowHeader}">
    <wf-header title="我的特权"/>
    <div class="catright-content" v-if="userInfo">
      <div class="catright-title">
        <div class="img-wrap">
          <img :src="`${require(`../../image/catrights/pic${userInfo.catOwnCat?1:0}.png`)}`" alt="">
        </div>
        <div class="item-content">
          <div class="item">
            <span class="lev">{{userInfo.catOwnCat?'Lv.'+userInfo.catVipLev:'暂无'}}</span>
            <span class="fish">
              <img src="../../image/catrights/fish.png" alt="" class="fish_icon">
              <span v-html="moneyComputed(userInfo.catDriedFish)+'g'"></span>
            </span>
            <img src="../../image/catrights/rule.png" alt="" class="rule_icon" @click="showHelp">
          </div>
          <div class="item">
            <div class="percent-wrap">
              <div class="percent"
                   :style="{width: (detailData.experience - detailData.levelExperience) / (detailData.nextLevelExperience - detailData.levelExperience)*100+ '%'}"
                   v-if="detailData">
              </div>
            </div>
            {{userInfo.catOwnCat?'再喂养'+(detailData&&detailData.nextDriedFish)+'g鱼干,可升至Lv.'+(userInfo.catVipLev+1):'赶快去领养招财猫特权'}}
          </div>
        </div>
        <div class="item-right" @click="gotocat(0,null)">{{userInfo.catOwnCat?'喂食升级':'去领养猫'}}</div>
      </div>
      <div class="myrights">
        <div class="item">
          <span class="radio">我的特权 <i>{{actData.length}}/{{actData.length+inActData.length}}</i></span>
        </div>
        <div class="item">
          <div class="info">点击图标和名称可查看详情</div>
        </div>
      </div>
      <div class="catright-list">
        <div class="catright-item" v-for="item in actData">
          <div class="img-wrap" :class="{frozen:catSickSate==1}" @click="showDetail(item,1)">
            <img :src="item.imgUrl|filter" alt="">
          </div>
          <!--以下特权不带按钮：
          1.炫酷跑马灯 8
          2.加速审核 12-->
          <div class="item-content" @click="showDetail(item,1)" :class="{nobtn:[8,12].includes(item.privilegeType)}">
            <div class="title">{{item.privilegeName}} <i
              v-if="item.nextStage">Lv.{{item.nextStage.privilegeLevel}}可升级</i></div>
            <p>{{item.tips.simpleDesc}}</p>
          </div>
          <!--以下特权不带按钮：
          1.炫酷跑马灯 8
          2.加速审核 12-->
          <div class="item-right" @click="gotocat(1,item)" v-if="![8,12].includes(item.privilegeType)">
            {{getActBtnName(item.privilegeType)}}
          </div>
        </div>
        <div class="catright-item" v-for="item in inActData">
          <div class="img-wrap lock" @click="showDetail(item,0)">
            <img :src="item.imgUrl|filter" alt="">
          </div>
          <div class="item-content" @click="showDetail(item,0)">
            <div class="title">{{item.privilegeName}} <i>Lv.{{item.privilegeLevel}}可获得</i></div>
            <p>{{item.tips.simpleDesc}}</p>
          </div>
          <div class="item-right lock" @click="gotocat(0,item)" :class="{nocat:!userInfo.catOwnCat}">
            去升等级
          </div>
        </div>
      </div>
    </div>
    <!--鱼干提示说明-->
    <Modal v-model="showFishTip" type="2" :title="'鱼干是什么'" :closeIcon2Show="true" :closeButtonShow="false"
           save-text="知道了" @on-save="showFishTip=false">
      <div class="fishtip-wrap">
        <p>1.鱼干是猫道具,喂养鱼干可提升招财猫等级,达到对应等级后可获得特权。</p>
        <p>
          2.游戏中每消耗1000金叶子,可自动获得1g鱼干。游戏包括：欢乐竞技台球、糖果萌消消、街机欢乐捕鱼、众神风云、王者弹珠、深海探一探、三国大作战、欢乐小鸟、枪火英雄(物资争夺玩法不算)、狂热斗地主(只算桌费)、去玩麻将(只算桌费)、生肖大作战(只算桌费)</p>
      </div>
    </Modal>
    <!--游戏提示说明-->
    <Modal v-model="showGameTip" :title="'去玩游戏'" :closeButtonShow="false"
           :saveButtonShow="false" @on-close="gamepopclose">
      <div class="gametip-wrap">
        <div class="item" v-for="(item,index) in games" @click="gotogame(item,index)">
          <img :src="item.icon|filter" alt="">
          <span>{{item.name}}</span>
        </div>
      </div>
    </Modal>
    <!--特权冻结提示说明-->
    <Modal v-model="showFrozenTip" :title="'特权被冻结'" :closeIcon2Show="true" :closeButtonShow="false"
           save-text="去恢复猫" @on-save="recoveryCat">
      <div class="frozentip-wrap">
        <p>您的猫生病了,特权被冻结暂不可使用。</p>
        <p><i>任意充值</i>使猫恢复健康后才可继续使用。</p>
        <p>
          提示：每自然周（周一到周日）须至少喂养<i>30g鱼干</i>,否则在当周结束后猫会<i>生病</i>。</p>
      </div>
    </Modal>
    <!--点击详情提示说明-->
    <Modal v-model="showDetailPop" :title="''" :closeButtonShow="false"
           :save-text="detailBtnName" @on-save="gotocat(currentItem.isActive,currentItem)" @on-close="closeDetailPop" :buttonShow="buttonShow">
      <div class="detailtip-wrap" v-if="currentItem">
        <div class="detailtip-item">
          <div class="img-wrap"
               :class="{frozen:currentItem.isActive&&catSickSate==1,lock:!currentItem.isActive}">
            <img :src="currentItem.imgUrl|filter" alt="">
          </div>
          <div class="detailinfo">
            <div class="detailname">{{currentItem.privilegeName}}</div>
            <div class="detailcontent">{{currentItem.tips.detailedDesc}}</div>
          </div>
        </div>
        <div class="detailtip-desc"
             :class="{nonextupdate:currentItem.isActive&&catSickSate!=1&&!currentItem.nextStage,buttonShow:buttonShow}">
          <template v-if="currentItem.isActive">
            <template v-if="catSickSate==1">
              猫生病，权益被冻结，<br>
              任意充值使猫恢复健康后可继续使用
            </template>
            <template>
              {{currentItem.nextStage?'猫等级达Lv.'+currentItem.nextStage.privilegeLevel+'可升至'+currentItem.nextStage.privilegeName:'该权益暂不可升级'}}
            </template>
          </template>
          <template v-else>
            猫等级达Lv.{{currentItem.privilegeLevel}}可获得此特权
          </template>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script>
  import { mapState } from 'vuex'
  import { jumpUrl } from '../../../../utils/utils'
  import { getCatDetail, getCatrightsInfo, getCatSickState } from '@/services/user'

  export default {
    name: 'catright',
    data() {
      return {
        showFishTip: false,//鱼干说明提示
        showGameTip: false,//去玩游戏说明提示
        showFrozenTip: false,//特权冻结提示
        showDetailPop: false,//详情弹窗
        actData: [],//激活的特权数据
        inActData: [],//未激活的特权数据
        games: [
          {
            id: 28911,
            name: '糖果萌消消',
            type: 12,
            url: '/crush/',
            icon: '/group1/M00/0C/23/CmcEHVu9c6aAalG_AAAiU--VNUY849.png'
          },
          {
            id: 28913,
            name: '欢乐竞技台球',
            type: 2,
            url: '/billiards/',
            icon: '/group1/M00/13/1A/CmcEHVv-SFqAMAEIAAAeJwt7x-0365.png'
          },
          {
            id: 28915,
            name: '深海探一探',
            type: 20,
            url: '/gofish/',
            icon: '/group1/M00/15/6D/CmcEHVw4SBmAaEAeAABXGl7JAAk559.jpg'
          }, {
            id: 28912,
            name: '王者弹珠',
            type: 21,
            url: '/Marbles/',
            icon: '/group1/M00/18/3A/CmcEHFxJhY2AbMQeAABVazGI3Po786.png'
          }, {
            id: 28905,
            name: '众神风云',
            type: 18,
            url: '/square',
            icon: '/group1/M00/12/91/CmcEHVv3pyqAEdoGAAC0zRpZ3KE738.png'
          }],//游戏列表
        detailData: null,//猫详情数据
        catSickSate: 0,//猫身体状态 0:正常,1：生病, 2:濒临生病,3：恢复健康
        currentItem: null,//点击详情的当前特权数据
        detailBtnName: '',//详情弹窗按钮文案
        buttonShow:false
      }
    },
    computed: {
      ...mapState(['userInfo'])
    },
    methods: {
      moneyComputed(val, type) {
        if (!val) {
          return '0'
        }
        if (type === 'call') {
          val = val / 10
        }
        if (val < 10000) {
          return val
        } else {
          return (val / 10000).toFixed(2) + '<span style="font-size:0.8rem">万</span>'
        }
      },
      showHelp(){
        this.showFishTip=true
        //招财猫-特权中心(无猫)-鱼干帮助点击
        !this.userInfo.catOwnCat&&this.$marchSetsPoint('A_ZCM0062002806',{
          cat_status:this.catSickSate==1
        })
      },
      gotocat(flag, item) {
        if (this.detailBtnName = '去玩游戏') {
          this.showDetailPop = false
          this.detailBtnName = ''
        }
        if (flag == 0) {
          if(this.userInfo.catOwnCat&&item&&item.hasOwnProperty('isActive')){
            this.$marchSetsPoint('A_ZCM0062002815',{
              cat_status:this.catSickSate==1
            })
          }else{
            //招财猫-特权中心(无猫)-去领养猫点击A_ZCM0062002807
            //招财猫-特权中心(有猫)-喂食升级点击A_ZCM0062002809
            !item&&this.$marchSetsPoint(this.userInfo.catOwnCat?'A_ZCM0062002809':'A_ZCM0062002807',{
              cat_status:this.catSickSate==1
            })
            //招财猫-特权中心(无猫)-去获得点击A_ZCM0062002808
            item&&!this.userInfo.catOwnCat&&this.$marchSetsPoint('A_ZCM0062002808',{
              cat_status:this.catSickSate==1,
              awards_id:item.privilegeId
            })
          }
          jumpUrl({ url: '/petcat/' }, null)
        } else {
          if(![4,10].includes(item.privilegeType)&&item.hasOwnProperty('isActive')){
            this.$marchSetsPoint(this.catSickSate == 1?'A_ZCM0062002818':'A_ZCM0062002816',{
              cat_status:this.catSickSate==1
            })
          }else{
            this.$marchSetsPoint([4,10].includes(item.privilegeType)?'A_ZCM0062002812':'A_ZCM0062002811',{
              cat_status:this.catSickSate==1,
              awards_id:item.privilegeId
            })
          }
          this.gotouse(item)
        }
      },
      gotouse(item) {//已激活特权 按钮逻辑
        // 以下特权使用“立即使用”：
        // 1.优惠券-类型6,点击后进入猫并打开优惠券领取弹窗；
        // 2.猫转盘-类型3,点击后进入猫并打开转盘弹窗；
        // 3.保险箱-类型5,点击后进入猫并打开保险箱弹窗
        // 4.补给箱-类型14,点击后进入猫并打开补给箱弹窗
        // 5.盈利榜橡皮擦-类型7,点击后前往平台盈利榜
        // 6.专属客服-类型11,点击后打开专属客服页
        // 以下特权使用“去玩游戏”：
        // 1.鱼干加成-类型4,点击后有游戏弹窗让用户选择；
        // 2.动画加速-类型10,点击后有游戏弹窗让用户选择
        let typeFlag = {// privilegeType 和游戏内弹窗对应类型
          '3': 3,//猫转盘-类型3
          '5': 4,//保险箱-类型5
          '6': 2,//优惠券-类型6
          '14': 5//补给箱-类型14
        }
        if (this.catSickSate == 1) {
          this.showFrozenTip = true
        } else {
          if ([4, 10].includes(item.privilegeType)) {//4.鱼干加成 10.动画加速
            this.showGameTip = true
          } else if ([7, 11].includes(item.privilegeType)) {
            //盈利榜橡皮擦-类型7 专属客服-类型11
            if (item.privilegeType == 7) {
              this.$router.push('/profitlist?from=index')
            } else {
              this.$router.push('/my/customerService')
            }
          } else {
            if (!typeFlag[item.privilegeType]) {
              jumpUrl({ url: '/petcat/' }, null)
            } else {
              jumpUrl({ url: '/petcat/' }, null, '&catright=' + typeFlag[item.privilegeType])
            }
          }
        }
      },
      getActBtnName(privilegeType) {
        switch (privilegeType) {
          case 4:
          case 10:
            return '去玩游戏'
            break
          default:
            return '立即使用'
            break
        }
      },
      gotogame(item, index) {//去玩游戏
        this.$marchSetsPoint('A_ZCM0062002813',{
          cat_status:this.catSickSate==1,
          target_project_id:item.id
        })
        jumpUrl({
          url: item.url
        })
      },//getCatSickState
      gamepopclose(){
        //招财猫-特权中心(有猫)-去玩游戏-点击关闭
        this.$marchSetsPoint('A_ZCM0062002814',{
          cat_status:this.catSickSate==1
        })
      },
      async getCatDetail() {
        let { code, data } = await getCatDetail()
        if (code == 200) {
          this.detailData = data
        }
      },
      async getCatrightsInfo() {
        let { code, data } = await getCatrightsInfo()
        if (code == 200) {
          this.catSickSate = data.frozenStatus
          //已激活特权
          this.actData = (data.privilegeDetails || []).map(item => {
            let obj = item.privilegeInfo
            obj.tips = JSON.parse(item.privilegeInfo.tips)
            //获得已激活特权的可升级的下一等级
            obj.nextStage = item.nextPrivilegeInfo
            return obj
          })
          this.inActData = (data.privileges || []).map(item => {
            item.tips = JSON.parse(item.tips)
            return item
          })
        }
      },
      recoveryCat() {//冻结特权按钮去恢复猫 跳到平台商城
        this.$marchSetsPoint('A_ZCM0062002819',{
          cat_status:this.catSickSate==1
        })
        this.$router.push('/payment')
      },
      showDetail(item, flag) {
        //招财猫-特权中心(有猫)-查看特权详情A_ZCM0062002810
        this.userInfo.catOwnCat&&this.$marchSetsPoint('A_ZCM0062002810',{
          cat_status:this.catSickSate==1,
          awards_id:item.privilegeId
        })
        this.currentItem = Object.assign(item, {
          isActive: flag
        })
        this.detailBtnName = flag ? (this.catSickSate == 1 ? '去恢复猫' : this.getActBtnName(this.currentItem.privilegeType)) : this.userInfo.catOwnCat ? '去升等级' : '去领养猫'
        this.buttonShow=!(this.currentItem.isActive&&this.catSickSate!=1&&[8,12].includes(this.currentItem.privilegeType))
        this.showDetailPop = true
      },
      closeDetailPop(){
        this.detailBtnName='';
        this.$marchSetsPoint('A_ZCM0062002817',{
          cat_status:this.catSickSate==1
        })
      }
    },
    async mounted() {
      this.getCatDetail()
      this.getCatrightsInfo()
    }
  }
</script>

<style lang="less" scoped>
  .catright-wrap {
    min-height: 100vh;
    background: #f7f7f7;
    padding-top: 10px;
    padding-bottom: 20px;
    &.showHeader {
      padding-top: 100px;
    }
    .catright-content {
      padding: 0 24px;
      .catright-title {
        height: 150px;
        background: rgba(255, 250, 212, 1);
        box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.08);
        border-radius: 16px;
        margin-bottom: 40px;
        display: flex;
        align-items: center;
        .img-wrap {
          width: 101.5px;
          height: 101.5px;
          flex: 0 101.5px;
          overflow: hidden;
          margin-left: 19px;
          margin-right: 9px;
          img {
            width: 101.5px;
          }
        }
        .item-content {
          width: 392px;
          height: 103px;
          .item {
            &:nth-child(1) {
              display: flex;
              align-items: center;
              .lev {
                font-size: 32px;
                font-weight: bold;
                color: rgba(0, 0, 0, 1);
                width: 102px;
              }
              .fish {
                font-size: 24px;
                font-weight: 400;
                color: rgba(0, 0, 0, 1);
                display: flex;
                border-left: 1px solid rgba(212, 201, 121, 1);
              }
              .fish_icon {
                width: 30px;
                height: 30px;
                margin: 0 7px 0 18px;
              }
              .rule_icon {
                width: 24.11px;
                height: 24.11px;
                margin-left: 15px;
              }
            }
            &:nth-child(2) {
              font-size: 20px;
              font-weight: 500;
              color: rgba(136, 136, 136, 1);
              .percent-wrap {
                position: relative;
                width: 340px;
                height: 16px;
                background: rgba(255, 255, 255, 1);
                border-radius: 8px;
                overflow: hidden;
                margin: 7px 0;
                .percent {
                  background: #ffbc00;
                  height: 100%;
                }
              }
            }
          }
        }
        .item-right {
          width: 130px;
          height: 42px;
          background: rgba(255, 65, 65, 1);
          border-radius: 10px;
          font-size: 24px;
          font-weight: 500;
          color: rgba(255, 255, 255, 1);
          text-align: center;
          line-height: 42px;
        }
      }
      .myrights {
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
        margin-bottom: 8px;
        .radio {
          font-size: 28px;
          font-weight: bold;
          color: rgba(0, 0, 0, 1);
          i {
            font-size: 24px;
            font-weight: 400;
            color: rgba(255, 65, 65, 1);
          }
        }
        .info {
          font-size: 24px;
          font-weight: 400;
          color: rgba(187, 187, 187, 1);
        }
      }
      .catright-list {
        .catright-item {
          height: 120px;
          width: 100%;
          box-sizing: border-box;
          border-radius: 16px;
          display: flex;
          align-items: center;
          background: rgba(255, 255, 255, 1);
          margin-bottom: 20px;
          &:last-child {
            margin-bottom: 0;
          }
          .img-wrap {
            width: 72px;
            height: 72px;
            flex: 0 72px;
            overflow: hidden;
            border-radius: 12px;
            margin-left: 23px;
            margin-right: 16px;
            position: relative;
            display: flex;
            align-items: center;
            img {
              width: 72px;
            }
            &.lock {
              &:before {
                content: '';
                width: 72px;
                height: 72px;
                position: absolute;
                background: url("../../image/catrights/lock.png");
                background-size: 100% 100%;
                z-index: 1;
              }
            }
            &.frozen {
              &:before {
                content: '';
                width: 72px;
                height: 72px;
                position: absolute;
                background: url("../../image/catrights/frozen.png");
                background-size: 100% 100%;
                z-index: 1;
              }
            }
          }
          .item-right {
            width: 130px;
            height: 42px;
            background: rgba(255, 65, 65, 1);
            border-radius: 10px;
            font-size: 24px;
            font-weight: 500;
            color: rgba(255, 255, 255, 1);
            text-align: center;
            line-height: 42px;
            &.lock {
              background: rgba(255, 120, 0, 1);
            }
            &.nocat {
              background: #acacac;
              color: #fff;
            }
          }
          .item-content {
            flex: 1;
            .title {
              font-size: 24px;
              color: #000;
              font-weight: bold;
              margin-bottom: 5px;
              height: 35px;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
              i {
                font-size: 20px;
                font-weight: 500;
                color: rgba(255, 120, 0, 1);
              }
            }
            p {
              max-height: 60px;
              overflow: hidden;
              text-overflow: ellipsis;
              display: -webkit-box;
              -webkit-line-clamp: 2;
              -webkit-box-orient: vertical;
              font-size: 20px;
              color: #888888;
            }
            &:not(.nobtn) {
              max-width: 348px;
              margin-right: 64px;
            }
          }
        }
      }
    }
  }

  .fishtip-wrap {
    font-size: 24px;
    font-weight: 400;
    line-height: 36px;
    color: rgba(136, 136, 136, 1);
  }

  .gametip-wrap {
    display: flex;
    flex-wrap: wrap;
    .item {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 123px;
      margin-right: 20px;
      margin-top: 40px;
      img {
        width: 80px;
        height: 80px;
      }
      span {
        margin-top: 7px;
        font-size: 20px;
        font-weight: 500;
        line-height: 26px;
        color: rgba(136, 136, 136, 1);
      }
      &:nth-child(3n) {
        margin-right: 0;
      }
    }
  }

  .frozentip-wrap {
    font-size: 24px;
    font-weight: 400;
    line-height: 36px;
    color: #888888;
    i {
      color: #000000;
    }
    .whysick {
      text-align: right;
      color: rgba(81, 134, 202, 1);
    }
  }

  .detailtip-wrap {
    .detailtip-item {
      display: flex;
      padding-bottom: 44px;
      border-bottom: 1px solid rgba(204, 204, 204, 1);
      .img-wrap {
        width: 72px;
        height: 72px;
        flex: 0 72px;
        overflow: hidden;
        border-radius: 12px;
        margin-right: 16px;
        position: relative;
        display: flex;
        align-items: center;
        img {
          width: 72px;
        }
        &.lock {
          &:before {
            content: '';
            width: 72px;
            height: 72px;
            position: absolute;
            background: url("../../image/catrights/lock.png");
            background-size: 100% 100%;
            z-index: 1;
          }
        }
        &.frozen {
          &:before {
            content: '';
            width: 72px;
            height: 72px;
            position: absolute;
            background: url("../../image/catrights/frozen.png");
            background-size: 100% 100%;
            z-index: 1;
          }
        }
      }
      .detailinfo {
        width: 320px;
        .detailname {
          font-size: 28px;
          font-weight: bold;
          line-height: 42px;
          color: rgba(0, 0, 0, 1);
        }
        .detailcontent {
          font-size: 20px;
          font-weight: 500;
          line-height: 30px;
          color: rgba(136, 136, 136, 1);
        }
      }
    }
    .detailtip-desc {
      font-size: 24px;
      font-weight: 500;
      color: rgba(0, 0, 0, 1);
      text-align: center;
      line-height: 36px;
      padding: 17px 0;
      &.nonextupdate {
        color: rgba(187, 187, 187, 1);
      }
      &.buttonShow{
        border-bottom: 1px solid rgba(204, 204, 204, 1);
      }
    }
  }
</style>
