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

  .left
    flex 1 1 100%

    > *
      flex 1 1 auto

  .right
    margin-left auto
    flex 1 1 55%
    justify-content flex-end

    .dropdown
      &[data-box-arrow]
        &:before
          right 13px
          left auto
          z-index 99

        &:after
          right 14px
          left auto
          z-index 100

  &[data-separate]
    .right
      > *:not(:first-child)
        margin-left: config.spacings.betweenBoxes

    .left
      margin-right: config.spacings.betweenBoxes
      
      > *:not(:first-child)
        margin-left: baseSpacingUnit*8
        padding-left: baseSpacingUnit*8
        
        &:before
          content ''
          position absolute
          left 0
          height 12px
          width 1px
          background: config.palette.borders
          z-index 1
          top 50%
          transform translateY(-50%)

      > *
        margin-bottom 0
        position relative
</style>