<template>
    <div class="details-warp" :class="{'showHeader':$moduleConfig.isShowHeader}">
        <wf-header title="问题详情"/>
        <div class="details-content">
            <div class="ask-warp">
                <div class="icon-warp">问</div>
                <div class="ask-details">
                    <div class="details-text">{{issuesDetails.problemTopic}}</div>
                </div>
            </div>
            <div class="answer-warp">
                <div class="answer-details">
                    <div class="details-text">
                        <span>{{issuesDetails.problemAnswer}}</span>
                        <span class="pit">
                            若有仍有任何疑问，欢迎咨询在线人工客服，
                            <span>
                                <router-link :to ="{name:'customerService'}">点击咨询</router-link>
                            </span>
                        </span>
                    </div>
                </div>
                <div class="icon-warp">答</div>
            </div>
        </div>
        <div class="bottom-warp" v-if="bottomShow">
            <span class="icon-warp icon-close iconfont" @click="bottomShow=false"></span>
            <span v-if="!feedbacksuccess" class="span-one">是否帮到您？</span>
            <span v-if="!feedbacksuccess" @click="feedback(1)" class="span-icon span-icon-first-child"><i class="iconfont icon-smiling-face"></i>有用</span>
            <span v-if="!feedbacksuccess" @click="feedback(2)" class="span-icon span-icon-last-child"><i class="iconfont icon-crying-face"></i>没用</span>
            <span v-if="feedbacksuccess">感谢您的反馈，我们会努力改善产品~</span>
        </div>
    </div>
</template>
<script>
import {feedbackUseful} from "@/services/user"
export default {
    name:"issuesDetails",
    data() {
        return {
            bottomShow:true,
            feedbacksuccess:false
        }
    },
    computed:{
        issuesDetails(){
            const details = localStorage.getItem('ISSUES_DETAILS')
            return details?JSON.parse(details):{}
        }
    },
    mounted(){
        document.body.style.background = "#ffffff"
    },
    destroyed(){
        document.body.style.background = "#f5f5f5"
    },
    methods:{
        // 意见反馈
        async feedback(useful){
            const {id} = this.issuesDetails
            if(!id){return}
            const {code,message} = await feedbackUseful(id,useful)
            if(code===200){
                this.feedbacksuccess = true;
            }else{
                this.$Toast(message)
            }
        }
    }
}
</script>
<style lang="less" scoped>
.details-warp{
    &.showHeader{
        padding: 94px 24px;
    }
    padding: 20px 24px;
    min-height: 100vh;
    background: #f7f7f7;
}
.ask-warp{
    width: 100%;
    display: flex;
    .icon-warp{
        margin-right: 13px;
        width: 42px;
        height: 42px;
        border-radius: 0 0 15px 0;
        background-color: #FF7800;
        text-align: center;
        line-height: 42px;
        font-size: 24px;
        color: #fff;
    }
    .ask-details{
        flex: 1;
        .details-text{
            display: inline-block;
            background-color: #EDEDED;
            border-radius:0px 16px 16px 16px;
            font-size: 24px;
            padding: 20px 20px 20px 25px;
        }
    }
}
.answer-warp{
    margin-top: 30px;
    width: 100%;
    display: flex;
    .icon-warp{
        width: 42px;
        height: 42px;
        border-radius: 0 0 0 15px;
        background-color: #F126D4;
        text-align: center;
        line-height: 42px;
        font-size: 24px;
        color: #fff;
        margin-left: 20px;
    }
    .answer-details{
        flex: 1;
        text-align: right;
        .details-text{
            display: inline-block;
            min-height: 56px;
            background-color: #EDEDED;
            border-radius:16px 0 16px 16px;
            font-size: 24px;
            padding: 20px 35px 20px 20px;
            max-width: 480px;
            text-align: left;
            line-height: 46px;
        }
        .pit{
            padding-top: 20px;
            font-size: 24px;
            color: #ACACAC;
            display: inline-block;
            span ,a{
                color: #5186CA;
                text-decoration: underline;
            }
        }
    }
}
.bottom-warp{
    position: fixed;
    bottom: 30px;
    left: 24px;
    right: 24px;
    z-index: 1;
    display: flex;
    align-items: center;
    padding: 0 25px;
    height: 90px;
    font-size: 24px;
    color: #888888;
    background-color: #fff;
    border-radius: 16px;
    .span-one{
        padding-right: 36px;
    }
    .span-icon{
        &:first-child{
            padding-right: 30px;
            border-right: 1px solid #fff;
        }
        i{
            margin-right: 10px;
            font-size: 28px;
        }
    }
    .span-icon-first-child{
        color: #000;
        padding-right: 30px;
        border-right: 1px solid #000;
    }
    .span-icon-last-child{
        color: #000;
        padding-left: 30px;  
    }
    .icon-warp{
        margin-right: 20px;
        font-size: 20px;
    }
}
</style>



