<template>
  <div class="pop-masks">
    <div class="popbg">
      <div class="pop-content">
        <p>支付已完成</p>
        <p>请返回App查看</p>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'backAppCheck'
}
</script>

<style lang="less" scoped>
  .pop-masks {
    position: fixed;
    top: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.7);
    z-index: 14;
    .popbg {
      position: absolute;
      top: 20%;
      left: 50%;
      z-index: 166;
      transform: translateX(-50%);
      background-image: linear-gradient(0deg, #25417b, #10172b),
      linear-gradient(180deg, #5d8ff7, #1c1942);
      width: 80%;
      min-height: 340px;
      font-size: 28px;
      color: #fff;
      box-shadow: 0 0 20px #4c91ff;
      text-align: center;
      display: flex;
      flex-direction: column;
      justify-content: center;
      .pop-content {
        display: flex;
        flex-direction: column;
        justify-content: center;
        p{
          margin: 5px 0;
        }
      }
    }
  }
</style>
