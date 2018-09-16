import lodgerConfig from '../../../lodger.config'
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

export {
  state,
  actions
}
