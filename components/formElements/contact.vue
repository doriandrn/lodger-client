<template lang="pug">
.contact
  vue-tel-input(
    v-for=  "t in value.tel"
    :value= "t"
    :disabled=  "disabled"
    @validate=  "debug($event)"
    @input=  "debug($event)"
  )
  button.new(@click="tel.push()" v-if="!disabled") +
</template>

<script>
import { VueTelInput } from 'vue-tel-input'

export default {
  props: {
    value: {
      type: Object,
      default () {
        return {
          tel: ['0751429489'],
          email: []
        }
      }
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  components: {
    VueTelInput
  }
}
</script>
