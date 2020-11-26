<template>
  <Modal v-model="show" saveText="知道了" title="" @on-save="closePop" @on-close="closePop">
    <template>
      <div class="pnl_kucai">
        <img src="../img/bg_header.png" class="pic_header" />
        <div class="dialog_title">恭喜你获得</div>
        <img src="../img/pic_caijinCard.png" class="pic_card" />
        <div class="title">酷彩吧50元彩金</div>
        <div class="summary">已发放至酷彩吧-红包</div>
        <div class="btn_howToUse" @click="openIssues">如何使用 ></div>
      </div>
    </template>
  </Modal>
</template>
<script>
export default {
  name: 'kuCaiBa',
  data () {
    return {
      show: this.value,
    }
  },
  props: {
    value: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    value (val) {
      this.show = val
    }
  },
  mounted () {
  },
  methods: {
    // 打开问题反馈
    openIssues () {
      this.$router.push({
        name: 'issues'
      })
    },
    closePop () {
      this.$emit('closePopKucaiBa')
    }
  }
}
</script>
<style lang="less" scoped>
.pnl_kucai
{
  text-align: center;
  padding-top:70px;

  .pic_header
  {
    position: absolute;
    top:-70px;
    left: 50%;
    transform: translate(-50%, 0);
    width: 276px;
    height:156px;
  }

  .dialog_title
  {
    font-size: 28px;
    font-weight: bold;
    color: #000;
  }
  .pic_card
  {
    width: 256px;
    height: 160px;
  }
  .title
  {
    color: #FF4141;
    font-size: 24px;
  }
  .summary
  {
    margin-top:6px;
    color: #bbb;
    font-size: 20px;
  }
  .btn_howToUse
  {
    color:#5186CA;
    font-size: 24px;
    margin-top:10px;
  }
}

</style>


