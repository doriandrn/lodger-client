// import * as RxDB from "rxdb"
// import { DBErrors, DBConfig, DBContext } from 'lodger/typings/lib/DB'

// class DBError extends Error {
//   constructor(m: string) {
//     super(m)

//     // Set the prototype explicitly.
//     Object.setPrototypeOf(this, DBError.prototype)
//   }
// }

// export class DB implements DB {
//   constructor (context: DBContext) {
//     if (!context) {
//       throw new DBError(DBErrors.useCreate)
//     }
//   }
//   static async create (config: DBConfig) {
//     if (!config) {
//       throw new DBError(DBErrors.noConfig)
//     }
//     const { collections, details } = config
//     if (!collections || (collections instanceof Array && collections.length < 0)) {
//       throw new DBError(DBErrors.emptyCollections)
//     }
//     const rdb = await RxDB.create(details)
//     await rdb.waitForLeadership()

//     await Promise.all(collections.map(colData => rdb.collection(colData)))
//     return new DB({ instance: rdb })
//   }
// }
