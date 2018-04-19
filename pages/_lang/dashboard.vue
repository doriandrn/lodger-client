<template lang="pug">
sction#dash
  //- typecheck
  #init(v-if="idsAsociatii.length > 0")
    field(
      v-if=       "aDefMacarUnServiciu"
      type=       "radios",
      icon=       "hard-drive"
      id=         "initprgrs"
      v-model=    "initprgrs"
      :label=     "null"
      :options=   "initOptions"
      :disabled=  "disabledSteps",
      :required=  "true"
    )

    h1 {{ $t( initMessage.titlu ) }}
    p.intro(v-show="initprgrs !== 2 || !idsBlocuri.length") {{ $t( initMessage.mesaj ) }}
    
    servicii(
      v-if=             "initprgrs === 0"
      @input=           "toggleServiciu",
      @stergeServiciu=  "stergeServiciu",
      @modificaServiciu="debug($event); openModal({ id: 'serviciu.edit', data: $event })"
      @serviciuNou=     "openModal('serviciu.new')",
      :servicii=        "servicii",
      :value=           "serviciiAsociatie",
      :areAdauga=       "true"
    )

    ul.furnizori(v-else-if= "initprgrs === 1")
      li(
        v-for=      "furnizor, furnizorId in furnizori"
        :class=     "{ ultimul: furnizorId === ultimulFurnizorAdaugat }"
      )
        span.nume {{ furnizor.nume }}
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

    //- empty(
    //-   v-else-if=  "!initprgrs && !aDefMacarUnServiciu && !defineste"
    //-   :CTA=       "$t('bloc.none.CTA')",
    //-   :actions=   "{ blocNew: $t('bloc.none.actions[0]') }"
    //-   @action=    "openModal('bloc.new')"
    //- )
    buton(
      v-else-if=  "initprgrs === 2 && !idsBlocuri.length"
      @click=    "openModal('bloc.new')"
    ) {{ $t('bloc.none.actions[0]') }}

    buton.init__next(
      :disabled=  "!poateTreceLaUrmPas"
      size=       "large"
      @click=     "initprgrs++"
      arrow=      "right"
    ) {{ initMessage.continue }}


  //- widget(
  //-   title=  "$t('asociatie.adminZone.title')"
  //-   icon=   "settings"
  //- )
  //-   ul.actions
  //-     li
  //-       buton(
  //-         icon=   "plus-circle"
  //-         @click= "openModal('asociatie.new')", 
  //-         styl=   "unstyled"
  //-       ) {{ $t('asociatie.noneAdmind.action') }}
  //-     li
  //-       buton(
  //-         styl=   "unstyled"
  //-         @click= "openModal('asociatie.edit')"
  //-       ) {{ $t('asociatie.edit.title') }}
  //-     li
  //-       buton(
  //-         @click= "backup"
  //-       ) salveaza date
  //-     li
  //-       buton(
  //-       ) importa date

  //-   .danger
  //-     h4 {{ $t('asociatie.adminZone.dangerZone') }}
  //-     buton(
  //-       dangerous,
  //-       @click=   "stergeAsociatie(activaId)",
  //-       icon=     "trash"
  //-       :prompt=  "{ type: 'warning', message: $t('asociatie.adminZone.deletePrompt') }"
  //-     ) {{ $t('asociatie.adminZone.delete') }}
  empty(
    v-else
    size=     "large"
    :title=   "$t('asociatie.noneAdmind.heading')",
    :CTA=     "$t('asociatie.noneAdmind.CTA')",
    :actions= "{ newAsoc: $t('asociatie.noneAdmind.action') }"
    @action=  "openModal('asociatie.new')"
  )

</template>

<script>
import sction from '~components/section'
import widget from '~components/widget'
import buton from 'form/button'
import blocuri from '~components/blocuri'
import frm from '~components/form.vue'
import empty from '~components/empty'
import dateTime from '~components/dateTime'
import split from '~components/split'

import adresa from '~components/adresa'
import bani from '~components/bani'
import servicii from '~components/servicii'
import field from 'form/field'

import typecheck from 'pg/widgets/typography'
import butonIncaseaza from 'cc/butonIncaseaza'

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
    adresa,
    split,
    bani,
    widget,
    buton,
    empty,
    field,
    frm,
    dateTime,
    servicii,
    butonIncaseaza,

    typecheck
  },
  computed: {
    poateTreceLaUrmPas () {
      const { initprgrs, aDefMacarUnServiciu, aDefMacarUnFurnizor, defineste } = this
      if (initprgrs < 0) return 0
      if (aDefMacarUnFurnizor) return 2
      if (aDefMacarUnServiciu) return 1
      return false
    },
    initOptions () {
      return [0, 1, 2, 3]
    },
    disabledSteps () {
      const { poateTreceLaUrmPas, initOptions } = this
      return initOptions.filter(opt => opt > poateTreceLaUrmPas)
    },
    initMessage () {
      const pfix = 'asociatie.init'
      let str = ''
      const { initprgrs } = this
      switch (initprgrs) {
        case -1: str = `${pfix}.start`; break
        case 0: str = `${pfix}.servicii`; break
        case 1: str = `${pfix}.furnizori`; break
        case 2: str = `${pfix}.structura`; break
        case 3: str = `${pfix}.financiar`; break
      }
      const{ $t } = this
      return {
        titlu: `${str}.titlu`,
        mesaj: `${str}.mesaj`,
        continue: initprgrs === 3 ? $t('asociatie.new.confirmStruct') : $t('asociatie.new.continuaInitializarea')
      }
    },
    activa () {
      return this.asociatii[this.activaId]
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
      activaId: 'asociatie/activa',
      defineste: 'asociatie/defineste',
      incasari: 'incasari',
      ultimulFurnizorAdaugat: 'furnizor/ultim',
      servicii: 'servicii',
      furnizori: 'furnizori',
      serviciiAsociatie: 'asociatie/servicii'
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
  }
}
</script>

<style lang="stylus">
@require '~styles/config'
.widgets
  display flex
  flex-flow row wrap
  margin: -(config.spacings.inBoxes/2)

  +above(l)
    margin: -(config.spacings.inBoxes)

  > *
    flex 1 0 300px
    margin: (config.spacings.inBoxes/4)

    +above(l)
      margin: (config.spacings.inBoxes/2)

    +desktop()
      margin: config.spacings.inBoxes

.furnizori
  list-style-type none
  padding 0
  display flex
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

    +desktop()
      margin-top 20vh

  > *:not(.field)
    width 100%
    align-items center
    justify-content center

    &:not(h1):not(.intro)
      margin-bottom auto

  .field[data-type="radios"]
    padding 0
    z-index 21
    text-align center
    position fixed
    top 60px
    left 16px

    +desktop()
      position absolute
      top 0

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
