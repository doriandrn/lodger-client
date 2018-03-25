export const state = () => ({
  activa: '',
  moneda: 'ron',
  initializata: false
})

export const mutations = {
  SCHIMBA_ACTIVA: (state, name) => {
    state.activa = name
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
    commit('SCHIMBA_ACTIVA', data.name)
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
  activa: (state, getters, rootGetters) => state.activa,
  // $activa: (state, getters, rootGetters) => rootGetters.asociatii ? rootGetters.asociatii.filter(asociatie => asociatie.name === getters.activa)[0] : {},
  moneda: state => state.moneda,
  balanta: (state, getters) => getters.$activa && getters.$activa.balanta ? getters.$activa.balanta : 0,
  servicii: (state, getters) => getters.$activa && getters.$activa.servicii ? getters.$activa.servicii : [],
  nrUltimaChitanta: (state, getters, rootGetters) => rootGetters.incasari && rootGetters.incasari.length > 0 ? rootGetters.incasari[0].nrChitanta : 0,
  defineste: state => state.initializata
}
