export const mutations = {
  incaseaza: (state, data) => {}
}

export const getters = {
  data: (state, getters, rootGetters) => id => rootGetters.apartamente[id] || {},
  localizeaza: (state, getters, rootGetters) => {
    if (!rootGetters['apartamente']) return () => {}
    return ({ etaj, scara, bloc }) => {
      return rootGetters.apartamente.filter(ap => {
        if (etaj !== undefined) return ap.bloc === bloc && ap.scara === scara && ap.etaj === etaj
        if (scara !== undefined) return ap.bloc === bloc && ap.scara === scara
        if (bloc !== undefined) return ap.bloc === bloc
        return false
      }).sort((a, b) => a.nr > b.nr)
    }
  }
}
