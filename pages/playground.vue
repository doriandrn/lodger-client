<template lang="pug">
sction#pg
  h2 aici ma joc io
  button(@click="adauga('asociatie', { name: 'gigi' })") add ass

  h3 {{ idsAsociatii.length }}/{{ asociatiiCount }} asocs
  p last: {{ $lodger.getters['asociatie/last'] }}
  ul(v-if="asociatii")
    li(v-for="asoc, i in asociatii") {{ i }} {{ asoc.name }}
  button.more(@click="criteriu.limit = criteriu.limit + criteriu.limit; sub()") MOR
</template>

<script lang="ts">
import Vue from 'vue'
import sction from '~components/section'

export default Vue.extend({
  data () {
    return {
      asociatii: {},
      criteriu: {
        limit: 5
      },
      asociatiiCount: -1
    }
  },
  computed: {
    idsAsociatii () {
      return Object.keys(this.asociatii)
    }
  },
  components: {
    sction,
  },
  layout: 'tspg',
  // computed: {
  //   asociatii () {
  //     return this.$lodger.asociatii
      
  //   }
  // },
  mounted () {
    this.sub()
    this.debug(this.$lodger)
    // this.asociatiiCount = this.$lodger.db.asociatii.count().$.subscribe()
  },
  // mounted () {
  //   this.$lodger.db.asociatii.find().$.subscribe()
  // },
  methods: {
    sub () {
      this.$lodger.subscribe(this.asociatii, 'asociatii', this.criteriu)
    },
    async adauga () {
      this.debug('add clicked', this)
      return await this.$lodger.put(...arguments)
    }
  }
})
</script>

<style lang="stylus">
#webpack-hot-middleware-clientOverlay
  display none
</style>
