<template lang="pug">
sction#init(v-if="idsAsociatii.length > 0")
  field(
    v-if=       "aDefMacarUnServiciu"
    type=       "radios",
    icon=       "hard-drive"
    id=         "initprgrs"
    v-model.number=    "initprgrs"
    :label=     "null"
    :options=   "initOptions"
    :required=  "true"
  )

  h1 {{ initMessage.titlu }}
  
  servicii(
    v-if=             "initprgrs === 0"
    @input=           "toggleServiciu",
    @stergeServiciu=  "stergeServiciu",
    @modificaServiciu="debug($event); openModal({ id: 'serviciu.edit', data: $event })"
    @serviciuNou=     "openModal('serviciu.new')",
    :servicii=        "servicii",
    :value=           "activa.servicii",
    :areAdauga=       "true"
  )

  ul.furnizori(v-else-if= "initprgrs === 1")
    furnizor(
      v-for=  "fId in Object.keys(furnizori)"
      :id=    "fId"
      :key=   "fId"
    )
    li.nou
      buton(
        icon= "plus-circle",
        @click="openModal('furnizor.new')"
      ) {{ $t('furnizor.new.title') }}

  
  blocuri(
    v-else-if=  "initprgrs === 2 && idsBlocuri.length"
    :blocuri=   "blocuri"
  )

  frm(
    v-else-if=  "initprgrs === 3"
    :formData=   "require('forms/initFinanc')"
  )
    p ultima incasare
    p facturi / cheltuieli active

  buton(
    v-else-if=  "initprgrs === 2 && !idsBlocuri.length"
    @click=    "openModal('bloc.new')"
  ) {{ $t('bloc.none.actions[0]') }}

  buton.init__next(
    :disabled=  "poateTreceLaUrmPas < 0"
    size=       "large"
    @click=     "initprgrs++"
    arrow=      "right"
  ) {{ initMessage.continue }}

empty(
  v-else
  size=     "large"
  _for=     "noasoc"
  :title=   "$t('asociatie.noneAdmind.heading')",
  :CTA=     "$t('asociatie.noneAdmind.CTA')",
  :actions= "{ newAsoc: $t('asociatie.noneAdmind.action') }"
  @action=  "openModal('asociatie.new')"
)
</template>

<script>
import sction from 'c/section'
import widget from 'c/widget'
import buton from 'form/button'
import blocuri from 'c/blocuri'
import frm from 'c/form.vue'
import empty from 'c/empty'
import dateTime from 'c/dateTime'
import split from 'c/split'

import bani from 'c/bani'
import servicii from 'c/servicii'
import field from 'form/field'
import furnizor from 'c/furnizor'

import typecheck from 'pg/widgets/typography'

import { mapGetters, mapActions } from 'vuex'

export default {
  data () {
    return {
      asociatieInitializata: true,
      toateEtajeleAuApartamente: false,
      initprgrs: -1,
    }
  },
  components: {
    blocuri,
    sction,
    split,
    bani,
    widget,
    buton,
    empty,
    field,
    frm,
    dateTime,
    servicii,
    furnizor,

    typecheck
  },
  computed: {
    poateTreceLaUrmPas () {
      const { initprgrs, aDefMacarUnServiciu, aDefMacarUnFurnizor, defineste } = this
      if (aDefMacarUnFurnizor) return 2
      if (aDefMacarUnServiciu) return 1
      if (initprgrs < 0) return 0
      return -1
    },
    initOptions () {
      const { poateTreceLaUrmPas } = this
      const pfix = 'asociatie.init'
      const pasi = {
        0: {
          id: 'servicii'
        },
        1: {
          id: 'furnizori'
        },
        2: {
          id: 'structura'
        },
        3: {
          id: 'financiar'
        }
      }

      // pasi inactivi
      Object.keys(pasi).forEach(pas => {
        if (pas > poateTreceLaUrmPas) {
          pasi[pas].disabled = true
        }
        pasi[pas].label = `${pfix}.${pasi[pas].id}.titlu`
        pasi[pas].desc = `${pfix}.${pasi[pas].id}.mesaj`
      })

      return pasi
    },

    initMessage () {
      const pfix = 'asociatie.init'
      const { initprgrs, $t } = this
      let str
      let _continue = 'asociatie.new.continuaInitializarea'

      switch (initprgrs) {
        case -1:
          _continue = `${pfix}.start.mesaj`
          break
        case 0: str = `${pfix}.servicii`; break
        case 1: str = `${pfix}.furnizori`; break
        case 2: str = `${pfix}.structura`; break
        case 3:
          str = `${pfix}.financiar`
          _continue = $t('asociatie.new.confirmStruct')
          break
      }

      const titlu = str ? $t(`${str}.titlu`) : null
      const mesaj = str ? $t(`${str}.mesaj`) : null
      _continue = $t(_continue)

      return {
        titlu,
        mesaj,
        continue: _continue
      }
    },
    aDefMacarUnServiciu () {
      if (!this.activa || !this.activa.servicii) return false
      return this.activa.servicii.length > 0
    },
    aDefMacarUnFurnizor () {
      if (!this.furnizori) return false
      return Object.keys(this.furnizori).length > 0
    },
    ...mapGetters({
      blocuri: 'blocuri',
      idsBlocuri: 'bloc/ids',
      asociatii: 'asociatii',
      idsAsociatii: 'asociatie/ids',
      apartamente: 'apartamente',
      activa: 'asociatie/activa',
      defineste: 'asociatie/defineste',
      incasari: 'incasari',
      ultimulFurnizorAdaugat: 'furnizor/ultim',
      servicii: 'servicii',
      furnizori: 'furnizori'
    })
  },
  methods: {
    ...mapActions({
      openModal: 'modal/open',
      backup: 'backup',
      stergeAsociatie: 'asociatie/sterge',
      stergeServiciu: 'serviciu/sterge',
      toggleServiciu: 'asociatie/toggleServiciu'
    })
  },
  mounted () {
    this.initprgrs = this.poateTreceLaUrmPas
  },
  watch: {
    'activa._id': function (oldV, newV) {
      const { poateTreceLaUrmPas, debug } = this
      this.initprgrs = poateTreceLaUrmPas
      debug('Init prgrs updatat! Pas maxim: ', poateTreceLaUrmPas)
    }
  }
}
</script>

<style lang="stylus">
@require '~styles/config'

.furnizori
  list-style-type none
  padding 0
  display flex
  flex-flow row wrap
  max-width 630px
  margin 0 auto

  > li
    flex 1 1 33%
    margin 8px
    user-select none

    &:not(.nou)
      padding 8px 32px
      border: 1px solid config.palette.borders
      background white

.init
  &__next
    width auto !important

#init
  fullflex(1)
  width 100%

  &prgrs

  .intro
    text-align center

  h1
    // flex: 1 1 100%
    flex 0 0 auto
    user-select none
    text-align: center
    width: auto
    height: auto
    display: inline-flex
    margin-top auto
    margin-bottom 16px

  > *:not(.field)
    width 100%
    align-items center
    justify-content center

    &:not(h1):not(.intro):not(.blocuri)
      margin-bottom auto
      margin-top auto

  .field[data-type="radios"]
    padding 0
    z-index 21
    text-align center
    position fixed
    top 60px
    left 8px
    flex-direction column

    +desktop()
      position absolute
      top 0

    +above(m)
      left 16px

    &:before
      margin 0 auto 20px
      background-color: config.typography.palette.ui

    .radios
      flex-direction column

    .field__label
      min-width 0

ul.activitate
  list-style-type none
  padding 0

  > li
    margin -20px -20px 20px
    padding 20px
    
    &:not(:last-child)
      border-bottom: 1px solid config.palette.borders

    &:last-child
      margin-bottom 0

</style>
