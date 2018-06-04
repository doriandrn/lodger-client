import Vue from 'vue'
import Vuex from 'vuex'
import rxdb from '../lodger/plugins/store/rxdb'
Vue.use(Vuex)

describe('Lodger STORE', () => {
  beforeEach(() => {
    jest.resetModules()
  })

  describe('ENVul e ok', () => {
    test('e definit si e "test"', () => {
      expect(process.env.NODE_ENV).toBeDefined()
      expect(process.env.NODE_ENV).toBe('test')
    })
  })

  describe('Plugin-urile se intializeaza ok', () => {

    /**
     * Plugin-ul de RXDB doar se inscrie la mutatiile store-ului.
     * Modificarile in DB se fac doar in urma unei mutatii;
     * Getterii iau date direct din DB (+state daca e nevoie)
     */
    test('1. RXDB', () => {
      const rxdbStore = new Vuex.Store({ 
        state: () => ({ test: null }),
        plugins: [ rxdb() ],
        actions: {
          test: ({ commit }, payload) => {
            commit('TEST', payload)
          }
        },
        mutations: {
          TEST: () => {}
        },
        getters: {
          test: state => state.test
        }
      })
      const { dispatch, getters } = rxdbStore
      dispatch('test', '123')
      expect(getters.test).toBe('123')
    })


    // test.todo('2. [Store] Persisted State')
  })
})
