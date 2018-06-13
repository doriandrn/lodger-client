import collections from '../../lodger/db/collections'
import { traverse } from '../../lodger/helpers/functions'

describe('Colectiile', () => {
  test('se instantiaza', () => {
    expect(collections).toBeDefined()
  })

  test('campurile nu contin valori nedefinite', () => {
    traverse(collections, (k, v) => {
      if (v === undefined) console.error(`${k} nu are valoare: ${v}`)
      expect(v !== undefined).toBeTruthy()
    })
  })
})
