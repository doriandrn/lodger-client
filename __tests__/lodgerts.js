import Lodger from '../lodger/index.ts'
import { definitii } from '../lodger/definitii'
import * as lodgerConfig from '../lodger/config/index'
import { isRxDocument, isRxCollection } from 'rxdb'

import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

let lodger
// const store = new Vuex.Store({
//   plugins: [Lodger.injectStore()]
// })
// Lodger.use(store)

beforeAll(async () => {
  lodger = await Lodger.build(lodgerConfig)
  console.log(lodger)
  console.log(Object.getOwnPropertyNames(lodger))
})

describe('ZA NEW LODGER', () => {

  describe('Pluginuri - .use()', () => {
    test('metoda e definita', () => {
      expect(Lodger.use).toBeDefined()
    })

    test('arunca daca nu e obiect', () => {
      expect(() => { Lodger.use('caca') }).toThrow('Definitie plugin incorectă')
    })

    test('foloseste un plugin', () => {
      const name = 'unPluginPtLodger'
      const plugin = { name }

      Lodger.use(plugin)
      expect(lodger[name]).toBeDefined()
    })
  })

  describe('Initializare', () => {
    test('Getter-ul indica ok', () => {
      expect(lodger.initializat).toBeTruthy()
    })

    test('Se conecteaza la DB', () => {
      expect(lodger._db).toBeDefined()
    })

    test('Se instaleaza ca plugin pt Vuex', () => {

      expect(store).toBeDefined()
    })
  })

  // describe('Vuex plugin', () => {
  //   // test('se ')
  // })

  describe('API -- CRUD (more lik CU R D)', () => {
    let testId = null

    describe('CU - Adauga / modifca / updateaza, 3 la 10lei', () => {
      test('arunca daca parametru nu este obiect', async () => {
        await expect(lodger.adauga('asociatie')).rejects.toThrow('parametri incorecti')
        await expect(lodger.adauga(12)).rejects.toThrow('parametri incorecti')
        await expect(lodger.adauga()).rejects.toThrow('parametri incorecti')
      })

      test('arunca daca taxonomia ({ ce }) este nedefinita', async () => {
        await expect(lodger.adauga({ name: 'ceva' })).rejects.toThrow()
      })

      test('arunca daca taxonomia ({ ce }) nu este in definitii', async () => {
        await expect(lodger.adauga({ ce: 'masina' })).rejects.toThrow('taxonomie incorecta')
      })

      test('arunca daca e cerut doar cu taxonomia ({ ce })', async () => {
        await expect(lodger.adauga({ ce: 'asociatie' })).rejects.toThrow('parametri insuficienti')
      })

      test('arunca daca schema nu se potriveste', async () => {
        // cheia nume nu exista, e 'name'
        const obiectGresit = {
          ce: 'asociatie',
          nume: 'lola'
        }
        await expect(lodger.adauga(obiectGresit)).rejects.toThrow()
      })

      test('Adauga o asociatie', async () => {
        const dateAsociatie = {
          ce: 'asociatie',
          name: 'lola'
        }
        const asociatie = await lodger.adauga(dateAsociatie)
        testId = asociatie._id
        expect(isRxDocument(asociatie)).toBeTruthy()
        expect(asociatie._id).toBeDefined()
        expect(asociatie.name).toBe('lola')
      })

      test('Dupa adaugare, se comite mutatia de ultim', () => {
        console.error('STORE', store.getters.asociatie)
        expect(store.getters.asociatie.ultima).toBe(testId)
      })

      test('Modifica asociatia', async () => {
        if (!testId) fail('id-ul nu e ok')
        const name = 'lolaModificata'
        const dateAsociatie = {
          ce: 'asociatie',
          name,
          _id: testId
        }
        const asociatie = await lodger.adauga(dateAsociatie)
        expect(asociatie._id).toBe(testId)
        expect(asociatie.name).toBe(name)
      })
    })

    describe('R -', () => {
      test('listeaza asociatiile administrate', async () => {
        const asociatii = await lodger.asociatii()
        expect(asociatii).toBeDefined()
        expect(typeof asociatii).toBe('object')
        console.error(asociatii)
      })

      test('asociatiile listate sunt limitate la limita definita in config sau query', async () => {
        const asociatii = await lodger.asociatii()
        expect(Object.keys(asociatii).length).toBeLessThan(25)
      })

      test('contine id-ul recent adaugat', async () => {
        const getter = await lodger.asociatii({ _id: testId })
        console.info('g', getter)
        expect(getter[testId]._id).toBe(testId)
      })
    })

    describe('Carlige', () => {

    })
  })

})

afterAll(async () => {
  if (!lodger) return
  lodger.destroy()
})
