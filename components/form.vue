<template lang="pug">
form(@submit.prevent="validate(formName)")
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
    @change=        "handleChange(field['@change'], field.id, field.type, $event)"

    :servicii=      "field.type === 'servicii' && typeof field.servicii === 'function' ? field.servicii($store.getters) : null"

    v-model.trim=   "$data[field.id]"

    v-validate=     "field.v || null"
    :data-vv-scope= "formName",
    :data-vv-as=    "field.label"
    :data-vv-name=  "field.id"
    :error=         "errors.has(`${formName}.${field.id}`)"
    :message=       "errors.first(`${formName}.${field.id}`)"
  )

  slot(name=        "afterFields")

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
  // mounted () {
  //   const { $el } = this
  //   // move slot:footer items to form footer
  //   const footerEls = $el.querySelectorAll('.field[data-slot]')
  //   if (!footerEls) return
  //   const footerActionsEl = $el.querySelector('.actions .left')
  //   for (const el of footerEls) {
  //     footerActionsEl.append(el)
  //   }
  // },
  data () {
    let dynamicFormData = {}
    const { debug, $t, modalData, formData: { campuri, $for }} = this

    if (!campuri) return dynamicFormData
    debug('campuri', campuri)
    
    // Label-uri pt campurile din modal + required validari
    campuri.forEach(camp => {
      const { id, label, required, value } = camp
      camp.label = label || `${$for ? `${$for}.new.` : ''}${id}`
      if (required) camp.v = `required|${camp.v || ''}`
      dynamicFormData[id] = null
      if (value) {
        dynamicFormData[id] = typeof value === 'function'
          ? value(this.$store.getters)
          : value
      } else if (camp.default) {
        dynamicFormData[id] = typeof camp.default === 'function'
          ? camp.default(this.$store.getters)
          : camp.default
      }
    })

    // data pasata prin modal
    if (typeof modalData === 'object' && modalData) {
      Object.keys(modalData).forEach(data => {
        if (modalData[data] === 'undefined' || modalData === null) return
        dynamicFormData[data] = modalData[data]
      })
    }

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
      modalClose: 'modal/close'
    }),
    trimiteFeedback (data) {
      const issue = {
        title: data.subiect || 'Test',
        labels: [`${data.tip}`],
        assignee: 'doriandrn',
        body: `
### Descriere
${data.mesaj} (${this.topic})`
      }

      this.$axios.$post('https://api.github.com/repos/doriandrn/ui/issues', issue, {
        headers: {
          Accept: 'application/vnd.github.v3+json',
          Authorization: 'token 8df7d1f0fcb5ec784664fbdd5a24eadb12a73daf'
        }
      })
      .then(res => {
        if (res.status === 201) {
          this.debug('gh:api', res)
          // this.sent = true
          // this.gitRes.number = res.data.number
          // this.gitRes.url = res.data.html_url
        }
      })
      .catch(e => {
        // this.attempted = false
        // this.gitErrors.push(e)
      })
    },
    validate (scope) {
      this.$validator.validateAll(scope).then(valid => {
        console.log('valid', valid)
        if (valid) this.handleSubmit()
      })
    },
    handleChange (func, id, type, e) {
      if (!func) return
      this.$store.dispatch(func, {
        [id]: ['number', 'bani'].indexOf(type) > -1 ? Number(e) : e
      })
    },
    handleSubmit () {
      const { formData: { actiuni: { confirm } }, $data, debug } = this
      if (typeof this[confirm] !== 'function') {
        debug('Confirm nedefinit, neinregistrat', $data);
        return
      }
      const manipulatedData = {}
      Object.keys($data).forEach(what => {
        let value = $data[what]
         // adauga data la indecsii numiti 'la'
        if (what === 'la') value = Date.now()
        if (value === null || value === 'undefined') return

        manipulatedData[what] = value
      })
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

form
  display flex
  flex-flow row wrap
  justify-content center
  margin: -(config.spacings.inBoxes/2)

  +desktop()
    margin: -(config.spacings.inBoxes)

  > .field
    flex 1 1 200px
    margin: 0 (config.spacings.inBoxes/2) 36px

    +desktop()
      margin: 0 config.spacings.inBoxes 36px

  label
    margin-bottom: (baseSpacingUnit*1.5)
    line-height: 16px


  .field
    display flex
    flex-flow row wrap
    height 36px
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
