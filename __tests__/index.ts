import { Lodger, Errors } from '../lodger/index'
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

      // test('adds a new bloc at prev created assoc', async () => {

      // })
    })

    describe('trash', () => {
      test('deletes the prev added assoc', () => {
        expect(async () => { await lodger.trash('asociatie', commonId) }).not.toThrow()
        // expect(getters['asociatie/ids']).not.toContain(commonId)
      })
    })
    
    test('mapeaza taxonomiile pt a fi apelate ca gettere', () => {
      expect(lodger.asociatii).toBeDefined()
      expect(lodger.apartamente).toBeDefined()
    })

    describe('setPreference', () => {
      test('throws if starting taxonomy is not known', async () => {
        // expect(async () => { await lodger.setPreference('caca.maca', null) }).toThrow()
        try {
          await lodger.setPreference('caca.maca', null)
        } catch(e) {
          expect(e).toBeDefined()
          expect(String(e).indexOf(Errors.invalidPreferenceIndex)).toBeTruthy()
        }
      })
      test('throws if invalid properties specified', async () => {
        try {
          await lodger.setPreference('client.', null)
        } catch (e) {
          expect(String(e).indexOf(Errors.invalidPropertySupplied)).toBeTruthy()
        }


        try {
          await lodger.setPreference('client.xxx', 0)

        } catch (e) {
          expect(String(e).indexOf(Errors.invalidPropertySupplied)).toBeTruthy()
        }
      })

      test('sets a new preferences value in store', async () => {
        await lodger.setPreference('client.interface.fontSize', 3)
        expect(lodger.preferences.client.fontSize).toBe(3)
      })

      test('sets a new preferences value in DB', async () => {
        await lodger.setPreference('user.language', 'ro')
        expect(lodger.preferences.user.language).toBe('ro')
      })
    })

    afterAll(async () => {
      if (!lodger) return
      await lodger.destroy()
    })
  })
})
