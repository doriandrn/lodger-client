<template lang="pug">
//- :data-selected="type === 'search' && selected.id"
.field(
  :data-size=  "size"
  :data-type=   "type"
  :data-icon=   "type === 'search' ? 'search' : icon"
  :data-results="type === 'search' && searchTaxonomy && results[searchTaxonomy] ? true : null"
)
  labl.field__label(
    v-if=         "!hideLabel"
    :required=    "required"
    :for=         "id"
  ) {{ label }}

  inpt(
    v-if=         "['text', 'number', 'search', 'bani'].indexOf(type) > -1",
    :type=        "type !== 'bani' ? type : 'number'",
    :placeholder= "placeholder",
    :autocomplete="autocomplete",
    :id=          "id",
    :focus=       "focus",
    :required=    "required",
    :min=         "min",
    :max=         "max",
    :step=        "type !== 'bani' ? step : .01",
    :value=       "value",
    @input=       "$emit('input', $event)",
    @change=      "$emit('change', $event)"
    
    :searchTaxonomy=    "searchTaxonomy"
    @newResults=        "results = $event"
    @selected=          "selected = $event"
    :selected=          "selectedResult"
    @keyEnter=          "selecteaza"
    @keyDown=           "type === 'search' ? indexRezultatSelectat++ : null"
    @keyUp=             "type === 'search' ? indexRezultatSelectat-- : null"
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
  )
  servicii(
    v-else-if=        "type === 'servicii'"
    @input=           "$emit('input', $event)"
    :value=           "value"
    :servicii=        "servicii"
  )
    //- :alese=           "$emit('input')"
  p.field__message(v-if="message") {{ message }}

  slot

  //- && !selectedResult._id
  results(
    v-if=             "type === 'search' && results.apartamente && results.apartamente.length",
    :results=         "results",
    :selectedIndex=   "indexRezultatSelectat"
  )
    
</template>

<script>
import inpt from 'form/input'
import labl from 'form/label'
import slect from 'form/select'
import altslect from 'form/altselect'
import txtarea from 'form/textarea'
import cbox from 'form/checkbox'
import file from 'form/file'
import radios from 'form/radioGroup'
import scari from 'form/scari'
import servicii from '~components/servicii'
import results from '~components/searchResults'

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
    }
  },
  components: {
    inpt,
    slect,
    altslect,
    labl,
    txtarea,
    cbox,
    file,
    radios,
    scari,
    servicii,
    results
  },
  methods: {
    selecteaza (e) {
      const { results, selected, debug, type } = this
      debug('SELECTEZ')
      if (type !== 'search') return
      e.preventDefault()
      const { apartamente } = results
      const { id, value } = apartamente[selected]

      const ap = value.split(' ')
      const bloc = ap[0]
      const sc = ap[1]
      const apnr = ap[2]
      const proprietar = String(ap.slice(3, ap.length).join(' '))

      // let proprietar = ''
      // for (let i=3; i < ap.length; i++) {
      //   proprietar += ap[i] + (i === ap.length - 1 ? '' : ' ')
      // }

      this.selectedResult = { ce: 'apartament', id, proprietar }
      this.$emit('input', id)
      this.clearResults()
    },
    clearResults () {
      Object.keys(this.results).forEach(result => this.results[result] = [])
    }
  }
}
</script>

<style lang="stylus">
@require '~styles/config'

.field
  &[data-size="small"]
    input
      padding 4px
      border-radius 24px

  &[data-icon]
    input
      padding-left 32px !important

  &[data-type="scari"]
    > label
      font-weight 700
      margin-bottom 16px
      flex 1 0 100%

  &[data-type="search"]
    position relative
    padding-left 0

    &:before
      position absolute
      bottom 11px
      left 12px
      background-color: config.typography.palette.meta

    .results
      top 100%
      opacity 1
      visibility visible

    &[data-size="small"]
      input
        max-width 130px
        padding-right 16px
        transition all .15s ease-in-out

        &:focus
          max-width 155px

  &[data-type="bani"]
    flex-basis 120px
</style>
