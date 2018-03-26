<template lang="pug">
sction#apartament(
  v-if=   "ap && ap.nr"
  :title= "`Apartamentul ${ap.nr}`"
)
  split.header
    .usa
      .usa__nr.ap__nr {{ ap.nr }}
      h5.nume {{ ap.proprietar }}

    split(slot="right")
      .ap__info
        div.camp
          label.balanta balanta 
          bani(:valoare="ap.balanta")

        div.camp
          label suprafata
          span {{ ap.suprafata }}

        .camp
          label utilitati
          span {{ ap.utilitati || '~' }}

        .camp
          label locatari
          span {{ ap.locatari || '~' }}

      p(slot="right") pula

      tabs
        tab(title="statistici")
          h4 Consumă cel mai mult
          
          h4 Ultima plată
          p candva

        tab(title="incasari")
          p incas

        tab(title="cheltuieli")
          p chelts

        tab(title="instiintari")
          p instiintari

        tab(title="date contact")
          p aici e frumos

  //- .widgets
  //-   widget(expand)
  //-     p omg
</template>

<script>
import sction from '~components/section'
import widget from '~components/widget'
import split from '~components/split'
import bani from '~components/bani'

import { mapGetters } from 'vuex'

export default {
  async asyncData ({ params }) {
    console.log('OARAMS', arguments)
  },
  components: {
    bani,
    sction,
    widget,
    split
  },
  computed: {
    ap () {
      return this.apartamente[this.$route.params.id]
    },
    ...mapGetters({
      apartamente: 'apartamente'
    })
  }
}
</script>

<style lang="stylus">
@require '~styles/config'

.usa
  background rgba(black, .05)
  padding 24px
  width 160px
  height 280px
  display flex
  flex-flow column nowrap
  align-items center
  justify-content center

  &__nr
    margin-bottom 8px

#apartament
  .header
    flex 1 1 100%
    max-height 100%
    height 100%
    align-items flex-start

    header
      box-shadow none
      background transparent

    > .right
      margin-left 32px
      flex 1 1 100%
      display flex
      flex-flow row wrap
      align-items flex-start

      .left
        display flex
        flex-flow column nowrap
        flex 1 1 100%
        align-items flex-start

        .tabs
          margin-top auto

        .tab
          background white
          padding 16px

    .split
      flex 1 1 100%
      height 100%

    .camp
      display flex
      flex-flow row wrap
      margin-right 32px
      height 60px
      min-width 90px
      

      label
        display block
        flex 1 1 100%
        color: config.typography.palette.meta

        &+*
          font-size 24px

.ap
  &__info
    display flex
    flex 1 1 100%
    flex-flow row wrap

</style>
