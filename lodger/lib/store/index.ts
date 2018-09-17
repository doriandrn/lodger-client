import lodgerConfig from '../../../lodger.config'
/**
 * MODULES
 */
// TOAST
import { createModule } from 'vuex-toast'

// MODAL
import * as modal from './modules/modal'

const { version } = lodgerConfig
const state: RootState = {
  locale: 'ro',
  version
}

const actions: ActionTree < Toast, RootState > = {
  notify: ({ dispatch }, notificare) => {
    dispatch('@@toast/ADD_TOAST_MESSAGE', notificare)
  }
}

const modules = {
  toast: createModule({ dismissInterval: 5000 }),
  // modal
}

export {
  state,
  actions,
  modules
}
