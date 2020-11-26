<template>
  <main class="head-frame-wrapper">
    <wfHeader bgColor="#fff" title="头像挂件"></wfHeader>
    <article class="nMain" :class="{'showHeader': $moduleConfig.isShowHeader}">
      <section class="review-wrapper">
        <img class="head-img" v-if="headImg" :src="headImg|filter" alt="">
        <img class="head-img" v-else
          src="//file.beeplaying.com/cdn/common/images/common/img_photo.png" alt="">
        <div class="head-frame" v-show="selectHeadFrame.id">
          <img :src="selectHeadFrame.frameUrl|filter" alt="">
        </div>
        <p :class="{'red-text':selectHeadFrame.frameName&&!selectHeadFrame.type}">
          <span>{{selectHeadFrame.description||'暂无装扮挂件'}}</span><br />
          <span v-if="selectHeadFrame.frameName">{{selectHeadFrame.type?'获得的挂件':'即可获得挂件'}}</span>
        </p>
      </section>
      <section class="head-frame-list">
        <h5>已获得挂件<span> ({{haveList.length||0}})</span> </h5>
        <ul>
          <template v-if="haveList.length">
            <li v-for="(item,index) in haveList" :class="{'selected':item.id===selectFrameId}"
              :key="`have-${index}`" @click="selected(item)">
              <div class="tag">
                <span v-if="item.type===1">使用中</span>
              </div>
              <img :src="item.frameUrl|filter" alt="">
              <p>{{item.frameName}}</p>
            </li>
          </template>
          <template v-else>
            <li class="empty">
              <div class="empty-content">
                空
              </div>
              <p>暂无挂件</p>
            </li>
          </template>
        </ul>
      </section>
      <section class="head-frame-list not-have" v-if="notHaveList.length">
        <h5>未获得挂件</h5>
        <ul>
          <li v-for="(item,index) in notHaveList" :class="{'selected':item.id===selectFrameId}"
            :key="`no-have-${index}`" @click="selected(item)">
            <div class="tag">
            </div>
            <img :src="item.frameUrl|filter" alt="">
            <p>{{item.frameName}}</p>
          </li>
        </ul>
      </section>
    </article>
    <div class="btn" :class="`type-${btnType}`" @click="handleClick">
      {{btnText}}
    </div>
  </main>
</template>

<script>
import Services from '@/services/personalCenter'
import _get from 'lodash.get'
export default {
  name: 'headFrame',
  components: {

  },
  data () {
    return {
      list: [],
      headImg: '',
      frameId: null,
      selectFrameId: null,
      selectHeadFrame: {}
    }
  },
  computed: {
    haveList () {
      return this.list.filter(item => item.type)
    },
    notHaveList () {
      return this.list.filter(item => !item.type)
    },
    btnType () {
      let type = 0
      if (!this.haveList.length && !this.selectFrameId) {
        type = 1
      } else if (this.selectFrameId) {
        switch (this.selectHeadFrame.type) {
          case 0:
            type = 4
            break
          case 1:
            type = 3
            break
          case 2:
            type = 2
            break
        }
      }
      return type
    },
    btnText () {
      switch (this.btnType) {
        case 1:
          return '暂无'
        case 3:
          return '卸下挂件'
        case 4:
          return '马上去获得'

        default:
          return '立即装扮 '
      }
    }
  },
  mounted () {
    this.getHeadFrame()
    this.$marchSetsPoint('A_H5PT0124003432') // H5平台-我的-个人中心-头像挂件页面加载完成
  },
  methods: {
    async getHeadFrame () {
      const res = await Services.getHeadFrame()
      const data = _get(res, 'data.data', {})
      this.list = data.headFrameList
      this.headImg = data.headImg
      this.frameId = data.frameId
      this.selectFrameId = null
      this.getHeadFrameParams(this.frameId)
    },
    getHeadFrameParams (id) {
      let params = {}
      if (id) {
        let index = this.list.findIndex(item => item.id === id)
        params = this.list[index]
      }
      this.selectHeadFrame = params
    },
    async cancelHeadFrame () {
      this.$marchSetsPoint('A_H5PT0124003434') // H5平台-我的-个人中心-头像挂件-卸下挂件点击
      const res = await Services.cancelHeadFrame()
      const code = _get(res, 'data.code', 0)
      if (code === 200) {
        this.$Toast('您已卸下头像挂件')
        this.getHeadFrame()
      }
    },
    async useHeadFrame () {
      this.$marchSetsPoint('A_H5PT0124003433', {
        awards_id: this.selectHeadFrame.id,
        awards_name: this.selectHeadFrame.frameName,
      }) // H5平台-我的-个人中心-头像挂件-立即装扮点击
      let param = { value: this.selectFrameId }
      const res = await Services.useHeadFrame(param)
      const code = _get(res, 'data.code', 0)
      const message = _get(res, 'data.message', '')
      if (code === 200) {
        this.$Toast('装扮成功～～')
        this.getHeadFrame()
      } else if (code === 101) {
        this.$Toast(message)
      }
    },
    selected (item) {
      this.selectFrameId = item.id
      this.getHeadFrameParams(this.selectFrameId)
    },
    handleClick () {
      switch (this.btnType) {
        case 2:
          this.useHeadFrame()
          break
        case 3:
          this.cancelHeadFrame()
          break

        default:
          break
      }
    }
  }
}
</script>

<style lang="less" scoped>
.head-frame-wrapper {
  background: #f7f7f7;
  min-height: calc(100vh - 20px);
  box-sizing: border-box;
  font-size: 24px;
  font-weight: 400;
  .nMain {
    padding: 24px;
    margin: 20px auto 60px;
    &.showHeader {
      margin-top: 100px;
    }
  }
  .review-wrapper {
    margin: 54px auto 42px;
    text-align: center;
    position: relative;
    color: #888;
    line-height: 36px;
    .head-img {
      width: 120px;
      height: 120px;
      margin-bottom: 20px;
    }
    p {
      height: 72px;
      &.red-text {
        color: #ff4141;
      }
    }
    .head-frame {
      width: 150px;
      height: 150px;
      position: absolute;
      top: -15px;
      left: 50%;
      transform: translateX(-50%);
      img {
        width: 100%;
        height: 100%;
      }
    }
  }
  .head-frame-list {
    margin-bottom: 39px;
    h5 {
      margin-bottom: 16px;
      span {
        color: #ff4141;
      }
    }
    ul {
      display: flex;
      flex-wrap: wrap;
      li {
        width: 216px;
        height: 270px;
        background: #fff;
        border-radius: 16px;
        text-align: center;
        font-weight: 400;
        .tag {
          font-size: 20px;
          height: 30px;
          margin: 10px 10px 3px;
          text-align: left;
          span {
            text-align: center;
            height: 30px;
            line-height: 30px;
            background: #ff7800;
            display: inline-block;
            padding: 0 10px;
            color: #fff;
            border-radius: 6px;
          }
        }
        img {
          width: 150px;
          height: 150px;
          margin-bottom: 20px;
        }
        &.empty {
          background: #f0f0f0;
          color: #bbb;
          text-align: center;
          .empty-content {
            width: 150px;
            height: 150px;
            font-size: 32px;
            background: #f7f7f7;
            border: 3px #e2e2e2 dashed;
            border-radius: 50%;
            margin: 50px auto 15px;
            line-height: 148px;
          }
        }
        &.selected {
          border: 3px solid #fbafaf;
        }
        &:not(:nth-child(3n)) {
          margin-right: 12px;
          margin-bottom: 12px;
        }
      }
    }
    &.not-have {
      ul {
        li {
          color: #bbb;
          img {
            opacity: 0.4;
          }
        }
      }
    }
  }
  .btn {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 90px;
    color: #fff;
    font-size: 24px;
    text-align: center;
    line-height: 90px;
    font-weight: 500;
    &.type-0,
    &.type-4 {
      background: #fbafaf;
    }
    &.type-1 {
      background: #bbb;
    }
    &.type-2 {
      background: #ff4141;
    }
    &.type-3 {
      background: #ff7800;
    }
  }
}
</style>
