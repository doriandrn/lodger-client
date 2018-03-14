export const state = () => ({
  ultimul: ''
})

export const mutations = {
  ADAUGA_APARTAMENT: (state, data) => {},
  STERGE_APARTAMENT: (state, id) => {},
  set_ultimul_adaugat: (state, id) => {state.ultimul = id}
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
  data: (state, getters, rootGetters) => id => rootGetters.apartamente.filter(ap => ap._id === id)[0] || {},
  localizeaza: (state, getters, rootGetters) => {
    if (!rootGetters['apartamente']) return () => {}
    return ({ etaj, scara, bloc }) => {
      return rootGetters['apartamente'].filter(ap => ap.bloc === bloc && String(ap.scara) === String(scara) && ap.etaj === etaj).sort((a, b) => a.nr > b.nr)
    }
  },
  ultimulAdaugat: state => state.ultimul
}
