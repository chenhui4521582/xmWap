<template>
<div class="select">
  <div class="header">
    <div class="wrap">
      <div class="icon">
        <img src="../img/select-icon.png" alt="">
      </div>
      <div class="input" @click="clickInput">
        <input ref="inputGroup" type="text" v-model="value" placeholder="搜索您感兴趣的游戏" @input="checkInput" @keyup.13="getSelect">
      </div>
      <div class="clear-btn" v-if="isSelect" @click="clear">
        <img src="../img/clear-btn.png" alt="">
      </div>
      <div class="select-btn active" v-if="isSelect" @click="getSelect">搜索</div>
      <div class="select-btn" v-else>搜索</div>
    </div>
    <div class="cancel-btn" @click="handleCancel">取消</div>
  </div>
  <div class="center">
    <div class="recommend" v-if="showRecommend">
      <div class="title">热门搜索</div>
      <ul class="recommend-list">
        <li v-for="(item, index) in recommend" :key="index" @click="handleRemmend(index)">{{item}}</li>
      </ul>
    </div>
    <div class="select-center" v-if="showSelectCenter">
      <div class="item" v-for="(item, index) in list" :key="index" @click="goGame(item)">
        <div class="icon">
          <img :src="item.icon | filter" alt="">
          <img v-if="item.jackpotStatus == 1" src="../img/jackpotStatus.gif" alt="" class="corner1" >
        </div>
        <div class="text">
          <p class="name">{{item.name}}</p>
          <p class="remark">{{item.remark}}</p>
        </div>
        <div class="start-btn">开始</div>
        <div class="corner" v-if="item.corner">
          <img :src="item.corner |filter" alt="">
        </div>
      </div>
    </div>
    <div class="no-list" v-if="noList">
      <div class="icon">
        <img src="../img/no-select.png" alt="">
      </div>
      <p>没有找到相关的游戏</p>
    </div>
  </div>
</div>
</template>
<script>
import Services from '@/services/index'
import {jumpUrl} from '@/utils/utils'
import _get from 'lodash.get'
export default {
  name: 'indexSelect',
  data: () => ({
    value: '',
    list: [],
    recommend: [],
    showRecommend: true,
    noList: false
  }),
  computed: {
    isSelect() {
      return this.value.length
    },
    showSelectCenter() {
      return this.list.length
    }
  },
  methods: {
    handleCancel() {
      this.$router.push({
        name: 'index'
      })
      this.$marchSetsPoint('A_H5PT0019002877')
    },
    handleRemmend(index) {
      this.value = this.recommend[index]
      this.getSelect()
      this.$marchSetsPoint('A_H5PT0019002878', {
        awards_name: this.value
      })
    },
    clickInput () {
      this.$marchSetsPoint('A_H5PT0019002876')
    },
    clear() {
      this.value = ''
      this.$refs.inputGroup.focus()
      this.$marchSetsPoint('A_H5PT0019002879')
    },
    getSelect() {
      if(!this.isSelect) {return false}
      this.showRecommend = false
      let userInfo = window.localStorage.getItem('user_Info')
      if( userInfo!= 'undefined' && userInfo) {
        userInfo = JSON.parse(userInfo)
        let userID = userInfo.userId
        Services.getSelect({
          userId: userID,
          value: this.value
        }).then(res=> {
          let {code, data, message} = _get(res, 'data')
          if(code == 200) {
            this.list = _get(res, 'data.data', [])
            this.$refs.inputGroup.blur()
            if(!this.list.length) {
              this.noList = true
              this.$marchSetsPoint('A_H5PT0019002882')
            }else {
              this.noList = false
              this.$marchSetsPoint('A_H5PT0019002880')
            }
          }else {
            this.noList = true
            this.$marchSetsPoint('A_H5PT0019002882')
          }
        })
      }
    },
    getRecommend() {
      Services.getSelectRecommen().then(res=> {
        let {code, data, message} = _get(res, 'data')
        if(code == 200) {
          this.recommend = _get(res, 'data.data', [])
        }
      })
    },
    goGame(item) {
      this.$marchSetsPoint('A_H5PT0019002881', {
        target_project_id: item.type
      })
      jumpUrl({url: item.url})
    },
    checkInput() {
      this.value = this.value.substr(0, 10)
    },
  },
  mounted() {
    this.getRecommend()
    this.$refs.inputGroup.focus()
    this.$marchSetsPoint('A_H5PT0019002875')
  }
}
</script>
<style lang="less" scoped>
.select {
  background: #F7F7F7;
  min-height: 100vh;
  .header {
    padding: 10px 0 10px 24px;
    height: 90px;
    background: #fff;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .wrap {
      flex: 1;
      padding-left: 20px;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      height: 100%;
      background: #F7F7F7;
      border-radius: 35px;
      .icon {
        margin-right: 13px;
        width: 36px;
        height: 36px;
        img {
          vertical-align: top;
          width: 100%;
          height: 100%;
        }
      }
      .input {
        flex: 1;
        width: 390px;
        line-height: 44px;
        input {
          vertical-align: top;
          width: 100%;
          line-height: 44px;
          caret-color: #888;
        }
      }
      .clear-btn {
        margin-right: 20px;
        flex-shrink: 0;
        width: 28px;
        height: 28px;
        img {
          vertical-align: top;
          width: 100%;
          height: 100%;
        }
      }
      .select-btn {
        width: 90px;
        font-size: 24px;
        color: #E6E6E6;
        text-align: center;
        line-height: 50px;
        border-left:1px solid#E6E6E6;
        &.active {
          color: #FF7800;
        }
      }
    }
    .cancel-btn {
      width: 94px;
      color: #5186CA;
      font-size: 24px;
      text-align: center;
    }
  }
  .recommend {
    padding: 30px 0 0 30px;
    .title {
      font-size: 24px;
      color: #000;
      font-weight:400;
      margin-bottom: 25px;
    }
    .recommend-list {
      overflow: hidden;
      li {
        margin: 0 16px 30px 0;
        float: left; 
        width: 210px;
        height: 56px;
        line-height: 56px;
        text-align: center;
        color: #888888;
        font-size: 24px;
        background: #EDEDED;
        border-radius: 16px;
      }
    }
  }
  .select-center {
    padding: 20px 24px 0;
    .item {
      position: relative;
      margin-bottom: 12px;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      height: 144px;
      background: #fff;
      border-radius:16px;
      .icon {
        position: relative;
        margin: 14px;
        width: 104px;
        height: 104px;
        img {
          vertical-align: top;
          width: 100%;
          height: 100%;
        }
        .corner1 {
          position: absolute;
          bottom: 0;
          left: -8px;
          width: 112px;
          height: 37px;
          img {
            vertical-align: top;
            width: 100%;
            height: 100%;
          }
        }
      }
      .text {
        height: 64px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        .name {
          color: #000;
          font-size: 24px;
        }
        .remark {
          color: #888888;
          font-size: 20px;
        }
      }
      .start-btn {
        position: absolute;
        right: 20px;
        top: 49px;
        width:110px;
        height:42px;
        background: #FF4141;
        border-radius:10px;
        text-align: center;
        line-height: 44px;
        color: #fff;
        font-size: 24px;
      }
      .corner {
        position: absolute;
        right: 0;
        top: 0;
        width:50px;
        height:30px;
        border-radius: 0 16px 0 16px;
        img {
          vertical-align: top;
          width: 100%;
          height: 100%;
        }
      }
    }
  }
  .no-list {
    .icon {
      padding: 302px 0 0 163px;
      img {
        vertical-align: top;
        width: 338px;
        height: 226px;
      }
    }
    p {
      margin-top: 24px;
      text-align: center;
      color: #888888;
      font-size: 24px;
    }

  }
}
</style>