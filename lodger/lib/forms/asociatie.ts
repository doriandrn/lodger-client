const getter = 'asociatie/activa'
const modalOpen = 'modal/open'
const modalContent = 'modal/content'

const plural = 'asociatii'

const fields = [
  {
    id: '_id',
    notInDb: true,
    notInForm: true,
    value: g => g[modalOpen] && g[modalContent] === 'asociatie.new' ? null : g[getter]._id,
  },
  {
    id: 'name',
    required: true,
    focus: true,
    index: true,
    value: g => g[modalOpen] && g[modalContent] === 'asociatie.new' ? null : g[getter].name,
    v: 'max:32|min:3',
    transform: 'capitalize'
  },
  // Data adaugarii / when added
  {
    id: 'la',
    type: 'date-time',
    required: true, // for filters / sorts
    index: true
  },
  {
    id: 'organizatie',
    type: 'object'
    // v: 'ro=cif|en=ssn', //TODO: stringu e doar de demo -> implement cif validation
    // value: g => g[modalOpen] && g[modalContent] === 'asociatie.new' ? null : g[getter].idN,
  },
  {
    id: 'balanta',
    type: 'number',
    value: g => g[getter].balanta,
    notInAddForm: true,
    notInForm: true
  },
  {
    id: 'incasari',
    type: 'array',
    ref: 'incasari',
    value: g => g[getter].incasari,
    notInForm: true
  },
  {
    id: 'utilizatori',
    type: 'array',
    ref: 'utilizatori',
    value: g => g[getter].utilizatori,
    notInForm: true
  },
  {
    id: 'servicii',
    type: 'array',
    ref: 'servicii',
    value: g => g[getter].servicii,
    notInForm: true
  },
  {
    id: 'furnizori',
    type: 'array',
    ref: 'furnizori',
    value: g => g[getter].furnizori,
    notInForm: true
  },
  {
    id: 'filtreCheltuieli',
    value: g => g[getter].filtreCheltuieli,
    type: 'array',
    notInForm: true
  },
  {
    id: 'preferinte',
    value: g => g[getter].preferinte,
    type: 'object',
    notInForm: true
  }
]

const actiuni = {
  confirm: 'adaugaAsociatie'
}


const methods = <T>{
  async initBalanta (data: {balanta: Bani}) {
    this.balanta = data.balanta
    await this.save()
  },
  async incaseaza (data: Incasare) {
    if (!this.balanta) this.balanta = 0
    let incasari = this.incasari || []
    this.balanta += data.suma
    incasari.push(data.id)
    this.incasari = incasari
    await this.save()
  },
  async TOGGLE_SERVICIU (servicii) {
    this.servicii = servicii
    await this.save()
  },
  async UPDATEAZA (fields) {
    // TODO: nu permite updatarea anumitor chei
    Object.keys(fields).forEach(camp => {
      this[camp] = fields[camp]
    })
    await this.save()
  }
}

// DRY: la buatoane, daca au 'click', n-au nevoie de id
const setari = {
  date: {
    fields: [
      {
        type: 'button',
        click: 'exportDb',
      },
      {
        type: 'button',
        click: 'importDb'
      }
    ]
  },
  periculoase: {
    order: -1,
    avansat: true,
    fields: [
      {
        type: 'button',
        click: 'sterge'
      }
    ]
  },
}

export { fields, plural, actiuni, methods, setari }
