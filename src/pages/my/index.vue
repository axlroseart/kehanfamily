<template>
  <div class="my-index">
    <!-- <view class="cu-bar bg-white solid-bottom margin-top">
      <view class="action">
        <text class="cuIcon-title text-orange"></text> 我的
      </view>
    </view>
    <view class="cu-card case no-card">
			<view class="cu-item shadow">
				<view class="cu-list menu-avatar">
					<view class="cu-item">
						<view class="cu-avatar round lg" style="background-image:url(https://ossweb-img.qq.com/images/lol/web201310/skin/big10006.jpg)"></view>
						<view class="content flex-sub">
							<view class="text-grey">{{ userInfo.name }}</view>
							<view class="text-gray text-sm flex justify-between">
								<view class="text-gray text-sm">
									<text class="cuIcon-voice margin-lr-xs">听力时长</text> {{ userInfo.readTimes }} 分钟
									<text class="cuIcon-coin margin-lr-xs">金币</text> {{ userInfo.score }}
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view> -->
    <!-- <view class="cu-bar bg-white solid-bottom">
			<view class="action">
				<text class="cuIcon-titles text-orange"></text> 我的
			</view>
			<view class="action">
				<switch :class="isCard?'checked':''" :checked="isCard?true:false" @change="IsCard"></switch>
			</view>
		</view> -->
    <view class="cu-card case no-card">
      <view class="cu-item shadow">
        <view class="image">
          <image :src="promoImg" mode="widthFix"></image>
          <!-- <view class="cu-tag bg-blue">史诗</view> -->
          <view class="cu-bar bg-shadeBottom">
            <text class="text-cut"></text
          ></view>
        </view>
        <view class="cu-list menu-avatar">
          <view class="cu-item">
            <view
              class="cu-avatar round lg"
              style="background-image:url(http://134.175.157.41/avatar.png)"
            ></view>
            <view class="content flex-sub">
              <view class="text-grey">{{ userInfo.name }}</view>
              <view class="text-gray text-sm flex justify-between">
                -
                <view class="text-gray text-sm">
                  <text class="cuIcon-time margin-lr-xs">听力时长</text>
                  <text class="text-blue">{{ showTimes }}</text>
                  <text class="cuIcon-coin margin-lr-xs">金币</text>
                  <text class="text-blue">{{ userInfo.score }}</text>
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>
    <!-- 九宫格 -->
    <!-- <view class="cu-bar bg-white solid-bottom margin-top">
      <view class="action">
        <text class="cuIcon-title text-orange"></text> 学习
      </view>
    </view>
    <view class="cu-list grid" :class="['col-' + gridCol,gridBorder?'':'no-border']">
      <view class="cu-item" v-for="(item,index) in cuIconList" :key="index" v-show="index < (gridCol * 2)">
        <view :class="['cuIcon-' + item.cuIcon,'text-' + item.color]">
          <view class="cu-tag badge" v-if="item.badge!=0">
            <block v-if="item.badge!=1">{{item.badge>99?'99+':item.badge}}</block>
          </view>
        </view>
        <text>{{item.name}}</text>
      </view>
    </view> -->
    <!-- 功能列表 -->
    <view class="cu-bar bg-white solid-bottom margin-top">
      <view class="action">
        <text class="cuIcon-title text-orange"></text> 其他
      </view>
    </view>
    <view
      class="cu-list menu"
      :class="[
        menuBorder ? 'sm-border' : '',
        menuCard ? 'card-menu margin-top' : ''
      ]"
    >
      <view
        class="cu-item"
        :class="menuArrow ? 'arrow' : ''"
        @click="goAboutPage"
      >
        <view class="content">
          <text class="cuIcon-friend text-green"></text>
          <text class="text-grey">关于我们</text>
        </view>
        <view class="action">
          <text class="text-grey text-sm">可汗家</text>
        </view>
      </view>
    </view>
  </div>
</template>

<script>
/* eslint-disable */
import { mapState } from "vuex"
import promoImg from "assets/images/promo.png"
export default {
  data() {
    return {
      promoImg,
      gridCol: 3,
      gridBorder: false,
      menuBorder: false,
      menuArrow: false,
      menuCard: false,
      cuIconList: [
        {
          cuIcon: "picfill",
          color: "yellow",
          badge: 0,
          name: "图像"
        },
        {
          cuIcon: "noticefill",
          color: "olive",
          badge: 22,
          name: "通知"
        },
        {
          cuIcon: "upstagefill",
          color: "cyan",
          badge: 0,
          name: "排行榜"
        },
        {
          cuIcon: "discoverfill",
          color: "purple",
          badge: 0,
          name: "发现"
        },
        {
          cuIcon: "questionfill",
          color: "mauve",
          badge: 0,
          name: "帮助"
        },
        {
          cuIcon: "commandfill",
          color: "purple",
          badge: 0,
          name: "问答"
        }
      ],
      showTimes: 0
    }
  },
  onShow() {
    this.Api.fetchUserData({
      usertoken: this.token
    })
      .then(res => {
        this._checkData(res)
          .then(res => {
            res = res.data
            this.$store.dispatch("fetchUserStore", res.score)
            this.$store.dispatch("saveUserInfo", res)
          })
          .catch(err => {
            if (err.code === 1000) {
              wx.navigateTo({
                url: "/pages/user/main"
              })
            } else {
              wx.showToast({
                title: err.msg,
                icon: "none",
                duration: 2000
              })
            }
          })
      })
      .catch(() => {
        wx.showToast({
          title: "获取用户信息失败",
          icon: "none",
          duration: 2000
        })
      })
  },
  mounted() {
    this.showTimes = this.capitalize(this.userInfo.readTimeInMinutes)
  },
  methods: {
    goAboutPage() {
      wx.navigateTo({
        url: "/pages/my/about/main"
      })
    },
    capitalize(my_time) {
      var days = my_time / 1000 / 60 / 60 / 24
      var daysRound = Math.floor(days)
      var hours = my_time / 1000 / 60 / 60 - 24 * daysRound
      var hoursRound = Math.floor(hours)
      var minutes = my_time / 1000 / 60 - 24 * 60 * daysRound - 60 * hoursRound
      var minutesRound = Math.floor(minutes)
      var seconds =
        my_time / 1000 -
        24 * 60 * 60 * daysRound -
        60 * 60 * hoursRound -
        60 * minutesRound
      // console.log(
      //   "转换时间:",
      //   daysRound + "天",
      //   hoursRound + "时",
      //   minutesRound + "分",
      //   seconds + "秒"
      // )
      // var time = daysRound * 24 * 60 + hoursRound * 60 + minutesRound + '分' + seconds.toFixed(0) + '秒'
      var totalTime = daysRound * 24 * 60 + hoursRound * 60 + minutesRound
      var time
      if (totalTime === 0) {
        time = seconds.toFixed(0) + '秒'
      } else {
        time = daysRound * 24 * 60 + hoursRound * 60 + minutesRound + '分钟'
      }
      return time
    }
  },
  computed: {
    ...mapState({
      token: state => state.common.token,
      isLogin: state => state.common.isLogin,
      userInfo: state => state.common.userInfo,
      score: state => state.common.score
    })
  }
}
</script>

<style lang="css"></style>
