<template lang="pug">
.widget(:class="{boxed, full, expand, hasSidebar: $slots.sidebar }")
  header.widget__header(
    v-if= "boxed"
    :data-icon= "icon"
  )
    h5.widget__title {{ title }}
    button.control(v-for="control in controls") {{ control }}
  .widget__content
    slot
    .sidebar.widget__sidebar(v-if="$slots.sidebar")
      slot(name="sidebar")
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: 'Widget Title'
    },
    boxed: {
      type: Boolean,
      default: true
    },
    full: {
      type: Boolean,
      default: false
    },
    icon: {
      type: String,
      default: null
    },
    expand: {
      type: Boolean,
      default: false
    },
    controls: {
      type: Array,
      default () {
        return []
      }
    }
  }
}
</script>

<style lang="stylus">
@require '~styles/config'
.widget
  position relative
  overflow hidden

  &__content
    min-height 300px
    display flex
    flex-flow column wrap

    .danger
      margin-top auto

  &__sidebar
    background: config.palette.borders

  &__title
    text-transform uppercase
    font-weight 500
    letter-spacing .5px
    margin-bottom 0

  &.full
    flex 1 1 100%

  &.expand
    flex-basis 65%

  &.boxed
    background white
    border-radius: config.radiuses.boxes
    box-shadow: config.shadows.boxes

    .widget
      &__content
        padding: config.spacings.inBoxes
      
      &__title
        padding: 0 config.spacings.inBoxes

  &.hasSidebar
    .widget
      &__content
        flex-flow row nowrap

        > div
          flex 1 1 50%

          &:not(:last-child)
            margin-right: config.spacings.betweenBoxes

          &.sidebar
            flex-basis 33%
            margin: -(config.spacings.inBoxes)
            padding: config.spacings.inBoxes

</style>
