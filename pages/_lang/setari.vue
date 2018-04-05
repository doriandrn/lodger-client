<template lang="pug">
sction.setari(:title="$t('settings')")
  tabs
    tab(title="asoc") asoc
    tab(title="user") caca
</template>

<script>
import sction from '~components/section'

export default {
  components: {
    sction
  }
}
</script>
