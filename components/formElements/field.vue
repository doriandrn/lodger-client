<template lang="pug">
.field(
  :data-size=  "size"
  :data-type=   "type"
  :data-icon=   "type === 'search' ? 'search' : null"
  :data-results="type === 'search' && searchTaxonomy && results[searchTaxonomy] ? true : null"
  :data-selected="type === 'search' && selected.id"
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
    :selected=          "type === 'search' ? selectedResult : null"
    @keyEnter=          "selecteaza"
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
  )
  scari(
    v-else-if=    "type === 'array' && typeof scariCount !== 'undefined'",
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

  p.field__message(v-if="message") {{ message }}

  slot

  .results(v-if="type === 'search' && !selectedResult.id")
    .results__section(v-for="tax in Object.keys(results)")
      h5.results__heading {{ tax }}
      nuxt-link(
        v-for=    "res, i in results[tax]",
        :key=     "res.id"
        :class=   "{ selected: i === selected, irelevant: res.relevance < 0.25 }"
        :to=      "`/${tax}/${res.id}`"
      ) {{ res.value }}
</template>

<script>
import inpt from 'form/input'
import labl from 'form/label'
import slect from 'form/select'
import txtarea from 'form/textarea'
import cbox from 'form/checkbox'
import file from 'form/file'
import radios from 'form/radioGroup'
import scari from 'form/scari'

export default {
  data () {
    // CUSTOM  only for search
    if (this.type !== 'search') return {}
    return {
      results: {},
      selected: 0,
      selectedResult: {
        ce: '',
        id: '',
        proprietar: ''
      }
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
    }
  },
  components: {
    inpt,
    slect,
    labl,
    txtarea,
    cbox,
    file,
    radios,
    scari
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
spacings = 16px

.field
  &[data-size="small"]
    input
      padding 4px
      border-radius 24px

  &[data-icon]
    input
      padding-left 32px !important

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
  
  
.results
  position absolute
  top calc(100% + 25px)
  right 0
  background white
  line-height 20px
  max-height 50vh
  min-width 320px
  box-shadow: config.shadows.boxes
  border-bottom-radius: config.radiuses.boxes
  display flex
  flex-flow column nowrap
  opacity 0
  visibility hidden
  transition all .15s ease-in-out

  &__section
    display flex
    flex-flow row wrap
    overflow-y auto

    > a
      flex 1 0 100%
      padding: (spacings/2) spacings
      text-transform capitalize
      text-decoration none

      for i in 1 2 3 4 5
        &:nth-child({i}):not(.irelevant)
          color: lighten(config.typography.palette.headings, i*10%)

      &.irelevant
        color: config.typography.palette.meta

      &.selected
      :active
      :focus
        background-color: rgba(config.palette.tertiary, .05)

      &:hover
        color: config.typography.palette.headings
        background-color: rgba(config.palette.primary, .05)
      

  &__heading
    padding: 0 spacings
    flex 1 0 100%
    margin 4px 0
</style>
