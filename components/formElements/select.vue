<template lang="pug">
span.select(:class="{error}")
  labl.field__label(
    v-if=       "label",
    :for=       "id",
    :label=     "label",
    :required=  "required"
  )
  select(
    :id=        "id",
    @change=    "$emit('input', $event.target.value); debug($event.target.value)"
  )
    option(
      v-for=      "option, key in options",
      :value=     "key",
      :selected=  "value === key"
    ) {{ option }}
  p.input__message(v-if="message") {{ message }}
</template>

<script>
import labl from 'form/label'
export default {
  components: {
    labl
  },
  props: {
    id: {
      type: String,
      default () {
        return 'demo::replace'
      }
    },
    value: {
      type: String,
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
      type: Object,
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
	padding 14px 46px 14px 16px
	width 100%
	border 0
	position relative
	box-shadow 0px 1px 2px rgba(#8B7070, .1)
	cursor pointer
	background-color: config.palette.bgs.body
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
		padding 14px 24px
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
