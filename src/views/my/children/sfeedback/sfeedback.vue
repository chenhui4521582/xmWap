<template>
  <transition name="list-fade">
    <div class="problemContainer" :class="{'showHeader': $moduleConfig.isShowHeader}">
      <wf-header title="申诉通道"></wf-header>
      <div class="contain">
        <div class="xl-items">
          <h4>为确保当前操作为本人操作，需要验证以下信息。</h4>
          <h4>1.申诉原因</h4>
          <div class="problemDetails">
            <textarea maxlength="30" name="" id="" cols="30" rows="10" class="detailsInput" v-model="post.description"
                      placeholder="请描述申述理由（30字以内）"></textarea>
          </div>
          <h4>2.拍摄/上传您的二代身份证</h4>
          <div class="ID">
            <div class="uploadInput" :class="{input1:uploadList1.length==0}">
              <input id="file1" accept="image/*" type="file" name="file" @change="preview($event)"
                     v-if="uploadList1.length==0">
              <div class="uploader" v-for="(item,index) in uploadList1" v-else>
                <div class="hasPic">
                  <div class="img">
                    <img :src="item.previewImg" alt="" class="preview">
                  </div>
                  <img src="./image/delete.png" alt="删除" @click="deleteImg('file1')" class="delete">
                </div>
              </div>
            </div>
            <div class="uploadInput" :class="{input2:uploadList2.length==0}">
              <input id="file2" accept="image/*" type="file" name="file" @change="preview($event)"
                     v-if="uploadList2.length==0">
              <div class="uploader" v-for="(item,index) in uploadList2" v-else>
                <div class="hasPic">
                  <div class="img">
                    <img :src="item.previewImg" alt="" class="preview">
                  </div>
                  <img src="./image/delete.png" alt="删除" @click="deleteImg('file2')" class="delete">
                </div>
              </div>
            </div>
          </div>
          <h4 class="desc">* 需要上传和绑定身份证号码一致的身份证照片。</h4>
          <h4 class="desc">* 拍摄示例</h4>
          <img src="./image/sfeedback_demo.png" alt="拍照示例" class="img_demo">
        </div>
        <h4 class="desc">* 信息仅用于身份验证，平台将保障您的信息安全；</h4>
        <h4 class="desc">* 一个游戏账号仅需申诉一次即可，审核通过之后奖品订单状态将自动变更。</h4>
        <h4 class="desc">* 申请提交后请耐心等待，我们将在3个工作日内完成审核。</h4>
        <div @click.stop="submit" class="submit">
          提交
        </div>
      </div>
      <loading :mask="true" v-if="showLoading"></loading>
    </div>
  </transition>
</template>

<script>
  import indexServices from '@/services/index'

  export default {
    data() {
      return {
        details: '',
        select: '',
        originAlert: false,
        selections: [],
        openModal: false,
        post: {
          typeId: 7,
          description: '',
          imageUrls: []
        },
        success: false,
        showLoading: false,
        showRes: false,
        uploadList1: [],
        uploadList2: [],
        postImg: new FormData(),
        imgurlArr: ['', '']
      }
    },
    mounted () {
      document.body.style.background = '#fff'
    },
    methods: {
      deleteImg(type) {
        if (type == 'file1') {
          this.uploadList1 = []
        } else {
          this.uploadList2 = []
        }
      },
      //上传图片
      preview: function(e, index) {
        let event = e
        if (!FileReader) return
        if (!FormData) return
        for (let i of Array.from(e.target.files)) {
          if (i.size > 5 * 1024 * 1024) {
            this.$Toast('上传的图片不能超过5M哦~')
            return
          }
          let previewImg = new FileReader()
          previewImg.readAsDataURL(i)
          let _this = this
          previewImg.onloadend = function(e) {
            let temp = {}
            temp.previewImg = this.result
            let img = new Image()
            img.src = this.result
            img.onload = () => {
              // console.log("********未压缩前的图片大小********");
              // console.log('未压缩前的图片大小',this.result.length);
              let data = _this.compress(img)
              let blob = _this.dataURItoBlob(data)
              // console.log("*******压缩后的图片大小*******");
              // console.log('压缩后的图片大小',blob)
              // console.log('压缩后的图片大小',blob.size/1024);
              if (event.target.id == 'file1') {
                _this.imgurlArr[0] = blob
                _this.uploadList1.push(temp)
              } else {
                _this.imgurlArr[1] = blob
                _this.uploadList2.push(temp)
              }
            }
          }
        }
      },
      //提交反馈
      async submit() {
        if (!this.uploadList1.length) {
          this.$Toast('请上传身份证正面')
          return
        }
        if (!this.uploadList2.length) {
          this.$Toast('请上传身份证反面')
          return
        }
        if (this.post.description == '') {
          this.$Toast('请填写申诉原因')
          return
        }
        if (this.post.description.length < 5) {
          this.$Toast('字数过少，请输入不少于5个字！')
          return
        }
        if (this.post.description.length > 30) {
          this.$Toast('字数不能超过30！')
          return
        }
        this.showLoading = true
        let self = this
        this.postImg = new FormData()
        this.postImg.append('file', this.imgurlArr[0])
        this.postImg1 = new FormData()
        this.postImg1.append('file', this.imgurlArr[1])
        this.postImg.append('isLogo', '1')
        this.postImg1.append('isLogo', '1')
        let data = (await indexServices.picUpload(this.postImg)).data
        let data1 = (await indexServices.picUpload(this.postImg1)).data
        if ((data.code == 200 && data.data && data.data[0]) && (data1.code == 200 && data1.data && data1.data[0])) {
          self.showLoading = false
          self.post.imageUrls = [...data.data, ...data1.data]
          indexServices.submitProblem(self.post).then(
            res => {
              if (res.data.code == 200) {
                self.success = true
                self.showLoading = false
                self.showRes = true
                self.$Toast('提交成功~')
                self.$router.push('/my/prize')//回到我的奖品页
              } else {
                self.$Toast(res.data.message)
                self.$router.push('/my/prize')//回到我的奖品页
              }
            },
            rej => {
              self.showLoading = false
            }
          )
        } else {
          self.showLoading = false
          if (data1.data[0]) {
            self.$Toast('身份证反面上传失败，请重新上传~')
            self.deleteImg('file2')
          } else if (data.data[0]) {
            self.$Toast('身份证正面上传失败，请重新上传~')
            self.deleteImg('file1')
          } else {
            self.deleteImg('file1')
            self.deleteImg('file2')
            self.$Toast('身份证上传失败，请重新上传~')
          }
        }
      },
      // 压缩图片
      compress(img) {
        let canvas = document.createElement('canvas')
        let ctx = canvas.getContext('2d')
        let width = img.width
        let height = img.height
        canvas.width = width
        canvas.height = height
        // 铺底色
        ctx.fillStyle = '#fff'
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        ctx.drawImage(img, 0, 0, width, height)

        //进行最小压缩
        let ndata = canvas.toDataURL('image/jpeg', 0.1)
        return ndata
      },
      // base64转成bolb对象
      dataURItoBlob(base64Data) {
        let byteString
        if (base64Data.split(',')[0].indexOf('base64') >= 0)
          byteString = atob(base64Data.split(',')[1])
        else byteString = unescape(base64Data.split(',')[1])
        let mimeString = base64Data
          .split(',')[0]
          .split(':')[1]
          .split(';')[0]
        let ia = new Uint8Array(byteString.length)
        for (let i = 0; i < byteString.length; i++) {
          ia[i] = byteString.charCodeAt(i)
        }
        return new Blob([ia], { type: mimeString })
      }
    }
  }
</script>

<style lang="less" scoped>
  .problemContainer {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    overflow-y: scroll;
    &.showHeader {
      padding: 100px 24px 20px;
    }
    padding: 30px 24px 20px;
    height: 100%;
    background-color: #fff;
    .contain {
      position: relative;
      font-size: 24px;
      color: rgba(0, 0, 0, 1);
      font-weight: 400;
      .xl-items {
        width: 100%;
        line-height: 0.52*100px;
        position: relative;
        z-index: 10;
        h4 {
          position: relative;
          font-size: 0.26*100px;
          font-weight: 500;
          margin: 5px 0;
        }
        .problemDetails {
          width: 100%;
          height: 1.1*100px;
          background: rgba(247, 247, 247, 1);
          border-radius: 0.16*100px;
          box-sizing: border-box;
          padding: 17px 0 17px 19px;
          h4 {
            font-weight: 500;
            line-height: 0.33*100px;
          }
          .detailsInput {
            color: rgba(94, 108, 133, 1);
            font-size: 0.24*100px;
            background: transparent;
            border: none;
            height: 100%;
            width: 100%;
            display: block;
            box-sizing: border-box;
            resize: none;
            outline: none;
            padding: 0;
            &::-webkit-input-placeholder {
              color: rgba(187, 187, 187, 1);
            }
          }
        }
        .xl-title-bg {
          width: 100%;
          height: 0.52*100px;
          line-height: 0.52*100px;
          background: #141f33;
          border: none;
          text-indent: 0.2*100px;
          font-size: 0.24*100px;
          color: #fff;
          border: 1px solid #999;
          box-sizing: border-box;
        }
        ul {
          background: #ccc;
          color: #000;
          overflow-y: hidden;
          li {
            border-bottom: 0.02rem solid #141f33;
            height: 0.48*100px;
            line-height: 0.48*100px;
            background: #000;
            text-indent: 0.2*100px;
            color: #fff;
          }
        }
        .ID {
          display: flex;
          justify-content: space-between;
          margin-bottom: 10px;
          .uploadInput {
            position: relative;
            width: 3.2*100px;
            height: 2*100px;
            border-radius: 0.12*100px;
            input {
              position: absolute;
              z-index: 11;
              width: 100%;
              height: 100%;
              opacity: 0;
            }
            &.input1:after {
              content: "";
              position: absolute;
              left: 0;
              width: 3.2*100px;
              height: 2*100px;
              background: url("./image/sfeedback_id1.png");
              background-size: 100% 100%;
              z-index: 10;
            }
            &.input2:after {
              content: "";
              position: absolute;
              left: 0;
              width: 3.2*100px;
              height: 2*100px;

              background: url("./image/sfeedback_id0.png");
              background-size: 100% 100%;
              z-index: 10;
            }
          }
          .uploader {
            position: relative;
            width: 3.2*100px;
            height: 2*100px;
            box-sizing: border-box;
            font-size: 0;
            border-radius: 0.12*100px;
            display: flex;
            &::after {
              content: "";
              position: absolute;
              top: 0;
              left: 0;
              box-sizing: border-box;
              width: 200%;
              height: 200%;
              transform: scale(0.5);
              transform-origin: 0 0;
              border-radius: 0.2*100px;
            }
            .hasPic {
              width: 3.2*100px;
              height: 2*100px;
              position: relative;
              border-radius: 0.12*100px;
              .img {
                width: 100%;
                height: 100%;
                border-radius: 0.12*100px;
                position: relative;
                .preview {
                  width: 100%;
                  height: 100%;
                  border-radius: 0.12*100px;
                  position: absolute;
                }
                &:after {
                  content: "";
                  position: absolute;
                  width: 3.2*100px;
                  height: 2*100px;
                  background: url("./image/sfeedback_mask.png");
                  background-size: 100% 100%;
                  opacity: .4;
                }
              }
              .delete {
                width: 0.34*100px;
                height: 0.34*100px;
                position: absolute;
                top: 0.13*100px;
                right: 0.13*100px;
                z-index: 10;
                opacity: .6;
              }
            }
          }
        }
      }
      .submit {
        height: 90px;
        line-height: 90px;
        text-align: center;
        color: #fff;
        font-weight: 500;
        background: rgba(255, 65, 65, 1);
        position: fixed;
        left: 0;
        right: 0;
        bottom: 0;
      }
      .info {
        height: 3*100px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 0.9*100px;
        img {
          width: 1.8*100px;
          height: 1.8*100px;
        }
        p {
          line-height: 0.3*100px;
          &:nth-child(3) {
            color: rgba(255, 255, 255, 0.7);
          }
        }
      }
    }
  }
  .desc {
    line-height: 0.36*100px;
    color: rgba(136, 136, 136, 1);
    margin: 10px 0;
  }

  .img_demo {
    width: 635px;
    height: 143px;
    margin-top: 10px;
  }
</style>

