<template lang="pug">
sction#registru(
  :title=   "$t('registru.title')"
)
  tabs.registru
    tab(:title="$t('registru.incasari')")
      incasari

    tab(:title="$t('registru.cheltuieli')")
      p cheltuieli
</template>

<script>
import sction from '~components/section'
import incasari from '~components/incasari'
import { mapGetters } from 'vuex'

export default {
  components: {
    sction,
    incasari
  }
}
</script>

<style lang="stylus">
@require '~styles/config'
colors = config.palette

.registru
  .tab
    ul
      list-style-type none
      padding 0
      max-width 639px
      margin 0 auto

      li
        background white
        padding 20px

        &:not(:last-child)
          border-bottom: 1px solid colors.borders
</style>
