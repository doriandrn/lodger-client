<template lang="pug">
sction(title="Liste")
  h2 Septembrie 2018
  p Listele de plată pentru luna în curs se vor genera în 6 zile
  typecheck
</template>

<script>
import sction from 'c/section'
import typecheck from 'pg/widgets/typography'

export default {
  components: {
    sction,
    typecheck
  }
}
</script>
