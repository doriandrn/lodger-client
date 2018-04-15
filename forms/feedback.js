export const campuri = [
  {
    id: 'tip',
    type: 'select',
    options: ['defect', 'imbunatatire', 'feature', 'altceva'],
    // options: {
    //   bug: 'Raportez un defect',
    //   improvement: 'Vreau o îmbunătățire',
    //   feature: 'Vreau o funcționalitate',
    //   other: 'Altceva, legat de funcționalitatea aplicației'
    // },
    default: 'bug'
  },
  {
    id: 'mesaj',
    type: 'textarea',
    placeholder: 'Părerea / Sugestia / Critica ta'
  }
]

export const actiuni = {
  confirm: 'trimiteFeedback'
}
