<template lang="pug">
section
  .inner
    h1(v-if="title") {{ title }}
    slot
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: null
    }
  }
}
</script>

<style lang="stylus">
@require '~styles/config'

section
  padding-top 24px
  padding-bottom 24px
  position relative

  &#nuExista
    > .inner
      text-align center
      align-items center
      justify-content center

    h1
      color: config.palette.warn
</style>
