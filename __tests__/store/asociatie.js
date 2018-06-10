import Vue from 'vue'
import Vuex from 'vuex'
import { state, mutations, actions } from '../../store/asociatie'
Vue.use(Vuex)

const store = new Vuex.Store({
  state, mutations, actions
})

const { dispatch, getters } = store

describe('Adauga o asociatie', () => {
  dispatch('asociatie/adauga', { denumire: 'lola' })

  // test('adauga doar cu denumire', () => {
  //   expect(rootGetters.asociatii['lola']).toBeDefined()
  // })
  // test('este cea activa dupa adaugare', () => {
  //   expect(getters.activa).toBe('lola') //todo: no, e gresit, ia idu
  // })
})

test('schimba asociatia activa', () => {
  dispatch('schimba', '123')
  expect(store.state.activa).toBe('123')
})
