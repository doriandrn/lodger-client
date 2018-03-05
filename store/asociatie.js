export const state = () => ({
  lista: {},
  activa: {
    id: null,
    structura: {
      _defineste: false,
    }
  }
})

export const mutations = {
  ADAUGA_ASOCIATIE: (state, date) => {
    state.lista = { ...state.lista, [date.id]: date }
  },
  SCHIMBA_ACTIVA: (state, id) => {
    state.activa.id = id
  },
  STERGE_ASOCIATIE: (state, id) => {
    const lista = state.lista
    delete lista[id]
    state.lista = { ...lista }
  },
  DEFINESTE_STRUCTURA: (state) => {
    state.activa.structura._defineste = true
  },
  INCHIDE_DEFINESTE_STRUCTURA: (state) => {
    state.activa.structura._defineste = false
  }
}

export const actions = {
  adauga ({ commit, dispatch }, dateAsociatie) {
    commit('ADAUGA_ASOCIATIE', dateAsociatie)
    dispatch('modal/close', true, { root: true })
    dispatch('schimba', dateAsociatie.id)
  },
  schimba ({ commit, dispatch }, id) {
    if (id === 'new') {
      dispatch('modal/open', 'asocs.new', { root: true })
    } else {
      commit('SCHIMBA_ACTIVA', id)
      commit('INCHIDE_DEFINESTE_STRUCTURA')
    }
  },
  sterge ({ commit }, id) {
    commit('STERGE_ASOCIATIE', id)
  },
  definesteStructura ({ commit }) {
    commit('DEFINESTE_STRUCTURA')
  }
}

export const getters = {
  lista: state => state.lista,
  ids: (state, getters) => Object.keys(getters.lista),
  activa: state => state.activa.id,
  activaBlocuri: (state, getters, rootGetters) => {
    const id = state.activa.id
    if (!id) return []
    return Object.keys(rootGetters.bloc.lista).filter(key => {
      return rootGetters.bloc.lista[key].asociatieId === id
    })
    // return Object.values(rootGetters.bloc.lista).filter(bloc => bloc.asociatieId === id)
  },
  structura: state => state.activa.structura,
  defineste: state => state.activa.structura._defineste
}
