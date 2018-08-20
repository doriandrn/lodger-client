import { version } from './package.json'

type LodgerConfig = {
  version: number,
  taxonomii: {
    defaults: {
      criteriu: Criteriu
    },
    [k: string]: {
      criteriu: Criteriu
    }
  }
}

const taxonomii = {
  defaults: {
    criteriu: {
      limit: 25,
      index: 0,
      sort: {},
      find: null
    }
  },
  asociatie: {
    criteriu: {
      limit: 100
    }
  }
}

const config: LodgerConfig = {
  version,
  taxonomii
}

export default config
