<template>
    <div class="view-warp" :class="{'showHeader':$moduleConfig.isShowHeader}">
        <wf-header title="输入新手机号"/>
        <div class="view-content">
            <div class="phone-item">
                <h4 class="title">手机号码</h4>
                <input v-model.trim="phone" maxlength="11" type="tel" placeholder="请输入手机号">
            </div>
            <div class="phone-item">
                <h4 class="title">验证码</h4>
                <input v-model.trim="code" maxlength="6" type="tel" placeholder="请输入验证码">
                <div class="get-code" @click="getCode">
                    <div class="code-warp">{{countdownText}}</div>
                </div>
            </div>
            
        </div>
        <div class="buttom-body">
            <div class="buttom-warp" @click="saveBinding">确认提交</div>
        </div>
    </div>
</template>
<script>
import {getPhoneCode,bindMobilePhone} from "@/services/user"
import {mapActions} from "vuex"
export default {
    name:"bindPhoneView",
    data() {
        return {
            phone:"",
            code:"",
            countdown: 60,
            countdownText: "获取验证码",
            time: null,
        }
    },
    destroyed(){
        if(this.time){
            clearInterval(this.time);
        }
    },
    methods:{
        ...mapActions({
            getUserInfo:'GET_USERINFO'
        }),
        // 绑定手机号码
        async saveBinding(){
            let phoneReg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/;
            if(this.phone===""){
                this.$Toast('请输入手机号码');
                return 
            }
            if (!phoneReg.test(this.phone)) {
                this.$Toast("请输入正确的手机号码");
                return;
            }
            if(this.code===""){
                this.$Toast('请输入短信验证码');
                return 
            }
            const {code,data ,message} = await bindMobilePhone(this.phone,this.code)
            if(code===200){
                this.$Toast('绑定成功');
                this.getUserInfo();
                this.$router.push({name:"my"})
            }else{
                this.$Toast(message);
            }
        },
        // 获取短信验证吗
        async getCode(){
            let phoneReg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/;
            if(this.countdown !== 60){
                return ;
            }
            if(this.phone===""){
                this.$Toast('请输入手机号码');
                return 
            }
            if (!phoneReg.test(this.phone)) {
                this.$Toast("请输入正确的手机号码");
                return;
            }
            const {code,data,message} = await getPhoneCode(this.phone)
            if(code===200){
                this.$Toast("短信验证码已发送，注意查收");
                this.countdownFn();
            }else{
                this.$Toast(message);
                clearInterval(this.time);
            }
        },
        // 验证码倒计时计算
        countdownFn() {
            if (this.countdown === 0) {
                this.countdown_text = "重新获取";
                this.countdown = 60;
                this.code = "";
                clearTimeout(this.time);
                return false;
            } else {
                this.countdown--;
                if (this.countdown === 0) {
                    this.countdownText = "重新获取";
                } else {
                    this.countdownText = this.countdown + "s";
                }
                this.time = setTimeout(() => {
                    this.countdownFn();
                }, 1000);
            }
        },
    }
}
</script>
<style lang="less" scoped>
*{
    box-sizing: border-box;
}
.view-warp{
    &.showHeader{
        padding:94px 24px;
    }
    padding:20px 24px;
    .phone-item{
        margin-top: 30px;
        position: relative;
        .title{
            font-size: 24px;
            color: #000;
            margin-bottom: 15px;
        }
        input{
            width: 100%;
            height: 90px;
            background-color: #F7F7F7;
            border-radius: 16px;
            font-size: 24px;
            padding: 20px 30px;
            color: #BBBBBB;
            line-height: 30px;
        }
        .get-code{
            width: 200px;
            height: 90px;
            position: absolute;
            top: 50px;
            right: 0;
            box-sizing: border-box;
            padding:25px 17px; 
            text-align: center;
        }
        .code-warp{
            border-left: 1px solid #e6e6e6;
            color: #FF4141;
            font-size: 24px;
        }
    }
}
.buttom-body{
    height: 90px;
    width: 100%;
    position: absolute;
    bottom: 0;
    left: 0;
    .buttom-warp{
        height: 90px;
        background-color: #FF4141;
        line-height: 90px;
        text-align: center;
        font-size: 24px;
        color: #fff;
    }
}
</style>


