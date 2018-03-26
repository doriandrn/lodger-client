<template lang="pug">
ul.incasari
  li(v-for="incasare in incasari")
    split(
      v-if="apartamente[incasare.deLa]"
      collapsable
    )
      adresa(
        :bloc=  "blocuri[apartamente[incasare.deLa].bloc]",
        :scara= "apartamente[incasare.deLa].scara",
        :etaj=  "apartamente[incasare.deLa].etaj",
        :nrAp=  "String(apartamente[incasare.deLa].nr)"
      )
      nuxt-link.deLa.nume(:to="`apartament/${apartamente[incasare.deLa]._id}`") {{ apartamente[incasare.deLa].proprietar }}
      date-time(:unixTime="incasare.la")
      bani(
        slot="right"
        :valoare="incasare.suma"
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
      incasari: 'incasari',
      blocuri: 'blocuri',
      apartamente: 'apartamente'
    })
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
  .split
    align-items flex-start
    .left
      flex-flow column nowrap
      align-items flex-start
</style>
