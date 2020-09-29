<template lang="pug">
.frm(:fields="fields")
</template>

<script>
// import frm from 'c/form'

export default {
  data () {
    return { val: [] }
  },
  props: {
    fields: {
      type: Object,
      default: null
    },
  }
}
</script>
