<template>
  <div class="article-index">
    <img :src="bg5" alt="" class="content-bg-image">
    <!-- 浮动标题栏 -->
    <view class="cu-bar bg-blue shadow search fixed" v-show="showFixedTitle">
      <view class="cu-avatar round"></view>
      <view class="content">
        白雪公主和七个小矮人
      </view>
      <view class="action">
        <text class="cuIcon-more"></text>
      </view>
    </view>
    <div class="normal-inside">
      <!-- 金币 -->
      <view class="cu-capsule round">
        <view class='cu-tag bg-blue '>
          <text class='cuIcon-evaluate_fill'></text>
        </view>
        <view class="cu-tag line-blue">
          999
        </view>
      </view>
    </div>
    <view class='audiosBox'>
      <view class="audioOpen" @click="listenerButtonPlay" v-if="!isOpen">
        <text class='cuIcon-playfill'></text>
      </view>
      <view class="audioOpen" @click="listenerButtonPause" v-else>
        <text class='cuIcon-stop'></text>
      </view>
      <div class='slid'>
        <slider @change="sliderChange"  block-size="12px" step="2" :value="offset" :max="max" selected-color="#4c9dee" />
        <view>
          <!-- 进度时长 -->
          <text class='times'>{{starttime}}</text>
          <!-- 总时长 -->
          <text class='times'>{{duration}}</text>
        </view>
      </div>
    </view>
    <!-- 文字 -->
    <!-- 主要故事内容 -->
    <view class="padding content-wrap">
      <!-- <rich-text id="preContent" :nodes="content" @click="eventProxy" class="content-text-style"></rich-text> -->
      <web-view :src="webViewSrc"></web-view>
    </view>
  </div>
</template>

<script>
import '../../assets/styles/content.styl'
import bg5 from '../../../static/images/content-bg-7.jpg'
export default {
  data() {
    return {
      bgMusic: null,
      isOpen: false, // 播放开关
      starttime: '00:00', // 正在播放时长
      duration: '', // 总时长
      src: '',
      offset: 0,
      max: 0,
      changePlay: false,
      // 播放倒计时时间
      gapTime: 0,
      content: 'It was the middle of winter, and the snow-flakes were falling like feathers from the sky, and a queen sat at her window working, and her embroidery-frame was of ebony. And as she worked, gazing at times out on the snow, she pricked her finger, and there fell from it three drops of blood on the snow. And when she saw how bright and red it looked, she said to herself, "Oh that I had a child as white as snow, as red as blood, and as black as the wood of the embroidery frame!" Not very long after she had a daughter, with a skin as white as snow, lips as red as blood, and hair as black as ebony, and she was named Snow-white. And when she was born the queen died. After a year had gone by the king took another wife, a beautiful woman, but proud and overbearing, and she could not bear to be surpassed in beauty by any one. She had a magic looking-glass, and she used to stand before it, and look in it, and say',
      hilitText: ['winter', 'queen', 'blood'],
      webViewSrc: 'https://ts-www.luckyins.com/thirdparty/',
      bg5
    }
  },
  onLoad() {
    this.bgMusic = wx.getBackgroundAudioManager()
  },
  created() {
    // this.replaceHilit()
    console.log('created')
  },
  mounted() {
    this.replaceHilit().then(() => {
      const query = wx.createSelectorQuery()
      console.log('query', query)
    })
  },
  methods: {
    eventProxy(e) {
      console.log(e)
    },
    // 替换关键字
    replaceHilit() {
      return new Promise(resolve => {
        this.hilitText.forEach(item => {
          let reg = new RegExp(item, 'g')
          let hilitHtml = '<span class="text-center text-shadow text-blue highlight"><a href="javascript:;" class="key-words-' + item + '" data-key="' + item + '">' + item + '</a></span>'
          this.content = this.content.replace(reg, hilitHtml)
        })
        resolve()
      })
    },
    showHilitKeys() {
      console.log(111)
    },
    // 播放
    listenerButtonPlay() {
      this.bgMusic.title = '白雪公主和七个小矮人'
      this.bgMusic.epname = '童话故事'
      this.bgMusic.singer = '白雪公主和七个小矮人'
      this.bgMusic.coverImgUrl = ''
      // 设置了 src 之后会自动播放
      this.bgMusic.src = 'http://134.175.157.41/audio/twilight.mp3'
      console.log('==> 音乐对象：', this.bgMusic)
      // 加载中事件
      this.bgMusic.onWaiting(() => {
        console.log('等待播放中')
      })
      // 播放事件
      this.bgMusic.onPlay(() => {
        if (this.bgMusic.duration) {
          // 总时长
          this.duration = this._formatSeconds(this.bgMusic.duration)
        }
      })
      // 可以播放状态事件
      this.bgMusic.onCanplay(() => {
        console.log('可以播放了', this.bgMusic)
      })
      this.bgMusic.onTimeUpdate(() => {
        // 当前进度
        var currentTime = parseInt(this.bgMusic.currentTime)
        var min = '0' + parseInt(currentTime / 60)
        this.max = parseInt(this.bgMusic.duration)
        var sec = currentTime % 60
        if (sec < 10) {
          sec = '0' + sec
        }
        this.starttime = min + ':' + sec
        this.offset = currentTime
        this.changePlay = true
      })
      // 播放结束
      this.bgMusic.onEnded(() => {
        this.starttime = '00:00'
        this.isOpen = false
        this.offset = 0
        console.log('音乐播放结束')
      })
      // 播放出错
      this.bgMusic.onError((res) => {
        console.log(res)
      })
      this.bgMusic.play()
      this.isOpen = true
    },
    // 暂停播放
    listenerButtonPause() {
      this.bgMusic.pause()
      this.isOpen = false
    },
    listenerButtonStop() {
      this.bgMusic.stop()
    },
    // 进度条拖拽
    sliderChange(e) {
      var offset = parseInt(e.target.value)
      this.bgMusic.play()
      this.bgMusic.seek(offset)
      this.isOpen = true
    }
  },
  filters: {
  },
  // 页面卸载时停止播放
  onUnload() {
    // 停止播放
    this.listenerButtonStop()
  }
}
</script>

<style lang="css">
.audiosBox{
  width: 100%;
  position: fixed;
  bottom: 0;
  margin: auto;
  height: 130rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #f6f7f7;
  border-radius: 10rpx;
}
/*按钮大小  */
.audioOpen{
  width: 70rpx;
  height: 70rpx;
  border: 2rpx solid #999;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 20rpx;
}
/*进度条长度  */
.slid{
  flex: 1;
  position: relative;
}
.slid view{
  display: flex;
  justify-content: space-between;
}
slider{
  width: 100%;
  margin: 0;
  margin-left: 35rpx;
}
/*横向布局  */
.times{
  width: 100rpx;
  text-align: center;
  display: inline-block;
  font-size: 24rpx;
  margin-top: 5rpx;
}
.title view{
  text-indent: 2em;
}
.content-wrap >.highlight {
  display: inline-block;
  font-weight: bold;
  color: #000;
  padding-left: 10rpx;
  padding-right: 10rpx;
}
</style>