<template lang="pug">
#pg
  h2 aici ma joc io
  button(@click="adauga('asociatie', { name: 'gigi' })") yoyo

  h3 asocs
  p last: {{ $lodger.getters['asociatie/last'] }}
  ul(v-if="asociatii && asociatii.length")
    li(v-for="asoc in asociatii") {{ asoc.name }}
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  data () {
    return {
      asociatii: []
    }
  },
  layout: 'tspg',
  // computed: {
  //   asociatii () {
  //     return this.$lodger.asociatii
      
  //   }
  // },
  mounted () {
    // this.$lodger.asociatii(this.asociatii)
    // this.asociatii = this.$lodger.$get('asociatii')
    this.$lodger.subscribe(this.asociatii, 'asociatii')
  },
  // mounted () {
  //   this.$lodger.db.asociatii.find().$.subscribe()
  // },
  methods: {
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
