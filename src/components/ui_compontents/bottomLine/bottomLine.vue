<template>
    <div class="buttom-line">
        <div class="line"></div>
        <p>{{message}}</p>
        <div class="line"></div>
    </div>
</template>
<script>
export default {
    name:'bottomLine',
    props:{
        message:{
            type:String,
            default:"不要再拉了，我是有底线的"
        }
    }
}
</script>

<style lang="less" scoped>
.buttom-line{
    height: 40px;
    line-height: 40px;
    box-sizing: border-box;
    padding: 0 110px;
    display: flex;
    p{
        width: 300px;
        line-height: 40px;
        font-size: 22px;
        color: #BBBBBB;
        flex: 0 300px;
        text-align: center;
    }
    .line{
        flex: 1;
        width: 88px;
        height: 2px;
        background-color: #E0E0E0;
        margin-top: 19px;
    }
}
</style>

