import LodgerStore from 'lodger/lib/Store'
const taxonomies = ['masina']

describe('LodgerStore', () => {
  describe('new ()', () => {
    let store: LodgerStore
    beforeAll(() => {
      store = new LodgerStore(taxonomies)
    })
    describe('positive', () => {
      test('no arguments -> empty store', () => {
        const s = new LodgerStore()
        expect(s).toBeDefined()
      })

      test.each(taxonomies)('contains %s module', (s) => {
        const getterName = `${s}/active`
        expect(store.getters[getterName]).toBeDefined()
      })
    })

    describe('negative', () => {
      test('throws if called with anything else than an array of taxonomies', () => {
        try {
          const store = new LodgerStore({})
          expect(store).toBeUndefined()
        } catch (e) {
          expect(e).toBeDefined()
        }
      })
    })
  })
})