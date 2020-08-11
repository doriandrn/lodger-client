import { Lodger } from 'lodger'
import { observable } from 'mobx'


export default async ({ app, store }, inject) => {
  const lodger = await Lodger.build()

  Object.assign(lodger, { modal: observable({
    title: '',
    taxonomy: '',
    id: '',
    activeDoc: null,
    isPrompt: false,
    close: function () {
      console.log(this)
      this.title = ''
      this.taxonomy = ''
      this.id = ''
      this.activeDoc = null
      this.isPrompt = false
    }
  }) })
  inject('lodger', lodger)
  app.store = lodger.store
}
