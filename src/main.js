import Vue from 'vue'
import App from './App'
import store from './store/index'
// import './assets/styles/weui.wxss'
import 'mpvue-weui/src/style/weui.css'
import './assets/styles/reset.css'
import Api from './api'
import * as utils from './utils/index'
import cuCustom from './colorui/components/cu-custom.vue'
Vue.component('cu-custom', cuCustom)

Vue.config.productionTip = false
App.mpType = 'app'
Vue.prototype.$store = store
Vue.prototype.Api = Api

// 注册全局方法
Vue.mixin({
  methods: {
    _formatSeconds: utils.formatSeconds,
    _checkData: utils.checkData
  }
})

// 小程序云开发初始化
if (!wx.cloud) {
  console.error('请使用 2.2.3 或以上的基础库以使用云能力')
} else {
  wx.cloud.init({
    // env 参数说明：
    //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
    //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
    //   如不填则使用默认环境（第一个创建的环境）
    env: 'panandjames-lvqhr',
    traceUser: true
  })
}

this.globalData = {}

const app = new Vue(App)
app.$mount()
