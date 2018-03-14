<template lang="pug">
inpt(:placeholder="$t('search')" no-label :label="$t('search')")
</template>

<script>
import inpt from 'form/input'

export default {
  components: {
    inpt
  }
}
</script>
