import { LodgerForm } from "../../types/forms"

/**
 * DO NOT CHANGE ANY OF THESE
 * as existing tests run on them
 * 
 * Rather, create new / extend the stubs / vars and export them
 */
const name = 'xx'
const plural = 'xxs'

const fields = [
  { id: 'x1' },
  { id: 'x2', required: true },
  { id: 'x3' }
]
const fieldsWithExcludedItems = [
  ...fields,
  { id: 'x4', notInDb: true },
  { id: 'x5', notInDb: true, required: true }
]

/**
 * Exports go here
 */
const stub1: LodgerForm = {
  name,
  plural,
  fields
}
const stub2: LodgerForm = {
  name,
  fields: fieldsWithExcludedItems,
  plural
}

export {
  name,
  plural,
  fields,
  fieldsWithExcludedItems,
  stub1,
  stub2
}
