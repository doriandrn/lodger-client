import Debug from 'debug'
import { defs } from 'lodger'
// const fs = require('fs')

const debug = Debug('lodger:db:collections')

const cols = []

const makeCollection = data => {
  const { key, value } = data
  const cachedSchemaFileName = `cache-schema-${key}`
  let cachedSchema = null
  let version = 0
  let foundCachedProperties = []

  // try {
  //   let collectionCache = localStorage.getItem(cachedSchemaFileName)
  //   if (collectionCache && collectionCache.length > 0) {
  //     // check obj keys against one another
  //     collectionCache = JSON.parse(collectionCache)
  //     foundCachedProperties = Object.keys(collectionCache.properties)
  //     version = collectionCache.version
  //     cachedSchema = collectionCache
  //   }
  // } catch (e) {
  //   console.info('dat smell of a fresh DB :)')
  // }

  const form = require(`forms/${key}`)
  const { campuri, metode } = form
  const getType = type => {
    if (!type || ['text', 'textarea', 'select', 'search'].indexOf(type) > -1) return 'string'
    if (['date-time', 'bani'].indexOf(type) > -1) return 'number'
    if (['scari', 'servicii', 'furnizori', 'contactFields'].indexOf(type) > -1) return 'array'
    return type
  }

  const schema = {
    name: key,
    type: 'object',
    autoMigrate: true,
    properties: {},
    required: [],
    migrationStrategies: {}
  }
  let versionMustIncrease = false

  Object.values(form.campuri).forEach(formItem => {
    const { id, type, required, primary, step, encrypted, index, ref, indexRef } = formItem

    // this is new from previous schema
    if (foundCachedProperties.length > 0 && foundCachedProperties.indexOf(id) < 0) {
      debug('FOUND NEW ID', id)
      schema.migrationStrategies[version] = function (oldDoc) {
        oldDoc[id] = undefined
        return oldDoc
      }
      versionMustIncrease = true
    }

    schema.properties[id] = { type: getType(type) }
    if (primary) Object.assign(schema.properties[id], { primary })
    if (index) Object.assign(schema.properties[id], { index })
    if (encrypted) Object.assign(schema.properties[id], { encrypted })
    if (ref) {
      const x = { ref, items: { type: 'string' } }
      if (indexRef) Object.assign(x, { index: true })
      Object.assign(schema.properties[id], x)
    }
    if (step) Object.assign(schema.properties[id], { multipleOf: step })
    if (required) schema.required.push(id)
  })

  // if (versionMustIncrease) version += 1
  Object.assign(schema, { version })

  // localStorage.setItem(cachedSchemaFileName, JSON.stringify(schema))
  // fs.writeFile(cachedSchemaFileName, `export default { ${schema} }`, err => {
  //   if (err) throw err
  // })

  return {
    name: value,
    schema,
    methods: metode
  }
}

for (let [key, value] of defs) {
  cols.push(makeCollection({ key, value }))
}

export default cols
