<template>
    <Modal v-model="show" title="恭喜您获得">
        <template>
            <div class="award-title">
                <div class="title">
                    <span>{{params.awardsName}}</span> 
                </div>
                <p class="directions"> 请填写您的联系方式 <br>话费会在审核无误后48小时内发放</p>
            </div>
            <div class="award-warp">
                <div class="small-title">请输入充值手机号</div>
                <div class="input-warp">
                    <input type="text" v-model.trim="recName" maxlength="10" placeholder="真实姓名">
                </div>
                <div class="input-warp">
                    <input type="tel" maxlength="11" v-model.trim="recMobile"  placeholder="请输入手机号">
                </div>
                <div class="input-warp">
                    <input type="tel" maxlength="11" v-model.trim="againRecMobile"  placeholder="请再次输入手机号">
                </div>
            </div>
        </template>
        <wf-button :long=true slot="footer" @click="saveAddress">提交</wf-button>
    </Modal>
</template>
<script>
import {saveAddress} from "@/services/user"
export default {
    name:"callItem",
    data() {
        return {
            show:this.value,
            recMobile:"",
            againRecMobile:"",
            recName:"",
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
                    recordId:"",
                }
            }
        }
    },
    watch: {
        value(val) {
            if(val){
                this.recName = this.params.name || ''
                this.recMobile = this.params.phone || ''
                this.againRecMobile = ""
            }
            this.show = val
        },
        show(val) {
            this.$emit('input', val)
        }
    },
    methods:{
        // 保存收货地址
        async saveAddress(){
            let phoneReg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/;
            const {phone,recordId} = this.params
            if(!recordId){
                this.$Toast('未知领取产品');
                return 
            }
            if(!this.recName){
                this.$Toast('姓名不得为空');
                return 
            }
            if(!this.recMobile){
                this.$Toast('请输入您的手机号');
                return 
            }
            if(!phoneReg.test(this.recMobile)){
                this.$Toast('手机号格式不正确');
                return 
            }
            if(!this.againRecMobile){
                this.$Toast('再次的手机号码不能为空');
                return 
            }
            if(!phoneReg.test(this.againRecMobile)){
                this.$Toast('再次的手机号码格式不正确');
                return 
            }
            if(this.recMobile !== this.againRecMobile){
                this.$Toast('两次输入手机号不统一');
                return 
            }
            const {data ,code, message} = await saveAddress({
                recName:this.recName,
                recMobile:this.recMobile,
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
        padding-bottom: 9px;
        font-size: 24px;
        text-align: center;
        span{
            color: #FF4141;
        }
    }
    .directions{
        padding-bottom: 25px;
        font-size: 20px;
        color: #BBBBBB;
        line-height: 36px;
        text-align: center;
        border-bottom: 1px solid
    }
}
.award-warp{
    .small-title{
        margin: 25px 0 14px;
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
        color: #BBBBBB;
        line-height: 50px;
    }
    textarea{
        height: 140px;
        background-color: #f4f4f4;
        width: 100%;
        border-radius: 16px;
        border:none;
        box-sizing: border-box;
        padding: 20px;
        font-size: 24px;
        color: #BBBBBB;
        line-height: 48px;
        word-break: break-all;
    }
}
</style>

