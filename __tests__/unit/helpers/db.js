import {
  toDBtype,
  makeCollection,
  getFormData,
  collectionSchemaInitial,
  addFieldToColSchema,
  toCollectionField
} from '../../../lodger/helpers/db'

const singular = 'asociatie'
const plural = 'asociatii'
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
    const formAsociatie = getFormData(singular, plural)

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
      expect(formAsociatie.name).toBe(singular)
    })
  })

  describe('collectionSchemaInitial', () => {
    const schemaColectieAsociatie = collectionSchemaInitial(singular)

    test('arunca daca e apelata fara nume', () => {
      expect(() => { collectionSchemaInitial() }).toThrow()
    })

    test('returneaza elementele default ale unei scheme pt. colectie', () => {
      expect(typeof schemaColectieAsociatie.properties).toBe('object')
    })

    test('returneaza singularul pentru nume', () => {
      expect(schemaColectieAsociatie.name).toBe(singular)
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
      expect(schema.properties[id]).toBeDefined()
    })

    test('adauga un camp necesar la schema.required', () => {
      const schema = {}
      const id = 'test'
      addFieldToColSchema({ id, required: true }, schema)

      expect(schema.properties.test.required).toBeDefined()
      expect(schema.required instanceof Array).toBeTruthy()
      expect(schema.required.indexOf(id)).toBeGreaterThan(-1)
    })

  })

  describe('toCollectionField', () => {
    const id = 'un field random'
    const testField = toCollectionField({ id })
    test('arunca daca - campul n-are ID', () => {
      expect(() => { toCollectionField({}) }).toThrow('camp fara id')
    })

    test('obiectul returnat are cheia = id', () => {
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

      expect(typeof fieldCuReferintaTransformat.ref).toBe('string')
      expect(fieldCuReferinta.ref.ref).toBeUndefined()
    })

    test('exclude cheile fara valoare / cu undefined', () => {
      Object.values(testField[id]).forEach(field => {
        expect(field).toBeDefined()
      })
    })
  })
  
  describe('makeCollection', () => {
    const formData = {
      name: singular,
      campuri: [],
      metode: {
        test: () => {}
      }
    }
    const colectie = makeCollection(formData)
    console.info('colectie dupa makeCollection', colectie)
    test('arunca daca e apelata fara parametru/i', () => {
      expect(() => { makeCollection() }).toThrow()
    })

    test('face colectie', () => {
      
      expect(colectie.schema).toBeDefined()
    })
    test('numele colectiei e la plural, al formularului la singular', () => {
      expect(colectie.name !== formData.name).toBeTruthy()
    })

    test('pune metodele definite in form', () => {
      expect(colectie.methods.test).toBeDefined()
    })
  })
})
