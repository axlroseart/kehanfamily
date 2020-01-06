const mutations = {
  IS_LOGIN(state, data) {
    state.isLogin = data
  },
  USER_TOKEN(state, data) {
    state.token = data
  }
}

export default mutations
