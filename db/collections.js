import Debug from 'debug'
import { defs } from 'db/_defs'
import FS from 'file-saver'

const debug = Debug('lodger:db:collections')

const cols = []

const makeSchemaFromForm = ({ name, shortname }) => {
  let hasChanged = false
  const form = require(`forms/${shortname}s`)
  // if (!require(`forms/${shortname}s.cache.js`)) {
  //   // FS.saveAs(form, `forms/${shortname}s.cache.js`)
  // } else {
  //   // do a deep check
  //   const previousForm = require(`forms/${shortname}s.cache.js`)
  //   const nowFormCampuri = Object.values(form.campuri).map(o => o.id)
  //   const prevFormCampuri = Object.values(previousForm.campuri).map(o => o.id)
  //   debug('NFC', nowFormCampuri, 'PFC', prevFormCampuri)
  //   if (nowFormCampuri !== prevFormCampuri) hasChanged = true
  //   if (hasChanged) debug('HAS CHANGED')
  // }

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

for (let [key, value] of defs) {
  const shortname = (() => {
    switch (key) {
      default: return key
      case 'asociatie': return 'asoc'
      case 'apartament': return 'ap'
    }
  })()

  cols.push({
    name: value,
    schema: makeSchemaFromForm({ name: key, shortname }),
    methods: {}
  })
}

export default cols
