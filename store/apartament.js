export const mutations = {
  incaseaza: (state, data) => {}
}

export const getters = {
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
