<template lang="pug">
select(
  :id=        "id",
  @change=    "$emit('input', $event.target.value); debug($event.target.value)"
)
  option(
    v-for=      "option, key in options",
    :value=     "typeof options === 'object' ? option : key",
    :selected=  "value === option"
  ) {{ option }}
</template>

<script>
import edd from 'easydropdown';

export default {
  mounted () {
    this.edd = edd(this.$el)
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
  min-height 32px
  flex 1 1 auto
  // max-width 180px
  width 100%
  border 0
  position relative
  text-overflow ''
  transition all .15s ease

  &:not(:disabled)
    cursor pointer
    color: config.typography.palette.ui
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

.edd
  &-root
    display: inline-block;
    position: relative;
    width: 180px;
    user-select: none;
    line-height 20px
    height 40px

    *
    *::before
    *::after
      margin: 0;
      padding: 0;
      box-sizing: border-box;

    &-disabled
      color: #ccc;
      cursor: not-allowed

    &-focused
      .edd-head
        border-color: blue;

    &-invalid
      border-color: #ff6969;

    &-open
      .edd
        &-arrow
          transform: rotate(180deg);

        &-body
          opacity: 1;
          pointer-events: all;
          transform: scale(1);
          transition: opacity 200ms, transform 100ms cubic-bezier(0.25, 0.46, 0.45, 0.94);

      &-above
        .edd-body
          bottom: 100%;

      &-below
        .edd-body
          top 100%

    &-native
      .edd-select
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;

  &-head
    position: relative;
    overflow: hidden;
    border: 1px solid #eee;
    transition: box-shadow 200ms;
    background: white;

  &-head
  &-body
    border-radius: 20px;

  &-body
    opacity: 0;
    position: absolute;
    left: 0;
    right: 0;
    border: 1px solid #eee;
    pointer-events: none;
    overflow: hidden;
    margin 0
    z-index: 999;
    box-shadow: 0 0 20px rgba(black, .1);
    // transform: scale(0.95);
    background: white;

  &-select
    position: absolute;
    opacity: 0;
    width: 100%;
    left: -100%;
    top: 0;

  &-option
    padding: 6px 10px;
    border-bottom: 1px solid #eee;
    transition: background-color 250ms, color 250ms, border-color 250ms;

  &-value
    width: 100%;
    display: inline-block;
    vertical-align: middle;
    padding: 10px 35px 10px 16px;

  &-arrow
    position: absolute;
    width: 18px;
    height: 10px;
    top: calc(50% - 5px);
    right: calc(25px - 9px);
    transition: transform 150ms;
    pointer-events: none;
    color: #888;

    &:before
      content: '';
      position: absolute;
      size 8px
      border-right: 1px solid currentColor;
      border-bottom: 1px solid currentColor;
      top: calc(50% - 6px);
      right: 0;
      transform: rotate(45deg);
      transform-origin: 50% 25%;


.edd-root-open .edd-arrow,
.edd-root:not(.edd-root-disabled):not(.edd-root-open) .edd-head:hover .edd-arrow {
    color: blue;
}

.edd-value,
.edd-option,
.edd-group-label {
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
}

.edd-root:not(.edd-root-disabled) .edd-value,
.edd-option {
    cursor: pointer;
}

.edd-items-list {
    overflow: auto;
    max-height: 0;
    transition: max-height 200ms cubic-bezier(0.25, 0.46, 0.45, 0.94);
    -webkit-overflow-scrolling: touch;
}

.edd-group-label {
    font-size: 12px;
    font-weight: 400;
    padding: 12px 10px 4px;
}

.edd-group-has-label .edd-option {
    padding-left: 14px;
}

.edd-option-selected {
    font-weight: 400;
    color: blue;
}

.edd-option-focused:not(.edd-option-disabled) {
    background: blue;
    border-bottom-color: blue;
    color: white;
}

.edd-option-disabled,
.edd-group-disabled .edd-option {
    cursor: default;
    color: #ccc;
}
</style>
