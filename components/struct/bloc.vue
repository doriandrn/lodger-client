<template lang="pug">
ol.scari(v-if="id")
  li(v-for="scara, iScara in bloc.scari")
    label.nume Scara {{ scara.id }}
    .scara
      ol.etaje
        li(v-for="i in range(0, Number(scara.etaje || 0)+1)")
          buton(
            v-for=  "ap in apartamenteEtaj({ bloc: bloc._id, scara: iScara, etaj: i })",
            :key=   "ap._id"
            :class= "{ ultimul: ap._id === ultimulApAdaugat}"
            @click= "openModal({ id: 'apartament.edit', data: { _id: ap._id }})"
            tooltip
          ) {{ ap.proprietar }}
            em.ap__nr {{ ap.nr }}
          buton.adauga(
            styl=   "unstyled"
            tooltip
            @click= "openModal({ id: 'apartament.new', data: { bloc: bloc._id, scara: Number(iScara), etaj: i } })",
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
    }
  },
  computed: {
    ...mapGetters({
      blocuri: 'blocuri',
      apartamenteEtaj: 'apartament/localizeaza',
      ultimulApAdaugat: 'apartament/ultim'
    }),
    bloc () {
      return this.blocuri[this.id]
    }
  },
  methods: {
    ...mapActions({
      openModal: 'modal/open'
    })
  },
  components: {
    buton
  }
}
</script>

<style lang="stylus">
@require '~styles/config'

.bloc
  display flex
  flex-flow row wrap
  margin auto auto 0
  flex 1 1 100%
  align-items center
  justify-content center
  transition opacity .15s ease-in-out

  &:not(.activ)
    pointer-events none
    opacity .35

  &__actions
    display flex
    flex-flow row nowrap
    
    > button
      &:not(:first-child)
        margin-left 8px

    

  // &:hover
  //   .bloc
  //     &__actiuni
  //       +desktop()
  //         opacity 1
  //         visibility visible

  &__add
    // background-color: config.palette.borders !important
    position absolute
    bottom -3px
    right 3px
    size 56px
    border-radius 50%
    margin -2px

  // &__actiuni
  //   display flex
  //   flex-flow row nowrap

  //   +desktop()
  //     transition opacity .15s ease
  //     opacity 0
  //     visibility hidden

  //   > *
  //     margin 0 8px

  > .nume
    font-size 20px
    text-align center
    margin-bottom 12px

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
      height 48px
      flex-flow row-reverse nowrap

      > button
        width 100%
        flex 1 1 100%
        padding 8px
        border-radius 0
        box-shadow none

        &.adauga
          opacity 0

        em
          font-style normal
          font-weight 100
          font-size 18px
          pointer-events none
          margin-bottom 4px

        &:not([data-styl="unstyled"])
          // background-color: lighten(config.palette.tertiary, 85%)
          background-color: transparent
          color: config.typography.palette.ui
          border-color: transparent
          font-size 0
          border-left: 1px solid config.palette.borders !important

          &:hover
            background white !important
            color: config.typography.palette.headings !important

      &.ultim
        border-color: config.palette.tertiary

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

</style>

