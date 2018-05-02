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
        'locatar'
      ]
    }
  },
  components: {
    altselect
  }
}
</script>
