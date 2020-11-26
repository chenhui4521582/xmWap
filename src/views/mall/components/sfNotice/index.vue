<template>
  <div class="sf_notice_container">
    <div class="sf_notice" @click="showModal=true">
      <div class="item">物流恢复通知</div>
      <div class="item">点击查看<span class="iconfont icon-next"></span></div>
    </div>
    <Modal v-model="showModal" title="物流恢复通知" @on-save="close" type="2" :close-button-show="false"
      :closeIcon2Show="true">
      <div class="sf_notice_content">
        <p>
          除湖北全省暂时无法发出，其他地区物流已全线恢复。
        </p>
        <p>
          感谢您等待，如有任何疑问，请及时联系在线客服。
        </p>
      </div>
    </Modal>
  </div>
</template>

<script>
export default {
  name: 'sfNotice',
  data () {
    return {
      showModal: false,
      name: 'pppp'
    }
  },
  methods: {
    close () {
      this.showModal = false
    }
  }
}
</script>

<style scoped lang="less">
.sf_notice {
  height: 60px;
  font-size: 24px;
  font-weight: 400;
  line-height: 36px;
  color: rgba(255, 65, 65, 1);
  line-height: 60px;
  background: rgba(255, 236, 236, 1);
  border-radius: 16px;
  display: flex;
  justify-content: space-between;
  padding: 0 20px;
  box-sizing: border-box;
  .item {
    &:nth-child(2) {
      color: rgba(255, 120, 0, 1);
    }
    .icon-next {
      margin-left: 6px;
    }
  }
}

.sf_notice_content {
  font-size: 24px;
  font-weight: 400;
  line-height: 36px;
  color: rgba(136, 136, 136, 1);
}
</style>
