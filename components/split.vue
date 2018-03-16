<template lang="pug">
.split
  .left
    slot
  .right(v-if="$slots.right")
    slot(name="right")
</template>

<style lang="stylus">
@require '~styles/config'

.split
  display flex
  flex-flow row nowrap

  > *
    display flex
    flex-flow row nowrap
    align-items center

  .right
    margin-left auto

    > *:not(:first-child)
      margin-left 8px

  .left
    margin-right: config.spacings.betweenBoxes
    
    > *:not(:first-child)
      margin-left: baseSpacingUnit*8
      padding-left: baseSpacingUnit*8
      border-left: 1px solid config.palette.borders

    > *
      margin-bottom 0
</style>