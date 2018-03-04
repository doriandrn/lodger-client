<template lang="pug">
footer
  .inner.split
    .left
      slot
    .right(v-if="$slots.right")
      slot(name="right")
</template>

<style lang="stylus">
@require '~styles/config'

#layout > footer
  position fixed
  bottom 0
  left 0
  right 0
  height 24px
  line-height 24px
  z-index -1
  background: config.palette.borders

  p
    margin-bottom 0
    line-height 24px
    font-size 10px
    color rgba(black, .25)
</style>
