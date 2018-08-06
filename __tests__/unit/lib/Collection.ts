import { Collection, Errors } from 'lodger/lib/Collection'
import { Schema } from 'lodger/lib/Schema'
import { Form } from '../../../lodger/lib/Form';

describe('Collection', () => {
  // test('throws if plural of name cannot be found', () => {
    
  // })

  test('throws if called with invalid schema', () => {
    expect(() => { new Collection(new Schema(Form.loadByName('xxx'))) }).toThrow()
  })

  test('throws if no name is supplied', () => {
    expect(() => { new Collection(new Schema(Form.loadByName('oligofreni'))) }).toThrow(Errors.noName)
  })

  test('builds a valid collection', () => {
    const col = new Collection(new Schema(Form.loadByName('valid')))
    // console.log('col:', col)
    console.log(col)
    expect(col.name).toBeDefined()
  })
})
