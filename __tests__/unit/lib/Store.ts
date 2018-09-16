import LodgerStore from 'lodger/lib/Store'
const taxonomies = ['masina']

const testModule = {
  test: {
    namespaced: true,
    state: {
      test: 'ya'
    },
    getters: {
      test: (state) => state.test
    }
  }
}

describe('LodgerStore', () => {
  describe('static use module', () => {
    describe('positive', () => {
      test('uses a test module', () => {
        LodgerStore.use(testModule)
        const store = new LodgerStore()
        const tGetter = store.getters['test/test']
        expect(tGetter).toBeDefined()
      })
    })
    
    describe('negative', () => {
      test('fails if invalid module supplied', () => {
        try {
          LodgerStore.use([])
        } catch (e) {
          expect(e).toBeDefined()
        }
      })
    })
  })

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

      test.each(taxonomies)('contains %s module (as taxonomy)', (s) => {
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
