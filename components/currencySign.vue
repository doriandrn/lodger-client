<template lang="pug">
span.sign(
  v-if= "moneda > 0 && $L.currencies.indexOf(moneda) > -1 && monedaData"
  v-tooltip=  "env === 'development' ? monedaData.name : undefined"
) {{ $l.isCrypto(moneda) ? monedaData.symbol : monedaData.sign }}
</template>

<script>
import { Observer } from 'mobx-vue'

export default Observer({
  computed: {
    env () {
      return process.env.NODE_ENV
    },
    monedaData () {
      return this.$L.currencyList[this.$l.isCrypto(this.moneda) ? 'cryptocurrency' : 'fiat'][this.moneda]
    },
  },
  props: {
    moneda: {
      type: Number,
      default: -1
    }
  }
})
</script>

<style lang="stylus">
.sign
  margin-left 4px
</style>
