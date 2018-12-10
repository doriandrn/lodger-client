<template lang="pug">
span.suprafata {{ value }} #[em m #[sup 2]]

</template>

<script>
import Vue from 'vue'
export default Vue.extend({
  props: {
    value: {
      type: Number,
      default: 0
    }
  }
})
</script>
