<template lang="pug">
form(@submit.prevent="validate")
  field(
    v-for=          "field in _fields"
    v-if=           "field.type"
    :key=           "`${field.type}-${field.id}`"
    :id=            "field.id"
    :type=          "field.type || null"
    :label=         "field.label"
    :placeholder=   "field.placeholder"
    :focus=         "field.focus"
    :required=      "field.required"
    :min=           "field.min"
    :max=           "field.max"

    :scariCount=    "field.type === 'scari' && typeof scariCount !== 'undefined' ? Number(scariCount) : null"

    v-model=        "$data[field.id]"
  )

  slot(name="formExtend")

  split.actions
    buton(
      type= "submit",
      size= "large"
      icon= "plus-circle"
      slot= "right"
    ) {{ this.type === 'new'? $t('defaults.forms.add') : $t('defaults.forms.edit') }}
</template>

<script>
import buton from 'form/button'
import field from 'form/field'

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
    const modalData = this.$store.getters['modal/data']
    if (typeof modalData === 'object' && modalData) {
      console.log('PAMPAM')
      dynamicFormData.id = modalData.id
    }
    // add generated id on new forms :)
    else {
      console.log(typeof modalData)
      Object.assign(dynamicFormData, { id: shortid.generate() })
    }
    return dynamicFormData
  },
  computed: mapGetters({
    activeForm: 'modal/content',
    modalData: 'modal/data'
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
    },
    type: {
      type: String,
      default: 'new'
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
    buton,
    split,
    field
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
