<template>
  <div class="my-index">
    <view class="cu-card case no-card">
			<view class="cu-item shadow">
				<view class="cu-list menu-avatar">
					<view class="cu-item">
						<view class="cu-avatar round lg" style="background-image:url(https://ossweb-img.qq.com/images/lol/web201310/skin/big10006.jpg);"></view>
						<view class="content flex-sub">
							<view class="text-grey">正义天使 凯尔</view>
							<view class="text-gray text-sm flex justify-between">
								十天前
								<view class="text-gray text-sm">
									<text class="cuIcon-attentionfill margin-lr-xs"></text> 10
									<text class="cuIcon-appreciatefill margin-lr-xs"></text> 20
									<text class="cuIcon-messagefill margin-lr-xs"></text> 30
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
    <!-- 九宫格 -->
    <view class="cu-bar bg-white solid-bottom margin-top">
      <view class="action">
        <text class="cuIcon-title text-orange"></text> 主要功能
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
    </view>
    <!-- 功能列表 -->
    <view class="cu-bar bg-white solid-bottom margin-top">
      <view class="action">
        <text class="cuIcon-title text-orange"></text> 其他功能
      </view>
    </view>
    <view class="cu-list menu" :class="[menuBorder?'sm-border':'',menuCard?'card-menu margin-top':'']">
      <view class="cu-item" :class="menuArrow?'arrow':''">
        <view class="content">
          <text class="cuIcon-emojiflashfill text-pink"></text>
          <text class="text-grey">头像组</text>
        </view>
        <view class="action">
          <view class="cu-avatar-group">
            <view class="cu-avatar round sm" style="background-image:url(https://ossweb-img.qq.com/images/lol/web201310/skin/big10001.jpg);"></view>
            <view class="cu-avatar round sm" style="background-image:url(https://ossweb-img.qq.com/images/lol/web201310/skin/big81005.jpg);"></view>
            <view class="cu-avatar round sm" style="background-image:url(https://ossweb-img.qq.com/images/lol/web201310/skin/big25002.jpg);"></view>
            <view class="cu-avatar round sm" style="background-image:url(https://ossweb-img.qq.com/images/lol/web201310/skin/big91012.jpg);"></view>
          </view>
          <text class="text-grey text-sm">4 人</text>
        </view>
      </view>
      <view class="cu-item" :class="menuArrow?'arrow':''">
        <view class="content">
          <text class="cuIcon-btn text-green"></text>
          <text class="text-grey">按钮</text>
        </view>
        <view class="action">
          <button class="cu-btn round bg-green shadow">
            <text class="cuIcon-upload"></text> 上传</button>
        </view>
      </view>
      <view class="cu-item" :class="menuArrow?'arrow':''">
        <view class="content">
          <text class="cuIcon-tagfill text-red  margin-right-xs"></text>
          <text class="text-grey">标签</text>
        </view>
        <view class="action">
          <view class="cu-tag round bg-orange light">音乐</view>
          <view class="cu-tag round bg-olive light">电影</view>
          <view class="cu-tag round bg-blue light">旅行</view>
        </view>
      </view>
      <view class="cu-item" :class="menuArrow?'arrow':''">
        <view class="content">
          <text class="cuIcon-warn text-green"></text>
          <text class="text-grey">文本</text>
        </view>
        <view class="action">
          <text class="text-grey text-sm">小目标还没有实现！</text>
        </view>
      </view>
    </view>
  </div>
</template>

<script>
export default {
  data() {
    return {
      gridCol: 3,
      gridBorder: false,
      menuBorder: false,
      menuArrow: true,
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
  }
}
</script>

<style lang="css">
  
</style>