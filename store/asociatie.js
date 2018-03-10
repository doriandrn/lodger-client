export const state = () => ({
  lista: {
    xxx: {
      id: null,
      structura: {
        _defineste: false,
        blocuri: [],
        apartamente: []
      },
      servicii: [],
      _initializata: false,
      balanta: 0,
      incasari: []
    }
  },
  activa: null
})

export const mutations = {
  ADAUGA_ASOCIATIE: (state, date) => {
    state.lista = { ...state.lista, [date.id]: date }
  },
  SCHIMBA_ACTIVA: (state, id) => {
    state.activa = id
  },
  STERGE_ASOCIATIE: (state, id) => {
    state.lista = { ...state.lista, [id]: { ...state.lista[id], _sters: true } }
  },
  DEFINESTE_STRUCTURA: (state) => {
    state.lista[state.activa]._initializata = 0
  }
}

export const actions = {
  adauga ({ commit, dispatch, $db }, dateAsociatie) {
    commit('ADAUGA_ASOCIATIE', dateAsociatie)

    dispatch('modal/close', true, { root: true })
    dispatch('schimba', dateAsociatie.id)
  },
  schimba ({ commit, dispatch }, id) {
    if (id === 'new') {
      dispatch('modal/open', 'asocs.new', { root: true })
    } else {
      commit('SCHIMBA_ACTIVA', id)
    }
  },
  sterge ({ commit }, id) {
    // sterge incasari
    // sterge apartamente
    // sterge blocuri
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
    const lista = rootGetters.bloc.lista
    return Object.keys(lista).filter(key => {
      return lista[key].asociatieId === id && !lista[key]._sters
    })
    // return Object.values(rootGetters.bloc.lista).filter(bloc => bloc.asociatieId === id)
  },
  structura: state => state.activa.structura,
  defineste: state => state.activa.structura._defineste
}
