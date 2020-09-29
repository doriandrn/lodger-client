<template lang="pug">
a(v-if="doc" @click="$lodger.modal.activeDoc = doc") {{ doc.name }}
</template>

<script>
export default {
  data () {
    return {
      doc: null
    }
  },
  async fetch () {
    this.doc = await this.$lodger[this.taxonomy].collection.findOne(this.id).exec()
  },
  props: {
    id: {
      type: String,
      required: true
    },
    taxonomy: {
      type: String,
      required: true
    }
  }
}
</script>
