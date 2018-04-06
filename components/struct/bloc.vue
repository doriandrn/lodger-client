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
    border-radius 0 !important

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
    flex-flow row nowrap
    justify-content center
    padding 0
    margin auto auto 0
    flex 1 1 100%

    > li
      min-width 160px
      flex-flow column nowrap
      align-items flex-start
      justify-content flex-start
      margin auto 4px 0
      display flex

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
</style>

