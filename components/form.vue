<template lang="pug">
form.form(@submit.prevent="validate()")
  //- h5.form__title(v-if="title") {{ $t( title ) }}
  //- p.form__desc(v-if="desc") {{ $t( desc ) }}

  .form__content(v-if="$fields && $fields.length")
    slot(name=        "beforeFields")

    field(
      v-for=          "field in $fields"
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
      @change=        "handleChange(field['@change'], field.id, field.type, $event, form.name)"

      :servicii=      "field.type === 'servicii' && typeof field.servicii === 'function' ? field.servicii($store.getters) : null"

      v-model.trim=   "$data[field.id]"

      v-validate=     "field.v || null"
      :textLengthLimit= "field.v && field.v.indexOf('max:') > -1 ? 32 : null"
      :data-vv-scope= "form.name",
      :data-vv-as=    "$t( field.label )"
      :data-vv-name=  "field.id"
      :error=         "errors.has(field.id, form.name)"
      :valid=         "!errors.has(field.id, form.name)"
      :message=       "errors.first(field.id, form.name)"
    )

    slot(name=        "afterFields")

  split.actions
    buton(
      v-if= "form.name === 'apartament' && $store.getters['apartament/selected']"
      size= "small"
      styl= "unstyled"
      icon= "trash"
      dangerous
    ) {{ $t('defaults.sterge') }}
    buton(
      type= "submit",
      icon= "plus-circle"
      slot= "right"
    ) {{ isNew ? $t('defaults.forms.add') : $t('defaults.forms.edit') }}
</template>

<script>
import Vue from 'vue'
import buton from 'form/button'
import field from 'form/field'
// import frm from './form.vue'
import split from 'c/split'

import Component from 'vue-class-component';
import { State, Action, Getter } from 'vuex-class'

@Component({
  name: 'frm',
  components: {
    buton,
    split,
    field
  },
  props: {
    form: {
      type: Object,
      default: null
    },
    isNew: {
      type: Boolean,
      default: true
    }
  }
})

  export default class FormComponent extends Vue {
    @Getter('content', { namespace: 'modal' }) modalContent
    @Action('trimite', { namespace: 'feedback' }) trimiteFeedback
    @Action('close', { namespace: 'modal' }) closeModal

    get $fields () {
      return this.form.data.fields
    }

    data () {
      const { form, isNew } = this
      if (!form) throw new Error('No form supplied')
      return form.componentData(isNew, this.$store.getters)
    }

    mounted () {
      this.debug('Form Mounted')
    }

    async validate () {
      this.$validator.validateAll(this.form.name).then(valid => {
        if (!valid) throw new Error('invalid')
        this.submit()
      })
    }

    submit () {
      this.$emit('submit', this.$data)
      this.closeModal()
    }

    /**
     *
     */
    async handleChange (actionName, id, type, e, scope) {
      const { validate, debug, $store: { dispatch } } = this
      if (!actionName) {
        debug('handleChange: invalid action name supplied, dats ok!', ... arguments)
        return
      }
      const { value } = e.target

      if (value === 'undefined' || value === null) return
      const valid = await validate(scope)
      if (!valid) {
        debug(`camp invalid ${id}`)
        return
      }
      dispatch(actionName, {
        [id]: ['number', 'bani'].indexOf(type) > -1 ? Number(value) : value
      })
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
      padding-top 12px
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
    align-items flex-start
    justify-content flex-start
    flex 1 1
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
