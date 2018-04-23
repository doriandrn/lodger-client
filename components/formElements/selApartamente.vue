<template lang="pug">
ul.selAp
  li(v-for="apId, index in idsAps") {{ apartamente[apId].proprietar }}
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  computed: mapGetters({
    apartamente: 'apartamente',
    idsAps: 'asociatie/apartamente'
  })
}
</script>
