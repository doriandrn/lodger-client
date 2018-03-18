<template lang="pug">
.field(
  :data-size=  "size"
  :data-type=   "type"
  :data-icon=   "type === 'search' ? 'search' : null"
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
    :data-results="type === 'search' && !!results.apartamente.length",
    :id=          "id",
    :focus=       "focus",
    :required=    "required",
    :min=         "min",
    :max=         "max",
    :step=        "type !== 'bani' ? step : .01",
    :value=       "value",
    @input=       "handleInput",
    @change=      "$emit('change', $event)"
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

  .results(v-if="type === 'search' && results.apartamente.length")
    .results__section
      h5.results__heading Apartamente
      nuxt-link(
        v-for=    "ap, i in results.apartamente",
        :key=     "ap.id"
        :class=   "{ selected: i === selected, irelevant: ap.relevance < 0.25 }"
        :to=      "`/aparatament/${ap.id}`"
      ) {{ ap.value }}
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
import search from '~components/search'

import { get_bigrams, string_similarity } from 'helpers/search'
import { mapGetters } from 'vuex'

export default {
  data () {
    // CUSTOM  only for search
    if (this.type !== 'search') return {}

    // define methods, just for this element
    this.search = input => {
      this.debug('CAUT: ', input)
      this.results.apartamente = []
      if (!input) {
        return
      }
      const iterator = this.searchMap.entries()
      const results = []
      for (let [ key, value ] of iterator) {
        const relevance = string_similarity(String(input), value)
        results.push({
          id: key, relevance, value
        })
      }
      this.results.apartamente = results.sort((a, b) => a.relevance > b.relevance).reverse().slice(0, 6)
    }

    this.clearResults = () => {
      this.searchPhrase = null
      setTimeout(() => {
        this.results.apartamente = []
      }, 250)
    }

    this.selecteaza = () => {
      const { results, selected, debug } = this
      const { apartamente } = results
      debug(results)
      debug(apartamente)
      debug(selected)
      const { id } = apartamente[selected]
      this.$emit('selectat', { ce: 'apartament', id })
    }

    this.$options.computed.searchMap = () => {
      const map = new Map()
      Object.values(this.$store.getters['apartamente']).forEach(ap => {
        map.set(ap._id, `${ this.$store.getters['bloc/data'](ap.bloc).nume } ${ ap.scara } ${ ap.nr } ${ ap.proprietar }`)
      })
      return map
    }

    return {
      searchPhrase: null,
      selected: 0,
      results: {
        apartamente: [],
        incasari: [],
        locatari: []
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
    scari,
    search
  },
  methods: {
    handleInput (e) {
      const { type, $emit } = this
      if (type !== 'search') return $emit('input', type === 'number' ? Number(e) : e)
      this.debug('GHGHGHGHGHHGGHGH')
      this.search(e)
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
