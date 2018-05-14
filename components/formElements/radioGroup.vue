<template lang="pug">
div(
  role= "radiogroup"
  :aria-labelledby= "id"
)
  labl(
    v-if=   "label"
    :label= "label"
    :for=   "id"
  ) {{ label }}
  span.radios(
    :id=              "id"
  )
    span.input__radio(
      v-for=          "option, index in options"
      v-tooltip=      "{ content: $t(option.label), placement: tooltipsPosition }"
    )
      input(
        type=       "radio",
        :value=     "index",
        :name=      "id",
        :disabled=  "option.disabled"
        :id=        "option.id || option.label",
        @change=    "$emit('change', index)"
      )
      label.label(
        :for=   "option.id || option.label"
      ) #[span] {{ options instanceof Array ? option : $t(option.label) }}
</template>

<script>
import labl from 'form/label'
export default {
  computed: {
    tooltipsPosition () {
      const { id } = this
      if (id === 'initprgrs') return 'right'
      return 'top-center'
    }
  },
  components: {
    labl
  },
  props: {
    options: {
      type: [Array, Object],
      default () {
        return {}
      }
    },
    id: {
      type: String,
      default () {
        return 'demo::replace'
      }
    },
    label: {
      type: String,
      default: null
    },
    value: {
      type: [Number, String],
      default: -1
    }
  }
}
</script>

<style lang="stylus">
@require '~styles/config'

input[type="radio"]
  &+label
    font-size 0
    height 24px
    cursor pointer

    > span
      size 12px
      display block
      border-radius 50%
      border: 1px solid config.typography.palette.meta

  &:checked
    &+label
      > span
        background-image: embedurl('~static/icons/ui/stop-circle.svg', 'utf8')
        background-size contain
        background-repeat no-repeat
        border-color transparent

  &:disabled
    &+label>span
      opacity .25
      cursor default
  &:hover
    cursor pointer

.input__radio
  display flex
  flex-flow column nowrap
  margin 4px 4px 8px
  height 12px

  > input[type="radio"]
    display none

.radios
  display flex
  flex-flow row nowrap
  align-items center
  margin -4px
  cursor default
</style>
