<template>
  <!-- 全局提示框 -->
  <transition name="van-fade">
		<div v-show="visible"  class="notify-tips" >
			<div class="notify-tips-text">{{message}}</div>
		</div>
  </transition>
</template>
<script>
export default {
	name:'toast',
	data() {
		return {
			visible: false,
			message: "",
		};
	},
	computed: {
	},
};
</script>
<style lang="less" scope>
.notify-tips {
	position: fixed;
	z-index: 9999;
	width: 100%;
	white-space: nowrap;
	left: 10%;
	top:50%;
	margin-top: -40px;
	box-sizing: border-box;
	color: #ffffff;
	min-height: 70px;
	width: 80%;
	text-align: center;
	.notify-tips-text{
		background-color: rgba(80, 80, 80, 0.9);
		padding: 20px 30px;
		font-size: 24px;
		line-height: 30px;
		border-radius: 16px;
		display: inline;
	}
}
</style>