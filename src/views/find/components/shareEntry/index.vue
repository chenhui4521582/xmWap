<template>
  <div class="find_share">
    <div class="share-entry" id="share-entry" @click="headerClick">
      <img src="../../images/share/shareicon.png" alt />
    </div>
    <Modal v-model="showModal" class="rule-pop" :centerScroll="true" title="金叶子不足"
      :closeButtonShow=false :saveText="'前往充值'" @on-save="goToMall">
      <p style="text-align: center">当前金叶子不足{{leafNumber}},<br>无法分享</p>
    </Modal>
    <com-pop v-model="showSharePop" :title="title" :buttonShow="false"
      :classObj="{sharesuccess:title=='分享成功'}" @on-close="closeShare">
      <div class="share-pop-container">
        <template v-if="title=='好运分享'">
          <img src="../../images/share/fudai.png" alt="" class="fudai">
          <p>
            <span class="item">置顶您的好运动态</span>
            <span class="item">好运将通过福袋分享给其他用户</span>
          </p>
          <div class="btn" :class="{'btn-gray':countdownTime}" @click="gotoshare">
            {{!countdownTime?'我要分享':`${countdownTime}后可用`}}
          </div>
          <p class="tips" v-if="countdownTime">当前有用户正在分享好运</p>
        </template>
        <template v-else-if="title=='动态选择'">
          <template v-if="listData.length">
            <div class="select-container">
              <better-scroll ref="scroll" :data="listData" :listenScroll="true" :probeType="3">
                <ul ref="gameListItems">
                  <li ref="navItem" v-for="(item, index) in listData" :key="index"
                    @click="listSelectIndex=index" :class="{selected:listSelectIndex==index}">
                    <img src="../../images/share/unchecked.png" alt=""
                      v-if="listSelectIndex!=index">
                    <img src="../../images/share/checked.png" alt="" v-else>
                    <div class="list_content">
                      <div class="list_remark"
                        v-html="item.remark.replace('【','[').replace('】','] ')"></div>
                      <div class="list_time">{{item.timeline}}</div>
                    </div>
                  </li>
                </ul>
              </better-scroll>
            </div>
            <p class="p_yellow">
              提示：选择的动态会置顶，其他玩家可以 通过此动态抢好运福袋
            </p>
            <div class="btn" @click="grantShare">20000金叶 塞入福袋</div>
          </template>
          <template v-else>
            <p class="p_yellow">
              提示：当前你没有好运动态可以分享哦
            </p>
            <p>以下游戏很多人收获好运哦，选择一款 去获得好运动态</p>
            <ul class="list_games">
              <li v-for="(item, index) in games" :key="index" @click="gotogame(item)">
                <img :src="item.icon|filter" alt="">
                <div class="game_name">{{item.name}}</div>
              </li>
            </ul>
          </template>
        </template>
        <template v-else>
          <p class="p_yellow">
            <span class="item">你的好运</span>
            <span class="item">已经传递给其他小伙伴啦</span>
          </p>
          <div class="btn" @click="gotocheck">立即查看</div>
        </template>
      </div>
    </com-pop>
  </div>
</template>
<script>
import findServices from '@/services/find'
import _get from 'lodash.get'
import { jumpUrl } from '../../../../utils/utils'
import { mapActions, mapState } from 'vuex'

export default {
  name: 'shareEntry',
  props: {
    noticeId: {
      type: Number,
      default: 0
    },
    countdownTime: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      showSharePop: false,
      showModal: false,
      title: '好运分享',
      listSelectIndex: 0,
      listData: [],
      games: [{
        'name': '欢乐竞技台球',
        'type': 2,
        'url': '/billiards/',
        'icon': '/group1/M00/13/1A/CmcEHVv-SFqAMAEIAAAeJwt7x-0365.png'
      }, {
        'name': '糖果萌消消',
        'type': 12,
        'url': '/crush/',
        'icon': '/group1/M00/0C/23/CmcEHVu9c6aAalG_AAAiU--VNUY849.png',
        'remark': '当下最爽萌消除'
      }, {
        'name': '街机欢乐捕鱼',
        'type': 10,
        'url': '/fish/',
        'icon': '/group1/M00/0C/22/CmcEHVu9a56AckjBAAAi1ETP_qI265.png',
        'remark': '击杀深海巨龙'
      }],
      // countdownTime: '',
      leafNumber: 20000
    }
  },
  computed: {
    ...mapState(['userInfo'])
  },
  components: {
    comPop: () => import('./components/comPop'),
    BetterScroll: () => import('@/components/betterScroll/betterScroll')
  },
  methods: {
    ...mapActions({
      _getUserInfo: 'GET_USERINFO' // 获取用户信息
    }),
    /** 图标点击 **/
    async headerClick () {
      //H5平台-发现-好运分享功能点击
      this.$marchSetsPoint('A_H5PT0272003288')
      const { data, code, message } = (await findServices.getFindBagShareState()).data
      this.showSharePop = true
      if (code == 200) {
        //H5平台-发现-好运分享可用弹窗加载完成A_H5PT0272003289
        //H5平台-发现-好运分享不可用弹窗加载完成A_H5PT0272003291
        this.$marchSetsPoint(data.countDown ? 'A_H5PT0272003291' : 'A_H5PT0272003289')
        this.showSharePop = true
      } else {
        this.$Toast(message)
      }
    },
    /** 图标动画 **/
    iconAnimation () {
      let element = document.getElementById('share-entry')
      window.addEventListener('touchstart', event => {
        let touch = event.touches[0]
        this.startY = touch.pageY
      })
      window.addEventListener('touchend', event => {
        let touch = event.changedTouches[0]
        let endY = this.startY - touch.pageY
        // 上滑
        if (endY > 5) {
          element.classList.add('hide')
          element.classList.remove('show')
        } else {
          element.classList.add('show')
          element.classList.remove('hide')
        }
      })
    },
    /*我要分享*/
    async gotoshare () {
      if (this.countdownTime) {
        return
      }
      //H5平台-发现-好运分享可用弹窗-我要分享点击
      this.$marchSetsPoint('A_H5PT0272003290')
      this.showSharePop = false
      const { data, code, message } = (await findServices.getFindBagList(this.noticeId)).data
      if (code == 200) {
        //H5平台-发现-好运分享-动态选择弹窗加载完成A_H5PT0272003292
        this.$marchSetsPoint('A_H5PT0272003292')
        this.title = '动态选择'
        this.listData = data
        //H5平台-发现-好运分享-无动态可选弹窗加载完成
        this.listData.length == 0 && this.$marchSetsPoint('A_H5PT0272003296')
        this.showSharePop = true
      } else {
        this.$Toast(message)
      }
    },
    /*玩游戏*/
    gotogame (item) {
      this.$marchSetsPoint('A_H5PT0272003297', {
        target_project_name: item.type
      })
      jumpUrl(item)
      this.closeShare()
    },
    /*去充值*/
    goToMall () {
      //H5平台-发现-好运分享-金币不足弹窗-前往充值点击
      this.$marchSetsPoint('A_H5PT0272003295')
      this.$router.push('/payment')
    },
    /*塞叶子分享福袋*/
    async grantShare () {
      //H5平台-发现-好运分享-动态选择弹窗-支付金叶点击A_H5PT0272003293
      this.$marchSetsPoint('A_H5PT0272003293')
      this.showSharePop = false
      //叶子不足
      if (this.userInfo.amount < this.leafNumber) {
        //H5平台-发现-好运分享-金币不足弹窗加载完成
        this.$marchSetsPoint('A_H5PT0272003294')
        this.showModal = true
      } else {
        const { data, code, message } = (await findServices.getFindBagShare(this.listData[this.listSelectIndex].id)).data
        if (code == 200) {
          //H5平台-发现-好运分享-分享成功弹窗加载完成A_H5PT0272003298
          this.$marchSetsPoint('A_H5PT0272003298')
          this.title = '分享成功'
          this.showSharePop = true
          this._getUserInfo()//更新叶子数
        } else if (code == 102) {
          //H5平台-发现-好运分享-金币不足弹窗加载完成
          this.$marchSetsPoint('A_H5PT0272003294')
          this.showModal = true
        } else {
          //H5平台-发现-好运分享-分享失败弹窗加载完成A_H5PT0272003299
          this.$marchSetsPoint('A_H5PT0272003299')
          this.$Toast(message)
        }
      }
    },
    /*分享成功立即查看*/
    gotocheck () {
      this.showSharePop = false
      this.$emit('getNewShare', 1)
    },
    /*弹窗close*/
    closeShare () {
      if (this.title == '分享成功') {
        this.$emit('getNewShare', 0)
      }
      this.title = '好运分享'
      this.listSelectIndex = 0
    }
  },
  mounted () {
    // this.iconAnimation()
  },
  watch: {
    showSharePop (val) {
      if (!val) {
        this.closeShare()
      }
    }
  }
}
</script>
<style lang="less" scoped>
.find_share {
  .share-entry {
    position: fixed;
    z-index: 10;
    left: -15px;
    top: 550px;
    width: 125px;
    height: 140px;
    img {
      vertical-align: top;
      width: 125px;
      height: 140px;
    }
    &.show {
      transition: all 0.2s;
      transform: translate(0, 0);
      opacity: 1;
    }
    &.hide {
      transition: all 0.2s;
      transform: translate(-100%, 0);
      opacity: 0;
    }
  }
}

.share-pop-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  .fudai {
    width: 254px;
    height: 208px;
  }
  p {
    font-size: 24px;
    font-weight: 400;
    color: rgba(255, 255, 255, 1);
    line-height: 36px;
    margin: 15px 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    &.p_yellow {
      color: rgba(255, 234, 0, 1);
    }
    &.tips {
      margin: 0;
      font-size: 20px;
      font-weight: bold;
      color: rgba(255, 155, 173, 1);
    }
  }
  .btn {
    width: 376px;
    height: 90px;
    background: url('../../images/share/btn.png');
    background-size: 100% 100%;
    font-size: 24px;
    font-weight: bold;
    color: rgba(188, 71, 0, 1);
    padding-bottom: 20px;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: center;
    &.btn-gray {
      padding-bottom: 16px;
      color: rgba(255, 255, 255, 1);
      background: url('../../images/share/btn_gray.png');
      background-size: 100% 100%;
    }
  }
  .select-container {
    height: 335px;
    margin-top: 16px;
    ul {
      li {
        width: 440px;
        height: 100px;
        font-size: 20px;
        color: rgba(255, 255, 255, 1);
        font-weight: 500;
        line-height: 30px;
        display: flex;
        align-items: center;
        border-bottom: 1px solid rgba(255, 255, 255, 0.3);
        img {
          width: 30px;
          height: 30px;
          margin-right: 14px;
        }
        .list_content {
          width: 396px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          .list_remark {
            width: 320px;
            max-height: 100px;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 3;
            overflow: hidden;
          }
          .list_time {
            font-size: 16px;
            font-weight: bold;
            color: rgba(182, 64, 80, 1);
            line-height: 36px;
            align-self: flex-end;
          }
        }
        &.selected {
          color: rgba(255, 234, 0, 1);
          background: url('../../images/share/checkedbg.png');
          background-size: 100% 100%;
        }
      }
    }
  }
  .list_games {
    width: 100%;
    height: 180px;
    background: rgba(194, 75, 52, 0.5);
    border-radius: 20px;
    display: flex;
    padding: 0 10px;
    box-sizing: border-box;
    justify-content: space-between;
    align-items: center;
    font-size: 20px;
    font-weight: 500;
    color: rgba(255, 255, 255, 1);
    line-height: 30px;
    margin-bottom: 50px;
    li {
      display: flex;
      flex-direction: column;
      align-items: center;
      img {
        width: 80px;
        height: 80px;
        margin: 0 auto 10px;
      }
    }
  }
}
</style>
