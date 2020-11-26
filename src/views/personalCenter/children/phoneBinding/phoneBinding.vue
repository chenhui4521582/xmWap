<template>
    <div class="phone-warp" :class="{'showHeader': $moduleConfig.isShowHeader}">
        <wf-header title="手机绑定"/>
        <div class="phone-content">
            <div class="phone-info">
                <div class="phone-text">{{phoneText}}</div>
                <div class="phone-pit" @click="openPhoneChange">
                    <span>{{buttonText}}</span>
                    <i class="iconfont icon-next"></i>
                </div>
            </div>
        </div>
        <!-- 绑定手机号码弹框 -->
        <binding v-model="show" @on-success="bindSuccess"/>
    </div>
</template>
<script>
import {getPhoneBindInfo} from "@/services/user"
import binding from "./components/binding"
export default {
    name:"phoneBinding",
    components:{binding},
    data() {
        return {
            isPhoneBind:false,
            userPhoneInfo:{},
            show:false
        }
    },
    computed:{
        phoneText(){
            const {existsFlag,phone} = this.userPhoneInfo;
            return existsFlag?phone:"手机号码"
        },
        buttonText(){
            const {existsFlag} = this.userPhoneInfo;
            return existsFlag?'修改绑定手机号':"立即绑定"
        }
    },
    mounted(){
        this.pageInit()
    },
    methods:{
        // 页面初始化
        async pageInit(){
            this.$marchSetsPoint('P_H5PT0031')
            const {code,data} = await getPhoneBindInfo()
            if(code===200){
                this.userPhoneInfo = data
            }
        },
        // 打开手机操作
        openPhoneChange(){
            const {existsFlag,phone} = this.userPhoneInfo;
            if(!existsFlag){
                this.show = true;
            }else{
                this.$router.push({
                    name:"editPhone",
                    query:{phone}
                })
            }
        },
        // 绑定成功后的回调
        bindSuccess(){
            // 从新获取用户信息
            this.pageInit()
        }
    }
}
</script>
<style lang="less" scoped>
*{
    box-sizing: border-box;
}
.phone-warp{
    &.showHeader{
        padding-top:94px; 
    }
    padding-top:10px;
    .phone-info{
        height: 90px;
        line-height: 90px;
        padding: 0 24px;
        display: flex;
        .phone-text{
            flex:1;
            font-size: 28px;
            color: #000;
            font-weight: bold;
        }
        .phone-pit{
            width: 240px;
            flex: 0 240px;
            text-align: right;
            color: #888888;
            font-size: 24px;
            i{
                font-size: 20px;
                margin-left: 5px;
            }
        }
    }
}
</style>


