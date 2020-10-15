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
  :class=       "{ error, value, zebra: type === 'scari' }"
  :tabIndex=    "type === 'checkbox' ? 0 : null"
)
  input(
    v-if=         "['$', 'taxonomy', 'radios', 'textarea', 'checkboxes', 'scari', 'userAvatar', 'select', 'altselect'].indexOf(type) < 0 && ['string', 'number'].indexOf(String(type).asRxDBType) > -1 && !isRel && name !== 'rol'",
    :type=        "type.asRxDBType === 'string' && ['searchbox', 'checkbox', 'search', 'email'].indexOf(type) < 0 ? 'text' : type",
    :placeholder= "placeholder",
    :autocomplete="autocomplete ? 'on' : 'off'",
    :autosuggest= "autosuggest"
    spellcheck=   "false"
    :id=          "id",
    :name=        "id"
    :focus=       "focus",
    :disabled=    "disabled"
    :required=    "required",
    :min=         "type === 'number' ? min : null"
    :max=         "type === 'number' ? max : null"
    :step=        "['bani', 'number'].indexOf(type) > -1 ? step : null"
    :value=       "type.asRxDBType === 'string' && typeof value === 'boolean' ? '' : value",
    :checked=     "checked"
    @input=       "handleInput",
    @change=      "handleChange"
    :aria-label=  "hideLabel ? label : undefined"

    @keydown.enter= "selecteaza"
    @keyup.tab=     "selecteaza"
    @keyup.down=    "indexSelectat(1)"
    @keyup.up=      "indexSelectat(0)"
    @keydown.esc=   "inchideModale"
    :class=         "{ av: !!value }"
    @clickAway=     "$emit('clickedAway')"
  )
  rel(
    v-else-if= "isRel"
    :id=      "value"
    :taxonomy ="id.replace('Id', '').plural"
  )
  bani(
    v-else-if=  "['suma', 'bani', 'balanta', '$'].indexOf(type) > -1"
    :valoare=   "value"
    :base=      "$Lodger.displayCurrency"
    @input=       "$emit('input', $event)"
    showBoth
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
    @input=       "$emit('input', $event)"
    :required=    "required",
    :id=          "id",
  )
  slect(
    v-else-if=    "type === 'select'"
    :options=     "options"
    :value=       "value",
    :required=    "required",
    @input=       "$emit('input', $event)"
    :id=          "id"
    :arrow=       "arrow"
    :disabled=    "disabled"
  )
  altslect(
    v-else-if=    "type === 'altselect' || name === 'rol'"
    :options=     "name === 'rol' ? $lodger.i18n.roluri : options"
    :value=       "value",
    :required=    "required",
    @input=       "$emit('input', $event)"
    :id=          "id"
    :arrow=       "arrow"
    :disabled=    "disabled"
  )
  avatar(
    v-else-if=    "['avatar', 'userAvatar'].indexOf(type) > -1"
    :id=          "id"
    :value=       "value"
    :seed=        "avatarSeed"
    :disabled=    "disabled"
  )

  scari(
    v-else-if=    "type === 'scari'",
    :value=       "value",
    @input=       "$emit('input', $event)"
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
  //- sel-apartamente(
  //-   v-else-if=      "type === 'selApartamente'"
  //-   :optiuni=       "options"
  //-   @input=         "$emit('input', $event)"
  //-   :value=         "value || []"
  //- )
  distribuire(
    v-else-if=      "type === 'distribuire'"
  )
  servicii(
    v-else-if=        "type === 'taxonomy' && id === 'servicii'"
    @input=           "$emit('input', $event)"
    :value=           "value"
    :servicii=        "$lodger.servicii.subscribers[$lodger.mainSubName].items"
    :disabled=        "disabled"
  )
  tax(
    v-else-if=  "type === 'taxonomy'"
    :populated= "value || []"
  )
    div(slot="item" slot-scope="{ item }") {{ item.name }}
    button.new(@click="") +

  multi(
    v-else-if= "type === 'contactFields'"
    :fields= "{ tip: { type: 'select', options: {tel: $lodger.i18n.taxonomies.utilizatori.fields.tel, email: '', social: ''} }, val: {} }"
  )

  div(v-else) {{ type }} UNSUPOORTED YET

  labl(
    v-show=         "!hideLabel && type !== 'button'"
    :required=      "required"
    :for=           "id"
  ) {{ label }}

  //- p.field__message(v-if="message") {{ message }}
  span.field__limit(
    v-if= "type === 'text' && textLengthLimit > 0 && val"
  ) {{ val.length }} / {{ textLengthLimit }}

  slot
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

import servicii from 'c/servicii'
import contoare from 'form/contoare'
import distribuire from 'form/distribuire'
import selApartamente from 'form/selApartamente'
import apartament from 'struct/apartament'
import tax from  'c/renderlessTax'
import rel from 'c/rel'
import bani from 'c/bani'
import avatar from 'c/avatar'

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
  computed: {
    isRel () {
      return this.id.indexOf('Id') === this.id.length - 2
    },
    val () {
      const { type, searchTaxonomy, selected, debug } = this
      let { value } = this

      // a weird reset
      if (['text', 'search'].indexOf(type) > -1 && typeof value === 'boolean') {
        value = ''
      }

      if (type === 'checkbox') {
        value = Boolean(value)
      }

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
      results: {
        apartamente: [],
        furnizori: [],
        utilizatori: []
      },
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
    distribuire,
    file,
    labl,
    multi,
    radios,
    rel,
    scari,
    servicii,
    selApartamente,
    slect,
    tax,
    txtarea,
    ValidationProvider
  },
  methods: {
    ...mapActions({
      sterge: 'asociatie/sterge'
    }),
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

        case 'text':
          value = transformOnInput(transform, value, filters, debug)
          break
      }

      this.$emit('input', value)
    },

    handleChange (e) {
      let { value, type, debug, valid } = this

      if (!valid) return

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
      this.$emit('clickAway')
    },

    inchideModale () {
      const { modalOpen, closeModal } = this
      if (modalOpen) closeModal()
    },

    indexSelectat (incDec) {
      const { type } = this
      if (type !== 'search') return

      const { taxes, indexRezultatSelectat, results } = this

      taxes.forEach(tax => {

      })
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
  border 1px solid rgba(black, .2)
  border-radius 2px
  background white

input
textarea
  padding 4px 12px

  &::placeholder
    color: config.typography.palette.meta
    font-size 12px
    font-weight 100
    opacity 0
    transition opacity .1s ease

  &:active
    color: palette.primary

  &:focus
    color: palette.primary
    box-shadow: inset 0 1px 1px rgba(0,0,0,.075), 0 0 8px rgba(102,175,233,.6);
    border-color: #66afe9

    &::placeholder
      opacity 1

  &.disabled
  &:disabled
    background-color transparent
    border-color transparent

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


[data-type="rel"]
  a
    text-decoration underline
    cursor pointer

    &+label
      color #1a1a1a

input[type="number"]
  width 80px

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

  &:not(:checked)
    &+label
      cursor pointer

  &+label
    height 24px
    cursor pointer
    position relative
    margin-bottom 0
    padding 4px // sa fie mai pushy
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
  padding 4px
  display flex
  flex-flow column-reverse nowrap

[data-type="search"]
  max-height 40px
  display flex
  flex-flow row nowrap

span[data-type="userAvatar"]
  margin 0 auto

  +above(l)
    margin 0 32px 32px 0

span[data-type="$"]
  margin-left auto

  *
    text-align right
    justify-content flex-end

  span
    white-space nowrap
    display flex
    flex-flow row nowrap
    align-items baseline

    &:first-child
      *
        color black
        font-weight bold

span[data-type="taxonomy"]
  flex-basis 50%

input[name="nr"]
  font-family: config.typography.fams.headings
  color: config.palette.tertiary
  letter-spacing 1.2px
  font-size 14px

.sort
  &.field
    margin-bottom auto

  > label
    display none

  > div[role="radiogroup"]
    width 100%

    > .radios
      justify-content space-around

  input[type="radio"]
    &:checked
      &+label
        &:after
          content ''
          size 20px
          background embedurl('~static/icons/ui/chevron-down.svg', 'utf8')
          background-size 11px
          position absolute
          display block
          right -9px
          top 50%
          transform translateY(-50%)
          background-repeat no-repeat
          background-position 50% 50%

        > span
          background-color: lighten(palette.tertiary, 90%)

    &+label[data-id="sort.la"]
      > span:before
        border 0
        background-image embedurl('~static/icons/ui/clock.svg', 'utf8')

    &+label[data-id="sort.az"]
      > span:before
        content 'AZ'
        border 0
        background none
        font-size 16px
        line-height 22px
        font-weight 500
        font-family: config.typography.fams.headings


  &.reverseActive
    input[type="radio"]
      &:checked
        &+label
          > span
            background-color: lighten(palette.secondary, 90%)

          &:after
            transform rotate(180deg)

.vue-tel-input
  &+.vue-tel-input
    margin-top 4px

  &.disabled
    border-color transparent
    position relative
    display flex
    flex-flow row nowrap
    align-items center

    &:before
      content attr(data-prefix)

    .vti
      &__dropdown
        opacity: 0
        width 0
        padding-left 0
        padding-right 0
</style>
