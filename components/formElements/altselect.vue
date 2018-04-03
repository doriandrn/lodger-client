<template lang="pug">
ul.altselect(
  :id=        "id",
  :data-arrow="arrow"
)
  li(
    v-for=      "option, key in options",
    :data-sel=  "value === key"
    :data-value= "typeof options === 'object' ? option : key",
    @click=     "value !== key ? $emit('input', $event.target.dataset.value) : debug($event.target)"
  ) {{ option }}
  slot
</template>

<script>
export default {
  props: {
    id: {
      type: String,
      default: 'altselect'
    },
    value: {
      type: [Number, String],
      default: null
    },
    arrow: {
      type: Boolean,
      default: true
    },
    options: {
      type: [Array, Object],
      default () {
        return {
          demo: 'Demo option'
        }
      }
    }
  }
}
</script>

<style lang="stylus">
@require '~styles/config'

.altselect
  list-style-type none
  font-size 14px
  line-height 16px
  padding 14px 46px 14px 16px
  position relative
  // box-shadow 0px 1px 2px rgba(#8B7070, .1)
  cursor pointer
  background-color: config.palette.bgs.body
  background-image embedurl('~static/icons/ui/dropdown.svg', 'utf8') 
  background-repeat no-repeat
  background-position calc(100% - 16px) 50%
  color: config.typography.palette.ui
  transition all .15s ease
  display flex
  flex-flow column nowrap
  max-width 100%
  max-height 100%
  overflow hidden
  transition max-height .15s ease-in-out

  &:after
    position absolute

  
  &:active
  &:hover
    outline none
    max-height 50vh
    overflow visible
    background white
  
  > li
    display block
    border 0
    order 2
    flex 1 1 100%
    padding 14px 24px
    background white
    transition color .1s ease-in-out

    &[data-sel]
      color: config.typography.palette.headings
      // cursor default
      order 1
    
    &:not([data-sel])
      &:hover
      &:focus
        background-color: config.palette.selectedItem !important
        color: config.typography.palette.headings
      
</style>
