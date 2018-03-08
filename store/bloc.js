export const state = () => ({
  lista: {
    xxx: {
      nume: 'M11',
      etaje: 4,
      eticheta: 7,
      asociatieId: 'ryJ2DwtuG'
    }
  }
})

export const mutations = {
  ADAUGA_BLOC: (state, data) => {
    state.lista = { ...state.lista, [data.id]: data }
  },
  STERGE_BLOC: (state, id) => {
    state.lista[id]._sters = true
  }
}

export const actions = {
  adauga: ({ commit }, blocData) => {
    commit('ADAUGA_BLOC', blocData)
  },
  sterge: ({ commit }, blocId) => {
    commit('STERGE_BLOC', blocId)
  }
}

export const getters = {
  lista: state => state.lista,
  ids: (state, getters) => Object.keys(getters.lista),
  data: state => id => state.lista[id] || {}
}
