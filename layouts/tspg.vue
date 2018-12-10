<template lang="pug">
#playground
  headr
  main
    nuxt

  toasts
</template>

<script>
import toasts from 'c/toasts'
import headr from 'c/header'

export default {
   components: {
    toasts,
    headr
  },
  beforeCreate () {
    // this.$store.registerModule('LodgerStore', this.$lodger.store)
    this.debug(this.$lodger)
    // this.$store = this.$lodger.store
  },
  methods: {
    async beforeDestroy () {
      await this.$lodger.destroy()
    }
  }
}
</script>
