<template lang="pug">
span.adresa
  span.adresa__main(v-if="bloc") {{ bloc }} / {{ scara }}
  span.adresa__sec(v-if="nrAp") {{ etaj }} {{ nrAp }}
</template>

<script>
export default {
  props: {
    bloc: {
      type: String,
      default: null
    },
    scara: {
      type: String,
      default: null
    },
    etaj: {
      type: Number,
      default: 0
    },
    nrAp: {
      type: String,
      default: null
    }
  }
}
</script>

<style lang="styl">
.adresa
  &__main
    font-weight bold
    text-transform uppercase
    margin-right 8px
</style>
