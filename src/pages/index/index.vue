<template>
  <div class="home-index">
    <!-- <view class="cu-bar search bg-white">
      <view class="search-form round">
        <text class="cuIcon-search"></text>
        <input @focus="InputFocus" @blur="InputBlur" :adjust-position="false" type="text" placeholder="搜索图片、文章、视频" confirm-type="search">
      </view>
      <view class="action">
        <text class="cuIcon-close"></text>
        <text>取消</text>
      </view>
    </view> -->
    <!-- 轮播图 -->
    <swiper class="card-swiper" :class="dotStyle?'square-dot':'round-dot'" :indicator-dots="true" :circular="true"
    :autoplay="false" interval="5000" duration="500" @change="cardSwiper" indicator-color="#8799a3"
    indicator-active-color="#fff">
      <swiper-item v-for="(item,index) in swiperList" :key="index" :class="cardCur==index?'cur':''">
        <view class="swiper-item">
          <image :src="item.url" mode="aspectFill" v-if="item.type=='image'"></image>
          <video :src="item.url" autoplay loop muted :show-play-btn="false" :controls="false" objectFit="cover" v-if="item.type=='video'"></video>
        </view>
      </swiper-item>
    </swiper>
    <!-- 主体内容部分 -->
    <view class="block">
      <!-- tab 标签页 -->
      <div class="index-grade-tab">
        <!-- cu-ui-tab -->
        <scroll-view scroll-x class="bg-blue nav text-center">
          <view 
            v-for="(item, index) in tabs" :key="index"
            class="cu-item" 
            :class="index == TabCur ? 'text-white cur' : ''" 
            @tap="((e) => { tabSelect(e, item.id) })" 
            :data-id="index">
            <text class="cuIcon-read"></text> 
            {{ item.name }}
          </view>
        </scroll-view>
        <!-- <div class="weui-tab__content" :hidden="TabCur != '0'"> -->
        <div class="weui-tab__content" v-for="(item, index) in currLevelBooks" :key="index">
          <!-- 每条故事信息 -->
          <!-- <div class="story-list" @click="actionTypeChoose"> -->
          <div class="story-list">
            <!-- <p class="info">
              <label>{{ item.summary }}</label>
            </p> -->
            <div class="list-main">
              <img :src="item.cover" alt="">
              <div class="title-info">
                <p class="story-title"><span>{{ item.title }}</span></p>
                <p>核心词汇：<span>{{ item.newWords }}</span>个</p>
              </div>
            </div>
            <div class="buttons">
              <button class="cu-btn cuIcon bg-red shadow" @click="goStory('listen', item.id)">
                <text class="cuIcon-musicfill"></text>
              </button>
              <button class="cu-btn cuIcon bg-blue shadow" @click="goStory('click', item.id)">
                <text class="cuIcon-read"></text>
              </button>
              <!-- <button @click="goStory('listen', item.id)">听金币</button>
              <button @click="goStory('click', item.id)">点金币</button> -->
            </div>
          <!-- </div> -->
          </div>
        </div>
      </div>
    </view>
    <!-- 操作弹窗 -->
    <view class="cu-modal story-choose-dialog" :class="showChooseList ? 'show' : ''" @tap="showChooseList = !showChooseList">
			<view class="cu-dialog" @tap.stop="">
        <p class="dialog-title">{{ chooseType === 'listen' ? '听金币' : '点金币' }}</p>
				<view class="cu-list menu sm-border">
          <view class="cu-item arrow" v-for="(item, index) in itemList" :key="index" @click="storyHandler(index)">
            <view class="content">
              <!-- <text class="cuIcon-circlefill text-grey"></text> -->
              <text class="text-black">{{ item.title }}</text>
            </view>
          </view>
        </view>
			</view>
		</view>
  </div>
</template>

<script>
import '../../assets/styles/index'
import iconDemo from '../../assets/images/icon-child.png'
import banner1 from '../../../static/images/banner1.jpg'
import { mapState } from 'vuex'
export default {
  data() {
    return {
      circular: true,
      tabs: [],
      activeIndex: 0,
      fontSize: 24,
      iconDemo,
      banner1,
      TabCur: 0,
      scrollLeft: 0,
      cardCur: 0,
      swiperList: [{
        id: 0,
        type: 'image',
        url: banner1
      }],
      dotStyle: false,
      towerStart: 0,
      direction: '',
      itemList: ['听金币', '点金币'],
      isShowActionDialog: false,
      currLevelBooks: [],
      test_account: 'test',
      test_password: '123456',
      isGotData: false,
      showChooseList: false,
      // 操作类型
      chooseType: '',
      // 章节ID
      currChapterId: 0,
      // 章节课程数据
      currChapterInfo: []
    }
  },
  onShow() {
    let self = this
    // this.TabCur = 0
    console.log('==> 是否已经获取过数据：', this.isGotData)
    if (!this.isGotData) {
      // 获取首页故事列表数据
      self.getBaseData()
    }
    // 从本地拿token
    wx.getStorage({
      key: 'token',
      success(response) {
        let token = response.data
        // 获取成功，查询用户信息
        self.Api.fetchUserData({
          usertoken: token
        }).then(res => {
          self._checkData(res).then(res => {
            res = res.data
            self.$store.dispatch('fetchUserStore', res.score)
            self.$store.dispatch('fetchLoginStatus', true)
            self.$store.dispatch('saveUserInfo', res)
            self.$store.dispatch('setToken', token).then(() => {
              // 获取首页故事列表数据
              // self.getBaseData()
            })
          }).catch(err => {
            // wx.showToast({
            //   title: err.msg,
            //   icon: 'none',
            //   duration: 2000
            // })
            console.log('==> 未登录：', err)
          })
        }).catch(() => {
          wx.showToast({
            title: '获取用户信息失败',
            icon: 'none',
            duration: 2000
          })
        })
      },
      fail() {
        // 未获取到token，跳转登录重新获取
        // wx.navigateTo({
        //   url: '/pages/user/main'
        // })
        // 未登录，暂时不做任何动作
      }
    })
  },
  onLoad(data) {
    console.log('==> webview传过来的数据：', data)
    // 保存由webview传过来的score
    this.$store.dispatch('fetchUserStore', data.score)
  },
  methods: {
    // 获取级别数据
    getBaseData() {
      wx.showLoading({
        title: '获取数据中'
      })
      this.Api.fetchLevelData({
        usertoken: this.token
      }).then(res => {
        wx.hideLoading()
        this._checkData(res).then(res => {
          this.tabs = res.data
          let defaultLevelId = res.data[0].id
          // 请求默认第一个级别的书籍数据
          this.fetchCurrLevelData(defaultLevelId)
        }).catch(err => {
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
    },
    // 打开故事交互类型选择
    actionTypeChoose() {
      let _this = this
      wx.showActionSheet({
        itemList: this.itemList,
        success: function(res) {
          const currType = _this.itemList[res.tapIndex]
          _this.goStory(currType)
        }
      })
      this.isShowActionDialog = true
    },
    closeDialog() {
      this.isShowActionDialog = false
    },
    // 故事内容页跳转
    goStory(type, id) {
      this.chooseType = type
      this.currChapterId = id
      wx.showLoading({
        title: '获取数据中'
      })
      // 获取所选章节下面的课程信息
      this.Api.fetchChapterData({
        data: id,
        usertoken: this.token
      }).then(res => {
        wx.hideLoading()
        this._checkData(res).then(res => {
          this.currChapterInfo = res.data
          this.itemList = []
          this.currChapterInfo.forEach(element => {
            this.itemList.push({
              title: element.resource.title,
              id: element.resource.id
            })
          })
          if (this.itemList.length === 1) {
            this.storyHandler(0)
            return
          }
          // 显示选择框
          this.showChooseList = true
        })
      })
    },
    storyHandler(index) {
      let self = this
      // 没登录先去登录
      if (!self.isLogin) {
        wx.navigateTo({
          url: '/pages/user/main'
        })
        return
      }
      wx.navigateTo({
        url: '/pages/content/' + self.chooseType + '/main?score=999',
        events: {
          // 为指定事件添加一个监听器，获取被打开页面传送到当前页面的数据
          acceptDataFromOpenedPage: function(data) {
            console.log(data)
          }
        },
        success: function(res) {
          // 通过eventChannel向被打开页面传送数据
          res.eventChannel.emit('acceptDataFromOpenerPage', {
            type: self.chooseType,
            data: {
              id: self.currChapterId,
              index: index
            },
            result: self.currChapterInfo[index]
          })
        }
      })
    },
    // cardSwiper
    cardSwiper(e) {
      // console.log(e)
      this.cardCur = e.target.current
    },
    // 资源级别切换标签控制事件
    tabClick(e) {
      this.activeIndex = Number(e.currentTarget.id)
    },
    tabSelect(e, id) {
      this.TabCur = e.currentTarget.dataset.id
      this.scrollLeft = (e.currentTarget.dataset.id - 1) * 60
      // 请求对应level的数据
      this.fetchCurrLevelData(id)
    },
    fetchCurrLevelData(id) {
      wx.showLoading({
        title: '获取数据中'
      })
      this.Api.fetchBookData({
        data: id,
        usertoken: this.token
      }).then(res => {
        wx.hideLoading()
        this._checkData(res).then(res => {
          this.isGotData = true
          this.currLevelBooks = res.data
        })
      }).catch((err) => {
        wx.hideLoading()
        wx.showToast({
          title: err.msg,
          icon: 'none',
          duration: 2000
        })
      })
    },
    swiperChange(e) {
    },
    animationfinish(e) {
    }
  },
  computed: {
    ...mapState({
      token: state => state.common.token,
      isLogin: state => state.common.isLogin
    }),
    navbarSliderClass() {
      if (this.activeIndex === 0) {
        return 'weui-navbar__slider_0'
      }
      if (this.activeIndex === 1) {
        return 'weui-navbar__slider_1'
      }
      if (this.activeIndex === 2) {
        return 'weui-navbar__slider_2'
      }
    }
  }
}
</script>

<style scoped>
/* .slide-image {
  width: 100%;
  height: 100%;
} */
.weui-demo-dialog {
  visibility: hidden;
  opacity: 0;
  transition: opacity 0.3s;
}
.weui-demo-dialog_show {
  visibility: visible;
  opacity: 1;
}
</style>
