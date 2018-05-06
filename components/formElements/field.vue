<template lang="pug">
.field(
  :data-size=   "size"
  :data-type=   "type"
  :data-icon=   "type === 'search' ? 'search' : icon"
  :data-results="hasResults",
  :class=       "{ 'field--error': error, 'field--val': value, zebra: type === 'scari' }"
)
  input(
    v-if=         "['text', 'number', 'search', 'bani', 'checkbox', 'date'].indexOf(type) > -1",
    :type=        "type !== 'bani' ? type : 'number'",
    :placeholder= "placeholder",
    :autocomplete="autocomplete",
    :id=          "id",
    :focus=       "focus",
    :required=    "required",
    :min=         "type === 'number' ? min : null"
    :max=         "type === 'number' ? max : null"
    :step=        "type === 'number' ? step : null"
    :value=       "val",
    :checked=     "checked"
    @input=       "handleInput",
    @change=      "$emit('change', $event)"

    @keydown.enter= "selecteaza"
    @keyup.tab=   "selecteaza"
    @keyup.down=  "indexSelectat(1)"
    @keyup.up=    "indexSelectat(0)"
    @keydown.esc=   "inchideModale"
    :class=       "{ av: !!value }"
    @clickAway=   "clearResults"
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
    @input=         "$emit('input', $event)"
    :value=         "value || []"
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
    v-if=             "hasResults",
    :results=         "results",
    :selectedIndex=   "indexRezultatSelectat"
    @selecteaza=      "selecteaza"
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

import { get_bigrams, string_similarity } from 'helpers/search'
import { mixin as clickaway } from 'vue-clickaway'
import { mapActions, mapGetters } from 'vuex'

export default {
  mixins: [ clickaway ],
  computed: {
    ...mapGetters([
      'apartamente',
      'furnizori'
    ]),
    val () {
      const { type, searchTaxonomy, selected, debug } = this
      let { value } = this

      // a weird reset
      if (['text', 'search'].indexOf(type) > -1 && typeof value === 'boolean') {
        value = ''
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

    hasResults () {
      const { type } = this
      if (type !== 'search') return

      const { results, resultsTaxes, searchTaxonomy, debug, taxes } = this
      let has = null

      if (!results) return has

      taxes.forEach(tax => {
        if (has) return
        has = false
        if (tax && results[tax]) {
          if (results[tax].length > 0) has = true
          return
        }
      })

      return has
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
    name: {
      type: String,
      default () {
        return this.id
      }
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

    clearResults () {
      const { type } = this
      if (type !== 'search') return

      const { results } = this
      Object.keys(results).forEach(result => results[result] = [])
    },

    /**
     * Cauta in searchMap
     * @param input - string de cautat
     */
    search (input) {
      if (!input) return
      let { searchTaxonomy } = this
      const searchMap = this.$store.getters['searchMap']
      const results = {}

      Object.keys(searchMap).forEach(tax => {
        if (searchTaxonomy && searchTaxonomy !== tax) return
        const iterator = searchMap[tax].entries()
        results[tax] = []

        for (let [ key, value ] of iterator) {
          const relevance = string_similarity(String(input), value)
          results[tax]
            .push({ id: key, relevance, value })
        }

        results[tax] = results[tax]
          .sort((a, b) => a.relevance > b.relevance)
          .reverse()
          .slice(0, 6)
      })
      
      return results
    },

    handleInput (e) {
      let { value, type } = e.target
      const { search, debug } = this

      switch (type) {
        case 'search':
          this.results = search(value)
          break

        case 'number':
          value = Number(value)
          break
      }

      this.$emit('input', value)
    },

    clickAway () {
      const { type, hasResults } = this
      if (type !== 'search') return
      if (!hasResults) return

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

input[type="text"]
input[type="search"]
input[type="number"]
input[type="password"]
input[type="date"]
textarea
  font-size 14px
  line-height 18px
  background-color transparent
  border 0
  min-width 32px
  border-bottom: 1px solid #c8c8c8
  // border-radius: config.radiuses.buttons
  // box-shadow inset 1px 2px 3px -1px rgba(black, .015) 
  transition all .15s ease-in-out
  // background: palette.bgs.body
  padding 8px 4px
  width 100%

  &::placeholder
    color: config.typography.palette.meta
    font-size 12px
    font-weight 100
    opacity 0
    transition opacity .1s ease
  
  &:focus
    border-color: palette.primary
    color: palette.primary

    &::placeholder
      opacity 1

    &+.field__label
      moveFieldLabel()

input:not([type="submit"])
  max-height 36px

.input
  &__optional
    margin-left 4px
    color: config.typography.palette.meta
    font-weight 100

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
    height auto

    > label
      font-weight 600
      margin-bottom 16px
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
      z-index 51
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
