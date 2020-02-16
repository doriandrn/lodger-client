<template lang="pug">
time(
  :datetime=  "datetime"
  data-icon=  "clock"
) {{ liveTime || timeFromNow() }}
</template>

<script>
import moment from 'moment'

export default {
  data () {
    return {
      liveTime: null
    }
  },
  computed: {
    datetime () {
      return new Date(this.unixTime * 1000).toISOString()
    },
  },
  created () {
  	// moment.locale(this.$store.state.locale)
  },
  mounted () {
    if (!this.liveUpdate) return
    if (this.ago) this.liveTime = this.timeFromNow()

    setInterval(() => {
      this.liveTime = this.timeFromNow()
    }, 30000)
  },
  methods: {
    moment,
    timeFromNow () {
      return moment(this.unixTime).fromNow()
    }
  },
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
    },
    liveUpdate: {
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
  white-space nowrap

  &:before
    background-color: tcolor !important
</style>
