export const state = () => ({
  activa: '',
  moneda: 'ron',
  initializata: false
})

export const mutations = {
  SCHIMBA_ACTIVA: (state, asocData) => {
    state.activa = asocData._id
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
  /*
   *  schimba
   *  primeste id ca parametru si trimite toata asociatia pt mutatie -> pt store
   */
  schimba ({ commit, dispatch, rootGetters }, asocId) {
    if (!asocId || typeof asocId !== 'string') {
      // console.error('asocid gresit', asocId)
      return
    }
    const asociatie = rootGetters.asociatii[asocId]
    if (!asociatie) {
      // console.error('no asoc found asociatie.js store')
      return
    }
    commit('SCHIMBA_ACTIVA', asociatie)
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
  activa: (state, getters, rs, rg) => rg.asociatii[state.activa] || {},
  moneda: state => state.moneda,
  apartamente: (state, getters, rs, rg) => rg['apartament/ids'].filter(ap => rg['bloc/ids'].indexOf(rg.apartamente[ap].bloc) > -1),
  balanta: (state, getters, rs, rg) => rg.asociatii && rs.asociatii.length > 0 && rg.asociatii[getters.activa] ? rg.asociatii[getters.activa].balanta : 0,
  servicii: (state, getters, rs, rg) => rg.asociatii && rs.asociatii.length > 0 && rg.asociatii[getters.activa] && rg.asociatii[getters.activa].servicii ? rg.asociatii[getters.activa].servicii.filter(serv => Object.keys(rg.servicii).indexOf(serv) > -1) : [],
  nrUltimaChitanta: (state, getters, rootGetters) => rootGetters.incasari && rootGetters.incasari.length > 0 ? rootGetters.incasari[0].nrChitanta : 0,
  defineste: state => state.initializata
}
