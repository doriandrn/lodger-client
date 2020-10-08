import { Lodger } from 'lodger'
import { observable } from 'mobx'


export default async ({ app, store }, inject) => {
  const lodger = await Lodger.build()
  if (window.navigator.language) {
    Lodger.locale = window.navigator.language
  }

  const { $axios } = app

  Object.assign(lodger, {
    modal: observable({
      activeDoc: null,
      sub: { edit: () => {} },
      close: function () {
        this.activeDoc = null
        if (this.sub) this.sub.edit()
      }
    }),

    mainSubName: 'prince'
    // cursValutar: async (displayCurrency) => {
    //   if (!displayCurrency) return
    //   const { localStorage } = window

    //   const id = `cursValutar-${displayCurrency}`
    //   let prevTimestamp

    //   try {
    //     prevTimestamp = JSON.parse(localStorage.getItem(id))
    //     prevTimestamp = prevTimestamp.timestamp
    //   } catch (e) {

    //   }

    //   if (prevTimestamp && Date.now() / 1000 - prevTimestamp < 100000) {
    //     console.error('cannot fetch exchange rates too often')
    //     return
    //   }

    //   const { data } = await $axios.get(`https://openexchangerates.org/api/latest.json?app_id=1c424442229347b3b922a2daa809ff1c&base=${displayCurrency}`)
    //   const { base, rates, timestamp } = data

    //   if (base !== displayCurrency)
    //     throw new Error('diferrent currencies supplied')

    //   localStorage.setItem(id, JSON.stringify({ rates, timestamp }) )
    // }
  })
  inject('lodger', lodger)
  inject('Lodger', Lodger)
  // inject('t', lodger.translate.bind(lodger))
  app.store = lodger.store
}
