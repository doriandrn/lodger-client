<template lang="pug">
ul.toasts
  li(
    v-for=      "toast in toasts",
    :key=       "toast.id",
    :data-type= "toast.type",
    :data-icon=  "toast.type === 'succes' ? 'check' : 'alert-circle'"
  )
    p {{ $t( toast.text ) }}
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  computed: mapGetters({
    toasts: 'toastMessages'
  })
}
</script>

<style lang="stylus">
@require '~styles/config'

types = info warn error succes

.toasts
  position fixed
  top 70px
  right 0
  max-width 280px
  display flex
  flex-flow column wrap

  +above(m)
    max-width 340px

  +desktop()
    max-width 380px

  > li
    display flex
    flex-flow row nowrap
    background white
    align-items center
    border-left 3px solid
    min-width 300px
    padding-left 0
    position relative

    &:after
      content ''
      position absolute
      left 0
      top 0
      bottom 0
      width 64px
      z-index 1
    
    &:not(:last-child)
      margin-bottom 20px

    p
      margin-bottom 0
      font-size 16px
      color: config.typography.palette.headings
      padding 20px 32px

    &:before
      flex-basis 64px
      height 40px
      mask-size 32px
      flex-shrink 0
      margin-right 12px
      z-index 2

    palette = config.palette
    for $type in types
      type = s("%s", $type)
      dcolor = palette[type]
      &[data-type=\"{$type}\"]
        border-left-color: dcolor
        box-shadow: 0px 2px 5px -2px dcolor

        &:before
          background-color: dcolor

        &:after
          background: lighten(dcolor, 95%)


</style>
