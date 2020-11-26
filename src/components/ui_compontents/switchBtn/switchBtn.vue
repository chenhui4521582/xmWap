<template>
  <div>
    <span class="weui-switch" :class="{'weui-switch-on' : me_checked}" :value="value" @click="toggle"></span>
  </div>
</template>

<script>
  export default {
    props: {
      value: {
        type: Boolean,
        default: true
      },
      isClick: {
        type: Boolean,
        default: true
      }
    },
    data() {
      return {
        me_checked: this.value
      }
    },
    watch: {
      me_checked(val) {
        this.$emit('input', val);
      },
      value(newValue) {
        this.me_checked = newValue
      }
    },
    methods: {
      toggle() {
        if(!this.isClick) {
          return false
        }
        this.me_checked = !this.me_checked;
      }
    }
  }
</script>

<style>
  .weui-switch {
    display: block;
    position: relative;
    width: 60px;
    height: 36px;
    border: 1px solid #EEEEEE;
    outline: 0;
    border-radius: 18px;
    box-sizing: border-box;
    background-color: #DFDFDF;
    transition: background-color 0.1s, border 0.1s;
    cursor: pointer;
  }
  .weui-switch:before {
    content: " ";
    position: absolute;
    top: 0;
    left: 0;
    width: 57px;
    height: 33px;
    border-radius: 18px;
    background-color: #EEEEEE;
    transition: transform 0.35s cubic-bezier(0.45, 1, 0.4, 1);
  }
  .weui-switch:after {
    content: " ";
    position: absolute;
    top: 2px;
    left: 0;
    width: 30px;
    height: 30px;
    border-radius: 15px;
    background-color: #FFFFFF;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.4);
    transition: transform 0.35s cubic-bezier(0.4, 0.4, 0.25, 1.35);
  }
  .weui-switch-on {
    border-color: #FF7800;
    background-color: #FF7800;
  }
  .weui-switch-on:before {
    border-color: #FF7800;
    background-color: #FF7800;
  }
  .weui-switch-on:after {
    transform: translateX(26px);
  }
</style>