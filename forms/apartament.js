export const campuri = [
  {
    id: 'nr',
    label: 'apartament.nr',
    type: 'number',
    default: 1,
    required: true
  },
  {
    id: 'suprafata',
    label: 'apartament.suprafata',
    type: 'number',
    default: 0.01,
    step: 0.01
  },
  {
    id: 'locatari',
    label: 'apartament.locatari',
    type: 'number',
    default: 0,
    min: 0,
    max: 10,
  },
  {
    id: 'proprietar',
    label: 'apartament.proprietar',
    placeholder: 'Ion Barbu'
  },
  {
    id: 'etaj',
    type: 'number',
    label: 'aparatment.etaj',
    required: true,
    slot: 'footer'
  },
  {
    id: 'bloc',
    label: 'apartament.bloc',
    required: true,
    slot: 'footer'
  },
  {
    id: 'scara',
    label: 'apartament.scara',
    required: true,
    slot: 'footer'
  },
  {
    id: 'balanta',
    label: 'apartament.balanta',
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
    let plati = this.plati || []
    this.balanta += data.suma
    plati.push(data.id)
    this.plati = plati
    await this.save()
  }
}
