export const state = () => ({
  selectat: {
    bloc: null,
    scara: null,
    etaj: null
  }
})

export const mutations = {
  SELECTEAZA_ETAJ: (state, etaj) => {
    state.selectat = etaj
  }
}

export const actions = {
  selecteaza: ({ commit, dispatch }, etaj) => {
    commit('SELECTEAZA_ETAJ', etaj)
    if (etaj.modificabil)
      dispatch('modal/open', 'apartament.new', { root: true })
  }
}

export const getters = {
  selectat: state => state.selectat
}
