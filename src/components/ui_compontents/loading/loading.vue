<template lang="html">
  <div :class="[size,{'loading-wrap': mask}]">
    <div class="container">
      <div class="spinner">
        <div class="bar1"></div>
        <div class="bar2"></div>
        <div class="bar3"></div>
        <div class="bar4"></div>
        <div class="bar5"></div>
        <div class="bar6"></div>
        <div class="bar7"></div>
        <div class="bar8"></div>
        <div class="bar9"></div>
        <div class="bar10"></div>
        <div class="bar11"></div>
        <div class="bar12"></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'loading',
  props: {
    mask: {
      type: Boolean,
      default: false
    },
    size: {
      type: String,
      default: 'normal'
    }
  }
}
</script>

<style lang="less" scoped>
.loading-wrap {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  z-index: 15;
}
.loading-mask {
}
.small {
  position: absolute;
  top: 2.8rem;
  z-index: 15;
  .container {
    position: static;
    top: initial;
    left: initial;
    transform: none;
    width: 2rem;
    height: 2rem;
    background: #f1f1f1;
    border-radius: 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0px 0px 4px rgba(0, 0, 0, 0.3);
    .spinner {
      height: 70%;
      width: 70%;
      margin: 0 auto;
      position: relative;
      top: 0;
      div {
        background-color: #bbb;
      }
    }
  }
}
.container {
  position: absolute;
  top: 40%;
  left: 50%;
  z-index: 15;
  transform: translate(-50%, -50%);
  width: 160px;
  height: 160px;
  background: rgba(0, 0, 0, 0.6);
  border-radius: 28px;
}

.spinner {
  position: relative;
  height: 40%;
  width: 40%;
  top: 45px;
  left: 2px;
  margin: 0 auto;
}

.spinner div {
  width: 9%;
  height: 26%;
  background-color: white;
  position: absolute;
  left: 44.5%;
  top: 37%;
  opacity: 0;
  -webkit-border-radius: 30%;
  -webkit-animation: fade 1s linear infinite;
}

.spinner div.bar1 {
  -webkit-transform: rotate(0deg) translate(0, -142%);
  -webkit-animation-delay: 0s;
}

.spinner div.bar2 {
  -webkit-transform: rotate(30deg) translate(0, -142%);
  -webkit-animation-delay: -0.9167s;
}

.spinner div.bar3 {
  -webkit-transform: rotate(60deg) translate(0, -142%);
  -webkit-animation-delay: -0.833s;
}

.spinner div.bar4 {
  -webkit-transform: rotate(90deg) translate(0, -142%);
  -webkit-animation-delay: -0.75s;
}

.spinner div.bar5 {
  -webkit-transform: rotate(120deg) translate(0, -142%);
  -webkit-animation-delay: -0.667s;
}

.spinner div.bar6 {
  -webkit-transform: rotate(150deg) translate(0, -142%);
  -webkit-animation-delay: -0.5833s;
}

.spinner div.bar7 {
  -webkit-transform: rotate(180deg) translate(0, -142%);
  -webkit-animation-delay: -0.5s;
}

.spinner div.bar8 {
  -webkit-transform: rotate(210deg) translate(0, -142%);
  -webkit-animation-delay: -0.41667s;
}

.spinner div.bar9 {
  -webkit-transform: rotate(240deg) translate(0, -142%);
  -webkit-animation-delay: -0.333s;
}

.spinner div.bar10 {
  -webkit-transform: rotate(270deg) translate(0, -142%);
  -webkit-animation-delay: -0.25s;
}

.spinner div.bar11 {
  -webkit-transform: rotate(300deg) translate(0, -142%);
  -webkit-animation-delay: -0.1667s;
}

.spinner div.bar12 {
  -webkit-transform: rotate(330deg) translate(0, -142%);
  -webkit-animation-delay: -0.0833s;
}

@-webkit-keyframes fade {
  from {
    opacity: 0.8;
  }
  to {
    opacity: 0.25;
  }
}
</style>
