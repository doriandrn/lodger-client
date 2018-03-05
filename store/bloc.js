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
  }
}

export const actions = {
  adauga: ({ commit }, blocData) => {
    commit('ADAUGA_BLOC', blocData)
  }
}

export const getters = {
  lista: state => state.lista,
  ids: (state, getters) => Object.keys(getters.lista),
}
