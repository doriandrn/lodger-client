<template lang="pug">
header.ui
  .inner(:class="{ split }")
    .left
      slot
    .right(v-if="$slots.right")
      slot(name="right")
</template>

<script>
export default {
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
</style>

