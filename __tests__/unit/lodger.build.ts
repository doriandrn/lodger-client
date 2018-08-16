import { Lodger } from '../lodger/index'
import Debug from 'debug'

Debug.enable('lodger:*')

describe('static build', () => {
  test('runs with no options / arguments', async () => {
    const lodger = await Lodger.build()
    expect(lodger).toBeDefined()
    await lodger.destroy()
  })
  test('overwrites allowed build options', async () => {
    const options = {
      dbCon: {
        name: 'lodgerica',
        adapter: 'memory'
      }
    }
    const lodger = await Lodger.build(options)
    expect(lodger).toBeDefined()
    await lodger.destroy()
  })
})
