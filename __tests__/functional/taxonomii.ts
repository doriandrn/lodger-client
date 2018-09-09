import { Lodger } from '../../lodger'
import faker from 'faker'
import Debug from 'debug'
Debug.enable('lodger:*')
// import * as lodgerConfig from '../../lodger/config'

let lodger: Lodger | undefined
let getters: LodgerGetters | undefined

const asociatiiCount = 30
const blocuriCount = 5

beforeAll(async () => {
  lodger = await Lodger.build()
  getters = lodger.getters
})

const debug = Debug('lodger:functional')

describe(`ASOCIATII`, async () => {
  let ids = []

  describe('PUT (add func)', () => {
    beforeAll(async () => {
      ids = await Promise.all(Array(asociatiiCount).fill().map(async (_, i) => {
        const name = faker.company.companyName()
        const cif = faker.random.number()

        // debug('pun', name)
        const { _id } = await lodger.put('asociatie', {
          name,
          organizatie: {
            cif
          }
        })

        // debug('pus', i, _id)
        return _id
      }))
    })

    test(`Listeaza cele ${asociatiiCount} asociatii`, async () => {
      // wait for QueryDetection events to update
      await new Promise(resolve => setTimeout(resolve, 1000))
      const { asociatii } = lodger
      expect(Object.keys(asociatii).length).toBe(asociatiiCount)
    })

    const limit = 5
    test(`Listeaza ${limit} asociatii specificate in 'limit'`, async () => {
      const secondarySubscriber = 'secondary'
      await lodger.$get('asociatii', { limit }, secondarySubscriber)
      lodger.useSubscriber(secondarySubscriber)
      await new Promise(resolve => setTimeout(resolve, 2000))
      expect(Object.keys(lodger.asociatii).length).toBe(limit)
    })

    // test(`Listeaza ultimele ${limit} si le sorteaza dupa data`, async () => {
    //   const sort = {}
    //   await lodger.$get('asociatii', { limit, sort })
    //   expect(Object.keys(lodger.asociatii).length).toBe(limit)
    // })
  })

  debug('/dun')
})

describe('BLOCURI', () => {
  test('just ffs', () => {
    expect(lodger).toBeDefined()
  })
  // const idsAsociatii = lodger.__getters.asociatii

  test('getters have the ids', () => {
    // console.error('lodger', lodger)
    const idsAsociatii = getters['asociatie/ids']
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
