<template>
    <div class="feedback-warp">
        <wf-header title="问题反馈"  @on-back="returnPage"/>
        <div class="feedback-content" :class="{'showHeader':$moduleConfig.isShowHeader}">
            <ul class="feed-title">
                <li class="feed-item" v-for="(item,index) in titleIssuesList"
                    @click="changeHotItem(item)"
                    :class="{'feed-item-active':currentItemId.id===item.id}"
                    :key="index">{{item.name}}</li>
                <li class="feed-show" @click="issuesHotShowAndHide">
                    <span>{{issuesHotShowText}}</span>
                    <span class="icon" :class="{'down':!issuesHotShow}"></span>
                </li>
            </ul>
            <div class="feed-list" v-if="issuesHotShow">
                <li class="feed-item"
                    v-for="(item,index) in ifTitleIssuseList"
                    @click="changeHotItem(item)"
                    :class="{'feed-item-active':currentItemId.id===item.id}"
                    :key="index">{{item.name}}</li>
            </div>
            <!-- 详情列表 -->
            <div class="details-warp">
                <div class="details-item" v-for="(item,index) in issuesHotDetailsList"
                    @click="openIssuesDetails(item,index)"
                    :key="index">
                    <div class="title">
                        <p>{{item.problemTopic}}</p>
                    </div>
                    <div class="icon">
                       <i class="iconfont icon-next"></i>
                    </div>
                </div>
            </div>
        </div>
        <!-- 底部 按钮 -->
        <div class="button-body">
            <div class="btn" @click="openPage('customerService')">联系客服</div>
            <div class="btn" @click="openPage('feedback')">意见反馈</div>
        </div>
    </div>
</template>
<script>
import {issuesHotType,issuesHotList} from "@/services/user"
export default {
    name:"issues",
    data() {
        return {
            hootList:[],
            issuesHotShow:false,
            currentItemId:{},
            issuesHotDetailsList:[]
        }
    },
    computed:{
        titleIssuesList(){
            if(this.hootList.length>4){
                return this.hootList.slice(0,4)
            }
        },
        ifTitleIssuseList(){
            if(this.hootList.length>4){
                return this.hootList.slice(4,this.hootList.length)
            }
        },
        issuesHotShowText(){
            return this.issuesHotShow?"收起":"展开"
        }
    },
    mounted(){
        this.pageInit()
        document.body.style.background = "#ffffff"
    },
    destroyed(){
        document.body.style.background = "#f5f5f5"
    },
    methods:{
        // 页面初始话
        async pageInit(){
            this.$marchSetsPoint('P_H5PT0029')
            const {code,data} = await issuesHotType()
            if(code===200){
                data.unshift({
                    name:"热门问题",
                    id:999
                })
                this.hootList = data;
                this.currentItemId = data&&data.length>0&&data[0]
                this.getHotList(999)
            }
        },
        // 获取hot列表详情
        async getHotList(params){
             const {code,data} = await issuesHotList({params})
             if(code===200){
                 this.issuesHotDetailsList = data
             }
        },
        // 热门问题切换
        changeHotItem(item){
            const {id} = item
            this.$marchSetsPoint('A_H5PT0027000622',{
                platform_id: 40000,
                awards_id:id
            })
            this.currentItemId = item;
            this.getHotList(id)

        },
        // 头部标题的切换
        issuesHotShowAndHide(){
            this.issuesHotShow = !this.issuesHotShow
        },
        // 打开页面
        openPage(name){
            if(name==="customerService"){
                this.$marchSetsPoint('A_H5PT0029000630')
            }else if(name==="feedback"){
                this.$marchSetsPoint('A_H5PT0029000631')
            }
            this.$router.push({
                name
            })
        },
        // 打开详情页面
        openIssuesDetails(item,index){
            // H5平台-帮助反馈-具体问题点击
            this.$marchSetsPoint('A_H5PT0029000629', {
                position_id: index + 1,
                product_id: item.id,
                awards_name: item.problemTopic
            })
            this.$router.push({
                name:"issuesDetails"
            })
            localStorage.ISSUES_DETAILS = JSON.stringify(item)
        },
        // 返回按钮点击
        returnPage(){
            this.$marchSetsPoint('A_H5PT0029000627')
        }
    }
}
</script>
<style lang="less" scoped>
*{
    box-sizing: border-box;
}
.feedback-warp{
    min-height: 100vh;
    background: #fff;
    .feedback-content{
        width:100%;
        padding:10px 24px 90px;
        background: rgb(247, 247, 247);
        &.showHeader{
            padding:94px 24px 90px;
        }
    }
    .feed-title{
        height: 70px;
        margin-top: 30px;
        position: relative;
    }
    .feed-item{
        font-size: 24px;
        display: inline-block;
        height: 42px;
        padding:0 18px;
        border-radius: 10px;
        background-color: #EDEDED;
        color: #888888;
        line-height: 44px;
        margin-bottom: 20px;
        margin-right: 20px;
    }
    .feed-item-active{
        background-color: #FF4141;
        color: #FFFFFF;
    }
    .feed-show{
        position: absolute;
        font-size: 24px;
        color: #FF4141;
        // width: 80px;
        display: flex;
        align-items: center;
        top:0;
        right: 0;
        height: 50px;
        line-height: 50px;
        text-align: right;
        font-weight: bold;
        .icon {
          width: 30px;
          height: 30px;
          margin-left: 5px;
          background: url('./assets/down.png') no-repeat;
          background-size: 100% 100%;
          display: inline-block;
          &.down {
            background: url('./assets/up.png') no-repeat;
            width: 30px;
            height: 30px;
            margin-left: 5px;
            background-size: 100% 100%;
            display: inline-block;
          }
        }
        span{
            // padding-right: 25px;
        }
        i{
            margin-left: 5px;
            position: absolute;
            right: -15px;
            transform:scale(0.3,0.3);
        }
    }

}
.details-warp{
    .details-item{
        height: 90px;
        line-height: 90px;
        border-bottom: 1px solid #e6e6e6;
        box-sizing: border-box;
        display: flex;
    }
    .title{
        flex: 1;
        min-width: 0;
        font-size: 28px;
        p{
            font-size: 24px;
            color: #888888;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
    }
    .icon{
        width: 60px;
        flex: 0 60px;
        text-align: right;
        i{
            font-size: 20px;
            color: #CCCCCC;
        }
    }

}
.button-body{
    height: 90px;
    width: 100%;
    position: fixed;
    left: 0;
    bottom: 0;
    display: flex;
    .btn{
        text-align: center;
        flex: 1;
        background: #FF4141;
        color: #fff;
        height: 90px;
        line-height: 90px;
        font-size: 24px;
        &:first-child{
            background-color: #fff;
            color: #FF4141;
        }

    }
}
</style>


