<template lang="pug">
time(
  :datetime=  "datetime"
  :data-icon=  "icon ? 'clock' : undefined"
) #[slot] {{ liveTime || timeFromNow() }}
</template>

<script>
import dayjs from 'dayjs'
import 'dayjs/locale/ro'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(relativeTime)

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
    dayjs.locale(this.$Lodger.locale)
    if (!this.liveUpdate) return

    if (this.ago) this.liveTime = this.timeFromNow()
    this.updater = () => {
      this.liveTime = this.timeFromNow()
    }

    setInterval(this.updater, 30000)
  },
  beforeDestroy () {
    clearInterval(this.updater)
  },
  methods: {
    timeFromNow () {
      return dayjs(this.unixTime).fromNow()
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
    },
    icon: {
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
  font-size 12px
  padding-left 0 !important
  white-space nowrap

  &:before
    background-color: tcolor !important
</style>
