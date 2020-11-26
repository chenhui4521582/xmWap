<template>
  <div class="set-address" :class="$moduleConfig.isShowHeader&&'show-header'">
    <wf-header v-if="routerName == 'setAddress'" title="编辑收货地址" :bgColor="'#fff'" />
    <wf-header v-if="routerName == 'addAddress'" title="添加收货地址" :bgColor="'#fff'" />
    <div class="wrap">
      <div class="user-name item">
        <div class="lable">收货人</div>
        <div class="input-wrap">
          <input type="text" placeholder="填写收货人姓名" v-model="name" />
        </div>
      </div>
      <div class="mobile item">
        <div class="lable">手机号码</div>
        <div class="input-wrap">
          <input type="number" placeholder="请填写收货人手机号" v-model="phone" maxlength="11" />
        </div>
      </div>
      <div class="area item" @click="openArea">
        <div class="lable">所在地区</div>
        <div class="text">{{ areaText }}</div>
        <div class="iconfont icon-next icon">
        </div>
      </div>
      <div class="detail item">
        <div class="lable">详细地址</div>
        <div class="input-wrap">
          <textarea type="text" placeholder="街道、楼牌号等" v-model="address"></textarea>
        </div>
      </div>
      <div class="tips" :class="{'active': regTextLength}">（请输入5~120字符）</div>
    </div>
    <div class="default-address item" @click="clickToggle">
      <div class="lable">设置默认地址</div>
      <div class="icon" :class="{ active: defaultAddress == 2 }"></div>
    </div>
    <div class="remove-address" v-if="isEdit == 1" @click="openRemove">
      <div class="lable">删除地址</div>
    </div>
    <div class="save-btn" :class="{ active: isSubmit }" @click="save">
      保存
    </div>
    <select-address v-model="showArea" :areaData="areaData" @usedArea="usedArea" />
    <Modal v-model="showRemove" title="温馨提示" :type="2" :saveText="'删除'" @on-save="_removeAddress">
      <div class="container">
        确定要删除该地址吗？
      </div>
    </Modal>
  </div>
</template>
<script>
import { addAddress, removeAddress } from '@/services/address'
import SelectAddress from './components/selectAddress'
import _get from 'lodash.get'
export default {
  name: 'setAddress',
  data: () => ({
    name: '',
    phone: '',
    province: '',
    provinceName: '',
    city: '',
    cityName: '',
    area: '',
    areaName: '',
    itemId: '',
    address: '',
    defaultAddress: 0,
    showArea: false,
    areaData: [],
    isEdit: 0,
    addressId: '',
    showRemove: false
  }),
  components: {
    SelectAddress
  },
  computed: {
    areaText () {
      if (this.provinceName && this.cityName && this.areaName) {
        return `${this.provinceName} ${this.cityName} ${this.areaName}`
      }
      return '省市区县、乡镇等'
    },
    isSubmit () {
      if (this.name && this.phone && this.areaText && !this.regTextLength) {
        return true
      }
      return false
    },
    regTextLength () {
      if (this.address.length < 5 || this.address.length > 120) {
        return true
      } else {
        return false
      }
    },
    routerName () {
      return this.$route.name
    }
  },
  methods: {
    save () {
      let phoneReg = /^1[0-9]{10}$/
      if (this.name == '') {
        this.$Toast('请输入收货人')
        return false
      }
      if (!phoneReg.test(this.phone)) {
        this.$Toast('请输入正确的联系电话')
        return false
      }
      if (this.areaText == '请选择') {
        this.$Toast('请选择地区')
        return false
      }
      if (this.regTextLength) {
        this.$Toast('请输入详细地址')
        return false
      }
      /** 提交锁 **/
      if (this.lock) {
        return false
      }
      this.lock = true
      addAddress({
        'id': this.isEdit == 1 ? this.addressId : '',
        'recAddress': this.address,
        'defaultFlag': this.defaultAddress == 2 ? true : false,
        'placeId': this.itemId ? this.itemId : '',
        'recName': this.name,
        'recMobile': this.phone
      }).then(res => {
        let { code, message } = _get(res, 'data')
        if (code == 200) {
          this.$Toast('设置成功', () => {
            this.lock = false
            this.$router.go(-1)
          })
        } else {
          this.$Toast(message)
        }
      }).catch(error => {
        this.lock = false
      })
    },
    /** 打开区域选择 **/
    openArea () {
      if (this.areaName) {
        this.areaData = [
          { id: this.province, name: this.provinceName, parentId: 86 },
          { id: this.city, name: this.cityName, parentId: this.province },
          { id: this.area, name: this.areaName, parentId: this.city }
        ]
      } else {
        this.areaData = []
      }
      this.showArea = true
    },
    /** 接收选择的地区 **/
    usedArea (data) {
      if (data) {
        this.province = data[0].id
        this.provinceName = data[0].name
        this.city = data[1].id
        this.cityName = data[1].name
        this.area = data[2].id
        this.areaName = data[2].name
        this.itemId = data[2].itemId
      }
      this.areaData = data
    },
    clickToggle () {
      if (this.defaultAddress == 2) {
        this.defaultAddress = 1
      } else {
        this.defaultAddress = 2
      }
    },
    openRemove () {
      this.showRemove = true
    },
    /** 删除地址 **/
    _removeAddress () {
      removeAddress(this.addressId).then(res => {
        let { code, data, message } = _get(res, 'data')
        if (code == 200) {
          this.showRemove = false
          this.$Toast('删除成功', () => {
            this.$router.go(-1)
          })
        } else {
          this.$Toast(message)
        }
      })
    }
  },
  mounted () {
    let query = this.$route.query
    if (query) {
      let { receiverName, receiverMobile, provinceCode, province, cityCode, city, areaCode, area, receiverAddress, defaultFlag, edit, id } = query
      receiverName && (this.name = receiverName)
      receiverMobile && (this.phone = receiverMobile)
      provinceCode && (this.province = provinceCode)
      province && (this.provinceName = province)
      cityCode && (this.city = cityCode)
      city && (this.cityName = city)
      areaCode && (this.area = areaCode)
      area && (this.areaName = area)
      receiverAddress && (this.address = receiverAddress)
      defaultFlag && (this.defaultAddress = defaultFlag)
      edit && (this.isEdit = edit)
      id && (this.addressId = id)
    }
  }
}
</script>
<style lang="less" scoped>
.set-address {
  min-height: 100vh;
  padding-top: 0;
  background: #f7f7f7;
  &.show-header {
    padding-top: 120px;
  }
  .wrap {
    margin-bottom: 20px;
    padding: 0 24px;
    background: #fff;
    .item {
      overflow: hidden;
      height: 90px;
      border-bottom: 1px solid #f0f0f0;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      &:last-child {
        border: none;
      }
    }
    .lable {
      width: 128px;
      font-size: 24px;
      font-weight: 400;
      color: #000000;
      flex-shrink: 0;
    }
    .input-wrap {
      float: left;
      input {
        width: 500px;
        height: 60px;
        font-size: 24px;
        line-height: 60px;
        font-weight: 400;
        color: #bbbbbb;
      }
    }
    .area {
      .text {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        float: left;
        width: 530px;
        height: 60px;
        line-height: 60px;
        font-size: 24px;
        font-weight: 400;
        color: #bbbbbb;
      }
      .icon {
        flex-shrink: 0;
        font-size: 24px;
        line-height: 60px;
        font-weight: 400;
        color: #bbbbbb;
      }
    }
    .detail {
      padding: 30px 0;
      height: auto;
      align-items: flex-start;
      textarea {
        display: block;
        width: 500px;
        height: 120px;
        border: none;
        font-size: 24px;
        font-weight: 400;
        color: #bbbbbb;
      }
    }
    .tips {
      padding: 8px 0 23px 110px;
      font-size: 20px;
      color: #bbbbbb;
      &.active {
        color: #ff4141;
      }
    }
  }
  .default-address {
    margin-bottom: 20px;
    padding: 0 24px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 90px;
    background: #fff;
    .lable {
      width: 200px;
      font-size: 24px;
      color: #000;
      font-weight: 400;
    }
    .icon {
      width: 60px;
      height: 36px;
      background: url(./img/unactive.png) no-repeat center center;
      background-size: 58px 100%;
      &.active {
        background: url(./img/actived.png) no-repeat center center;
        background-size: 58px 100%;
      }
    }
  }
  .remove-address {
    padding: 0 24px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 90px;
    background: #fff;
    .lable {
      width: 200px;
      font-size: 24px;
      color: #ff4141;
      font-weight: 400;
    }
  }
  .save-btn {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 10;
    height: 90px;
    line-height: 90px;
    text-align: center;
    font-size: 24px;
    background: #fbafaf;
    color: #ffffff;
    &.active {
      background: #ff4141;
    }
  }
}
.container {
  padding: 20px 0;
  color: #888888;
  font-size: 24px;
  text-align: center;
}
</style>
