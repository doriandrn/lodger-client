const remoteURL = 'http://localhost:10101/'

const dbCon = {
  name: 'lodger32',
  password: '10dg3rP@55',
  adapter: process.env.NODE_ENV === 'test' ? 'memory' : 'idb',
  multiInstance: false
  // adapter: 'memory',
  // ignoreDuplicate: true
}

export { remoteURL, dbCon }
