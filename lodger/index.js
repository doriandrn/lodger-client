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



export { searchables, notificari, defs }
