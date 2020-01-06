let actions = {
  handler: () => {},
  fetchLoginStatus({ commit }, data) {
    commit('IS_LOGIN', data)
  },
  setToken({ commit }, data) {
    commit('USER_TOKEN', data)
  }
}

export default {
  ...actions
}
