const mutations = {
  IS_LOGIN(state, data) {
    state.isLogin = data
  },
  USER_TOKEN(state, data) {
    state.token = data
  },
  // 得分
  USER_SCORE(state, data) {
    state.score = data
  },
  USER_INFO(state, data) {
    state.userInfo = data
  }
}

export default mutations
