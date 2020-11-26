<template>
    <Modal v-model="modalShow" title="绑定手机号" >
        <div class="binding-warp">
            <div class="input-watp">
                <input v-model.trim="phone" maxlength="11" type="tel" placeholder="请输入手机号">
            </div>
            <div class="input-watp">
                <input v-model.trim="code" maxlength="6" type="tel" placeholder="请输入验证码">
                <div class="get-code" @click="getCode">
                    <div class="code-warp">{{countdownText}}</div>
                </div>
            </div>
        </div>
        <wf-button :long=true slot="footer" @click="saveBinding">确定</wf-button>
    </Modal>
</template>
<script>
import {getPhoneCode,bindMobilePhone} from "@/services/user"
import {mapActions} from "vuex"
export default {
    name:"binding",
    data() {
        return {
            modalShow:this.value,
            phone:"",
            code:"",
            countdown: 60,
            countdownText: "获取验证码",
            time: null,
        }
    },
    props:{
        value:{
            type:Boolean,
            default:false
        }
    },
    watch:{
        value(val){
            if(!val&&this.time){
                clearInterval(this.time);
            }
            this.modalShow= val
        },
        modalShow(val){
            this.$emit('input',val)
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
                this.modalShow = false;
                this.getUserInfo();
                this.$emit('on-success')
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
        }
    }
}
</script>
<style lang="less" scoped>
.input-watp{
    width: 100%;
    height: 70px;
    margin-bottom: 20px;
    position: relative;
    input{
        width: 100%;
        height: 70px;
        background-color: #f7f7f7;
        border-radius: 16px;
        font-size: 24px;
        padding: 10px 30px;
        color: #BBBBBB;
        line-height: 50px;
    }
    .get-code{
        width: 200px;
        height: 70px;
        position: absolute;
        top:0;
        right: 0;
        box-sizing: border-box;
        padding:17px; 
        text-align: center;
    }
    .code-warp{
        border-left: 1px solid #e6e6e6;
        color: #FF7800;
        font-size: 24px;
    }
}
</style>


