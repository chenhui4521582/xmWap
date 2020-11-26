<template>
  <Modal
    :title="'恭喜获得里程碑'"
    v-model="dialogShow"
    :saveText="'获取成就奖励'"
    @on-save="dialogShow=false"
  >
    <div class="content">
      <img
        class="icon_achievement"
        src="../images/bg_achievement.png"
      />
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
.content {
  width: 100%;
  text-align: center;
  .icon_achievement {
    width: 440px;
    margin-top: 24px;
  }
  .content-text {
    color: #888;
    font-size: 24px;
    margin-top: 30px;
  }
}
</style>

