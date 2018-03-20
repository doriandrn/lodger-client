<template lang="pug">
time(
  :datetime=  "datetime"
  data-icon=  "clock"
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

<style lang="stylus">
@require '~styles/config'
tcolor = config.typography.palette.meta

time
  display flex
  flex-flow row nowrap
  align-items center
  color: tcolor
  font-size 10px
  padding-left 0 !important

  &:before
    background-color: tcolor !important
</style>
