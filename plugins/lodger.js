import { Lodger } from 'lodger'
import { observable } from 'mobx'


export default async ({ app, store }, inject) => {
  const lodger = await Lodger.build()

  Object.assign(lodger, { modal: observable({
    activeDoc: null,
    close: function () {
      this.activeDoc = null
    }
  }) })
  inject('lodger', lodger)
  app.store = lodger.store
}
