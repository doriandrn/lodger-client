<template lang="pug">
.contoare
  p(v-if="status") contoare
  div(
    v-else
    @click= "status = 1"
  ) Necontorizabil
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
  flex 1 1 100%
  p
    background yellow
</style>
