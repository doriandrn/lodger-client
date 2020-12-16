<template lang="pug">
.avatar(:class="{ disabled }")
  img(:src="value || placeholder" @click="!disabled ? $el.children[1].click() : undefined")
  file(v-if=  "!disabled" :id="id")
  span.holder(v-if= "!disabled")
</template>

<script>
import Avatars from '@dicebear/avatars';
import sprites from '@dicebear/avatars-avataaars-sprites';
import file from 'c/formElements/file'

const avatars = new Avatars(sprites, {
  base64: true,
  style: 'transparent'
});

export default {
  computed: {
    placeholder () {
      return avatars.create(this.seed)
    }
  },
  watch: {
    placeholder: function (v) {
      if (!v.length || this.disabled)
        return
      this.$emit('input', v)
    }
  },
  props: {
    id: {
      type: String,
      default: 'avatar'
    },
    value: {
      type: String,
      default: null
    },
    seed: {
      type: String,
      default: 'noname'
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  components: {
    file
  }
}
</script>

<style lang="stylus">
.avatar
  position relative

  &:not(.disabled)
    cursor pointer

  img
    max-width 160px
    height auto
    min-width 32px
    min-height 32px

  input[type="file"]
    position absolute

    &+.holder
      display none
</style>
