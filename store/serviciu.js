import { predefinite } from 'forms/serviciu'

export const state = () => ({
  ultimul: ''
})

export const mutations = {
  ADAUGA: (state, data) => {},
  STERGE: (state, id) => {},
  set_ultimul_adaugat: (state, id) => {state.ultimul = id}
}

export const actions = {
  adauga: ({ commit }, data) => { commit('ADAUGA', data) },
  sterge: ({ commit }, id) => { commit('STERGE', id) }
}

export const getters = {
  predefinite: () => predefinite
}
