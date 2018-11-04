export const getters = {
  selectat: (state, getters, rootState, rootGetters) => {
    const selectat = rootState['bloc/selectat']
    if (!selectat) return
    let bloc = rootGetters.blocuri[selectat] || {}
    const { _id } = bloc
    if (!_id) return bloc
    Object.assign(bloc, {
      apartamente: rootState.apartamente.filter(ap => ap.bloc === _id).map(ap => ap._id)
    })

    return bloc
  }
}
