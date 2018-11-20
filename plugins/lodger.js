import { Lodger } from 'lodger'

export default async ({ app, store }, inject) => {
  const lodger = await Lodger.build()
  inject('lodger', lodger)
  app.store = lodger.store
}
