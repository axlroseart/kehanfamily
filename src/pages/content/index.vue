<template>
  <div class="article-index">
    <!-- 金币奖励框 -->
    <div class="coins">
      <img :src="gold_coin" alt="">
      <label>{{ score }}</label>
    </div>
    <view class="padding content-wrap">
      <!-- 点金币 - H5外链 -->
      <web-view v-if="type === 'click'" :src="webViewSrc"></web-view>
      <!-- partial:index.partial.html -->
      <!-- 听金币 -->
      <div class="wrapper" v-if="type === 'listen'">
        <div class="player">
          <div class="swiper-wrap">
            <!-- <swiper class="listen-page-swiper" :class="dotStyle?'square-dot':'round-dot'" :indicator-dots="true" :circular="true"
            :autoplay="false" interval="5000" duration="500">
              <swiper-item v-for="(item,index) in swiperList" :key="index" :class="cardCur == index ? 'cur' : ''">
                <image :src="item.picUrl" mode="aspectFill"></image>
              </swiper-item>
            </swiper> -->
            <swiper 
              :current="cardCur"
              :indicator-dots="indicatorDots" 
              :autoplay="autoplay" 
              @change="swiperChange" 
              @animationfinish="animationfinish" 
            >
              <div v-for="(item, index) in swiperList" :key="index">
                <swiper-item>
                  <image :src="item.picUrl" class="slide-image" mode="aspectFill" />
                </swiper-item>
              </div>
            </swiper>
          </div>
          <div class="player__top">
            <!-- <div class="player-cover"> -->
              <!-- <div
                class="player-cover__item"
                v-show="$index === currentTrackIndex"
                v-for="(track, $index) in tracks"
                :key="$index"
                :style="{ 'background': 'url(' + track.cover + ')' }"
              > -->
            <!-- </div> -->
            <!-- 按钮控制区 -->
            <div class="player-controls">
              <!-- <div
                class="player-controls__item -favorite"
                :class="{ active : currentTrack.favorited }"
                @click="favorite"
              >
                <text class="cuIcon-like"></text>
              </div> -->
              <text class="listen-text" @click="stop">停止播放</text>
              <!-- <div class="player-controls__item" @click="prevTrack">
                <text class="cuIcon-pullleft"></text>
              </div>
              <div class="player-controls__item" @click="nextTrack">
                <text class="cuIcon-pullright"></text>
              </div> -->
              <div class="player-controls__item -xl js-play">
                <text class="cuIcon-playfill" v-if="!isTimerPlaying && isCanPlay" @click="playAudio"></text>
                <text class="cuIcon-stop" v-else-if="isTimerPlaying && isCanPlay" @click="pause"></text>
                <!-- <text loading class="cuIcon-loading2 cuIconfont-spin"></text> -->
                <button class="cu-btn block bg-black margin-tb-sm lg" loading v-else></button>
              </div>
            </div>
          </div>
          <div class="progress" ref="progress">
            <div class="progress__top">
              <div class="album-info" v-if="currentTrack">
                <div class="album-info__name">{{ currentTrack.title }}</div>
                <div class="album-info__track">{{ currentTrack.title }}</div>
              </div>
              <div class="progress__duration">{{ duration }}</div>
            </div>
            <div class="progress__bar" @click="clickProgress">
              <div class="progress__current" :style="{ width : barWidth }"></div>
            </div>
            <div class="progress__time">{{ currentTime }}</div>
          </div>
        </div>
      </div>
      <!-- partial -->
    </view>
  </div>
</template>

<script>
import '../../assets/styles/content.styl'
import '../../assets/styles/audioPlayer.css'
// import 'nouislider/distribute/nouislider.css'
import cover1 from '../../assets/images/t1.jpeg'
import cover2 from '../../assets/images/t2.jpg'
import gold_coin from '../../assets/images/icon-gold_coin.png'
// import noUiSlider from 'nouislider'
import progress from '../../components/process.vue'
import { mapState } from 'vuex'
export default {
  data() {
    return {
      webViewSrc: 'https://www.kehanjia.com/h5/index.html',
      // webViewSrc: 'https://ts-www.luckyins.com/thirdparty/',
      type: '',
      gold_coin,
      bgm: null,
      circleLeft: null,
      barWidth: null,
      duration: 0,
      currentTime: 0,
      isTimerPlaying: false,
      tracks: [],
      background: ['demo-text-1', 'demo-text-2', 'demo-text-3'],
      currentTrack: {
        name: "白雪公主和七个小矮人",
        artist: "白雪公主和七个小矮人",
        cover: cover1,
        source: "http://134.175.157.41/audio/twilight.mp3",
        url: "#",
        favorited: true
      },
      currentTrackIndex: 0,
      transitionName: null,
      dotStyle: false,
      score: 0,
      swiperList: [],
      correctCurr: 0,
      cardCur: 0,
      isCanPlay: false,
      resource: null,
      // 时间数据
      timeArray: [],
      indicatorDots: true,
      autoplay: false,
      interval: 1500,
      duration: 400,
      circular: false,
      rollbacktimer: null
    }
  },
  onLoad() {
    let self = this
    self.bgm = wx.getBackgroundAudioManager()
    const eventChannel = this.$mp.page.getOpenerEventChannel()
    // 监听acceptDataFromOpenerPage事件，获取上一页面通过eventChannel传送到当前页面的数据
    eventChannel.on('acceptDataFromOpenerPage', function(data) {
      self.type = data.type
      // 请求所点击的故事的详细信息
      self.Api.fetchChapterData({
        data: data.data.id,
        usertoken: self.token
      }).then(res => {
        self._checkData(res).then(res => {
          let curr = res.data[0]
          self.webViewSrc = self.webViewSrc + '?id=' + curr.resource.id + '&token=' + self.token + ''
          self.resource = curr
          if (data.type === 'listen') {
            console.log('==> 听金币')
            self.swiperList = curr.slides
            self.timeArray = curr.slides.map(x => x.showIn)
            self.currentTrack = curr.resource
            self.bgm.title = curr.resource.title
            self.bgm.epname = curr.resource.title
            self.bgm.singer = curr.resource.title
            self.bgm.coverImgUrl = ''
            
            // 设置了 src 之后会自动播放
            self.bgm.src = curr.resource.audioFile
            self.pause()
            // 加载中事件
            self.bgm.onWaiting(() => {
              console.log('等待播放中', self.bgm.duration)
            })
            // 播放事件
            self.bgm.onPlay(() => {
              console.log('==> on play')
            })
            // 可以播放状态事件
            self.bgm.onCanplay(() => {
              console.log('可以播放了', self.bgm)
              self.isCanPlay = true
              if (!self.isTimerPlaying) {
                self.bgm.pause()
              }
              setTimeout(() => {
                self.generateTime()
              }, 1000)
            })
          }
        })
      })
      
    })
  },
  methods: {
    switchTab: function (prompt, res) {
      console.log(prompt)
      let oIndex = res.mp.currentTarget.dataset.current
      this.cardCur = oIndex
    },
    playAudio() {
      console.log('==> 音乐对象：', this.bgm)
      // this.bgm.title = this.currentTrack.title
      // this.bgm.epname = this.currentTrack.title
      // this.bgm.singer = this.currentTrack.title
      // this.bgm.coverImgUrl = ''
      if (this.bgm.src === '') {
        this.bgm.src = this.currentTrack.audioFile
      } else {
        this.bgm.play()
      }
      this.isTimerPlaying = true
      // this.bgm.play()
      this.bgm.onTimeUpdate(() => {
        this.generateTime()
      })
      this.bgm.onEnded(() => {
        this.isTimerPlaying = false
      })
    },
    pause() {
      if (this.bgm.pause) this.bgm.pause()
      this.isTimerPlaying = false
    },
    stop() {
      if (this.bgm.stop) this.bgm.stop()
      this.isTimerPlaying = false
      this.resetPlayer()
    },
    generateTime() {
      let width = (100 / this.bgm.duration) * this.bgm.currentTime
      this.barWidth = width + "%"
      this.circleLeft = width + "%"
      let durmin = Math.floor(this.bgm.duration / 60)
      let dursec = Math.floor(this.bgm.duration - durmin * 60)
      let curmin = Math.floor(this.bgm.currentTime / 60)
      let cursec = Math.floor(this.bgm.currentTime - curmin * 60)
      // console.log(this.bgm.currentTime)
      this.lookupindex(this.bgm.currentTime)
      if (durmin < 10) {
        durmin = "0" + durmin
      }
      if (dursec < 10) {
        dursec = "0" + dursec
      }
      if (curmin < 10) {
        curmin = "0" + curmin
      }
      if (cursec < 10) {
        cursec = "0" + cursec
      }
      this.duration = durmin + ":" + dursec
      this.currentTime = curmin + ":" + cursec
    },
    updateBar(x, rect) {
      let maxduration = this.bgm.duration
      let position = x - rect.left
      let percentage = (100 * position) / rect.width
      if (percentage > 100) {
        percentage = 100
      }
      if (percentage < 0) {
        percentage = 0
      }
      this.barWidth = percentage + "%"
      this.circleLeft = percentage + "%"
      this.currentTime = (maxduration * percentage) / 100
      console.log('==> 当前音频时间：', this.currentTime)
      
      this.bgm.seek(this.currentTime)
      this.bgm.play()
    },
    clickProgress(e) {
      if (!this.isTimerPlaying) {
        return
      }
      let dom = wx.createSelectorQuery().select('.progress__bar')
      let self = this
      dom.boundingClientRect(function(rect) {
        self.updateBar(e.pageX, rect)
      }).exec()
    },
    lookupindex(currentTime) {
      // 找到对应轮播图的索引
      let prev
      let next
      let max = this.timeArray.length - 1
      try {
        this.timeArray.forEach((item, index) => {
          prev = this.timeArray[index - 1] ? this.timeArray[index - 1] : 0
          next = this.timeArray[index + 1] ? this.timeArray[index + 1] : max
          if (currentTime > prev && currentTime < next) {
            this.correctCurr = index
            this.jumpToCurrPic()
            throw new Error('break')
          }
        })
      } catch (error) {
        console.log(error)
      }
    },
    // 跳转轮播图
    jumpToCurrPic() {
      console.log('==> 要跳转的图片的索引：', this.correctCurr)
      this.cardCur = this.correctCurr
    },
    swiperChange(e) {
      clearTimeout(this.rollbacktimer)
      console.log('==> 第' + e.mp.detail.current + '张轮播图发生了滑动')
    },
    animationfinish(e) {
      console.log('==> 第' + e.mp.detail.current + '张轮播图滑动结束')
      this.cardCur = e.mp.detail.current
      this.rollbacktimer = setTimeout(() => {
        this.jumpToCurrPic()
      }, 2000)
    },
    prevTrack() {
      
    },
    nextTrack() {
      
    },
    resetPlayer() {
      this.barWidth = 0
      this.circleLeft = 0
      this.bgm.currentTime = 0
      this.currentTime = '00:00'
    },
    favorite() {
      this.tracks[this.currentTrackIndex].favorited = !this.tracks[
        this.currentTrackIndex
      ].favorited
    }
  },
  components: {
    progress
  },
  computed: {
    ...mapState({
      token: state => state.common.token
    })
  },
  onHide() {
    if (this.bgm) this.bgm.stop()
  },
  onUnload() {
    if (this.bgm) this.bgm.stop()
  }
}
</script>

<style lang="css">
</style>