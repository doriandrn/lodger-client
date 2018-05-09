<template lang="pug">
sction.registru(
  :title=   "$t('registru.title')"
)
  split.registru__controale
    field(
      v-for=  "optiune in optiuni",
      :key=   "optiune",
      type=   "checkbox"
      :label= "$t(`registru.${optiune}`)"
      required= true
    )
    span(
      slot="right"
    ) timp / suma  sageata

  .registru__data
    incasari(:incasari="_incasari()")
    buton incarca mai multe

</template>

<script>
import sction from '~components/section'
import split from '~components/split'
import field from 'form/field'
import buton from 'form/button'
import incasari from '~components/incasari'
import { mapGetters } from 'vuex'

export default {
  data () {
    return {
      optiuni: ['incasari', 'cheltuieli']
    }
  },
  computed: {
    ...mapGetters({
      incasari: 'incasari'
    })
  },
  methods: {
    async _incasari () {
      const { $db, debug } = this
      const reslts = await $db.incasari.find({

      }).exec()
      debug(reslts)
      return reslts
    },
  },
  components: {
    sction,
    field,
    buton,
    split,
    incasari
  }
}
</script>

<style lang="stylus">
@require '~styles/config'
colors = config.palette

.registru
  width 100%

  &__controale
  &__data
    max-width 639px
    width 100%
    margin 0 auto
  
  &__controale
    flex 0 1 24px
    margin-bottom 16px

  &__data
    flex 1 1 100%

  ul
    list-style-type none
    padding 0
    

    li
      background white

      &:not(:last-child)
        border-bottom: 1px solid colors.borders
</style>
