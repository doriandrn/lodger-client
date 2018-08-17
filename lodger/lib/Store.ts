import Vue from 'vue'
import Vuex, { StoreOptions, ModuleTree, Module, ActionTree, GetterTree, MutationTree } from 'vuex'
import { RootState } from 'lodger/types/index'
import { ItemID, Taxonomii } from 'lodger/types/main'
import { version } from '../../lodger.config'
Vue.use(Vuex)

const storeModules: ModuleTree<RootState> = {}
const namespaced: boolean = true

type TaxonomyState = {
  selected: ItemID,
  last: ItemID
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
      select: ({ commit }, data) => commit('SELECTEAZA', data),
      setLast: ({ commit }, data) => commit('RECENTLY_ADDED', data)
    }
    const mutations: MutationTree<TaxonomyState> = {
      'SELECTEAZA': (s, id) => { s['selected'] = id },
      'RECENTLY_ADDED': (s, id) => { s['last'] = id }
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
      version
    },
    modules: storeModules
  }
  
  return new Vuex.Store<RootState>(storeOptions)
}
