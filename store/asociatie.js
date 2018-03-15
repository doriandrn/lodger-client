export const state = () => ({
  activa: null,
  ultima: null,
  initializata: false
})

export const mutations = {
  ADAUGA_ASOCIATIE: (state, date) => {
  },
  SCHIMBA_ACTIVA: (state, id) => {
    state.activa = id
  },
  STERGE_ASOCIATIE: (state, id) => {
  },
  DEFINESTE_STRUCTURA: (state) => {
    state.initializata = 0
  },
  set_ultimul_adaugat: (state, id) => {
    state.ultima = id
  }
}

export const actions = {
  adauga ({ commit, dispatch, $db }, dateAsociatie) {
    commit('ADAUGA_ASOCIATIE', dateAsociatie)

    dispatch('modal/close', true, { root: true })
    // dispatch('schimba', dateAsociatie.name)
  },
  schimba ({ commit, dispatch }, id) {
    commit('SCHIMBA_ACTIVA', id)
  },
  sterge ({ commit, rootGetters }, id) {
    commit('STERGE_ASOCIATIE', id)
    // const oneExistingId = rootGetters.asociatii[0]
    // if (oneExistingId) commit('SCHIMBA_ACTIVA', oneExistingId)
  },
  definesteStructura ({ commit }) {
    commit('DEFINESTE_STRUCTURA')
  }
}

export const getters = {
  activa: state => state.activa,
  ultima: state => state.ultima,
  defineste: state => state.initializata
}
