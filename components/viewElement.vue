<template lang="pug">
.view
  strong(
    v-if="['name', 'proprietar', 'denumire'].indexOf(type) > -1"
  ) {{ value }}
  timp(
    v-else-if= "type === 'la'"
    :unixTime = "value"
    ago=  true
    liveUpdate= true
  )
  bani(
    v-else-if="['suma', 'bani', 'balanta'].indexOf(type) > -1"
    :valoare="value"
  )
  suprafata(
    v-else-if="type === 'suprafata'"
    :value="value"
  )
  span.ap__nr(
    v-else-if="type === 'nr'"
  ) {{ value }}
  span(v-else) {{ type }}: {{ value }}
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component';
import timp from 'c/dateTime'
import bani from 'c/bani'
import suprafata from 'c/suprafata'

@Component({
  props: {
    type: {
      type: String,
      default: null
    },
    value: {
      type: [Number, Object, Boolean, String],
      default: null
    }
  },
  components: {
    bani,
    timp,
    suprafata
  }
})
export default class ViewElement extends Vue {

}
</script>
