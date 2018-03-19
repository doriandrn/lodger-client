export const state = () => ({
  ultima: ''
})

export const mutations = {
  ADAUGA: (state, data) => {},
  set_ultimul_adaugat: (state, id) => state.ultima = id
}

export const actions = {
  adauga: ({ commit }, data) => { commit('ADAUGA', data) }
}
