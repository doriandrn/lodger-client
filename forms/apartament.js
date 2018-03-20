export const campuri = [
  {
    id: 'nr',
    label: 'Nr',
    type: 'number',
    default: 1,
    required: true
  },
  {
    id: 'suprafata',
    label: 'suprafata',
    type: 'number',
    default: 0.01,
    step: 0.01
  },
  {
    id: 'locatari',
    label: 'locatari',
    type: 'number',
    default: 0,
    min: 0,
    max: 10,
  },
  {
    id: 'proprietar',
    label: 'proprietar',
    placeholder: 'Ion Barbu'
  },
  {
    id: 'etaj',
    type: 'number',
    label: 'etaj',
    required: true,
    slot: 'footer'
  },
  {
    id: 'bloc',
    label: 'bloc',
    required: true,
    slot: 'footer'
  },
  {
    id: 'scara',
    label: 'scara',
    required: true,
    slot: 'footer'
  },
  {
    id: 'balanta',
    label: 'balanta',
    type: 'bani',
    default: 0
  },
  {
    id: 'plati',
    label: 'apartament.plati',
    type: 'array',
    notInForm: true,
    ref: 'incasari'
  }
]

export const actiuni = {
  confirm: 'adaugaAp'
}

export const metode = {
  async incaseaza (data) {
    if (!this.balanta) this.balanta = 0
    if (!this.plati) this.plati = []
    this.balanta += data.suma
    this.plati.push(data.id)
    await this.save()
  }
}
