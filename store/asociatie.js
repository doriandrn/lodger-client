export const state = () => ({
  activa: null,
  initializata: false
})

export const mutations = {
  ADAUGA_ASOCIATIE: (state, date) => {
    // state.lista = { ...state.lista, [date.id]: date }
  },
  SCHIMBA_ACTIVA: (state, id) => {
    state.activa = id
  },
  STERGE_ASOCIATIE: (state, id) => {

  },
  DEFINESTE_STRUCTURA: (state) => {
    state.initializata = 0
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
  sterge ({ commit, rootGetters }, id) {
    // sterge incasari
    // sterge apartamente
    // sterge blocuri
    commit('STERGE_ASOCIATIE', id)
    const oneExistingId = rootGetters.asociatii[0]
    console.log('oneExistingId', oneExistingId)
    if (oneExistingId) commit('SCHIMBA_ACTIVA', oneExistingId)
  },
  definesteStructura ({ commit }) {
    commit('DEFINESTE_STRUCTURA')
  }
}

export const getters = {
  activa: state => state.activa,
  defineste: state => state.activa
}
