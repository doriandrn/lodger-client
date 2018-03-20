<template lang="pug">
time(
  :datetime= "datetime"
) {{ moment(unixTime).fromNow() }}
</template>

<script>
import moment from 'moment'

export default {
  computed: {
    datetime () {
      return new Date(this.unixTime * 1000).toISOString()
    }
  },
  created () {
  	moment.locale(this.$store.state.locale)
  },
  methods: { moment },
  props: {
    unixTime: {
      type: Number,
      default: 1
    },
    ago: {
      type: Boolean,
      default: false
    },
    tooltip: {
      type: Boolean,
      default: false
    }
  }
}
</script>
