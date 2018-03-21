<template lang="pug">
span.adresa
  nuxt-link.adresa__main(
    v-if= "bloc",
    :to=  "`/bloc/${bloc._id}`"
  ) {{ bloc.nume }} / {{ scara }}
  span.adresa__sec(v-if="nrAp") Ap. {{ nrAp }} ({{ etaj }})
</template>

<script>
export default {
  props: {
    bloc: {
      type: Object,
      default () {
        return {
          '_id': -1,
          nume: 'Nedefinit'
        }
      }
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
