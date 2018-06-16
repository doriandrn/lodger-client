import Lodger from '../lodger/index'
import { definitii } from '../lodger/definitii'
import * as lodgerConfig from '../lodger/config'

import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

let lodger
beforeAll(async () => {
  lodger = await Lodger.build(lodgerConfig)
  console.log(lodger)
})

describe('ZA NEW LODGER', () => {

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

  describe('API  CRUD  CU R D', () => {

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

      test('Adauga o asociatie', async () => {
        const dateAsociatie = {
          ce: 'asociatie',
          name: 'lola'
        }
        const asociatie = await lodger.adauga(dateAsociatie)
        expect(asociatie._id).toBeDefined()
        expect(asociatie.name).toBe('lola')
      })
    })
    
    describe('R -' , () => {
      test('listeaza asociatiile administrate', () => {
        expect(lodger.asociatii).toBeDefined()
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
