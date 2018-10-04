<template lang="pug">
span.bani(
  :class="{ negativ: suma < 0 }"
) {{ numeral(suma).format('0,0[.]00') }} {{ moneda }}
</template>

<script>
import { mapGetters } from 'vuex'
import numeral from 'numeral'

export default {
  methods: { numeral },
  props: {
    valoare: {
      type: [Number, Object],
      default: 0
    }
  },
  computed: {
    suma () {
       return typeof this.valoare === Number ?
        this.valoare :
        this.valoare.suma
    },
    moneda () {
      const def = 'ron'
      return typeof this.valoare === Number ?
        def :
        this.valoare.moneda || def
    }
  }
}
</script>

<style lang="stylus">
@require '~styles/config'

.bani
  display flex
  flex-flow row nowrap
  white-space nowrap
  text-transform uppercase
  align-items center
  font-size 11px
  letter-spacing 1px
  color: config.palette.tertiary
  justify-content flex-end
  text-align right

  &:before
    background-color: config.palette.tertiary

  &.negativ
    color: config.palette.error
</style>
