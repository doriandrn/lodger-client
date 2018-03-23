import { traverse, trm } from 'helpers/functions'

const ldgSchema = {
  $asociatii: {
    _singular: 'asociatie',
    $incasari: {
      _singular: 'incasare',
      _sortOptions: { la: -1 },
      _defaultLimit: 25
    },
    $cheltuieli: {
      _singular: 'cheltuiala',
      _sortOptions: { la: -1 },
      _defaultLimit: 25
    },
    $blocuri: {
      _singular: 'bloc',
      $apartamente: {
        _singular: 'apartament',
        _cheiCautare: ['nume', 'scara', 'nr', 'proprietar']
      }
    }
  },
  $servicii: {
    _singular: 'serviciu'
  },
  $furnizori: {
    _singular: 'furnizor',
    _cheiCautare: ['nume']
  },
  notificari: ['error', 'warn', 'info', 'success']
}

const notificari = {}
ldgSchema.notificari.forEach(type => {
  notificari[type] = (heading, text) => this.dispatch('@@toast/ADD_TOAST_MESSAGE', { type, heading, text })
})

const searchables = {}
const defs = new Map()

traverse(ldgSchema, (k, v) => {
  if (v._cheiCautare && v._cheiCautare.length > 0) searchables[trm(k)] = v._cheiCautare
  if (v._singular) defs.set(v._singular, trm(k))
})


export { ldgSchema, searchables, notificari, defs }
