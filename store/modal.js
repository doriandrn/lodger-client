export const state = () => ({
  open: false,
  content: null,
  data: null
})

export const getters = {
  open: state => state.open,
  content: state => state.content,
  data: state => state.data
}

export const mutations = {
  OPEN: (state, content) => {
    state.content = content
    state.open = true
  },
  DATA: (state, data) => {
    state.data = data
  },
  CLOSE: (state) => {
    state.open = false
    state.content = null
    state.data = null
  }
}

export const actions = {
  open: ({ commit }, content) => {
    console.log('typeof content', typeof content)
    if (typeof content === 'string') commit('OPEN', content)
    if (typeof content === 'object') {
      commit('OPEN', content.id)
      commit('DATA', content.data)
    }
  },
  close: ({ commit, dispatch }) => {
    commit('CLOSE')
    dispatch('prompt/cancel', null, { root: true })
  }
}
