<template lang="pug">
.registru
  h1 yoyo registru
  
  list(
    taxonomy="tranzactie"
  )
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'

import list from 'c/list'

@Component({
  components: {
    list
  }
})
export default class Registru extends Vue {
  
}
</script>
