<template lang="pug">
form(@submit.prevent="validate")
  field(
    v-for=          "field in formData.campuri"
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
    :options=       "field.options"
    :value=         "field.value"
    :slot=          "field.slot"

    :scariCount=    "field.type === 'scari' && typeof scariCount !== 'undefined' ? Number(scariCount) : null"

    v-model=        "$data[field.id]"
  )

  slot(name="formExtend")

  split.actions
    slot(name="footer")
    buton(
      type= "submit",
      size= "large"
      icon= "plus-circle"
      slot= "right"
    ) {{ type === 'new' ? $t('defaults.forms.add') : $t('defaults.forms.edit') }}
</template>

<script>
import buton from 'form/button'
import field from 'form/field'

import shortid from 'shortid'
import frm from './form.vue'
import split from '~components/split'

import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'frm',
  data () {
    let dynamicFormData = {}
    const { campuri } = this.formData
    const ids = campuri.map(field => field.id)

    ids.forEach(fid => {
      const test = campuri.filter(field => field.id === fid)[0]
      dynamicFormData[fid] = typeof test.value === 'function' ? test.value() : test.value || null
    })
    const modalData = this.$store.getters['modal/data']
    if (typeof modalData === 'object' && modalData) {
      dynamicFormData.id = modalData.id
    }
    // add generated id on new forms :)
    else {
      Object.assign(dynamicFormData, { id: shortid.generate() })
    }
    return dynamicFormData
  },
  computed: {
    ...mapGetters({
      modalContent: 'modal/content',
      modalData: 'modal/data'
    }),
    path () {
      return this.modalContent.split('.')[0]
    }
  },
  props: {
    formData: {
      type: Object,
      default () {
        return {
          campuri: [
            {
              id: 'demoText',
              type: 'text',
              label: 'Demo Input',
              focus: true,
              required: true
            }
          ],
          actiuni: {
            confirm: 'doNothing'
          }
        }
      }
    },
    type: {
      type: String,
      default: 'new'
    }
  },
  methods: {
    ...mapActions({
      adaugaAsociatie: 'asociatie/adauga',
      adaugaBloc: 'bloc/adauga',
      adaugaAp: 'apartament/adauga',
      modalClose: 'modal/close'
    }),
    validate () {
      this.$validator.validateAll().then(valid => {
        if (valid) this.handleSubmit()
      })
    },
    handleSubmit () {
      const { formData: { actiuni: { confirm } } } = this

      this[confirm](this.$data)
      this.modalClose()
      this.$emit('submit', this.$data)
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
