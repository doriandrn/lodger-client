<template lang="pug">
field.search(
  id=             "search",
  type=           "search",
  role=           "search",
  :label=         "label",
  :placeholder=   "$t('search')",
  data-icon=      "search",
  :data-results=  "!!results.apartamente.length",
  :value=         "value",
  :size=          "size",
  :autocomplete=  "false",
  v-on-clickaway= "clearResults",
  v-model=        "searchPhrase",
  @input=         "search($event)",
  @keyDown=       "selected++",
  @keyUp=         "selected--",
  @keyEnter=      "selecteaza",
  :hide-label=    "hideLabel"
)
  .results(data-droparrow)
    .results__section
      h5.results__heading(v-if="results.apartamente.length") Apartamente
      nuxt-link(
        v-for=    "ap, i in results.apartamente",
        :key=     "ap.id"
        :class=   "{ selected: i === selected, irelevant: ap.relevance < 0.25 }"
        :to=      "`/aparatament/${ap.id}`"
      ) {{ ap.value }}
</template>

<script>
import { get_bigrams, string_similarity } from 'helpers/search'
import { mapGetters } from 'vuex'
import { mixin as clickaway } from 'vue-clickaway'
// import field from 'form/field'

export default {
  name: 'search',
  data () {
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
  mixins: [ clickaway ],
  methods: {
    search (input) {
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
    },
    clearResults () {
      this.searchPhrase = null
      setTimeout(() => {
        this.results.apartamente = []
      }, 250)
    },
    selecteaza () {
      const { results, selected, debug } = this
      const { apartamente } = results
      debug(results)
      debug(apartamente)
      debug(selected)
      const { id } = apartamente[selected]
      this.$emit('selectat', { ce: 'apartament', id })
    }
  },
  computed: {
    ...mapGetters({
      apartamente: 'apartamente',
      blocData: 'bloc/data'
    }),

    searchMap () {
      const map = new Map()
      Object.values(this.aps).forEach(ap => {
        map.set(ap.id, `${ this.blocData(ap.bloc).nume } ${ ap.scara } ${ ap.nr } ${ ap.proprietar }`)
      })
      return map
    },

    aps () {
      return this.apartamente.map(ap => {
        return {
          id: ap._id,
          proprietar: ap.proprietar,
          nr: ap.nr,
          scara: ap.scara,
          bloc: ap.bloc
        }
      })
    }
  },
  props: {
    id: {
      type: String,
      default: 'search'
    },
    label: {
      type: String,
      default: null
    },
    value: {
      type: String,
      default: null
    },
    hideLabel: {
      type: Boolean,
      default: true
    },
    size: {
      type: String,
      default: null
    }
  },
  beforeCreate () {
    this.$options.components.field = require('form/field').default
  }
  // components: {
  //   field
  // }
}
</script>

<style lang="stylus">
@require '~styles/config'

spacings = 16px

.search
  position relative
  padding-left 0

  &:before
    position absolute
    top 50%
    transform translateY(-54%)
    left 12px
    background-color: config.typography.palette.meta

  &[data-results]
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
