<template>
    <div class="pnl_openEgg" v-if="show">
      <img class="icon_openEgg" @click="openEgg" src="../img/icon_openEgg.gif" />
      <i class="redDot" v-if="showRedDot"></i>
    </div>
</template>
<script>
    import Services from '@/services/index'
    import _get from 'lodash.get'
    export default {
        data: () => ({
            show: false,
            showRedDot: false,
            url:''
        }),
        methods:{
            openEgg(){
                sessionStorage['event_recordEgg'] = 1;
                location.href = this.url||'//wap.beeplaying.com/activities/eggs.html';
            }
        },
        mounted () {
            Services.getShowOpenEggIcon().then(res=>{
                let { data } = res.data
                this.show = _get(data,'show',false);
                this.showRedDot = _get(data,'redDot',false);
                this.url= _get(data,'url',false);
            })
        }
    }
</script>
<style lang="less" scoped>
.pnl_openEgg
{
    position: fixed;
    left: 0.5rem;
    bottom: 6rem;
    z-index: 10;

    .icon_openEgg {
        width: 4.5rem;
    }
    .redDot {
        position: absolute;
        right: 1.8rem;
        top: 1rem;
        width: 0.66667rem;
        height: 0.66667rem;
        border-radius: 50%;
        background: #FF0000;
    }
}

</style>
