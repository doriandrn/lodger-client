<template lang="pug">
label
  slot
</template>

<script>
export default {
  props: {
    required: {
      type: Boolean,
      default () {
        return false
      }
    }
  }
}
</script>

<style lang="stylus">
@require '~styles/config'
typeColors = config.typography.palette
defColor = typeColors.labels

label
  display inline-flex
  user-select none
  color: defColor
  margin-bottom 12px
  font-weight 500

  &:before
    background-color: defColor

  small
    margin-left 4px
    color: typeColors.meta
    font-weight 100
</style>
