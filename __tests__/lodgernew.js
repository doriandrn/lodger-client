import Lodger from '../lodger/index'
import * as lodgerConfig from '../lodger/config'

import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

describe('ZA NEW LODGER', () => {
  let lodger
  beforeAll(async () => {
    lodger = await Lodger.build(lodgerConfig)
    console.error(lodger)
  })

  describe('Initializare', () => {
    test('Getter-ul indica ok', () => {
      expect(lodger.initializat).toBeTruthy()
    })

    test('Se conecteaza la DB', () => {
      expect(lodger._db).toBeDefined()
    })
  })

  // describe('Vuex plugin', () => {
  //   // test('se ')
  // })

  describe('API', () => {
    describe('CRUD', () => {
      test('singularul e getter', () => {
        expect(lodger.asociatie).toBeDefined()
        expect(lodger.asociatie.adauga).toBeDefined()
        console.info(lodger.asociatie.adauga)
      })

      test('Adauga', async () => {
        const dateAsociatie = {
          name: 'lola'
        }
        const asociatie = await lodger.asociatie.adauga(dateAsociatie)
        expect(asociatie.name).toBe('lola')
      })
      test('listeaza asociatiile administrate', () => {
        expect(lodger.asociatii).toBeDefined()
      })
    })
  })

  afterAll(async () => {
    if (!lodger) return
    lodger.destroy()
  })
})
