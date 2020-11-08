<template lang="pug">
div
  span(v-if="showBoth")
    input(
      type=   "text"
      :value= "suma"
      :disabled=  "disabled"
      @change="$emit('input', `${$event.target.value} ${moneda}`)"
    )
    currency-select(
      hide-label
      :value= "moneda"
    )
  span.bani.conv(
    v-if="moneda && base && moneda !== base && $lodger.rates[base] && $lodger.rates[moneda]"
  ) ~ {{ numeral(convert(suma, { from: moneda, to: base, rates: $lodger.rates, base })).format(isCrypto ? '0,0[.]00000000' : '0,0[.]00') }} {{ $Lodger.displayCurrency }}

</template>

<script>
import numeral from 'numeral'
import { Observer } from 'mobx-vue'
import { parse, convert } from 'cashify'
import currencySelect from 'form/presets/selects/currencies'

export default Observer ({
  methods: { numeral, convert },
  components: { currencySelect },
  props: {
    valoare: {
      type: [String, Object, Number],
      default: null
    },
    showBoth: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: true
    },
    base: {
      type: String,
      default () {
        return this.$Lodger.displayCurrency
      }
    }
  },
  mounted () {
    this.debug('$$', this.base, this.moneda, this.$lodger.rates)
  },
  computed: {
    parsed () {
      const { valoare } = this
      if (!valoare) return
      return parse(typeof valoare === 'string' ? valoare : Object.values(valoare).join(' '))
    },
    suma () {
      if (this.parsed && this.parsed.from)
        return this.parsed.amount
      else if (this.valoare)
        return String(this.valoare).split(' ')[1]
      //  return typeof this.valoare === Number ?
      //   this.valoare :
      //   this.valoare.suma
    },
    isCrypto () {
      return Object.keys(this.$Lodger.currencyList.cryptocurrency).indexOf(this.moneda) > -1
    },
    moneda () {
      if (this.parsed && this.parsed.from)
        return this.parsed.from
      else if (this.valoare)
        return Number(String(this.valoare).split(' ')[0])
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

[data-type="$"]
  input
    padding-right 4px !important

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
