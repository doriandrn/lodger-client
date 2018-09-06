<template lang="pug">
sction.eroare(
  :title="titluEroare"
  :data-cod=  "error.statusCode"
)
  span.eroare__il(slot="beforeTitle")
  p {{ $t('erori.inContinuare') }}
  .actiuni
    buton(
      size=   "small"
      @click= "openModal('feedback.new')"
    ) {{ $t('defaults.feedback') }}
</template>

<script>
import sction from 'c/section'
import buton from 'form/button'

import { mapActions } from 'vuex'

export default {
  props: ['error'],
  components: {
    sction,
    buton
  },
  methods: mapActions({
    openModal: 'modal/open'
  }),
  computed: {
    titluEroare () {
      const { $t, error: { statusCode } } = this
      return $t(`erori.${ statusCode }`)
    }
  }
}
</script>

<style lang="stylus">
.eroare
  &__il
    width 300px
    height 200px
    background embedurl('~static/ils/resursa-inaccesibila.png')
    background-repeat no-repeat
    background-size contain
    background-position 50% 50%
    position absolute
    z-index 0
    pointer-events none
    top 25%

  > .inner > *:not(.eroare__il)
    position relative
    z-index 1

</style>
