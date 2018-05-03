<template lang="pug">
.distribuire
  altselect(
    :options= "options"
  )
</template>

<script>
import altselect from 'form/altselect'

export default {
  computed: {
    options () {
      return [
        'cpi',
        'locatar',
        'bla',
        'blabla',
        'xx',
        'mm',
        'bb',
        'cucu'
      ]
    }
  },
  components: {
    altselect
  }
}
</script>

<style lang="stylus">
.distribuire
  width 100%
</style>
