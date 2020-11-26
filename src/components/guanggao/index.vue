<template>
  <div>
    <div class="guanggao" :id="id" v-if="isbaidu" @click="clickAdver"></div>
    <ins
      class="adsbygoogle"
      style="display:inline-block;width:100%;height:1.45rem"
      data-ad-client="ca-pub-3268746807314247"
      :data-ad-slot="advertId"
      v-if="isgoogle"
    ></ins>
  </div>
</template>

<script>
export default {
  name: 'index',
  props: {
    position: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      isbaidu: false,
      advertId: '',
      isgoogle: false
    }
  },
  computed: {
    id() {
      return (
        '_' +
        Math.random()
          .toString(36)
          .slice(2)
      )
    }
  },
  methods: {
    clickAdver() {
      this.$marchSetsPoint('P_H5PT0142', {
        target_project_id: this.position,
        task_id: this.advertId,
        source_address: this.getTaskName(this.position)
      })
    },
    getTaskName(position) {
      let res = ''
      switch (position) {
        case 13:
          res = '首页游戏位置1'
          break
        case 14:
          res = '首页游戏位置2'
          break
        case 15:
          res = '每日任务位置1'
          break
        case 16:
          res = '每日任务位置2'
          break
        case 17:
          res = '每日任务位置3'
          break
      }
      return res
    }
  },
  async mounted() {
    let data = JSON.parse(sessionStorage.getItem('advertData'))
    let res = data.filter(item => item.position == this.position)
    let url = res[0].url
    this.isbaidu = url && url.includes('baidu')
    this.isgoogle = url && url.includes('google')
    this.advertId = (url && url.split(';')[1]) || ''
    this.$marchSetsPoint('P_H5PT0142', {
      task_id: this.advertId,
      source_address: this.getTaskName(this.position)
    })
  },
  updated() {
    try {
      if (this.isbaidu) {
        ;(window.slotbydup = window.slotbydup || []).push({
          id: this.advertId,
          container: this.id
        })
      }
      if (this.isgoogle) {
        ;(adsbygoogle = window.adsbygoogle || []).push({})
      }
    } catch (e) {}
  }
}
</script>

<style lang="less" scoped>
.guanggao,
.adsbygoogle {
  &.task {
    margin-bottom: 0.2rem;
  }
  &.message {
    position: fixed;
    bottom: 0;
  }
}
</style>
