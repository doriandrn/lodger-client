<template lang="pug">
//- span.bani(
//-   v-if= "valoare"
//-   :class="{ negativ: suma < 0 }"
//- ) {{ numeral(suma).format('0,0[.]00') }} {{ moneda }}

div
  span(v-if="showBoth")
    input(
      type="text"
      :value="suma"
      @change="$emit('input', `${$event.target.value} ${moneda}`)"
    )
    .select {{ moneda }}
  span.bani.conv(
    v-if="moneda && base && moneda !== base"
  ) ~ {{ numeral(convert(suma, { from: moneda, to: base, rates: $lodger.rates, base })).format(isCrypto ? '0,0[.]00000000' : '0,0[.]00') }} {{ $Lodger.displayCurrency }}

</template>

<script>
import numeral from 'numeral'
import { Observer } from 'mobx-vue'
import { parse, convert } from 'cashify'

export default Observer ({
  methods: { numeral, convert },
  props: {
    valoare: {
      type: String,
      default: null
    },
    showBoth: {
      type: Boolean,
      default: false
    },
    base: {
      type: String,
      default () {
        return this.$Lodger.displayCurrency
      }
    }
  },
  mounted () {
    console.log(this.base, this.moneda, this.$lodger.rates)
  },
  computed: {
    parsed () {
      return parse(this.valoare)
    },
    suma () {
      return this.parsed.amount
      //  return typeof this.valoare === Number ?
      //   this.valoare :
      //   this.valoare.suma
    },
    isCrypto () {
      return ['BTC', 'NANO', 'LTC', 'ETH', 'DASH', 'BCH', 'XRP', 'CLP', 'TEL', 'DAI', 'USDT', 'AVA'].indexOf(this.base) > -1
    },
    moneda () {
      return this.parsed.from
    },
    convertedSum () {
      const { suma, moneda, base, $lodger: { rates }} = this
      return convert(suma, { from: moneda, to: base, rates, base })
    }
  }
})
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
  justify-content flex-end
  text-align right

  &:before
    background-color: config.palette.tertiary

  *.poz
    color: config.palette.tertiary

  &.neg
    color: config.palette.error
</style>
