<template lang="pug">
div
  span(v-if="showBoth")
    input(
      type=       "number"
      :value=     "suma"
      :disabled=  "disabled"
      @change=    "change($event, true)"
    )

    currency-select(
      v-if=  "schimbaMoneda"
      :value= "moneda"
      @input= "change($event, false)"
      hide-label
    )
    currency-sign(v-else :moneda="moneda")

  div(v-if="!disabled")
    a(@click=  "schimbaMoneda = !schimbaMoneda") {{ $lodger.i18n.changeCurrency }}

  span.bani.conv(
    v-if="moneda && base && moneda !== base && $lodger.rates[base] && $lodger.rates[moneda]"
  ) ~ {{ numeral(convert(suma, { from: moneda, to: base, rates: $lodger.rates, base })).format(isCrypto ? '0,0[.]00000000' : '0,0[.]00') }} #[currency-sign(:moneda= "Number($Lodger.displayCurrency)")]

</template>

<script>
import numeral from 'numeral'
import { Observer } from 'mobx-vue'
import { parse, convert } from 'cashify'

import currencySelect from 'form/presets/selects/currencies'
import currencySign from 'c/currencySign'

export default Observer ({
  data () {
    return {
      schimbaMoneda: false,
      monedaCustom: -1
    }
  },
  methods: {
    numeral,
    convert,
    change (e, inputChanged) {
      this.debug('shitt')
      this.schimbaMoneda = false
      let value, moneda
      if (inputChanged) {
        this.debug('wff')
        value = Number(e.target.value)
        moneda = this.moneda
      } else {
        if (this.valoare) {
          value = Number(this.valoare.value)
        }
        this.monedaCustom = moneda = Number(e)
      }
      this.$emit('input', { value, moneda })
    }
  },
  components: {
    currencySelect,
    currencySign
  },
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
    isCrypto () {

    },
    suma () {
      if (this.valoare)
        return Number(this.valoare.value)
    },
    moneda () {
      const { monedaCustom } = this
      return monedaCustom && monedaCustom > 0 ? monedaCustom : Number(this.valoare ? this.valoare.moneda : this.$Lodger.displayCurrency)
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
