export const state = () => ({
  lista: {},
  activa: {
    id: null,
    structura: {
      blocuri: [] //iduri
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
    }
  },
  sterge ({ commit }, id) {
    commit('STERGE_ASOCIATIE', id)
  }
}

export const getters = {
  lista: state => state.lista,
  ids: (state, getters) => Object.keys(getters.lista),
  activa: state => state.activa.id,
  activaBlocuri: state => state.activa.structura.blocuri,
  structura: state => state.activa.structura
}
