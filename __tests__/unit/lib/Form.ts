import { Form, Errors } from 'lodger/lib/Form'

import { Fields } from 'lodger/typings/forms'
import { stub1, stub2, fields, name } from 'lodger/forms/__stubs__/playground'

describe('Form', () => {
  const __stub1__ = new Form(stub1)
  const __stub2__ = new Form(stub2)

  describe('new (form: LodgerForm)', () => {
    describe('Invalid form(s)', () => {
      const name = 'aFormName'
      test('throws if fields is empty', () => {
        const fields: Fields = []
        expect(() => new Form({ name, fields })).toThrow(Errors.noData)
      })
    })

  })

  describe('schema (getter)', () => {
    
    test('schema is defined', () => {
      const { schema } = __stub1__
      expect(schema).toBeDefined()
    })

    test('schema title matches name', () => {
      const { schema } = __stub1__
      expect(schema.title).toBe(name)
    })

    test('matches fields length', () => {
      const { schema } = __stub1__
      const keys = Object.keys(schema.properties)
      expect(keys.length).toBe(fields.length)
    })

    describe('.required[]', () => {
      const { schema } = __stub2__
      const { required } = schema
      console.log(schema, typeof schema)

      test('adds required fields', () => {
        expect(required).toContain('x2')
        expect(required).not.toContain('x5')
      })

      test('does NOT contain duplicates', () => {
        expect(required).toEqual(['x2'])
      })
    })

    test('excludes fields that have the notInDb property', () => {
      const { schema: { properties } } = __stub2__
      expect(properties).not.toHaveProperty('x5')
    })
  })

  describe('collection (getter)', () => {
    test('makes collection', () => {
      const { collection } = __stub1__
      console.log(collection)
      expect(collection).toBeDefined()
    })
  })

  describe('static .loadByName - Loads a form by name', () => {
    describe('invalid forms', () => {
      test('throws for unknown filenames', () => {
        expect(() => Form.loadByName('ceva')).toThrow(Errors.invalidRequested)
      })
    })
    describe('valid forms', () => {
      test('returns a fully inited <Form> if found and ok', () => {
        const form = Form.loadByName('valid')
        expect(form.name).toBe('valid')
      })
    })
  })
})
