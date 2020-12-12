<template lang="pug">
ValidationObserver(v-slot="{ passes }")
  form.form(@submit.prevent="passes(validation)" :class="{ isNew }" :data-type="form.name === 'cheltuiala' ? form.fields.modDistribuire.options[value['modDistribuire'] || $data['modDistribuire']] : undefined")
    slot(name="beforeHeader")

    fieldset(v-for=  "fset, i in fieldsets" :class=" { header: i === 'main' }")
      legend {{ i18n.fieldsets && i18n.fieldsets[fset] ? i18n.fieldsets[fset] : 'Cap' }}

      .fields
        field(
          v-for=          "field, id in Object.keys(fields).filter(field => i === 'main' ? typeof fields[field].fieldset === 'undefined' && field.indexOf('At') !== field.length - 2 : Number(fields[field].fieldset) === Object.keys(fieldsets).indexOf(i)).reduce((a, b) => ({...a, [b]: fields[b]}),{})"
          :key=           "`${field._type}-${id}`"
          :id=            "id"
          :class=         "id"

          :type=      "$lodger.taxonomies.indexOf(id) > -1 ? 'taxonomy' : (form.schema.properties[id]._type || 'string')"
          :label=         "typeof field.label === 'function' ? field.label(i18n.fields) : ''"
          :placeholder=   "field._type === 'bani' ? '0.00' : field.placeholder"
          :focus=         "field.focus"
          :required =     "form.schema.required.indexOf(id) > -1"
          :default=       "field.default"
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
          :disabled=      "((field.freezed || field.final) && !$lodger.modal.activeDoc._isTemporary) || !editing"
          :avatarSeed=    "value['name'] || $data['name']"
          :hideLabel=     "(!isNew && !editing) || form.schema.properties[id]._type === 'userAvatar' || field._type === 'dateTime' && !editing"

          :value=     "$data[id] !== undefined ? $data[id] : value && value[id] !== undefined ? value[id] : form.fields[id].default"
          @input=     "updField(id, $event)"

          :refs=        "$lodger.taxonomies.indexOf(id) > -1 || $lodger.taxonomies.indexOf(id.replace('Id', '').plural) > -1 || field._type === 'selApartamente' ? refs : undefined"
          :isNew=       "isNew"
          :formData=    "filteredData"
          :textLengthLimit= "field.v && field.v.indexOf('max:') > -1 ? 32 : null"
        )

        attachments.attachments(
          v-if=         "doc && withAttachments"
          :value=       "doc.allAttachments()"
          @input=       "debug($event); doc.putAttachment({ id: $event.name, data: $event.buffer, type: $event.type })"
        )

      slot(name="headerEnd")

    slot

    .actions(v-if="isNew")
      buton(
        type= "submit",
        icon= "plus-circle"
        size= "xl"
        :disabled = "!Object.keys(value).length && !Object.keys(filteredData).length"
      ) {{ submitText }}
</template>

<script>
import buton from 'form/button'
import field from 'form/field'
import attachments from 'form/attachments'

import split from 'c/split'
import drop from 'c/dropdown'

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

  data () {
    const { debug, doc, form: { fields, fieldsIds, plural, schema: { attachments } }, isNew, value } = this
    if (!fields) throw new Error('No form supplied')
    const data = {
      fetched: false
    }
    fieldsIds.concat(['_id', '_rev']).forEach(k => data[k] = value[k] || fields[k] && fields[k].default)

    // default for sume
    if (fieldsIds.indexOf('suma') > -1 && data.suma === undefined)
      data.suma = {
        value: 0,
        moneda: this.$lodger.displayCurrency
      }

    if (fieldsIds.indexOf('snapshotsApartamente') > -1 && data.snapshotsApartamente === undefined)
      data.snapshotsApartamente = {}

    if (attachments !== undefined && doc && !data.attachments && !isNew) {
      data.attachments = doc.allAttachments()
    }

    return { ...data }
  },

  computed: {
    fieldsets () {
      return Object.assign({}, { main: 'Cap', ...this.form.fieldsets })
    },
    fields () {
      return this.form.fields
    },
    filteredData () {
      const { $data, value, fields, form: { fieldsIds } } = this
      const data = {}
      Object
        .keys(this.$data)
        .filter(k => fieldsIds.concat(['_id', '_rev']).indexOf(k) > -1 && (value[k] !== undefined || $data[k] !== undefined))
        .map(k => data[k] = $data[k] || fields[k] && fields[k].default)

      return data
    },

    withAttachments () {
      return !!this.form.schema.attachments
    },

    snapshotsAps () {
      if (this.form.plural !== 'cheltuieli')
        return {}

      const { apartamente } = this.$lodger
      const { items } = apartamente.subscribers.single

      return Object.keys(this.distribuire)
        .reduce((a, b) => ({
          ...a,
          [b]: apartamente.form.fieldsIds
            .reduce((x, y) => ({
              ...x,
              [y]: items[b]._doc._data[y]
            }), {})
        }), {})
    },

    distrChelt () {
      if (
        this.form.plural !== 'cheltuieli' ||
        ! this.suma
      )
        return

      const {
        $lodger: {
          convert,
          displayCurrency,
          apartamente: {
            subscribers
          }
        },
        fields,
        debug,

        modDistribuire,
        suma: {
          value,
          moneda
        },
        distribuire,
        asociatieId
      } = this

      const sub = subscribers.single
      const { items, ids } = sub
      const idsApsSel = Object.keys(distribuire)

      // if (ids.length < idsApsSel.length)
      //   throw new Error('Something went wrong')

      if (!value)
        return

      const modDistribuireType = fields.modDistribuire.options[modDistribuire]
      const allUnits = idsApsSel.reduce((a, b) => a + items[b][modDistribuireType], 0)
      // const cpu = displayCurrency === moneda ?
      //   value / allUnits :
      //   convert.call(this.$lodger, value, moneda) / allUnits
      const cpu = value / allUnits

      // const percentage = 100 / allUnits
      return idsApsSel.reduce((a, b) => ({ ...a, [b]: items[b][modDistribuireType] * cpu }), {})
    }
  },
  components: {
    attachments,
    buton,
    drop,
    split,
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
    }
  },
  watch: {
    filteredData: function (newData, prev) {
      if (
        this.form.plural !== 'cheltuieli' ||
        ! this.isNew ||
        ! newData.suma
      )
        return

      if (Object.keys(newData.distribuire).length < 1)
        return

      Object.assign(this.$data.distribuire, this.distrChelt)
      Object.assign(this.$data.snapshotsApartamente, this.snapshotsAps)
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
        this.debug(this.filteredData, 'o')
        if (ok)
          this.$emit('submit', this.filteredData)
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
