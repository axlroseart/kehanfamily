let actions = {
  handler: () => {},
  fetchLoginStatus({ commit }, data) {
    commit('IS_LOGIN', data)
  },
  setToken({ commit }, data) {
    commit('USER_TOKEN', data)
  },
  fetchUserStore({ commit }, data) {
    commit('USER_SCORE', data)
  },
  saveUserInfo({ commit }, data) {
    commit('USER_INFO', data)
  }
}

export default {
  ...actions
}
