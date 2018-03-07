<template lang="pug">
form(@submit.prevent="validate")
  .field(
    v-for=      "field in _fields"
    v-if=       "field.type"
    :data-type= "field.type"
    :class=     "{ separator: field.type === 'separator' }"
  )
    inpt(
      v-if=         "['text', 'number'].indexOf(field.type) > -1",
      :type=        "field.type",
      :label=       "field.label",
      :placeholder= "field.placeholder",
      :id=          "field.id",
      v-model=      "$data[field.id]",
      :focus  =     "field.focus",
      :required=    "field.required",
      :min=         "field.min",
      :max=         "field.max"
    )
    scari(
      v-if=         "field.type === 'scari'",
      :scariCount=  "Number(scariCount)",
      v-model=      "$data[field.id]",
    )

  slot(name="formExtend")

  split.actions
    buton(
      type= "submit",
      size= "large"
      icon= "plus-circle"
      slot= "right"
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
import scari from 'form/scari'

import shortid from 'shortid'
import frm from './form.vue'
import split from '~components/split'

import { mapGetters } from 'vuex'

export default {
  name: 'frm',
  data () {
    let dynamicFormData = {}
    const ids = this._fields.map(field => field.id)
    ids.forEach(fid => {
      const test = this._fields.filter(field => field.id === fid)[0]
      dynamicFormData[fid] = typeof test.value === 'function' ? test.value() : test.value || null
    })
    Object.assign(dynamicFormData, { id: shortid.generate() })
    return dynamicFormData
  },
  computed: mapGetters({
    activeForm: 'modal/content'
  }),
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
    radios,
    split,
    scari
  }
}
</script>

<style lang="stylus">
@require '~styles/config'

form
  display flex
  flex-flow row wrap
  margin: -(config.spacings.inBoxes)

  > *
    flex 1 1 300px
    margin: config.spacings.inBoxes

  label
    margin-bottom: baseSpacingUnit

.field
  > span
    display flex
    flex-flow row wrap

  &[data-type="number"]
    flex-basis 80px

  &[data-type="separator"]
    flex-basis 100%
    flex-shrink 0

  .separator
    margin-top 0

</style>
