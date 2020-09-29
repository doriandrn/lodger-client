import { Lodger } from 'lodger'
import { observable } from 'mobx'


export default async ({ app, store }, inject) => {
  const lodger = await Lodger.build()
  if (window.navigator.language) {
    Lodger.locale = window.navigator.language
  }

  const { $axios } = app

  console.log(Object.getOwnPropertyNames(app))

  Object.assign(lodger, {
    modal: observable({
      activeDoc: null,
      close: function () {
        this.activeDoc = null
      }
    }),
    cursValutar: async () => {
      const { data } = await $axios.get(`https://openexchangerates.org/api/latest.json?app_id=1c424442229347b3b922a2daa809ff1c`)
      console.log('d', data)
    }
  })
  inject('lodger', lodger)
  // inject('Lodger', Lodger)
  // inject('t', lodger.translate.bind(lodger))
  app.store = lodger.store
}
