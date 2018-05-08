<template lang="pug">
span.tooltip
  ul.tooltip__preformatted(v-if= "typeof text === 'object'")
    li(
      v-for="val, type in text"
      :data-type="type"
      :data-icon="handleIcon(type, val)"
    ) {{ val }}
      span.m2(v-if="type === 'suprafata'")
  span(v-else-if="typeof text === 'string' && text") {{ text }}
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
bg = config.palette.bgs.dark

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
    background-color: bg
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

  &:after
  &:before
    top 100%
    left 50%
    border solid transparent
    content ' '
    height 0
    width 0
    position absolute
    pointer-events none

  &:after
    border-width 4px
	  margin-left -4px
	  border-top-color: white

  &:before
	  border-top-color: bg
	  border-width 5px
	  margin-left -5px
  
  &__preformatted
    display flex
    flex-flow row wrap

    > li
      margin 4px 8px
      padding-left 0
      display flex
      flex-flow row nowrap
      align-items center
      line-height 17px

      &[data-icon]
        &:before
          background-color white

      &[data-type="proprietar"]
        flex 0 0 100%
        text-align: left
        font-weight bold

</style>
