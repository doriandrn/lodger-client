<template lang="pug">
//- :title= "`Apartamentul ${ap.nr}`"
sction.ap(
  v-if=   "ap && ap.nr"
)
  split.ap__header
    .ap__usa
      .nr.ap__nr {{ ap.nr }}
      h5.nume {{ ap.proprietar }}

    split(slot="right").ap__info
      .camp
        label.balanta(data-icon="target") balanta 
        bani(:valoare="ap.balanta")

      .camp
        label(data-icon="circle") suprafata
        span {{ ap.suprafata }}

      .camp
        label utilitati
        span {{ ap.utilitati || '~' }}

      .camp
        label(data-icon="users") locatari
        span {{ ap.locatari || '~' }}

      incaseaza(
        slot=   "right",
        :id=    "$route.params.id"
      )

  .ap__content
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

      tab(
        title="date contact"
        icon= "mail"
      )
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

.ap
  background-color #574c6c

  &:before
    content ''
    position absolute 0
    bottom auto
    height 40vh
    background embedurl('~static/bgs/aphead.jpg')
    background-size contain
    z-index 0
    opacity .35

  .inner
    position relative
    z-index 1

  &__info
    margin-bottom 32px
    align-items flex-start

    +desktop()
      margin-top 21px

  &__usa
    // background: config.palette.bgs.body
    // background #504b4b
    // background #393434
    background white
    // background #cbcaca
    padding 50px 12px 12px
    margin-top 36px
    width 160px
    height 280px
    display flex
    flex-flow column nowrap
    align-items center
    justify-content flex-start
    position relative
    border: 1px solid rgba(black, .175)
    border-bottom 0
    box-shadow inset 0px 16px 50px -10px rgba(black, .33)

    .nume
      // color white
      color: config.typography.palette.headings
      font-size 14px
      line-height 16px

    > *
      position relative
      z-index 1
      text-align center

    .nr
      margin-bottom 12px

    &:before
      content ''
      position absolute -20px -24px 0
      // background #f4f4f1
      background #f2f4f1
      // background #f9f9f8
      z-index -1
      border-top-radius 2px
      border-top 1px solid white
      box-shadow 0px 1px 10px 0px rgba(black, .1)


  &__content
    flex 1 1 100%
    position relative
    z-index 3

    .tab
      background white

      padding 32px

    // &:before
    //   content ''
    //   position absolute 0
    //   z-index 0


    > *
      position relative
      z-index 4

  &__header
    flex 0 1 40%
    max-height 100%
    height 100%
    align-items flex-start
    position relative
    min-height 300px

    &:before
      content ''
      height 46px
      position absolute
      bottom -46px
      left -100%
      right -100%
      z-index 2
      border-top 1px solid white
      background: config.palette.bgs.body

    header
      box-shadow none
      background transparent

    > .right
      margin-left 32px
      padding-top 32px
      flex 1 1 100%
      display flex
      flex-flow row wrap
      align-items flex-start

      +desktop()
        margin-left 90px

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
      flex-flow column nowrap
      margin-right 32px
      // height 60px
      // background white
      // padding 20px
      min-width 90px
      

      label
        display block
        flex 0 0 32px
        color: config.typography.palette.meta
        size 32px
        font-size 0
        background rgba(black, .1)
        border-radius 50%
        margin-bottom 8px

        &:before
          position absolute
          left 50%
          top 50%
          transform translate(-50%, -50%)
          size 32px
          margin 0
          mask-size 20px
          mask-position 50% 50%
          opacity .25

        &+*
          font-size 24px
          color white
          margin-left 9px
          text-shadow 0px 1px 3px rgba(black, .33)

</style>
