export const state = () => ({
  activa: {
    id: ''
  },
  moneda: 'ron',
  ultima: null,
  initializata: false
})

export const mutations = {
  ADAUGA_ASOCIATIE: (state, date) => {},
  SCHIMBA_ACTIVA: (state, data) => {
    state.activa.id = data.id
  },
  STERGE_ASOCIATIE: (state, id) => {},
  DEFINESTE_STRUCTURA: (state) => {
    state.initializata = 0
  },
  BACKUP: () => {},
  set_ultimul_adaugat: (state, id) => {
    state.ultima = id
  },
  initBalanta: (state, data) => {},
  incaseaza: (state, data) => {}
}

export const actions = {
  adauga ({ commit, dispatch }, dateAsociatie) {
    commit('ADAUGA_ASOCIATIE', dateAsociatie)

    dispatch('modal/close', true, { root: true })
    // dispatch('schimba', dateAsociatie.name)
  },
  schimba ({ commit, dispatch }, data) {
    commit('SCHIMBA_ACTIVA', data)
  },
  sterge ({ commit, rootGetters }, id) {
    commit('STERGE_ASOCIATIE', id)
    // const oneExistingId = rootGetters.asociatii[0]
    // if (oneExistingId) commit('SCHIMBA_ACTIVA', oneExistingId)
  },
  initBalanta ({ commit }, data) { commit('initBalanta', data) },
  definesteStructura ({ commit }) {
    commit('DEFINESTE_STRUCTURA')
  },
  backup ({ commit }) {
    commit('BACKUP')
  }
}

export const getters = {
  activa: state => state.activa.id,
  moneda: state => state.moneda,
  ultima: state => state.ultima,
  balanta: (state, getters, rootGetters) => {
    const asoc = rootGetters.asociatii.filter(asociatie => asociatie.name === getters.activa)[0]
    return asoc && asoc.balanta ? asoc.balanta : 0
  },
  nrUltimaChitanta: (state, getters, rootGetters) => rootGetters.incasari.length > 0 ? rootGetters.incasari[0].nrChitanta : 1,
  defineste: state => state.initializata
}
