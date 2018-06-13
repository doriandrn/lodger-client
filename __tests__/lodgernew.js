import Lodger from '../lodger/index'

describe('ZA NEW LODGER', () => {
  let lodger
  beforeAll(async () => {
    lodger = await Lodger.build()
    // console.info(lodger)
  })

  describe('1. Initializare', () => {
    test('Getter-ul indica ok', () => {
      expect(lodger.initializat).toBeTruthy()
    })

    test('Se conecteaza la DB', () => {
      expect(lodger._db).toBeDefined()
    })

    test('Definitiile se fac dupa schema', () => {
      const { definitii } = lodger
      expect(definitii instanceof Map).toBeTruthy()
      expect(definitii.size).toBeGreaterThan(0)
    })

    test('Helper-ul de cautare se populeaza', () => {
      const { helperCautare } = lodger
      expect(helperCautare).toBeDefined()
      expect(helperCautare.apartamente).toBeDefined()
    })

    // test('Functia de notificare', () => {
    //   const { notifica } = lodger
    //   expect(typeof notifica).toBe('function')
    // })
  })
})
