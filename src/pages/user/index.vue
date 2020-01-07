<template>
  <div class="user-index">
    <i class="logo"></i>
    <form action="">
      <view class="cu-form-group margin-top">
				<view class="title">用户名</view>
				<input type="text" placeholder="输入用户名" name="username" v-model="username" />
			</view>
			<view class="cu-form-group">
				<view class="title">密码</view>
				<input type="password" placeholder="输入密码" name="password" v-model="password" />
			</view>
    </form>
    <view class="padding-xl">
			<button class="cu-btn block bg-blue margin-tb-sm lg" :loading="loading" @click="doLogin"> 登录</button>
		</view>
  </div>
</template>

<script>
import 'assets/styles/user.css'
export default {
  data() {
    return {
      loading: false,
      username: '',
      password: ''
    }
  },
  mounted() {
  },
  methods: {
    doLogin() {
      // show loading
      wx.showLoading({
        title: '登录中'
      })
      // 登录
      this.Api.userLogin({
        data: {
          account: this.username,
          password: this.password
        }
      }).then(res => {
        wx.hideLoading()
        this._checkData(res).then(res => {
          res = res.data
          this.$store.dispatch('setToken', res.token)
          this.$store.dispatch('fetchLoginStatus', true)
          // console.log(this.username, this.password)
          // wx.navigateTo({
          //   url: '/pages/index/main'
          // })
          this.$store.dispatch('fetchUserStore', res.score)
          wx.navigateBack({
            delta: 1
          })
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
    }
  }
}
</script>

<style lang="stylus">
  
</style>