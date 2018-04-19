<template lang="pug">
label
  slot
  span.input__optional(v-if="!required") {{ $t('defaults.optional') }}
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
defColor = config.typography.palette.labels

label
  display inline-flex
  user-select none
  color: defColor

  &:before
    background-color: defColor
</style>
