import { RxDatabaseCreator } from 'rxdb'

type BuildOptions = {
  dbCon: RxDatabaseCreator,
  usePersistedState?: boolean
  modules?: Module[]
}

type Module = {
  name: string
}

interface LodgerPlugin {
  name: string
}
