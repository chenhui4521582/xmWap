<template>
  <div class="toSupportBankPage">
    <div class="head bgMainColor">
      <span class="bank-name"> <i class="iconfont icon-return" onclick="javascript:window.history.back();"></i>银行卡名称</span>
      <span>卡种</span>
      <span>单笔</span>
      <span>单日</span>
      <span>单月</span>
    </div>
    <ul class="bank-list" id="supportBank">
      <template v-for="(val,key) in list.supportBanklist">
        <li class="item" :class="{vertical:val.length==2}" :key="key+index" v-for="(bank,index) in val">
          <span class="bank-name" :class="{ hidden:index == 1}"><img align="left" :src="getImgUrl(bank.bankCode)"
                                                                     class="logo">{{bank.bankName}}</span>
          <span class="card-type">{{bank.debit == 'DEBIT' ? '储蓄卡' : '信用卡'}}</span>
          <span class="single">{{bank.limitOfBill == -1 ? '-' : bank.limitOfBill}}</span>
          <span class="day">{{bank.limitOfDay == -1 ? '-' : bank.limitOfDay}}</span><span class="month">{{bank.limitOfMonth == -1 ? '-' : bank.limitOfMonth}}</span>
        </li>
      </template>
    </ul>
  </div>
</template>
<script>
  export default {
    name: 'toSupportBankPage',
    data() {
      return {
        list: {
          'supportBanklist': {
            'ABC': [{
              'bankCode': 'ABC',
              'debit': 'DEBIT',
              'bankName': '农业银行',
              'limitOfBill': '5000',
              'limitMinOfBill': '0',
              'limitOfDay': '1万',
              'limitOfMonth': '1万'
            }],
            'JJB': [{
              'bankCode': 'JJB',
              'debit': 'DEBIT',
              'bankName': '九江银行',
              'limitOfBill': '5000',
              'limitMinOfBill': '0',
              'limitOfDay': '1万',
              'limitOfMonth': '1万'
            }],
            'SHXRCU': [{
              'bankCode': 'SHXRCU',
              'debit': 'DEBIT',
              'bankName': '陕西省农村信用社',
              'limitOfBill': '5000',
              'limitMinOfBill': '0',
              'limitOfDay': '1万',
              'limitOfMonth': '1万'
            }],
            'URB': [{
              'bankCode': 'URB',
              'debit': 'DEBIT',
              'bankName': '联合村镇',
              'limitOfBill': '5000',
              'limitMinOfBill': '0',
              'limitOfDay': '1万',
              'limitOfMonth': '1万'
            }],
            'GDB': [{
              'bankCode': 'GDB',
              'debit': 'DEBIT',
              'bankName': '广发银行',
              'limitOfBill': '5000',
              'limitMinOfBill': '0',
              'limitOfDay': '1万',
              'limitOfMonth': '1万'
            }],
            'SXRCU': [{
              'bankCode': 'SXRCU',
              'debit': 'DEBIT',
              'bankName': '山西省农村信用社',
              'limitOfBill': '5000',
              'limitMinOfBill': '0',
              'limitOfDay': '1万',
              'limitOfMonth': '1万'
            }],
            'SCRCU': [{
              'bankCode': 'SCRCU',
              'debit': 'DEBIT',
              'bankName': '四川省农村信用社',
              'limitOfBill': '5000',
              'limitMinOfBill': '0',
              'limitOfDay': '1万',
              'limitOfMonth': '1万'
            }],
            'GDNY': [{
              'bankCode': 'GDNY',
              'debit': 'DEBIT',
              'bankName': '南粤银行',
              'limitOfBill': '5000',
              'limitMinOfBill': '0',
              'limitOfDay': '1万',
              'limitOfMonth': '1万'
            }],
            'CJCCB': [{
              'bankCode': 'CJCCB',
              'debit': 'DEBIT',
              'bankName': '江苏长江商业银行',
              'limitOfBill': '5000',
              'limitMinOfBill': '0',
              'limitOfDay': '1万',
              'limitOfMonth': '1万'
            }],
            'LZBANK': [{
              'bankCode': 'LZBANK',
              'debit': 'DEBIT',
              'bankName': '泸州银行',
              'limitOfBill': '5000',
              'limitMinOfBill': '0',
              'limitOfDay': '1万',
              'limitOfMonth': '1万'
            }],
            'JXRCU': [{
              'bankCode': 'JXRCU',
              'debit': 'DEBIT',
              'bankName': '江西省农村信用社',
              'limitOfBill': '2000',
              'limitMinOfBill': '0',
              'limitOfDay': '1万',
              'limitOfMonth': '1万'
            }],
            'SHB': [{
              'bankCode': 'SHB',
              'debit': 'DEBIT',
              'bankName': '上海银行',
              'limitOfBill': '5000',
              'limitMinOfBill': '0',
              'limitOfDay': '1万',
              'limitOfMonth': '1万'
            }],
            'TJB': [{
              'bankCode': 'TJB',
              'debit': 'DEBIT',
              'bankName': '天津银行',
              'limitOfBill': '2000',
              'limitMinOfBill': '0',
              'limitOfDay': '7000',
              'limitOfMonth': '5000'
            }],
            'HX': [{
              'bankCode': 'HX',
              'debit': 'DEBIT',
              'bankName': '华夏银行',
              'limitOfBill': '5000',
              'limitMinOfBill': '0',
              'limitOfDay': '1万',
              'limitOfMonth': '1万'
            }],
            'NXRCB': [{
              'bankCode': 'NXRCB',
              'debit': 'DEBIT',
              'bankName': '黄河农商银行',
              'limitOfBill': '5000',
              'limitMinOfBill': '0',
              'limitOfDay': '1万',
              'limitOfMonth': '1万'
            }],
            'CQRCB': [{
              'bankCode': 'CQRCB',
              'debit': 'DEBIT',
              'bankName': '重庆农村商业银行',
              'limitOfBill': '5000',
              'limitMinOfBill': '0',
              'limitOfDay': '1万',
              'limitOfMonth': '1万'
            }],
            'GSRCU': [{
              'bankCode': 'GSRCU',
              'debit': 'DEBIT',
              'bankName': '甘肃省农村信用社',
              'limitOfBill': '5000',
              'limitMinOfBill': '0',
              'limitOfDay': '1万',
              'limitOfMonth': '1万'
            }],
            'BOC': [{
              'bankCode': 'BOC',
              'debit': 'DEBIT',
              'bankName': '中国银行',
              'limitOfBill': '5000',
              'limitMinOfBill': '0',
              'limitOfDay': '1万',
              'limitOfMonth': '1万'
            }],
            'QHRCU': [{
              'bankCode': 'QHRCU',
              'debit': 'DEBIT',
              'bankName': '青海省农村信用社',
              'limitOfBill': '5000',
              'limitMinOfBill': '0',
              'limitOfDay': '1万',
              'limitOfMonth': '1万'
            }],
            'CIB': [{
              'bankCode': 'CIB',
              'debit': 'DEBIT',
              'bankName': '兴业银行',
              'limitOfBill': '5000',
              'limitMinOfBill': '0',
              'limitOfDay': '1万',
              'limitOfMonth': '1万'
            }],
            'CDRCB': [{
              'bankCode': 'CDRCB',
              'debit': 'DEBIT',
              'bankName': '成都农商银行',
              'limitOfBill': '5000',
              'limitMinOfBill': '0',
              'limitOfDay': '1万',
              'limitOfMonth': '1万'
            }],
            'CEB': [{
              'bankCode': 'CEB',
              'debit': 'DEBIT',
              'bankName': '光大银行',
              'limitOfBill': '5000',
              'limitMinOfBill': '0',
              'limitOfDay': '1万',
              'limitOfMonth': '1万'
            }],
            'PSBC': [{
              'bankCode': 'PSBC',
              'debit': 'DEBIT',
              'bankName': '邮储银行',
              'limitOfBill': '5000',
              'limitMinOfBill': '0',
              'limitOfDay': '1万',
              'limitOfMonth': '1万'
            }],
            'HKBEA': [{
              'bankCode': 'HKBEA',
              'debit': 'DEBIT',
              'bankName': '东亚银行',
              'limitOfBill': '2000',
              'limitMinOfBill': '0',
              'limitOfDay': '5000',
              'limitOfMonth': '5000'
            }],
            'JSRCU': [{
              'bankCode': 'JSRCU',
              'debit': 'DEBIT',
              'bankName': '江苏省农村信用社',
              'limitOfBill': '5000',
              'limitMinOfBill': '0',
              'limitOfDay': '1万',
              'limitOfMonth': '1万'
            }],
            'CCB': [{
              'bankCode': 'CCB',
              'debit': 'DEBIT',
              'bankName': '建设银行',
              'limitOfBill': '5000',
              'limitMinOfBill': '0',
              'limitOfDay': '1万',
              'limitOfMonth': '1万'
            }],
            'BOCO': [{
              'bankCode': 'BOCO',
              'debit': 'DEBIT',
              'bankName': '交通银行',
              'limitOfBill': '5000',
              'limitMinOfBill': '0',
              'limitOfDay': '1万',
              'limitOfMonth': '1万'
            }],
            'HUBRCU': [{
              'bankCode': 'HUBRCU',
              'debit': 'DEBIT',
              'bankName': '湖北省农村信用社',
              'limitOfBill': '5000',
              'limitMinOfBill': '0',
              'limitOfDay': '1万',
              'limitOfMonth': '1万'
            }],
            'WEBANK': [{
              'bankCode': 'WEBANK',
              'debit': 'DEBIT',
              'bankName': '微众银行',
              'limitOfBill': '5000',
              'limitMinOfBill': '0',
              'limitOfDay': '5000',
              'limitOfMonth': '1万'
            }],
            'XJHHB': [{
              'bankCode': 'XJHHB',
              'debit': 'DEBIT',
              'bankName': '新疆汇和银行',
              'limitOfBill': '5000',
              'limitMinOfBill': '0',
              'limitOfDay': '1万',
              'limitOfMonth': '1万'
            }],
            'HUNRCU': [{
              'bankCode': 'HUNRCU',
              'debit': 'DEBIT',
              'bankName': '湖南省农村信用社',
              'limitOfBill': '5000',
              'limitMinOfBill': '0',
              'limitOfDay': '1万',
              'limitOfMonth': '1万'
            }],
            'BJRCB': [{
              'bankCode': 'BJRCB',
              'debit': 'DEBIT',
              'bankName': '北京农商银行',
              'limitOfBill': '5000',
              'limitMinOfBill': '0',
              'limitOfDay': '5000',
              'limitOfMonth': '1万'
            }],
            'RHCZBC': [{
              'bankCode': 'RHCZBC',
              'debit': 'DEBIT',
              'bankName': '长子县融汇村镇银行',
              'limitOfBill': '5000',
              'limitMinOfBill': '0',
              'limitOfDay': '1万',
              'limitOfMonth': '1万'
            }],
            'HZCCB': [{
              'bankCode': 'HZCCB',
              'debit': 'DEBIT',
              'bankName': '湖州银行',
              'limitOfBill': '5000',
              'limitMinOfBill': '0',
              'limitOfDay': '1万',
              'limitOfMonth': '1万'
            }],
            'ECITIC': [{
              'bankCode': 'ECITIC',
              'debit': 'DEBIT',
              'bankName': '中信银行',
              'limitOfBill': '5000',
              'limitMinOfBill': '0',
              'limitOfDay': '1万',
              'limitOfMonth': '1万'
            }],
            'BGZ': [{
              'bankCode': 'BGZ',
              'debit': 'DEBIT',
              'bankName': '贵州银行',
              'limitOfBill': '5000',
              'limitMinOfBill': '0',
              'limitOfDay': '1万',
              'limitOfMonth': '1万'
            }],
            'CMBC': [{
              'bankCode': 'CMBC',
              'debit': 'DEBIT',
              'bankName': '民生银行',
              'limitOfBill': '5000',
              'limitMinOfBill': '0',
              'limitOfDay': '1万',
              'limitOfMonth': '1万'
            }],
            'HEBRCU': [{
              'bankCode': 'HEBRCU',
              'debit': 'DEBIT',
              'bankName': '河北省农村信用社',
              'limitOfBill': '5000',
              'limitMinOfBill': '0',
              'limitOfDay': '1万',
              'limitOfMonth': '1万'
            }],
            'HRB': [{
              'bankCode': 'HRB',
              'debit': 'DEBIT',
              'bankName': '哈尔滨银行',
              'limitOfBill': '5000',
              'limitMinOfBill': '1',
              'limitOfDay': '1万',
              'limitOfMonth': '1万'
            }],
            'ICBC': [{
              'bankCode': 'ICBC',
              'debit': 'DEBIT',
              'bankName': '工商银行',
              'limitOfBill': '5000',
              'limitMinOfBill': '0',
              'limitOfDay': '1万',
              'limitOfMonth': '1万'
            }],
            'TRCB': [{
              'bankCode': 'TRCB',
              'debit': 'DEBIT',
              'bankName': '天津农商银行',
              'limitOfBill': '5000',
              'limitMinOfBill': '0',
              'limitOfDay': '1万',
              'limitOfMonth': '1万'
            }],
            'FJRCU': [{
              'bankCode': 'FJRCU',
              'debit': 'DEBIT',
              'bankName': '福建省农村信用社',
              'limitOfBill': '5000',
              'limitMinOfBill': '0',
              'limitOfDay': '1万',
              'limitOfMonth': '1万'
            }],
            'SPDB': [{
              'bankCode': 'SPDB',
              'debit': 'DEBIT',
              'bankName': '浦发银行',
              'limitOfBill': '5000',
              'limitMinOfBill': '0',
              'limitOfDay': '1万',
              'limitOfMonth': '1万'
            }],
            'HENRCU': [{
              'bankCode': 'HENRCU',
              'debit': 'DEBIT',
              'bankName': '河南省农村信用社',
              'limitOfBill': '5000',
              'limitMinOfBill': '0',
              'limitOfDay': '1万',
              'limitOfMonth': '1万'
            }],
            'BCCB': [{
              'bankCode': 'BCCB',
              'debit': 'DEBIT',
              'bankName': '北京银行',
              'limitOfBill': '5000',
              'limitMinOfBill': '0',
              'limitOfDay': '1万',
              'limitOfMonth': '1万'
            }],
            'SZPA': [{
              'bankCode': 'SZPA',
              'debit': 'DEBIT',
              'bankName': '平安银行',
              'limitOfBill': '5000',
              'limitMinOfBill': '0',
              'limitOfDay': '1万',
              'limitOfMonth': '1万'
            }]
          }
        }
      }
    },
    methods: {
      getImgUrl(code) {
        return `https://shouyin.yeepay.com/nc-cashier-wap/static/images/${code}.png`
      }
    }
  }
</script>

<style lang="less" scoped>
  body {
    background-color: #ffffff;
  }

  body, div, ul, li {
    margin: 0;
    padding: 0;
  }

  ul {
    list-style: none;
  }

  .hidden {
    visibility: hidden;
  }

  .head {
    padding-left: 10px;
    height: 50px;
    background-color: #2eb944;
    color: #ffffff;
    line-height: 50px;
    font-size: 14px;
  }

  .head span, .bank-list span {
    margin-right: 10px;
    display: inline-block;
    width: 14.5%;
    vertical-align: middle;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .head span.bank-name, .bank-list span.bank-name {
    width: 25%;
  }

  .bank-list span.bank-name {
    display: inline-flex;
    align-items: center;
    white-space: normal;
    line-height: 20px;
  }

  .bank-list {
    padding-left: 10px;
    font-size: 12px;
  }

  .bank-list .item {
    height: 50px;
    line-height: 50px;
    border-bottom: #e2e2e2 solid 1px;
  }

  .bank-list .item .logo {
    margin-right: 5px;
    vertical-align: middle;
    width: 30px;
  }

  .bank-list .item.vertical .bank-name {
    position: relative;
    top: 22px;
    background-color: #ffffff;
  }

  .pme-go-back {
    position: static;
    color: #ffffff;
    vertical-align: middle;
  }
</style>
