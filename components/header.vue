<template lang="pug">
header.ui
  split.inner(separate)
    slot
    slot(name="right" slot="right")
</template>

<script>
import split from '~components/split'

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

  .field[data-type="search"]
    > input
      padding-left 32px !important
      border: 1px solid config.palette.borders

      &::placeholder
        opacity 1
    &:before
      top 7px
      left 11px

</style>

