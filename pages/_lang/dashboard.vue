<template lang="pug">
sction#dash(
  :title= "$t('dashboard.title')"
)
  div(v-if="asociatii.length > 0")

    .widgets
      widget(
        v-if=     "asociatieInitializata"
        :title=   "$t('dashboard.actions.title')"
        :boxed=   "false"
      )
        buton(
          icon=   "trending-up"
          @click= "openModal('incasare.new')"
        ) {{ $t('dashboard.actions.cashIn') }}

        buton(
          @click= "openModal('cheltuiala.new')"
          styl=   "outline"
        ) {{ $t('dashboard.actions.spend' )}}

      //- typecheck

      widget(
        :title= "$t('dashboard.statistics.title')"
        v-if=   "asociatieInitializata"
        icon=   "bar-chart-2"
      )
        h4 Rămas de încasat

      widget(
        :title= "$t('dashboard.activity.title')"
        icon=   "activity"
        v-if=   "asociatieInitializata"
      )
        ul.activitate(v-if="incasari.length > 0")
          

      //- widget.joaca(title="joaca", full)
        p ccucuuc

      widget#init(
        :title=     "$t('asociatie.init.title')",
        icon=       "hard-drive"
        :controls=  "[{ type: 'progresInit' }]"
        expand
      )
        field(
          slot=       "right"
          v-if=       "initprgrs"
          type=       "radios",
          id=         "initprgrs"
          v-model=    "initprgrs"
          :label=     "null"
          :options=   "{1: 1, 2: 2, 3: 3}"
        )

        div(v-if="initprgrs")
          split
            h5 {{ $t(initTitle) }}
            buton(
              v-if=   "initprgrs === 2",
              icon=   "plus-circle",
              slot=   "right"
              @click= "openModal('bloc.new')"
              size=   "small"
              styl=   "outline"
            ) {{ $t('bloc.new.title') }}

          div(v-if=       "initprgrs === 1")
            servicii(
              @input=           "toggleServiciu",
              @stergeServiciu=  "stergeServiciu",
              @modificaServiciu="debug($event); openModal({ id: 'serviciu.edit', data: $event })"
              @serviciuNou=     "openModal('serviciu.new')",
              :servicii=        "servicii",
              :value=           "serviciiAsociatie",
              :areAdauga=       "true"
            )
            ul.furnizori
              li(
                v-for="furnizor in furnizori"
              ) {{ furnizor.nume }}
              li
                buton(
                  icon= "plus-circle",
                  @click="openModal('furnizor.new')"
                ) {{ $t('furnizor.adauga') }}

          div(v-else-if=  "initprgrs === 2")
            ul.blocuri
              li(
                v-for="bloc, blocId in blocuri"
                :class="{ ultimul: blocId === ultimulBlocAdaugat }"
              )
                split
                  label.nume {{ bloc.nume || '~'}}
                  buton(
                    slot=   "right"
                    styl=   "unstyled"
                    icon=   "edit"
                    icon-only
                    @click= "openModal({ id: 'bloc.edit', data: { _id: bloc._id }})"
                    tooltip
                  ) {{ $t('bloc.edit.title') }}
                  buton(
                    slot=     "right"
                    styl=     "unstyled"
                    @click=   "stergeBloc(bloc._id)"
                    icon=     "trash"
                    icon-only
                    tooltip
                    dangerous
                  ) {{ $t('bloc.delete') }}
                .bloc
                  ol.scari
                    li(v-for="scara in bloc.scari")
                      label.nume Scara {{ scara.id }}
                      .scara
                        ol.etaje
                          li(v-for="i in range(0, Number(scara.etaje || 0)+1)")
                            buton(
                              v-for=  "ap in apartamenteEtaj({ bloc: bloc._id, scara: scara.id, etaj: i })",
                              :key=   "ap._id"
                              :tooltip="ap.proprietar || '?'"
                              :class= "{ ultim: ap._id === ultimulApAdaugat}"
                              @click= "openModal({ id: 'apartament.edit', data: { _id: ap._id }})"
                            ) #[em {{ ap.nr }}]
                            buton.adauga(
                              styl=   "unstyled"
                              tooltip
                              @click= "openModal({ id: 'apartament.new', data: { bloc: bloc._id, scara: scara.id, etaj: i } })",
                              icon=   "plus-circle"
                              icon-only
                            ) {{ $t('apartament.new.title') }}

            buton(
              v-if= "toateEtajeleAuApartamente && initprgrs === 2"
              disabled
            ) {{ $t('asociatie.new.confirmStruct') }}

          frm(
            v-else-if=  "initprgrs === 3"
            :formData=   "require('forms/initFinanc')"
          )
            p ultima incasare
            p facturi / cheltuieli active

        empty(
          v-else
          :title=   "$t('bloc.none.heading')",
          :CTA=     "$t('bloc.none.CTA')",
          :actions= "{ startInit: $t('bloc.none.actions[0]'), importaDate: $t('bloc.none.actions[1]') }"
          @action=  "$event === 'startInit' ? initprgrs = 1 : null"
        )

      widget(
        title=  "$t('asociatie.adminZone.title')"
        icon=   "settings"
      )
        ul.actions
          li
            buton(
              icon=   "plus-circle"
              @click= "openModal('asociatie.new')", 
              styl=   "unstyled"
            ) {{ $t('asociatie.noneAdmind.action') }}
          li
            buton(
              styl=   "unstyled"
              @click= "openModal('asociatie.edit')"
            ) {{ $t('asociatie.edit.title') }}
          li
            buton(
              @click= "backup"
            ) salveaza date
          li
            buton(
            ) importa date

        .danger
          h4 {{ $t('asociatie.adminZone.dangerZone') }}
          buton(
            dangerous,
            @click=   "stergeAsociatie(activaId)",
            icon=     "trash"
            :prompt=  "{ type: 'warning', message: $t('asociatie.adminZone.deletePrompt') }"
          ) {{ $t('asociatie.adminZone.delete') }}
  empty(
    v-else
    size=   "large"
    :title= "$t('asociatie.noneAdmind.heading')",
    :CTA=   "$t('asociatie.noneAdmind.CTA')",
    :actions= "{ newAsoc: $t('asociatie.noneAdmind.action') }"
    @action=  "openModal('asociatie.new')"
  )

</template>

<script>
import sction from '~components/section'
import widget from '~components/widget'
import buton from 'form/button'
import frm from '~components/form.vue'
import empty from '~components/empty'
import dateTime from '~components/dateTime'
import split from '~components/split'

import adresa from '~components/adresa'
import bani from '~components/bani'
import servicii from '~components/servicii'
import field from 'form/field'

import typecheck from 'pg/widgets/typography'

import { mapGetters, mapActions } from 'vuex'

export default {
  data () {
    return {
      asociatieInitializata: true,
      toateEtajeleAuApartamente: false,
      initprgrs: 0
    }
  },
  components: {
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

    typecheck
  },
  computed: {
    initTitle () {
      const pfix = 'asociatie.init'
      switch (this.initprgrs) {
        case 1: return `${pfix}.serviciiFurnizori`
        case 2: return `${pfix}.structura`
        case 3: return `${pfix}.financiar`
      }
      return null
    },
    ...mapGetters({
      blocuri: 'blocuri',
      asociatii: 'asociatie/ids',
      apartamente: 'apartamente',
      apartamenteEtaj: 'apartament/localizeaza',
      activaId: 'asociatie/activa',
      defineste: 'asociatie/defineste',
      incasari: 'incasari',
      ultimulApAdaugat: 'apartament/ultim',
      ultimulBlocAdaugat: 'bloc/ultim',
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
      stergeBloc: 'bloc/sterge',
      stergeServiciu: 'serviciu/sterge',
      toggleServiciu: 'asociatie/toggleServiciu'
    })
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

.blocuri
  fullflex()
  flex-flow row nowrap
  overflow auto
  list-style-type none
  padding 0
  // margin: -(config.spacings.inBoxes)

  ul
    list-style-type none
    padding 0

  > li
    margin: config.spacings.inBoxes
    flex 1 0 180px
    display flex
    flex-flow column nowrap

    > .split > .left > label
      text-transform uppercase

    > .bloc
      padding-top 16px
      margin-top 16px
      // border-top: 1px solid config.palette.borders

    &.ultimul
      > .split > .left label
        &:after
          content ''
          bubble()


  .bloc
    display flex
    flex 1 1 100%
    margin-top auto

    > .scari
      display flex
      flex-flow row nowrap
      padding 0
      margin -4px auto

      > li
        min-width 160px
        flex-flow column nowrap
        align-items flex-start
        justify-content flex-start
        margin auto 4px 4px
        display flex

        > .nume
          color: config.typography.palette.meta
          transition color .1s ease
          margin-bottom 8px

        &:hover
          > .nume
            color: config.typography.palette.headings

    .scara
      width 100%
      border: 1px solid config.palette.borders
      counter-reset etaje

  .etaj
    margin-bottom auto
    padding-bottom 16px

    &e
      background white
      display flex
      padding 0
      flex-flow column-reverse nowrap

      > li
        display flex
        position relative
        padding: (config.spacings.inBoxes/2)
        flex-flow row-reverse nowrap

        > button
          width 100%
          margin-left 4px
          flex 1 1 100%
          padding 8px
          border-radius 0

          &.adauga
            opacity 0

          em
            font-family: config.typography.fams.headings
            font-style normal
            font-weight medium
            pointer-events none
            margin-bottom 4px

          &:not([data-styl="unstyled"])
            // background-color: lighten(config.palette.tertiary, 85%)
            background-color: config.palette.bgs.body
            color: darken(config.palette.tertiary, 40%)
            border-color: config.palette.bgs.body

            &:hover
              background-color white

        &.ultim
          border-color: config.palette.tertiary

        &:before
          content counter(etaje, upper-roman)
          color: config.typography.palette.meta
          position absolute
          left 4px
          top 4px
          font-size 10px
          line-height 10px

        &:first-child:before
          content 'P'
          // background: config.palette.bgs.body

        &:not(:last-child)
          border-top: 1px solid config.palette.borders

        &:not(:first-child)
          counter-increment etaje

        &:hover
          button.adauga
            opacity 1 !important

    &__nr
      flex 1 1 100%
      padding 0 4px
      pointer-events none
      line-height 20px
      margin-bottom 0
      text-transform capitalize

.furnizori
  list-style-type none
  padding 0

  > li
    padding 8px 32px
    border: 1px solid config.palette.borders

#init
  header
    .radios
      display flex
    
    .input__radio
      padding 8px
      > label
        display none

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
