<template>
  <Modal 
    v-model="value" 
    :title="'盈利榜规则'" 
    :type="2" 
    :saveText="'知道了'" 
    :closeButtonShow=false 
    @on-save="close"
  >
    <div class="rule-details">
      <div class="rule-details-content">
        <div class="rule-scroll">
          <better-scroll :data="ruleDescBottom">
            <div>
              <div class="ranking-content">
                <p v-for="(item, index) in truleDescTop" :key="index">
                  {{ item }}
                </p>
              </div>
              <div class="ranking-table">
                <ul>
                  <li v-for="(item, index) in ruleDetails" :key="index">
                    <span>{{item.condition}}</span>
                    <span>{{item.awardsName}}</span>
                  </li>
                </ul>
              </div>
              <div class="ranking-content ranking-bottom">
                <p v-for="(item, index) in ruleDescBottom" :key="index">
                  {{
                    item.replace(/(&ldquo\;)/g, "'").replace(/(&rdquo\;)/g, "'")
                  }}
                </p>
              </div>
            </div>
          </better-scroll>
        </div>
      </div>
    </div>
  </Modal>
</template>
<script type="text/javascript">
import BetterScroll from '@/components/betterScroll/betterScroll'
import utils, { getUrlParams } from '@/utils/utils'
import _get from 'lodash.get'
import Services from '@/services/profit'
export default {
  name: 'rule',
  props: {
    value: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      profitRules: '',
      ruleDetails: '',
      ruleDescBottom: '',
      truleDescTop: [],
      from: getUrlParams('from') || 'index'
    }
  },
  components: {
  	BetterScroll
  },
  methods: {
    close(type) {
      if (type) {
        this.$marchSetsPoint(this.from == 'game' ? 1210070304 : 1210070206, {
          platform_id: 40000
        })
      } else {
        this.$marchSetsPoint(this.from == 'game' ? 1210070305 : 1210070207, {
          platform_id: 40000
        })
      }
      this.$emit('input', false)
    },
    _getRule() {
      Services.ProfitRules().then(res => {
        this.profitRules = _get(res, 'data.data', {})
        let text = _get(this.profitRules, 'ruleDescTop', [])
        let _text = text.split('；')
        for (var i = 0; i < _text.length; i++) {
          this.truleDescTop.push(utils.trimStr(_text[i]))
        }
        this.ruleDetails = _get(this.profitRules, 'ruleDetails')
        this.ruleDescBottom = _get(this.profitRules, 'ruleDescBottom').split(
          '；'
        )
        this.showLoading = false
      })
    }
  },
  created() {
    this._getRule()
  }
}
</script>
<style lang="less" scoped>

.scroll-content {
  height: 400px;
}
.rule-details-content {
  .rule-scroll {
    box-sizing: border-box;
    position: relative;
    height: 400px;
  }
}
.rule-details {
  .ranking-table {
    
    color: #888;
    margin: 15px 0;
    ul {
      -bottom: 1px solid #252525;
      li {
        margin-top: -1px;
        display: flex;
        justify-content: flex-start;
        text-align: left;
        span {
          white-space: nowrap;
          height: 60px;
          line-height: 60px;
          font-size: 20px;
          text-align: center;
          &:first-child{
            width: 63%;
            border-left: 1px solid #252525;
            border-right: 1px solid #252525;
            border-top: 1px solid #252525;
          }
          &:last-child {
            width: 37%;
            border-right: 1px solid #252525;
            border-top: 1px solid #252525;
          }
        }
      }
    }
  }
  .rule-details-title {
    border-radius: 5px 5px 0 0;
    height: 98px;
    line-height: 98px;
    background: #141f33;
    padding: 0 10px 0 26px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: relative;
    font-size: 32px;
    .xl-box {
      width: 50px;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .xl-arrow {
      width: 32px;
      height: 20px;
      float: right;
    }
  }
}
.rule-details-content p {
  font-size: 24px;
  line-height: 38px;
  color: #888;
}

</style>
