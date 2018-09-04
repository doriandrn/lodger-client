import { Lodger } from '../lodger/index'

export default async ({ app }, inject) => {
  const lodger: Lodger = await Lodger.build()
  console.info('lodger nuxt plugin loaded', lodger)
  inject('lodger', lodger)
}
