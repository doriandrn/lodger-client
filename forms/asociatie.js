const campuri = [
  {
    id: '_id',
    notInDb: true,
    notInForm: true,
    value: g => g['asociatie/activa']._id
  },
  {
    id: 'name',
    required: true,
    focus: true,
    index: true,
    value: g => g['asociatie/activa'].name,
    v: 'max:32|min:3',
    transform: 'capitalize'
  },
  {
    id: 'idN',
    value: g => g['asociatie/activa'].idN
  },
  {
    id: 'balanta',
    type: 'number',
    value: g => g['asociatie/activa'].balanta,
    notInAddForm: true,
    notInForm: true
  },
  {
    id: 'incasari',
    type: 'array',
    ref: 'incasari',
    value: g => g['asociatie/activa'].incasari,
    notInForm: true
  },
  {
    id: 'utilizatori',
    type: 'array',
    ref: 'utilizatori',
    value: g => g['asociatie/activa'].utilizatori,
    notInForm: true
  },
  {
    id: 'servicii',
    type: 'array',
    ref: 'servicii',
    value: g => g['asociatie/activa'].servicii,
    notInForm: true
  },
  {
    id: 'furnizori',
    type: 'array',
    ref: 'furnizori',
    value: g => g['asociatie/activa'].furnizori,
    notInForm: true
  },
  {
    id: 'filtreCheltuieli',
    value: g => g['asociatie/activa'].filtreCheltuieli,
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
  }
}

// DRY: la buatoane, daca au 'click', n-au nevoie de id
const setari = {
  date: {
    campuri: [
      {
        type: 'button',
        click: 'backupDb',
      },
      {
        type: 'button',
        click: 'importDb'
      }
    ]
  },
  periculoase: {
    avansat: true,
    campuri: [
      {
        type: 'button',
        click: 'sterge',

      }
    ]
  },
}

export { campuri, actiuni, metode, setari }
