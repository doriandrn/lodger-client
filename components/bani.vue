<template lang="pug">
span.bani(
  :class="{ negativ: valoare < 0 }"
) {{ numeral(valoare).format('0,0[.]00') }} {{ moneda }}
</template>

<script>
import { mapGetters } from 'vuex'
import numeral from 'numeral'

export default {
  methods: { numeral },
  props: {
    valoare: {
      type: Number,
      default: 0
    },
    moneda: {
      type: String,
      default: null,
      required: true
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
