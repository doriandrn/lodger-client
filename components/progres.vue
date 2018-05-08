<template lang="pug">
span.progres
  span(:data-procent="`${procent}%`")
</template>
  
<script>
export default {
  props: {
    procent: {
      type: Number,
      default: 0
    }
  }
}
</script>

<style lang="stylus">
@require '~styles/config'

.progres
  display flex
  flex-flow row nowrap
  border-radius 5px
  height 5px
  border: 1px solid config.palette.borders
  width 100%
  overflow hidden

  > span
    flex-grow 0
    flex-shrink 0
    flex-basis attr(data-procent)
    background yellow
</style>
