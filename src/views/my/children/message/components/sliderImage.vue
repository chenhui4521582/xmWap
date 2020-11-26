<template>
    <div class="slider-warp">
        <div class="sider-list">
            <ul class="cities-warp">
                <li class="cities-item" v-for="(item, index) in list" :key="index">
                   <img  :src="item.image | filter" >
                </li>
            </ul>
        </div>
    </div>
</template>
<script>
export default {
    name:'sliderImage',
    props:{
        list:{
            type:Array,
            default:()=>{return []}
        }
    }
}
</script>
<style lang="less" scoped>
@bg_height:200px;
.slider-warp{
    width: 100%;
    margin-top: 20px;
    .sider-list{
        width:100%;
        overflow: hidden;
    }
}
// 滑动
.cities-warp{
    width:100%;
    white-space:nowrap;
    height: @bg_height;
    overflow-x:auto;
    overflow-y: hidden;
    scroll-behavior:smooth;
    -webkit-overflow-scrolling: touch;
    -ms-overflow-style: none;
    overflow: -moz-scrollbars-none;
    
    .cities-item{
        width: 290px;
        height: @bg_height;
        display: inline-block;
        text-align: center;
        background-color: #f5f5f5;
        border-radius: 8px;
        margin-right: 20px;
        overflow: hidden;
        img{
            width: 100%;
            height: 100%;
        }
    }
}

.cities-warp::-webkit-scrollbar {
    width: 0 !important;
    /* remove scrollbar space */
    background: transparent;
}
</style>


