import {
  toDBtype,
  makeCollection,
  getFormData,
  collectionSchemaInitial,
  addFieldToColSchema,
  toCollectionField
} from '../../../lodger/helpers/db'

describe('Functii ajutatoare pt DB', () => {
  describe('toDBtype', () => {
    test('returneaza "string" daca e apelat fara parametru', () => {
      expect(toDBtype()).toBe('string')
    })

    test('returneaza "number" pentru valorile aferente', () => {
      expect(toDBtype('date-time')).toBe('number')
      expect(toDBtype('bani')).toBe('number')
      expect(toDBtype('date')).toBe('number')
    })

    test('returneaza "array" pentru valorile aferente', () => {
      expect(toDBtype('furnizori')).toBe('array')
      expect(toDBtype('servicii')).toBe('array')
    })
  })

  describe('getFormData', () => {
    test('incarca si returneaza datele formului in functie de cheie', () => {
      const formAsociatie = getFormData('asociatie')
      expect(formAsociatie.campuri).toBeDefined()
    })

    test('arunca daca e cerut fara parametru', () => {
      expect(() => { getFormData() }).toThrow()
    })

    test('arunca daca numele fisierului cerut nu poate fi gasit', () => {
      expect(() => { getFormData('unfisiercarenuexista') }).toThrow()
    })
  })

  describe('collectionSchemaInitial', () => {
    const schemaColectieAsociatie = collectionSchemaInitial('numeColectie')

    test('arunca daca e apelata fara nume', () => {
      expect(() => { collectionSchemaInitial() }).toThrow()
    })

    test('returneaza elementele default ale unei scheme pt. colectie', () => {
      
      expect(typeof schemaColectieAsociatie.properties).toBe('object')
      expect(schemaColectieAsociatie.name).toBe('numeColectie')
      expect(typeof schemaColectieAsociatie.properties).toBe('object')
    })

    test('contine cheia "required" pt elementele necesare', () => {
      expect(schemaColectieAsociatie.required).toBeDefined()
      expect(schemaColectieAsociatie.required instanceof Array).toBeTruthy()
    })
  })

  describe('describeFieldForCollectionScehma', () => {
    test('arunca daca e apelat fara unu din cei 2 parametri', () => {
      expect(() => { addFieldToColSchema() }).toThrow('parametri insuficienti')
    })

    test('arunca daca parametrii sunt diferiti de obiecte', () => {
      expect(() => { addFieldToColSchema(1, 2) }).toThrow('parametri incorecti')
      expect(() => { addFieldToColSchema(true, null) }).toThrow('parametri insuficienti')
      expect(() => { addFieldToColSchema('bam bam', []) }).toThrow('parametri incorecti')
    })

  })

  describe('toCollectionField', () => {
    test('arunca daca - campul n-are ID', () => {
      expect(() => { toCollectionField({}) }).toThrow('camp fara id')
    })
  })
  
  describe('makeCollection', () => {
    test('arunca daca e apelata fara parametru/i', () => {
      expect(() => { makeCollection() }).toThrow()
    })

    // test()
  })
})
