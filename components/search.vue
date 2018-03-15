<template lang="pug">
.search
  inpt(
    :placeholder= "$t('search')"
    :label=       "$t('search')"
    @input=       "search($event)"
    @keyDown=     "debug('down')"
    no-label
  )
  .search__results
    ul
      li.heading
        h5 Apartamente
      li(v-for="ap in results.apartamente") {{ ap.value }}
</template>

<script>
import inpt from 'form/input'
import fsearch from 'fuzzysearch'
import { mapGetters } from 'vuex'

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
      results: {
        apartamente: [],
        incasari: [],
        locatari: []
      }
    }
  },
  methods: {
    search (input) {
      this.results.apartamente = []
      if (!input) {
        return
      }
      const iterator = this.searchMap.entries()
      const results = []
      for (let [ key, value ] of iterator) {
        const relevance = string_similarity(input, value)
        results.push({
          id: key, relevance, value
        })
      }
      this.results.apartamente = results.sort((a, b) => a.relevance > b.relevance).reverse()
    }
  },
  computed: {
    ...mapGetters({
      apartamente: 'apartamente'
    }),

    searchMap () {
      const map = new Map()
      Object.values(this.aps).forEach(ap => {
        map.set(ap.id, `${ ap.nr } ${ ap.proprietar }`)
      })
      return map
    },

    aps () {
      return this.apartamente.map(ap => {
        return {
          id: ap._id,
          proprietar: ap.proprietar,
          nr: ap.nr
        }
      })
    }
  },
  components: {
    inpt
  }
}
</script>

<style lang="stylus">
@require '~styles/config'

.search
  position relative

  &__results
    position absolute
    top 100%
    right 0
    height 300px
    background white
    padding 20px
    min-width 320px
    box-shadow: config.shadows.boxes
    border-bottom-radius: config.radiuses.boxes

    ul
      list-style-type none
      padding 0
      
      li
        line-height 24px
</style>
