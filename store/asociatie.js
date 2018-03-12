export const state = () => ({
  activa: null
})

export const mutations = {
  ADAUGA_ASOCIATIE: (state, date) => {
    // state.lista = { ...state.lista, [date.id]: date }
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
    dispatch('schimba', dateAsociatie.name)
  },
  schimba ({ commit, dispatch }, id) {
    commit('SCHIMBA_ACTIVA', id)
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
  activa: state => state.activa,
  defineste: state => state.activa
}
