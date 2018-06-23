import { 
  traverse,
  slugify,
  no$,
  spleet,
  criteriuDefault
} from '../../../lodger/helpers/functions'

describe('Functii ajutatoare', () => {
  describe('traverse', () => {
    test('traverseaza', () => {
      const obiect = {
        cheie: {
          cheie: {
            cheie: 'valoare'
          }
        }
      }
      const test = []
      traverse(obiect, (k, v) => {
        test.push(k)
      })
      expect(test.length).toBe(3)
    })
  })

  describe('slugify', () => {
    test('slugifica', () => {
      expect(slugify('Dorian haleste')).toBe('dorian-haleste')
      expect(slugify(32)).toBe('32')
    })
  })

  describe('criteriu default de cautare al taxonomiilor', () => {
    const cheiPrincipale = ['limit', 'index', 'sort', 'find']
    test('returneaza default-ul din config - pentru orice taxonomie daca nu e ceruta', () => {
      const getCriteriu = criteriuDefault()
      expect(getCriteriu).toBe('object')
      expect(Object.keys(getCriteriu)).toEqual(expect.arrayContaining(cheiPrincipale))
    })
  })

  describe('fara$', () => {
    test('scoate doar -$- de la inceput', () => {
      expect(no$('$test')).toBe('test')
      expect(no$('$$test')).toBe('test')
      expect(no$('test 4$')).toBe('test 4$')
    })
    test('nu afecteaza alta valoare', () => {
      expect(no$('test')).toBe('test')
      expect(no$(123)).toBe(123)
      expect(no$(null)).toBe(null)
    })
  })

  describe('spleet', () => {
    test('imparte stringu in 2', () => {
      const { mutation, what } = spleet('fa/CEVA')
      expect(mutation).toBe('CEVA')
      expect(what).toBe('fa')
    })
    test('nu merge cu stringuri incorecte', () => {
      const splt = spleet('caca')
      expect(splt).toBe('caca')
    })
  })
})
