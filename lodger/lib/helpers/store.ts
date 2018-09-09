import { Module, ActionTree, GetterTree, MutationTree } from 'vuex'
import { LodgerError } from 'lodger/lib/Errors';

// const namespaced: boolean = true


interface RootState {
  [key: string]: any
}

type EmptyState = {}

/**
 * Creates an empty store module
 */
function createEmptyStoreModule () {

  /**
   * Empties
   */
  const state: EmptyState = {} as any
  const getters: GetterTree<EmptyState, RootState> = {}
  const actions: ActionTree<EmptyState, RootState> = {}
  const mutations: MutationTree<EmptyState> = {}

  return <Module<EmptyState, RootState>>{
    namespaced: true,
    state,
    actions,
    mutations,
    getters
  }
}

/**
  * Shared methods across taxonomies, called individually
  * 
  * @param taxonomy
  * @requires sharedMethods 
  */
function setupSharedMethods (
  sharedMethods: SharedStoreMethods = {
    selected: 'select',
    last: 'set_last',
    active: 'activate'
  },
  module?: Module<SharedStoreMethods, RootState>
) {
  if (typeof sharedMethods !== 'object') {
    throw new LodgerError('invalid methods supplied')
  }
  if (!module) {
    module = createEmptyStoreModule()
  }

  Object.keys(sharedMethods).forEach(methodName => {
    const action: string | undefined = sharedMethods[methodName]

    module.state[methodName] = undefined
    module.getters[methodName] = (S: RootState) => S[methodName]
    module.actions[action] = ({ commit }, data) => commit(action, data)
    module.mutations[action] = (s, id) => s[methodName] = id
  })

  return module
}

/**
 * Loads a taxonomy's store data from it's filename in store
 */
function setupFromFile (taxonomy: Taxonomii) {
  return <Module<Taxonomie, RootState>>{

  }
}

export {
  createEmptyStoreModule,
  setupSharedMethods,
  setupFromFile
}
