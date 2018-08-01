import { Form, FormErrors } from 'lodger/lib/Form'
import { Schema } from 'lodger/lib/Schema'
import { Fields } from 'lodger/typings/forms'

describe('Form', () => {
  describe('new Form()', () => {
    describe('Invalid form(s)', () => {
      const name = 'aFormName'
      test('throws if fields is empty', () => {
        const fields: Fields = []
        expect(() => new Form({ name, fields })).toThrow(FormErrors.noData)
      })
    })

  })

  describe('static .loadByName', () => {
    describe('invalid forms', () => {
      test('throws for unknown filenames', () => {
        expect(() => Form.loadByName('ceva')).toThrow(FormErrors.invalidRequested)
      })
    })
    describe('valid forms', () => {
      test('returns a fully inited <Form> if found and ok', () => {
        const form = Form.loadByName('valid')
        expect(form.name).toBe('valid')
        expect(form.fields.length).toBeGreaterThan(0)
      })
    })
  })
})

describe('Schema', () => {
  test('are metoda statica de la form', () => {
    const schema = Schema.loadByName('valid')
    expect(schema).toBeDefined()
    expect(schema.name).toBe('valid')
  })
})
