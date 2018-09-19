<template lang="pug">
span.view
  timp(
    v-if= "type === 'la'"
    :unixTime = "value"
    ago=  true
    liveUpdate= true
  )
  bani(
    v-else-if="type === 'bani'"
  )
  p insert an el here!!!!
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
      type: [Number, Object, Boolean],
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
