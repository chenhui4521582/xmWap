<template>
  <section>
    <awards-dialog v-model="isShowPop" tips-txt="恭喜获得多多玩APP充值加赠" @callback="closePop"
      :isShowClose="false" :confirmBtnText="info.activityOpen?'继续购买':'朕收下了'">
      <div class="content">
        <p>
          所有加赠奖品已到账：
        </p>
        <ul class="awards-list">
          <template v-for="item in awardsList">
            <li :key="item" v-if="info[item+'Amount']>0">
              <div class="img-wrapper">
                <img :src="require(`./img/${item}.png`)" alt="">
              </div>
              <p>{{item|nameFilter(info)}}</p>
            </li>
          </template>
        </ul>
      </div>
    </awards-dialog>
  </section>
</template>

<script>
import Services from '@/services/index'
import _get from 'lodash.get'
export default {
  name: '',
  components: {

  },
  data () {
    return {
      isShowPop: false,
      awardsList: ['hfq', 'jdk', 'jyz'],
      info: {
        activityOpen: false,
        hfqAmount: 0,
        jdkAmount: 0,
        jyzAmount: 0,
        popup: false
      },
      callback: null
    }
  },
  mounted () {

  },
  filters: {
    nameFilter (value, info) {
      let type = ''
      switch (value) {
        case 'hfq':
          type = '元话费券'
          break
        case 'jdk':
          type = '元京东券'
          break
        case 'jyz':
          type = '金叶'
          break

        default:
          break
      }
      if (info[value + 'Amount'] > 10000) {
        return info[value + 'Amount'] / 10000 + type
      }
      return info[value + 'Amount'] + type
    }
  },
  methods: {
    async init (callback) {
      this.callback = callback
      const res = await Services.getBtcPopup()
      const code = _get(res, 'data.code', 0)
      if (code === 200) {
        this.info = _get(res, 'data.data', {
          activityOpen: false,
          hfqAmount: 0,
          jdkAmount: 0,
          jyzAmount: 0,
          popup: false
        })
        if (this.info.popup) {
          this.isShowPop = true
          this.$marchSetsPoint("A_H5PT034900443")// H5平台-C端多多玩APP充值加赠-首页提示弹窗加载完成
          return
        }
      }
      this.callback({
        name: 'b2cRechargeGift',
        isShow: false
      })
    },
    closePop () {
      this.isShowPop = false
      this.callback({
        name: 'b2cRechargeGift',
        isShow: false
      })
      this.$marchSetsPoint("A_H5PT034900444")// H5平台-C端多多玩APP充值加赠-首页提示弹窗-继续购买点击
      this.info.activityOpen && (location.href = `https://wap.beeplaying.com/activities/valuepackages.html`)
    }
  }
}
</script>

<style lang="less" scoped>
.content {
  text-align: center;
  p {
    color: #000;
    font-size: 24px;
    margin: 16px;
  }
  .awards-list {
    display: flex;
    align-items: center;
    justify-content: space-around;
    padding: 0 30px;
    li {
      p {
        color: #ff4141;
        font-size: 22px;
        white-space: nowrap;
      }
      .img-wrapper {
        width: 120px;
        height: 120px;
        border: 1px solid #eee;
        border-radius: 21px;
        display: flex;
        align-items: center;
        justify-content: center;
        img {
          max-width: 100%;
        }
      }
    }
  }
}
</style>
