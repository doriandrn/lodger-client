<template lang="pug">
.contact
  fieldset(v-if=  "tel.length && !disabled || tel.filter(i => i).length")
    legend telefon
    vue-tel-input(
      v-for=  "t, i in tel"
      :key=   "i"
      :value= "t"
      :disabled=  "disabled"
      :autofocus= "false"
      :dynamic-placeholder= "true"
      mode= "national"
      @validate=  "validate($event, i)"
    )
    button.new(
      v-if=   "!disabled && tel.filter(i => i).length === tel.length"
      @click= "$event.preventDefault(); tel.push('')"
    ) +

  fieldset(v-if="email.length && !disabled || email.filter(i => i).length")
    legend Email
    field(
      type=   "email"
      v-for=  "e, i in email"
      :key=   "i"
      :value= "e"
      :disabled= "disabled"
      v-model=  "email[i]"
      hideLabel
    )
    button.new(
      v-if=   "!disabled && email.filter(i => i).length === email.length"
      @click= "$event.preventDefault(); email.push('')"
    ) +
</template>

<script>
import { VueTelInput } from 'vue-tel-input'
// import field from 'c/formElements/field'

export default {
  beforeCreate () {
    this.$options.components.field = require('form/field').default
  },
  methods: {
    validate (e, i) {
      // console.log(e)
      const { valid, number: { international, input, e164 } } = e
      const el = this.$el.children[0].children[i + 1]
      const prefix = international ? String(international.split(' ')[0]) : undefined

      if (input) {
        el.classList.toggle('error', !valid)
      }

      if (valid && !this.disabled) {
        this.tel[i] = e164
        this.$emit('input', { ...this.$data })
        // this.$el.blur() // ?
      }
    }
  },
  data () {
    const { value } = this
    const data = value ? { ...value } : {
      tel: [],
      email: []
    }

    if (!data.tel.length)
      data.tel.push('')

    if (!data.email.length)
      data.email.push('')

    return data
  },
  props: {
    value: {
      type: Object,
      default: undefined
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  components: {
    VueTelInput,
    // field
  }
}
</script>

<style lang="stylus">
.vue-tel-input
  &.error
    border-color red
</style>
