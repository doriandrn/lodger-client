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
label
  display inline-flex
</style>
