import lodgerConfig from '../../../lodger.config'
const { version } = lodgerConfig
import { createModule } from 'vuex-toast'

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
  toast: createModule({ dismissInterval: 5000 })
}

export {
  state,
  actions,
  modules
}
