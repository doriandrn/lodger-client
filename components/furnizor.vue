<template lang="pug">
span.furnizor(v-if="furnizor")
  span.nume.furnizor__nume {{ furnizor.nume }}
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

</style>
