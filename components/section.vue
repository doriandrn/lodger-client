<template lang="pug">
section(:class="{ sidebar: $slots.sidebar, boxes }")
  .inner
    div
      slot(name="beforeTitle")
      h1(v-if="title") {{ title }}

      slot

    aside(v-if="$slots.sidebar")
      slot(name="sidebar")
</template>

<script>
export default {
  props: {

    boxes: {
      type: Boolean,
      default: false
    },
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
  overflow-x hidden
  text-align center

  &.sidebar
    > .inner
      flex-flow row nowrap !important
      align-items flex-start !important

      > div
        flex 1 1 100%
        display flex
        flex-flow row wrap

  aside
    flex 0 0 280px

  &#nuExista
    > .inner
      text-align center
      align-items center
      justify-content center

    h1
      color: config.palette.warn
</style>
