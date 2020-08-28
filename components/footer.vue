<template lang="pug">
footer
  .inner
    slot
</template>

<style lang="stylus" scoped>
@require '~styles/config'

footer
  overflow hidden

  p
    margin-bottom 0
    line-height 40px
    font-size 10px
    color rgba(black, .25)

  &__stuff
    display flex
    flex-flow row nowrap
</style>
