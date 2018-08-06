import { Schema, Errors } from 'lodger/lib/Schema'
import { Form } from 'lodger/lib/Form'

describe('Schema', () => {
  const name = 'dusnt matter'
  test('throws if called without a Form object', () => {
    expect(() => { new Schema() }).toThrow(Errors.invalidForm)
  })

  test('loads by name (static)', () => {
    const schema = new Schema(Form.loadByName('valid'))
    expect(schema).toBeDefined()
    expect(schema.required instanceof Array).toBeTruthy()
    expect(schema.title).toBe('valid')
  })

  test('overwrites default schema', () => {
    const form = {
      name,
      fields: [{ id: 'blabla' }]
    }

    const description = 'schema desc'
    const version = 1
    const schema = new Schema(new Form(form), { description, version })
    expect(schema.version).toBe(1)
    expect(schema.description).toBe(description)
  })

  test('internal: adds fields to "properties" property', () => {
    const id = "an id"
    const schema = new Schema(new Form({
      name,
      fields: [{ id }]
    }))
    expect(Object.keys(schema.properties)).toContain(id)
  })

  test('excludes the fields that have "notInDb" property', () => {
    const form = {
      name,
      fields: [{
        id: 'x',
        notInDb: true
      }]
    }
    const schema = new Schema(new Form(form))
    expect(schema.properties).toEqual({})
  })

  test('required fields get pushed to "required[]"', () => {
    const form = {
      name,
      fields: [
        { id: 'a' },
        { id: 'x', required: true },
        { id: 'y', required: true }]
    }
    const schema = new Schema(new Form(form))
    expect(schema.required).toEqual(['x', 'y'])
  })
})
