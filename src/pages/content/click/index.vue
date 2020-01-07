<template>
  <div class="click-index">
    <!-- 点金币 - H5外链 -->
    <div v-if="!isdone">跳转中...请稍后</div>
    <web-view v-else :src="webViewSrc" @bindmessage="getMsgFromWebview"></web-view>
    <!-- <web-view :src="webViewSrc"></web-view> -->
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  data() {
    return {
      isdone: false,
      // webViewSrc: 'https://ts-www.luckyins.com/thirdparty/#/',
      baseUrl: 'https://www.kehanjia.com/h5/index.html',
      webViewSrc: null,
      id: 0
    }
  },
  onLoad() {
    console.log('==> 点金币:', 'load')
    let self = this
    const eventChannel = self.$mp.page.getOpenerEventChannel()
    // 监听acceptDataFromOpenerPage事件，获取上一页面通过eventChannel传送到当前页面的数据
    eventChannel.on('acceptDataFromOpenerPage', function(data) {
      self.id = data.data.id
      console.log('==> id:', self.id)
      console.log('==> token:', self.token)
      console.log('==> score:', self.score)
      self.webViewSrc = self.baseUrl + '?id=' + self.id + '&token=' + self.token + '&score=' + self.score + ''
      self.isdone = true
    })
  },
  onUnload() {
    this.isdone = false
  },
  methods: {
    load(e) {
      console.log('==> load', e)
    },
    error(e) {
      console.log('==> error', e)
    },
    getMsgFromWebview(msg) {
      console.log(msg)
      this.$store.dispatch('fetchUserStore', msg.score)
    }
  },
  computed: {
    ...mapState({
      token: state => state.common.token,
      score: state => state.common.score
    })
  }
}
</script>

<style lang="stylus">
  
</style>