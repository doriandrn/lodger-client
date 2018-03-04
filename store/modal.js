export const state = () => ({
  open: false,
  content: null
})

export const getters = {
  open: state => state.open,
  content: state => state.content
}

export const mutations = {
  OPEN: (state, content) => {
    state.content = content
    state.open = true
  },
  CLOSE: (state) => {
    state.open = false
    state.content = null
  }
}

export const actions = {
  open: ({ commit }, content) => {
    commit('OPEN', content)
  },
  close: ({ commit, dispatch }) => {
    commit('CLOSE')
    dispatch('prompt/cancel', null, { root: true })
  }
}
