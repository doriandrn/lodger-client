export const state = () => ({
  selectat: {
    id: null,
    modificabil: false
  }
})

export const mutations = {
  selecteaza: (state, bloc) => {
    state.selectat = bloc
  }
}

export const actions = {
  selecteaza: ({ commit, dispatch }, bloc) => {
    const { id, modificabil } = bloc 
    commit('selecteaza', bloc)
    if (!modificabil) return
    dispatch ('modal/open', 'bloc.edit', { root: true })
  }
}

export const getters = {
  selectat: (state, getters, rootState, rootGetters) => {
    const { id } = state.selectat
    return rootGetters.blocuri[id]
  }
}
