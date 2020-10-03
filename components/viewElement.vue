<template lang="pug">
strong(
  v-if="['name', 'proprietar', 'denumire'].indexOf(type) > -1"
  @click="$emit('click')"
) {{ value }}
timp(
  v-else-if= "['la', 'dataScadenta'].indexOf(type) > -1"
  :unixTime = "value"
  ago=  true
  liveUpdate= true
)
span.bani(
  v-else-if="['suma', 'bani', 'balanta'].indexOf(type) > -1"
  :valoare="value"
)
suprafata(
  v-else-if="type === 'suprafata'"
  :value="value"
)
servicii(
  v-else-if="type === 'servicii'"
  :value="value"
)
span.ap__nr(
  v-else-if="type === 'nr'"
) {{ value }}
span(v-else) {{ value }}
</template>

<script>
import timp from 'c/dateTime'
import bani from 'c/bani'
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
    }
  },
  components: {
    bani,
    timp,
    suprafata,
    servicii
  }
}
</script>
