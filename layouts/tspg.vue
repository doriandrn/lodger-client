<template lang="pug">
#playground
  headr
  main
    nuxt

  toasts
</template>

<script lang="ts">
import Vue from 'vue'
import toasts from 'c/toasts'
import headr from 'c/header'
import Component from 'vue-class-component'

@Component({
  components: {
    toasts,
    headr
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
