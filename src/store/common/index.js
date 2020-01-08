import getters from './getters'

const state = {
  isLogin: false,
  token: '',
  score: 0,
  userInfo: 0
}

export default {
  state,
  actions: require('./actions').default,
  getters,
  mutations: require('./mutations').default
}
