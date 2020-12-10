<template lang="pug">
div
  h4(v-if="!value") {{ $lodger.i18n.dropFiles }}
  ul(v-else)
    li(v-for="file in value") {{ file.name }}
</template>

<script>
import dragdrop from 'drag-drop'

export default {
  data () {
    return {
      status: null
    }
  },
  mounted () {
    dragdrop(this.$el, (files, pos, fileList, dirs) => {
      this.debug('FL', fileList)
    })
  },
  props: {
    value: {
      type: Array,
      default: null
    }
  }
}
</script>

<style lang="stylus">

</style>
