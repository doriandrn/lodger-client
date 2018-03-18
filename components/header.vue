<template lang="pug">
header.ui
  split.inner
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
  background white
  line-height: baseSpacingUnit*12
  box-shadow: config.shadows.header

  select
    appearance none
    background transparent

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
    font-weight 700

    a
      color: config.typography.palette.headings

  .field[data-icon]
    &:before
      bottom 16px
</style>

