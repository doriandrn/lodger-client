<template lang="pug">
span.sign(
  v-if= "moneda > 0 && $Lodger.currencies.indexOf(moneda) > -1 && monedaData"
  v-tooltip=  "env === 'development' ? monedaData.name : undefined"
) {{ $lodger.isCrypto(moneda) ? monedaData.symbol : monedaData.sign }}
</template>

<script>
import { Observer } from 'mobx-vue'

export default Observer({
  computed: {
    env () {
      return process.env.NODE_ENV
    },
    monedaData () {
      return this.$Lodger.currencyList[this.$lodger.isCrypto(this.moneda) ? 'cryptocurrency' : 'fiat'][this.moneda]
    },
  },
  props: {
    moneda: {
      type: Number,
      default: -1
    },
    // isCrypto: {
    //   type: Boolean,
    //   default: false
    // }
  }
})
</script>

<style lang="stylus">
.sign
  margin-left 4px
</style>
