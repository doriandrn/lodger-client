<template lang="pug">
#playground
  h1 PLAYGROUND, crazy shit only
  main
    nuxt
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  async beforeDestroy () {
    await this.$lodger.destroy()
  }
})
</script>
