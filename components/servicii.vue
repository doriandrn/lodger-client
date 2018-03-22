<template lang="pug">
ul.servicii
  li(
    v-for=      "serviciu in servicii"
    :data-icon= "serviciu.denumire"
    :data-sel=  "alese.indexOf(serviciu.denumire) > -1"
    @click=     "$emit('toggleServiciu', serviciu.denumire)"
  ) 
    span.nume {{ serviciu.denumire }}
    buton(
      dangerous,
      v-if=     "serviciiPredefinite.indexOf(serviciu.denumire) < 0"
      @click=   "$emit('stergeServiciu', serviciu.denumire)"
      styl=     "unstyled"
      icon=     "trash"
      :prompt=  "{ type: 'warning', message: $t('serviciu.deletePrompt') }"
    ) sterge
  li
    buton(@click= "$emit('servciuNou')") {{ $t('serviciu.adauga') }}
</template>

<script>
import { mapGetters } from 'vuex'
import buton from 'form/button'

export default {
  components: { buton },
  computed: mapGetters({
    serviciiPredefinite: 'serviciu/predefinite'
  }),
  props: {
    servicii: {
      type: [Object, Array],
      default () {
        return {}
      }
    },
    alese: {
      type: Array,
      default () {
        return []
      }
    }
  }
}
</script>

<style lang="stylus">
@require '~styles/config'

.servicii
  list-style-type none
  padding 0
  display flex
  flex-flow row wrap

  > li
    display flex
    flex-flow column nowrap
    padding 10px
    border: 1px solid config.palette.borders
    justify-content center
    text-align center
    align-items center
    flex 0 0 120px
    height 120px
    border-radius 60px
    margin 8px
    transition all .15s ease-in-out
    cursor pointer
    font-size 12px
    line-height 16px

    &[data-sel]
      border-color: config.palette.tertiary

    &[data-icon="electricitate"]
      &:before
        mask-size 22px

    &:hover
      border-color: config.palette.primary

    &:before
      background-color: config.palette.borders
      mask-size 32px
      flex-basis 32px
      flex-shrink 0
      size 32px
      margin 0 0 8px

    button[data-dangerous]
      position absolute
</style>
