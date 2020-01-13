<template>
  <div class="listen-index">
    <!-- 金币奖励框 -->
    <div class="coins">
      <img :src="gold_coin" alt="">
      <label>{{ score }}</label>
    </div>
    <view class="padding content-wrap">
      <!-- 听金币 -->
      <div class="wrapper">
        <div class="player">
          <div class="swiper-wrap">
            <swiper 
              :current="cardCur"
              :indicator-dots="indicatorDots"
              indicator-active-color="#2b90ff"
              indicator-color="#e1e1e1"
              :autoplay="autoplay" 
              @change="swiperChange" 
              @animationfinish="animationfinish" 
              class="listen-swiper"
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
              <!-- <text class="listen-text" @click="stop">停止播放</text> -->
              <button class="cu-btn lines-blue round shadow" @click="stop">停止播放</button>
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
import 'assets/styles/content.styl'
import 'assets/styles/audioPlayer.css'
// import 'nouislider/distribute/nouislider.css'
import gold_coin from 'assets/images/icon-gold_coin.png'
// import noUiSlider from 'nouislider'
import progress from 'coms/process.vue'
import { mapState } from 'vuex'
export default {
  data() {
    return {
      gold_coin,
      bgm: null,
      circleLeft: null,
      barWidth: null,
      currentTime: 0,
      isTimerPlaying: false,
      tracks: [],
      background: ['demo-text-1', 'demo-text-2', 'demo-text-3'],
      currentTrack: {},
      currentTrackIndex: 0,
      transitionName: null,
      dotStyle: false,
      // score: 0,
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
      duration: 0,
      circular: false,
      rollbacktimer: null,
      // 开始播放时间
      startTime: 0,
      // 停止播放时间
      endTime: 0,
      // 持续总时间
      processTime: 0,
      processTimer: null,
      action: ''
    }
  },
  onLoad() {
    let self = this
    wx.showLoading({
      title: '获取数据中'
    })
    self.bgm = wx.getBackgroundAudioManager()
    const eventChannel = this.$mp.page.getOpenerEventChannel()
    // 监听acceptDataFromOpenerPage事件，获取上一页面通过eventChannel传送到当前页面的数据
    eventChannel.on('acceptDataFromOpenerPage', function(data) {
      // 请求所点击的故事的详细信息
      self.Api.fetchChapterData({
        data: data.data.id,
        usertoken: self.token
      }).then(res => {
        self._checkData(res).then(res => {
          let curr = res.data[0]
          self.webViewSrc = self.webViewSrc + '?id=' + curr.resource.id + '&token=' + self.token + ''
          self.resource = curr
          console.log('==> 听金币')
          self.swiperList = curr.slides
          self.timeArray = curr.slides.map(x => x.showIn)
          self.currentTrack = curr.resource
          self.bgm.title = curr.resource.title
          self.bgm.epname = curr.resource.title
          self.bgm.singer = curr.resource.title
          self.bgm.coverImgUrl = ''
          console.log(curr.resource.audioFile)
          // 设置了 src 之后会自动播放
          self.bgm.src = curr.resource.audioFile
          self.pause()
          wx.hideLoading()
          // 加载中事件
          self.bgm.onWaiting(() => {
            console.log('等待播放中', self.bgm.duration)
          })
          // 播放事件
          self.bgm.onPlay(() => {
            console.log('==> Player play')
            // 在seek的时候不会重新计算开始时间
            if (self.action !== 'seek') {
              self.startTime = new Date().getTime()
            }
          })
          // 暂停事件
          self.bgm.onPause(() => {
            console.log('==> Player pause')
            self.getProcessTime(self.startTime, 'pause')
          })
          // 进度跳转事件
          self.bgm.onSeeked(() => {
            console.log('==> Player seeked')
            self.getProcessTime(self.startTime, 'seeked')
          })
          // 停止事件
          self.bgm.onStop(() => {
            console.log('==> Player stop')
            // 如果音频还在播放，则计时并提交数据
            if (self.isTimerPlaying) {
              self.getProcessTime(self.startTime, 'stop')
            }
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
          // 播放错误事件
          self.bgm.onError(() => {
            console.log('==> Error')
            wx.showToast({
              title: '音频加载失败',
              icon: 'none',
              duration: 2000
            })
          })
        }).catch(err => {
          wx.hideLoading()
          wx.showToast({
            title: err.msg,
            icon: 'none',
            duration: 2000
          })
        })
      }).catch(() => {
        wx.hideLoading()
        wx.showToast({
          title: '服务器错误',
          icon: 'none',
          duration: 2000
        })
      })
    })
  },
  methods: {
    switchTab: function (prompt, res) {
      let oIndex = res.mp.currentTarget.dataset.current
      this.cardCur = oIndex
    },
    playAudio() {
      this.isTimerPlaying = true
      console.log('==> 音乐对象：', this.bgm)
      console.log('==> 当条音轨数据：', this.currentTrack)
      // this.bgm.title = this.currentTrack.title
      // this.bgm.epname = this.currentTrack.title
      // this.bgm.singer = this.currentTrack.title
      // this.bgm.coverImgUrl = ''
      if (this.bgm.src === '') {
        this.bgm.src = this.currentTrack.audioFile
        this.bgm.title = this.currentTrack.title
      } else {
        this.bgm.play()
      }
      // this.bgm.play()
      this.bgm.onTimeUpdate(() => {
        // console.log(this.bgm.currentTime)
        this.generateTime()
      })
      this.bgm.onEnded(() => {
        this.isTimerPlaying = false
        this.getProcessTime(this.startTime, 'end')
      })
    },
    pause() {
      if (this.bgm.pause) this.bgm.pause()
      // this.isTimerPlaying = false
    },
    stop() {
      if (this.bgm.stop) this.bgm.stop()
      // this.isTimerPlaying = false
      this.resetPlayer()
    },
    // 时间同步格式化
    generateTime() {
      let width = (100 / this.bgm.duration) * this.bgm.currentTime
      this.barWidth = width + "%"
      this.circleLeft = width + "%"
      let durmin = Math.floor(this.bgm.duration / 60) || 0
      let dursec = Math.floor(this.bgm.duration - durmin * 60) || 0
      let curmin = Math.floor(this.bgm.currentTime / 60) || 0
      let cursec = Math.floor(this.bgm.currentTime - curmin * 60) || 0
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
    // 跳转进度条
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
    // 更新进度条操作
    updateBar(x, rect) {
      this.action = 'seek'
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
      // this.bgm.play()
      // 设置跳转
      // wx.seekBackgroundAudio({
      //   position: Math.floor(this.currentTime),
      //   success: () => {
      //     console.log('seek success')
      //     this.bgm.pause()
      //   },
      //   fail: () => {
      //     wx.showToast({
      //       title: '跳转失败',
      //       icon: 'none',
      //       duration: 2000
      //     })
      //     this.bgm.pause()
      //   }
      // })
    },
    // 查找要跳转的轮播图的索引
    lookupindex(currentTime) {
      // 找到对应轮播图的索引
      let prev
      let next
      this.timeArray = this.timeArray.sort((a, b) => a - b)
      // console.log(this.timeArray)
      let max = this.timeArray.length - 1
      for (let index = 0; index < this.timeArray.length; index++) {
        prev = this.timeArray[index - 1] ? this.timeArray[index - 1] : 0
        next = this.timeArray[index + 1] ? this.timeArray[index + 1] : max
        if (currentTime > prev && currentTime < next) {
          this.correctCurr = index
          this.jumpToCurrPic()
          return false
        }
      }
    },
    // 跳转轮播图
    jumpToCurrPic() {
      // console.log('==> 要跳转的图片的索引：', this.correctCurr)
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
      }, 3000)
    },
    prevTrack() {
      
    },
    nextTrack() {
      
    },
    // clearTimer() {
    //   clearInterval(this.processTimer)
    //   console.log('==> 当前听力时长：', this.processTime)
    // },
    // 获取播放和停止的间隔时间
    getProcessTime(startTime, ename) {
      this.endTime = new Date().getTime()
      this.processTime += this.endTime - startTime
      console.log('==> 触发的事件：', ename)
      console.log('==> 此次提交听力时长：', this.processTime)
      // 重置seek逻辑
      this.action = ''
      // 传值后台保存听力时长
      if (this.processTime) {
        this.Api.saveUserReadTime({
          data: {
            time: this.processTime
          },
          usertoken: this.token
        }).then(res => {
          this._checkData(res).then(res => {
            console.log('==> 听力总时长：', res.data.readTimeInMinutes + '分钟')
            // 每次提交完毕都将累计听力时长置为0，因为停止的时候已经提交了当前段的听力时长数据
            // TODO - 提交失败情况下，processTime的处理
            // 是清0，还是继续累计？（算长了或者算短了的问题）
            this.processTime = 0
          }).catch((err) => {
            wx.showToast({
              title: err.msg,
              icon: 'none',
              duration: 2000
            })
          })
        }).catch(() => {
          wx.showToast({
            title: '服务器错误',
            icon: 'none',
            duration: 2000
          })
        })
      }
      this.isTimerPlaying = false
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
      token: state => state.common.token,
      score: state => state.common.score
    })
  },
  onHide() {
    // if (this.bgm) this.bgm.stop()
  },
  onUnload() {
    // 如果还在播放，就
    // if (this.isTimerPlaying) {
    //   this.getProcessTime(this.startTime, 'unload')
    // }
    if (this.bgm) this.bgm.stop()
    this.correctCurr = 0
    this.cardCur = 0
    this.currentTrackIndex = 0
    this.duration = 0
    this.currentTime = 0
    this.processTime = 0
  }
}
</script>

<style lang="css">
</style>