<template lang="pug">
.bani(v-if="moneda && base && $l.rates[base] && $l.rates[moneda]")
  span(v-if="showBoth")
    input(
      v-if=         "!disabled"
      type=         "number"
      :value=       "disabled ? null : suma || 0"
      :step=        "$l.isCrypto(moneda) ? 0.000000001 : 0.01"
      :disabled=    "disabled"
      :placeholder= "disabled ? this.$l.format(suma, moneda) : $l.isCrypto(moneda) ? '0,00000000' : '0,00'"
      @input=      "change($event, true)"
    )
    span(v-else) {{ $l.format(suma, moneda) }}

    currency-select(
      v-if=     "schimbaMoneda && !disabled"
      :value=   "moneda"
      @input=   "change($event, false)"
      hide-label
    )
    currency-sign(
      v-if=       "!schimbaMoneda"
      :moneda=    "moneda"
      :isCrypto=  "$l.isCrypto(moneda)"
    )

  span.conv(
    :class= "{ neg }"
    v-if="moneda === base && !showBoth || moneda !== base"
  ) {{ base !== moneda ? '~ ' : '' }}{{ $l.format($l.convert(suma, moneda)) }}
    currency-sign(
      :moneda= "$l.displayCurrency"
      :isCrypto="$l.isCrypto()"
    )

  div(v-if="!disabled")
    a(@click=  "schimbaMoneda = !schimbaMoneda") {{ $l.i18n.changeCurrency }}
</template>

<script>
import { Observer } from 'mobx-vue'

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
    change (e, inputChanged) {
      this.schimbaMoneda = false
      let value, moneda
      if (inputChanged) {
        value = Number(e.target.value)
        moneda = this.moneda
      } else {
        if (this.valoare) {
          value = Number(this.valoare.value) || 0
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
      default: function () {
        this.base !== this.moneda
      }
    },
    disabled: {
      type: Boolean,
      default: true
    },
    base: {
      type: Number,
      default () {
        return Number(this.$l.displayCurrency)
      }
    }
  },
  computed: {
    apiBase () {
      return 2781
    },
    rates () {
      return this.$l.rates
    },
    suma () {
      if (!this.valoare)
        return 0

      return this.valoare.value !== undefined ? Number(this.valoare.value) || 0 : this.valoare
    },
    moneda () {
      return this.monedaCustom && this.monedaCustom > 0 ?
        this.monedaCustom :
        Number(this.valoare && this.valoare.moneda ?
          this.valoare.moneda :
          this.$l.displayCurrency
        )
    },
    neg () {
      return this.suma < 0
    }
  }
})
</script>

<style lang="stylus">
@require '~styles/config'

.bani
[data-type="$"]
  input
    padding-right 4px !important

    &:disabled
      &::placeholder
        opacity 1 !important
        visibility visible !important
        color black
        font-weight 600

.bani
  > span
    display flex
    flex-flow row nowrap
    white-space nowrap
    align-items center
    font-size 13px
    line-height 16px
    letter-spacing 1px
    justify-content flex-end
    text-align right
    margin-left auto

    &+span.conv
      margin-top 4px

    &:before
      background-color: config.palette.tertiary

    *.poz
      color: config.palette.tertiary

    &.neg
      color: config.palette.error
</style>
