<template lang="pug">
.bloc(
  :class= "{ ultimul, nenavigabil: !navigabil }"
)
  h4.bloc__title
    span(
    ) {{ bloc.name }}
      //- v-tooltip=  "bloc.edit.title"
      //- @click=     "openModal('bloc.edit')"
    //- nuxt-link(
    //-   :to="`/bloc/${bloc._id}`"
    //-   v-else
    //- ) {{ bloc.nume }}

  ol.scari(
    v-if=   "bloc.scari && bloc.scari.length > 0"
  )
    li(v-for="scara, iScara in bloc.scari")
      label.nume {{ scara.id }}
      .scara(
        :data-lift=       "scara.lift"
        :data-mansarda=   "scara.mansarda"
        :class=           "{ mare: scara.etaje > 9 }"
      )
        ol.etaje
          li(v-for="i in range(0, Number(scara.etaje || 0)+1)")
            buton(
              v-if=       "$l.apartamente.subscribers.single"
              v-for=      "ap in Object.values($l.apartamente.subscribers.single.items).filter(ap => ap.scara === iScara && ap.etaj === i)",
              :key=       "ap._id"
              data-for=   "ap"
              @keyUp=     "debug('butonsus')"
              :class=     "{ ultimul: ap._id === ultimulApAdaugat}"
              @click=     "selecteazaAp(ap._id); if (modificabil) openModal('apartament.edit')"
              :tooltip=   "ap.proprietar"
              :disabled=  "!navigabil"
            ) {{ ap.proprietar }}
              em.ap__nr {{ ap.nr }}

            buton.adauga(
              styl=   "unstyled"
              data-for= "ap"
              tooltip
              @keyUp= "debug('butonsus')"
              @click= "selecteazaAp({ id: null }); selecteazaEtaj({ bloc: bloc._id, scara: Number(iScara), etaj: i, modificabil })",
              icon=   "plus-circle"
              icon-only
            ) apartament.new.title
</template>

<script>
import buton from 'form/button'
// import { mapGetters, mapActions } from 'vuex'

export default {
  data () {
    return {
      fetched: false
    }
  },
  async fetch () {
    // const { id } = this
    // const criteria = { filter: { blocId: id }, limit: 0 }

    // const sub = this.$l.apartamente.subscribers.single

    // if (sub) {
    //   sub.criteria = criteria
    // } else {
    //   this.$l.apartamente.subscribe('single', { criteria })
    // }
  },
  props: {
    bloc: {
      type: Object,
      required: true,
      default () {
        return {
          name: 'none'
        }
      }
    },
    // id: {
    //   type: String,
    //   default: null
    // },
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
    },
    showHeading: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    id () {
      return this.bloc._id
    },
    // ...mapGetters({
    //   blocuri: 'blocuri',
    //   apartamenteEtaj: 'apartament/localizeaza',
    //   apTooltip: 'apartament/tooltip',
    //   ultimulApAdaugat: 'apartament/ultim'
    // }),
    apartamenteEtaj () {
      return () => [{},  {},  {}, {}]
    }
  },
  methods: {
    // ...mapAsctions({
    //   openModal: 'modal/open',
    //   selecteazaEtaj: 'etaj/selecteaza',
    //   selecteazaAp: 'apartament/selecteaza'
    // })
  },
  components: {
    buton,
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

    > span
      cursor pointer

      &:hover
      &:focus
      &:active
        text-decoration underline

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

  &__add
    min-width 160px
    margin-top auto
    margin-bottom 0

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
    flex 0 0 100%

    +above(l)
      flex-direction row

    > li
      display flex
      flex-flow column nowrap
      align-items flex-start
      justify-content flex-start
      margin auto 4px 0
      min-width 160px

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
    max-height 50vh

    &.mare
      overflow auto

    &[data-mansarda]
      > ol.etaje
        > li:last-child
          &:before
            content 'M'

    &[data-lift]
      > ol.etaje
        margin-left 8px
        border-left: 1px solid colors.borders

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
        max-width 100%
        flex 1 1 100%
        padding 8px
        border-radius 0
        box-shadow none
        // border 1px solid transparent
        // margin -1px
        background transparent

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

