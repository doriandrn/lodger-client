<template lang="pug">
ul.incasari.zebra
  li(v-for="incasare in incasari")
    split(
      v-if="apartamente[incasare.deLa]"
      collapsable
    )
      ap(
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
import ap from 'struct/apartament'
import bani from '~components/bani'
import { mapGetters } from 'vuex'

export default {
  data () {
    return {
      index: 0
    }
  },
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
    limita: {
      type: Number,
      default: 2
    },
    showAdresa: {
      type: Boolean,
      default: true
    }
  },
  components: {
    dateTime,
    split,
    ap,
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
