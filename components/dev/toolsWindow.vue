<template lang="pug">
div.dev(@click="mini = !mini")
  h6 Lodger DevTools

  p hola
</template>

<script>
export default {
  data () {
    return {
      mini: true
    }
  }
}
</script>

<style lang="stylus">
.dev
  position fixed
  left 0
  bottom 0
  background darken(green, 95%)
  padding 20px
  width 290px
  color white

  h6
  p
    color white
</style>
