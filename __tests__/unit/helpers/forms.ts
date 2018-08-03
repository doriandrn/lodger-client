import {
  toRxDBtype,
  pushFieldToSchema,
  toSchemaField
} from 'lodger/helpers/forms'

describe('Functii ajutatoare pt DB', () => {
  describe('toRxDBtype', () => {
    test('returneaza "string" daca e apelat fara parametru', () => {
      expect(toRxDBtype()).toBe('string')
    })

    test('returneaza "string" daca input-ul e nestiut', () => {
      expect(toRxDBtype('whatever')).toBe('string')
      expect(toRxDBtype('string')).toBe('string')
      expect(toRxDBtype(null)).toBe('string')
      expect(toRxDBtype(undefined)).toBe('string')
    })

    test('returneaza "number" pentru valorile aferente', () => {
      expect(toRxDBtype('date-time')).toBe('number')
      expect(toRxDBtype('bani')).toBe('number')
      expect(toRxDBtype('date')).toBe('number')
      expect(toRxDBtype('number')).toBe('number')
    })

    test('returneaza "array" pentru valorile aferente', () => {
      expect(toRxDBtype('furnizori')).toBe('array')
      expect(toRxDBtype('servicii')).toBe('array')
    })
  })

  describe('addFieldToCollectionScehma', () => {
    test('arunca daca e apelat fara unu din cei 2 parametri', () => {
      expect(() => { pushFieldToSchema() }).toThrow('parametri insuficienti')
    })

    test('arunca daca parametrii sunt diferiti de obiecte', () => {
      expect(() => { pushFieldToSchema(1, 2) }).toThrow('parametri incorecti')
      expect(() => { pushFieldToSchema(true, null) }).toThrow('parametri insuficienti')
      expect(() => { pushFieldToSchema('bam bam', []) }).toThrow('parametri incorecti')
    })

  })

  describe('toSchemaField', () => {
    const id = 'un field random'
    const testField = toSchemaField({ id })
    test('arunca daca - campul n-are ID', () => {
      expect(() => { toSchemaField({}) }).toThrow('camp fara id')
    })

    test('obiectul returnat are cheia = id', () => {
      expect(Object.keys(testField)[0]).toBe(id)
    })

    test('converteste tipul', () => {
      expect(toSchemaField({
        id,
        type: 'bani'
      })[id].type).toBe('number')
    })

    test('adauga referinta (ref) daca e data', () => {
      const fieldCuReferinta = {
        id,
        ref: 'altaColectie'
      }
      const fieldCuReferintaTransformat = toSchemaField(fieldCuReferinta)[id]
      expect(fieldCuReferintaTransformat).toHaveProperty('ref')

      expect(typeof fieldCuReferintaTransformat.ref).toBe('string')
      expect(fieldCuReferinta.ref.ref).toBeUndefined()
    })

    test('exclude cheile fara valoare / cu undefined', () => {
      Object.values(testField[id]).forEach(field => {
        expect(field).toBeDefined()
      })
    })
  })
  
  // describe('makeCollection', () => {
  //   const formData = {
  //     name: singular,
  //     campuri: [],
  //     metode: {
  //       test: () => {}
  //     }
  //   }
  //   const colectie = makeCollection(formData)
  //   console.info('colectie dupa makeCollection', colectie)
  //   test('arunca daca e apelata fara parametru/i', () => {
  //     expect(() => { makeCollection() }).toThrow()
  //   })

  //   test('face colectie', () => {
      
  //     expect(colectie.schema).toBeDefined()
  //   })
  //   test('numele colectiei e la plural, al formularului la singular', () => {
  //     expect(colectie.name !== formData.name).toBeTruthy()
  //   })

  //   test('pune metodele definite in form', () => {
  //     expect(colectie.methods.test).toBeDefined()
  //   })
  // })
})
