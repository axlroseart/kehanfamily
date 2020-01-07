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
  }
}

export default mutations
