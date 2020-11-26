<template>
  <div class="loginTip">
   <img src="./img/icon_warn.png" class="icon_warn" />
   <h2 class="title">
       登录提示
   </h2>
   <div class="pnl_tip">
       为保护您的账户安全<br/>
       请登录后再继续游戏
   </div>
   <button class="btn_login" @click="login">立即登录</button>
  </div>
</template>
<script>

import _get from 'lodash.get'
import { getUrlParams } from '@/utils/utils'

export default {
  name: 'loginTip',
  data: () => ({
   
  }),
  computed: {
   from(){
     return getUrlParams('bdto')||'inside-touristBdwap'
   },
   channel() {
       var urlChannel = getUrlParams("channel");
       if(urlChannel){
         localStorage["APP_CHANNEL"] = urlChannel;
       }
       return urlChannel || localStorage["APP_CHANNEL"] || '100070'
   }
  },
  methods: {
   loginWithChannel(){
       let logins = {
           "100039":()=>{
               window.location.href = `https://eopa.baidu.com/page/pagekey-VfVzoACt?productid=1&gtype=1&idfrom=${this.from}&channel=${this.channel}`
           },
           "100047001":()=>{
               window.location.href = `https://eopa.baidu.com/page/pagekey-VfVzoACt?productid=1&gtype=1&idfrom=${this.from}&channel=${this.channel}`
           },
           "100042":()=>{
               window.location.href = `https://eopa.baidu.com/page/pagekey-VfVzoACt?productid=4&gtype=1&idfrom=${this.from}&channel=${this.channel}`
           },
           "100048001":()=>{
               window.location.href = `https://eopa.baidu.com/page/pagekey-VfVzoACt?productid=4&gtype=1&idfrom=${this.from}&channel=${this.channel}`
           },
           "100075":()=>{
               window.location.href = `https://gamecenter.baidu.com/matrix/wanfeng?productid=9&gtype=1&idfrom=&channel=${this.channel}&actionmode=loginmode`
           }
       }
       if(!logins[this.channel]){
        return function(){};
      };
      return logins[this.channel];
   },
   login(){
       this.loginWithChannel()();
   }
  },
  mounted () {
    
  }
}
</script>
<style>
    body{
        height: auto;
    }
</style>
<style scoped lang="less">
    .loginTip
    {
        text-align: center;
        .title
        {
            margin-top:1rem;
            font-weight: 700;
            font-size: 1.2rem;
        }
        .pnl_tip
        {
            margin-top:0.8rem;
            color:#888;
            font-size:0.9rem;
        }
        .icon_warn
        {
            display: block;
            width:7rem;
            height:7rem;
            margin:10rem auto 0 auto;
        }
        .btn_login
        {
            position: absolute;
            left:0;
            bottom: 0;
            border: none;
            width: 100%;
            height: 3.2rem;
            text-align: center;
            background: #FF4141;
            line-height: 3.2rem;
            color:#fff;
            font-size: 0.9rem;
        }
    }
</style>
