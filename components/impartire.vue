<template lang="pug">
bani.impartire(:valoare="-(lastVal)" :data-v="val" v-show="lastVal !== 0")
</template>

<script>
import bani from 'c/bani'

export default {
  components: {
    bani
  },
  data () {
    return {
      lastVal: 0
    }
  },
  props: {
    value: {
      type: Number,
      default: 0
    }
  },
  // watch: {
  //   value: function (newv) {
  //     this.lastVal = newv
  //   }
  // }
  computed: {
    val () {
      if (this.value === undefined || this.value === 0)
        return

      this.lastVal = this.value
    }
  }
}
</script>

<style lang="stylus">
.impartire
  .sign
    opacity 0
    visibility hidden
</style>
