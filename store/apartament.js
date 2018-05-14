export const state = () => ({
  selectat: {
    id: null,
    modificabil: false
  }
})

export const mutations = {
  incaseaza: (state, data) => {},
  selecteaza: (state, ap) => {
    state.selectat = ap
  }
}

export const actions = {
  selecteaza: ({ commit, dispatch }, ap) => {
    commit('selecteaza', ap)
    if (ap.modificabil) dispatch('modal/open', 'apartament.edit', { root: true })
  }
}

export const getters = {
  selectat:(state, getters, rootState, rootGetters) => state.selectat.id ? rootGetters.apartamente[state.selectat.id] : {},
  data: (state, getters, rootGetters) => id => rootGetters.apartamente[id] || {},
  localizeaza: (state, getters, rootGetters) => {
    if (!rootGetters['apartamente']) return () => {}
    return ({ etaj, scara, bloc }) => {
      // console.log({ etaj, scara, bloc })
      return rootGetters.apartamente.filter(ap => {
        if (etaj !== undefined) return ap.bloc === bloc && ap.scara === Number(scara) && ap.etaj === etaj
        if (scara !== undefined) return ap.bloc === bloc && ap.scara === Number(scara)
        if (bloc !== undefined) return ap.bloc === bloc
        return false
      }).sort((a, b) => a.nr > b.nr)
    }
  },
  tooltip: (state, getters, rs, rootGetters) => {
    if (!rootGetters['apartamente']) return () => {}
    return apId => {
      const ap = rootGetters.apartamente[apId]
      if (!ap) return {}
      const { proprietar, suprafata, locatari } = ap
      return { proprietar, suprafata, locatari }
    }
  }
}
