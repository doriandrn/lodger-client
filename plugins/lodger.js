import { date } from 'faker'
import { Lodger } from 'lodger'
import { deepObserve } from 'mobx-utils'
import objectPath from 'object-path'

export default async ({ app, store }, inject) => {
  let savedState
  try {
    const _savedState = JSON.parse(localStorage.getItem('state'))

    if (_savedState) {
      savedState = {}
      Object.keys(_savedState).forEach(p => {
        objectPath.set(savedState, p.replace(/\//g, '.'), _savedState[p])
      })
      console.log('savedState', savedState)
    }
  } catch (e) {
    console.info('No previous saved state found', e)
  }

  const date = new Date()
  // const name = 'test' + date.getTime()
  const lodger = await Lodger.init({
    state: savedState
  })
  // if (window.navigator.language) {
  //   Lodger.locale = window.navigator.language
  // }

  // const { $axios } = app

  Object.assign(lodger, { mainSubName: 'prince' })

  inject('lodger', lodger)
  inject('Lodger', Lodger)

  deepObserve(lodger.appState, (change, path) => {
    // console.log('jit changed', change, path)
    const prevState = JSON.parse(localStorage.getItem('state')) || {}
    localStorage.setItem('state',
      JSON.stringify(Object.assign(prevState, {
        [ `${path}/${change.name}` ]: change.newValue
      }))
    )
  }, {
    fireImmediately: true
  })

  // inject('t', lodger.translate.bind(lodger))
}
