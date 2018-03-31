<template lang="pug">
footer.footer
  .inner.split
    .left
      slot
    .right(v-if="$slots.right")
      slot(name="right")
</template>

<style lang="stylus">
@require '~styles/config'

.footer
  display none
  p
    margin-bottom 0
    line-height 24px
    font-size 10px
    color rgba(black, .25)

  &__stuff
    display flex
    flex-flow row nowrap
</style>
