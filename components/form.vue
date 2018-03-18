<template lang="pug">
form(@submit.prevent="validate")
  field(
    v-for=          "field in formData.campuri"

    :key=           "`${field.type}-${field.id}`"
    :id=            "field.id"
    :type=          "field.type || 'text'"
    :label=         "field.label"
    :placeholder=   "field.placeholder"
    :focus=         "field.focus"
    :required=      "field.required"
    :min=           "field.min"
    :max=           "field.max",
    :step=          "field.step",
    :options=       "field.options"
    :value=         "field.value"
    :data-slot=     "field.slot"
    @change=        "handleChange(field['@change'], field.id, field.type, $event)"

    :scariCount=    "field.type === 'array' && typeof scariCount !== 'undefined' ? Number(scariCount) : null"

    v-model.trim=   "$data[field.id]"
  )

  slot(
    name=   "formExtend"
  )

  split.actions
    
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
  mounted () {
    // move slot:footer items to form footer
    const footerEls = this.$el.querySelectorAll('.field[data-slot]')
    if (!footerEls) return
    const footerActionsEl = this.$el.querySelector('.actions .left')
    for (const el of footerEls) {
      footerActionsEl.append(el)
    }
  },
  data () {
    let dynamicFormData = {}
    const { campuri } = this.formData
    
    // tradu campurile
    campuri.forEach(camp => { camp.label = this.$t(camp.label) })

    // adauga-le valorile implicite
    const ids = campuri.filter(field => !field.notInAddForm).map(field => field.id)
    this.debug('ids', ids)

    ids.forEach(fid => {
      const test = campuri.filter(field => field.id === fid)[0]
      dynamicFormData[fid] = typeof test.value === 'function' ? test.value(this.$store.getters) : test.value || null
    })

    // passed data in modal
    const modalData = this.$store.getters['modal/data']
    if (typeof modalData === 'object' && modalData) {
      Object.keys(modalData).forEach(data => {
        if (modalData[data] === 'undefined' || modalData === null) return
        dynamicFormData[data] = modalData[data]
      })
    }

    return dynamicFormData
  },
  computed: {
    ...mapGetters({
      modalContent: 'modal/content',
      modalData: 'modal/data'
    }),
    path () {
      const { modalContent } = this
      if (!modalContent) return
      return modalContent.split('.')[0]
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
    handleChange (func, id, type, e) {
      if (!func) return
      this.$store.dispatch(func, { [id]: ['number', 'bani'].indexOf(type) > -1 ? Number(e) : e })
    },
    handleSubmit () {
      const { formData: { actiuni: { confirm } }, $data, debug } = this
      if (typeof this[confirm] !== 'function') { debug('Confirm nedefinit, neinregistrat', $data); return }
      const manipulatedData = {}
      Object.keys($data).forEach(what => {
        const value = $data[what]
        if (value === null || value === 'undefined') return
        manipulatedData[what] = what === 'scara' ? String(value) : value
      })
      this[confirm](manipulatedData)
      this.modalClose()
      this.$emit('submit', manipulatedData)
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
    display flex
    flex-flow row wrap
    max-width 335px
    margin-left auto
    margin-rigth auto

    &[data-type="number"]
      flex-basis 80px
      flex-grow 1

    &[data-type="separator"]
      flex-basis 100%
      flex-shrink 0

  .separator
    margin-top 0

</style>
