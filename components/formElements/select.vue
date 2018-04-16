<template lang="pug">
select(
  :id=        "id",
  @change=    "$emit('input', $event.target.value); debug($event.target.value)"
)
  option(
    v-for=      "option, key in options",
    :value=     "typeof options === 'object' ? option : key",
    :selected=  "value === key"
  ) {{ option }}
</template>

<script>
export default {
  props: {
    id: {
      type: String,
      default () {
        return 'demo::replace'
      }
    },
    value: {
      type: [Number, String],
      default: null
    },
    name: {
      type: String,
      default () {
        return ''
      }
    },
    required: {
      type: Boolean,
      default () {
        return false
      }
    },
    message: {
      type: String,
      default () {
        return ''
      }
    },
    error: {
      type: Boolean,
      default () {
        return false
      }
    },
    options: {
      type: [Array, Object],
      default () {
        return {
          demo: 'Demo option'
        }
      }
    },
    label: {
      type: String,
      default: null
    }
  }
}
</script>

<style lang="stylus">
@require '~styles/config'

select
  display block
  font-size 14px
  line-height 16px
  padding 8px 24px 8px 4px
  flex 1 1 auto
  max-width 180px
  width 100%
  border 0
  position relative
  box-shadow 0px 1px 2px rgba(#8B7070, .1)
  cursor pointer
  background-color: white
  background-image embedurl('~static/icons/ui/dropdown.svg', 'utf8') 
  background-repeat no-repeat
  background-position calc(100% - 16px) 50%
  color: config.typography.palette.ui
  text-overflow ''
  transition all .15s ease
  
  &:active
  &:hover
    outline none
  
  &:hover
    color: config.typography.palette.ui
    
  &:focus
    border-radius 0
  
  option
    // display block
    border 0
    padding 8px 24px
    background white
    transition all .1s ease-in-out
    
    &:hover
    &:focus
    &:selected
      background-color: config.palette.primary
      box-shadow: 0 0 10px 100px config.palette.primary inset
    
  optgroup
    box-shadow none
    background white
    border 0
</style>
