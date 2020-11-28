<template lang="pug">
span.sign(
  v-if= "moneda > 0 && $Lodger.currencies.indexOf(moneda) > -1 && monedaData"
) {{ isCrypto ? monedaData.symbol : monedaData.sign || 'pula' }}
</template>

<script>
import { Observer } from 'mobx-vue'

export default Observer({
  computed: {
    monedaData () {
      return this.$Lodger.currencyList[this.isCrypto ? 'cryptocurrency' : 'fiat'][this.moneda]
    },
    isCrypto () {
      return Object.keys(this.$Lodger.currencyList.cryptocurrency).map(n => Number(n)).indexOf(this.moneda) > -1
    }
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
