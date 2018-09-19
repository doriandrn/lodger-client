<template lang="pug">
span.view
  timp(
    v-if= "type === 'la'"
    :unixTime = "value"
    ago=  true
    liveUpdate= true
  )
  bani(
    v-else-if="['suma', 'bani', 'balanta'].indexOf(type) > -1"
    :valoare="value"
  )
  span.ap__nr(
    v-else-if="type === 'nr'"
  ) {{ value }}
  strong(v-else) {{ value }}
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component';
import timp from 'c/dateTime'
import bani from 'c/bani'

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
    timp
  }
})
export default class ViewElement extends Vue {
 
}
</script>
