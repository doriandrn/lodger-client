<template lang="pug">
header.ui
  slot
</template>

<script>
import split from 'c/split'

export default {
  components: {
    split
  },
  props: {
    split: {
      type: Boolean,
      default: true
    }
  }
}
</script>

<style lang="stylus">
@require '~styles/config'
header
  background: config.palette.bgs.body
  line-height: baseSpacingUnit*12
  // box-shadow: config.shadows.header

  select
    appearance none
    background transparent
    max-width 180px

    &:before
      content: 'asoc'
      display block

    option
      display block

  a
    text-decoration none

  .logo
    margin-bottom 0
    white-space nowrap
    margin-right: (config.spacings.betweenBoxes/2)
    font-weight 700
    font-size 0
    top 1px
    flex 0 0 32px !important

    a
      color: config.typography.palette.headings

  [data-type="search"]
    z-index 103

    > input
      padding-left 32px !important
      // border: 1px solid config.palette.borders

      &::placeholder
        opacity 1

    &:before
      top 13px
      left 13px
      position absolute
      background-color rgba(black, .5)

</style>

