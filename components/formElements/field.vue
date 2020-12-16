<template lang="pug">
ValidationProvider(
  :name=        "label"
  :vid=         "id"
  :rules=       "v"
  v-slot=       "{ errors }"
  :data-size=   "size"
  :data-type=   "isRel ? 'rel' : type"
  :data-icon=   "type === 'search' ? 'search' : icon"
  :data-req=    "required"
  :skip-if-empty= "false"

  :class=       "{ final: final || freezed, error, value, away: type === 'search' && !focusing, zebra: type === 'scari' }"
  :tabIndex=    "type === 'checkbox' ? 0 : null"
)
  input(
    v-if=         "['modDistribuire', 'attachments'].indexOf(id) < 0 && ['$', 'taxonomy','radios', 'textarea', 'checkboxes', 'scari', 'userAvatar', 'select', 'altselect', disabled ? 'dateTime' : 'asd'].indexOf(type) < 0 && ['string', 'number'].indexOf(String(type).asRxDBType) > -1 && !isRel && name !== 'rol'",
    :type=        "type.asRxDBType === 'string' && ['searchbox', 'checkbox', 'search', 'email'].indexOf(type) < 0 ? 'text' : (type === 'dateTime' && !disabled ? 'datetime-local' : type)",
    :placeholder= "placeholder",
    :autocomplete="autocomplete ? 'on' : 'off'",
    :autosuggest= "autosuggest"
    spellcheck=   "false"
    :id=          "id",
    :name=        "id"
    :autofocus=    "focus"
    :disabled=    "disabled"
    :required=    "required",
    :min=         "type === 'number' ? min : null"
    :max=         "type === 'number' ? max : null"
    :step=        "['bani', 'number'].indexOf(type) > -1 ? step : null"
    :value=       "val",
    :checked=     "checked || value"
    @input=       "handleInput",
    @change=      "handleChange"
    :aria-label=  "hideLabel ? label : undefined"
    v-shortkey.focus=   "focusShortkeys ? {windows: focusShortkeys, mac: focusShortkeys.map(i => i.replace('ctrl', 'meta'))} : undefined"

    @keydown.enter= "selecteaza"
    @keyup.tab=     "selecteaza"
    @keyup.down=    "indexSelectat(1)"
    @keyup.up=      "indexSelectat(0)"
    @keydown.esc=   "inchideModale"
    :class=         "{ av: !!value }"
    v-on-clickaway=   "clickAway"
    @focus=       "$emit('focusing'); if (type === 'search') focusing = true"
  )

  bani(
    v-else-if=  "['suma', 'bani', 'balanta', '$'].indexOf(type) > -1"
    :valoare=   "value"
    :base=      "Number($lodger.displayCurrency)"
    @input=       "$emit('input', $event)"
    :disabled=    "disabled"
    showBoth
  )
  date-time(
    v-else-if=  "type === 'dateTime' && disabled"
    v-show=     "value && (name !== 'updatedAt' || (name === 'updatedAt' && formData.createdAt !== formData.updatedAt))"
    :unixTime=  "value"
    liveUpdate
  )
  meter(
    :id=        "id"
    v-else-if=  "type === 'meter'"
    :value=     "value"
    :min=       "0"
    :max=       "100"
  )
  buton(
    v-else-if=    "type === 'button'"
    :aria-label=  "label"
    :dangerous=   "dangerous"
    @click=       "handleClick"
  ) {{ label || text }}
  textarea(
    v-else-if=    "['textarea'].indexOf(type) > -1"
    :placeholder= "placeholder",
    :value=       "value",
    @input=       "$emit('input', $event.target.value)"
    :required=    "required",
    :id=          "id",
  )
  slect(
    v-else-if=    "type === 'select' || id === 'modDistribuire' || name === 'rol'"
    :options=     "name === 'rol' ? $lodger.i18n.roluri : options"
    :value=       "value",
    :required=    "required",
    :placeholder= "placeholder"
    @input=       "$emit('input', String(Number($event.target.value)) === $event.target.value ? Number($event.target.value) : $event.target.value)"
    :id=          "id"
    :arrow=       "arrow"
    :disabled=    "disabled"
    :optGrpLabels=      "optGrpLabels"
  )
  //- altslect(
  //-   v-else-if=    "type === 'altselect'"
  //-   :options=     "options"
  //-   :value=       "value",
  //-   :required=    "required",
  //-   @input=       "$emit('input', $event)"
  //-   :id=          "id"
  //-   :arrow=       "arrow"
  //-   :disabled=    "disabled"
  //- )
  avatar(
    v-else-if=    "['avatar', 'userAvatar'].indexOf(type) > -1"
    :id=          "id"
    :seed=        "formData.name"

    :value=       "value"
    @input=       "$emit('input', $event)"

    :disabled=    "disabled"
  )

  scari(
    v-else-if=    "type === 'scari'",
    :value=       "value",
    @input=       "$emit('input', $event)"
    :disabled=    "disabled"
  )

  radios(
    v-else-if=    "type === 'radios'",
    :id=          "id",
    :value=       "value",
    @change=      "$emit('input', $event); debug($event)"
    @click=       "$emit('click', $event)"
    :options=     "options"
  )
  checkboxes(
    v-else-if=    "type === 'checkboxes'",
    :id=          "id",
    :value=       "value",
    @change=      "$emit('input', $event)"
    :options=     "options"
  )
  contoare(
    v-else-if=      "type === 'contoare'"
  )
  contact(
    v-else-if=      "type === 'contactFields'"
    :disabled=      "disabled"
    :value=         "value"
    @input=         "$emit('input', $event)"
  )

  servicii(
    v-else-if=        "type === 'taxonomy' && id === 'servicii'"
    @input=           "$emit('input', $event)"
    :value=           "value"
    :servicii=        "$lodger.servicii.subscribers[$lodger.mainSubName].items"
    :disabled=        "disabled"
  )
  tax(
    v-else-if=        "id && (isRel || ['taxonomy', 'selApartamente'].indexOf(type) > -1)"
    :id=              "id",
    :taxonomy=        "isRel || type === 'taxonomy' ? id.indexOf('Id') < -1 && id.plural === id ? $lodger[id] : $lodger[id.replace('Id', '').plural] : $lodger.apartamente"
    :previewFields=   "taxPreviewFields(type === 'taxonomy' ? $lodger[id] : $lodger.apartamente)"
    :criteria=        "refs ? { limit: isRel ? isNew && !disabled ? 1000 : 1 : undefined,filter: isRel ? refs.refs[id.replace('Id', '')] : Object.keys(refs.crumbsIds).reduce((a,b)=> ({ ...a, [b]: { [b.indexOf('Id') === b.length - 2 ? '$eq': '$in']: refs.crumbsIds[b] } }), {}) } : undefined"
    :selectedId=       "value && typeof value === 'object' && typeof value.length === 'undefined' ? value.selectedId : value ? value : undefined"
    :subscriberName=   "`single${ refs && refs.crumbsIds && Object.keys(refs.crumbsIds) === 1 ? `${ refs[Object.keys(refs.crumbsIds)[0]] }` : '' }`"
    @input=           "$emit('input', $event)"
    :value=           "value"
    :disabled=        "disabled"
    :formData=        "formData"
    :fuzzy=           "isRel"
  )
    //- rel(
    //-   v-if=    "isRel"
    //-   :disabled=    "disabled"
    //-   :value=       "value"
    //-   :taxonomy =   "id.replace('Id', '').plural"
    //- )
    //-   p lol
    //- :criteria=        "{ filter: type === 'selApartamente' ? refs : { [`${ $lodger[id].name }Id`]: { '$eq': formData._id }}}"
    //- :populated= "value || []"
    //- div(slot="item" slot-scope="{ item }") {{ item.name }}
    //- button.new(@click="") +

  multi(
    v-else-if= "type === 'contactFields'"
    :fields= "{ tip: { type: 'select', options: {tel: $lodger.i18n.taxonomies.utilizatori.fields.tel, email: '', social: ''} }, val: {} }"
  )

  div(v-else) {{ type }} UNSUPOORTED YET

  labl(
    v-show=         "!hideLabel && type !== 'button'"
    :required=      "required"
    :for=           "id"
    :data-icon=     "isNew && (final || freezed) ? 'flag' : id.indexOf('lang') === 0 ? 'globe' : undefined"
  ) {{ label }}

  //- p.field__message(v-if="message") {{ message }}
  span.field__limit(
    v-if= "type === 'text' && textLengthLimit > 0 && val"
  ) {{ val.length }} / {{ textLengthLimit }}

  skey(v-if=  "focusShortkeys" :keys="focusShortkeys")

  .errors
    .err(v-for="e in errors") {{ e }}

  slot(:value="value")
</template>

<script>
import labl from 'form/label'
import slect from 'form/select'
import altslect from 'form/altselect'
import txtarea from 'form/textarea'
import checkboxes from 'form/checkboxes'
import buton from 'form/button'
import file from 'form/file'
import radios from 'form/radioGroup'
import scari from 'form/scari'
import multi from 'form/presets/multi'
import contact from 'form/contact'


import contoare from 'form/contoare'
import selApartamente from 'form/selApartamente'
import apartament from 'struct/apartament'

import servicii from 'c/servicii'
import tax from  'c/tax'
import rel from 'c/rel'
import bani from 'c/bani'
import avatar from 'c/avatar'
import dateTime from 'c/dateTime'
import skey from 'c/shortkeys'
import dropdown from 'c/dropdown'

import transformOnInput from 'helpers/transformOnInput'
import { mixin as clickaway } from 'vue-clickaway'
import { mapActions } from 'vuex'


import { ValidationProvider, extend } from 'vee-validate';
// import { required } from 'vee-validate/dist/rules';

// extend('required', {
//   ...required,
//   message: 'This field is required'
// });

export default {
  mixins: [ clickaway ],
  // beforeCreate () {
  //   this.$options.components.tax = require('c/tax').default
  // },
  computed: {
    isRel () {
      return this.id.indexOf('Id') === this.id.length - 2
    },
    val () {
      const { type, searchTaxonomy, selected, debug, id } = this
      let { value } = this

      // a weird reset
      if (['text', 'search'].indexOf(type) > -1 && typeof value === 'boolean') {
        value = ''
      }

      if (type === 'checkbox') {
        value = Boolean(value)
      }

      // if (type)

      if (type.asRxDBType === 'string' && typeof value === 'boolean')
        return ''

      if (type === 'dateTime') {
        return new Date(new Date(value).getTime()).toISOString().substring(0, (new Date(new Date(value).getTime()).toISOString().indexOf("T")|0) + 6|0)
      }

      // if (type === 'select' && id.indexOf('currency') > -1) {
      //   value = Number(value)
      // }

      if (value && selected && selected._id) {
        if (searchTaxonomy === 'apartamente') return selected.proprietar
        if (searchTaxonomy === 'furnizori') return selected.nume
      }
      return value
    },

    selected () {
      const { type, value, searchTaxonomy } = this
      if (type !== 'search' || !value) return

      const tax = this[searchTaxonomy]
      if (!tax || typeof value !== 'string') return

      return tax[value] || { _id: null }
    },


    taxes () {
      const { results, type } = this
      if (type !== 'search') return
      if (!results) return

      return Object.keys(results)
    }
  },
  data () {
    // CUSTOM  only for search
    if (this.type !== 'search') return {}
    return {
      focusing: false,
      indexRezultatSelectat: 0
    }
  },
  name: 'Field',
  props: {
    type: {
      type: String,
      default: 'text'
    },
    id: {
      type: String,
      default: 'NOID!'
    },
    // default: {
    //   type: [Object, Number, String, Array, Boolean],
    //   default: null
    // },
    name: {
      type: String,
      default () {
        return this.id
      }
    },
    rules: {
      type: [Object, String],
      default: ""
    },
    transform: {
      type: String,
      default: null
    },
    dangerous: {
      type: Boolean,
      default: null
    },
    label: {
      type: String,
      default: 'Field Label'
    },
    optGrpLabels: {
      type: Object,
      default: null
    },
    click: {
      type: String,
      default: 'debug'
    },
    /* Hide Label enforces the input to display the label text as a placeholder */
    hideLabel: {
      type: Boolean,
      default: false
    },
    placeholder: {
      type: String,
      default: null
    },
    focus: {
      type: Boolean,
      default: null
    },
    focusShortkeys: {
      type: Array,
      default: null
    },
    required: {
      type: Boolean,
      default: false
    },
    checked: {
      type: Boolean,
      default: false
    },
    min: {
      type: Number,
      default: null
    },
    max: {
      type: Number,
      default: null
    },
    step: {
      type: Number,
      default: null
    },
    size: {
      type: String,
      default: null
    },
    isNew: {
      type: Boolean,
      default: false
    },

    value: {
      type: [Boolean, String, Array, Object, Number],
      default: null
    },
    // Additional description
    message: {
      type: String,
      default: null
    },
    // 4 selects
    options: {
      type: [Array, Object],
      default () {
        return {}
      }
    },
    autocomplete: {
      type: Boolean,
      default: false
    },
    autosuggest: {
      type: Boolean,
      default: false
    },
    searchTaxonomy: {
      type: String,
      default: null
    },

    disabled: {
      type: [Boolean, Array, Object],
      default: null
    },

    arrow: {
      type: Boolean,
      default: false
    },
    icon: {
      type: String,
      default: null
    },
    error: {
      type: Boolean,
      default: false
    },
    textLengthLimit: {
      type: Number,
      default: -1
    },
    valid: {
      type: Boolean,
      default: false
    },
    v: {
      type: String,
      default: ''
    },
    avatarSeed: {
      type: String,
      default: 'drn'
    },
    refs: {
      type: Object,
      default: null
    },
    formData: {
      type: Object,
      default: null
    },
    final: {
      type: Boolean,
      default: false
    },
    freezed: {
      type: Boolean,
      default: false
    }
  },
  components: {
    altslect,
    apartament,
    avatar,
    bani,
    buton,
    checkboxes,
    contact,
    contoare,
    dateTime,
    dropdown,
    file,
    labl,
    multi,
    radios,
    rel,
    scari,
    servicii,
    selApartamente,
    skey,
    slect,
    tax,
    txtarea,
    ValidationProvider
  },

  methods: {
    taxPreviewFields ($tax) {
      const { form: { previewFields } } = $tax
      switch (this.type) {
        case 'taxonomy':
          return previewFields

        case 'selApartamente':
          return this.isNew ?
            previewFields.concat(['suprafata', 'locatari', 'impartire']) :
            previewFields.filter(k => k !== 'balanta').concat(['impartire'])
      }
    },
    /**
     * Metode doar pentru search
     */
    selecteaza (e) {
      const { id, tax } = e
      if (id) {
        this.$emit('input', id)
        this.clearResults()
        this.debug('tax', tax)
        return
      }
      const {
        results,
        indexRezultatSelectat,
        debug,
        type,
        searchTaxonomy
      } = this
      if (type !== 'search') return
      e.preventDefault()

      let taxResults = searchTaxonomy ? results[searchTaxonomy] : null
      if (!taxResults) return

      const rezultat = taxResults[indexRezultatSelectat]
      this.$emit('input', rezultat.id)
      this.clearResults()
    },


    // handleClick (e) {
    //   const { click, debug } = this
    //   debug('click', click)
    //   let what
    //   if (click.indexOf('/')) {
    //     what = click.split('/')[0]
    //   }
    //   if (what) {
    //     const { _id } = this.$store.getters[`${what}/active`]
    //     this.$store.dispatch(click, { _id })
    //   } else {
    //     const f = this[click]
    //     if (!f) return
    //     f(this)
    //   }
    // },

    handleInput (e) {
      let { value, type } = e.target
      const { search, transform, debug, $options: { filters } } = this
      switch (type) {
        case 'checkbox':
          return
          // value = Boolean(value)
          // value = !value
          // break

        case 'number':
          value = Number(value)
          break

        case 'datetime-local':
          const d = new Date(value)
          value = d.getTime()
          break

        case 'text':
          value = transformOnInput(transform, value, filters, debug)
          break
      }

      this.$emit('input', value)
    },

    handleChange (e) {
      let { value, type, debug, valid, required } = this
      if ( required && !valid) return
      console.log('hc2')

      if (type === 'checkbox') {
        value = Boolean(value)
        value = !value
      }

      debug(e.target.value, type, e)
      if (['radio', 'checkbox'].indexOf(type) > -1) {
        this.$emit('input', value)
        return
      }
      this.$emit('change', e)
    },

    clickAway () {
      if (this.type !== 'search') return
      this.focusing = false
      this.$emit('clickAway')
    },

    // inchideModale () {
    //   const { modalOpen, closeModal } = this
    //   if (modalOpen) closeModal()
    // },

    indexSelectat (incDec) {
      const { type } = this
      if (type !== 'search') return

      const { taxes, indexRezultatSelectat, results } = this

      // taxes.forEach(tax => {

      // })
      //+
      // type === 'search' ? (indexRezultatSelectat < results[searchTaxonomy].length - 1 ? indexRezultatSelectat++ : indexRezultatSelectat = 0) : null
      // -
      //type === 'search' ? (indexRezultatSelectat > 0 ? indexRezultatSelectat-- : indexRezultatSelectat = results[searchTaxonomy].length - 1) : null
    }
  }
}
</script>

<style lang="stylus">
@require '~styles/config'

palette = config.palette
typeColors = config.typography.palette

input
textarea
.vue-tel-input
  border 1px solid transparent

.contact
  .vue-tel-input
    border-color transparent

    &:focus-within
      box-shadow none

  .vti__dropdown
    padding-left 0
    outline 0

    &:hover
      background-color transparent


input
textarea
  padding 4px 12px

  &::placeholder
    color: typeColors.meta
    font-weight 100
    opacity 0
    transition opacity .1s ease

  &:active
    color: palette.primary

  &:focus
    color: palette.primary
    box-shadow: inset 0 1px 1px rgba(0,0,0,.075), 0 0 8px rgba(102,175,233,.6);
    border-color: palette.primary

    &::placeholder
      opacity 1

  &:focus
  &:active
    &+label+.focuskeys
      opacity 0
      visibility hidden

  &:not(:disabled):not(.primary):not([type="submit"])
    // border-radius 2px
    border-radius: 46px;
    // border-radius 6px
    background: #f5f7fb;
    box-shadow inset 2px 2px 3px rgba(black, .1), inset -3px -3px 6px white
    // box-shadow: inset 6px 6px 12px #d0d2d5,
    //             inset -6px -6px 12px #ffffff;

  &.disabled
  &:disabled
    background-color transparent
    border-color transparent
    padding-left 0
    padding-right 0
    user-select none

    &+label
      color #1a1a1a

input[type="text"]
input[type="search"]
input[type="number"]
input[type="password"]
input[type="date"]
textarea
[data-type="rel"] a
  color black
  font-size 16px
  line-height 24px
  min-width 32px
  transition all .15s ease-in-out
  // padding 8px 0
  width 100%
  height 100%
  max-width 100%

  &:disabled
    text-overflow: ellipsis


[data-type="rel"]
  a
    text-decoration underline
    cursor pointer

    &+label
      color #1a1a1a

input[type="number"]
  width 80px

  &:disabled
    &::-webkit-outer-spin-button
    &::-webkit-inner-spin-button
      appearance none

input[type="radio"]
  &+label
    font-size 0
    height 40px
    display block

    > span
      size 40px
      display block
      border-radius 50%

      position: absolute
      top 50%
      left 0
      transform translateY(-50%)

      &:before
        content ''
        size 20px
        border-radius 50%
        border: 1px solid config.typography.palette.meta
        position absolute
        top 50%
        left 50%
        transform translate(-50%, -50%)
        background-size 20px

  &:hover
  &:focus
  &:active
    &+label
      > span
        border-color: palette.primary

  &:checked
    &+label
      > span:before
        background-image: embedurl('~static/icons/ui/stop-circle.svg', 'utf8')
        background-size contain
        background-repeat no-repeat
        border-color transparent

  &:disabled
    &+label>span
      opacity .25
      cursor default
  &:hover
    cursor pointer

input[type="checkbox"]
  appearance none
  position absolute
  opacity 0
  size 20px

  &:not(:checked)
    &+label
      cursor pointer

  &+label
    line-height 18px
    cursor pointer
    position relative
    margin 0 !important
    width 100%
    display flex
    flex-flow row nowrap
    justify-content center
    padding 12px // sa fie mai pushy
    color: typeColors.meta

    &:before
      icon('x')
      background-color: typeColors.meta
      position relative
      margin-right 4px
      top 1px

    > span
      size 40px
      transition background-color .15s ease-in-out

      &:not(small)
        display block
        border-radius 50%
        border: 1px solid config.typography.palette.meta

    small
      display none

  &:checked
    &+label
      color: typeColors.headings
      cursor default
      &:before
        mask-image embedurl('~static/icons/ui/check.svg')
        background-color: typeColors.headings
      > span
        background-image: embedurl('~static/icons/ui/stop-circle.svg', 'utf8')
        background-size contain
        background-repeat no-repeat
        border-color transparent

  &:disabled
    &+label>span
      opacity .25
      cursor default

  &:hover
  &:focus
  &:active
    cursor pointer

    &+label
      color: typeColors.headings

      &:before
        background-color: typeColors.headings

.input
  &__cbox
    display flex
    flex-flow column nowrap
    margin 4px 4px 8px
    height 12px

    > input[type="checkbox"]
      display none

.radios
  display flex
  flex-flow row nowrap
  align-items center
  margin -4px
  cursor default

  *
    margin 0

  > span
    display flex
    flex-flow column nowrap
    margin 4px 4px 8px
    position relative
    min-width 40px

  input[type="radio"]
    display none

    &:hover
      > input[type="radio"]:not(:checked)+label
        > span
          background-color: lighten(palette.primary, 90%)

span[data-type]
  text-align left
  display flex
  flex-flow column-reverse nowrap
  justify-content flex-end

  // &.final
  //   label
  //     &:after
  //       content 'F'

.attachments
  position relative

  &:before
    content ''
    position absolute 0
    z-index -1
    background rgba(black, .05)

[data-type="search"]
  max-height 40px
  display flex
  flex-flow row nowrap

  &:before
    top calc(50% - 6px)
    left 10px
    position absolute
    background-color rgba(black, .5)

  > input[type="search"]
    padding-left 32px !important
    &::placeholder
      font-size 12px
      opacity 1

  &.away
    .results
      opacity 0
      visibility hidden


span[data-type="userAvatar"]
  margin 0 auto

span[data-type="select"]
  letter-spacing 0

bigBalanta()
  font-size 20px
  color black
  font-weight bold

span[data-type="$"]
  // margin-left auto // strica asoc single

  *
    text-align right
    justify-content flex-end

  .bani
    margin-bottom auto

  &.value
    .bani > span:first-child
      bigBalanta()

  span
    white-space nowrap
    display flex
    flex-flow row nowrap
    align-items baseline

  a
    font-weight 400
    margin-top 4px

  input[type="number"]
    min-width 160px

    &+.sign
      margin-left 4px

  input[type="number"]
  input[type="number"]+.sign
    bigBalanta()

span[data-type="taxonomy"]
  flex-basis 47%

// span[data-type="checkbox"]


input[name="nr"]
.ap__nr
  font-family: config.typography.fams.headings
  color: config.palette.tertiary
  letter-spacing 1.2px

input[name="nr"]
  font-size 14px

.sort
  display flex
  flex-flow row nowrap !important
  margin-right 12px
  position relative
  size 40px

  button[data-icon="x"]
    position absolute
    right 0
    size 24px
    top 8px

    &:before
      margin-right 0

  .extra
    display inline-block
    margin-left 8px
    line-height 24px
    padding 8px
    border-left 1px solid rgba(black, .05)

    span
      pointer-events none

  .body
    width 230px
    left auto

  .arrow
    display none

  .head
  .value
    border 0
    border-radius 0
    background transparent
    padding 0

  // &.value
  //   padding-right 32px

  .root
    size 100%
    display flex
    align-items center
    justify-content center

    .value
      font-size 0
      &:before
        content ''
        display inline-block
        vertical-align middle
        position relaive
        size 16px
        background-image embedurl('~static/icons/ui/sort-down.svg', 'utf8')
        background-repeat no-repeat
        background-size 16px
        background-position 50% 1px

  [role="group"]
    display flex
    flex-flow row nowrap
    position relative
    margin 0
    rSize = 50px

    [role="option"]
      flex 1 1 100%
      text-align right
      padding-right: rSize + 20px
      border 0

      &+[role="option"]
        position absolute
        right 0
        height 100%
        padding-right 0
        flex-basis: rSize
        width: rSize
        max-width: rSize
        border-left 1px solid rgba(black, .05)
        border-bottom 1px solid rgba(black, .05)
        text-align left
        background-color white

    .label
      position absolute
      margin 0
      text-transform capitalize
      pointer-events none

.vue-tel-input
  &+.vue-tel-input
    margin-top 4px

  &.disabled
    border-color transparent
    position relative
    display flex
    flex-flow row nowrap
    align-items center

    // &:before
    //   content attr(data-prefix)

    .vti
      &__dropdown
        opacity: 0
        width 0
        padding-left 0
        padding-right 0


</style>
