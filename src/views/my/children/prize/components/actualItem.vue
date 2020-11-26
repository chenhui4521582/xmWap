<template>
    <Modal v-model="show" title="恭喜您获得">
        <template>
            <div class="award-title">
                <div class="title">
                    <span>{{params.awardsName}}</span> 
                </div>
                <p class="directions"> 请确认您的收货地址</p>
                <p class="directions"> 审核无误后奖品将在48小时内发货</p>
            </div>
            <div class="award-warp" v-if="hasAddressList" @click="goAddressList">
                <div class="detail">
                    <p class="user">
                        <span class="name">{{defaultAddress.receiverName}}</span>
                        <span class="iphone">{{defaultAddress.receiverMobile}}</span>
                    </p>
                    <p>
                        {{defaultAddress.province}}  {{defaultAddress.city}}  {{defaultAddress.area}}  {{defaultAddress.receiverAddress}}
                    </p>
                </div>
                <div class="iconfont icon-next icon"></div>
            </div>
            <wf-button :long=true slot="footer" @click="saveAddress" v-if="hasAddressList">{{btnText}}</wf-button>
            <wf-button :long=true slot="footer" @click="goAddAddress" v-if="!hasAddressList">{{btnText}}</wf-button>
        </template>
    </Modal>
</template>
<script>
import { saveAddress } from "@/services/user"
export default {
    name:"actualItem",
    props:{
        value:{
            type: Boolean,
            default: false
        },
        params:{
            type: Object,
            default: ()=>{
                return {
                    awardsName:"",
                    phone:"",
                    recordId:""
                }
            }
        },
        addressList: {
            type: Array,
            default: ()=> []
        }
    },
    data() {
        return {
            show:this.value,
        }
    },
    computed: {
        hasAddressList() {
            return this.addressList.length
        },
        defaultAddress() {
            let from = this.$route.query.from
            if(from) {
                return this.$route.query
            }
            if(this.hasAddressList) {
                return this.addressList[0]
            }
            return ''
        },
        btnText () {
            if(this.hasAddressList) {
                return '提交'
            }else {
                return '添加新地址'
            }
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
            const {data ,code, message} = await saveAddress({
                receiverId: this.defaultAddress.id,
                recordId
            })
            if(code===200 && data.isSuccess){
                this.show = false;
                this.$emit('on-click',recordId)
            }else{
                this.$Toast(message);
            }
        },
        goAddAddress() {
            this.$router.push({
                name: 'addAddress'
            })
        },
        goAddressList() {
            this.$router.push({
                name: 'addressList',
                query: {
                    from: encodeURIComponent('/xmWap/#/my/prize')
                }
            })
        }
    },
    watch: {
        value(val) {
            if(val){
                this.recMobile = this.params.phone
                this.recName = ""
                this.recAddress = ""
            }
            this.show = val
        },
        show(val) {
            this.$emit('input', val)
        }
    }
}
</script>
<style lang="less" scoped>
.award-title{
    // padding-bottom: 26px;
    .title{
        padding-bottom: 9px;
        font-size: 24px;
        text-align: center;
        span{
            color: #FF4141;
        }
    }
    .directions{
        
        font-size: 20px;
        color: #BBBBBB;
        line-height: 36px;
        text-align: center;
    }
}
.award-warp{
    padding: 24px 0 20px;
    border-top: 1px solid #CCCCCC;
    border-bottom: 1px solid #CCCCCC;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .detail {
        padding-right: 30px;
        p {
            font-size: 24px;
            color: #000;
            .name {
                margin-right: 10px;
            }
            &.user {
                margin-bottom: 10px;
            }
            &:last-child {
                line-height: 1.4rem
            }
        }
    }
    .icon {
        color: #BBBBBB;
        flex-shrink: 0;
    }
    .small-title{
        margin-bottom: 14px;
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


