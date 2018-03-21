<template lang="pug">
.split(:data-separate="separate", :data-collapsable="collapsable")
  .left
    slot
  .right(v-if="$slots.right")
    slot(name="right")
</template>

<script>
export default {
  props: {
    separate: {
      type: Boolean,
      default: null
    },
    collapsable: {
      type: Boolean,
      default: false
    }
  }
}
</script>

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

  &[data-separate]
    .right
      > *:not(:first-child)
        margin-left: config.spacings.betweenBoxes

    .left
      margin-right: config.spacings.betweenBoxes
      
      > *:not(:first-child)
        margin-left: baseSpacingUnit*8
        padding-left: baseSpacingUnit*8
        border-left: 1px solid config.palette.borders

      > *
        margin-bottom 0
</style>