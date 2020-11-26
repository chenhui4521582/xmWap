<template>
  <section class="channel-task" v-if="isShow">
    <div class="title">
      <p>
        <span><i class="line"></i>福利任务</span>
      </p>
    </div>
    <div class="list">
      <ul>
        <li v-for="(item, index) in task" :key="index" @click="handClick(item, index)">
          <div class="icon">
            <img :src="item.icon | filter" alt="">
          </div>
          <div class="content">
            <div class="name">
              <span v-html="item.taskName"></span>
              <img class="problem-icon" src="../img/grey-problem-icon.png" alt=""
                @click.stop="showRulePop(item.taskDescImg)" v-if="item.taskDescImg">
            </div>
            <div class="progress">
              <div class="progress-bg">
                <div class="progress-bar" :style="{ width: countWidth(item) }"></div>
                <div class="progress-text">
                  {{ item.finishNum | conversion }}/{{ item.taskOps | conversion }}
                </div>
              </div>
              <div class="awards">
                <img :src="item.awardsImage | filter" alt="" />
                <span>{{ item.awardsName }}</span>
              </div>
            </div>
          </div>
          <div class="btn" v-if="item.taskStatus == 0">领取</div>
          <div class="btn play" v-if="item.taskStatus == 1">去完成</div>
          <div class="btn received" v-if="item.taskStatus == 2">
            已领取
          </div>
        </li>
      </ul>
    </div>
    <!-- 领取弹出框 -->
    <awards-dialog v-model="showAwards" :awards="awards" @callback="awardsCallback(1)"
      tipsTxt="恭喜您任务完成" confirmBtnText="马上去兑奖" @closedCallback="awardsCallback(0)" />
    <Modal v-model="showRule" class="rule-pop" title="说明" :closeButtonShow=false :saveText="'知道了'"
      :type="2" @on-save="closeRulePop()">
      <div class="rule-img-wrapper">
        <img :src="ruleImg | filter" alt="">
      </div>
    </Modal>
    <div class="pnl_downloadPop" v-if="showDownLoadPop">
      <div class="mask"></div>
      <div class="content">
        <i class="iconfont icon-close" @click="showDownLoadPop=false"></i>
        <div class="title">下载多多玩 福利多多</div>
        <div class="step1" v-if="!hasBind">
           <div class="step">
            <img src="../img/pic_step1.png" />
          </div>
          <input type="number" v-model.trim="phone" placeholder="请输入手机号" id="txtPhone" />
          <div class="pnl_code">
            <input type="number" v-model.trim="code" placeholder="请输入验证码" id="txtCode" />
            <div class="sendCode">
              <div class="btn_getCode" v-if="!countTime" @click="getSMS">获取验证码</div>
              <div class="countdown" v-else>{{countTime}}</div>
            </div>
          </div>
          <div class="btn_bind" @click="bindPhone">立即绑定</div>
          <div class="tip">
            绑定手机号，优惠券才能发放到账
          </div>
        </div>
        <div v-else class="step2">
           <div class="step">
            <img src="../img/pic_step2.png" />
          </div>
           <div class="desc">
            用手机号 {{displayPhone}} 登录多多玩，即能领取优惠券。
          </div>
          <!-- <form method="get" id="download_form" :action="downLoadAddress"></form> -->
          <div class="btn_download" @click="downloadAPP">立即下载</div>
          <a href="javascript:void(0)" class="link_copy"  v-clipboard:copy="downLoadAddress" v-clipboard:success="copyDownloadLink">复制下载链接</a>
          <div class="tip">
            如点击立即下载，无法正常下载，可点击复制下载链接在浏览器中打开进行下载
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import Services from '@/services/SDK'
import services from '@/services/index'
import { getPhoneCode, bindMobilePhone, getPhoneBindInfo } from '@/services/user'
import { mapState, mapActions } from 'vuex'
import { jumpUrl } from '@/utils/utils'
import _get from 'lodash.get'
export default {
  name: '',
  components: {},
  data () {
    return {
      showAwards: false,
      awards: {
        awardsImage: '',
        awardsName: ''
      },
      downLoadAddress:'',
      hasBind:false,
      displayPhone:'',
      phone:'',
      code:'',
      countTime:0,
      task: [],
      showRule: false,
      showDownLoadPop: false,
      ruleImg: ''
    }
  },
  computed: {
    ...mapState(['agreementPopType']),
    isShow () {
      return this.task && this.task.length > 0
    }
  },
  filters: {
    conversion (value) {
      if (value >= 10000) {
        return `${Math.floor(value / 1000) / 10}万`
      } else {
        return value
      }
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    ...mapActions({
      updateUserInfo: 'GET_USERINFO'
    }),
    downloadAPP(){
      // document.getElementById('download_form').submit();
      //get submit 会丢失get参数
      location.href=this.downLoadAddress;
      
    },
    copyDownloadLink(){
      this.$Toast('下载链接已复制')
    },
    getSMS(){
      let mobileReg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/
      if (this.phone === '') {
        this.$Toast('请输入手机号码')
        return
      }
      if (!mobileReg.test(this.phone)) {
        this.$Toast('请输入正确的手机号码')
        return
      }

      getPhoneCode(this.phone).then(res => {
        let { code, data, message } = res;
        if (code === 200) {
          this.$Toast('短信验证码已发送，注意查收')
          this.countDown()
        } else {
          this.$Toast(message)
          clearInterval(this.time)
        }
      })
    },
    async bindPhone(){
      let phoneReg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/
      if (this.phone === '') {
        this.$Toast('请输入手机号码')
        return
      }
      if (!phoneReg.test(this.phone)) {
        this.$Toast('请输入正确的手机号码')
        return
      }
      if (this.code === '') {
        this.$Toast('请输入短信验证码')
        return
      }
      const { code, data, message } = await bindMobilePhone(this.phone, this.code)
      if (code === 200) {
        this.$Toast('绑定成功', () => {
          this.getphoneBind();
        })
      } else {
        this.$Toast(message)
      }
    },
    /** 倒计时 60 **/
    countDown () {
      let date = 59
      clearInterval(this.timer)
      this.countTime = '60秒后重发'
      this.timer = setInterval(() => {
        date = date - 1
        if (date < 0) {
          date = 0
          clearInterval(this.timer)
          this.countTime = ''
          return false
        }
        this.countTime = date + '秒后重发'
      }, 1000)
    },
    init () {
      Services.platWelfareTask({
      }).then(res => {
        const { code, data } = res.data
        if (code == 200) {
          this.task = data || []
        }
      })
    },
    getphoneBind(){
      getPhoneBindInfo().then(res => {
        const { code, data } = res
        if (code == 200) {
          /** 没有绑定手机号的时候打开弹框 **/
          const { existsFlag,phone } = data
          if (existsFlag) {
            this.hasBind = true
            this.displayPhone = phone;
          }
        }
      })
    },
    countWidth (item) {
      if (item.finishNum && item.taskOps) {
        let count =
          item.finishNum / item.taskOps > 1 ? 1 : item.finishNum / item.taskOps
        return count * 100 + '%'
      } else {
        return '0%'
      }
    },
    async handClick (item, index) {
      if (item.taskId) {
        switch (item.taskStatus) {
          case 0:
            if(this.agreementPopType==1){//需要弹窗
              this.$emit('showAgreementPop')
              return
            }
            this._taskFinish(item)
            break
          case 1:
            this.goFinish(item)
            break
          case 2:
            this.awardsCallback(2)
            break
        }
      }
    },
    async _taskFinish (item) {
      let { taskId, taskLogId, showAwardsImage, awardsName, flag } = item
      Services.taskFinish({ taskId, taskLogId }).then(res => {
        let { code, message, data } = res.data
        if (code == 200) {
          /** 打开弹出框 **/
          /** 后端不改兼容前端修改兼容性 **/
          let finishImage = _get(data, 'showAwardsImage', '') || showAwardsImage
          let finishName = _get(data, 'awardsName', '') || awardsName
          this.openAwards(finishImage, finishName)
          this.$marchSetsPoint('A_H5PT0022002292', {
            target_project_id: 2,
            entrance: 'task'
          })
          /** 更新头部我的信息 **/
          this.updateUserInfo()
        } else {
          this.$Toast(message)
        }
      })
    },
    goFinish (item) {
      let { gameType, url, action, taskId, taskName, index } = item
      this.$marchSetsPoint('A_H5PT0022002291', {
        position_id: index + 1,
        target_project_id: gameType,
        task_id: taskId,
        task_name: taskName
      })
      let actionsArr = [39, 35, 34, 32]

      //下载多多玩
      if(action == 102){
        this.getphoneBind();
        this.downLoadAddress = url;
        this.showDownLoadPop = true;
      }
      // 跳转到首页
      else if (action == 36 || url == '/plat/') {
        this.$router.push('/')
      }
      // 跳转商城
      else if (actionsArr.includes(action)) {
        parent.location.href = this.shopUrl
      }
      //跳转问卷调查
      else if (url == 'prizesurvey') {
        this.$router.push('/personalCenter/survey')
      }
      /** 百度底bar 跳转地址转发,统一一版本后删除 **/
      else if (this.$moduleConfig.urlReword && this.$moduleConfig.urlReword[url]) {
        parent.location.href = this.$moduleConfig.urlReword[url]
      }
      else{
        jumpUrl(item)
      }
    },
    openAwards (awardsImage, awardsName) {
      this.showAwards = true
      this.awards.awardsImage = awardsImage
      this.awards.awardsName = awardsName
    },
    awardsCallback (type) {
      this.showAwards = false
      this.init()
    },
    showRulePop (taskDescImg) {
      if (taskDescImg) {
        this.ruleImg = taskDescImg
      } else {
        this.ruleImg = ''
      }
      this.showRule = true
    },
    closeRulePop () { this.showRule = false }
  }
}
</script>

<style lang="less" scoped>
.channel-task {
  margin: 60px 24px 24px;
  .title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    p {
      display: flex;
      align-items: center;
      margin-bottom: 4px;
      color: #e8382b;
      font-size: 24px;
      margin-left: 10px;
      line-height: 1;
    }
    span {
      &:first-child {
        color: #303133;
        font-size: 32px;
        font-weight: bold;
        line-height: 1.1;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        i {
          margin-right: 10px;
          width: 6px;
          height: 32px;
          border-radius: 3px;
          background: #ff4141;
        }
      }
    }
  }
  .problem-icon {
    width: 24px;
    height: 24px;
    margin-left: 9px;
  }
  .list {
    li {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px 0;
      position: relative;
      overflow: hidden;
      border-bottom: 1px solid #e6e6e6;
      .icon {
        overflow: hidden;
        margin-right: 20px;
        min-width: 72px;
        max-width: 72px;
        height: 72px;
        border-radius: 50%;
        img {
          vertical-align: top;
          width: 100%;
          height: 100%;
        }
      }
      .content {
        flex: 1;
        .name {
          margin-bottom: 14px;
          color: #000;
          font-size: 28px;
          font-weight: bold;
          line-height: 1.2;
        }
        .progress {
          display: flex;
          justify-content: flex-start;
          align-items: center;
          .progress-bg {
            background: #fff;
            width: 200px;
            position: relative;
            height: 24px;
            border-radius: 8px;
            overflow: hidden;
            margin-right: 20px;
            .progress-bar {
              background-color: #ffbc00;
              position: absolute;
              height: 100%;
              left: 0;
            }
          }
          .progress-text {
            font-size: 20px;
            color: #575757;
            height: 24px;
            line-height: 24px;
            text-align: center;
            position: absolute;
            left: 0;
            right: 0;
            margin: auto;
          }
          .awards {
            display: flex;
            justify-content: flex-start;
            align-items: center;
            background-size: 100% 100%;
            border-radius: 0 20px 20px 0;
            height: 30px;
            img {
              width: 30px;
              height: 30px;
            }
            span {
              display: block;
              padding: 0 5px;
              font-size: 24px;
              height: 30px;
              line-height: 30px;
              color: #ff5e00;
              font-weight: bold;
              text-align: center;
              white-space: nowrap;
              max-width: 172px;
              overflow: hidden;
              text-overflow: ellipsis;
            }
          }
        }
        .description {
          font-size: 24px;
          color: #999999;
        }
      }
      .btn {
        color: #fff;
        font-size: 24px;
        border-radius: 16px;
        text-align: center;
        box-sizing: border-box;
        min-width: 150px;
        max-width: 150px;
        height: 56px;
        line-height: 56px;
        font-weight: 500;
        white-space: nowrap;
        background: rgba(255, 120, 0, 1);
        &.play {
          background-color: #ff4141;
        }
        &.gray {
          background: #fff;
          color: #ff4141;
        }
        &.received {
          position: relative;
          background: #e0e0e0;
          color: #ff4141;
        }
      }
      &:last-child {
        border-bottom: none;
      }
    }
  }
  .rule-pop {
    .rule-img-wrapper {
      margin: 0 -24px;
      max-height: 600px;
      overflow-x: hidden;
      overflow-y: scroll;
      img {
        width: 100%;
      }
    }
    .text {
      color: #888;
      font-size: 24px;
      font-weight: 400;
    }
  }
  .pnl_downloadPop {
    position: fixed;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    z-index: 11;

    .icon-close{
      position: absolute;
      top: 20px;
      right: 20px;
      font-size:18px;
      color:#888;
    }

    .mask {
      position: absolute;
      left: 0;
      top: 0;
      right: 0;
      bottom: 0;
      z-index: 10;
      background: rgba(0, 0, 0, 0.6);
    }
    .content{
      position: absolute;
      top:155px;
      left: calc((100% - 470px)/2);
      width: 470px;
      height: 650px;
      border-radius:32px;
      background: #fff;
      z-index:12;
      .title{
        display: block;
        font-size: 28px;
        font-weight: bold;
        margin-top: 42px;
        text-align: center;
      }
      .step
      {
        img{
          margin: 25px 53px;
          width: 368px;
          height: 157px;
        }
      }
      .desc{
        display: block;
        margin: 7px auto;
        border-top: 1px solid #EEE;
        padding-top:13px;
        width:408px;
        font-size:24px;
        font-weight:400;
        line-height:36px;
      }
      .btn_download,.btn_bind
      {
        width:410px;
        height:70px;
        background:rgba(255,65,65,1);
        border-radius:16px;
        margin: 25px auto;
        font-size:24px;
        text-align: center;
        font-weight: 500;
        line-height: 70px;
        color:#fff;
      }
      .link_copy
      {
        display: block;
        font-size:20px;
        color:rgba(81,134,202,1);
        margin:30px auto 20px auto;
        width:120px;
        text-decoration: underline;
      }
      .tip{
        width:400px;
        height:58px;
        font-size:20px;
        font-weight:500;
        line-height:30px;
        font-size:20px;
        color: #bbb;
        margin:0 auto;
        text-align: center;
      }
      #txtPhone{
        display: block;
        width:410px;
        height:70px;
        background:rgba(247,247,247,1);
        border-radius:16px;
        margin:10px auto;
        font-size:24px;
        line-height: 36px;
        padding-left: 20px;
      }
      .pnl_code
      {
        position: relative;
        display: block;
        width:410px;
        margin:10px auto;

        #txtCode
        {
          width:100%;
          height:70px;
          background:rgba(247,247,247,1);
          border-radius:16px;
          font-size:24px;
          line-height: 36px;
          padding-left: 20px;
          padding-right:160px;
        }
        .sendCode
        {
          position: absolute;
          top:17px;
          right:19px;
          font-size:24px;
          color:rgba(255,120,0,1);
          border-left: 1px solid rgba(230,230,230,1);
          padding-left: 14px;
        }
      }
    }
  }
}
</style>
