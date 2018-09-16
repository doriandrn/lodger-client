<template lang="pug">
#playground
  h1 PLAYGROUND, crazy shit only
  main
    nuxt

  toasts
</template>

<script lang="ts">
import Vue from 'vue'
import toasts from 'c/toasts'
import Component from 'vue-class-component'

@Component({
  components: {
    toasts
  }
})
export default class TSPGLayout extends Vue {
  beforeCreate () {
    // this.$store.registerModule('LodgerStore', this.$lodger.store)
    this.debug(this.$lodger)
    // this.$store = this.$lodger.store
  }

  async beforeDestroy () {
    await this.$lodger.destroy()
  }
}
</script>
