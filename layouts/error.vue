<template lang="pug">
sction.eroare(:title="titluEroare")
  p {{ $t('erori.inContinuare') }}
</template>

<script>
import sction from '~components/section'

export default {
  props: ['error'],
  components: {
    sction
  },
  computed: {
    titluEroare () {
      const { $t, error: { statusCode } } = this
      return $t(`erori.${ statusCode }`)
    }
  }
}
</script>
