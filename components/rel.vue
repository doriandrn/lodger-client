<template lang="pug">
.rel(v-if="doc")
  a(
    v-if=     "disabled"
    @click=   "$l.modal.activeDoc = doc"
  ) {{ doc.name }}
</template>

<script>
export default {
  data () {
    return {
      doc: null
    }
  },
  async fetch () {
    this.doc = await this.$l[this.taxonomy].collection.findOne(this.value).exec()
  },
  props: {
    value: {
      type: String,
      required: true
    },
    taxonomy: {
      type: String,
      required: true
    },
    disabled: {
      type: Boolean,
      default: false
    }
  }
}
</script>
