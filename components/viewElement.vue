<template lang="pug">
strong(
  v-if="['name', 'proprietar', 'denumire', 'nrChitanta'].indexOf(type) > -1"
  @click="$emit('click')"
) {{ value }}
timp(
  v-else-if=  "['la', 'dataScadenta'].indexOf(type) > -1"
  :unixTime = "value"
  ago=  true
  liveUpdate= true
)
bani(
  v-else-if=    "['suma', 'bani', 'balanta', '$', 'impartire'].indexOf(type) > -1"
  :class=       "{ impartire: type === 'impartire', zero: !value }"
  :valoare=     "type === 'impartire' && formData && formData.suma ? { value: -(value), moneda: formData.suma.moneda } : value && value.suma ? value.suma : undefined"
  :showBoth=    "type=== 'impartire' && formData && formData.suma && formData.suma.moneda !== $l.displayCurrency"
)
suprafata(
  v-else-if=  "type === 'suprafata'"
  :value="value"
)
servicii(
  v-else-if=  "type === 'servicii'"
  :value="value"
)
span.ap__nr(
  v-else-if=  "type === 'nr'"
) {{ value }}

span.scari(
  v-else-if=  "type === 'scari' && value"
) {{ value.length }} scari

avatar(
  v-else-if=  "type === 'avatar'"
  :seed=    "value"
  :value=   "value"
  disabled
)
.counters(
  v-else-if=  "type === 'state' && value && value.counters"
  v-show= "value.counters && Object.keys(value.counters).map(k => value.counters[k]).filter(v => v > 0).length"
)
  span(v-for="counter, rel in value.counters" v-if="counter > 0" :data-w="rel") {{ counter }}
span(
  v-else
  :class="type"
  :data-icon="type === 'locatari' ? 'users' : undefined"
) {{ value }}
</template>

<script>
import timp from 'c/dateTime'
import bani from 'c/bani'
import avatar from 'c/avatar'
import suprafata from 'c/suprafata'
import servicii from 'c/servicii'

export default {
  props: {
    type: {
      type: String,
      default: null
    },
    value: {
      type: [Number, Object, Boolean, String, Array],
      default: null
    },
    formData: {
      type: Object,
      default: null
    }
  },
  components: {
    avatar,
    bani,
    timp,
    suprafata,
    servicii
  }
}
</script>

<style lang="stylus">
.locatari[data-icon="users"]
  &:before
    background-color #666
    position relative
    top 4px
    margin-right 4px
    mask-size 12px
</style>

