<template lang="pug">
form(@submit.prevent="validate")
  .field(v-for="field in _fields")
    inpt(
      v-if=     "field.type === 'text'"
      :label=   "field.label",
      :id=      "field.id",
      v-model=  "$data[field.id]",
      :focus  = "field.focus"
    )

  .split.actions
    .right
      buton(
        type= "submit",
        size= "large"
        icon= "plus-circle"
      ) {{ $t('defaults.forms.add') }}
</template>

<script>
import inpt from 'form/input'
import slect from 'form/select'
import txtarea from 'form/textarea'
import buton from 'form/button'
import cbox from 'form/checkbox'
import file from 'form/file'
import radios from 'form/radioGroup'
import shortid from 'shortid'

export default {
  data () {
    let dynamicFormData = {}
    const ids = this._fields.map(field => field.id)
    ids.forEach(fid => {
      const test = this._fields.filter(field => field.id === fid)[0]
      console.log('test', test)
      dynamicFormData[fid] = typeof test.value === 'function' ? test.value() : null
    })
    Object.assign(dynamicFormData, { id: shortid.generate() })
    return dynamicFormData
  },
  props: {
    _fields: {
      type: Array,
      default () {
        return [{
          id: 'demoText',
          type: 'text',
          label: 'Demo Input',
          focus: true,
          required: true
        }]
      }
    }
  },
  methods: {
    validate () {
      this.$validator.validateAll().then(valid => {
        if (valid) this.$emit('submit', this.$data)
      })
    }
  },
  components: {
    inpt,
    slect,
    txtarea,
    buton,
    cbox,
    file,
    radios
  }
}
</script>

<style lang="stylus">
@require '~styles/config'

form
  .field
    &:not(:last-child)
      margin-bottom: config.spacings.inBoxes

    > span
      display flex
      flex-flow row wrap
    
      > label
        margin-bottom: baseSpacingUnit
        color: config.typography.palette.headings
</style>
