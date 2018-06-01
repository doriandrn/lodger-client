const getter = 'asociatie/activa'
const modalOpen = 'modal/open'
const modalContent = 'modal/content'

const campuri = [
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
  {
    id: 'idN',
    value: g => g[modalOpen] && g[modalContent] === 'asociatie.new' ? null : g[getter].idN,
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
  }
]

const actiuni = {
  confirm: 'adaugaAsociatie'
}

const metode = {
  async initBalanta (data) {
    this.balanta = data.balanta
    await this.save()
  },
  async incaseaza (data) {
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
  async UPDATEAZA (campuri) {
    // TODO: nu permite updatarea anumitor chei
    Object.keys(campuri).forEach(camp => {
      this[camp] = campuri[camp]
    })
    await this.save()
  }
}

// DRY: la buatoane, daca au 'click', n-au nevoie de id
const setari = {
  date: {
    campuri: [
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
    campuri: [
      {
        type: 'button',
        click: 'sterge'
      }
    ]
  },
}

export { campuri, actiuni, metode, setari }
