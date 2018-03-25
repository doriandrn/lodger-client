export const state = () => ({
  activa: '',
  moneda: 'ron',
  initializata: false
})

export const mutations = {
  SCHIMBA_ACTIVA: (state, data) => {
    state.activa = data.name
  },
  DEFINESTE_STRUCTURA: (state) => {
    state.initializata = 0
  },
  TOGGLE_SERVICIU: (state, id) => {},
  BACKUP: () => {},
  initBalanta: (state, data) => {},
  incaseaza: (state, data) => {}
}

export const actions = {
  schimba ({ commit, dispatch }, data) {
    if (!data) return
    commit('SCHIMBA_ACTIVA', data)
  },
  initBalanta ({ commit }, data) { commit('initBalanta', data) },
  definesteStructura ({ commit }) {
    commit('DEFINESTE_STRUCTURA')
  },
  backup ({ commit }) {
    commit('BACKUP')
  },
  toggleServiciu: ({ commit }, id) => { commit('TOGGLE_SERVICIU', id) }
}

export const getters = {
  activa: state => state.activa,
  $activa: (state, getters, rootState, rootGetters) => {
    console.log('GETTERS', getters)
    console.log('ROOT GETTERS', rootGetters)
    return rootGetters.asociatii[getters.activa]
  },
  moneda: state => state.moneda,
  balanta: (state, getters) => getters.$activa && getters.$activa.balanta ? getters.$activa.balanta : 0,
  servicii: (state, getters) => getters.$activa && getters.$activa.servicii ? getters.$activa.servicii : [],
  nrUltimaChitanta: (state, getters, rootGetters) => rootGetters.incasari && rootGetters.incasari.length > 0 ? rootGetters.incasari[0].nrChitanta : 0,
  defineste: state => state.initializata
}
