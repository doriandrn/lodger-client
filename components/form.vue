<template lang="pug">
ValidationObserver(v-slot="{ passes }")
  form.form(@submit.prevent="passes(validation)" :class="{ isNew }" :data-type="form.name === 'cheltuiala' ? form.fields.modDistribuire.options[value['modDistribuire'] || $data['modDistribuire']] : undefined")
    slot(name="beforeHeader")

    fieldset(v-for=  "fset, i in fieldsets" :class=" { header: i === 'main' }")
      legend {{ i18n.fieldsets && i18n.fieldsets[fset] ? i18n.fieldsets[fset] : 'Cap' }}

      .fields
        field(
          v-for=          "field, id in Object.keys(fields).filter(field => i === 'main' ? typeof fields[field].fieldset === 'undefined' && field.indexOf('At') !== field.length - 2 : Number(fields[field].fieldset) === Object.keys(fieldsets).indexOf(i)).reduce((a, b) => ({...a, [b]: fields[b]}),{})"
          :key=           "`${form.name}-${id}`"
          :id=            "id"
          :class=         "id"

          :type=          "form.schema.properties[id].ref ? 'taxonomy' : (form.schema.properties[id]._type || 'string')"
          :label=         "typeof field.label === 'function' ? field.label(i18n.fields) : ''"
          :placeholder=   "field._type === 'bani' ? '0.00' : field.placeholder"
          :focus=         "field.focus"
          :required =     "form.schema.required.indexOf(id) > -1"
          :options=       "field.options"
          :min=           "field.min"
          :max=           "field.max",
          :step=          "field._type === 'bani' ? 0.01 : field.step",
          :data-slot=     "field.slot"
          :searchTaxonomy="field.taxonomy"
          :click=         "field['@click']"
          :dangerous=     "field.dangerous"
          :final=         "field.final"
          :freezed=       "field.freezed"
          :transform=     "field.oninput && field.oninput.transform ? field.oninput.transform : null"
          :rules=         "field.v || null"
          :disabled=      "((field.freezed || field.final) && !$l.modal.activeDoc._isTemporary) || !editing"
          :hideLabel=     "(!isNew && !editing) || form.schema.properties[id]._type === 'userAvatar' || field._type === 'dateTime' && !editing"

          @input=     "updField(id, $event)"
          :value=     "typeof $data[id] !== 'function' ? $data[id] : undefined"

          :schemaRef=         "form.schema.properties[id].ref || id.replace('Id', '').replace('distribuire', 'apartamente')"
          :refs=        "refsWithCustomFilters(id)"
          :isNew=       "isNew"
          :formData=    "$data"
          :formName=    "form.name"
          :textLengthLimit= "field.v && field.v.indexOf('max:') > -1 ? 32 : null"
        )

        field.attachments(
          v-if=         "doc && withAttachments"
          type=         "attachments"
          :key=         "`${i}-attachments`"
          :label=       "$l.i18n.taxonomies.cheltuieli.fields.attachments"
          :value=       "doc.allAttachments()"
          @input=       "doc.putAttachment($event, true)"
        )

      slot(name="headerEnd")

    slot

    .actions(v-if="isNew")
      buton(
        type= "submit",
        icon= "plus-circle"
        size= "xl"
        :disabled = "!Object.keys(value).length && !Object.keys($data).length"
      ) {{ submitText }}
</template>

<script>
import buton from 'form/button'
import field from 'form/field'

import { ValidationObserver, extend } from "vee-validate"
import { required, confirmed, length, email } from "vee-validate/dist/rules";
import { Observer } from 'mobx-vue'

extend("required", {
  ...required,
  message: "This field is required"
});

extend("email", {
  ...email,
  message: "This field must be a valid email"
});

extend("confirmed", {
  ...confirmed,
  message: "This field confirmation does not match"
});

extend("length", {
  ...length,
  message: "This field must have 2 options"
});

export default Observer ({
  name: 'F0rm',

  async fetch () {
    const { debug, value, fields, form: { name, fieldsIds, internalFields, defaults } } = this
    const _fields = { ...fields, ...internalFields }

    const values = (await Promise.all(
      fieldsIds
        .concat(['_id', '_rev', 'state'])
        .filter(k => ['createdAt', 'updatedAt'].indexOf(k) < 0 && value[k] !== undefined && value[k] !== null)
        .map(async b => ({ [b]: value[b] }))
    )).reduce((a, b) => ({ ...a, ...b }), {})

    const _defaults = await defaults(values)
    debug('defs', name, _defaults)

    Object.assign(this.$data, _defaults, values)
  },

  data () {
    const { debug, doc, form: { fields, fieldsIds, plural, schema: { attachments } }, isNew, value } = this
    if (!fields)
      throw new Error('No form supplied')

    const data =
      fieldsIds
        .concat(['_id', '_rev'])
        .reduce((a, b) => ({ ...a, [b]: undefined }), {})

    // if (attachments !== undefined && doc && !data.attachments && !isNew) {
    //   data.attachments = doc.allAttachments()
    // }

    return { ...data }
  },

  mounted () {
    if (this.form.name !== 'cheltuiala' || !this.isNew)
      return

    const {
      debug,
      $l: {
        cheltuieli: {
          distribuie,
          ssAps
        }
      }
    } = this

    this._unwatch = this.$watch(
      () => ({
        suma: this.suma,
        modDistribuire: this.modDistribuire
      }),
      function (newData, prev) {
        const { suma, modDistribuire } = newData || prev
        const { distribuire } = this
        const ids = Object.keys(distribuire || {})

        debug('ND', newData)

        if (!suma || !ids.length)
          return

        const valoare = suma ? suma.value || 0 : 0

        this.distribuire = distribuie(valoare, ids, modDistribuire)
        this.snapshotsApartamente = ssAps(ids)
      })
  },

  destroyed () {
    if (this._unwatch && typeof this._unwatch === 'function')
      this._unwatch()
  },

  computed: {
    id () {

    },
    refsWithCustomFilters () {
      return fieldId => {
        const { refs, customTaxFilters } = this
        const o = { ...refs }
        if (!customTaxFilters)
          return o

        Object.keys(customTaxFilters).forEach(filter => {
          const f = filter.split('_')
          const dis = f[0]
          const crumbId = f[1]

          if (dis !== fieldId)
            return

          if (!o.crumbsIds[crumbId])
            return

          Object.assign(o.crumbsIds, {
            ...customTaxFilters[filter](o.crumbsIds[crumbId])
          })
          delete o.crumbsIds[crumbId]
        })

        // hacky shit, move elsewhere! todo!
        if (fieldId === 'cheltuieli')
          delete o.crumbsIds.blocId

        return o
      }
    },
    fieldsets () {
      return Object.assign({}, { main: 'Cap', ...this.form.fieldsets })
    },
    fields () {
      return this.form.fields
    },

    withAttachments () {
      return !!this.form.schema.attachments
    }
  },
  components: {
    buton,
    field,
    ValidationObserver
  },
  props: {
    form: {
      type: Object,
      default () {
        return {}
      }
    },
    value: {
      type: Object,
      default () {
        return {}
      }
    },
    doc: {
      type: Object,
      default: null,
      required: true
    },
    editable: {
      type: Boolean,
      default: false
    },
    editing: {
      type: Boolean,
      default: true
    },
    title:{
      type: String,
      default: 'form'
    },
    isNew: {
      type: Boolean,
      default: false
    },
    i18n: {
      type: Object,
      default: null
    },
    submitText: {
      type: String,
      default: ''
      // default () {
      //   return this.isNew ? ''
      // }
    },

    refs: {
      type: Object,
      default: null
    },
    customTaxFilters: {
      type: Object,
      default: null
    }
  },

  methods: {
    updField (id, e) {
      const { isNew, editing, $data, doc, debug } = this

      if (!editing)
        return

      /** !!! */
      if (e !== undefined)
        $data[id] = e

      if (id === 'distribuire')
        return

      if (!isNew) {
        doc.atomicPatch({ [id]: e, updatedAt: new Date().getTime() })
        debug('patchuit', id, e)
        return
      }
    },
    async validation () {
      this.$children[0].validate().then(ok => {
        if (!ok)
          return

        const { $data, form: { opts: { captureTimestamp }}, $l: { freshDates } } = this
        this.$emit('submit', captureTimestamp ?
          Object.assign({}, { ...$data }, { ...freshDates() }) :
          { ...$data }
        )
          // this.$emit('submit', Object.keys(this.filteredData).reduce((a, b) => ({ ...a, [b]: typeof this.filteredData[b] === 'function' ? this.filteredData[b]() : this.filteredData[b]}), {}))
      })
    }
  }
})
</script>

<style lang="stylus">
@require '~styles/config'

.form
  display flex
  flex-flow row wrap
  justify-content center
  width 100%
  // max-width 480px

  &+.form
    margin-top 32px

  .actions
    margin-top 20px

  .trash
    position absolute
    bottom -18px
    left -18px
    top auto

    &:hover
    &:focus
    &:active
      top auto
      bottom -17px

  .lock
    position absolute
    right -18px
    top -18px

    &:hover
    &:focus
    &:active
      top -17px


fieldset
  padding 0
  border 0
  position relative
  width 100%
  margin -1px
  user-select none

  &:not(.header)
    &:not(:first-child)
      margin-top 40px
      border-top 1px solid rgba(black, .05)

  legend
    display block
    text-transform: uppercase;
    padding 0
    font-size: 9px
    line-height 10px
    font-weight: 400;
    letter-spacing: 2px;
    margin-bottom 20px
    user-select none

  &:not(.header)
    legend
      &+.fields
        margin-top 8px

  &.header
    order -1
    > legend
      display none

    .fields
      display grid
      grid-template-columns repeat(2, 1fr)
      grid-template-rows auto
      grid-row-gap 40px
      grid-column-gap 20px

      +above(m)
        grid-template-columns repeat(6, 1fr)
        grid-row-gap 32px
        grid-column-gap 32px

      +above(xl)
        grid-row-gap 36px
        grid-column-gap 36px

      +desktop()
        grid-row-gap 40px
        grid-column-gap 40px

  .fields
    display flex
    flex-flow row wrap
    align-items flex-start

    &+time
      margin-top 12px

  &:not(.header)
    .fields
      > span
        &:not(:last-child)
          margin-right 24px

  .content
    display flex
    flex-flow row wrap
    flex 1 0 100%
    height 100%
    justify-content flex-start

    > span
      margin 10px
      padding 8px 12px
      border-radius 8px
      display flex
      flex-flow row wrap
      position relative
      align-items flex-start
      justify-content flex-start
      flex 1 1 auto
      order 2
      max-width 335px

      > div
        flex 1 1 100%

      &.error
        label
        p:last-child
            color: config.palette.error

        input
          border-color: config.palette.error !important

      &[data-type="userAvatar"]
        size 80px
        flex-basis 80px
        flex-grow 0
        order 0
        background rgba(black, .05)
        border-radius 50px
        position relative
        overflow hidden
        margin 0 auto


      &:not([data-type="userAvatar"])
        background rgba(white, .35)

        &[data-req]
          background rgba(white, .9)
          order 1

          &:hover
          &:focus
            box-shadow 2px 1px 15px 5px rgba(black, .025)

      &[data-type="radios"]
        align-items center

      &[data-type="contactFields"]
        flex-basis 100%

      &[data-type="number"]
        flex-basis 110px
        flex-grow 1

      &[data-type="separator"]
        flex-basis 100%
        flex-shrink 0

      &[data-size="small"]
        input
          padding 4px
          border-radius 24px

      &[data-icon]
        > input
          padding-left 20px

      &[data-type="scari"]
        flex-direction column-reverse !important
        flex-wrap nowrap !important
        flex-basis 100% !important
        height auto

        .field
          margin-bottom 0
          margin-top 0

        > label
          font-weight 600
          margin-bottom 32px
          flex 0 0 14px
          align-self flex-start

      &[data-type="servicii"]
      &[data-type="detaliiApSelectat"]
        flex 0 0 100% !important

      &[data-type="search"]
        position relative
        padding-left 0
        max-width 100%
        flex-flow row wrap !important

        &:before
          position absolute
          top 8px
          left 0
          background-color: config.typography.palette.meta

        > label
            left 22px


        &[data-size="small"]
          input
            max-width 130px
            min-width 96px
            padding-right 16px
            transition all .15s ease-in-out

            &:focus
              max-width 155px

      &[data-type="bani"]
        flex-basis 120px

        > p
          margin-bottom 0
          position absolute
          top 35px
          z-index 2
          font-size 12px
          background white
          padding 0 4px

        label
          user-select none
          flex 1 1 24px

        .limit
          user-select none
          position absolute
          right 0
          color: config.typography.palette.meta
          opacity 0
          font-size 10px
          visibility hidden

      &[data-type="text"]
      &[data-type="textarea"]
      &[data-type="number"]
      &[data-type="search"]
      &[data-type="bani"]
        label
            position absolute 8px 0 auto 0
            transition all .05s ease-in-out
            margin-bottom 0
            min-width 100px
            pointer-events none

        &.field--val
          .field__label
            moveFieldLabel()

      &[data-type="checkbox"]
        display inline-flex
        flex-wrap nowrap
        cursor pointer

      &[data-type="radios"]
        flex-direction row-reverse

    // &:not([data-type="text"])
    //   &:not([data-type="textarea"])
    //     &:not([data-type="altselect"])
    //       &:not([data-type="scari"])
    //         &:not([data-type="radios"])
    //           // flex-direction row-reverse
    //           height auto
    //           flex-flow column-reverse nowrap
    //           align-items flex-start
    //           justify-content flex-end
    //           // margin-top 0

    &[data-vv-name="nr"]
      flex 0 0 60px !important


  .separator
    margin-top 0

</style>
