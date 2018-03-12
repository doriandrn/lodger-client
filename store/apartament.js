export const state = () => ({
  ultimul: ''
})

export const mutations = {
  ADAUGA_APARTAMENT: (state, data) => {
    state.ultimul = data
  },
  STERGE_APARTAMENT: (state, id) => {
    console.log('stergeApId', id)
  }
}

export const actions = {
  adauga: ({ commit }, apData) => {
    commit('ADAUGA_APARTAMENT', apData)
  },
  sterge: ({ commit }, blocId) => {
    commit('STERGE_APARTAMENT', blocId)
  }
}

export const getters = {
  data: (state, getters, rootGetters) => id => rootGetters.apartamente.filter(ap => ap._id === id)[0] || {}
}
