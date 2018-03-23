export const getters = {
  data: (state, getters, rootGetters) => id => rootGetters.blocuri.filter(bloc => bloc._id === id)[0] || {},
  ids: (state, getters, rootGetters) => rootGetters.blocuri ? Object.keys(rootGetters.blocuri) : {}
}
