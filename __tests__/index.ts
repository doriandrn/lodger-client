import { Lodger } from '../lodger/index'
import Debug from 'debug'
Debug.enable('lodger:*')

describe('Lodger', () => {
  describe('API', async () => {
    let lodger: Lodger
    let getters: LodgerGetters
    beforeAll(async () => {
      lodger = await Lodger.build()
      getters = lodger.__getters
    })

    let commonId: string | null = null

    describe('put', () => {
      const debug = Debug('lodger:tests:put')
      test('adds a new assoc', async () => {
        const name = 'bla'
        const { _id } = await lodger.put('asociatie', {
          name
        })
        expect(_id).toBeDefined()
        const lastAddedId = getters['asociatie/last']
        expect(lastAddedId).toBe(_id)
        commonId = _id

        debug('LODGERICA', Object.getOwnPropertyNames(lodger))
      })
    })

    describe('trash', () => {
      test('deletes the prev added assoc', () => {
        expect(async () => { await lodger.trash('asociatie', commonId) }).not.toThrow()
        // expect(getters['asociatie/ids']).not.toContain(commonId)
      })
    })
    
    test('mapeaza taxonomiile pt a fi apelate ca gettere', () => {
      expect(lodger.asociatii).toBeDefined()
    })

    describe('set', () => {
      test('sets a new preferences value', () => {
        lodger.setPreference('client.locale', 'ro')
        expect(lodger.preferences.client.locale).toBe('ro')
      })
    })

    afterAll(async () => {
      if (!lodger) return
      await lodger.destroy()
    })
  })
})
