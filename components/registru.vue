<template lang="pug">
.registru
  h1 yoyo registru

  list(
    :taxonomy=  "['incasare', 'cheltuiala']"
    _plural=   "tranzactii"
    key=       "tranzactii"
    subscriber= "registru"
  )
</template>

<script>
import list from 'c/list'

export default {
  components: {
    list
  }
}
</script>
