<template lang="pug">
div
  span(v-if="showBoth")
    input(
      type=       "number"
      :value=     "suma"
      :disabled=  "disabled"
      :placeholder= "isCrypto ? '0,00000000' : '0,00'"
      @change=    "change($event, true)"
    )

    currency-select(
      v-if=  "schimbaMoneda"
      :value= "moneda"
      @input= "change($event, false)"
      hide-label
    )
    currency-sign(v-else :moneda="moneda")

  span.bani.conv(
    v-if="moneda && base && moneda !== base && $lodger.rates[base] && $lodger.rates[moneda]"
  ) {{ Number($lodger.displayCurrency) !== this.moneda ? '~ ' : '' }}{{ numeral(convert(suma, { from: Number($lodger.displayCurrency), to: moneda, rates, base: apiBase })).format(isCrypto($lodger.displayCurrency) ? '0,0[.]00000000' : '0,0[.]00') }} #[currency-sign(:moneda= "Number($lodger.displayCurrency)")]

  div(v-if="!disabled")
    a(@click=  "schimbaMoneda = !schimbaMoneda") {{ $lodger.i18n.changeCurrency }}
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
    isCrypto (moneda) {
      return this.$Lodger.currencyList.cryptocurrency.map(c => c.id).indexOf(Number(moneda)) > -1
    },
    change (e, inputChanged) {
      this.schimbaMoneda = false
      let value, moneda
      if (inputChanged) {
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
      type: Number,
      default () {
        return Number(this.$lodger.displayCurrency)
      }
    }
  },
  computed: {
    apiBase () {
      return 2781
    },
    rates () {
      return this.$lodger.rates
    },
    suma () {
      if (this.valoare)
        return Number(this.valoare.value)
    },
    moneda () {
      return this.monedaCustom && this.monedaCustom > 0 ?
        this.monedaCustom :
        Number(this.valoare ?
          this.valoare.moneda :
          this.$lodger.displayCurrency
        )
    },
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
  align-items center
  font-size 13px
  line-height 16px
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
