<template lang="pug">
.bloc(
  :class= "{ ultimul, nenavigabil: !navigabil }"
)
  .bloc__heading
    h4.bloc__title {{ bloc.nume }}
    .bloc__actiuni(v-if="modificabil")
      buton(
        styl=     "unstyled"
        icon=     "edit"
        icon-only
        @click=   "selecteazaBloc({ id: bloc._id, modificabil })"
        tooltip
      ) {{ $t('bloc.edit.title') }}
      buton(
        styl=     "unstyled"
        @click=   "stergeBloc(bloc._id)"
        icon=     "trash"
        icon-only
        tooltip
        dangerous
      ) {{ $t('bloc.delete') }}

  ol.scari(
    v-if=   "bloc.scari && bloc.scari.length > 0"
  )
    li(v-for="scara, iScara in bloc.scari")
      label.nume Scara {{ scara.id }}
      .scara(
        :data-lift=       "scara.lift"
        :data-mansarda=   "scara.mansarda"
      )
        ol.etaje
          li(v-for="i in range(0, Number(scara.etaje || 0)+1)")
            buton(
              v-for=      "ap in apartamenteEtaj({ bloc: bloc._id, scara: iScara, etaj: i })",
              :key=       "ap._id"
              data-for=   "ap"
              @keyUp=     "debug('butonsus')"
              :class=     "{ ultimul: ap._id === ultimulApAdaugat}"
              @click=     "selecteazaAp({ id: ap._id, modificabil })"
              :tooltip=   "apTooltip(ap._id)"
              :disabled=  "!navigabil"
            ) {{ ap.proprietar }}
              em.ap__nr {{ ap.nr }}
            
            buton.adauga(
              v-if=   "modificabil"
              styl=   "unstyled"
              data-for= "ap"
              tooltip
              @keyUp= "debug('butonsus')"
              @click= "selecteazaAp({ id: null }); selecteazaEtaj({ bloc: bloc._id, scara: Number(iScara), etaj: i, modificabil })",
              icon=   "plus-circle"
              icon-only
            ) {{ $t('apartament.new.title') }}
</template>

<script>
import buton from 'form/button'
import { mapGetters, mapActions } from 'vuex'

export default {
  props: {
    id: {
      type: String,
      default: null
    },
    modificabil: {
      type: Boolean,
      default: false
    },
    /**
     * face referire la tabindexurile de la butoane
     */
    navigabil: {
      type: Boolean,
      default: true
    },
    ultimul: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapGetters({
      blocuri: 'blocuri',
      apartamenteEtaj: 'apartament/localizeaza',
      apTooltip: 'apartament/tooltip',
      ultimulApAdaugat: 'apartament/ultim'
    }),
    bloc () {
      return this.blocuri[this.id]
    }
  },
  methods: {
    ...mapActions({
      openModal: 'modal/open',
      selecteazaBloc: 'bloc/selecteaza',
      selecteazaEtaj: 'etaj/selecteaza',
      selecteazaAp: 'apartament/selecteaza'
    })
  },
  components: {
    buton
  }
}
</script>

<style lang="stylus">
@require '~styles/config'
colors = config.palette

.bloc
  display flex
  flex-flow column nowrap
  transition opacity .15s ease-in-out

  &__title
    margin-bottom 12px
    text-transform uppercase
    user-select none

  &__heading
    display flex
    flex-flow column nowrap
    margin-bottom 32px
    align-items center

  &__actiuni
    display flex
    flex-flow row nowrap
    
    > button
      &:not(:first-child)
        margin-left 8px

  &__add
  > .nume
    font-size 20px
    text-align center
    margin-bottom 12px

  &:not(.nenavigabil)
    .etaj
      &:hover
        button.adauga
          opacity 1 !important

        &:before
          color: colors.primary

    > .scari
      > li
        &:hover
          > .nume
            color: config.typography.palette.headings

  &.nenavigabil
    .etaje
      background #f1f4f1

    > .scari
      > li > .nume
        color: config.typography.palette.meta

  > .scari
    display flex
    flex-flow column nowrap
    justify-content center
    padding 0
    margin auto auto 0
    flex 1 1 100%

    +above(l)
      flex-direction row

    > li
      min-width 160px
      flex-flow column nowrap
      align-items flex-start
      justify-content flex-start
      margin auto 4px 0
      display flex

      &:not(:last-child)
        margin-bottom 32px

        +above(l)
          margin-bottom 0

      > .nume
        // color: config.typography.palette.meta
        transition color .1s ease
        margin-bottom 8px

  .scara
    width 100%
    border: 1px solid colors.borders
    counter-reset etaje
    position relative

    &[data-lift]
      > ol.etaje
        margin-left 8px

      &:before
        content ''
        width 5px
        height 20px
        background rgba(black, .15)
        position absolute
        top 40px
        left 1px

      &:after
        content ''
        width 1px
        height 40px
        background: colors.borders
        position absolute
        top 0
        left 3px

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
      // min-height 36px
      min-height 48px
      flex-flow row nowrap

      > button
        width 100%
        flex 1 1 100%
        padding 8px
        border-radius 0
        box-shadow none
        border 1px solid transparent
        margin -1px

        &:not(:first-child)
          border-left: 1px solid colors.borders

        &.adauga
          &:before
            background-color transparent
            transition background-color .1s ease

        &:not(:disabled)
          &:active
          &:focus
          &:hover
            border-color: colors.tertiary
            opacity 1

            &:before
              background-color: colors.primary

        em
          font-style normal
          font-weight 100
          font-size 18px
          pointer-events none

        &:disabled
          em
            color: config.typography.palette.light

        &:not([data-styl="unstyled"])
          // background-color: lighten(colors.tertiary, 85%)
          background-color: transparent
          color: config.typography.palette.ui
          font-size 0
          
          &:hover
            background-color transparent !important
            color: config.typography.palette.headings

      &.ultim
        border-color: colors.tertiary

      &:before
        content counter(etaje, upper-roman)
        color: config.typography.palette.light
        position absolute
        left 4px
        top 4px
        font-size 10px
        line-height 10px

      &:first-child:before
        content 'P'
        // background: colors.bgs.body

      &:not(:last-child)
        border-top: 1px solid colors.borders

      &:not(:first-child)
        counter-increment etaje

  &__nr
    flex 1 1 100%
    padding 0 4px
    pointer-events none
    line-height 20px
    margin-bottom 0
    text-transform capitalize

</style>

