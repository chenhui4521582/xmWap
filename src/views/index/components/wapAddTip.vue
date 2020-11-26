<template>
    <div class="pnl_addTip" @click="hide" v-if="show">
        <div class="mask"></div>
        <img class="img_screen" src="@/views/index/img/img_addScreen.png" />
        <img class="img_finger" src="@/views/index/img/img_finger.png" />
    </div>
</template>
<script>
    import Services from '@/services/index'
    import _get from 'lodash.get'
    export default {
        data: () => ({
            show: false,
        }),
        methods:{
           hide(){
               this.show=false;
               localStorage['has_wapAddTip'] = 1;
           }
        },
        mounted () {
            var isiOS = !!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
           if(localStorage['APP_CHANNEL'] == this.$moduleConfig.wapChannel && isiOS && !window.navigator.standalone && !localStorage['has_wapAddTip'])
           {
               this.show = true;
           }
        }
    }
</script>
<style lang="less" scoped>
.pnl_addTip
{
    position: fixed;
    left: 0;
    top: 0;
    bottom: 0;
    right: 0;
    z-index: 20;

    .mask {
        position: fixed;
        left: 0;
        top: 0;
        bottom: 0;
        right: 0;
        z-index: 13;
        background: rgba(0, 0, 0, 0.7);
    }

    .img_screen{
        position: absolute;
        width:380px;
        z-index: 14;
        left: 50%;
        bottom: 105px;
        z-index: 20;
        transform: translate(-50%,0);
    }
    .img_finger{
        position: absolute;
        width:82px;
        z-index: 14;
        left: 50%;
        bottom: 0;
        z-index: 20;
        transform: translate(-50%,0);
        animation: beating 0.5s infinite alternate;
    }
    @keyframes beating
    {
        from {
            bottom:15px
        }
        to{
            bottom:0;
        }
    }
}

</style>