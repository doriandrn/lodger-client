<template lang="pug">
.rel(v-if="doc")
  a(
    v-if=     "disabled"
    @click=   "$lodger.modal.activeDoc = doc"
  ) {{ doc.name }}

  select(v-else)
    option pl
</template>

<script>
export default {
  data () {
    return {
      doc: null
    }
  },
  async fetch () {
    this.doc = await this.$lodger[this.taxonomy].collection.findOne(this.value).exec()
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
