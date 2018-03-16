<template lang="pug">
sction#dash
  div(v-if="asociatii.length")
    h1 {{ $t('dashboard.title') }}

    .widgets
      widget(
        :title="$t('dashboard.actions.title')"
        :boxed="false"
        v-if=   "asociatieInitializata"
      )
        buton(
          icon=   "trending-up"
          @click= "openModal('incasare.new')"
        ) {{ $t('dashboard.actions.cashIn') }}

      //- typecheck

      widget(
        :title= "$t('dashboard.statistics.title')"
        v-if=   "asociatieInitializata"
        icon=   "bar-chart-2"
      )
        h4 Rămas de încasat

      widget(
        :title= "$t('dashboard.activity.title')"
        icon= "activity"
        v-if=   "asociatieInitializata"
      )

      //- widget.joaca(title="joaca", full)
        p ccucuuc

      widget#init(
        :title=  "$t('asocs.init.title')",
        icon=     "hard-drive"
        :controls= "[{ type: 'progresInit' }]"
        expand
      )
        field(
          slot=   "right"
          type=   "radios",
          id=     "initprgrs"
          v-model=  "initprgrs"
          :label=   "null"
          :options= "{1: 1, 2: 2, 3: 3}"
        )

        div
          split
            h5 {{ $t(initTitle) }}
            buton(
              v-if=   "initprgrs === 2",
              icon=   "plus-circle",
              slot=   "right"
              @click= "openModal('blocs.new')"
              size=   "small"
              styl=   "outline"
            ) {{ $t('blocs.new.title') }}

          ul.blocuri(v-if="initprgrs === 2")
            li(v-for="bloc in blocuri")
              split
                label.nume {{ bloc.nume || '~'}}
                buton(
                  slot=   "right"
                  styl=   "unstyled"
                  icon=   "edit"
                  icon-only
                  @click= "openModal({ id: 'blocs.edit', data: { _id: bloc._id }})"
                  tooltip
                ) {{ $t('blocs.edit.title') }}
                buton(
                  slot=     "right"
                  styl=     "unstyled"
                  @click=   "stergeBloc(bloc._id)"
                  icon=     "trash"
                  icon-only
                  tooltip
                  dangerous
                ) {{ $t('blocs.delete') }}
              .bloc
                ul.scari
                  li(v-for="scara in bloc.scari")
                    label.nume Scara {{ scara.id }}
                    .scara
                      ul.etaje
                        li(v-for="i in range(0, Number(scara.etaje || 0)+1)")
                          split.etaj__header 
                          .etaj__content
                            buton(
                              v-for=  "ap in apartamenteEtaj({ bloc: bloc._id, scara: scara.id, etaj: i })",
                              :key=   "ap._id"
                              :tooltip="ap.proprietar || '?'"
                              :class= "{ ultim: ap._id === ultimulApAdaugat}"
                              @click= "openModal({ id: 'aps.edit', data: { _id: ap._id }})"
                            ) #[em {{ ap.nr }}]
                            buton.adauga(
                              styl=   "unstyled"
                              tooltip
                              @click= "openModal({ id: 'aps.new', data: { bloc: bloc._id, scara: scara.id, etaj: i } })",
                              icon=   "plus-circle"
                              icon-only
                            ) {{ $t('aps.new.title') }}

          buton(
            v-if= "toateEtajeleAuApartamente"
            disabled
          ) {{ $t('asocs.new.confirmStruct') }}

        empty(
          v-if=     "!initprgrs && !blocuri.length",
          :title=   "$t('blocs.none.heading')",
          :CTA=     "$t('blocs.none.CTA')",
          :actions= "{ definesteStructura: $t('blocs.none.actions[0]'), importaDate: $t('blocs.none.actions[1]') }"
        )

      widget(
        title=  "$t('asocs.adminZone.title')"
        icon=   "settings"
      )
        ul.actions
          li
            buton(
              icon=   "plus-circle"
              @click= "openModal('asocs.new')", 
              styl=   "unstyled"
            ) {{ $t('asocs.noneAdmind.action') }}
        .danger
          h4 {{ $t('asocs.adminZone.dangerZone') }}
          buton(
            dangerous,
            icon=     "trash"
            @click=   "stergeAsociatie(activaId)",
            :prompt=  "{ type: 'warning', message: $t('asocs.adminZone.deletePrompt') }"
          ) {{ $t('asocs.adminZone.delete') }}
  empty(
    v-else
    size=   "large"
    :title= "$t('asocs.noneAdmind.heading')",
    :CTA=   "$t('asocs.noneAdmind.CTA')",
    :actions= "{ newAsoc: $t('asocs.noneAdmind.action') }"
  )

</template>

<script>
import sction from '~components/section'
import widget from '~components/widget'
import buton from 'form/button'
import frm from '~components/form.vue'
import empty from '~components/empty'
import split from '~components/split'
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
    split,
    widget,
    buton,
    empty,
    field,
    frm,
    typecheck
  },
  computed: {
    initTitle () {
      switch (this.initprgrs) {
        case 1: return 'ascos.init.serviciiFurnizori'
        case 2: return 'ascos.init.structura'
        case 3: return 'ascos.init.financiar'
      }
      return null
    },
    ...mapGetters({
      blocuri: 'blocuri',
      asociatii: 'asociatii',
      apartamente: 'apartamente',
      apartamenteEtaj: 'apartament/localizeaza',
      activaId: 'asociatie/activa',
      defineste: 'asociatie/defineste',
      ultimulApAdaugat: 'apartament/ultimulAdaugat'
    })
  },
  methods: {
    ...mapActions({
      openModal: 'modal/open',
      stergeAsociatie: 'asociatie/sterge',
      stergeBloc: 'bloc/sterge'
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
    margin: (config.spacings.inBoxes/2)

    +above(l)
      margin: config.spacings.inBoxes

ul.blocuri
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

    &.nou
      flex 0 1 160px


  .bloc
    display flex
    flex 1 1 100%
    margin-top auto

    > .scari
      display flex
      flex-flow row nowrap
      margin -4px

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
      flex-flow column-reverse nowrap

      > li
        display flex
        position relative
        flex-flow column nowrap

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
          .etaj__header
            border-top: 1px solid config.palette.borders

        &:not(:first-child)
          counter-increment etaje

        &:hover
          button.adauga
            opacity 1 !important

    &__header
      flex-flow row nowrap

    &__nr
      flex 1 1 100%
      padding 0 4px
      pointer-events none
      line-height 20px
      margin-bottom 0
      text-transform capitalize

    &__content
      padding: (config.spacings.inBoxes/2)
      display flex
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

#init
  header
    .radios
      display flex
    
    .input__radio
      padding 8px
      > label
        display none
</style>
