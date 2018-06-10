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

    test('returneaza "string" daca input-ul e nestiut', () => {
      expect(toDBtype('whatever')).toBe('string')

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
    const formAsociatie = getFormData('asociatie')

    test('incarca si returneaza datele formului in functie de cheie', () => {
      expect(formAsociatie.campuri).toBeDefined()
    })

    test('arunca daca e cerut fara parametru', () => {
      expect(() => { getFormData() }).toThrow()
    })

    test('arunca daca numele fisierului cerut nu poate fi gasit', () => {
      expect(() => { getFormData('unfisiercarenuexista') }).toThrow()
    })

    test('returneaza numele formularului', () => {
      expect(formAsociatie.name).toBe('asociatie')
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

  describe('addFieldToCollectionScehma', () => {
    test('arunca daca e apelat fara unu din cei 2 parametri', () => {
      expect(() => { addFieldToColSchema() }).toThrow('parametri insuficienti')
    })

    test('arunca daca parametrii sunt diferiti de obiecte', () => {
      expect(() => { addFieldToColSchema(1, 2) }).toThrow('parametri incorecti')
      expect(() => { addFieldToColSchema(true, null) }).toThrow('parametri insuficienti')
      expect(() => { addFieldToColSchema('bam bam', []) }).toThrow('parametri incorecti')
    })

    test('adauga un camp la schema.properties', () => {
      const schema = {}
      const id = 'test'
      addFieldToColSchema({ id }, schema)
      expect(schema.properties).toBeDefined()
      expect(schema.properties).toHaveProperty('id')
    })

    test('adauga un camp necesar la schema.required', () => {
      const schema = {}
      const id = 'test'
      addFieldToColSchema({ id, required: true }, schema)
      expect(schema.required).toBeDefined()
      expect(schema.required instanceof Array).toBeTruthy()
      expect(schema.required.indexOf(id)).toBeGreaterThan(-1)
    })

  })

  describe('toCollectionField', () => {
    const id = 'un field random'
    test('arunca daca - campul n-are ID', () => {
      expect(() => { toCollectionField({}) }).toThrow('camp fara id')
    })

    test('obiectul returnat are cheia = id', () => {
      const testField = toCollectionField({ id })
      expect(Object.keys(testField)[0]).toBe(id)
    })

    test('converteste tipul', () => {
      expect(toCollectionField({
        id,
        type: 'bani'
      })[id].type).toBe('number')
    })

    test('adauga referinta (ref) daca e data', () => {
      const fieldCuReferinta = {
        id,
        ref: 'altaColectie'
      }
      const fieldCuReferintaTransformat = toCollectionField(fieldCuReferinta)[id]
      expect(fieldCuReferintaTransformat).toHaveProperty('ref')

      expect(typeof fieldCuReferintaTransformat.ref).toBe('object')
    })
  })
  
  describe('makeCollection', () => {
    test('arunca daca e apelata fara parametru/i', () => {
      expect(() => { makeCollection() }).toThrow()
    })

    test('face colectie', () => {
      const formData = {
        name: 'unFormularLodger',
        campuri: [],
        metode: []
      }
      const colectie = makeCollection(formData)
      expect(colectie.schema).toBeDefined()
      expect(colectie.name).toBe(formData.name)
      expect(colectie.methods).toBe(formData.metode)
    })
  })
})
