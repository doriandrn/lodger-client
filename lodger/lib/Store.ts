import Vue from 'vue'
import Vuex, { StoreOptions, ModuleTree, Module, ActionTree, GetterTree, MutationTree } from 'vuex'
import { Taxonomii } from 'lodger'
import { setupFromFile, setupSharedMethods, createEmptyStoreModule } from 'lodger/lib/helpers/store'
import lodgerConfig from '../../lodger.config'
const { version } = lodgerConfig

Vue.use(Vuex)

export default class LodgerStore {
  state: RootState = {
    locale: 'ro',
    version
  }

  constructor (
    private taxonomii?: Taxonomii[],
  ) {
    // this.state = store.state
    const modules: ModuleTree<RootState> = {}

    /**
     * Builds modules based on taxonomies
     * TODO: make this a method ?!
     */
    if (taxonomii && taxonomii.length) {
      taxonomii.forEach(tax => {
        modules[tax] = setupSharedMethods(undefined, createEmptyStoreModule())
      })
    }

    /**
    * Store
    */
    const { state } = this
    const storeOptions: StoreOptions<RootState> = {
      modules,
      state
    }
 
    return new Vuex.Store<RootState>(storeOptions)
  }
}
