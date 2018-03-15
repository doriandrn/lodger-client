<template lang="pug">
.search(
  data-icon=      "search",
  :data-results=  "!!results.apartamente.length"
)
  labl(
    :for=       "id",
    :label=     "label",
    :required=  "required"
    v-if=       "!noLabel"
  )
  inpt(
    :id=          "id"
    :placeholder= "$t('search')"
    :label=       "$t('search')"
    @input=       "search($event)"
    @keyDown=     "selected++",
    @keyUp=       "selected--"
    v-on-clickaway= "clearResults",
    v-model=      "searchPhrase"
    no-label
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
import inpt from 'form/input'
import labl from 'form/label'
import fsearch from 'fuzzysearch'
import { mapGetters } from 'vuex'
import { mixin as clickaway } from 'vue-clickaway'

const get_bigrams = function (string) {
  var i, j, ref, s, v;
  s = string.toLowerCase();
  v = new Array(s.length - 1);
  for (i = j = 0, ref = v.length; j <= ref; i = j += 1) {
    v[i] = s.slice(i, i + 2);
  }
  return v;
};

const string_similarity = function (str1, str2) {
  var hit_count, j, k, len, len1, pairs1, pairs2, union, x, y;
  if (str1.length > 0 && str2.length > 0) {
    pairs1 = get_bigrams(str1);
    pairs2 = get_bigrams(str2);
    union = pairs1.length + pairs2.length;
    hit_count = 0;
    for (j = 0, len = pairs1.length; j < len; j++) {
      x = pairs1[j];
      for (k = 0, len1 = pairs2.length; k < len1; k++) {
        y = pairs2[k];
        if (x === y) {
          hit_count++;
        }
      }
    }
    if (hit_count > 0) {
      return (2.0 * hit_count) / union;
    }
  }
  return 0.0;
};

export default {
  data () {
    return {
      searchPhrase: '',
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
      this.results.apartamente = results.sort((a, b) => a.relevance > b.relevance).reverse().slice(0, 9)
    },
    clearResults () {
      this.searchPhrase = null
      this.results.apartamente = []
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
  components: {
    inpt,
    labl
  },
  props: ['id', 'required', 'label', 'noLabel']
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

  > span > input
    padding-left 32px

  &[data-results]
    .results
      top 100%
      opacity 1
      visibility visible

.results
  position absolute
  top calc(100% + 25px)
  right 0
  height 300px
  background white
  line-height 20px
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
