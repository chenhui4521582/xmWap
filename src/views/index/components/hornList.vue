<template>
  <div class="horn">
    <div class="horn-icon">
      <img src="../img/tips-icon.png" alt="" />
    </div>
    <div class="horn-list">
      <div ref="hornDivWraper">
        <ul ref="hornUl" id="hornUl" :style="hornStyles">
          <li v-for="(item,index) in noticeList" :key="index" ref="hornLi" @click.stop="jumpGame(item)">
            <span v-html="item.remark"></span>
          </li>
        </ul>
        <ul id="copyHornUl" :style="copyStyles"></ul>
      </div>
    </div>
  </div>
</template>
<script>
import services from '@/services/index'
import _get from 'lodash.get'
import { jumpUrl } from '@/utils/utils'

export default {
  data () {
    return {
      noticeList: [],
      hornStyles: {
        width: `${this.wrapWidth}px`,
        left: 0
      },
      copyStyles: {
        width: `${this.wrapWidth}px`,
        left: 0
      },
      wrapWidth: 0
    }
  },
  mounted () {
    services.getNoticeList().then(res => {
      this.noticeList = _get(res, 'data.data', [])
      this.noticeList.forEach(item => {
        if (item.url) {
          item.remark = `${
            item.remark
            } <em style="color:#FF4141">点我【中大奖】<em/>`
        }
      })
      this.wrapWidth = this.$refs.hornDivWraper && this.$refs.hornDivWraper.offsetWidth
      this.newHornLogic()
    })
  },
  methods: {
    async jumpGame (item) {
      this.$marchSetsPoint('A_H5PT0019000198', {
        target_project_id: item.type,
        task_id: item.id,
        task_name: item.url.split('/')[1]
      })

      if (!item.url) return
      jumpUrl(item)
    },
    newHornLogic () {
      this.$nextTick(() => {
        let hornUl = document.getElementById('hornUl')
        let nodes = document.getElementById('copyHornUl'),
        liNodes = this.$refs.hornLi
        if(nodes && hornUl){
          nodes.innerHTML = hornUl.innerHTML
        }

        let offsetWidth = 0

        liNodes &&
          liNodes.map((item, index) => {
            offsetWidth += item.offsetWidth
          })

        // 设置UL宽度
        this.hornStyles.width = `${offsetWidth}px`
        this.copyStyles.width = `${offsetWidth}px`
        this.copyStyles.left = `${offsetWidth}px` //设置拷贝ul初始位置
        let x = 0
        let fun = () => {
          this.hornStyles.left = x + 'px'
          this.copyStyles.left = x + parseInt(offsetWidth) + 'px'
          x--
          if (x + parseInt(offsetWidth) == 0) {
            x = 0
          }
        }
        this.hornTimer = setInterval(fun, 20)
      })
    }
  },
  destroyed () {
    clearInterval(this.hornTimer)
  }
}
</script>
<style lang="less" scoped>
.horn {
  margin: 0 24px 0;
  /*padding: 0 0 0 20px;*/
  height: 55px;
  /*background: rgba(247, 247, 247, 1);*/
  /*border-radius: 16px;*/
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  .horn-icon {
    width: 30px;
    height: 30px;
    img {
      max-width: 100%;
      vertical-align: top;
    }
  }
  .horn-list {
    flex: 1;
    height: 46px;
    padding: 0 0 0 17px;
    font-size: 24px;
    > div {
      position: relative;
      overflow: hidden;
      width: 100%;
      height: 100%;
      color: #000000;
    }
  }
}

ul {
  position: absolute;
  top: 0;
  height: 48px;
  overflow: hidden;
  li {
    max-height: 48px;
    line-height: 48px;
    float: left;
    overflow: auto; // word-break: keep-all;
    white-space: nowrap; // text-overflow: ellipsis;
    transition: all 1s ease 0.5s;
    padding-right: 20px;
    overflow: hidden;
    span {
      height: 48px;
      width: 100%;
    }
  }
}
.indexB {
  height: 70px;
}
</style>
<style lang="less">
#hornUl,
#copyHornUl {
  li {
    .cat {
      position: relative;
      color: #ff7800;
      font-weight: bold;
      font-size: 24px;
    }
  }
}
</style>
