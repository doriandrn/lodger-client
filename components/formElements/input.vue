<template lang="pug">
input(
  :type=            "type", 
  :id=              "id",
  :placeholder=     "placeholder",
  v-focus=          "focus",
  :autofocus=       "focus",
  :autocomplete=    "autocomplete ? 'on' : 'off'"
  :checked=         "type === 'checkbox' && value === true"
  @input=           "handleInput",
  @change=          "handleChange"
  :value=           "val",
  :min=             "type === 'number' ? min : null"
  :max=             "type === 'number' ? max : null"
  :step=            "type === 'number' ? step : null"
  v-on-clickaway=   "clickAway"
  @keyup.down=      "$emit('keyDown')"
  @keyup.up=        "$emit('keyUp')"
  @keydown.enter=     "debug('ENTER'); $emit('keyEnter', $event)"
  @keydown.esc=      "inchideModale; $emit('keyEscape', $event)"
)
</template>

<script>
import { get_bigrams, string_similarity } from 'helpers/search'
import { mixin as clickaway } from 'vue-clickaway'
import { mapActions, mapGetters } from 'vuex'

export default {
  directives: {
    focus: {
      inserted: (el) => {
        if (!this.focus) return
        setTimeout(() => { el.focus()}, 250)
      }
    }
  },
  mixins: [ clickaway ],
  props: {
    value: {
      type: [Boolean, String, Number, Object],
      default: null
    },
    autocomplete: {
      type: Boolean,
      default: true,
    },
    min: {
      type: Number,
      default: 1
    },
    max: {
      type: Number,
      default: null
    },
    name: {
      type: String,
      default: null
    },
    step: {
      type: Number,
      default: null
    },
    placeholder: {
      type: String,
      default: null
    },
    required: {
      type: Boolean,
      default: false
    },
    id: {
      type: String,
      default: 'UnIdNedefinit'
    },
    size: {
      type: String,
      default: null
    },
    type: {
      type: String,
      default: 'text'
    },
    error: {
      type: Boolean,
      default: false
    },
    focus: {
      type: Boolean,
      default: false
    },
    searchTaxonomy: {
      type: String,
      default: null
    },
    hasResults: {
      type: Boolean,
      default: false
    },
    selected: {
      type: Object,
      default () { return {
        proprietar: null
      }}
    }
  },
  mounted () {
    if (this.type !== 'search') return
  },
  computed: {
    val () {
      const { value, type, searchTaxonomy, selected } = this
      if (type !== 'search') return value

      if (searchTaxonomy === 'apartamente') return selected.proprietar
      if (searchTaxonomy === 'furnizori') return selected.nume
      return value
    },
    ...mapGetters({
      modalOpen: 'modal/open'
    })
  },
  methods: {
    clickAway () {
      const { type, hasResults } = this
      if (type !== 'search') return
      if (!hasResults) return

      this.$emit('clickAway')
    },
    inchideModale () {
      const { modalOpen, closeModal } = this
      if (modalOpen) closeModal()
    },
    handleInput (e) {
      let { value } = e.target
      const { type, search } = this

      if (value === undefined) value = null
      // if (type === 'checkbox') return !!value ->> checkbox e pe change
      if (type !== 'search') {
        this.$emit('input', type === 'number' ? Number(value) : value)
        return
      }
      else search(value)
    },
    handleChange (e) {
      if (this.type === 'search') return
      if (this.type === 'checkbox') {
        this.$emit('input', Boolean(!this.value))
        return
      }
      this.$emit('change', e.target.value)
    },
    search (input) {
      if (!input) return
      let { searchTaxonomy } = this
      const searchMap = this.$store.getters['searchMap']
      const results = {}

      Object.keys(searchMap).forEach(tax => {
        if (searchTaxonomy && searchTaxonomy !== tax) return
        const iterator = searchMap[tax].entries()
        results[tax] = []


        for (let [ key, value ] of iterator) {
          const relevance = string_similarity(String(input), value)
          results[tax].push({ id: key, relevance, value })
        }

        results[tax] = results[tax].sort((a, b) => a.relevance > b.relevance).reverse().slice(0, 6)
      })
      
      // on change, refresh teh status of the v-model item
      this.$emit('input', null)
      this.$emit('newResults', results)
    },
    ...mapActions({
      closeModal: 'modal/close'
    })
  }
}
</script>

<style lang="stylus">
@require '~styles/config'
palette = config.palette

input[type="text"]
input[type="search"]
input[type="number"]
input[type="password"]
input[type="date"]
textarea
  font-size 14px
  line-height 18px
  background-color transparent
  border 0
  min-width 32px
  border-bottom: 1px solid #c8c8c8
  // border-radius: config.radiuses.buttons
  // box-shadow inset 1px 2px 3px -1px rgba(black, .015) 
  transition all .15s ease-in-out
  // background: palette.bgs.body
  padding 8px 4px
  width 100%

  &::placeholder
    color: config.typography.palette.meta
    font-size 12px
    font-weight 100
    opacity 0
    transition opacity .1s ease
  
  &:focus
    border-color: palette.primary
    color: palette.primary

    &::placeholder
      opacity 1

    &+.field__label
      moveFieldLabel()

input:not([type="submit"])
  max-height 36px

.input
  &__optional
    margin-left 4px
    color: config.typography.palette.meta
    font-weight 100
</style>
