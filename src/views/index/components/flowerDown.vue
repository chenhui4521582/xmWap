<template>
    <img class="flower" v-if="showFlower && $moduleConfig.flowerDown" @load="imageLoaded" :src="$moduleConfig.flowerDown"/>
</template>
<script>
   
    import _get from 'lodash.get'
    export default {
        data: () => ({
           showFlower:false
        }),
        methods:{
            imageLoaded(){
                setTimeout(()=>{
                    this.showFlower = false;
                },this.$moduleConfig.flowerDownTimeout || 5800)
            }
        },
        mounted () {
            //尽量等页面加载完了再加载
           setTimeout(()=>{
               this.showFlower = true;
           },1500)
        }
    }
</script>
<style lang="less" scoped>
    .flower
    {
        position: fixed;
        top:0;
        left:0;
        width:100%;
        height:100%;
        z-index: 999;
        pointer-events: none;
    }
</style>