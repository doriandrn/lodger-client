<template lang="pug">
sction#registru(
  :title=   "$t('registru.title')"
)
  tabs.registru
    tab(:title="$t('registru.incasari')")
      incasari(:incasari="incasari")

    tab(:title="$t('registru.cheltuieli')")
      p cheltuieli
</template>

<script>
import sction from '~components/section'
import incasari from '~components/incasari'
import { mapGetters } from 'vuex'

export default {
  computed: mapGetters({
    incasari: 'incasari'
  }),
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
  width 100%
  .tab
    ul
      list-style-type none
      padding 0
      max-width 639px
      width 100%
      flex 1 1 100%
      margin 0 auto

      li
        background white

        &:not(:last-child)
          border-bottom: 1px solid colors.borders
</style>
