<template>
  <div class="survey" :class="$moduleConfig.isShowHeader&&'show-header'">
    <!--<headers title="问卷调研" hasBack="true" @back="close"></headers>-->
    <wfHeader title="问卷调研" :customize="customize" @on-click="close"></wfHeader>
    <div class="survey-container">
      <div class="info">
        *问卷说明：亲爱的玩家您好，为更好地了解玩家，提供相应服务，创造更好的游戏氛围和体验，诚邀您参与此次用户调研。<br>
        *调研信息仅用 作为后期我们游戏和平台改进提供方向，不会泄露与任何第三方。
      </div>
      <div class="que_item" v-for="(item,index) in questions" :key="index">
        <div class="title">{{item.title}}</div>
        <ul>
          <li class="qitem" v-for="(qitem,qindex) in item.items" :key="qindex">
            <div class="ques_item">
              <input :id="'quesion_'+qindex+'_'+index" type="checkbox" :name="'quesion'+index"
                v-model="checked" :value="(index+1)+'_'+(qindex+1)" class="bankruptcy_checkbox">
              <label :for="'quesion_'+qindex+'_'+index" class="lb1"
                :class="{single:item.isSingleSelection}"></label>
              <label :for="'quesion_'+qindex+'_'+index" class="lb2">
                <span class="span_txt">{{qitem}}</span>
              </label>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <div class="btn" @click="submit">提交</div>
  </div>
</template>
<script>
import Services from '@/services/personalCenter'

export default {
  data () {
    return {
      customize: true,
      questions: [{
        title: '1.您目前的受教育水平是？',
        items: ['初中及以下', '高中/中专', '大专', '本科', '硕士及以上'],
        isSingleSelection: true
      }, {
        title: '2.您所从事的职业是？',
        items: ['在校学生', '政府/机关干部/公务员', '企业管理者（包括基层及中高层管理者）', '普通职员（办公室/写字楼工作人员）', '专业人员（如医生/律师/文体/记者/老师等）', '普通工人（如工厂工人/体力劳动者等）', '商业服务业职工（如销售人员/商店职员/服务员等）', '自由职业者', '个体经营者/承包商', '退休', '农林牧渔劳动者', '暂无职业', '其他'],
        isSingleSelection: true
      }, {
        title: '3.您喜欢以下哪些类型游戏？（可多选）',
        items: ['动作类', '角色扮演类', '冒险类', '格斗类', '第一人称射击类', '音乐类', '赛车类', '益智类', '即时战略类', '棋牌类', '体育类', '消除类游戏', '休闲类', '塔防类'],
        isSingleSelection: false
      }, {
        title: '4.您喜欢以下哪些游戏题材？（可多选）',
        items: ['武侠类', '仙侠类', '传奇类', '探险类', '战争类'],
        isSingleSelection: false
      }, {
        title: '5.您每月在饮食上的消费为？',
        items: ['500以下', '500-1000', '1000-2000', '2000-4000', '4000以上'],
        isSingleSelection: true
      }, {
        title: '6.您每月在饮食上的消费占总消费的比例为？',
        items: ['10%以下', '10%-20%', '20%-30%', '30%-40%', '40%-50%', '50%-60%', '60%-70%', '70%-80%', '80%-90%', '90%以上'],
        isSingleSelection: true
      }, {
        title: '7.您目前的状态是？',
        items: ['未婚单身', '未婚非单身', '已婚未育', '已婚已育'],
        isSingleSelection: true
      }],
      checked: [],
      resArr: {}
    }
  },
  mounted () {
    localStorage.setItem('survey_entrance', 'true')
  },
  methods: {
    async submit () {
      this.resArr = {}
      this.checked.forEach(val => {
        let item = val.split('_')
        let answer = this.questions[item[0] - 1].items[item[1] - 1]
        if (this.resArr.hasOwnProperty(item[0])) {
          this.resArr[item[0]] += ',' + item[1] + ':' + answer
        } else {
          this.resArr[item[0]] = item[1] + ':' + answer
        }
      })
      if (Object.keys(this.resArr).length < this.questions.length) { // 未填写完成
        this.$Toast('请全部填写完成后再提交~')
      } else {
        let arr = []
        for (let index in this.resArr) {
          arr.push({
            serialNumber: index,
            answer: this.resArr[index],
            remark: ''
          })
        }
        let res = await Services.commitSurveyInfo({
          version: '20190801',
          answerList: arr
        })
        if (res.data.code === 200) {
          this.$emit('showaward', res.data.data)
          this.$emit('close')
        } else {
          this.$Toast(res.data.message)
        }
      }
    },
    close () {
      if (location.href.includes('survey')) {
        history.go(-1)
      } else {
        this.$emit('close')
      }
    }
  },
  watch: {
    checked (val, oldVal) {
      if (val.length > oldVal.length) { // 表示增加了一个选项
        let order = val[val.length - 1].split('_')[0] - 1
        let items = document.querySelectorAll(`input[name=quesion${order}]:checked`)
        if (this.questions[order].isSingleSelection && items.length > 1) {
          this.checked = [...(oldVal.filter(item => !item.startsWith((order + 1) + '_'))), val[val.length - 1]]
        }
      }
    }
  }
}
</script>
<style lang="less" scoped>
.survey {
  &.show-header {
    padding-top: 100px;
    .survey-container {
      padding: 0 30px 10px;
    }
  }
  .survey-container {
    background: #f7f7f7;
    padding: 20px 30px 10px;
    .info {
      font-size: 0.24 * 100px;
      font-weight: 500;
      line-height: 36px;
      color: rgba(136, 136, 136, 1);
      padding: 0 0 0.3 * 100px;
    }
    .que_item {
      background: rgba(255, 255, 255, 1);
      border-radius: 16px;
      padding: 0.3 * 100px;
      margin-bottom: 0.2 * 100px;
      .title {
        margin-bottom: 0.08 * 100px;
        font-size: 0.26 * 100px;
        font-weight: bold;
        color: rgba(0, 0, 0, 1);
        line-height: 0.36 * 100px;
      }
      ul {
        display: flex;
        flex-wrap: wrap;
        flex-shrink: 0;
        .qitem {
          font-size: 0.28 * 100px;
          font-weight: 500;
          color: rgba(241, 235, 240, 1);
          line-height: 0.36 * 100px;
          min-width: 33.3%;
          margin-top: 0.3 * 100px;
          .ques_item {
            display: flex;
            align-items: center;
            position: relative;
            .bankruptcy_checkbox {
              width: 0.26 * 100px;
              height: 0.26 * 100px;
              opacity: 0;
              margin-right: 0.2 * 100px;
              & + label {
                position: absolute;
                left: 0;
                width: 0.3 * 100px;
                height: 0.3 * 100px;
                background: rgba(255, 255, 255, 1);
                border: 2px solid rgba(187, 187, 187, 1);
                border-radius: 8px;
                &.single {
                  background: rgba(255, 255, 255, 1);
                  border: 2px solid rgba(187, 187, 187, 1);
                  border-radius: 50%;
                }
              }
              &:checked + label {
                &:before {
                  content: '';
                  position: absolute;
                  top: 0;
                  bottom: 0;
                  left: 0;
                  right: 0;
                  margin: auto;
                  width: 0.2 * 100px;
                  height: 0.2 * 100px;
                  background: rgba(255, 65, 65, 1);
                  border-radius: 4px;
                }
                &.single:before {
                  content: '';
                  position: absolute;
                  top: 0;
                  bottom: 0;
                  left: 0;
                  right: 0;
                  margin: auto;
                  width: 0.2 * 100px;
                  height: 0.2 * 100px;
                  background: rgba(255, 65, 65, 1);
                  border-radius: 50%;
                }
              }
            }
            .span_txt {
              color: rgba(136, 136, 136, 1);
              font-weight: 400;
              font-size: 24px;
              margin-bottom: 3px;
              display: block;
            }
          }
        }
      }
    }
  }
  .btn {
    height: 0.9 * 100px;
    line-height: 0.9 * 100px;
    text-align: center;
    font-weight: 500;
    color: rgba(255, 255, 255, 1);
    background: rgba(255, 65, 65, 1);
  }
}
</style>
