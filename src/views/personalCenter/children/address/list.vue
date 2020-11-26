<template>
  <main class="address-list" :class="$moduleConfig.isShowHeader&&'show-header'">
    <wf-header title="我的收货地址" :bgColor="'#fff'" />
    <article class="address-container" v-if="showAddressList">
      <ul>
        <li v-for="(item, index) in list" :key="index" @click="selectAddress(item)">
          <div class="details">
            <div class="group">
              <div class="name">{{item.receiverName}}</div>
              <div class="iphone">{{item.receiverMobile}}</div>
              <div class="default-btn" v-if="item.defaultFlag == 2">默认</div>
            </div>
            <div class="group">
              <div class="address">{{item.province}} {{item.city}} {{item.area}}
                {{item.receiverAddress}}</div>
            </div>
          </div>
          <div class="set-btn" @click.stop="goSetAddress(item)">编辑</div>
        </li>
      </ul>
    </article>
    <article class="no-address-container" v-else>
      <img src="./img/no-address.png" alt="" />
    </article>
    <section class="add-btn" @click="AddAddress">
      <p>添加新地址</p>
    </section>
  </main>
</template>
<script>
import { getAddressList } from '@/services/address'
import _get from 'lodash.get'
export default {
  name: 'addressList',
  data: () => ({
    list: []
  }),
  computed: {
    showAddressList () {
      return this.list.length
    }
  },
  methods: {
    /** 获取地址列表 **/
    _getAddressList () {
      getAddressList().then(res => {
        let { code, data, message } = _get(res, 'data')
        if (code == 200) {
          this.list = _get(res, 'data.data', [])
        }
      })
    },
    /** 修改地址 **/
    goSetAddress (item) {
      item.edit = 1
      this.$router.push({
        name: 'setAddress',
        query: item
      })
    },
    /** 新增加地址 **/
    AddAddress () {
      this.$router.push({
        name: 'addAddress'
      })
    },
    selectAddress (item) {
      let from = this.$route.query.from
      if (from) {
        let query = ''
        for (let i in item) {
          query += `${i}=${item[i]}&`
        }
        query += 'from=address'
        const url = `https://wap.beeplaying.com${decodeURIComponent(from)}?${query}`
        window.location.replace(url)
      }
    }
  },
  mounted () {
    this._getAddressList()
    this.$marchSetsPoint('A_H5PT0124003029')
  }
}
</script>
<style scoped lang="less">
.header {
  background: #fff;
}
.address-list {
  padding: 1px 0 95px 0;
  min-height: 100vh;
  background: #f7f7f7;
  &.show-header {
    padding-top: 120px;
  }
  .address-container {
    ul {
      padding: 0 24px;
      background: #fff;
    }
    li {
      padding: 20px 0;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid #eeeeee;
      &:last-child {
        border: none;
      }
      .details {
        padding-right: 100px;
        .group {
          display: flex;
          justify-content: flex-start;
          align-items: center;
          font-size: 24px;
          color: #000;
          &:first-child {
            margin-bottom: 10px;
          }
          .name {
            margin-right: 20px;
            font-size: 28px;
          }
          .iphone {
            margin-right: 34px;
            font-size: 24px;
            color: #888888;
          }
          .default-btn {
            width: 60px;
            height: 30px;
            line-height: 30px;
            text-align: center;
            background: #ff4141;
            font-size: 20px;
            color: #fff;
            border-radius: 6px;
          }
        }
      }
      .set-btn {
        width: 100px;
        height: 60px;
        line-height: 60px;
        border-left: 1px solid #eeeeee;
        text-align: center;
        color: #bbbbbb;
        font-size: 24px;
        flex-shrink: 0;
      }
    }
  }
  .no-address-container {
    margin: 272px auto 0;
    width: 338px;
    height: 226px;
    img {
      vertical-align: top;
      width: 100%;
      height: 100%;
    }
  }
  .add-btn {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 90px;
    line-height: 90px;
    text-align: center;
    background: #ff4141;
    color: #fff;
    font-size: 24px;
  }
}
</style>