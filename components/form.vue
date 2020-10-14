<template lang="pug">
ValidationObserver(v-slot="{ passes }")
  form.form(@submit.prevent="passes(validation)")
    drop.more(
      v-if=   "!isNew"
      icon=   "more-vertical"
      toggleText= "mai mult"
      :arrow= "false"
      iconOnly
    )
      buton(
        icon=   "edit"
        @click= "editing = !editing"
      ) {{ $lodger.i18n.edit }}
      buton(
        icon=   "trash"
      ) {{ $lodger.i18n.trash }}

    //- h5.form__title(v-if="title") {{ $t( title ) }}
    //- p.form__desc(v-if="desc") {{ $t( desc ) }}

    fieldset.header
      legend Cap

      .fields
        field(
          v-for=  "field, id in Object.keys(fields).filter(field => typeof fields[field].fieldset === 'undefined').reduce((a, b) => ({...a, [b]: fields[b]}),{})"
          :key=           "`${field._type}-${id}`"
          :id=            "id"

          :type=      "$lodger.taxonomies.indexOf(id) > -1 ? 'taxonomy' : (form.schema.properties[id]._type || 'string')"
          :label=         "typeof field.label === 'function' ? field.label(i18n.fields) : ''"
          :placeholder=   "field._type === 'bani' ? '0.00' : field.placeholder"
          :focus=         "field.focus"
          :required =     "form.schema.required.indexOf(id) > -1"
          :min=           "field.min"
          :max=           "field.max",
          :step=          "field._type === 'bani' ? 0.01 : field.step",
          :data-slot=     "field.slot"
          :searchTaxonomy="field.taxonomy"
          :click=         "field['@click']"
          :dangerous=     "field.dangerous"
          :transform=     "field.oninput && field.oninput.transform ? field.oninput.transform : null"
          :rules=         "field.v || null"
          :disabled=      "!editing"
          :avatarSeed=    "value['name']"

          v-model=   "value[id]"
          @input=     "isNew ? debug(id, $event) : doc.atomicSet(id, $event)"

          :textLengthLimit= "field.v && field.v.indexOf('max:') > -1 ? 32 : null"
        )

      slot(name="headerEnd")

    fieldset(
      v-if=   "fieldsets"
      v-for=  "fset, i in fieldsets"
    )
      legend {{ i18n.fieldsets[fset] }}

      .fields
        field(
          v-for=  "field, id in Object.keys(fields).filter(field => Number(fields[field].fieldset) === i).reduce((a, b) => ({...a, [b]: fields[b]}),{})"
          :key=           "`${field._type}-${id}`"
          :id=            "id"

          :type=      "$lodger.taxonomies.indexOf(id) > -1 ? 'taxonomy' : (form.schema.properties[id]._type || 'string')"
          :label=         "typeof field.label === 'function' ? field.label(i18n.fields) : ''"
          :placeholder=   "field._type === 'bani' ? '0.00' : field.placeholder"
          :focus=         "field.focus"
          :required =     "form.schema.required.indexOf(id) > -1"
          :min=           "field.min"
          :max=           "field.max",
          :step=          "field._type === 'bani' ? 0.01 : field.step",
          :data-slot=     "field.slot"
          :searchTaxonomy="field.taxonomy"
          :click=         "field['@click']"
          :dangerous=     "field.dangerous"
          :transform=     "field.oninput && field.oninput.transform ? field.oninput.transform : null"
          :rules=         "field.v || null"
          :disabled=      "!editing || id.indexOf('Id') === id.length - 2"

          v-model=   "value[id]"
          @input=     "isNew ? debug(id, $event) : doc.atomicSet(id, $event)"

          :textLengthLimit= "field.v && field.v.indexOf('max:') > -1 ? 32 : null"
        )

    slot

    //- fieldset(v-else-if="fields && Object.keys(fields).length")
    //-   legend bla

    //-   .content
    //-     slot(name=        "beforeFields")

    //-     field(
    //-       v-for=          "field, id in fields"
    //-       v-if=           "field.fieldset === undefined"
    //-       :key=           "`${field._type}-${id}`"
    //-       :id=            "id"
    //-       :type=          "field._type || 'text'"
    //-       :label=         "typeof field.label === 'function' ? field.label(i18n) : ''"
    //-       :placeholder=   "field._type === 'bani' ? '0.00' : field.placeholder"
    //-       :focus=         "field.focus"
    //-       :required=      "field.v && field.v.indexOf('required') > -1"
    //-       :min=           "field.min"
    //-       :max=           "field.max",
    //-       :step=          "field._type === 'bani' ? 0.01 : field.step",
    //-       :data-slot=     "field.slot"
    //-       :searchTaxonomy="field.taxonomy"
    //-       :click=         "field['@click']"
    //-       :dangerous=     "field.dangerous"
    //-       :transform=     "field.oninput && field.oninput.transform ? field.oninput.transform : null"
    //-       :rules=         "field.v || null"

    //-       v-model=   "$data[id]"

    //-       :textLengthLimit= "field.v && field.v.indexOf('max:') > -1 ? 32 : null"
    //-     )
    //-       //- :data-vv-scope= "title",
    //-       //- :data-vv-as=    "field.id"
    //-       //- :data-vv-name=  "field.id"
    //-       //- @change=        "handleChange(field['@change'], field.id, field.type, $event, form.name)"
    //-       //- :value=         "field.value()"
    //-       //- :error=         "errors.has(field.id, form.name)"
    //-       //- :valid=         "!errors.has(field.id, form.name)"
    //-       //- :message=       "errors.first(field.id, form.name)"

    //-     slot(name=        "afterFields")

    .actions(v-if="isNew")
      //- buton(
      //-   v-if="!isNew"
      //-   size= "small"
      //-   styl= "unstyled"
      //-   icon= "trash"
      //-   dangerous
      //- ) delete
      buton(
        type= "submit",
        icon= "plus-circle"
        size= "xl"
        :disabled = "!Object.keys(filteredData).length"
      ) {{ submitText }}
</template>

<script>
import buton from 'form/button'
import field from 'form/field'
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
    const { form: { fields }, isNew } = this
    if (!fields) throw new Error('No form supplied')
    const data = {
      fetched: false,
      editing: isNew
    }
    Object.keys(fields).map(field => { data[field] = null })
    return { ...data }
  },
  computed: {
    fieldsets () {
      return this.form.fieldsets
    },
    fields () {
      return this.form.fields
    },
    filteredData () {
      const { $data } = this
      const data = {}
      Object.keys(this.$data).filter(k => $data[k]).map(k => data[k] = $data[k])
      return data
    }
  },
  components: {
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
    }
  },
  methods: {
    async validation () {
      // if (!this.doc._isTemporary) return
      this.$children[0].validate().then(ok => {
        if (ok) this.$emit('submit', this.filteredData)
      })
    },
    /**
    *
    */
    // async handleChange (actionName, id, type, e, scope) {
    //   const { validate, debug, $store: { dispatch } } = this
    //   if (!actionName) {
    //     debug('handleChange: invalid action name supplied, dats ok!', ... arguments)
    //     return
    //   }
    //   const { value } = e.target

    //   if (value === 'undefined' || value === null) return
    //   const valid = await validate(scope)
    //   if (!valid) {
    //     debug(`camp invalid ${id}`)
    //     return
    //   }
    //   dispatch(actionName, {
    //     [id]: ['number', 'bani'].indexOf(type) > -1 ? Number(value) : value
    //   })
    // }
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

  .more
    position absolute
    right 0
    top 0
    height auto

.avatar
  img
    size 120px

fieldset
  padding 0
  border 0
  position relative
  width 100%
  margin -4px

  &+fieldset
    margin-top 20px

  legend
    display block
    text-transform: uppercase;
    font-size: 9px;
    font-weight: bold;
    letter-spacing: 1px;

  &:not(.header)
    legend
      &+.fields
        margin-top 8px

  &.header
    > legend
      display none

    &+fieldset
      border-top 1px solid rgba(black, .05)

  .fields
    display flex
    flex-flow row wrap
    align-items flex-start

    &+time
      margin 8px 4px

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
