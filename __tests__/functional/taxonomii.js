// import Lodger from '../../lodger/index'
// import faker from 'faker'
// import * as lodgerConfig from '../../lodger/config'

// let lodger

// const asociatiiCount = 20

// beforeAll(async () => {
//   lodger = await Lodger.build(lodgerConfig)
// })


// describe(`Adauga ${asociatiiCount} asociatii`, async () => {
//   beforeAll(async () => {
//     for (let i = 1; i <= asociatiiCount; i++) {
//       const name = faker.company.companyName()
//       const idN = faker.random.number()

//       await lodger.adauga({
//         ce: 'asociatie',
//         name,
//         idN
//       })
//     }
//   })
//   test(`Listeaza cele ${asociatiiCount} asociatii`, async () => {
//     const asociatii = await lodger.asociatii()
//     expect(Object.keys(asociatii).length).toBe(asociatiiCount)
//   })

//   const limit = 5
//   test(`Listeaza ${limit} asociatii specificate in 'limit'`, async () => {
//     const asociatii = await lodger.asociatii({ limit })
//     expect(Object.keys(asociatii).length).toBe(limit)
//   })

//   test(`Listeaza ultimele ${limit} si le sorteaza dupa data`, async () => {
//     const sort = {}
//     const asociatii = await lodger.asociatii({ limit, sort })
//     expect(Object.keys(asociatii).length).toBe(limit)
//   })
// })


// afterAll(async () => {
//   if (!lodger) return
//   lodger.destroy()
// })
