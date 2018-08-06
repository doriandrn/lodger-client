// import Db from '../../lodger/db/index'
// import { makeCollection } from '../../lodger/helpers/db'

// describe('DB', () => {
//   test('se initializeaza fara nimic', async () => {
//     const emptyDb = await Db()
//     expect(emptyDb).toBeDefined()
//     await emptyDb.destroy()
//   })

//   test('se initializeaza cu config custom', async () => {
//     const customName = 'blabla'
//     const customConfigDb = await Db({
//       name: customName
//     })
//     expect(customConfigDb.name).toBe(customName)

//     await customConfigDb.destroy()
//   })

//   test('se initializeaza cu colectii', async () => {
//     const colectii = []
//     const cuColectii = await Db(null, colectii)
//     expect(cuColectii).toBeDefined()
//     await cuColectii.destroy()
//   })
// })
