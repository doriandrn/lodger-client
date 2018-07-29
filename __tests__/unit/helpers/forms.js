import { Form } from 'lodger/helpers/forms'

describe('Form', () => {
  describe('new Form()', () => {
    test('construieste dupa nume', () => {
      const taxonomie = 'asociatii'
      const asociatii = new Form(taxonomie)
      expect(asociatii.name).toBe(taxonomie)
    })
  })
})
