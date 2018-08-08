import { Lodger } from 'lodger/index'

describe('Lodger', () => {
  describe('static build', () => {
    test('runs with default config if no config supllied', async () => {
      const lodger = await Lodger.build()
      expect(lodger).toBeDefined()
    })
  })
})
