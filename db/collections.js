import Debug from 'debug'
import { defs } from 'db/_defs'
import FS from 'file-saver'

const debug = Debug('lodger:db:collections')

const cols = []

const makeCollection = data => {
  const { key, value } = data
  const form = require(`forms/${key}`)
  const { campuri, metode } = form
  const getType = type => {
    if (!type || ['text', 'textarea', 'select', 'search'].indexOf(type) > -1) return 'string'
    if (['date-time'].indexOf(type) > -1) return 'number'
    return type
  }

  const schema = {
    name: key,
    version: 0,
    type: 'object',
    autoMigrate: true,
    properties: {},
    required: []
  }

  Object.values(form.campuri).forEach(formItem => {
    const { id, type, required, primary, step } = formItem
    schema.properties[id] = {
      type: getType(type)
    }
    if (primary) Object.assign(schema.properties[id], { primary })
    if (step) Object.assign(schema.properties[id], { multipleOf: step })
    if (required) schema.required.push(id)
  })

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
