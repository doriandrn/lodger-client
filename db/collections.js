import Debug from 'debug'
import { defs } from 'db/_defs'

const debug = Debug('db:collections')

const cols = []

const makeSchemaFromForm = ({ name, shortname }) => {
  const form = require(`forms/${shortname}s`)

  const schema = {
    name,
    version: 0,
    type: 'object',
    properties: {},
    required: []
  }

  Object.values(form.campuri).forEach(formItem => {
    const { id, type, required, primary } = formItem
    schema.properties[id] = {
      type: (!type || ['text', 'textarea', 'select'].indexOf(type) > -1 ? 'string' : type)
    }
    if (primary) Object.assign(schema.properties[id], { primary })
    if (required) schema.required.push(id)
  })

  debug('Schema', schema)
  return schema
}

Object.keys(defs).forEach(def => {
  const shortname = (() => {
    switch (def) {
      default: return def
      case 'asociatie': return 'asoc'
      case 'apartament': return 'ap'
    }
  })()
  console.log('shortname', shortname)
  cols.push({
    name: defs[def],
    schema: makeSchemaFromForm({ name: def, shortname }),
    methods: {}
  })
})

export default cols
