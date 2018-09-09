import { LodgerStore } from 'lodger/lib/Store'

describe('LodgerStore', () => {
  describe('helpers', () => {
    describe('.lodgerModules(taxonomii)', () => {
      describe('positive', () => {

      })
    })
  })
  describe('new ()', () => {
    let store: LodgerStore
    beforeAll(() => {
      store = new LodgerStore(['masina'])
    })
    describe('positive', () => {
      test('no arguments -> empty store', () => {
        const s = new LodgerStore()
        expect(s).toBeDefined()
      })

      test('contains all modules', () => {
        expect(store.masina).toBeDefined()
        expect(Object.keys(store).length).toBe(1)
      })
    })

    describe('negative', () => {

    })
  })
})