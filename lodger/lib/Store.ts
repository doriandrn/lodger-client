import Vue from 'vue'
import Vuex, { StoreOptions, ModuleTree, Module, ActionTree, GetterTree, MutationTree } from 'vuex'
import { Taxonomii } from 'lodger'
import lodgerConfig from '../../lodger.config'
const { version } = lodgerConfig
Vue.use(Vuex)

const storeModules: ModuleTree<RootState> = {}
const namespaced: boolean = true

declare global {
  interface TaxonomyState {
    selected: ItemID,
    last: ItemID
  }

  interface AsociatieState extends TaxonomyState {

  }
}


// const sharedStoreActions = {
//   select: 'selected',
//   set_last: 'lasties',
//   activate: 'active'
// }
export default function (taxonomii: Taxonomii[]) {
  taxonomii.forEach(tax => {
    const state: TaxonomyState = {
      selected: null,
      last: null
    }
    const getters: GetterTree<TaxonomyState, RootState> = {
      last: (S: TaxonomyState) => S['last'],
      selected: (S: TaxonomyState) => S['selected']
    }
  
    const actions: ActionTree<TaxonomyState, RootState> = {
      select: ({ commit }, data) => commit('SELECT', data),
      setLast: ({ commit }, data) => commit('SET_LAST', data)
    }
    const mutations: MutationTree<TaxonomyState> = {
      'SELECT': (s, id) => { s['selected'] = id },
      'SET_LAST': (s, id) => { s['last'] = id }
    }
  
    storeModules[tax] = <Module<TaxonomyState, RootState>>{
      namespaced,
      getters,
      actions,
      mutations,
      state
    }
  })
  
  /**
   * Store
   */
  
  const storeOptions: StoreOptions<RootState> = {
    state: {
      version,
      locale: 'ro'
    },
    modules: storeModules
  }
  
  return new Vuex.Store<RootState>(storeOptions)
}
