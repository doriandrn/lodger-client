<template lang="pug">
form.form(@submit.prevent="handleSubmit(formName)")
  h5.form__title(v-if="title") {{ $t( title ) }}
  p.form__desc(v-if="desc") {{ $t( desc ) }}

  .form__content
    slot(name=        "beforeFields")

    field(
      v-for=          "field in formData.campuri"
      v-if=           "!field.notInForm"

      :key=           "`${field.type}-${field.id}`"
      :id=            "field.id"
      :type=          "field.type || 'text'"
      :label=         "field.label"
      :placeholder=   "field.type === 'bani' ? '0.00' : field.placeholder"
      :focus=         "field.focus"
      :required=      "field.required"
      :min=           "field.min"
      :max=           "field.max",
      :step=          "field.type === 'bani' ? 0.01 : field.step",
      :options=       "typeof field.options === 'function' ? field.options($store.getters) : field.options"
      :value=         "field.value"
      :data-slot=     "field.slot"
      :searchTaxonomy="field.taxonomy"
      :click=         "field['@click']"
      :dangerous=     "field.dangerous"
      :transform=     "field.transform"
      @change=        "handleChange(field['@change'], field.id, field.type, $event, formName)"

      :servicii=      "field.type === 'servicii' && typeof field.servicii === 'function' ? field.servicii($store.getters) : null"

      v-model.trim=   "$data[field.id]"

      v-validate=     "field.v || null"
      :data-vv-scope= "formName",
      :data-vv-as=    "$t( field.label )"
      :data-vv-name=  "field.id"
      :error=         "errors.has(field.id, formName)"
      :message=       "errors.first(field.id, formName)"
    )

    slot(name=        "afterFields")

  split.actions(v-if="formData.actiuni")
    buton(
      v-if= "formData.$for === 'apartament' && $store.getters['apartament/selectat']"
      size= "small"
      styl= "unstyled"
      icon= "trash"
      dangerous
    ) {{ $t('defaults.sterge') }}
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
    const { debug, $t, formName, formData: { campuri, $for }} = this
    if (!campuri) return dynamicFormData
    const isNewForm = formName.indexOf('.new') > 0
    
    // Label-uri pt campurile din modal + required validari
    campuri.forEach(camp => {
      const { label, required, click, notInForm, notInDb } = camp
      let { id, value } = camp
      let _def = camp.default

      if (click && !id) camp.id = click
      
      // apply getters to funcs
      if (isNewForm) {
        debug('new form')
        if (!notInForm || notInDb) value = null
      }

      if (typeof value === 'function') {
        try {
          value = value(this.$store.getters)
        } catch (e) {
          value = null
          debug('no val ->', e)
        }
      }
     
      if (typeof _def === 'function') _def = _def(this.$store.getters)

      // label
      camp.label = label || `${$for ? `${$for}.new.` : ''}${id}`

      // validarea de required
      if (required || (camp.v && camp.v.indexOf('required') < 0)) camp.v = `required|${camp.v || ''}`

      // valoarea finala
      dynamicFormData[id] = null
      dynamicFormData[id] = value !== null && value !== undefined ? value : _def
    })

    return dynamicFormData
  },
  mounted () {
    this.debug('FORM MOUNT')
  },
  computed: {
    ...mapGetters({
      modalContent: 'modal/content',
      modalData: 'modal/data'
    }),
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
          },
          for: null
        }
      }
    },
    type: {
      type: String,
      default: 'new'
    },
    formName: {
      type: String,
      default: 'unnamed'
    },
    title: {
      type: String,
      default: null
    },
    desc: {
      type: String,
      default: null
    }
  },
  methods: {
    ...mapActions({
      adaugaAsociatie: 'asociatie/adauga',
      adaugaBloc: 'bloc/adauga',
      adaugaAp: 'apartament/adauga',
      adaugaServiciu: 'serviciu/adauga',
      adaugaFurnizor: 'furnizor/adauga',
      adaugaCheltuiala: 'cheltuiala/adauga',
      incaseaza: 'incasare/adauga',
      modalClose: 'modal/close',
      trimiteFeedback: 'feedback/trimite'
    }),
    async validate (scope) {
      let v = false
      this.$validator.validateAll(scope).then(valid => {
        if (valid) v = true
      })
      return v
    },
    /**
     * func = string = numele actiunii vuex, global
     */
    handleChange (func, id, type, e, scope) {
      if (!func) return
      const { value } = e.target
      if (value === 'undefined' || value === null) return

      const valid = this.validate(scope)
      if (!valid) {
        this.debug(`camp invalid ${id}`)
        return
      }

      this.$store.dispatch(func, {
        [id]: ['number', 'bani'].indexOf(type) > -1 ? Number(value) : value
      })
    },
    handleSubmit (scope) {
      const valid = this.validate(scope)
      if (!valid) return

      const { formData: { actiuni: { confirm } }, $data, debug } = this
      if (typeof this[confirm] !== 'function') {
        debug('Confirm nedefinit, neinregistrat', $data);
        return
      }
      const manipulatedData = {}
      Object.keys($data).forEach(what => {
        let value = $data[what]
         // TODO: adauga data la indecsii numiti 'la'
        if (what === 'la') value = Date.now()
        if (value === null || value === 'undefined') return

        manipulatedData[what] = value
      })
      // TODO: verifica daca s-a schimbat ceva, altfel n-are sens sa apelezi confirmu
      debug('Final form data, submitted: ', manipulatedData)
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

.form
  display flex
  flex-flow row wrap
  width 100%
  
  &+.form
    margin-top 32px

  &__title
    margin-right 16px

  &__title
  &__desc
    margin-bottom 0
    flex 0 1 auto

    &+.form__content
      border-top: 1px solid config.palette.borders
      padding-top 24px
      margin-top 12px

  &__content
    display flex
    flex-flow row wrap
    flex 1 0 100%
    height 100%
    justify-content flex-start
    margin 0 -16px

    .field
      margin 16px

  label
    margin-bottom: (baseSpacingUnit*1.5)
    line-height: 16px


  .field
    display flex
    flex-flow row wrap
    flex 1 1 auto
    // max-width 335px

    &[data-type="number"]
      flex-basis 110px
      flex-grow 1

    &[data-type="separator"]
      flex-basis 100%
      flex-shrink 0

  .separator
    margin-top 0

</style>
