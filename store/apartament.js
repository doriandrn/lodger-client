export const mutations = {
  incaseaza: (state, data) => {}
}

export const actions = {}

export const getters = {
  data: (state, getters, rootGetters) => id => rootGetters.apartamente[id] || {},
  localizeaza: (state, getters, rootGetters) => {
    if (!rootGetters['apartamente']) return () => {}
    return ({ etaj, scara, bloc }) => {
      return rootGetters.apartamente.filter(ap => ap.bloc === bloc && String(ap.scara) === String(scara) && ap.etaj === etaj).sort((a, b) => a.nr > b.nr)
    }
  }
}
