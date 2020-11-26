<template>
  <div class="index-banner">
    <div class="wrapper">
      <div id="pnl_bannerList" @click="clickBanner">
           <swiper v-if="list.length>0" :options="options">
            <swiper-slide class="swiper-slide" v-for="(item, index) in list" :key="index">
              <img class="swiper-img" :data_index="index" :src="item.image | filter" alt="" />
            </swiper-slide>
          </swiper>
          <div class="swiper-pagination"></div>
      </div>
    </div>
  </div>
</template>

<script>

import { swiper, swiperSlide } from 'vue-awesome-swiper'
import 'swiper/dist/css/swiper.css'
import Services from '@/services/index'
import _get from 'lodash.get'
import { jumpUrl } from '@/utils/utils'
import API from '@/services/API/API'

export default {
  name: 'banner',
  data: () => ({
    options: {
      autoplay: true,
      loop:true,
      pagination: {
        el: '.swiper-pagination',
        clickable: true
      },
      observer: true,
      observeParents: true
    },
    list: []
  }),
  components: {
    swiper,
    swiperSlide
  },
  methods: {
    /** 获取banner图 **/
    _getBannerList () {
      Services.getBannerList().then(res => {
        this.list = _get(res, 'data.data', [])
      })
    },
    slideClick (item, index) {
      this.$marchSetsPoint('A_H5PT0019000192', {
        position_id: index,
        task_id: item.id,
        task_name: item.name,
        target_project_id: item.type
      })
      if (item.name === '新手承接活动') {
        let xhr = new XMLHttpRequest()
        xhr.open('get', API.getNewUserActivity)
        xhr.setRequestHeader('Authorization', localStorage.getItem('ACCESS_TOKEN'))
        xhr.send()
        xhr.onreadystatechange = function () {
          if (xhr.readyState == 4 && xhr.status == 200) {
            jumpUrl({ url: xhr.getResponseHeader('uri') + '?from=banner' })
          }
        }
      } else {
        let url = item.lightUrl || item.url
        if (url && (url.indexOf('popup') != -1 || url == 'treasureCeremony1908')) {
          this.$emit('callback', url)
        } else {
          jumpUrl({ url })
        }
      }
    },
    clickBanner(e){
      let index =  e.target.getAttribute('data_index') || '';
      if(index!=''){
        this.slideClick(this.list[index],index);
      }
    },
    disableBdSwipe(isDisable){
      var disable = document.getElementById('pnl_bannerList');

      function frameRequest(src){
        var iframe = document.createElement('iframe');
            iframe.src = src;
            iframe.style.display = 'none';
            document.body.appendChild(iframe);
            setTimeout(function () {
                iframe.remove();
            }, 0)
      }

      function stopSwipe(){
        frameRequest('bdminivideo://webview/swipeBack?params=' + encodeURIComponent(JSON.stringify({enabled: 0})))
      }

      function openSwipe(){
        frameRequest('bdminivideo://webview/swipeBack?params=' + encodeURIComponent(JSON.stringify({enabled: 1})))
      }

      if(isDisable){
        disable.addEventListener('touchstart', stopSwipe);
        disable.addEventListener('touchend', openSwipe);
      }
      else
      {
        disable.removeEventListener('touchstart', stopSwipe);
        disable.removeEventListener('touchend', openSwipe);
      }
    }
  },
  mounted () {
    this._getBannerList();
    if(localStorage['APP_CHANNEL'] == '100042'){
      this.disableBdSwipe(true);
    }
  },
  beforeDestroy () {
    if(localStorage['APP_CHANNEL'] == '100042'){
      this.disableBdSwipe(false);
    }
  }
}
</script>

<style lang="less">
.index-banner {
  position: relative;
  margin-bottom: 30px;
  padding: 0 24px;
  overflow: hidden;
  .swiper-container {
    border-radius: 16px;
  }
  .swiper-img {
    vertical-align: top;
    width: 100%;
    height: 220px;
    border-radius: 16px;
    overflow: hidden;
  }
  .swiper-pagination {
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 5;
  }
  .swiper-pagination-bullet {
    margin: 0 4px;
    width: 10px;
    height: 10px;
    background: hsla(0, 0%, 100%, 1);
  }
  .swiper-pagination-bullet-active {
    background: hsla(0, 0%, 100%, 0.8);
    width: 20px;
    border-radius: 30px;
  }
}
</style>
