import PouchDB from 'pouchdb'
import { remoteUrl } from '../../config/index'

const uberadmin = {
  name: 'dorian',
  password: 'xirix23x'
}

const user = uberadmin

const pouchOpts = {
  skip_setup: true,
  auth: {
    username: user.name,
    password: user.password
  }
}

const db = new PouchDB(remoteUrl, pouchOpts)

test('db inited', () => {
  expect(db).toBeDefined()
})

test('login works', () => {
  db.login(user.name, user.password, ajaxOpts).then(function () {
    console.log('db', db)
    expect(db.allDocs().toBeDefined())
    return db.allDocs()
  }).then(function (docs) {
    console.log(docs)
  }).catch(function (error) {
    console.error(error)
  })
})
