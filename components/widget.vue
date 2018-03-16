<template lang="pug">
.widget(:class="{boxed, full, expand, hasSidebar: $slots.sidebar }")
  header.widget__header(
    v-if= "boxed"
    :data-icon= "icon"
  )
    split
      h6.widget__title {{ title }}
      button.control(
        v-for="control in controls"
        v-if= "control.type === 'buton'"
        slot= "right"  
      ) {{ control }}
      slot(name="right" slot="right")
  .widget__content
    slot
    .sidebar.widget__sidebar(v-if="$slots.sidebar")
      slot(name="sidebar")
</template>

<script>
import split from '~components/split'

export default {
  components: {
    split
  },
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
  display flex
  max-height 80vh

  .actions
    list-style-type none
    padding 0

  &__content
    min-height 300px
    display flex
    flex 1 1 100%
    flex-flow column nowrap
    overflow auto

    > ul.actions
      margin-bottom: config.spacings.betweenBoxes

    .danger
      margin-top auto

  &__sidebar
    background: config.palette.borders
    display flex
    flex-flow column nowrap

    > div
      fullflex()

  &__title
    margin-bottom 0
    line-height 24px

  &__header
    > .split
      flex-flow column nowrap

      .left
        margin-right 0

      .right
        margin-left 0

    .radios
      display inline-flex
      flex-flow row wrap
      justify-content center

  &.full
    flex 1 1 100%

  &.expand
    flex-basis 65%

  &.boxed
    background white
    border-radius: config.radiuses.boxes
    box-shadow: config.shadows.boxes
    transition box-shadow .5s ease

    &:hover
      box-shadow: config.shadows.boxesHover

    .widget
      &__content
        padding: config.spacings.inBoxes

        > div
          fullflex()
          flex-basis auto
          overflow hidden

          > .split
            margin-bottom 32px
      
      &__title
        text-align center
        max-width 10px
        margin 0 auto

      &__header
        display flex
        flex 0 0 52px
        padding: config.spacings.inBoxes 0

        > .split
          .right
            margin-top auto

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
