<template>
  <div class="plantRule">
    <!-- 头部 -->
    <div class="header-wap">
      <div class="return-img" @click="returnPage">
          <i class="iconfont icon-return"></i>
      </div>
      <div class="title">平台规则</div>
    </div>
    <div class="content">
      为了保障游戏环境的公平和所有玩家的权益，游戏官方有权对各种违规行为进行处理。
      <br>
      <br>
      打击行为包含但不仅限于：
      <br>
      1. 违反国家法律法规及监管规定；
      <br>
      2. 参与游戏时的作弊行为；
      <br>
      3. 多账号行为：<br>
          包括：使用伪造IP多开账号登录游戏中心；<br>
          一部设备上切换登录多个账号登录游戏中心；<br>
          恶意使用身份证绑定多个账号；<br>
      4. 使用模拟器、插件、外挂等工具参与活动和游戏；<br>
      5. 恶意篡改设备数据，伪造用户参与活动；<br>
      6. 账号信息涉及色情低俗等内容；<br>
      7. 账号涉及恶意营销推广等行为；<br>
      8. 按照国家网络管理办法，为防止未成年人沉迷网络，限制未成年人游戏；<br>
      对于违反平台规则的账号，游戏中心有权停发奖励追回已发放的虚拟或实物奖励；问题账号可能无法参与部分游戏和其他平台活动。情节严重者，游戏中心将做封号处理或注销违规账号。
    </div>
  </div>
</template>
<script>
export default {
  name: 'plantRule',
  methods: {
    returnPage(){
      this.$router.go(-1)
    }
  }
}
</script>
<style lang="less" scoped>
.plantRule {
  min-height: 100vh;
  background: #f7f7f7;
  .header-wap{
    height: 100px;
    position: fixed;
    width: 100%;
    top:0;
    left: 0;
    z-index: 10;
    box-sizing: border-box;
    padding: 0 30px;
    color: #000;
    background-color: #f7f7f7;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    .return-img{
        position: absolute;
        top: 0;
        left: 30px;
        display: flex;
        align-items: center;
        justify-content: flex-start;
        width: 100px;
        height: 94px;
        box-sizing: border-box;
        z-index: 10;
        .iconfont{
            font-size: 30px;
        }
    }
    .title{
        text-align: center;
        font-size: 32px;
        font-weight: bold;
    }
  }
  .content {
    padding: 100px 24px 0;
    font-size: 24px;
    color: #888;
    line-height: 40px;
  }
}
</style>