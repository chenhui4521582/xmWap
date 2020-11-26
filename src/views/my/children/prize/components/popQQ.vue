<template>
    <Modal v-model="show" title="恭喜您获得">
        <template>
            <div class="award-title">
                <div class="title">
                    <span>{{params.awardsName}}</span> 
                </div>
            </div>
            <div class="award-warp">
                <div class="small-title">请输入QQ号码领取腾讯视频会员卡</div>
                <div class="input-warp">
                    <input type="text" v-model.trim="txtQQ" maxlength="10" placeholder="请输入QQ号码">
                </div>
            </div>
            <wf-button :long=true slot="footer" :enable="enable" @click="save">提交</wf-button>
        </template>
    </Modal>
</template>
<script>
import {saveAddress} from "@/services/user"
import _get from 'lodash.get'
export default {
    name:"popQQ",
    data() {
        return {
            show:this.value,
            txtQQ:''
        }
    },
    computed:{
        enable(){
            return this.txtQQ;
        }
    },
    props:{
        value:{
            type:Boolean,
            default:false
        },
        params:{
            type:Object,
            default:()=>{
                return {
                    awardsName:"",
                    phone:"",
                    recordId:""
                }
            }
        }
    },
    watch: {
        value(val) {
            this.show = val
        },
        show(val) {
            this.$emit('input', val)
        }
    },
    methods:{
        async save(){
            let recordId = _get(this.params,'recordId','');
            const {data ,code, message} = await saveAddress({
                recName: _get(this.params,'awardsName',''),
                qq: this.txtQQ,
                recordId
            })
            if(code===200 && data.isSuccess){
                this.show = false;
                this.$emit('on-click',recordId)
            }else{
                this.$Toast(message);
            }
        }
    }
}
</script>
<style lang="less" scoped>
.award-title{
    .title{
        padding: 0 0 24px 0;
        font-size: 24px;
        text-align: center;
        border-bottom: 1px solid #e6e6e6;
        span{
            color: #FF4141
        }
    }
    .directions{
        padding-bottom: 26px;
        font-size: 20px;
        color: #BBBBBB;
        line-height: 36px;
        text-align: center;
    }
}
.award-warp{
    .small-title{
        margin: 14px 0;
        font-size: 24px;
        color: #000;
        position: relative;
    }
}
.input-warp{
    margin-bottom: 20px;
    &:last-child{
        margin-bottom: 0;
    }
    input{
        width: 100%;
        height: 70px;
        background-color: #f4f4f4;
        border-radius: 16px;
        font-size: 24px;
        padding: 10px 20px;
        color: #000;
        line-height: 50px;
    }
}
</style>


