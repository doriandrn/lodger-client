import Db from '../../lodger/db/index'

describe('DB', () => {
  test('se initializeaza fara nimic', async () => {
    const emptyDb = await Db()
    expect(emptyDb).toBeDefined()
    await emptydb.destroy()
  })
})
