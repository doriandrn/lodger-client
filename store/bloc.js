export const state = () => ({
  ultimul: ''
})

export const mutations = {
  ADAUGA_BLOC: (state, data) => {/*db*/},
  STERGE_BLOC: (state, id) => {},
  set_ultimul_adaugat: (state, id) => {
    state.ultimul = id
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
