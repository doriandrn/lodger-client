import Db from 'db'

export default async ({ app }, inject) => {
  const db = await Db
  inject('db', db)
}
