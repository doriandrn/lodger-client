export const state = () => ({
  activa: '',
  moneda: 'ron',
  initializata: false
})

export const mutations = {
  SCHIMBA_ACTIVA: (state, data) => {
    state.activa = data.name
    // state.$activa = data
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
  moneda: state => state.moneda,
  balanta: (state, getters) => getters.$activa && getters.$activa.balanta ? getters.$activa.balanta : 0,
  servicii: (state, getters, rs, rg) => rg.asociatii && rs.asociatii.length > 0 && rg.asociatii[getters.activa] ? rg.asociatii[getters.activa].servicii : [],
  nrUltimaChitanta: (state, getters, rootGetters) => rootGetters.incasari && rootGetters.incasari.length > 0 ? rootGetters.incasari[0].nrChitanta : 0,
  defineste: state => state.initializata
}
