<template lang="pug">
span.sign(
  v-if= "moneda > 0 && $Lodger.currencies.indexOf(moneda) > -1"
) {{ isCrypto ? monedaData.symbol : monedaData.sign }}
</template>

<script>
import { Observer } from 'mobx-vue'

export default Observer({
  computed: {
    isCrypto () {
      return this.$Lodger.currencyList.cryptocurrency.map(c => c.id).indexOf(this.moneda) > -1
    },
    monedaData () {
      return this.$Lodger.currencyList[this.isCrypto ? 'cryptocurrency' : 'fiat'].filter(c => c.id === this.moneda)[0]
    }
  },
  props: {
    moneda: {
      type: Number,
      default: -1
    }
  }
})
</script>
