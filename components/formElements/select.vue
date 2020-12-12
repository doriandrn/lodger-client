<template lang="pug">
select(
  :id=        "id",
  v-if=       "options.length"
  :value=     "value"
  @change=    "$emit('input', $event)"
)
  option(v-if="placeholder" value="" data-placeholder) {{ placeholder }}
  option(
    v-for=      "option, key in options",
    :value=     "option.id || option.code || key",
    :selected=  "value === option.id || value === key"
  ) {{ typeof option === 'string' ? option : typeof option === 'object' ? option.name : undefined }}

select(
  v-else
  :id=        "id"
  :value=     "value"
  @change=    "$emit('input', $event)"
)
  option(v-if="placeholder" value="" data-placeholder) {{ placeholder }}
  optgroup(
    v-for=  "groupOpts, name in options"
    :label= "optGrpLabels && optGrpLabels[name] ? optGrpLabels[name] : name"
  )
    option(
      v-for=      "option, key in groupOpts"
      :value=     "option.id || key",
      :selected=  "value === option.id || value === key"
    ) {{ typeof option === 'string' ? option : typeof option === 'object' ? `${option.symbol || option.name}` : option }}
</template>

<script>
import edd from 'easydropdown'

export default {
  mounted () {
    const { parentNode } = this.$el.parentNode
    this.edd = edd(this.$el, {
      classNames: {
        head: 'head',
        value: 'value',
        arrow: 'arrow',
        select: 'select',
        itemsList: 'list',

        body: 'body',
        bodyScrollable: 'scrollable',
        bodyAtTop: 'top',
        bodyAtBottom: 'bottom',

        root:           'root',
        rootOpen:       'open',
        rootOpenAbove:  'above',
        rootOpenBelow:  'below',
        rootDisabled:   'disabled',
        rootInvalid:    'invalid',
        rootFocused:    'focused',
        rootHasValue:   'has-value',
        rootNative:     'native',

        gradientTop:    'top',
        gradientBottom: 'bottom',

        option: '',
        optionDisabled: 'disabled',
        optionFocused:  'focused',
        optionSelected: 'selected',

        group: '',
        groupLabel: 'label',
        groupHasLabel:  '',
        groupDisabled: 'disabled'
      },
      behavior: {
        showPlaceholderWhenOpen: false
        // openOnFocus: true
      }
    })
  },
  beforeDestroy () {
    if (this.edd)
      this.edd.destroy()
  },
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
    placeholder: {
      type: String,
      default: null
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
    },
    optGrpLabels: {
      type: Object,
      default: null
    }
  }
}
</script>

<style lang="stylus">
@require '~styles/config'

hlColor = config.palette.primary

select
  display block
  font-size 14px
  line-height 16px
  padding 8px 24px 8px 4px
  min-height 32px
  flex 1 1 auto
  width 100%
  border 0
  position relative
  text-overflow ''
  transition all .15s ease

  &:not(:disabled)
    cursor pointer
    color: hlColor
    background-color: white
    background-image embedurl('~static/icons/ui/dropdown.svg', 'utf8')
    background-repeat no-repeat
    background-position calc(100% - 16px) 50%
    box-shadow 0px 1px 2px rgba(#8B7070, .1)

  &:active
  &:hover
    outline none

  &:hover
    color: config.typography.palette.ui

  &:focus
    border-radius 0

  option
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

.root
  display: inline-block;
  position: relative;
  user-select: none;
  font-size 14px
  line-height 20px
  height 40px

  *
  *::before
  *::after
    margin: 0;
    padding: 0;
    box-sizing: border-box;

  .list
    overflow: auto;
    max-height: 0;
    transition: max-height 200ms cubic-bezier(0.25, 0.46, 0.45, 0.94);
    -webkit-overflow-scrolling: touch;

  .head
    position: relative;
    overflow: hidden;
    transition: box-shadow 200ms;

  .head
  .body
    border-radius: 20px


  .body
    opacity: 0;
    position: absolute;
    left: 0;
    right: 0;
    border: 1px solid transparent;
    pointer-events: none;
    overflow: hidden;
    margin 0
    z-index: 999;
    background: white;

  .select
    position: absolute;
    opacity: 0;
    width: 100%;
    left: -100%;
    top: 0;

  .value
    width: 100%;
    display: inline-block;
    vertical-align: middle;
    padding: 10px 35px 10px 16px;

  &:not(.disabled)
    cursor pointer

  .label
  .value
  div[role="option"]
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;

  div[role="option"]
    padding: 6px 10px;
    cursor poiner
    // transition: background-color 250ms, color 250ms, border-color 250ms;

    &:not(:last-child)
      border-bottom: 1px solid #eee;

    &.selected
      color: hlColor

      &:after
        color: hlColor !important

    &.focused
    &:hover
    &:focus
      &:not(.disabled)
        background: hlColor
        border-bottom-color: hlColor
        color: white

        &:after
          color white !important

  &:after
    color white !important

  &.disabled
    color: #ccc;
    cursor: not-allowed

  &.focused
    .head
      border-color: hlColor !important;

  &.invalid
    border-color: #ff6969;

  &.open
    .arrow
      transform: rotate(180deg);
      color: hlColor

    .body
      opacity: 1;
      pointer-events: all;
      transform: scale(1);
      border-color: #eeeeee
      box-shadow: 0 0 20px rgba(black, .1)
      transition: opacity 200ms, transform 100ms cubic-bezier(0.25, 0.46, 0.45, 0.94);

    &.above
      .body
        bottom 100%

    &.below
      .body
        top 100%

  &.native
    .select
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;

  [role="group"]
    .label
      font-size 12px;
      font-weight 400;
      padding 6px 12px;
      margin-top 12px
      color #aaa

  .arrow
    position: absolute;
    size 10px
    top: calc(50% - 5px);
    right: calc(25px - 9px);
    transition: transform 150ms;
    pointer-events: none;
    color: #888;

    &:before
      content: '';
      position: absolute;
      size 5px
      border-right: 1px solid currentColor;
      border-bottom: 1px solid currentColor;
      top: calc(50% - 4px);
      right: 0;
      transform: rotate(45deg);
      transform-origin: 50% 25%;



// .edd-root:not(.edd-root-disabled):not(.edd-root-open) .edd-head:hover .edd-arrow {
//     color: blue;
// }


// .edd-root:not(.edd-root-disabled) .edd-value,
// .edd-option {
//     cursor: pointer;
// }

// .edd-group-has-label .edd-option {
//     padding-left: 14px;
// }

// .edd-option-disabled,
// .edd-group-disabled .edd-option {
//     cursor: default;
//     color: #ccc;
// }

span[data-type="select"]:not(.sort)
  &[data-styl="unstyled"]
    .head
      border 1px solid transparent

  &:not([data-styl="unstyled"])
    .head
      border: 1px solid #eee;
      background: white;

</style>
