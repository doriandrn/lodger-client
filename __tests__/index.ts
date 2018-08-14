import { Lodger } from '../lodger/index'
import Debug from 'debug'
Debug.enable('lodger:*')

describe('Lodger', () => {
  describe('API', async () => {
    let lodger: Lodger
    beforeAll(async () => {
      lodger = await Lodger.build()
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
        const lastAddedId = lodger.__getters['asociatie/last']
        expect(lastAddedId).toBe(_id)
        commonId = null
      })

    })

    describe('trash', () => {
      test('deletes the prev added assoc', async () => {
        await lodger.trash('asociatie', commonId)
        const asocs = await lodger.asociatii.findOne({ _id: { $eq: commonId }})
        expect(asocs).toBeUndefined()
      })
    })
    
    test('mapeaza taxonomiile pt a fi apelate ca gettere', () => {
      expect(lodger.asociatii).toBeDefined()
    })

    describe('set', () => {
      test('sets a new preferences value', () => {
        lodger.set('client.locale', 'ro')
        expect(lodger.preferences.client.locale).toBe('ro')
      })
    })

    afterAll(async () => {
      if (!lodger) return
      await lodger.destroy()
    })
  })
})
