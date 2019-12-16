let actions = {
  handler: () => {},
  setToken({ commit }, data) {
    commit('USER_TOKEN', data)
  }
}

export default {
  ...actions
}
