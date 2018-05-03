<template lang="pug">
//- :data-selected="type === 'search' && selected.id"
.field(
  :data-size=   "size"
  :data-type=   "type"
  :data-icon=   "type === 'search' ? 'search' : icon"
  :data-results="type === 'search' && searchTaxonomy && results[searchTaxonomy] ? true : null",
  :class=       "{ 'field--error': error, 'field--val': value, zebra: type === 'scari' }"
)
  inpt(
    v-if=         "['text', 'number', 'search', 'bani', 'checkbox', 'date'].indexOf(type) > -1",
    :type=        "type !== 'bani' ? type : 'number'",
    :placeholder= "placeholder",
    :autocomplete="autocomplete",
    :id=          "id",
    :focus=       "focus",
    :required=    "required",
    :min=         "min",
    :max=         "max",
    :step=        "type !== 'bani' ? step : .01",
    :value=       "type === 'checkbox' ? Boolean(value) : value",
    @input=       "$emit('input', $event)",
    @change=      "$emit('change', $event)"
    
    :searchTaxonomy=    "searchTaxonomy"
    @newResults=        "results = $event"
    @selected=          "selected = $event"
    :selected=          "selectedResult"
    @keyEnter=          "selecteaza"
    @keyDown=           "type === 'search' ? (indexRezultatSelectat < results[searchTaxonomy].length - 1 ? indexRezultatSelectat++ : indexRezultatSelectat = 0) : null"
    @keyUp=             "type === 'search' ? (indexRezultatSelectat > 0 ? indexRezultatSelectat-- : indexRezultatSelectat = results[searchTaxonomy].length - 1) : null"
    :class=             "{ av: !!value }"
    @clickAway=         "clearResults"
  )
  txtarea(
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
  )
  altslect(
    v-else-if=    "type === 'altselect'"
    :options=     "options"
    :value=       "value",
    :required=    "required",
    @input=       "$emit('input', $event)"
    :id=          "id"
    :arrow=       "arrow"
  )
    li(v-if="id === 'asociatieSwitch'") {{ $t('asociatie.new.title') }}
  scari(
    v-else-if=    "type === 'scari' && typeof scariCount !== 'undefined'",
    :scariCount=  "scariCount" 
    :value=       "value",
    @input=       "$emit('input', $event)"
  )
  radios(
    v-else-if=    "type === 'radios'",
    :id=          "id",
    :value=       "value",
    @change=      "$emit('input', $event)"
    :options=     "options"
    :disabled=    "disabled"
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
  sel-apartamente(
    v-else-if=      "type === 'selApartamente'"
    :optiuni=       "options"
  )
  distribuire(
    v-else-if=      "type === 'distribuire'"
  )
  servicii(
    v-else-if=        "type === 'servicii'"
    @input=           "$emit('input', $event)"
    :value=           "value"
    :servicii=        "servicii"
  )
  p(v-else-if=        "type === 'contactFields'") contactFields
  
  labl.field__label(
    v-show=         "!hideLabel && type !== 'scari' && scariCount < 2"
    :required=      "required"
    :for=           "id"
  ) {{ label }}

  p.field__message(v-if="message") {{ message }}

  slot

  //- && !selectedResult._id
  results(
    v-if=             "type === 'search' && results.apartamente && results.apartamente.length",
    :results=         "results",
    :selectedIndex=   "indexRezultatSelectat"
    :class=           "{ singleTax: searchTaxonomy }"
  )
  span(v-if=           "type === 'search' && searchTaxonomy === 'apartamente' && indexRezultatSelectat > -1") Ultima incasare:
</template>

<script>
import inpt from 'form/input'
import labl from 'form/label'
import slect from 'form/select'
import altslect from 'form/altselect'
import txtarea from 'form/textarea'
import checkboxes from 'form/checkboxes'
import file from 'form/file'
import radios from 'form/radioGroup'
import scari from 'form/scari'
import servicii from '~components/servicii'
import results from '~components/searchResults'
import contoare from 'form/contoare'
import distribuire from 'form/distribuire'
import selApartamente from 'form/selApartamente'

import { mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters({
      apartamente: 'apartamente'
    }),
    selectedResult () {
      if (this.type !== 'search' || !this.value) return

      // return this[searchTaxonomy][this.value] || {}
      return this.apartamente[this.value] || { _id: null }
    }
  },
  data () {
    // CUSTOM  only for search
    if (this.type !== 'search') return {}
    return {
      results: {},
      indexRezultatSelectat: 0
      // selected: 0,
      // selectedResult: {
      //   ce: '',
      //   id: '',
      //   proprietar: ''
      // }
    }
  },
  name: 'field',
  props: {
    type: {
      type: String,
      default: 'text'
    },
    id: {
      type: String,
      default: 'NOID!'
    },
    label: {
      type: String,
      default: 'Field Label'
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
    scariCount: {
      type: Number,
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
    searchTaxonomy: {
      type: String,
      default: null
    },

    disabled: {
      type: [Boolean, Array, Object],
      default: null
    },

    servicii: {
      type: [Object, Array],
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
    }
  },
  components: {
    inpt,
    slect,
    altslect,
    distribuire,
    labl,
    txtarea,
    checkboxes,
    contoare,
    file,
    radios,
    scari,
    servicii,
    selApartamente,
    results
  },
  methods: {
    selecteaza (e) {
      const { results, indexRezultatSelectat, debug, type } = this
      if (type !== 'search') return
      e.preventDefault()
      debug('SELECTEZ', results, indexRezultatSelectat)
      const { apartamente } = results
      const { id, value } = apartamente[indexRezultatSelectat]

      const ap = value.split(' ')
      const bloc = ap[0]
      const sc = ap[1]
      const apnr = ap[2]
      const proprietar = String(ap.slice(3, ap.length).join(' '))

      // let proprietar = ''
      // for (let i=3; i < ap.length; i++) {
      //   proprietar += ap[i] + (i === ap.length - 1 ? '' : ' ')
      // }

      // this.selectedResult = { ce: 'apartament', id, proprietar }
      this.$emit('input', id)
      this.clearResults()
    },
    clearResults () {
      if (this.type !== 'search') return
      Object.keys(this.results).forEach(result => this.results[result] = [])
    }
  }
}
</script>

<style lang="stylus">
@require '~styles/config'

.field
  position relative

  &[data-size="small"]
    input
      padding 4px
      border-radius 24px

  &[data-icon]
    > input
      padding-left 20px 

  &[data-type="scari"]
    flex-direction column-reverse 
    flex-wrap nowrap
    > label
      font-weight 600
      margin-bottom 16px
      // flex 1 0 100%
      flex 1 1 38px
      align-self flex-start

  &[data-type="servicii"]
    flex 1 1 100%

  &[data-type="search"]
    position relative
    padding-left 0
    max-width 100%
    flex-flow row wrap !important

    &:before
      position absolute
      top 11px
      left 0
      background-color: config.typography.palette.meta

    > label.field__label
        left 22px

    &[data-results]
      .field__label
        moveFieldLabel()

    .results
      top 36px
      left -12px
      right auto
      opacity 1
      visibility visible
      z-index 11
      max-width 350px

      &.singleTax
        .results
          &__heading
            display none

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

  &__message
    margin-bottom 0
    position absolute
    top 35px
    z-index 2
    font-size 12px
    background white
    padding 0 4px

  &__label
    user-select none
    flex 1 1 24px

  &[data-type="text"]
  &[data-type="textarea"]
  &[data-type="number"]
  &[data-type="search"]
  &[data-type="bani"]
    .field
      &__label
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
        
  &:not([data-type="text"])
    &:not([data-type="textarea"])
      &:not([data-type="altselect"])
        &:not([data-type="scari"])
          // flex-direction row-reverse
          flex-flow column-reverse nowrap
          align-items flex-start
          justify-content flex-start
          margin-top 0

  &--error
    .field
      &__message
        color: config.palette.error

    input
      border-color: config.palette.error !important
</style>
