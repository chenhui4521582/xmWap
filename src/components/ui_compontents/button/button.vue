<template>
  <button @click="onClick" :class="buttonClass">
    <slot></slot>
  </button>
</template>
<script>
export default {
  name: 'wfButton',
  props: {
    enable: {
      type: Boolean, // [default lint background]
      default: true
    },
    type: {
      type: String, // [default lint background]
      default: 'default'
    },
    long: {
      type: Boolean, // true 100%长度
      default: false
    },
    size: {
      type: String, // [default small ]
      default: 'default'
    }
  },
  computed: {
    buttonClass() {
      let classNames = ""
      if (this.size === 'small') {
        classNames =  `button-${this.type} size-small`
      } else {
        if (!this.long) {
          classNames =  `button-warp button-${this.type}`
        } else {
          classNames = ` button-warp button-${this.type} button-long`
        }
      }
      if(!this.enable){
        classNames+=' disable';
      }
      return classNames;
    }
  },
  methods: {
    onClick () {
      this.$emit('click')
    }
  }
}
</script>
<style lang="less" scoped>
.disable {
  background:rgba(255,65,65,1);
  opacity:0.4;
}

.button-warp {
  display: inline-block;
  width: calc(50% - 20px);
  padding: 0 15px;
  height: 70px;
  font-size: 24px;
  color: #fff;
  box-sizing: border-box;
  text-align: center;
  line-height: 70px;
  border: none;
  border-radius: 16px;
  background-color: #ff4141;
}
.size-small {
  font-size: 22px;
}
.button-default {
  color: #fff;
  background-color: #ff4141;
}
.button-background {
  background-color: #f4f4f4;
  border: 1px solid #e6e6e6;
}
.button-long {
  width: 100%;
  margin: 0;
}
</style>


