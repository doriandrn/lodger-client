<template lang="pug">
field.currency(
  type=       "select"
  :id=        "id"
  :label=     "$lodger.i18n.forms.preferences.fields.currency"
  :hideLabel= "hideLabel"

  :options=   "$Lodger.currencyList"
  :value=     "value"
  :style=     "symbolsNames"
  :optGrpLabels=    "$lodger.i18n.forms.preferences.currencies"
  @input=     "$emit('input', Number($event))"
)
</template>

<script>
export default {
  beforeCreate () {
    this.$options.components.field = require('form/field').default
  },
  computed: {
    symbolsNames () {
      const symNames = {}
      const list = this.$Lodger.currencyList
      Object.keys(list).forEach(e => {
        Object.keys(list[e]).forEach(id => {
          const d = list[e][id]
          const { name, symbol } = d
          symNames[`--${symbol}`] = "'" + name + "'"
        })
      })
      return symNames
    },
    symbols () {
      return Object.keys(this.symbolsNames)
    }
  },
  props: {
    id: {
      type: String,
      default: 'currency'
    },
    hideLabel: {
      type: Boolean,
      default: false
    },
    value: {
      type: Number,
      default: null
    }
  }
}
</script>

<style lang="stylus">
// symbolsNames = json('symbols-names.json')
// currencies = keys(symbolsNames)

currencies = RON EUR USD AED AFN ALL AMD ANG AOA ARS AUD AWG AZN BAM BBD BDT BGN BHD BIF BMD BND BOB BRL BSD BTN BWP BYN BZD CAD CDF CHF CLP CNY COP CRC CUP CVE CZK DJF DKK DOP DZD EGP ERN ETB FJD FKP GBP GEL GHS GIP GMD GNF GTQ GYD HKD HNL HRK HTG HUF IDR ILS INR IQD IRR ISK JMD JOD JPY KES KGS KHR KMF KPW KRW KWD KYD KZT LAK LBP LKR LRD LTL LYD MAD MDL MGA MKD MMK MNT MOP MRO MUR MVR MWK MXN MYR MZN NAD NGN NIO NOK NPR NZD OMR PAB PEN PGK PHP PKR PLN PYG QAR RSD RUB RWF SAR SBD SCR SEK SGD SHP SLL SOS SRD STD SVC SSP SYP SZL THB TJS TND TOP TRY TTD TWD TZS UAH UGX UYU UZS VEF VES VND VUV WST XAF XCD XOF XPF YER ZAR ZMW

cryptos = BTC LTC NANO ETH XRP DGB DASH XMR XLM XEM WAVES ZEC SNT
x = rawVar
.currency
  .body
    width 230px
    left auto

  .value
    &:before
      content attr(textContent)

  [role="group"]
    > div[title]
      position relative
      display flex
      flex-flow row nowrap
      align-items center

      &:before
        content ''
        display inline-block
        vertical-align middle
        background-repeat no-repeat
        background-size 100%
        background-position 50% 50%
        width 24px
        height 24px
        flex 0 0 24px
        border-radius 4px
        margin-right 4px
        position relative
        transform scale(.85)
        order -2

      &:after
        content '???'
        flex 0 1 calc(100% - 70px)
        margin-right auto
        overflow hidden
        white-space nowrap
        text-overflow ellipsis
        order -1
        color #333
        font-weight 500
        text-align left

      &:hover
      &:focus
        &:after
          color white

    for c in currencies
      lc = lowerCase(c)
      div[title={c}]
        &:before
          height 16px
          background-color rgba(black, .1)
          background-image: url('~static/icons/flags/' + lc + '.png')
          box-shadow 0px 2px rgba(black, .15)

        &:after
          content var(s('--' + c))

    for c in cryptos
      lc = lowerCase(c)
      div[title={c}]
        &:before
          background-image: url('~static/icons/cryptos/' + lc + '@2x.png')

        &:after
          content var(s('--' + c))
</style>
