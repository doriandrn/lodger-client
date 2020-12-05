<template lang="pug">
.impartire {{ lastVal }}
</template>

<script>
export default {
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
  computed: {
    val () {
      const { value } = this
      if (!value)
        return
      this.lastVal = value
    }
  }
}
</script>
