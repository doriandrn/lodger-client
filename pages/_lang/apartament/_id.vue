<template lang="pug">
sction#apartament(
  v-if=   "ap && ap.nr"
  :title= "`Apartamentul ${ap.nr}`"
)
  split.header
    .usa
      .usa__nr.ap__nr {{ ap.nr }}
      h5.nume {{ ap.proprietar }}

    split(slot="right").ap__info
      .camp
        label.balanta balanta 
        bani(:valoare="ap.balanta")

      .camp
        label suprafata
        span {{ ap.suprafata }}

      .camp
        label utilitati
        span {{ ap.utilitati || '~' }}

      .camp
        label locatari
        span {{ ap.locatari || '~' }}

      incaseaza(
        slot=   "right",
        :id=    "$route.params.id"
      )

    tabs(slot="right")
      tab(title="statistici")
        h4 Consumă cel mai mult
        
        h4 Ultima plată
        p candva

      tab(title="incasari")
        incasari(
          :incasari=  "incasari",
          :showAdresa="false"
        )

      tab(title="cheltuieli")
        p chelts

      tab(title="instiintari")
        p instiintari

      tab(title="date contact")
        p aici e frumos

  //- .widgets
  //-   widget(expand)
  //-     p omg
sction#nuExista(
  v-else,
  :title= "$t('apartament.inexistent.heading')"
)
  p {{ $t('apartament.inexistent.mesaj') }}
</template>

<script>
import sction from '~components/section'
import widget from '~components/widget'
import split from '~components/split'
import bani from '~components/bani'
import incaseaza from 'cc/butonIncaseaza'
import incasari from '~components/incasari'

import { mapGetters } from 'vuex'

export default {
  async asyncData ({ params, store, app: { $db, $dbSubs } }) {
  },
  async mounted () {
    const { $store: { $db }, $route: { params: { id }} } = this
    await $db.apartamente.findOne({ _id: id }).$.subscribe(async changes => {
      console.log('CHG', changes)
      // if (changes.incasari) this.incasari = await changes.incasari_
    })

    await $db.incasari.find({ deLa: id }).sort({ la: -1 }).$.subscribe(async changes => {
      if (changes) this.incasari = changes
    })
  },
  data () {
    return {
      incasari: []
    }
  },
  components: {
    bani,
    sction,
    widget,
    split,
    incasari,
    incaseaza
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
  &:before
    content ''
    position absolute 0
    bottom auto
    height 40vh
    background embedurl('~static/bgs/aphead.jpg')
    z-index 0

  .inner
    position relative
    z-index 1

  .header
    flex 1 1 100%
    max-height 100%
    height 100%
    align-items flex-start

    header
      box-shadow none
      background transparent

    .ap__info
      margin-bottom 32px

    > .right
      margin-left 32px
      flex 1 1 100%
      display flex
      flex-flow row wrap
      align-items flex-start

      .left
        display flex
        flex-flow row wrap
        flex 1 1 100%
        align-items flex-start

    .tabs
      width 100%
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

</style>
