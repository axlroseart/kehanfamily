<template>
  <div class="my-index">
    <view class="cu-card case no-card">
			<view class="cu-item shadow">
				<view class="cu-list menu-avatar">
					<view class="cu-item">
						<view class="cu-avatar round lg" style="background-image:url(https://ossweb-img.qq.com/images/lol/web201310/skin/big10006.jpg);"></view>
						<view class="content flex-sub">
							<view class="text-grey">{{ userInfo.name }}</view>
							<view class="text-gray text-sm flex justify-between">
								<!-- 十天前 -->
								<view class="text-gray text-sm">
									<text class="cuIcon-voice margin-lr-xs">阅读时长</text> {{ userInfo.readTimes }} 分钟
									<text class="cuIcon-coin margin-lr-xs">金币</text> {{ userInfo.score }}
									<!-- <text class="cuIcon-messagefill margin-lr-xs"></text> 30 -->
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
    <view class="cu-list menu" :class="[menuBorder?'sm-border':'',menuCard?'card-menu margin-top':'']">
      <view class="cu-item" :class="menuArrow?'arrow':''" @click="goAboutPage">
        <view class="content">
          <text class="cuIcon-warn text-green"></text>
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
import { mapState } from 'vuex'
export default {
  data() {
    return {
      gridCol: 3,
      gridBorder: false,
      menuBorder: false,
      menuArrow: false,
      menuCard: false,
      cuIconList: [{
        cuIcon: 'picfill',
        color: 'yellow',
        badge: 0,
        name: '图像'
      }, {
        cuIcon: 'noticefill',
        color: 'olive',
        badge: 22,
        name: '通知'
      }, {
        cuIcon: 'upstagefill',
        color: 'cyan',
        badge: 0,
        name: '排行榜'
      }, {
        cuIcon: 'discoverfill',
        color: 'purple',
        badge: 0,
        name: '发现'
      }, {
        cuIcon: 'questionfill',
        color: 'mauve',
        badge: 0,
        name: '帮助'
      }, {
        cuIcon: 'commandfill',
        color: 'purple',
        badge: 0,
        name: '问答'
      }]
    }
  },
  created() {
  },
  methods: {
    goAboutPage() {
      wx.navigateTo({
        url: '/pages/my/about/main'
      })
    }
  },
  computed: {
    ...mapState({
      isLogin: state => state.common.isLogin,
      userInfo: state => state.common.userInfo,
      score: state => state.common.score
    })
  }
}
</script>

<style lang="css">
  
</style>