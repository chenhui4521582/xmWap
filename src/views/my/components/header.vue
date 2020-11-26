<template>
  <section class="base-header" :style="bgWrapper">
    <div class="content" :style="bgTheme">
      <div class="base-info" @click="openCenter">
        <div class="avatar-warp avatar-img"
          :class="{showSurveyTips:showSurveyTips,'no-head-frame':!userInfo.headFrame}">
          <img :src="avatar" alt="">
          <div v-if="userInfo.headFrame" class="head-frame">
            <img :src="userInfo.headFrame|filter" alt="">
          </div>
        </div>
        <div class="money-warp">
          <div class="item">
            <span class="item-text">{{userInfo.nickname}}</span>
          </div>
          <div class="item catVipLev" v-if="userInfo.catOwnCat">
            <span class="item-text">Lv.{{userInfo.catVipLev}}</span>
          </div>
        </div>
      </div>
      <div class="catright" @click="goPage('catright')"></div>
      <div class="cdkey" @click="goPage('cdkey')"></div>
      <div class="message" @click="goPage('message')">
        <span class="red" v-if="isMessageUnread"></span>
      </div>
    </div>
  </section>
</template>
<script>
import Services from '@/services/personalCenter'
import { mapState } from 'vuex'
import _get from 'lodash.get'
export default {
  name: 'myHeader',
  props: {
    isMessageUnread: {
      type: Boolean
    }
  },
  data () {
    return {
      showSurveyTips: false,
      catSickSate: false
    }
  },
  computed: {
    ...mapState(['userInfo', 'userSign', 'FILE_HOST', 'redDot']),
    routerName () {
      return this.$route.name
    },
    avatar () {
      return !this.userInfo.head
        ? `${this.FILE_HOST}/cdn/common/images/common/img_photo.png`
        : `${this.FILE_HOST}${this.userInfo.head}`
    },
    bgWrapper () {
      let signBg = _get(this, '$moduleConfig.my.bgImg', '')
      if (signBg) {
        return {
          'background-image': 'url(' + signBg + ')',
          'background-size': '100%',
          'background-repeat': 'no-repeat'
        }
      }
      return {
        background: 'none'
      }
    },
    bgTheme () {
      return {
        background: _get(this, '$moduleConfig.my.bgColor', '#ff4141')
      }
    },
  },
  mounted () {
    if (!localStorage.getItem('survey_entrance')) {
      this.getSurveyInfo()
    }
    this.getCatSickState()
  },
  methods: {
    // 跳转页面
    goPage (name) {
      let points = {
        'message': 'A_H5PT0022002674',
        'catright': 'A_H5PT0021002805',
        'cdkey': 'A_H5PT0021004366'
      }
      points[name] && this.$marchSetsPoint(points[name], { cat_status: this.catSickSate })
      this.$router.push({ name })
    },
    // 打开个人中心
    openCenter () {
      this.$marchSetsPoint('A_H5PT0021001122')
      this.$router.push({ name: 'personalCenter' })
    },
    async getSurveyInfo () {
      const res = await Services.getSurveyInfo()
      if (res.data.code === 200) {
        this.showSurveyTips = res.data.data && !res.data.data.haveDo
      }
    },
    async getCatSickState () {
      const res = await Services.getCatSickState()
      if (res.data.code === 200) {
        this.catSickSate = res.data.data == 1//猫身体状态 0:正常，1：生病, 2:濒临生病，3：恢复健康
      }
    }
  }
}
</script>
<style lang="less" scoped>
@baseHeader: 130px;
* {
  box-sizing: border-box;
}
.base-header {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  z-index: 10;
}
.redTitle {
  position: relative;
  height: 70px;
  padding: 22px 24px 0;
  font-size: 32px;
  text-align: center;
  line-height: 1.2;
  font-weight: bold;
  color: #fff;
  .iconfont {
    position: absolute;
    left: 24px;
    top: 24px;
    font-size: 30px;
  }
}
.content {
  padding: 30px 24px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #ff4141;
}
.base-info {
  flex: 1;
  display: flex;
  min-width: 0;
}
.avatar-warp {
  height: 90px;
  width: 90px;
  position: relative;
  box-sizing: border-box;
  flex: 0 90px;
  img {
    width: 80px;
    height: 80px;
    position: absolute;
    top: 5px;
    left: 5px;
  }
  &.no-head-frame {
    height: 80px;
    width: 80px;
    border-radius: 50%;
    border: 3px solid #daa400;
    box-sizing: content-box;
    flex: 0 80px;
    img {
      top: 0;
      left: 0;
    }
  }
  .head-frame {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    img {
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }
  }
  &.showSurveyTips:before {
    content: '参与调研有奖';
    position: absolute;
    bottom: -65px;
    left: -14px;
    padding-top: 14px;
    font-size: 20px;
    color: #fff;
    width: 158px;
    height: 70px;
    line-height: 56px;
    text-align: center;
    box-sizing: border-box;
    background: url('../image/tipsbg.png');
    background-size: 100% 100%;
    animation: toggleTip 1.2s linear infinite;
    z-index: 1;
  }
}
.avatar-img {
  margin-top: 6px;
}
.money-warp {
  margin-left: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  .item {
    display: flex;
    align-content: center;
    img {
      width: 30px;
    }
    .item-text {
      line-height: 50px;
      font-size: 32px;
      font-weight: bold;
      color: #ffffff;
      width: 220px;
      display: block;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    &.catVipLev {
      width: 80px;
      height: 30px;
      background: url('../image/catrights/catLevelBg.png');
      background-size: 100% 100%;
      .item-text {
        text-align: center;
        line-height: 30px;
        font-size: 20px;
        font-weight: 500;
        color: rgba(255, 255, 255, 1);
      }
    }
  }
  .item-tag {
    font-size: 0;
  }
  .item-all {
    display: flex;
    height: 50px;
    margin-top: 25px;
    align-content: center;
    line-height: 50px;
    font-size: 32px;
    font-weight: 700;
    color: #333333;
    span {
      width: 100%;
      display: block;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
}
.catright {
  position: relative;
  width: 140px;
  height: 42px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: url('../image/catrights/catRightBtn.png');
  background-size: 100% 100%;
  margin-right: 28px;
}
.cdkey {
  position: relative;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: url('../image/cdkey_icon.png');
  background-size: 100% 100%;
  margin-right: 26px;
}
.message {
  position: relative;
  width: 40px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: url('../image/message_icon.png');
  background-size: 100% 100%;
  .red {
    overflow: hidden;
    position: absolute;
    right: 0;
    top: -5px;
    width: 15px;
    height: 15px;
    border-radius: 50%;
    background: #e8382b;
    border: 2px solid #fff;
  }
}
.tag {
  span {
    padding: 0 10px;
    display: inline-block;
    height: 24px;
    background-color: #c28501;
    color: #fff;
    font-size: 16px;
    border-radius: 12px;
    display: table-cell;
    text-align: center;
    vertical-align: middle;
    text-align: center;
  }
}
@keyframes toggleTip {
  0% {
    bottom: -65px;
  }

  50% {
    bottom: -55px;
  }

  100% {
    bottom: -65px;
  }
}
</style>


