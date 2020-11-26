<template>
  <Modal
    title="温馨提示"
    v-model="dialogShow"
    :type="2"
    :saveText="'获取成就奖励'"
    :closeButtonShow=false
    @on-save="dialogShow=false"
  >
    <div class="wrap">
      <img
        class="icon_achievement"
        src="../images/bg_achievement.png"
      />
      <div class="title">
        恭喜获得
        <br>
        <template v-if="name">”{{name}}“</template>里程碑
      </div>
    </div>
  </Modal>
</template>
<script>
import _get from 'lodash.get'
export default {
  name: 'dialogPage',
  data() {
    return {
      dialogShow: this.value
    }
  },
  props: {
    tasks: {
      type: Array,
      default: []
    },
    value: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    name() {
      return _get(this.tasks[0], 'gameName', '')
    }
  },
  watch: {
    value(val) {
      this.dialogShow = val
    },
    dialogShow(val) {
      this.$emit('input', val)
    }
  },
  methods: {}
}
</script>
<style lang="less" scoped>
.wrap {
  width: 100%;
  text-align: center;
  .icon_achievement {
    width: 320px;
    margin-top: 24px;
  }
  .content-text {
    font-size: 30px;
    margin-top: 30px;
  }
  .title {
    margin-top: 38px;
    font-size: 24px;
    line-height: 1.5;
    color: #888888;
  }
}
</style>

