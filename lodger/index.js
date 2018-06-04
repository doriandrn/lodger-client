import { traverse, no$ } from './helpers/functions'
import ldgSchema from './schema'

const notificari = {}
ldgSchema.notificari.forEach(type => {
  notificari[type] = ({ dispatch }) => ({ text, heading }) => {
    dispatch('@@toast/ADD_TOAST_MESSAGE', { type, heading, text })
  }
})

const searchables = {}
const defs = new Map()

traverse(ldgSchema, (k, v) => {
  if (v._cheiCautare && v._cheiCautare.length > 0) searchables[no$(k)] = v._cheiCautare
  if (v._singular) defs.set(v._singular, no$(k))
})

export { searchables, notificari, defs }
