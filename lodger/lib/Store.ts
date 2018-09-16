import Vue from 'vue'
import Vuex, { StoreOptions, ModuleTree, Module, ActionTree, GetterTree, MutationTree } from 'vuex'
import { Taxonomii } from 'lodger'
import { setupFromFile, setupSharedMethods, createEmptyStoreModule } from 'lodger/lib/helpers/store'
import { LodgerError } from 'lodger/lib/Errors';
import * as RootModule from 'lodger/store/index'

Vue.use(Vuex)

const modules: ModuleTree<RootState> = {}

enum Errors {
  invalidModule = 'Invalid Module'
}

export default class LodgerStore implements StoreOptions<RootState> {
  readonly modules: ModuleTree<any> = {}

  constructor (    
    private taxonomii?: Taxonomii[],
  ) {
    
    /**
     * Builds modules based on taxonomies
     * TODO: make this a method ?!
     */
    if (taxonomii && taxonomii.length) {
      taxonomii.forEach(tax => {
        modules[tax] = setupSharedMethods(undefined, createEmptyStoreModule())
      })
    }
    this.modules = modules
    console.info('MODULE', this.modules)
    
    /**
    * Store
    */
    // const { state } = this
    // const storeOptions: StoreOptions<RootState> = {
    //   modules,
    //   state,
    //   actions
    // }
 
    // FUCK YOU TS
    return new Vuex.Store<RootState>(this)
  }

  static use (module: Module<any, RootState>) {
    if (!module || typeof module !== 'object') {
      throw new LodgerError(Errors.invalidModule)
    }
    const key = Object.keys(module)[0]
    if (!key) throw new LodgerError(Errors.invalidModule)
    console.info('folosesc', key)
    modules[key] = module[key]
  }
}
