import { Lodger } from 'lodger'
import { observable } from 'mobx'


export default async ({ app, store }, inject) => {
  const lodger = await Lodger.build()
  if (window.navigator.language) {
    Lodger.locale = window.navigator.language
  }

  Object.assign(lodger, { modal: observable({
    activeDoc: null,
    close: function () {
      this.activeDoc = null
    }
  }) })
  inject('lodger', lodger)
  inject('Lodger', Lodger)
  inject('t', lodger.translate.bind(lodger))
  app.store = lodger.store
}
