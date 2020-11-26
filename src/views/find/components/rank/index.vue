<template>
  <div class="find-rank" :class="{showRecommend:showRecommend}">
    <div class="title">
      <div class="item">今日明星用户</div>
      <div class="item" @click="goToHotRanking">热度榜单 <i class="icon iconfont icon-next"></i></div>
    </div>
    <ul :class="{only:rankList.length==1}">
      <li v-for="(item,index) in rankData" :key="index" :class="getClass('li',item)">
        <div class="item" @click="openUserInfo(item)">
          <img src="../../images/rank/decoration0.png" alt="" class="decoration decoration0">
          <img :src="(item.profilePhoto||avatar)|filter" alt="" class="avatar">
          <div v-if="item.headFrame" :class="getClass('head-frame',item)">
            <img :src="item.headFrame|filter" alt="">
          </div>
          <img src="../../images/rank/decoration1.png" alt="" class="decoration decoration1">
          <img :src="`${require(`../../images/rank/crown${item.rank}.png`)}`" alt="" class="crown">
        </div>
        <div class="item">
          <div class="name">{{item.nickname||''}}</div>
          <div class="num">{{item.hot}}<i>热度</i></div>
        </div>
        <div class="item">
          <img :src="`${require(`../../images/rank/no${item.rank}.png`)}`" alt="">
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
  export default {
    name: 'rank',
    props:{
      showRecommend:{
        type:Boolean,
        default:false
      },
      rankList: {
        type: Array,
        default: () => []
      }
    },
    data() {
      return {
        avatar: '/cdn/common/images/common/img_photo.png',
        rankData:[]
      }
    },
    methods: {
      getClass(type, item) {
        return `${type} ${type}${item.rank}`
      },
      goToHotRanking(){
        //H5平台-发现-今日明星用户-热度榜单点击
        this.$marchSetsPoint('A_H5PT0272003214')
        this.$router.push('hotRanking')
      },
      openUserInfo(item){
        //H5平台-发现-今日明星用户-用户头像点击
        this.$marchSetsPoint('A_H5PT0272003215',{
          rank_id:item.rank
        })
        this.$emit('openUserInfo',item)
      }
    },
    mounted() {
      if (this.rankList.length > 1) {
        let [first, second, ...rest] = this.rankList
        this.rankData = [second, first, ...rest]
      }else{
        this.rankData =this.rankList
      }
    }
  }
</script>

<style lang="less" scoped>
  .find-rank {
    padding: 70px 24px 20px;
    &.showRecommend{
      padding: 0 24px 30px;
    }
    .title {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size:32px;
      font-weight:bold;
      color:rgba(0,0,0,1);
      .item{
        &:nth-child(2){
          font-size:24px;
          font-weight:400;
          color:rgba(255,65,65,1);
        }
      }
    }
    ul {
      margin-top: 10px;
      display: flex;
      align-items: flex-end;
      &.only{
        justify-content: center;
      }
      li {
        width: 216px;
        box-sizing: border-box;
        padding-bottom: 16px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
        .item {
          text-align: center;
          &:nth-child(1) {
            height:80px;
            position: relative;
            display: flex;
            align-items: center;
            margin-bottom: 14px;
            .avatar{
              width: 80px;
              height: 80px;
            }
            .head-frame {
              position: absolute;
              width: 100px;
              height: 100px;
              top:0;
              bottom: 0;
              left: 0;
              right: 0;
              margin: auto;
              &.head-frame1 {
                width: 120px;
                height: 120px;
              }
              img {
                width: 100%;
                height: 100%;
              }
            }
            .decoration{
              width: 34px;
              height: 82px;
              .decoration0{

              }
              .decoration1{

              }
            }
            .crown{
              width: 72px;
              height: 65px;
              position: absolute;
              left: 8px;
              top:-35px;
            }
          }
          &:nth-child(2) {
            width:80%;
          }
          &:nth-child(3) {
            img {
              width: 160px;
              height: 46px;
            }
          }
          .name{
            font-size:24px;
            font-weight:500;
            color:rgba(0,0,0,1);
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          .num{
            font-size:24px;
            font-weight:500;
            color:rgba(255,65,65,1);
            display: flex;
            align-items: center;
            justify-content: center;
            i{
              margin-left: 1px;
              font-size:20px;
            }
          }
        }
        &.li1 {
          height: 290px;
          background: url("../../images/rank/rankbg1.png");
          background-size: 100% 100%;
          padding-top: 35px;
          padding-bottom: 26px;
          margin: 0 12px;
          .item {
            &:nth-child(1) {
              height:100px;
              .avatar{
                width: 100px;
                height: 100px;
              }
            }
          }
        }
        &.li2 {
          padding-top: 47px;
          height: 270px;
          background: url("../../images/rank/rankbg2.png");
          background-size: 100% 100%;
        }
        &.li3 {
          padding-top: 30px;
          height: 250px;
          background: url("../../images/rank/rankbg3.png");
          background-size: 100% 100%;
        }
      }
    }
  }
</style>
