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

const ids = []

describe(`ASOCIATII`, async () => {
  
  describe('PUT (add func)', () => {
    beforeAll(async () => {
      for (let i = 1; i <= asociatiiCount; i++) {
        const name = faker.company.companyName()
        const cif = faker.random.number()

        const { _id } = await lodger.put('asociatie', {
          name,
          organizatie: {
            cif
          }
        })
        ids.push(_id)
      }
    })
    test(`Listeaza cele ${asociatiiCount} asociatii`, async () => {
      await lodger.$get('asociatii')
      expect(Object.keys(lodger.asociatii).length).toBe(asociatiiCount)
    })

    const limit = 5
    test(`Listeaza ${limit} asociatii specificate in 'limit'`, async () => {
      await lodger.$get('asociatii', { limit })
      expect(Object.keys(lodger.asociatii).length).toBe(limit)
    })

    test(`Listeaza ultimele ${limit} si le sorteaza dupa data`, async () => {
      const sort = {}
      await lodger.$get('asociatii', { limit, sort })
      expect(Object.keys(lodger.asociatii).length).toBe(limit)
    })

  })

  

  console.info('/dun')
})

describe('BLOCURI', () => {
  test('just ffs', () => {
    expect(lodger).toBeDefined()
  })
  // const idsAsociatii = lodger.__getters.asociatii

  test('getters have the ids', () => {
    console.error('lodger', lodger)
    const idsAsociatii = lodger.__getters['asociatie/ids']
    console.error('IA', idsAsociatii, ids)
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
