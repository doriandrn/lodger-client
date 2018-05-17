<template lang="pug">
.field(
  :data-size=   "size"
  :data-type=   "type"
  :data-icon=   "type === 'search' ? 'search' : icon"
  :data-results="hasResults",
  :class=       "{ 'field--error': error, 'field--val': value, zebra: type === 'scari' }"
  :tabIndex=    "type === 'checkbox' ? 0 : null"
)
  input(
    v-if=         "['text', 'number', 'search', 'bani', 'checkbox', 'date'].indexOf(type) > -1",
    :type=        "type !== 'bani' ? type : 'number'",
    :placeholder= "placeholder",
    :autocomplete="autocomplete ? 'on' : 'off'",
    :autosuggest= "autosuggest"
    :id=          "id",
    :name=        "id"
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
    @keyup.tab=     "selecteaza"
    @keyup.down=    "indexSelectat(1)"
    @keyup.up=      "indexSelectat(0)"
    @keydown.esc=   "inchideModale"
    :class=         "{ av: !!value }"
    @clickAway=     "clearResults"
  )
  buton(
    v-else-if=    "type === 'button'"
    :dangerous=   "dangerous"
    @click=       "handleClick"
  ) {{ $t(label) || $(text) || '~' }}
  textarea(
    v-else-if=    "['textarea'].indexOf(type) > -1"
    :placeholder= "placeholder",
    :value=       "value",
    @input=       "$emit('input', $event)"
    :required=    "required",
    :id=          "id",
  )
  select(
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
    v-else-if=    "type === 'scari'",
    :value=       "value",
    @input=       "$emit('input', $event)"
  )

  radios(
    v-else-if=    "type === 'radios'",
    :id=          "id",
    :value=       "value",
    @change=      "$emit('input', $event)"
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
    v-show=         "!hideLabel && type !== 'button'"
    :required=      "required"
    :for=           "id"
  ) {{ $t( label ) }}

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
import servicii from '~components/servicii'
import results from '~components/searchResults'
import contoare from 'form/contoare'
import distribuire from 'form/distribuire'
import selApartamente from 'form/selApartamente'
import apartament from 'struct/apartament'

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
    altslect,
    apartament,
    buton,
    checkboxes,
    contoare,
    distribuire,
    file,
    labl,
    radios,
    results,
    scari,
    servicii,
    selApartamente,
    txtarea
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

    handleClick (e) {
      const { click, debug } = this
      debug('click', click)
      let what
      if (click.indexOf('/')) {
        what = click.split('/')[0]
      }
      if (what) {
        const { _id } = this.$store.getters[`${what}/activa`]
        this.$store.dispatch(click, { _id })
      } else {
        const f = this[click]
        if (!f) return
        f(this)
      }
    },

    handleInput (e) {
      let { value, type } = e.target
      const { search, transform, debug } = this

      switch (type) {
        case 'search':
          this.results = search(value)
          break

        case 'checkbox':
          value = Boolean(value)
          value = !value
          break

        case 'number':
          value = Number(value)
          break

        case 'text':
          if (transform) {
            debug(this, transform)
            const filter = this.$options.filters[transform]
            if (filter && typeof filter === 'function')
              value = filter(value)
          }
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
typeColors = config.typography.palette

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
  transition all .15s ease-in-out
  padding 8px 2px
  width 100%

  &::placeholder
    color: config.typography.palette.meta
    font-size 12px
    font-weight 100
    opacity 0
    transition opacity .1s ease
  
  &:active
  &:focus
    border-color: palette.primary
    color: palette.primary

    &::placeholder
      opacity 1

    &+.field__label
      moveFieldLabel()

input[type="radio"]
  &+label
    font-size 0
    height 24px
    cursor pointer

    > span
      size 12px
      display block
      border-radius 50%
      border: 1px solid config.typography.palette.meta

  &:hover
  &:focus
  &:active
    &+label
      > span
        border-color: palette.primary

  &:checked
    &+label
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
    cursor pointer

input[type="checkbox"]
  appearance none
  position absolute
  opacity 0

  &+label
    height 24px
    cursor pointer
    position relative
    margin-bottom 0
    padding 4px // sa fie mai pushy
    cursor pointer
    color: typeColors.meta

    &:before
      icon('x')
      background-color: typeColors.meta
      position relative
      margin-right 4px
      top 1px

    > span
      size 12px
      display block
      border-radius 50%
      border: 1px solid config.typography.palette.meta

  &:checked
    &+label
      color: typeColors.headings
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

.input__cbox
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

.input__radio
  display flex
  flex-flow column nowrap
  margin 4px 4px 8px
  height 12px

  > input[type="radio"]
    display none

input:not([type="submit"])
  max-height 36px

.input
  &__optional
    margin-left 4px
    color: config.typography.palette.meta
    font-weight 100

.field
  display flex
  position relative
  align-items center // pt radios

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
    flex-basis 100%
    height auto

    .field
      margin-bottom 0
      margin-top 0

    > label
      font-weight 600
      margin-bottom 16px
      flex 1 1 38px
      align-self flex-start

  &[data-type="servicii"]
  &[data-type="detaliiApSelectat"]
    flex 1 1 100%

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

  &[data-type="radios"]
    flex-direction row-reverse

  &:not([data-type="text"])
    &:not([data-type="textarea"])
      &:not([data-type="altselect"])
        &:not([data-type="scari"])
          &:not([data-type="radios"])
            // flex-direction row-reverse
            height auto
            flex-flow column-reverse nowrap
            align-items flex-start
            justify-content flex-end
            margin-top 0

  &--error
    .field
      &__message
        color: config.palette.error

    input
      border-color: config.palette.error !important
</style>
