<template lang="pug">
label
  slot
  span.input__req(v-if="required") *
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
