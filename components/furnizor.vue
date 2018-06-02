<template lang="pug">
.furnizor(v-if="furnizor")
  h6.nume.furnizor__nume {{ furnizor.nume }}
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  computed: {
    furnizor () {
      return this.furnizori[this.id]
    },
    ...mapGetters({
      furnizori: 'furnizori'
    })
  },
  props: {
    id: {
      type: String,
      default: null
    }
  }
}
</script>

<style lang="stylus">
.furnizor
  padding 4px 8px
</style>
