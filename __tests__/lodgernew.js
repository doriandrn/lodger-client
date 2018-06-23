import Lodger from '../lodger/index'
import { definitii } from '../lodger/definitii'
import * as lodgerConfig from '../lodger/config'
import { isRxDocument, isRxCollection } from 'rxdb'

import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

let lodger
let store

beforeAll(async () => {
  lodger = await Lodger.build(lodgerConfig)
  store = new Vuex.Store({
    plugins: [lodger.injectStore()]
  })
  console.log(lodger)
  console.log(Object.getOwnPropertyNames(lodger))
})

describe('ZA NEW LODGER', () => {

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

  describe('API  CRUD  CU R D', () => {
    let testId = null

    describe('CU - Adauga / modifca / updateaza, 3 la 10lei', () => {
      test('arunca daca parametru nu este obiect', async () => {
        await expect(lodger.adauga('asociatie')).rejects.toThrow('parametri incorecti')
      })

      test('arunca daca { ce } este nedefinit', async () => {
        await expect(lodger.adauga({ name: 'ceva' })).rejects.toThrow()
      })

      test('arunca daca { ce } este unul din definitii', async () => {
        await expect(lodger.adauga({ ce: 'masina' })).rejects.toThrow('taxonomie incorecta')
      })

      test('arunca daca nu contine mai multi parametri decat { ce }', async () => {
        await expect(lodger.adauga({ ce: 'asociatie' })).rejects.toThrow('parametri insuficienti')
      })

      test('arunca daca e o problema cu schema', async () => {
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
    
    describe('R -' , () => {
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
