import { Collection } from 'lodger/lib/Collection'
import { Form } from '../../../lodger/lib/Form';

describe('Collection', () => {
  test('throws if called with invalid schema', () => {
    expect(() => { new Collection(Form.loadByName('xxx')) }).toThrow()
  })
})
