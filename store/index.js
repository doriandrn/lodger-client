// import VuexPersistence from 'vuex-persist'
import createPersistedState from 'vuex-persistedstate'

// const vuexLocal = new VuexPersistence({
//   storage: window.localStorage
// })

export const state = () => ({
})

export const getters = {
  activa: state => state.activa
}

export const plugins = [
  createPersistedState()
]
