import { date } from 'faker'
import Vue from 'vue'
import { Lodger } from 'lodger'
import { computed } from 'mobx'
import { deepObserve } from 'mobx-utils'
import objectPath from 'object-path'

const teme = ['default', 'clean', 'neumorph']

export default async ({ app, isDev }, inject) => {
  let savedState
  try {
    const _savedState = isDev ? {} : JSON.parse(localStorage.getItem('state'))

    if (_savedState) {
      savedState = {}
      Object.keys(_savedState).forEach(p => {
        objectPath.set(savedState, p.replace(/\//g, '.'), _savedState[p])
      })
    }
  } catch (e) {
    console.info('No previous saved state found', e)
  }

  const date = new Date()
  // const name = 'test' + date.getTime()
  const lodger = await Lodger.init({
    state: isDev ? {} : savedState
  })
  if (window.navigator.language && !lodger.state.activeUserId ) {
    lodger.locale = window.navigator.language
  }
  lodger.teme = teme

  lodger.state.io = {
    preparingDBexport: false,
    exportDBlink: '',
    filename: 'lodgerdb-export.ldb'
  }

  inject('l', lodger)
  inject('L', Lodger)

  if (isDev)
    window.$l = lodger

  deepObserve(lodger.appState, (change, path) => {
    const prevState = JSON.parse(localStorage.getItem('state')) || {}
    const { newValue, name } = change
    if (name == 'sub')
      return

    const state =
      Object.assign({}, { ...prevState }, {
        [ `${path}/${change.name}` ]: change.newValue
      })

    try {
      localStorage.setItem('state', JSON.stringify(state))
    } catch (e) {
      console.log('wttf', e)
    }
  }, {
    // fireImmediately: true
  })

  // inject('t', lodger.translate.bind(lodger))
}
