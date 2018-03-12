export const state = () => ({
  ultimul: ''
})

export const mutations = {
  ADAUGA_BLOC: (state, data) => {
    state.ultimul = data
  },
  STERGE_BLOC: (state, id) => {
    console.log('stergeblocid', id)
  }
}

export const actions = {
  adauga: ({ commit }, blocData) => {
    commit('ADAUGA_BLOC', blocData)
  },
  sterge: ({ commit }, blocId) => {
    commit('STERGE_BLOC', blocId)
  }
}

export const getters = {
  data: (state, getters, rootGetters) => id => rootGetters.blocuri.filter(bloc => bloc._id === id)[0] || {},
  ids: (state, getters, rootGetters) => rootGetters.blocuri.map(bloc => bloc._id)
}
