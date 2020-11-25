<template lang="pug">
span.focuskeys(v-if="keys" v-show="$lodger.state.appPreferences.display.hotkeys")
  span(v-for="key in keys"  :data-key="key")
</template>

<script>
export default {
  props: {
    keys: {
      type: Array,
      default: null
    }
  }
}
</script>

<style lang="stylus">
.focuskeys
  display flex
  flex-flow row nowrap
  position absolute
  right 12px
  top calc(50% - 10px)
  pointer-events none

  > span
    background linear-gradient(-225deg,#d5dbe4,#f8f8f8)
    border-radius: 13px;
    box-shadow: inset 0 -2px 0 0 #cdcde6,inset 0 0 1px 1px #fff,0 1px 2px 1px rgba(30,35,90,0.4)
    color: #aaa
    display: flex;
    size 22px
    justify-content: center;
    padding-bottom: 2px;
    position: relative;
    pointer-events none

    &:not(:last-child)
      margin-right 4px

    &[data-key]
      &:before
        content attr(data-key)
        position absolute 0
        text-align center
        text-transform uppercase
        line-height 22px

    &[data-key="ctrl"]
      &:before
        content "⌘"
</style>
