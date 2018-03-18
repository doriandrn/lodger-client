export const campuri = [
  {
    id: 'name',
    label: 'asocs.new.name',
    required: true,
    focus: true,
    primary: true
  },
  {
    id: 'idN',
    label: 'asocs.new.idN'
  },
  {
    id: 'balanta',
    label: 'asocs.balance',
    type: 'number',
    notInAddForm: true
  }
]

export const actiuni = {
  confirm: 'adaugaAsociatie'
}

export const metode = {
  async initBalanta (data) {
    console.log('DIS', this)
    this.balanta = data.balanta
    await this.save()
  }
}
