<template lang="pug">
span.tooltip
  ul.tooltip__preformatted
    li(
      v-for="val, type in text"
      :data-type="type"
      :data-icon="handleIcon(type, val)"
    ) {{ val }}
      span.m2(v-if="type === 'suprafata'")
  slot
</template>

<script>
export default {
  props: {
    text: {
      type: [String, Object],
      default () {
        return {
          type1: 'val',
          type2: 'vla'
        }
      }
    }
  },
  methods: {
    handleIcon (type, value) {
      if (type === 'suprafata') return 'square'
      if (type === 'locatari') {
        if (Number(value) > 1) return 'users'
        else return 'user'
      }
      return null
    }
  }
}
</script>

<style lang="stylus">
@require '~styles/config'

[data-tip]
  position relative

  > .tooltip
    display flex
    flex-flow row wrap
    font-size 11px
    color white
    position absolute
    z-index 100
    bottom 105%
    left 50%
    width auto
    transform translateX(-50%)
    background-color: config.palette.bgs.dark
    padding 0
    border-radius 3px
    opacity 0
    visibility hidden
    text-transform capitalize

  &:hover
    > .tooltip
      bottom 101%
      visibility visible
      opacity 1

.tooltip
  min-width 160px
  
  &__preformatted
    display flex
    flex-flow row wrap

    > li
      margin 4px 8px
      padding-left 0

      &[data-icon]
        &:before
          background-color rgba(white, .25)

      &[data-type="proprietar"]
        flex 0 0 100%
        text-align: left

</style>
