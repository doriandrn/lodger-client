<template lang="pug">
.contoare
  div(
    @click= "status = 1"
  ) Necontorizabil
  p(v-if="status") contoare
</template>

<script>
import buton from 'form/button'

export default {
  data () {
    return {
      status: 0
    }
  },
  components: {
    buton
  }
}
</script>

<style lang="stylus">
@require '~styles/config'

.contoare
  background yellow
</style>
