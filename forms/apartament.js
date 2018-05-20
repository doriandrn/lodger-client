export const campuri = [
  {
    id: '_id',
    notInDb: true, // skip it's already defiend by rxdb
    notInForm: true,
    value: g => g['apartament/selectat']._id
  },
  {
    id: 'nr',
    type: 'number',
    default: g => {
      //TODO: numerotare pentru hoteluri, 101 et 1, 201 et 2
      const bloc = g['etaj/selectat'].bloc

      if (!bloc) return 1
      const ultimulApAdaugat = g['apartament/ultim']

      if (!ultimulApAdaugat || bloc !== ultimulApAdaugat.bloc) {
        const apsBloc = Object.values(g.apartamente).filter(ap => ap.bloc === bloc)
        if (!apsBloc || !apsBloc.length) return 1
        return Number(apsBloc.sort((a, b) => a.nr > b.nr).reverse()[0].nr) + 1
      }
      return Number(ultimulApAdaugat.nr) + 1
    },
    value: g => g['apartament/selectat'].nr,
    required: true
  },
  {
    id: 'proprietar',
    placeholder: 'Ion Barbu',
    transform: 'capitalize',
    value: g => g['apartament/selectat'].proprietar
  },
  {
    id: 'suprafata',
    type: 'number',
    default: null, // TODO: ia de la apartamentul de la etajul de dedesubt, in functie de cate ap sunt
    step: 0.01,
    value: g => g['apartament/selectat'].suprafata
  },
  {
    id: 'locatari',
    type: 'number',
    default: 2,
    min: 0,
    max: 10,
    value: g => g['apartament/selectat'].locatari
  },
  {
    id: 'camere',
    type: 'number',
    default: 2,
    max: 12,
    min: 1,
    value: g => g['apartament/selectat'].camere
  },
  {
    id: 'etaj',
    type: 'number',
    required: true,
    notInForm: true,
    default: g => g['etaj/selectat'].etaj,
    value: g => g['apartament/selectat'].etaj
  },
  {
    id: 'bloc',
    required: true,
    notInForm: true,
    default: g => g['etaj/selectat'].bloc,
    value: g => g['apartament/selectat'].bloc
  },
  {
    id: 'scara',
    type: 'number',
    required: true,
    notInForm: true,
    default: g => g['etaj/selectat'].scara,
    value: g => g['apartament/selectat'].scara
  },
  {
    id: 'balanta',
    type: 'bani',
    default: null,
    value: g => g['apartament/selectat'].balanta
  },
  {
    id: 'contoare',
    type: 'contoare',
    value: g => g['apartament/selectat'].contoare
  },
  {
    id: 'incasari',
    type: 'array',
    notInForm: true,
    ref: 'incasari'
  },
  {
    id: 'datorii',
    type: 'array',
    notInForm: true,
    ref: 'cheltuieli'
  }
]

export const actiuni = {
  confirm: 'adaugaAp'
}

export const metode = {
  async incaseaza (data) {
    if (!this.balanta) this.balanta = 0
    let incasari = this.incasari || []
    this.balanta += data.suma
    incasari.push(data.id)
    this.incasari = incasari
    await this.save()
  }
}
