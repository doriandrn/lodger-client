<template lang="pug">
ul.incasari.zebra
  li(v-for="incasare in incasari")
    split(
      v-if="apartamente[incasare.deLa]"
      collapsable
    )
      adresa(
        v-if=   "showAdresa"
        :apId=  "incasare.deLa"
      )

      .incasare__detalii(slot="right")
        bani(:valoare="incasare.suma")
        date-time(
          :unixTime="incasare.la"
        )
</template>

<script>
import dateTime from '~components/dateTime'
import split from '~components/split'
import adresa from '~components/adresa'
import bani from '~components/bani'
import { mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters({
      blocuri: 'blocuri',
      apartamente: 'apartamente'
    })
  },
  props: {
    incasari: {
      type: [Array, Object],
      default () {
        return []
      }
    },
    showAdresa: {
      type: Boolean,
      default: true
    }
  },
  components: {
    dateTime,
    split,
    adresa,
    bani
  }
}
</script>

<style lang="stylus">
@require '~styles/config'

.incasari
  list-style-type none
  padding 0
  display flex
  flex-flow column nowrap

  > li
    max-width 480px
    margin 0 auto
    width 100%

    > div
      padding 8px 12px

  .split
    align-items flex-start
    .left
      flex-flow column nowrap
      align-items flex-start
</style>
