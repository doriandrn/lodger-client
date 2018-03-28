// import Vue from 'vue'
// import dbv from 'helpers/plugins/db'

// Vue.use(dbv)
import Db from 'db'

export default async ({ app }, inject) => {
  const db = await Db
  inject('db', db)
  // app.$db = await dbv.install()
}
