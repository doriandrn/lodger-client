import { Lodger } from '../lodger/index'

export default async ({ app, store }, inject) => {
  const lodger: Lodger = await Lodger.build()
  inject('lodger', lodger)
  app.store = lodger.store
}
