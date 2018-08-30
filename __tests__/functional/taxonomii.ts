import { Lodger } from '../../lodger'
import faker from 'faker'
import Debug from 'debug'
Debug.enable('lodger:*')
// import * as lodgerConfig from '../../lodger/config'

let lodger: Lodger | undefined

const asociatiiCount = 30
const blocuriCount = 5

beforeAll(async () => {
  lodger = await Lodger.build()
})

let ids = []

describe(`ASOCIATII`, async () => {
  
  describe('PUT (add func)', () => {
    beforeAll(() => {
      ids = Array(asociatiiCount).fill().map(async (_, i) => {
        const name = faker.company.companyName()
        const cif = faker.random.number()

        console.info('pun', name)
        const { _id } = await lodger.put('asociatie', {
          name,
          organizatie: {
            cif
          }
        })

        console.info('pus', i, _id)
        return _id
      })
      // for (let i = 1; i <= asociatiiCount; i++) {
      //   const name = faker.company.companyName()
      //   const cif = faker.random.number()

      //   const { _id } = await lodger.put('asociatie', {
      //     name,
      //     organizatie: {
      //       cif
      //     }
      //   })
      //   console.info('pus', _id)
      //   ids.push(_id)
      // }
    })
    test(`Listeaza cele ${asociatiiCount} asociatii`, async () => {
      // await lodger.$get('asociatii')
      const { asociatii } = lodger
      console.log('LOLA', asociatii)
      expect(Object.keys(asociatii).length).toBe(asociatiiCount)
    })

    const limit = 5
    // test(`Listeaza ${limit} asociatii specificate in 'limit'`, async () => {
    //   await lodger.$get('asociatii', { limit })
    //   expect(Object.keys(lodger.asociatii).length).toBe(limit)
    // })

    // test(`Listeaza ultimele ${limit} si le sorteaza dupa data`, async () => {
    //   const sort = {}
    //   await lodger.$get('asociatii', { limit, sort })
    //   expect(Object.keys(lodger.asociatii).length).toBe(limit)
    // })
  })

  console.info('/dun')
})

describe('BLOCURI', () => {
  test('just ffs', () => {
    expect(lodger).toBeDefined()
  })
  // const idsAsociatii = lodger.__getters.asociatii

  test('getters have the ids', () => {
    // console.error('lodger', lodger)
    const idsAsociatii = lodger.__getters['asociatie/ids']
    // console.error('IA', idsAsociatii, ids, lodger.asociatii)
    expect(idsAsociatii).toEqual(ids)
  })


})

afterAll(async () => {
  if (!lodger) return
  try {
    await lodger.export()
  } catch (e) {
    console.error('could not export after tests', e)
  }
  await lodger.destroy()
})
